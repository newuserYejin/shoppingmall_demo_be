const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const authController = {}


authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body
        let loginUser = await User.findOne({ email })
        if (loginUser) {
            const isMatch = await bcrypt.compare(password, loginUser.password)
            if (isMatch) {
                //token 발행
                const token = await loginUser.generateToken()
                return res.status(200).json({ status: "login success", loginUser, token })
            }
        }
        throw new Error("invalid email or password")

    } catch (error) {
        res.status(400).json({ status: "login fail", error: error.message })
    }
}

authController.authenticate = (req, res, next) => {
    try {
        const tokenString = req.headers.authorization
        if (!tokenString) throw new Error("Token not found from headers")
        const token = tokenString.replace("Bearer ", "")
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) throw new Error("Token is not valid")
            req.userId = payload._id
            next();
        })

    } catch (error) {
        res.status(400).json({ status: "get tokenString fail", error: error.message })
    }
}

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)
        if (user.level !== 'admin') { throw new Error("no permission") }
        next()
    } catch (e) {
        res.status(400).json({ status: "permission fail", error: e.message })
    }
}

authController.loginWithGoogle = async (req, res) => {
    // 4. 백엔드에서 로그인 하기 => 토큰 값 가져와서 유저 정보 빼내기
    // a. 이미 로그인을 한 적이 있는 유저 => 로그인 시키고 토큰 값 주기
    // b. 처음 로그인 시도한 유저 => 유저 정보 먼저 새로 생성 => 토큰 값
    try {
        const { token } = req.body
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        })

        const { email, name } = ticket.getPayload()
        console.log("token email:", email, "token name:", name)

        let user = await User.findOne({ email })

        console.log("login with google user", user)
        if (!user) {
            const randomPassword = "" + Math.floor(Math.random() * 100000000)
            console.log("randomPassword", typeof randomPassword)
            const salt = await bcrypt.genSalt(10)
            const newPassWord = await bcrypt.hash(randomPassword, salt)
            console.log("newPassWord", newPassWord)
            user = new User({
                name,
                email,
                password: newPassWord,
            })
            await user.save()
        }
        // 토큰 발행
        const sessionToken = await user.generateToken()
        return res.status(200).json({ status: "login with google success", loginUser: user, token: sessionToken })
    } catch (error) {
        res.status(400).json({ status: "login with google fail", error: error.message })
    }
}

module.exports = authController
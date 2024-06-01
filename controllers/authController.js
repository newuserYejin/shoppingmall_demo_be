const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

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

module.exports = authController
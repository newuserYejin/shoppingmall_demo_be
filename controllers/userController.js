const User = require('../models/User')
const bcrypt = require('bcryptjs')

const userController = {}

userController.createUser = async (req, res) => {
    try {
        let { email, name, password, level } = req.body
        const existUser = await User.findOne({ email })          // 전달 받은 이메일로 기존 가입이 있는지 확인하기
        if (existUser) {
            throw new Error("user email already exist")
        }

        const salt = await bcrypt.genSaltSync(10)
        password = await bcrypt.hash(password, salt)            // 암호화된 password로 재정의
        const newUser = new User({ email, password, name, level: level ? level : 'customer' })
        await newUser.save()
        return res.status(200).json("createUser success")

    } catch (error) {
        res.status(400).json({ status: "createUser fail", error: error.message })
    }
}

module.exports = userController


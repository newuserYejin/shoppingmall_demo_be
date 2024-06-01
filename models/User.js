const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true            // 이메일은 유니크해야한다
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "customer"              // 2types : customer, admin
    }
}, { timestamps: true })

userSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.password
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

userSchema.methods.generateToken = async function () {
    const token = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: "1d" })         // 생성 뒤 하루지나면 만료
    return token
}

const User = mongoose.model("User", userSchema)
module.exports = User


const mongoose = require('mongoose')
const Schema = mongoose.Schema
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

const User = mongoose.model("User", userSchema)
module.exports = User


const mongoose = require('mongoose')
const User = require('./User')
const Product = require('./Product')
const Schema = mongoose.Schema

const orderSchema = Schema({
    userId: { type: mongoose.ObjectId, ref: User },
    status: { type: String, default: "preparing" },
    totalPrice: { type: Number, default: 0, required: true },
    shipTo: { type: Object, required: true },       // 배송 주소
    contact: { type: Object, required: true },      // 성, 이름, 연락처
    oderNum: { type: String },                      // 주문번호
    items: [{
        productId: { type: mongoose.ObjectId, ref: Product },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
        size: { type: String, required: true }
    }]
}, { timestamps: true })

orderSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

const Order = mongoose.model("Order", orderSchema)
module.exports = Order


const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = Schema({
    sku: {                  // 제품 id
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category: {
        type: Array,             // 남성과 바지에 동시에 속할 수 있기 때문에 array형태
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" },
    isDelete: { type: Boolean, default: false }
}, { timestamps: true })

productSchema.methods.toJSON = function () {
    const obj = this._doc
    delete obj.__v
    delete obj.updateAt
    delete obj.createAt
    return obj
}

const Product = mongoose.model("Product", productSchema)
module.exports = Product


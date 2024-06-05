const Product = require("../models/Product")


const productController = {}

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, category, description, price, stock, status } = req.body
        const product = new Product({ sku, name, size, image, category, description, price, stock, status })
        await product.save()
        res.status(200).json({ status: "item save success", product: product })
    } catch (e) {
        res.status(400).json({ status: "item save fail", error: e.message })
    }
}

productController.getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json({ status: "get product success", data: products })

    } catch (error) {
        res.status(400).json({ status: "item save fail", error: e.message })
    }
}

module.exports = productController
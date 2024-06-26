const express = require('express')
const router = express.Router()
const userApi = require("./user_api")
const authApi = require('./auth_api')
const productApi = require('./product_api')
const cartApi = require('./cart_api')
const orderApi = require('./order_api')

router.use("/user", userApi)
router.use("/auth", authApi)
router.use("/product", productApi)
router.use("/cart", cartApi)
router.use("/order", orderApi)

module.exports = router
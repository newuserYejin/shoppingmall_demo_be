const express = require('express')
const router = express.Router()
const userApi = require("./user_api")
const authApi = require('./auth_api')
const productApi = require('./product_api')

router.use("/user", userApi)
router.use("/auth", authApi)
router.use("/product", productApi)


module.exports = router
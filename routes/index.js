const express = require('express')
const router = express.Router()
const userApi = require("./user_api")
const authApi = require('./auth_api')

router.use("/user", userApi)
router.use("/auth", authApi)


module.exports = router
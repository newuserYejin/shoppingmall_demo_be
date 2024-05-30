const express = require('express')
const router = express.Router()
const userApi = require("./user_api")

router.use("/user", userApi)


module.exports = router
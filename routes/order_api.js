const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

router.post('/', authController.authenticate, orderController.createOrder)

module.exports = router

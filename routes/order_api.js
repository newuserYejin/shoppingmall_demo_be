const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const orderController = require('../controllers/orderController')

router.post('/', authController.authenticate, orderController.createOrder)
router.get('/my', authController.authenticate, orderController.getOrder)
router.get('/', authController.authenticate, orderController.getOrderList)
router.put('/:id', authController.authenticate, orderController.updateOrder)

module.exports = router

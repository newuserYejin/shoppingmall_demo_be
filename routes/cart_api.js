const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const cartController = require('../controllers/cartController')

router.post("/", authController.authenticate, cartController.addItemToCart)
router.get("/", authController.authenticate, cartController.getCartList)
router.delete("/:id", authController.authenticate, cartController.deleteCartProduct)

router.put("/:id", authController.authenticate, cartController.updateCartItemQty)

router.get("/qty", authController.authenticate, cartController.getTotalQty)

module.exports = router
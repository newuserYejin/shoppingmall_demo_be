const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/', authController.authenticate, authController.checkAdminPermission, productController.createProduct)
// token 으로부터 userId를 받아올 수 있는 미들웨어, admin권한이 있는지 확인하는 미들웨어 설정

module.exports = router
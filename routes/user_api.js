const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const router = express.Router()

//회원가입
router.post("/", userController.createUser)
// token 값은 body가 아닌 header에 들어가기 때문에 post가 아니여도 된다.
router.get('/me', authController.authenticate, userController.getUser)        // 1. 유효한 token인지 확인, 2. token을 가지고 user를 찾아서 return

module.exports = router
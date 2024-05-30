const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

//회원가입
router.post("/", userController.createUser)

module.exports = router
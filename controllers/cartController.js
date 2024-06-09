const mongoose = require("mongoose");  // mongoose 모듈을 임포트
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Cart = require("../models/Cart")
require('dotenv').config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const cartController = {}

cartController.addItemToCart = async (req, res) => {
    try {
        const { userId } = req
        const { productId, selectSize, qty } = req.body

        // user를 가지고 카트 찾기
        let cart = await Cart.findOne(({ userId }))

        if (!cart) {
            // user 카트가 없으면 새로운 카트 만들어주기
            cart = new Cart({ userId })
            await cart.save()
        }

        // 카트에 이미 있는 아이템인지 확인 productId, selectSize
        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.selectSize === selectSize
        )
        // => 그렇다면 error(이미 카트에 있음)
        if (existItem) throw new Error("Item is already in cart")
        // 아니면 카트에 아이템 추가
        cart.items = [...cart.items, { productId, selectSize, qty }]
        await cart.save()
        res.status(200).json({ status: "success", data: cart, cartItemQty: cart.items.length })
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message })
    }
}

cartController.getCartList = async (req, res) => {
    try {
        const { userId } = req

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items',
            populate: {
                path: "productId",
                model: "Product"            // populate는 연관된 정보를 가져온다(외래키의 정보), path는 따라갈 경로 지정
            }
        })
        res.status(200).json({ status: "success", data: cart.items })

    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message })
    }
}

cartController.deleteCartProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req
        const cart = await Cart.findOne({ userId })
        console.log("before cart:", cart)

        // const productIdToDelete = mongoose.ObjectId(id);
        cart.items = cart.items.filter((item) => !item._id.equals(id))

        await cart.save()
        console.log("update cart:", cart)

        res.status(200).json({ status: 200, cartItemQty: cart.items.length })
    } catch (error) {
        res.status(400).json({ status: 400, error: error.message })
    }
}

cartController.updateCartItemQty = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req
        const { qty } = req.body

        const cart = await Cart.findOne({ userId }).populate({
            path: 'items',
            populate: {
                path: "productId",
                model: "Product"
            }
        })

        if (!cart) throw new Error("There is no cart for you")

        const selectItemIndex = cart.items.findIndex((item) => item._id.equals(id))
        console.log("selectItemIndex:", selectItemIndex)
        if (selectItemIndex === -1) throw new Error("Can not find item")

        cart.items[selectItemIndex].qty = qty
        await cart.save()

        res.status(200).json({ status: 200, data: cart.items })
    } catch (error) {
        res.status(400).json({ status: 400, error: error.message })
    }
}

cartController.getTotalQty = async (req, res) => {
    try {
        const { userId } = req
        const cart = await Cart.findOne({ userId })
        if (!cart) throw new Error("There is no cart for you")
        res.status(200).json({ status: 200, qty: cart.items.length })
    } catch (error) {
        res.status(400).json({ status: 400, error: error.message })
    }
}


module.exports = cartController
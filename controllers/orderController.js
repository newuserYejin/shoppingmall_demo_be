const Order = require("../models/Order")
const productController = require("./productController")
const { randomStringGenerator } = require('../utils/randomString')
const { populate } = require("dotenv")
const { model } = require("mongoose")
const PAGE_SIZE = 4

const orderController = {}

orderController.createOrder = async (req, res) => {
    try {
        // fe에서 데이터 보낸거 받기 
        const { userId } = req
        const { totalPrice, shipTo, contact, orderList } = req.body

        // 재고 확인 & 재고 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList)


        // 재고 부족 => error
        // 재고 충분함 -> order 생성

        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, "")
            throw new Error(errorMessage)
        }

        // order 생성
        const orderNum = randomStringGenerator();
        console.log("Generated orderNum:", orderNum);

        // order 생성
        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomStringGenerator()
        })

        await newOrder.save()
        // save 후에 카트 비우기
        console.log("backend orderNum:", newOrder.orderNum)
        console.log("backend newOrder:", newOrder)
        res.status(200).json({ status: 'success', orderNum: newOrder.orderNum })

    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message })
    }
}

orderController.getOrder = async (req, res) => {
    try {
        const { userId } = req

        const orderList = await Order.find({ userId }).populate({
            path: 'items',
            populate: {
                path: "productId",
                model: "Product"
            }
        })

        res.status(200).json({ status: "success", data: orderList })
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message })
    }
}

orderController.getOrderList = async (req, res) => {
    try {

        const { page, ordernum } = req.query

        console.log(ordernum)

        const code = ordernum ? { orderNum: { $regex: ordernum, $options: "i" } } : {}

        const orderList = await Order.find(code)
            .populate({
                path: 'userId',
                model: "User"
            })
            .populate({
                path: 'items',
                populate: {
                    path: "productId",
                    model: "Product"
                }
            })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)

        const totalItemNum = await Order.find(code).count()       // 총 몇개 인지 숫자만 받기 위해 count사용
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE)


        console.log("By orderNum orderList", orderList)

        res.status(200).json({ status: "success", data: orderList, totalPageNum })
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message })
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const { status } = req.body

        console.log("orderId", orderId, "status", status)

        const order = await Order.findByIdAndUpdate(
            { _id: orderId },
            { status },
            { new: true }
        )
        if (!order) throw new Error("order is not exist")
        res.status(200).json({ status: "success", data: order })
    } catch {
        res.status(400).json({ status: "item save fail", error: error.message })
    }
}


module.exports = orderController


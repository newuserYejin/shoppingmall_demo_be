const Order = require("../models/Order")
const productController = require("./productController")
const { randomString } = require('../utils/randomString')

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
        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomString()
        })

        await newOrder.save()
        res.status(200).json({ status: 'success', orderNum: newOrder.orderNum })

    } catch (error) {
        return res.status(400).json({ status: 'fail', error: error.message })
    }
}


module.exports = orderController


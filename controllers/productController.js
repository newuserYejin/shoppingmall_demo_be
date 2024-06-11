const Product = require("../models/Product")
const PAGE_SIZE = 5

const productController = {}

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, size, image, category, description, price, stock, status } = req.body
        const product = new Product({ sku, name, size, image, category, description, price, stock, status })
        await product.save()
        res.status(200).json({ status: "item save success", product: product })
    } catch (e) {
        res.status(400).json({ status: "item save fail", error: e.message })
    }
}

productController.getProducts = async (req, res) => {
    try {
        const { page, name } = req.query

        const cond = name ? { name: { $regex: name, $options: "i" }, isDelete: false } : { isDelete: false }
        let query = Product.find(cond)
        let response = { status: "success" }


        // 단순한 방식
        // if (name) {
        //     const products = await Product.find({ name: { $regex: name, $options: "i" } })          // regex는 딱 그 name만이 아닌 name을 포함 한것도 검색되도록 한다. 여기에서의 option은 대소문자 구분 없이 검색하겠다.
        // } else {
        //     const products = await Product.find({})
        // }

        // 페이지네이션
        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE)       // 최대 5개의 데이터씩 보내겠다. (보여줄 때 앞 페이지 데이터들은 건너뛰고 보여주기 위해서 skip 사용)
            // 최종 몇개의 페이지 인지
            // 데이터 총 개수/ 페이지 크기
            const totalItemNum = await Product.find(cond).count()       // 총 몇개 인지 숫자만 받기 위해 count사용
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE)
            response.totalPageNum = totalPageNum
        }

        const productList = await query.exec()      // 선언과 실행 따로
        response.data = productList
        res.status(200).json(response)

    } catch (error) {
        res.status(400).json({ status: "item save fail", error: e.message })
    }
}

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id              // 수정할 product id 받아오기
        const { sku, name, size, image, price, description, category, stock, status } = req.body
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { sku, name, size, image, price, description, category, stock, status },
            { new: true })              // new:true는 update의 옵션 값 중 하나로 true로 해두면 업데이트 후의 값을 받아올 수 있다.

        if (!product) throw new Error("item doesn't exist")
        res.status(200).json({ status: "success", data: product })
    } catch (error) {
        res.status(400).json({ status: "item save fail", error: error.message })
    }
}

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id              // 수정할 product id 받아오기
        const product = await Product.findByIdAndUpdate({ _id: productId }, { isDelete: true })
        if (!product) throw new Error("item doesn't exist")
        res.status(200).json({ status: "is delete success", data: product })
    } catch (error) {
        res.status(400).json({ status: "is delete fail", error: error.message })
    }
}

productController.getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)
        if (!product) throw new Error("id match item don't find")
        res.status(200).json({ status: "find item success", data: product })
    } catch (error) {
        res.status(400).json({ status: "find item fail", error: error.message })
    }
}

productController.checkStock = async (item) => {
    // 내가 사려는 아이템 재고 정보 가져오기
    const product = await Product.findById(item.productId)
    // 내가사려는 qty와 재고 비교
    // console.log(product.name, "&&&&", item.size.toUpperCase(), item.qty)

    if (product.stock[item.size] < item.qty) {
        // 재고 부족하면 불충분 메세지와 반응
        return { isVerify: false, message: `${product.name}의 ${item.size.toUpperCase()}의 재고가 부족합니다.` }
    }
    // 충분하면 재고에서 qty빼고 성공 메세지 출력
    const newStock = { ...product.stock }
    newStock[item.size] -= item.qty
    product.stock = newStock

    await product.save()
    return { isVerify: true }
}

productController.checkItemListStock = async (itemList) => {
    const insufficientStockItems = []
    // 비동기 한번에 빠르게 처리 Promise.all
    await Promise.all(
        itemList.map(async (item) => {
            const stockCheck = await productController.checkStock(item)
            if (!stockCheck.isVerify) {
                insufficientStockItems.push({ item, message: stockCheck.message })
            }
            return stockCheck
        })

    )

    return insufficientStockItems
}

module.exports = productController
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./routes/index')
const app = express()

require('dotenv').config()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))     // json말고 다른 형태의 문서를 취급하기 위해 추가
app.use(bodyParser.json())      // 이게 있어야 req.body가 객체로 인식된다.

app.use('/api', indexRouter)

const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log("DB connection fail", err))

app.listen(process.env.PORT || 5000, () => {
    console.log("server on")
})


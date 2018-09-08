//连接数据库 导出db schema

const mongoose = require("mongoose")
const db = mongoose/createConnection("mongodb://localhost:27017/blogproject",{useNewUrlParser:true})

//用原生es6 的promise代替mongoose自实现promise
mongoose.Peomise = global.Promise


//吧mongoose的schema取出来

const Schema = mongoose.Schema

db.on("error",()=>{
    console.log("数据库连接失败")
})
db.on ("open",()=>{
    console.log("blogproject 数据库连接成功啊")
})
module.exports = {
    db,
    Schema
}




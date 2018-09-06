const Koa  = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/route')
const logger = require('koa-logger')
const body = require('koa-body')
const { join } = require('path')
const session = require('koa-session')

//生成koa实例
const app = new Koa

app.keys = ['我是一个大帅哥']

//session的配置对象


//注册日志模块

//注册session

//配置koa-body处理post请求数据
app.use(body())


//配置静态资源目录
app.use(static(join(__dirname,'public')))

//配置视图模板
app.use(views(join(__dirname,'views'),{
    extension:'pug'
}))
//注册路由信息
app.use(router.routes()).use(router.allowedMethods())
//监听端口
app.listen(3000,()=>{
    console.log('项目启动成功3000端口')
})

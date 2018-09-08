# nodejs
简易博客 

**有序列表**

1.在config.js中引入db和Schema并导出
2.在router.js中配置reg注册按钮的post请求，设置user.reg参数，在头部引入user,user来自control下user.js;
3.control下user.js中引入数据库db和数据格式schema用来规范请求数据的格式，引入加密模块encrypt；
4.通过 db 对象创建操作user数据库的模型对象：const User = db.model("users", UserSchema)

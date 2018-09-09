const Router = require('koa-router')

//拿到操作user 表的逻辑对象
const user = require('../control/user')
const article = require('../control/article')
const router = new Router

router.get('/', user.keepLog, async (ctx)=>{
    await ctx.render('index',{
        title:"这是自定义的title传入首页pug",
        session:ctx.session
    })
})
//动态路由
// router.get('/user/:id' , async (ctx) =>{
//     ctx.body = ctx.params.id

// })
router.get(/^\/user\/(?=reg|login)/, async (ctx)=>{
    const show = /reg$/.test(ctx.path)
    await ctx.render('register',{show})
})


router.post('/user/reg' , user.reg)
router.post('/user/login' , user.login)
router.get('/user/logout' , user.logout)
//文章发表页面
router.get('/article' ,user.keepLog, article.addPage )
router.post('/article',user.keepLog , article.add)
module.exports = router
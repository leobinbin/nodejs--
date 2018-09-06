const Router = require('koa-router')



const router = new Router

router.get('/',async (ctx)=>{
    await ctx.render('index',{
        title:"这是自定义的title传入首页pug"
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

module.exports = router
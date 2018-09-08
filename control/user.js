const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

//通过db对象创建操作user数据库的模型对象

const User = db.model('users',UserSchema)
//用户注册
exports.reg = async (ctx) => {
    //用户注册时post发过来的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    console.log(user)
    //注册时应该干嘛 以下操作假设格式符合
    //1去数据库user先查询当前发过来的username是否存在
    await new Promise((resolve,reject)=>{
        //去users数据库查询
        User.find({username},(err,data)=>{
            if(err)return reject(err)
            //去数据库查询没出错？ 还有可能没数据
            if(data.length !== 0){
                //查询到数据 --》用户名已存在
                return resolve("")
            }
            //用户不存在 需要存到数据库
            //保存到数据库之前先加密
            const _user = new User({
                username,
                password: encrypt(password),
                commentNum : 0,
                articalNum: 0
            })
            _user.save((err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    })
    .then(async data => {
        if(data){
            //注册成功
            await ctx.render('isOK',{
                status:'注册成功'
            })
        }else{
            //用户名已存在
            await ctx.render('isOK',{
                status: '用户名已存在'
            })
        }
    })
    .catch(async err => {
        await ctx.render('isOK',{
            status: '注册失败，请重试'
        })
    })

}

exports.login = async (ctx) => {
    //拿到post数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    await new Promise((resolve,reject)=>{
        User.find({username},(err,data)=>{
            if(err)return reject(err)
            if(data.length === 0)return reject('用户名不存在')
            //把用户传过来的密码进行加密比对
            if(data[0].password === encrypt(password)){
                return resolve(data)
            }
            resolve('')

        })
    })
    .then(async data => {
        if(!data){
            return ctx.render('isOK',{
                status : '密码不正确，登录失败'
            })
        }
        //让用户在他的cookie里设置username password 加密后 权限 

        ctx.cookies.set('username',username,{
            domain:'localhost',//主机名 
            path:'/',// 希望在访问哪个页面时被带过来
            maxAge: 36e5,
            httpOnly: true, //不让客户端访问这个cookie
            overwrite: false, //不能被覆盖
            //signed :true //是否签名,默认为true
        })
        ctx.cookies.set('uid',data[0]._id,{
            domain:'localhost',//主机名 
            path:'/',// 希望在访问哪个页面时被带过来
            maxAge: 36e5,
            httpOnly: false, //不让客户端访问这个cookie
            overwrite: false, //不能被覆盖
            //signed :true //是否签名默认为true
        })

        ctx.session = {
            username,
            uid : data[0]._id
        }



        await ctx.render('isOK',{
            status : '登录成功'
        })
    })
    .catch(async err => {
        await ctx.render('isOK',{
            status : '登录失败'
        })
    })
}
//确定用户状态 保持用户状态
exports.keepLog = async (ctx,next) => {
    if(ctx.session.isNew){//session没有
        if(ctx.cookies.get('username')){
            ctx.session = {
                username : ctx.cookies.get('username'),
                uid : ctx.cookies.get('uid')
            }
        }
    }
    await next()
}

//用户退出中间件
exports.logout = async ctx => {
    ctx.session = null
    ctx.cookies.set('username',null,{
        maxAge :0
    })
    ctx.cookies.set('uid',null ,{
        maxAge :0
    })
    //在后台做重定向
    ctx.redirect('/')
}
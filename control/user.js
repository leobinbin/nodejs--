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
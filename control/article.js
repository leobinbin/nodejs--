const { db } = require('../Schema/config')

//通过db对象创建操作artical数据库的模型对象
const ArticleSchema = require('../Schema/article')
const Article = db.model('article',ArticleSchema)
//去用户的schema，为了拿到操作users集合的实例对象
const UserSchema = require('../Schema/user')
const User = db.model("users", UserSchema)

exports.addPage = async (ctx) => {
    await ctx.render('add-article' , {
        title : '文章发表页',
        session : ctx.session
    })
}
exports.add = async (ctx) => {
    if(ctx.session.isNew){
        //true就是没登录 就不需要查询数据库
        return ctx.body = {
            msg : '用户未登录',
            status : 0
        }
    }
    //用户登录的情况
    //这是登录时的post数据
    const data = ctx.request.body
    //添加文章作者
    data.author = ctx.session.uid
    data.commentNum = 0

    await new Promise ((resolve,reject) => {
        new Article(data).save((err,data) => {
            if(err)return reject(err)
            //更新用户文章计数
            User.update({_id: data.author},{$inc:{articleNum:1}}, err => {
                if(err)return console.log(err)
                console.log("文章保存成功")
            })
            console.log(data.author)
            resolve(data)
        })
    })
    .then(data => {
        ctx.body = {
            msg:'发表成功',
            status:1
        }
    })
    .catch(err => {
        ctx.body = {
            msg : '发表失败',
            status : 0
        }
    })
}
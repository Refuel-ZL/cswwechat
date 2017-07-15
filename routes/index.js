var wechat = require('../wechat/g')
var Wechat = require('../wechat/wechat');
const router = require('koa-router')()
var config = require("../config");
var reply = require("../wx/reply");

var wechatApi = new Wechat(config.wechat);
router.get('/', async(ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.all('/wx', wechat(config.wechat, reply.reply))

router.get('/json', async(ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

router.post('/loadMenu', async(ctx, next) => {
    var reply = '';
    try {
        var del = await wechatApi.deleteMenu();
        if (del.errmsg = 'ok') {
            del = await wechatApi.createMenu(ctx.request.body.text);
            if (del.errmsg === 'ok') {
                reply = '重置菜单成功'
            } else {
                reply = '写入失败：' + del
            }
        } else {
            reply = '重置失败' + del
        }

    } catch (error) {
        reply = '重置失败'
        console.log(error)
    }
    ctx.body = reply;
})
module.exports = router
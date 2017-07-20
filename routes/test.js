const router = require('koa-router')()
var Wechat = require('../wechat/wechat');
var config = require('../config');
var request = require("request")
var cswapi = require("../csw/csw");

router.prefix('/test')

var wechatApi = new Wechat(config.wechat);

router.get('/getmold/:val', async function(ctx, next) { //获取素材列表
    // ctx.body = 'this is a users response!'
    var val = ctx.params.val
    var form = {
        "type": val,
        "offset": 0,
        "count": 20
    }
    ctx.body = await wechatApi.batchMaterial(form);

})

router.get('/clear', async function(ctx, next) { //清零api调用次数 

    var data = await wechatApi.fetchAccessToken();
    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/clear_quota?access_token=' + data.access_token,
        method: 'POST',
        JSON: true,
        body: JSON.stringify({
            appid: config.wechat.appID
        })
    }
    var reply = ''
    await request(options, (err, res, body) => {
        if (err) {
            reply = err;
            return;
        }
        reply = body;
    })
    console.log(reply)
    ctx.body = "reply";

})

router.get('/getcount', async function(ctx, next) {
    ctx.body = await wechatApi.countMaterial();
})

router.get("/sendAll", async function(ctx, next) {
    var tag_id = 100
    var val = {
        // type: "image",
        // media_id: "e-kE-1ewjSyqA-TY46BTLnMkDBEdrWZUtP1UkZpD9Jg"
        type: "text",
        content: '群发测试文本11111',
    }
    ctx.body = await wechatApi.sendAll(tag_id, val);
})

router.get("/getstatus/:id", async(ctx, next) => {
    ctx.body = await wechatApi.getSendStatus(ctx.params.id)
})

router.get("/aaaa", async(ctx, next) => {
    ctx.body = await cswapi.setvarvalue();
})


module.exports = router
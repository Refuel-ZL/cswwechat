"use strict"
const router = require("koa-router")()
var Wechat = require("../wechat/wechat")
var config = require("../config/config")
router.prefix("/users")

var wechatApi = new Wechat(config.wechat)

router.get("/", async function(ctx, next) {
    // ctx.body = "this is a users response!"
    ctx.body = await wechatApi.getUsers()
    await next()
})


router.get("/fetch/:id", async function(ctx, next) {
    ctx.body = await wechatApi.fetchUserTag(ctx.params.id)
    await next()
})

router.get("/settag/:openid", async function(ctx, next) {
    var openidlist = [ctx.params.openid]
    ctx.body = await wechatApi.taggingUsersTag(100, openidlist)

    await next()
})
router.get("/untag/:openid", async function(ctx, next) {
    var openidlist = [ctx.params.openid]
    ctx.body = await wechatApi.untaggingUsersTag(100, openidlist)

    await next()
})

module.exports = router
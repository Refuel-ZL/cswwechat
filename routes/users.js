const router = require('koa-router')()
var Wechat = require('../wechat/wechat');
var config = require('../config');
router.prefix('/users')

var wechatApi = new Wechat(config.wechat);

router.get('/', async function(ctx, next) {
    // ctx.body = 'this is a users response!'
    ctx.body = await wechatApi.getUsers();

})


router.get('/fetch/:id', async function(ctx, next) {
    ctx.body = await wechatApi.fetchUserTag(ctx.params.id);
})

router.get("/settag/:openid", async function(ctx, next) {
    var openidlist = [ctx.params.openid]
    ctx.body = await wechatApi.taggingUsersTag(100, openidlist);

})
router.get("/untag/:openid", async function(ctx, next) {
    var openidlist = [ctx.params.openid]
    ctx.body = await wechatApi.untaggingUsersTag(100, openidlist);

})

module.exports = router
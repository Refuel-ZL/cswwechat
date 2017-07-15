const router = require('koa-router')()
var Wechat = require('../wechat/wechat');
var config = require('../config');
router.prefix('/tags')

var wechatApi = new Wechat(config.wechat);
router.get('/', async function(ctx, next) {
    // ctx.body = 'this is a users response!'
    ctx.body = await wechatApi.getTags();

})
router.get('/:id', async function(ctx, next) {
    ctx.body = await wechatApi.fetchUserTag(ctx.params.id);
})
module.exports = router
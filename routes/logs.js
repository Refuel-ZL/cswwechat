const router = require('koa-router')()
var Wechat = require('../wechat/wechat');
var config = require('../config');
var csw = require('../libs/csw');
var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Shanghai");
router.prefix('/logs')

var wechatApi = new Wechat(config.wechat);

router.get('/', async(ctx, next) => {
    var from = moment().format("YYYYMMDD");
    var end = moment().add(1, 'days').format("YYYYMMDD");
    lists = await csw.getalarmlog(from, end, 1, 1000);
    await ctx.render('logs', {
        title: '今日告警',
        logs: lists
    })


})

// router.get('/:id', async function(ctx, next) {
//     ctx.body = await wechatApi.fetchUserTag(ctx.params.id);
// })
module.exports = router
const router = require('koa-router')()
var Wechat = require('../wechat/wechat');
var config = require('../config');
var csw = require('../libs/csw');
router.prefix('/logs')

var wechatApi = new Wechat(config.wechat);

router.get('/', async(ctx, next) => {
    var from = GetDateStr(0);
    var end = GetDateStr(1);
    lists = await csw.getalarmlog(from, end, 1, 1000);
    await ctx.render('logs', {
        title: '今日告警',
        logs: lists
    })


})

// router.get('/:id', async function(ctx, next) {
//     ctx.body = await wechatApi.fetchUserTag(ctx.params.id);
// })

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期 
    var d = dd.getDate();
    m = m > 9 ? m : ('0' + m);
    d = d > 9 ? d : ('0' + d)
    return y + "" + m + "" + d;
}
module.exports = router
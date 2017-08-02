"use strict"
var wechatg = require("../wechat/g")
var Wechat = require("../wechat/wechat")
const router = require("koa-router")()
var config = require("../config")
var reply = require("../wx/reply")
var rule = require("../csw/rule")
var moment = require("moment-timezone")
const logUtil = require("../utils/log4js/log_utils")


moment.tz.setDefault("Asia/Shanghai")
var wechatApi = new Wechat(config.wechat)
router.get("/", async(ctx, next) => {
    await ctx.render("index", {
        title: "Hello Koa 2!"
    })
    await next()
})

router.all("/wx", wechatg(config.wechat, reply.reply))

router.get("/json", async(ctx, next) => {
    ctx.body = {
        title: "koa2 json"
    }
    await next()

})

router.post("/loadMenu", async(ctx, next) => {
    var reply = ""
    try {
        var del = await wechatApi.deleteMenu()
        if (del.errmsg === "ok") {
            del = await wechatApi.createMenu(ctx.request.body.text)
            if (del.errmsg === "ok") {
                reply = "重置菜单成功"
            } else {
                reply = "写入失败：" + del
            }
        } else {
            reply = "重置失败" + del
        }

    } catch (error) {
        reply = "重置失败" + JSON.stringify(error)
    }
    ctx.body = reply
    await next()
})

/**开放群发接口
 * 
 */
router.all("/sendtextall", async function(ctx, next) {
    var tagid = ctx.request.body.tagid || ctx.query.tagid
    var val = {
        type: "text",
        content: ctx.request.body.content || ctx.query.content,
    }
    ctx.body = await wechatApi.sendAll(val, tagid)
    await next()

})

router.all("/sendtemplate", async(ctx, next) => {
    try {
        var body = ""
        var parameter = ctx.query.msg || ctx.request.body.msg
        logUtil.writeInfo("接收到模板信息" + parameter)
        parameter = JSON.parse(parameter)
        var template_id = rule.SmsTemplate[parameter.type].template
        var SmsTemplate = rule.SmsTemplate[parameter.type].group
        if (template_id && SmsTemplate) {
            for (var index = 0; index < SmsTemplate.length; index++) {
                var data_ = {
                    "touser": SmsTemplate[index],
                    "template_id": template_id,
                    "data": {
                        "text": {
                            "value": parameter.content
                        }
                    }
                }
                body += JSON.stringify(await wechatApi.Sendtemplate(data_))
            }
            logUtil.writeInfo("发送模板信息结果：" + body)
            ctx.body = "ok"
        } else {
            logUtil.writeInfo("没找到模板或没有制定发送用户组")
            ctx.body = "没找到模板或没有制定发送用户组"
        }


    } catch (error) {
        logUtil.writeErr(error)
        ctx.body = error
    }
    await next()
})

module.exports = router
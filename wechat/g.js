var config = require("../config")

var getRawBody = require("raw-body")
var sha1 = require("sha1")
var util = require("./util")
var Wechat = require("./wechat")

module.exports = function(opts, handler) {
    var wechat = new Wechat(opts)
    return async(ctx, next) => {
        var token = config.wechat.token
        var signature = ctx.query.signature
        var nonce = ctx.query.nonce
        var timestamp = ctx.query.timestamp
        var echostr = ctx.query.echostr
        var str = [token, timestamp, nonce].sort().join("")
        var sha = sha1(str)
        if (ctx.method === "GET") {
            if (sha === signature) {
                ctx.body = echostr + ""
            } else {
                ctx.body = "wrong"
            }
        } else if (ctx.method === "POST") {
            if (sha !== signature) {
                ctx.body = "wrong"

            } else {
                var data = await getRawBody(ctx.req, {
                    length: ctx.length,
                    limit: "1mb",
                    encoding: ctx.charset
                })
                var content = await util.parseXMLAsync(data)
                var message = util.formatMessage(content.xml)

                ctx.weixin = message
                await handler.call(ctx)
                wechat.reply.call(ctx)
            }
        }
        await next()
    }
}
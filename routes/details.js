"use strict"

const router = require("koa-router")()
var fsutil = require("../libs/util")
var moment = require("moment-timezone")

var path = require("path")
moment.tz.setDefault("Asia/Shanghai")

router.prefix("/details")

router.get("/prosum/:name", async(ctx, next) => {
    var name = ctx.params.name
    var data = JSON.parse(await fsutil.readFileAsync(path.join(__dirname, "../details/prosum", name)))
    data.T = moment.unix(data.start).format("YYYY-MM-DD HH:mm:ss") + "~" + moment.unix(data.end).format("YYYY-MM-DD HH:mm:ss")
    await ctx.render("details/prosum", {
        title: data.name,
        data: data
    })
})

router.get("/smsreport/:name", async(ctx, next) => {
    var name = ctx.params.name
    var data = JSON.parse(await fsutil.readFileAsync(path.join(__dirname, "../details/smsreport", name)))

    data.T = moment.unix(data.start).format("YYYY-MM-DD HH:mm:ss") + "~" + moment.unix(data.end).format("YYYY-MM-DD HH:mm:ss")
    await ctx.render("details/smsreport", {
        title: data.name,
        data: data
    })
})

module.exports = router
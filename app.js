var Koa = require('koa')
var app = new Koa()
var views = require('koa-views')
var json = require('koa-json')
var onerror = require('koa-onerror')
var bodyparser = require('koa-bodyparser')
var logger = require('koa-logger')

var index = require('./routes/index')
var users = require('./routes/users')
var tags = require('./routes/tags')
var logs = require('./routes/logs')
var menu = require('./routes/menu')
var test = require('./routes/test')

const logUtil = require('./utils/log4js/log_utils');

app.use(async(ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        // logUtil.logResponse(ctx, ms);
        logUtil.writeInfo(`${ctx.ip} ${ctx.method} ${ctx.url} - ${ms}ms`);
    } catch (error) {
        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
    // app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// logger
// app.use(async (ctx, next) => {
//   var start = new Date()
//   await next()
//   var ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(index.routes(), index.allowedMethods())

app.use(users.routes(), users.allowedMethods())
app.use(tags.routes(), tags.allowedMethods())
app.use(logs.routes(), logs.allowedMethods())
app.use(menu.routes(), menu.allowedMethods());
app.use(test.routes(), test.allowedMethods())


app.use(async(ctx) => {
    if (ctx.status === 404) {
        await ctx.render('404')
    }

})

module.exports = app
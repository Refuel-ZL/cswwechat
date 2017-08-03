"use strict"

var path = require("path")
var util = require("../libs/util")
var wechat_flie = path.join(__dirname, "./wechat.json")

var config = {
    greetings: "你好，欢迎关注湖南康森韦尔科技园",
    host: "http://refuel.tunnel.echomod.cn/",
    port: "3000",
    wechat: {
        /* 订阅号
        // appID: "wxab84ddf3be7fbb75",
        // appSecret: "304c7b004edd1aad9ec418545d74d089",
        // token: "Cq8nEQJwIxy7L3K0FP86VMyhETcSUsyE",
        */
        /*zl测试号*/
        appID: "wx8b36bc2fdec5c52b",
        appSecret: "7102f0173f65ce448f0aa9d62f0240d4",
        token: "zlrefuel",
        getAccessToken: function() {
            return util.readFileAsync(wechat_flie)
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_flie, data)
        }
    }

}
var proconfig = {
    greetings: "你好，欢迎关注湖南康森韦尔科技园",
    host: " http://cswwxchat.tunnel.echomod.cn/",
    port: "3030",
    wechat: {
        appID: "wxeb05d253a32466a8",
        appSecret: "39b47ebeeead0e5ff09b5c360bf17226",
        token: "Cq8nEQJwIxy7L3K0FP86VMyhETcSUsyE",
        getAccessToken: function() {
            return util.readFileAsync(wechat_flie)
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_flie, data)
        }
    }
}




exports = module.exports = config

// exports = module.exports = proconfig //如果是线上，使用该config
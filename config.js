'use strict'

var path = require("path");
var util = require("./libs/util");
var wechat_flie = path.join(__dirname, './config/wechat.json')

var config = {
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

        /*
         *   csw测试号
         */
        /*
        appID: "wxeb05d253a32466a8",
        appSecret: "39b47ebeeead0e5ff09b5c360bf17226",
        token: "Cq8nEQJwIxy7L3K0FP86VMyhETcSUsyE",*/

        getAccessToken: function() {
            return util.readFileAsync(wechat_flie)
        },
        saveAccessToken: function(data) {
            data = JSON.stringify(data);
            return util.writeFileAsync(wechat_flie, data);
        }
    },
    csw: {
        host: "http://220.170.155.240:9619/"
    }
}
module.exports = config
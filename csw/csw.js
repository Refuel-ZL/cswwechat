"use strict"


var request = require("request")
const logUtil = require("../utils/log4js/log_utils")

var realm = "http://220.170.155.240:9619/"
var cswapi = {
    getvarvalue: realm + "getvarvalue?",
    getalarmlog: realm + "alarmlog?",
    setvarvalue: realm + "setvarvalue?"
}
var timeout = 2000
module.exports = {
    getvarvalue: function(meterial) {
        var url = cswapi.getvarvalue + "varlist=" + JSON.stringify(meterial)
        logUtil.writeInfo("获取实时数据值  " + url)
        var options = {
            method: "POST",
            url: url,
            JSON: true,
            timeout: timeout
        }
        return new Promise((resolve) => {
            request(options, (err, res, body) => {
                if (err) {
                    resolve(err)
                }
                resolve(JSON.parse(body))
            })
        })
    },
    setvarvalue: function(meterial) {
        var url = cswapi.setvarvalue + "varlist=" + JSON.stringify(meterial)
        logUtil.writeInfo("设置数据值  " + url)
        var options = {
            method: "POST",
            url: url,
            JSON: true,
            timeout: timeout

        }
        return new Promise((resolve) => {
            request(options, (err, res, body) => {
                if (err) {
                    resolve(err)
                }
                resolve(body)
            })
        })

    },
    getalarmlog: function(from, end, isLog, size) {
        var url = cswapi.getalarmlog + "from=" + from + "&end=" + end + "&isLog=" + isLog + "&size=" + size
        logUtil.writeInfo("获取告警信息  " + url)
        var options = {
            method: "GET",
            url: url,
            JSON: true,
            timeout: timeout
        }
        var t = new Date()
        return new Promise((resolve) => {
            request(options, (err, res, body) => {
                logUtil.writeInfo("获取告警信息花费时间 【" + (new Date() - t) + "ms】")
                if (err) {
                    resolve(err)
                }
                if (body) {
                    resolve(JSON.parse(body))
                } else {
                    resolve(body)
                }
            })
        })
    },
}
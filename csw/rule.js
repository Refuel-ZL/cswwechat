"use strict"

const cswapi = require("./csw")
var path = require("path")
var fsutil = require("../libs/util")
var moment = require("moment-timezone")

moment.tz.setDefault("Asia/Shanghai")

/**用户id  手动分组 */
var idlist = {
    1: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", "oKE7GwntwwTWx626GyrQIfR2M27g"],
    2: ["oKE7Gwt58KL2mBAFLLWpP1YGFcco"],
    // "自己": ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", "oKE7GwjF8RScFBw-n5X6159I-UBM"],
    "自己": ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", "oKE7GwntwwTWx626GyrQIfR2M27g"],
    "csw": ["oLy1e07NL-biW7EI5uVRu31OjMgA", "oLy1e0y-W2eTwzeKkMcLkVKVCh94"]

}

/** 转发告警信息的规则和微信模板id */
var SmsTemplate = {

    "报警信息": {
        "form": {
            "touser": "用户id",
            "template_id": "3YcUrJAmPynJAzjEmkQ_sbHWmxmS-qAbGslGWETTmhM",
            "data": {
                "text": {
                    "value": "内容"
                }
            }
        },
        "group": _getid(["自己"])
    },
    "统计报告": {
        "form": {
            "touser": "用户id",
            "template_id": "xizPyok8_4xYnp4VV-jMxeFB8f8O5OAdA6Y-O-6jGTM",
            "data": {
                "text": {
                    "value": "内容"
                }
            }
        },
        "group": _getid(["自己"])
    },
    "ZLT网络运维": {
        "template": "vOAKQy82cwsupZTLOWrpcyOLp4NAI0HcdEbhIS-RIFg",
        "form": {
            "touser": "用户id",
            "template_id": "vOAKQy82cwsupZTLOWrpcyOLp4NAI0HcdEbhIS-RIFg",
            "data": {
                "text": {
                    "value": "内容"
                }
            }
        },
        "group": _getid(["自己"])
    },
    "项目统计": {
        "form": {
            "touser": "用户id",
            "template_id": "xizPyok8_4xYnp4VV-jMxeFB8f8O5OAdA6Y-O-6jGTM",
            "url": "",
            "data": {
                "text": {
                    "value": "内容"
                }
            }
        },
        "format": function(res) {

            var n = 5
            var val = `${moment.unix(res.start ).format("YYYY-MM-DD HH:mm:ss")}~${moment.unix(res.end).format("YYYY-MM-DD HH:mm:ss")}\n`
            if (res.err) {
                return val + res.err
            }
            if (res.msg.length > 0) {
                if (res.msg.length > 5) {
                    val += `${res.name}前${n}名 \n(次数---项目名)`
                } else {
                    n = res.msg.length
                }

                for (var i = 0; i < n; i++) {
                    val += "\n" + res.msg[i].sum + "\t\t\t\t" + res.msg[i].name
                }
                return val + "\n更多内容请点击详情"
            } else {
                return val + "暂无结果"
            }

        },
        "details": function(res, form) {
            try {
                if (res.err) {
                    return ""
                }
                if (res.msg.length > 0) {
                    var fpath = path.join(__dirname, "../details/prosum", "prosum_" + res.start + "_" + res.end)
                    fsutil.writeFileAsync(fpath, JSON.stringify(res))
                    return "details/prosum/" + "prosum_" + res.start + "_" + res.end
                } else {
                    return ""
                }
            } catch (error) {
                console.dir(error)
                return ""
            }

        },
        "group": _getid(["自己"])
    },
    "平安短信分析": {
        "form": {
            "touser": "用户id",
            "template_id": "xizPyok8_4xYnp4VV-jMxeFB8f8O5OAdA6Y-O-6jGTM",
            "url": "",
            "data": {
                "text": {
                    "value": "内容"
                }
            }
        },
        "format": function(res) {
            var val = ""
            var sum = res.msg.sum
            var add = res.msg.add
            var lack = res.msg.lack
            val = `${res.groupType}:当前周期【${moment.unix(res.start).format("YYYY-MM-DD HH:mm:ss")}~${moment.unix(res.end).format("YYYY-MM-DD HH:mm:ss")}】`
            if (res.err) {
                return val + res.err
            }
            if (sum > 0) {
                val += `\n\n本周期共计收到${sum}个项目的平安短信`
                if (add > 0) {
                    val += `\n其中相比上周期有${add}个项目是新增的。`
                } else {
                    val += "\n没有项目是新增的。"
                }

            } else {
                val += "\n\n本周期未收到平安短信"
            }
            if (lack > 0) {
                val += `\n请注意：上周期汇报的项目中有【${lack}】个在本周期没有进行汇报。`
            }
            return val
        },
        "details": function(res, form) {
            try {
                if (res.err) {
                    return ""
                }
                if (res.msg.add != "0" || res.msg.lack != "0") {
                    var fpath = path.join(__dirname, "../details/smsreport/", "smsreport_" + res.start + "_" + res.end)
                    fsutil.writeFileAsync(fpath, JSON.stringify(res))
                    return "details/smsreport/" + "smsreport_" + res.start + "_" + res.end
                } else {
                    return ""
                }

            } catch (error) {
                console.dir(error)
                return ""
            }
        },
        "group": _getid(["自己"])
    }
}

/** 关键词 权限组 及动作 */
var data = {
    "开门": {
        remark: "打开玻璃门",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_26001", "varvalue": "1" }]
            return cswapi.setvarvalue(val)
        }
    },
    "开灯": {
        remark: "开展厅灯",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关灯": {
        remark: "开展厅灯",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "展厅灯光": {
        remark: "展厅灯光状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_238"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开喷泉": {
        remark: "",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭喷泉": {
        remark: "",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "喷泉": {
        remark: "喷泉状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_387"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开大门": {
        remark: "公司大门开",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭大门": {
        remark: "公司大门关",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "停止大门": {
        remark: "公司大门停",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 2 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开果园浇水": {
        remark: "果园灌溉开",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭果园浇水": {
        remark: "果园灌溉关",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "果园": {
        remark: "果园灌溉状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_388"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开球场灯光": {
        remark: "开球场灯光",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭球场灯光": {
        remark: "关球场灯光",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "球场": {
        remark: "球场灯光状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_406"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开电机": {
        remark: "开展厅水利电机",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_372", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭电机": {
        remark: "关展厅水利电机",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_372", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "电机": {
        remark: "水利电机状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_367"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开阀门": {
        remark: "开展厅水利阀门",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21007", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭阀门": {
        remark: "关展厅水利阀门",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21007", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "阀门": {
        remark: "水利阀门状态",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = ["V_21006"]
            return cswapi.getvarvalue(val)
        }
    },
    "打开窗帘": {
        remark: "开展厅窗帘",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21003", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭窗帘": {
        remark: "关展厅窗帘",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21005", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "停止窗帘": {
        remark: "停展厅窗帘",
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21004", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    }
}


/**以下为分析配置 请勿修改
 * 
 */

var config = {
    SmsTemplate: SmsTemplate,
    data: data,
    keyword: _keylist()
}

function _getid(Gids) {
    var _idlist = []
    Gids.forEach(function(item) {
        if (idlist[item]) {
            _idlist = _idlist.concat(idlist[item])
        }
    })
    return _idlist
}

function _keylist() {
    var list = []
    for (var key in data) {
        list.push(key)
    }
    return list
}

module.exports = config
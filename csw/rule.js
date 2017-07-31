"use strict"


var cswapi = require("../csw/csw")

var idlist = {
    1: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", "oKE7GwntwwTWx626GyrQIfR2M27g"],
    2: ["oKE7Gwt58KL2mBAFLLWpP1YGFcco"],
    // "自己": ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", "oKE7GwjF8RScFBw-n5X6159I-UBM"],
    "自己": ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo"],
    "csw": ["oLy1e07NL-biW7EI5uVRu31OjMgA", "oLy1e0y-W2eTwzeKkMcLkVKVCh94"]

}

module.exports = {
    idlist: {
        "报警信息": {
            "template": "3YcUrJAmPynJAzjEmkQ_sbHWmxmS-qAbGslGWETTmhM",
            "group": _getid(["自己"])
        },
        "统计报告": {
            "template": "xizPyok8_4xYnp4VV-jMxeFB8f8O5OAdA6Y-O-6jGTM",
            "group": _getid(["自己"])
        },
        "ZLT网络运维": {
            "template": "vOAKQy82cwsupZTLOWrpcyOLp4NAI0HcdEbhIS-RIFg",
            "group": _getid(["自己"])
        }
        /*
        "报警信息": {
            "template": "RjLxQM3CCeZGy9a8Z8FFRfiSoHEsp-OeoXOznlGn9Ow",
            "group": _getid(["csw"])
        },
        "统计报告": {
            "template": "sQAw7LHpmtYP9b2ama0wfrX8QA0wgpP3T5SAXinQKJ4",
            "group": _getid(["csw"])
           }  ,
            "ZLT网络运维":{
            "template": "J8yXh5B2U3YFK4rdJaPYD15xfec_39Q_VUQRPJPqQKk",
            "group": _getid(["csw"])
        }
        */

    },
    keyword: ["开门", "开灯", "关灯", "打开喷泉", "关闭喷泉", "打开大门", "关闭大门", "停止大门", "打开果园浇水", "关闭果园浇水", "打开球场灯光", "关闭球场灯光", "打开电机", "关闭电机", "打开阀门", "关闭阀门", "打开窗帘", "关闭窗帘", "停止窗帘"],
    "开门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_26001", "varvalue": "1" }]
            return cswapi.setvarvalue(val)
        }
    },
    "开灯": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关灯": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开喷泉": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭喷泉": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开大门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭大门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "停止大门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 2 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开果园浇水": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭果园浇水": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开球场灯光": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭球场灯光": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开电机": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_372", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭电机": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_372", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开阀门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21007", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭阀门": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21007", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    "打开窗帘": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21003", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "关闭窗帘": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21005", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    "停止窗帘": {
        check: false,
        openid: _getid(["1", "2", "3"]),
        event: function() {
            var val = [{ "varid": "V_21004", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    }

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
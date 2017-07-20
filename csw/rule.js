'use strict'

var request = require("request")

var cswapi = require("../csw/csw");



module.exports = {
    keyword: ['开门', "开灯", '关灯', '打开喷泉', '关闭喷泉'],
    "开门": {
        openid: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", 'oKE7GwntwwTWx626GyrQIfR2M27g'],
        event: function() {
            var val = [{ "varid": "V_26001", "varvalue": "1" }]
            return cswapi.setvarvalue(val)
        }
    },
    '开灯': {
        openid: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", 'oKE7GwntwwTWx626GyrQIfR2M27g'],
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关灯': {
        openid: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", 'oKE7GwntwwTWx626GyrQIfR2M27g'],
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    '打开喷泉': {
        openid: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo"],
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关闭喷泉': {
        openid: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo"],
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    }

}
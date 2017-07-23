'use strict'

var request = require("request")

var cswapi = require("../csw/csw");



var idlist = {
    1: ["oKE7Gwt58KL2mBAFLLWpP1YGFyoo", 'oKE7GwntwwTWx626GyrQIfR2M27g'],
    2: ["oKE7Gwt58KL2mBAFLLWpP1YGFcco"],
    3: []
}

module.exports = {
    keyword: ['开门', "开灯", '关灯', '打开喷泉', '关闭喷泉', '打开大门', '关闭大门', '停止大门', '打开果园喷灌', '关闭果园喷灌', '打开球场灯光', '关闭球场灯光'],
    "开门": {
        check: false,
        openid: _getid(['1', '2', '3']),
        event: function() {
            var val = [{ "varid": "V_26001", "varvalue": "1" }]
            return cswapi.setvarvalue(val)
        }
    },
    '开灯': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关灯': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_266", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    '打开喷泉': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关闭喷泉': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_21001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    '打开大门': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关闭大门': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    '停止大门': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_20001", "varvalue": 2 }]
            return cswapi.setvarvalue(val)
        }
    },
    '打开果园喷灌': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关闭果园喷灌': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_21002", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    },
    '打开球场灯光': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 1 }]
            return cswapi.setvarvalue(val)
        }
    },
    '关闭球场灯光': {
        check: false,
        openid: _getid(['1']),
        event: function() {
            var val = [{ "varid": "V_406", "varvalue": 0 }]
            return cswapi.setvarvalue(val)
        }
    }

}


function _getid(Gids) {
    var _idlist = [];
    Gids.forEach(function(item) {
        if (idlist[item]) {
            _idlist = _idlist.concat(idlist[item])
        }
    }, this);

    return _idlist;
}



function rule() {

}
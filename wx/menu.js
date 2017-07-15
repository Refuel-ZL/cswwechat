"use strict"

var info = require('../package')

/*
module.exports = {
    "button": [{
        "name": "点击事件",
        "type": "click",
        "key": "menu_click"
    }, {
        "name": "点出菜单",
        "sub_button": [{
            "type": "view",
            "name": "跳转URL",
            "url": "http://uc123.com"
        }, {
            "type": "scancode_push",
            "name": "扫码推送事件",
            "key": "qr_scan"
        }, {
            "type": "pic_sysphoto",
            "name": "弹出系统拍照",
            "key": "pic_sysphoto",
        }, {
            "type": "pic_photo_or_album",
            "name": "弹出拍照或者相册",
            "key": "pic_photo_album",
        }, {
            "type": "scancode_waitmsg",
            "name": "扫码带提示",
            "key": "qr_scan_waitmsg",
        }]
    }, {
        "name": "点出菜单2",
        "sub_button": [{
            "type": "pic_weixin",
            "name": "微信相册发图",
            "key": "pic_weixin"
        }, {
            "name": "定位",
            "type": "location_select",
            "key": "location_select"
        }]
    }]
}*/
module.exports = {
    "button": [
        //     {
        //     "name": "点击事件",
        //     "type": "click",
        //     "key": "menu_click"
        // },
        {
            "type": 'view',
            'name': '今日告警',
            "url": info.host + 'logs'
        }, {
            "name": "报警日志",
            "sub_button": [{
                "name": "今日日志",
                "type": "click",
                "key": "alarmlog"
            }, {
                "name": "昨日top10",
                "type": "click",
                "key": "alarmlog10"
            }]
        }
    ]
}
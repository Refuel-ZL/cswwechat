'use strict'

var config = require('../config');
var info = require('../package')
var Wechat = require('../wechat/wechat');
var csw = require('../csw/csw');
var menu = require('./menu');
var moment = require('moment-timezone');
var rule = require('../csw/rule');

moment.tz.setDefault("Asia/Shanghai");

// var wechatApi = new Wechat(config.wechat);



exports.reply = async function() {
    var wechatApi = new Wechat(config.wechat);
    var message = this.weixin;
    var vvv = '支持关键字如下:\n' + rule.keyword
    var reply = vvv;
    console.log(moment().format("X"))
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log("扫二维码进来：" + message.EventKey + ' ' + message.Ticket);
            }
            reply = info.greetings + '\n' + vvv
        } else if (message.Event === 'CLICK') {
            switch (message.EventKey) {
                case '_alarmlog':
                    var picData = await wechatApi.uploadMaterial('pic', __dirname + '/2.jpg', {}); //获取url地址 不受素材数目的限制
                    console.log(picData);
                    reply = picData
                    var news = []
                    news.push({
                        title: "今日告警",
                        description: "查看今日有什么报警",
                        picUrl: picData.url,
                        url: info.host + 'logs',
                    })
                    reply = news
                    break;
                case 'alarmlog':
                    var from = moment().format("YYYYMMDD");
                    var end = moment().add(1, 'days').format("YYYYMMDD");
                    var logvalue = await csw.getalarmlog(from, end, 1, 1000);
                    reply = '今日告警如下：';
                    if (logvalue) {
                        logvalue.forEach(function(item) {
                            reply += '\n' + item.time + ' ' + item.msg + ' ' + item.status;
                        })
                    } else {
                        reply = '查询无果'
                    }
                    break;
                case 'alarmlog10':
                    var from = moment().add(-1, 'days').format("YYYYMMDD");
                    var end = moment().format("YYYYMMDD");
                    var logvalue = []
                    logvalue = await csw.getalarmlog(from, end, 0, 10);
                    reply = '昨日告警top10如下：';
                    if (logvalue) {
                        logvalue.forEach(function(item) {
                            reply += '\n' + item.deviceName + ' ' + item.count + '次';
                        })
                    } else {
                        reply = '查询无果'
                    }
                    break;
                default:
                    break;
            }
        } else if (message.Event === 'LOCATION') {
            reply = '定位'
        } else {
            reply = '无效指令';
        }

    } else if (message.MsgType === 'text') {
        // console.log(message.FromUserName);
        // reply = await wechatApi.fetchUserTag("oKE7Gwt58KL2mBAFLLWpP1YGFyoo");
        // // reply = message.FromUserName;
        // console.log(reply)
        var content = message.Content;
        var order = content.substring(0, 1);
        switch (order) {
            case '#':
                var r = /^\+?[1-9][0-9]*$/;　　 //正整数 
                var v = [];
                var num = content.substring(1);
                if (r.test(num)) {
                    v.push('V_' + num)
                    var lists = '查询结果：'
                    var items = await csw.getvarvalue(v)
                    if (items.length === 0) {
                        lists = '查无此变量'
                    }
                    items.forEach(function(item) {
                        lists += '\n' + item.varid + " : " + item.value
                    })
                    reply = lists
                } else {
                    reply = "该 " + content + " 命令非法\n" + vvv
                }
                break;
            case '$':
                reply = await wechatApi.fetchUserTag(message.FromUserName);
                reply = JSON.stringify(reply)
                break;
            case 'm':
                var del = await wechatApi.deleteMenu();
                if (del.errmsg = 'ok') {
                    del = await wechatApi.createMenu(JSON.stringify(menu));
                    if (del.errmsg === 'ok') {
                        reply = '重置菜单成功'
                    } else {
                        reply = '写入失败：' + del.errmsg + del.errcode
                    }
                } else {
                    reply = '重置失败' + del.errmsg + del.errcode
                }
                break;
            case 'g':
                reply = "<a href=\'" + info.host + "logs\'>点击查看详情</a>"
                break;
            case 'a':
                //上传永久图片素材
                var picData = await wechatApi.uploadMaterial('image', __dirname + '/2.jpg', { type: 'image' });
                // var picData = {
                //         media_id: "e-kE-1ewjSyqA-TY46BTLruYv0U7gDVb0t4VDGVao08",
                //         url: "http://mmbiz.qpic.cn/mmbiz_jpg/Lvn9KoTyF6tGVQLg3QbOlwTn2thg2LmJI1WAxuZcCVqGGknKicrBQRLaWT3MSLEOVDvk0w4DpyJA5mq8k9CRNQw/0?wx_fmt=jpeg"
                //     }
                // console.log(picData)
                var meida = {
                    "articles": [{
                        "title": "测试图文",
                        "thumb_media_id": picData.media_id,
                        "author": "Scott",
                        "digest": "摘要没没写",
                        "show_cover_pic": 0,
                        "content": "未完待续",
                        "content_source_url": "https://www.github.com"
                    }]
                }

                //上传永久图文素材
                var data = await wechatApi.uploadMaterial("news", meida, {});
                // var data = { media_id: "e-kE-1ewjSyqA-TY46BTLusSqJwrMJBoJM-icnglFYY" }
                // console.log(data)
                data = await wechatApi.fetchMaterial(data.media_id, 'news', {});
                // console.log(data)
                var items = data.news_item;
                // console.log(items)
                var news = []
                items.forEach(function(item) {
                    news.push({
                        title: item.title,
                        description: item.digest,
                        picUrl: item.thumb_url,
                        url: item.url,
                    })
                });
                reply = news
                    // console.log(news[0].url)
                break;
            case "b":
                var picData = await wechatApi.uploadMaterial('pic', __dirname + '/2.jpg', {}); //获取url地址 不受素材数目的限制
                // console.log(picData);
                var news = []
                news.push({
                    title: "今日告警",
                    description: "查看今日有什么报警",
                    picUrl: picData.url,
                    url: info.host + 'logs',
                })
                reply = news
                break;

            case 't':

                break;
            default:
                var res = await _command(content, message.FromUserName)
                if (res.state === 1) {
                    reply = res.val + " " + res.msg;
                } else {
                    reply = res.msg
                }
                break;
        }
    } else if (message.MsgType === 'voice') {
        var say = message.Recognition;
        console.log(say)
        if (say.length > 0) {
            var res = await _command(say, message.FromUserName)
            if (res.state === 1) {
                reply = res.val + " " + res.msg;
            } else if (res.state === 2) {
                reply = res.msg
            } else {
                reply = "【" + res.val + "】\n" + res.msg;
            }
        } else {
            reply = "未识别到信息,请确保语音输入有效.重试还不能解决请联系管理员打开语音识别接口"
        }

    } else {
        reply = "抱歉！ 未添加该类型的回复策略"
    }
    this.body = reply;
}

var keywords = rule.keyword;

/**
 * 匹配指令
 * 
 * @param {String} val 
 * @returns 
 */
function matching(val) {
    var result = {
        state: 0,
        val: ""
    }

    for (var i = 0; i < keywords.length; i++) {
        if (val.indexOf(keywords[i]) >= 0) {
            result = {
                state: 1,
                val: keywords[i]
            }
            break;
        }
    }
    return result
}

/**核实用户权限
 * 
 * @param {Array} items 权限组
 * @param {String} val  用户
 * @returns 
 */
function _matching_id(items, val) {
    var result = false;
    for (var i = 0; i < items.length; i++) {
        if (items[i] === val) {
            result = true;
            break;
        }
    }
    return result
}

/**
 * 
 * 
 */
async function _command(_msg, Uid) {
    var cswdic = matching(_msg)
    if (cswdic.state === 1) {
        var policy = rule[cswdic.val];
        if (_matching_id(policy.openid, Uid)) {
            return {
                state: 1,
                val: cswdic.val,
                msg: await policy.event()
            }

        } else {
            return {
                state: 2,
                msg: "抱歉！ 您没有执行这条指令的权限"
            }
        }

    } else {
        return {
            state: 0,
            val: _msg,
            msg: "抱歉！ 我无法识别您的指令且不能完成"
        }
    }
}
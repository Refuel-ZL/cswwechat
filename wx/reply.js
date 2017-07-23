'use strict'

var config = require('../config');
var Wechat = require('../wechat/wechat');
var csw = require('../csw/csw');
var menu = require('./menu');
var moment = require('moment-timezone');
var rule = require('../csw/rule');
var util = require('util');
const logUtil = require('../utils/log4js/log_utils');
moment.tz.setDefault("Asia/Shanghai");
var keywords = rule.keyword; //指令数组

exports.reply = async function() {
    var wechatApi = new Wechat(config.wechat);
    var message = this.weixin;
    var reply = config.greetings;
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                // console.log("扫二维码进来：" + message.EventKey + ' ' + message.Ticket);
            }
            logUtil.writeInfo(message.FromUserName + "  事件——关注公众号")
            reply = config.greetings
            keywords.forEach(function(item, index) {
                reply += '\n【' + index + '】' + item;
            })
        } else if (message.Event === 'CLICK') {
            switch (message.EventKey) {
                case '_alarmlog':
                    logUtil.writeInfo(message.FromUserName + "  菜单——今日告警记录图文")
                    var picData = await wechatApi.uploadMaterial('pic', __dirname + '/2.jpg', {}); //获取url地址 不受素材数目的限制
                    // console.log(picData);
                    logUtil.writeInfo("上传图文：" + JSON.stringify(picData))
                    reply = picData
                    var news = []
                    news.push({
                        title: "今日告警",
                        description: "查看今日有什么报警",
                        picUrl: picData.url,
                        url: config.host + 'logs',
                    })
                    reply = news
                    break;
                case 'alarmlog':
                    logUtil.writeInfo(message.FromUserName + "  菜单_今日告警记录")
                    var from = moment().format("YYYYMMDD");
                    var end = moment().add(1, 'days').format("YYYYMMDD");
                    var logvalue = await csw.getalarmlog(from, end, 1, 1000);
                    reply = '今日告警如下：';
                    // Object.prototype.toString.call(logvalue) === '[object Array]'
                    if (util.isArray(logvalue)) {
                        logvalue.forEach(function(item) {
                            reply += '\n' + item.time + ' ' + item.msg + ' ' + item.status;
                        })
                    } else {
                        reply = '查询无果:' + logvalue
                    }
                    break;
                case 'alarmlog10':
                    logUtil.writeInfo(message.FromUserName + "  菜单_昨日告警统计top10")
                    var from = moment().add(-1, 'days').format("YYYYMMDD");
                    var end = moment().format("YYYYMMDD");
                    var logvalue = []
                    logvalue = await csw.getalarmlog(from, end, 0, 10);
                    reply = '昨日告警top10如下：';
                    if (util.isArray(logvalue)) {
                        logvalue.forEach(function(item) {
                            reply += '\n' + item.deviceName + ' ' + item.count + '次';
                        })
                    } else {
                        reply = '查询无果:' + logvalue
                    }
                    break;
                case "dictatelist":
                    reply = "现支持如下指令："
                    keywords.forEach(function(item, index) {
                        reply += '\n【' + index + '】' + item;
                    })
                    break;
                case "about":
                    reply = config.greetings
                    break;
                default:
                    break;
            }
        } else if (message.Event === 'LOCATION') {
            reply = '定位'
        } else if (message.Event === 'unsubscribe') {
            logUtil.writeInfo(message.FromUserName + "  事件——取消公众号")
            reply = '取消关注'
        } else {
            logUtil.writeInfo(message.FromUserName + "  事件——无效事件")
            reply = '无效事件';
        }

    } else if (message.MsgType === 'text') {
        var content = message.Content;
        logUtil.writeInfo(message.FromUserName + "  文本——" + content);
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
                    reply = "该 " + content + " 指令非法\n" + vvv
                }
                break;
            case '$':
                logUtil.writeInfo(message.FromUserName + "  事件查看自身标签")
                reply = await wechatApi.fetchUserTag(message.FromUserName);
                reply = JSON.stringify(reply)
                break;
            case 'm':
                logUtil.writeInfo(message.FromUserName + "  重置菜单")
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
            case 'a':
                //上传永久图片素材
                var picData = await wechatApi.uploadMaterial('image', __dirname + '/2.jpg', { type: 'image' });
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
                data = await wechatApi.fetchMaterial(data.media_id, 'news', {});
                var items = data.news_item;
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
                break;
            case "b":
                var picData = await wechatApi.uploadMaterial('pic', __dirname + '/2.jpg', {}); //获取url地址 不受素材数目的限制
                var news = []
                news.push({
                    title: "今日告警",
                    description: "查看今日有什么报警",
                    picUrl: picData.url,
                    url: config.host + 'logs',
                })
                reply = news
                break;
            default:
                var key = keywords[content];
                var res = {
                    state: 0,
                    msg: ""
                }
                if (key) {
                    res = await _command(key, message.FromUserName)
                } else {
                    res = await _command(content, message.FromUserName)
                }
                if (res.state === 1) {
                    reply = res.val + " " + res.msg;
                } else {
                    reply = res.msg
                }
                break;
        }
    } else if (message.MsgType === 'voice') {
        var say = message.Recognition;
        logUtil.writeInfo(message.FromUserName + "  语音输入——【" + say + '】')
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
 * @param {any} _msg  指令
 * @param {any} Uid   用户ID
 * @returns 
 * */
async function _command(_msg, Uid) {
    var cswdic = matching(_msg)
    if (cswdic.state === 1) {
        var policy = rule[cswdic.val];
        if (policy.check) {
            if (!_matching_id(policy.openid, Uid)) {
                return {
                    state: 2,
                    msg: "抱歉！ 您没有执行这条指令的权限"
                }
            }
        }
        return {
            state: 1,
            val: cswdic.val,
            msg: await policy.event()
        }
    } else {
        return {
            state: 0,
            val: _msg,
            msg: "抱歉！ 我无法识别您的指令且不能完成"
        }
    }
}
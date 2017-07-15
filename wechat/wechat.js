'use strict'
var util = require('./util');
var fs = require('fs');
var _ = require("lodash");
var request = require("request")

var prefix = "https://api.weixin.qq.com/cgi-bin/";
var api = {
    accessToken: prefix + "token?grant_type=client_credential",
    temporary: {
        upload: prefix + "media/upload?",
        fetch: prefix + "media/get?" //获取素材(media_id)
    },
    permanent: {
        upload: prefix + "material/add_material?", //新增其他类型永久素材
        uploadNews: prefix + "material/add_news?", //新增永久图文素材
        uploadNewsPic: prefix + "media/uploadimg?", //上传图文消息内的图片获取URL
        fetch: prefix + "material/get_material?", //获取永久素材
        del: prefix + "media/del_material?",
        update: prefix + 'material/update_news?',
        count: prefix + 'material/get_materialcount?',
        batch: prefix + 'material/batchget_material?'
    },
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        delete: prefix + "menu/delete?",
        current: 'get_current_selfmenu_info?'
    },
    tags: {
        create: prefix + 'tags/create?',
        get: prefix + 'tags/get?',
        update: prefix + 'tags/update?',
        delete: prefix + 'tags/delete?', //
    },
    userset: {
        batchtagging: prefix + 'tags/members/batchtagging?', //批量用户增加标签
        batchuntagging: prefix + 'members/batchuntagging?', //批量用户取消标签
        getidlist: prefix + 'tags/getidlist?', //获取用户身上的标签列表
        getusers: prefix + 'user/get?', //获取用户列表
        updateremark: prefix + 'user/info/updateremark?', //设置用户备注
        userinfo: prefix + 'user/info?', //用户基本信息
        getblacklist: prefix + 'tags/members/getblacklist?', //获取黑名单列表
        batchblacklist: prefix + 'tags/members/batchblacklist?', //用户拉黑
        batchunblacklist: prefix + 'tags/members/batchunblacklist?', //取消拉黑
    }

}

/**初始化微信接口信息
 * 
 * @param {any} opts 
 */
function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
}
/**获取/更新微信接口 token
 * fetchAccessToken()
 * 
 * @param {any}  
 */
Wechat.prototype.fetchAccessToken = async function() {
    var that = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return this;
        }
    }
    var data = await this.getAccessToken()
    try {
        data = JSON.parse(data)
        if (!this.isValidAccessToken(data)) {
            data = await this.updateAccessToken()
        }
    } catch (error) {
        data = await this.updateAccessToken()
    }
    this.access_token = data.access_token;
    this.expires_in = data.expires_in;
    this.saveAccessToken(data)
    return data
}

/** 判断token的时效性
 *
 * isValidAccessToken()
 * @param {any}   data
 */
Wechat.prototype.isValidAccessToken = function(data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime())
    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}

/**通过微信接口更新token 的值
 * 
 * @returns data
 */
Wechat.prototype.updateAccessToken = function() {
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + "&appid=" + appID + "&secret=" + appSecret
    return new Promise(function(resolve, reject) {

        request({ url: url, JSON: true }, (err, res, body) => {
            if (err) {
                reject(err);
            }
            var data = JSON.parse(body)
            var now = (new Date().getTime())
            var expires_in = now + (data.expires_in - 50) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        });
    });

}

/**获取用户身上的标签
 * 
 * @param {string} openid 
 * @returns 
 */
Wechat.prototype.fetchUserTag = async function(openid) {
    openid = {
        "openid": openid
    }
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.userset.getidlist + 'access_token=' + data.access_token;
        console.log(url);
        var options = {
            method: 'POST',
            url: url,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(openid),
            JSON: true,
        };
        try {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err)
                }
                resolve(JSON.parse(body))
            })
        } catch (error) {
            throw new Error('请求用户标签失败');
        }

    });
}

/**获取用户列表 超过一千个没处理
 * 
 * 
 */
Wechat.prototype.getUsers = async function() {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.userset.getusers + 'access_token=' + data.access_token;
        console.log(url);
        request({
            url: url,
            method: 'GET',
            JSON: true
        }, (err, res, body) => {
            if (err) {
                reject(err)
            }
            resolve(JSON.parse(body))
        })
    })
}

/**获取标签列表
 * 
 * @returns body
 */
Wechat.prototype.getTags = async function() {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.tags.get + 'access_token=' + data.access_token;
        request({
            url: url,
            method: 'GET',
            JSON: true
        }, (err, res, body) => {
            if (err) {
                reject(err)
            }
            resolve(JSON.parse(body))
        })
    })
}

/** 删除菜单
 * 
 * @returns 
 */
Wechat.prototype.deleteMenu = async function() {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.menu.delete + '&access_token=' + data.access_token
        try {
            request({
                method: 'GET',
                url: url,
                JSON: true
            }, (err, res, body) => {
                var _data = JSON.parse(body);        
                resolve(_data);        
            })
        } catch (error) {
            reject(error)
        }

    })
}

/**创建菜单
 * 
 */
Wechat.prototype.createMenu = async function(menu) {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.menu.create + '&access_token=' + data.access_token
        var options = {
            method: 'POST',
            url: url,
            body: menu,
            JSON: true
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                resolve(_data);   
            })
        } catch (error) {
            reject(error)
        }
    })
}

/**获取菜单
 * getMenu
 */
Wechat.prototype.getMenu = async function() {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.menu.get + '&access_token=' + data.access_token;
        var options = {
            method: 'GET',
            url: url,
            JSON: true
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('Get Menu fails');
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
}

/**删除永久素材
 * deleteMaterial
 * @param {String} mediaId 
 * @returns 
 */

Wechat.prototype.deleteMaterial = async function(mediaId) {
    var that = this;
    var form = {
        media_id: mediaId
    }
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.permanent.del + '&access_token=' + data.access_token + '&media_id=' + madiaId
        var options = {
            method: 'POST',
            url: url,
            JSON: true,
            body: form
        }
        request(options, (err, res, body) => {
            if (err) {
                reject(err)
            }
            var _data = JSON.parse(body);
            resolve(_data);
        })
    })
}

/**上传素材
 * @param {String} type  素材格式/类型
 * @param {JSON} meterial 素材地址/articles结构(图文素材)
 * @param {JSON} permanent 非空上传永久素材
 * 
 * @returns 
 */
Wechat.prototype.uploadMaterial = async function(type, meterial, permanent) {
    var that = this;
    var form = {}
    var uploadUrl = api.temporary.upload //上传临时素材
    if (permanent) { //上传永久素材
        uploadUrl = api.permanent.upload //新增其他类型永久素材
        _.extend(form, permanent)
    }
    if (type === 'pic') {
        uploadUrl = api.permanent.uploadNewsPic //上传图文消息内的图片获取URL

    }
    if (type === 'news') { //新增永久图文素材
        uploadUrl = api.permanent.uploadNews
        form = meterial
    } else {
        form.media = fs.createReadStream(meterial)
    }
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = uploadUrl + '&access_token=' + data.access_token
        if (!permanent) {
            url += '&type=' + type;
        } else {
            form.access_token = data.access_token
        }
        var options = {
            method: 'POST',
            url: url,
            headers: {
                "content-type": "application/json",
            },
            JSON: true,
        }
        if (type === 'news') {
            options.body = JSON.stringify(form);
        } else {
            options.formData = form;
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('upload meaterial fails');
                }
            })
        } catch (error) {
            console.log(err)
        }

    })
}

/**删除素材
 * deleteMaterial
 * @param {String} mediaId 
 * @returns 
 */
Wechat.prototype.deleteMaterial = async function(mediaId) {
    var that = this;
    var form = {
        media_id: mediaId
    }
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.permanent.del + '&access_token=' + data.access_token + '&media_id=' + madiaId
        var options = {
            method: 'POST',
            url: url,
            JSON: true,
            body: form
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('Delete meaterial fails');
                }
            })
        } catch (error) {
            console.log(error)
        }

    })
}

/**更新素材
 * updateMaterial
 */
Wechat.prototype.updateMaterial = async function(media, news) {
    var that = this;
    var form = {
        media_id: mediaId
    }
    _.extend(form, news);
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.permanent.update + '&access_token=' + data.access_token + '&media_id=' + madiaId
        var options = {
            method: 'POST',
            url: url,
            JSON: true,
            body: form
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data);
                } else {
                    throw new Error('Upload meaterial fails')
                }
            })
        } catch (error) {
            console.log(error)
        }

    })
}

/**获取素材总数
 * countMaterial
 * @returns 
 */
Wechat.prototype.countMaterial = async function() {
    var that = this;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var options = {
            method: 'GET',
            url: url,
            JSON: true
        }
        try {
            request(options, (err, res, body) => {
                var _data = JSON.parse(body);
                if (err) {
                    reject(err)
                }
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('Count meaterial fails');
                }
            })
        } catch (error) {
            console.log(error)
        }

    })
}

/**获取素材
 * fetchMaterial
 * @param {String} mediaId 
 * @param {type} type 
 * @param {JSON} permanent 非空永久
 * @returns 
 */
Wechat.prototype.fetchMaterial = async function(mediaId, type, permanent) {
    var that = this;
    var fetchUrl = api.temporary.fetch;
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = fetchUrl + '&access_token=' + data.access_token + '&media_id=' + mediaId
        var form = {}
        var options = {
            method: 'POST',
            JSON: true
        }
        if (permanent) {
            fetchUrl = api.permanent.fetch
            form.media_id = mediaId;
            form.access_token = data.access_token;
            options.body = JSON.stringify(form);
            url = fetchUrl + '&access_token=' + data.access_token
        } else {
            if (type === 'video') { //临时视频素材获取
                url = url.replace('https://', 'http://')
            }
        }
        options.url = url
        if (type === "news" || type === "video") {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('Upload meaterial fails');
                }
            })
        } else {
            resolve(url)
        }
    })
}

/**获取素材列表
 * batchMaterial
 * @param {JSON} form  
 * {
 *  "type":TYPE,
 *  "offset":OFFSET,
 *  "count":COUNT
 * }
 * @returns 
 */
Wechat.prototype.batchMaterial = async function(form) {
    var that = this;
    form = {
        type: form.type || 'image',
        offset: form.offset || 0,
        count: form.count || 10
    }
    var data = await that.fetchAccessToken();
    return new Promise(function(resolve, reject) {
        var url = api.permanent.batch + '&access_token=' + data.access_token
        var options = {
            method: 'POST',
            url: url,
            body: form,
            JSON: true
        }
        try {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err)
                }
                var _data = JSON.parse(body);
                if (_data) {
                    resolve(_data)
                } else {
                    throw new Error('Batch meaterial fails');
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
}

/** 打包xml 返回发送信息
 * 
 */
Wechat.prototype.reply = function() {
    var content = this.body;
    var message = this.weixin;
    var xml = util.tpl(content, message);
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
    console.log(this.body)
}
module.exports = Wechat
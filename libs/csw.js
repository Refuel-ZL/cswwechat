'use strict'

var request = require("request")
var _ = require("lodash");

var realm = "http://220.170.155.240:9619/"
var cswapi = {
    getvarvalue: realm + 'getvarvalue?',
    getalarmlog: realm + 'alarmlog?'
}
module.exports = {
    getvarvalue: async function(meterial) {
        var url = cswapi.getvarvalue + 'varlist=' + JSON.stringify(meterial);
        var options = {
            method: 'GET',
            url: url,
            JSON: true
        };
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(body));
            });
        });
    },
    getalarmlog: async function(from, end, isLog, size) {
        var url = cswapi.getalarmlog + 'from=' + from + '&end=' + end + '&isLog=' + isLog + '&size=' + size;
        var options = {
            method: 'GET',
            url: url,
            JSON: true
        }
        console.log(url)
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                if (body) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(body);
                }

            });
        });


    },
    /** 
     * getvarvalue 获取实时数据
     * meterial
     * 
     * @param {any} meterial 
     */
    getvarvalue: async function(meterial) {
        return new Promise(function(resolve, reject) {
            var url = cswapi.getvarvalue + 'varlist=' + JSON.stringify(meterial);
            var options = {
                method: 'GET',
                url: url,
                JSON: true
            }
            request(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                if (body) {
                    resolve(JSON.parse(body));
                } else {
                    resolve(body);
                }

            });
        })
    }
}
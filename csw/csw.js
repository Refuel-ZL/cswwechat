'use strict'


var request = require("request")
var _ = require("lodash");
var config = require("../config");

var realm = "http://220.170.155.240:9619/"
var cswapi = {
    getvarvalue: realm + 'getvarvalue?',
    getalarmlog: realm + 'alarmlog?',
    setvarvalue: realm + "setvarvalue?"
}
module.exports = {
    getvarvalue: async function(meterial) {
        var url = cswapi.getvarvalue + 'varlist=' + JSON.stringify(meterial);
        var options = {
            method: 'POST',
            url: url,
            JSON: true,
        };
        return new Promise((resolve, reject) => {
            request.post(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(body));
            });
        });
    },
    setvarvalue: async function(meterial) {
        var url = cswapi.setvarvalue + 'varlist=' + JSON.stringify(meterial);
        var options = {
            method: 'POST',
            url: url,
            JSON: true,
        };
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        })

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
}
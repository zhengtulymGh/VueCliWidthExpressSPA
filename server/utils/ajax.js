var ajax = module.exports = {},
    _ = require('lodash'),
    when = require('when'),
    keys = require('when/keys'),
    request = require('request'),
    env = require('../config/env').env,
    log4js = require('log4js'),
    utils = require('./utils'),
    slice = Array.prototype.slice;
var requestLog = log4js.getLogger('request');

/*
 * @param url [string | object] 请求地址(必填)
 * @param options [object] 请求参数，第一个参数为对象时可以不传(选填)
 */
var _request = ajax.request = function(url, options) {
    // 请求开始时间
    var reqTimeStart = new Date();
    options = options || {};
    options.method = (options.method || 'GET').toUpperCase();
    options.strictSSL = false;
    // options.strictSSL = serverConfig.env.strictSSL;
    if (options.req) {
        // 只保留req中的headers部分与body部分
        //options.headers = _.extend({}, options.req.headers);
        //options.body = _.extend({}, options.req.body);
        // 添加请求ip
        options.body.reqip = utils.getClientIp(options.req);
        delete options.req;
    }
    if (options.method === 'POST' && !options.json) {
        options.json = true;
    }
    var deferred = when.defer();

    delete options.url;
    request(url, options, function(error, response, body) {
        var statusCode = response && response.statusCode || 500;
        var reqTimeEnd = new Date();
        var reqTimeTotal = (reqTimeEnd - reqTimeStart);
        if (!error && statusCode < 300) {
            try {
                if (typeof body === 'string') {
                    body = JSON.parse(body);
                }
            } catch (e) {
                // 解析异常
                requestLog.info(reqTimeTotal + 'ms', 'json parse error：【' + url + '】', JSON.stringify((options)), JSON.stringify(body));
                deferred.reject({
                    statusCode: 500,
                    error: new Error(body)
                });
                return deferred.promise;
            }
            requestLog.info(reqTimeTotal + 'ms', 'success：【' + url + '】', JSON.stringify((options)), JSON.stringify(body));
            deferred.resolve({body:body,response:response});
        } else {
            requestLog.info(reqTimeTotal + 'ms', 'fail：【' + url + '】', JSON.stringify((options)), JSON.stringify(error || body));
            deferred.reject({
                statusCode: statusCode,
                error: error || body || new Error('Holy shit!')
            });
        }
    });
    return deferred.promise;
};

// 调用promise方式处理多个异步请求
var _mRequest = function(options, cb) {
    if (_.isArray(options)) {
        return when.map(options, cb || _request);
    }
    if (_.isObject(options)) {
        return keys.map(options, cb || _request);
    }
};

// 定义串型请求方式
ajax.map = {};

// http请求方式
var verbs = ['get', 'head', 'post', 'put', 'patch', 'del', 'delete'];

// 遍历定义各种请求方式
verbs.forEach(function(verb) {
    var method = verb === 'del' ? 'DELETE' : verb.toUpperCase();
    ajax[verb] = function(url, options) {
        if (typeof url === 'object') {
            options = url;
            url = options.url;
        }
        options = options || {};
        options.method = options.method || method;
        return _request(url, options);
    };
    ajax.map[verb] = function(options) {
        if (arguments.length > 1) {
            options = slice.call(arguments, 0);
        }
        return _mRequest(options, ajax[verb]);
    };
});

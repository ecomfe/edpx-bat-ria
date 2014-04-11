/**
 * @file 处理edp-webserver的mockup相关功能
 * @author Justineo(justice360@gmail.com)
 */
var qs = require('querystring');
var logger = require('./logger');

var mockup = {};

/**
 * 获取mockup结果
 *
 * 对于请求path如果为/hello/world
 * 则对应的mockup数据文件位置为：mockup/hello/world.js
 *
 * @param {Object} request 请求对象
 * @return {?Object}
 */
mockup.load = function(request) {
    var path = request.pathname.replace(/^\/data/, '') || '';
    var pathSegments = path.split(/\//);
    var notEmptySegments = [];
    pathSegments.forEach(function (item) {
        item && notEmptySegments.push(item);
    });

    if (notEmptySegments.length > 1) {
        var filePath = notEmptySegments.join('/');

        try {
            var mockModuleName = '../mockup/' + filePath;
            delete require.cache[require.resolve(mockModuleName)];
            return require(mockModuleName);
        }
        catch (e) {
            logger.error('MOCKUP', 'MISS', path);
            return null;
        }
    }
    else {
        return null;
    }
}

mockup.getLocation = function () {
    return function (request) {
        // 对于非`data/`开头的请求不处理
        if (!/^\/data\//i.test(request.pathname)) {
            return false;
        }

        // 对于非post请求不处理
        if (!/post/i.test(request.method || '')) {
            return false;
        }

        // 对于referer没有ed参数的请求不处理
        if (!/[?&](?:ed|enable_debug)\b/i.test(request.headers.referer)) {
            return false;
        }

        // 需要载入mockup数据
        return true;
    };
};

mockup.getHandlers = function () {
    return function (context) {
        try {
            context.stop();

            var request = context.request;

            var reqHandler = mockup.load(request);
            if (!reqHandler) {
                return;
            }

            logger.ok('MOCKUP', 'FOUND', request.pathname);

            // 如果查询参数包含path信息，则默认使用该path
            var query = qs.parse(request.search.substr(1));
            var path;
            var reqHandlerKey;
            if (path = query.path) {
                logger.ok('MOCKUP', 'PATH', path);

                // 初始化对应的响应处理器名称，
                // e.g. GET/b/c其对应的处理器：get_b_c
                reqHandlerKey = path.replace(/\//g, '_').toLowerCase();
            }
            else {
                path = request.pathname;
                reqHandlerKey = 'response';
            }

            // parse url-encoded post params
            var postData = context.request.bodyBuffer || '';
            var reqBody = qs.parse(postData.toString());
            var data = reqHandler[reqHandlerKey](path, reqBody, context);

            var timeout = data.timeout;
            delete data.timeout;

            // 返回值未指定内容类型，默认按JSON格式处理返回
            if (!context.header['Content-Type']) {
                context.header['Content-Type'] = 'application/json;charset=UTF-8';
                context.content = JSON.stringify(data || {});
            }

            if (timeout) {
                setTimeout(function () {
                    context.start();
                }, timeout);
            }
            else {
                context.start();
            }

        }
        catch (e) {
            context.status = 500;
            logger.error('MOCKUP', 'ERROR', e.toString());
            context.start();
        }
    };
};

module.exports = exports = mockup;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */

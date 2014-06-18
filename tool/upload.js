/**
 * @file 处理edp-webserver的upload相关功能
 * @author Justineo(justice360@gmail.com)
 */
var mockup = require('./mockup');
var logger = require('./logger');
var fs = require('fs');
var multiparty = require('multiparty');

var upload = {};

upload.getLocation = function () {
    return /^\/data\/.+\/upload(?:$|\?)/;
};

function handler(context, uploadType) {
    context.stop();
    try {
        var request = context.request;
        var handler = mockup.load(request);

        if (handler) {
            request.pipe = function (dst) {
                dst.write(request.bodyBuffer);
                dst.end();
            };
            var form = new multiparty.Form();
            form.parse(request, function(err, fields, files) {
                if (err) {
                    logger.error('edp', 'ERROR', err.message.toString());
                    context.status = 500;
                    context.start();
                    return;
                }

                var timeout = handler.timeout;
                var fileInfo = files.filedata[0];

                if (!fs.existsSync('mockup/tmp/')) {
                    fs.mkdirSync('mockup/tmp/');
                }
                fs.rename(fileInfo.path, 'mockup/tmp/' + fileInfo.originalFilename);

                logger.ok('edp', 'OK', 'File `' + fileInfo.originalFilename + '` is saved');
                res = {
                    url: 'http://' + request.headers.host + '/mockup/tmp/' + fileInfo.originalFilename
                };
                data = handler.response(request.pathname, {
                    success: 'true',
                    callback: fields.callback[0],
                    fileName: fileInfo.originalFilename,
                    fileType: fileInfo.originalFilename.split('.').pop(),
                    result: res
                });

                context.content = data;
                context.header['Content-Type'] = 'text/html;charset=UTF-8';
                context.status = 200;

                if (timeout) {
                    setTimeout(function () {
                        context.start();
                    }, timeout);
                }
                else {
                    context.start();
                }
            });
        }
        else {
            logger.error('edp', 'ERROR', 'Mockup data not found for `' + request.pathname + '`');
            context.status = 404;
            context.start();
        }
    }
    catch (e) {
        logger.error('edp', 'ERROR', e.toString());
        context.status = 500;
        context.start();
    }
}

upload.getHandler = function () {
    return handler;
}

upload.getHandlers = function () {
    return [
        handler,
        proxyNoneExists()
    ]
};

module.exports = exports = upload;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */

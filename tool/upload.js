/**
 * @file 处理edp-webserver的upload相关功能
 * @author Justineo(justice360@gmail.com)
 */
var mockup = require('./mockup');
var logger = require('./logger');
var fs = require('fs');

/**
 * 同步保存文件到本地
 *
 * @param {string} path 要保存的文件目标路径
 * @param {string} data 要保存的文件的数据
 */
function writeFileSync(path, data) {
    if (fs.existsSync(path)) {

        // 已经存在，直接写入
        fs.writeFileSync(path, data, 'utf-8');
    }
    else {
        var segments = path.split('/');
        var checkPath = '.';

        // 检查目录是否存在，不存在就创建之
        for (var i = 0, len = segments.length - 1; i < len; i++) {
            checkPath += '/' + segments[i];

            if (!fs.existsSync(checkPath)) {
                fs.mkdirSync(checkPath);
            }
        }

        fs.writeFileSync(path, data, 'utf-8');
    }
}

var upload = {};

upload.getLocation = function () {
    return /^\/data\/.+\/upload$/;
};

upload.getHandlers = function () {
    return function(context, uploadType) {
        context.stop();
        try {
            var request = context.request;
            var handler = mockup.load(request);

            if (handler) {
                var postData = request.bodyBuffer || '';
                var reqBody = postData.toString();
                var fileReg = new RegExp(
                    /name="callback"[\r\n]*([\w\.\[\]'"]+)[\r\n]*[\s\S]+?filename="(.*?)\.([^\.]+?)"[\r\n]*Content\-Type: [a-zA-z\/\.\-]+?[\r\n]*([\s\S]+?)\-{6}/
                );
                var result = fileReg.exec(reqBody);
                var callback = (result && result[1]) || '';
                var fileName = (result && result[2]) || '';
                var fileType = (result && result[3]) || '';
                var fileData = (result && result[4]) || '';

                var data, res;
                var timeout = handler.timeout;
                if (!fileName || !fileData) {
                    logger.warn('edp', 'UPLOAD', 'File name or file data is null');
                    data = handler.response(request.pathname, { success: 'false', callback: callback });
                }
                else {
                    writeFileSync('../mockup/.tmp/' + fileName + fileType, fileData);
                    logger.ok('edp', 'UPLOAD', 'File `' + fileName + '.' + fileType + '` is saved');

                    res = {
                        url: request.headers.host + '/mockup/.tmp/' + fileName + '.' + fileType
                    };
                    data = handler.response(request.pathname, {
                        success: 'true',
                        callback: callback,
                        fileName: fileName,
                        fileType: fileType,
                        result: res
                    });
                }

                context.status = 200;
                context.header['Content-Type'] = 'text/html;charset=UTF-8';
                context.content = data;

                if (timeout) {
                    setTimeout(function () {
                        context.start();
                    }, timeout);
                }
                else {
                    context.start();
                }
            }
            else {
                logger.error('edp', 'ERROR', 'Mockup data found for `' + request.pathname + '`');
                context.status = 404;
                context.start();
            }
        }
        catch (e) {
            logger.error('edp', 'ERROR', e.toString());
            context.status = 500;
            context.start();
        }
    };
};

module.exports = exports = upload;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */

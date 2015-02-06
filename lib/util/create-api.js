/**
 * @file 生成 API 配置及其默认 mockup 模块
 * @author Justineo[justice360@gmail.com]
 */

var read = require('read');

var genApiConfig = require('./gen-api-config');
var genServerConfig = require('./gen-server-config');
var genMockup = require('./gen-mockup');

var chalk = require('edp-core').chalk;
var logger = require('bat-ria-tool/logger');

var apiTypes = [
    'ok', 'session', 'list', 'form',
    'global', 'field', 'upload', 'download', 'page'
];

function readName(apiName, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var apiName = (result || '').trim();

        if (!apiName) {
            readName(null, callback);
            return;
        }

        callback && callback(apiName);
    }

    if (!apiName) {
        logger.verbose('ria', 'INFO', 'Please enter <name> for `bat-ria create api`.');
        read({prompt: '<name>: '}, validate);
    }
    else {
        validate(null, apiName);
    }
}

function readPath(apiPath, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var apiPath = (result || '').trim().toLowerCase();

        if (!apiPath) {
            readPath(null, callback);
            return;
        }

        if (apiPath[0] !== '/') {
            apiPath = '/' + apiPath;
        }

        apiPath = '/data' + apiPath.replace(/^\/data(?=\/)/, '');

        if (!/^(\/?[a-z0-9_])+$/.test(apiPath)) {
            logger.error('ria', 'ERROR', '"' + apiPath + '" is not a valid <path> for `bat-ria create api`.');
            logger.warn('ria', 'WARN', '<path> should be something like `/data/promotion/173/list`.');
            readPath(callback);
            return;
        }

        callback && callback(apiPath);
    }

    if (!apiPath) {
        logger.verbose('ria', 'INFO', 'Please enter <path> for `bat-ria create api`.');
        read({prompt: '<path>: '}, validate);
    }
    else {
        validate(null, apiPath);
    }
}

function readType(apiType, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var apiType = (result || '').toLowerCase();

        if (!apiType) {
            readType(null, callback);
            return;
        }

        if (apiType.indexOf(apiType) === -1) {
            logger.error('ria', 'ERROR', '"' + apiType + '" is not a valid <type> for `bat-ria create api`.');
            readType(callback);
            return;
        }

        callback && callback(apiType);
    }

    if (!apiType) {
        logger.verbose('ria', 'INFO', 'Please enter <type> for `bat-ria create api`.');
        var types = [chalk.bold.green(apiTypes[0])].concat(apiTypes.slice(1));
        console.log(types.join(' | '));
        read({prompt: '<type>: ', 'default': 'ok'}, validate);
    }
    else {
        validate(null, apiType);
    }
}

function readPageLocation(apiLocation, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var apiLocation = (result || '').trim();

        if (!apiLocation) {
            readPageLocation(null, callback);
            return;
        }

        callback && callback(apiLocation);
    }

    if (!apiLocation) {
        logger.verbose('ria', 'INFO', 'Please enter <location> for `bat-ria create api`.');
        logger.verbose('ria', 'INFO', 'It can be a \'/path\' or a /RegExp/ which will be added into `edp-webserver-config.js`.');
        read({prompt: '<location>: '}, validate);
    }
    else {
        validate(null, apiLocation);
    }
}

function produce(projectInfo, apiName, apiPath, apiType, apiLocation) {

    // 到这里`apiPath`已保证是`/data/a/b/c`形式
    genApiConfig(projectInfo, {
        apiName: apiName,
        apiPath: apiPath,
        apiType: apiType
    });

    // 如果是page，需要添加一个规则
    if (apiType === 'page') {
        genServerConfig(projectInfo, {
            apiLocation: apiLocation
        });
    }

    // 根据模板创建mockup文件，download类型不需要创建
    if (apiType !== 'download') {
        genMockup(projectInfo, {
            apiName: apiName,
            apiPath: apiPath,
            apiType: apiType
        });
    }
}

/**
 * 生成API
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function (projectInfo, args) {
    var apiName = args[1];
    var apiPath = args[2];
    var apiType = args[3];
    var apiLocation = args[4];

    readName(apiName, function (name) {
        readPath(apiPath, function (path) {
            readType(apiType, function (type) {
                if (type === 'page') {
                    readPageLocation(apiLocation, function (location) {
                        produce(projectInfo, name, path, type, location);
                    });
                }
                else {
                    produce(projectInfo, name, path, type);
                }
            });
        });
    });
};

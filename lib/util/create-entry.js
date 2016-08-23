/**
 * @file 生成入口页面
 * @author Justineo[justice360@gmail.com]
 */

var read = require('read');
var path = require('path');
var fs = require('fs');

var logger = require('bat-ria-tool/logger');

function readName(entries, entryName, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var entryName = (result || '').trim();

        if (!entryName) {
            readName(null, callback);
            return;
        }
        else if (entries.indexOf(entryName) !== -1) {
            logger.error('ria', 'ERROR', 'Entry "' + result + '" already exists.');
            readName(entries, null, callback);
            return;
        }

        callback && callback(entryName);
    }

    if (!entryName) {
        logger.verbose('ria', 'INFO', 'Please enter <name> for `bat-ria create entry`.');
        read({ prompt: '<name>: ' }, validate);
    }
    else {
        validate(null, entryName);
    }
}

function produce(projectInfo, entryName, options) {
    options.entryName = entryName;

    require('./gen-main-module')(projectInfo, options);
    require('./gen-index')(projectInfo, options);
    require('./gen-entry-main-less')(projectInfo, options);
    require('./create-action')(projectInfo, ['action', '/dev/index', entryName], options);
}

/**
 * 生成入口页
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 * @param {Object} options 命令运行选项
 */
module.exports = function (projectInfo, args, options) {
    var entryName = args[1];

    var entryDir = path.resolve(projectInfo.dir, 'entry');
    if (fs.existsSync(entryDir)) {
        var entries = fs.readdirSync(entryDir).map(function (entry) {
            return entry.replace(/\.html$/, '');
        });

        readName(entries, entryName, function (name) {
            produce(projectInfo, name, options);
        });
    }
    else {
        logger.error('ria', 'ERROR', 'Your project is not a multi-entry project.');
    }
};

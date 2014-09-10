/**
 * @file 生成入口页面
 * @author Justineo[justice360@gmail.com]
 */

var read = require('read');
var logger = require('../../tool/logger');
var path = require('path');
var fs = require('fs');

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

function produce(projectInfo, entryName) {
    var options = {
        entryName: entryName
    };

    require('../../lib/util/gen-main-module')(projectInfo, options);
    require('../../lib/util/gen-index')(projectInfo, options);
    require('../../lib/util/gen-entry-main-less')(projectInfo, options);
    require('../../lib/util/create-action')(projectInfo, ['action', '/dev/index', entryName]);
}

/**
 * 生成入口页
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function (projectInfo, args) {
    var entryName = args[1];

    var entryDir = path.resolve(projectInfo.dir, 'entry');
    if (fs.existsSync(entryDir)) {
        var entries = fs.readdirSync(entryDir).map(function (entry) {
            return entry.replace(/\.html$/, '');
        });

        readName(entries, entryName, function (name) {
            produce(projectInfo, name);
        });
    }
    else {
        logger.error('ria', 'ERROR', 'Your project is not a multi-entry project.');
    }
};

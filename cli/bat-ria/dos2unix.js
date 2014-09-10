/**
 * 更新本地工具
 *
 * @ignore
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'dos2unix';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '换行转换命令';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [];

var isBinary = require('edp-core').fs.isBinary;
var read = require('read');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var logger = require('bat-ria-tool/logger');

function readConfirm(callback) {
    logger.verbose('ria', 'INFO', '`bat-ria dos2unix` will overwrite all files under current directory. Proceed?');
    read({
        prompt: 'Y / N: ',
        'default': 'N'
    }, function (err, result, isDefault) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        result = result.toLowerCase();

        if (['y', 'yes', 'n', 'no'].indexOf(result) === -1) {
            readConfirm(callback);
        }
        else {
            var confirmed = result === 'y' || result === 'yes';

            if (confirmed) {
                callback && callback();
            }
            else {
                logger.info('ria', 'INFO', 'Convert canceled.');
            }
        }
    });
}

function eachFile(item, callback) {
    var stat = fs.statSync(item);

    if (stat.isDirectory()) {
        fs.readdirSync(item).forEach(function (file) {
            eachFile(item + '/' + file, callback);
        });
    }
    else if (stat.isFile() && !isBinary(fs.readFileSync(item))) {
        callback(item);
    }
}

/**
 * 模块命令行运行入口
 *
 * @param {Array} args 命令运行参数
 */
cli.main = function (args) {
    var dir = process.cwd();

    readConfirm(function () {
        eachFile(dir, function (file) {
            var content = require('../../lib/util/read-file')(file);

            var sourceHash = crypto.createHash('md5').update(content).digest('hex');

            content = content.replace(/\r\n/g, '\n');
            var targetHash = crypto.createHash('md5').update(content).digest('hex');

            if (sourceHash !== targetHash) {
                console.log('M %s', path.relative(process.cwd(), file));
                fs.writeFileSync(file, content);
            }
        });
    });
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

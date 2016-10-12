/**
 * @file 生成锦囊风格的auth配置
 * @author chesnutchen[mini.chenli@gmail.com]
 */

var path = require('path');
var fs = require('fs');
var read = require('read');
var logger = require('bat-ria-tool/logger');
var genAuth = require('./gen-auth');

function readAction(callback) {
    logger.verbose('ria', 'INFO',
        'File `modules.json` found. Do you want to use it to create `modules_tree.txt` and `auth.txt`?');
    read({prompt: '<Y/N>: '}, function (err, result) {
        return callback(result === 'Y' || result === 'y');
    });
}

/**
 * 生成auth
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 * @param {Object} options 命令运行选项
 */
module.exports = function (projectInfo, args, options) {
    var configPath = path.resolve(projectInfo.dir, 'src/common/config.js');
    var modulesPath = path.resolve(projectInfo.dir, 'modules.json');
    if (fs.existsSync(configPath)) {
        if (fs.existsSync(modulesPath)) {
            readAction(function (isCreateAuth) {
                genAuth(projectInfo, {
                    configPath: configPath,
                    isESNext: options.isESNext,
                    isCreateAuth: isCreateAuth
                });
            });
        }
        else {
            genAuth(projectInfo, {
                configPath: configPath,
                isESNext: options.isESNext,
                isCreateAuth: false
            });
        }
    }
    else {
        logger.error('ria', 'ERROR', 'Could not find common config file.');
    }
};

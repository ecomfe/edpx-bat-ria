/**
 * @file 生成锦囊风格的auth配置
 * @author chesnutchen[mini.chenli@gmail.com]
 */

var path = require('path');
var fs = require('fs');
var logger = require('bat-ria-tool/logger');
var genAuth = require('./gen-auth');

/**
 * 生成auth
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 * @param {Object} options 命令运行选项
 */
module.exports = function (projectInfo, args, options) {
    var configPath = path.resolve(projectInfo.dir, 'src/common/config.js');
    if (fs.existsSync(configPath)) {
        genAuth(projectInfo, {
            configPath: configPath,
            isESNext: options.isESNext
        });
    }
    else {
        logger.error('ria', 'ERROR', 'Could not find common config file.');
    }
};

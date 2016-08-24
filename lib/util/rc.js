/**
 * @file 设置 edpx-bat-ria 配置
 * @author Justineo[justice360@gmail.com]
 */

var path = require('path');
var fs = require('fs');

/**
 * 设置配置
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {string} key 配置项名
 * @param {*=} value 配置项值
 */
module.exports = function (projectInfo, key, value) {
    var configFile = path.resolve(projectInfo.dir, '.batriarc');
    var config = {};

    if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    }

    if (typeof key === 'undefined') {
        return config;
    }

    if (typeof value === 'undefined') {
        return config[key];
    }

    config[key] = value;
    fs.writeFileSync(configFile, JSON.stringify(config, null, '    '), 'utf8');
};

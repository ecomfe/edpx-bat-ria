/**
 * @file 生成Server Config配置
 * @author chestnutchen[mini.chenli@gmail.com]
 */

var path = require('path');

/**
 * 生成API配置
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.apiLocation API的配置项名称
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        var apiLocation = options.apiLocation;

        var configFile = path.resolve(projectInfo.dir, 'edp-webserver-config.js');

        var fs = require('fs');
        if (fs.existsSync(configFile)) {
            var configContent = fs.readFileSync(configFile, 'utf8').replace(
                /(\s*)\{\s*\n(\s*).+cors\.getLocation/,
                function (match, indent, indentMore) {
                    return ''
                        + indent + '{\n'
                        + indentMore + 'location: page.getLocation(' + apiLocation + '),\n'
                        + indentMore + 'handler: page.getHandlers()'
                        + indent + '},'
                        + match;
                }
            );

            console.log('M %s', path.relative(process.cwd(), configFile));

            fs.writeFileSync(configFile, configContent, 'utf8');
        }
    }
);

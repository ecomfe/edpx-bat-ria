/**
 * @file 生成Action在entry主模块spec中的配置
 * @author Justineo(justice360@gmail.com)
 */

var moduleToFile = require('./module-to-file');

var logger = require('bat-ria-tool/logger');

/**
 * 生成Action单测
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string=} options.entryName Action的entry名称
 * @param {string} options.pagePath Action的访问路径
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        // 尝试在entry主模块spec文件中，加入action配置
        // 先读取actionsConfig中路径和模块的映射关系
        var fs = require('fs');
        var path = require('path');

        var entry = options.entryName || 'common';
        var pagePath = options.pagePath;
        var configFile = path.resolve(projectInfo.dir, 'test/specs', entry, 'main.js');

        if (fs.existsSync(configFile)) {
            var configContent = fs.readFileSync(configFile, 'utf8').replace(
                /\n(\s*)var\s+actionPaths\s+=\s+\[\s*(\])?/,
                function ($0, indent, end) {
                    var indentUnit = indent[0] === '\t'
                        ? '\t'
                        : '    ';
                    var indent1 = indent + indentUnit;

                    return (end
                            ? $0.slice(0, $0.length - 1)
                            : $0.replace(/\s*$/, '')
                           )
                        + '\n'
                        + indent1 + '\'' + pagePath + '\''
                        + (end ? '' : ',')
                        + '\n' + indent
                        + (end ? ']' : indentUnit);

                }
            );

            fs.writeFileSync(configFile, configContent, 'utf8');
            console.log('M %s', path.relative(process.cwd(), configFile));
        }
    }
);

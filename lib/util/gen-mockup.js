/**
 * @file 生成API配置
 * @author Justineo[justice360@gmail.com]
 */

var path = require('path');
var fs = require('fs');

/**
 * 生成API对应的mockup模块
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.apiPath API对应的路径
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        var apiPath = options.apiPath.replace(/^\/data(?=\/)/, '');
        var apiType = options.apiType;

        var mockupFile = path.resolve(projectInfo.dir, 'mockup' + apiPath + '.js');
        var toolModule = 'bat-ria-tool/mockup';

        // page的额外逻辑
        if (apiType === 'page') {
            var pageFile = mockupFile.replace(/js$/, 'html');
            if (!fs.existsSync(pageFile)) {
                /* eslint-disable fecs-indent */
                require('./write-file')(pageFile, [
                    '<!DOCTYPE html>\n',
                    '<html>\n',
                    '    <head>\n',
                    '        <meta charset="utf-8" />\n',
                    '    </head>\n',
                    '    <body>\n',
                    '        Hello World!\n',
                    '    </body>\n',
                    '</html>'
                ].join(''));
            }
        }

        var data = {
            toolModule: toolModule,
            type: apiType
        };

        // merge模版并生成文件
        require('./merge-tpl')(
            options.genTemplate || 'mockup.tpl',
            data,
            mockupFile
        );

    }
);

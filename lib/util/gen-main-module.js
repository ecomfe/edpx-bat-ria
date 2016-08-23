/**
 * @file 生成系统主模块
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成系统主模块
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        var mergeTpl = require('./merge-tpl');
        var path = require('path');

        var moduleFile;
        if (options.entryName) {
            moduleFile = 'src/' + options.entryName + '/main.js';
        }
        else {
            moduleFile = 'src/common/main.js';
        }

        // merge模版并生成文件
        mergeTpl(
            options.genTemplate || (options.isESNext ? 'main-module.esnext.tpl' : 'main-module.tpl'),
            {},
            path.resolve(projectInfo.dir, moduleFile)
        );
    }
);

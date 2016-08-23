/**
 * @file 生成全局常量模块
 * @author Justineo[justice360@gmail.com]
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

        // merge模版并生成文件
        mergeTpl(
            options.genTemplate || (options.isESNext ? 'constants.esnext.tpl' : 'constants.tpl'),
            {},
            path.resolve(projectInfo.dir, 'src/common/constants.js')
        );
    }
);

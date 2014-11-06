/**
 * @file 生成测试配置
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成全局测试配置
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
            options.genTemplate || 'test/test-config.tpl',
            {},
            path.resolve(projectInfo.dir, 'test', 'config.js')
        );
    }
);

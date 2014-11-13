/**
 * @file 生成Action在entry主模块spec中的配置
 * @author Justineo(justice360@gmail.com)
 */

/**
 * 生成Action单测
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.fullModule Action的完整模块ID
 * @param {string} options.type Action的类型
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        var path = require('path');
        var mergeTpl = require('./merge-tpl');

        var mod = options.fullModule;

        // merge模版并生成文件
        mergeTpl(
            options.genTemplate || 'test/action-spec.tpl',
            options,
            path.resolve(projectInfo.dir, 'test/specs', mod + '.js')
        );

        // merge模版并生成文件
        mergeTpl(
            options.genTemplate || 'test/model-spec.tpl',
            options,
            path.resolve(projectInfo.dir, 'test/specs', mod + 'Model.js')
        );

        // merge模版并生成文件
        mergeTpl(
            options.genTemplate || 'test/view-spec.tpl',
            options,
            path.resolve(projectInfo.dir, 'test/specs', mod + 'View.js')
        );
    }
);

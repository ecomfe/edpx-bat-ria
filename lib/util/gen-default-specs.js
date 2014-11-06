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
        var entryName = options.entryName;
        var common = 'common';
        var specTpls = {
            main: 'test/main-spec.tpl',
            config: 'test/config-spec.tpl',
            constants: 'test/constants-spec.tpl'
        };

        var specs = {
            main: (entryName || common) + '/main.js',
            config: common + '/config.js',
            constants: common + '/constants.js'
        };

        Object.keys(specs).forEach(function (item) {
            var target = path.resolve(projectInfo.dir, 'test', 'specs', specs[item]);
            mergeTpl(
                specTpls[item],
                {
                    entryName: entryName || common
                },
                target
            );
        });
    }
);

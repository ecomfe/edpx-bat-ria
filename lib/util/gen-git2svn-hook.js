/**
 * @file 生成git2svn hook的逻辑
 * @author chestnut[mini.chenli@gmail.com]
 */

/**
 * 生成build-config和build.sh
 * 在git2svn的过程中生成一份main.css提供给rd本地调试
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
            options.genTemplate || 'git2svn-build-config.tpl',
            {},
            path.resolve(projectInfo.dir, 'edp-build-config-git2svn.js')
        );
        mergeTpl(
            options.genTemplate || 'git2svn-build.tpl',
            {},
            path.resolve(projectInfo.dir, 'git2svn_hook.sh')
        );
    }
);

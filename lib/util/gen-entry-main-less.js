/**
 * @file 生成入口页主less文件
 * @author Justineo[justice360@gmail.com]
 */

/**
 * 生成入口页主less文件
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        // merge模版并生成文件
        var path = require('path');
        require('./merge-tpl')(
            options.genTemplate || 'entry-main-less.tpl',
            {},
            path.resolve(projectInfo.dir, 'src/' + options.entryName + '/main.less')
        );
    }
);

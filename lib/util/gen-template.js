/**
 * @file 生成ER View对应的模板
 * @author Justineo[justice360@gmail.com]
 */
var edp = require( 'edp-core' );

/**
 * 生成ER View对应的模板
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.file 对应模版文件
 * @param {string} options.target 对应模板的target名称
 * @param {string} options.classes 对应模板主元素的类名
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var file = options.file;
        var target = options.target;
        var data = edp.util.extend( options, {
            target: target,
            classes: options.classes
        });

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'template.tpl',
            data,
            file
        );
    }
);

/**
 * @file 生成样式文件
 * @author Justineo[justice360@gmail.com]
 */
var edp = require( 'edp-core' );

/**
 * 生成样式
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.mainClass Action对应的模板主元素类名
 * @param {string} options.file 对应样式文件
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var file = options.file;

        var data = edp.util.extend( options, {
            mainClass: options.mainClass
        });

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'style.tpl',
            data,
            file
        );
    }
);


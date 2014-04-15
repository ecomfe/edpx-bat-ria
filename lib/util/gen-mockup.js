/**
 * @file 生成API配置
 * @author Justineo[justice360@gmail.com]
 */

var path = require( 'path' );

/**
 * 生成API对应的mockup模块
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.apiPath API对应的路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var apiPath = options.apiPath;
        var apiType = options.apiType;

        var mockupFile = path.resolve( projectInfo.dir, 'mockup' + apiPath + '.js' );
        var toolModule = Array( apiPath.split( '/' ).length ).join( '../' ) + 'tools/mockup';

        var data = {
            toolModule: toolModule,
            type: apiType
        };

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'mockup.tpl',
            data,
            mockupFile
        );
    }
);

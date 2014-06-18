/**
 * @file 生成View
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成View
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.module View的模块id
 * @param {string} options.templateFile 对应ER模版文件
 * @param {string} options.templateTarget 对应ER模板的target名称
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var moduleToFile = require( './module-to-file' );
        var upFirstAlpha = require( './up-first-alpha' );

        var view = options.module;
        var entryName = options.entryName;
        var viewSegs = view.split( '/' );
        for ( var i = 0; i < viewSegs.length; i++ ) {
            var seg = viewSegs[ i ];
            viewSegs[ i ] = upFirstAlpha( seg );
        }
        var viewName = viewSegs.join( '' );

        var viewFile = moduleToFile(
            projectInfo,
            ( entryName ? entryName + '/' : '' ) + view
        );
        var templateFile = options.templateFile 
            || './' + viewSegs[viewSegs.length - 1].toLowerCase() + '.tpl.html';
        var templateTarget = options.templateTarget 
            || viewName[0].toLowerCase() + viewName.slice(1).replace(/View$/, '');
    
        var data = {
            view: viewName,
            templateFile: templateFile,
            templateTarget: templateTarget,
            type: options.type
        };

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'view.tpl',
            data,
            viewFile
        );
    }
);


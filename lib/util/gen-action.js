/**
 * @file 生成Action
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成Action
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.module Action的模块id
 * @param {string=} options.model Model的模块id
 * @param {string=} options.view View的模块id
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var moduleToFile = require( './module-to-file' );

        var action = options.module;
        var actionSegs = action.split( '/' );
        for ( var i = 0; i < actionSegs.length; i++ ) {
            var seg = actionSegs[ i ];
            actionSegs[ i ] = seg[ 0 ].toUpperCase() + seg.slice( 1 );
        }

        var actionFile = moduleToFile( projectInfo, action );
        var actionName = actionSegs[ actionSegs.length - 1 ];
        var fullActionName = actionSegs.join( '' );

        var model = options.model || './' + actionName + 'Model';
        var view = options.view || './' + actionName + 'View';
        
        var data = {
            model: model,
            view: view,
            action: fullActionName,
            type: options.type
        };

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'action.tpl',
            data,
            actionFile
        );
    }
);

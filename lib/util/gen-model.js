/**
 * @file 生成Model
 * @author errorrik[errorrik@gmail.com]
 */


/**
 * 生成Model
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.module Model的模块id
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var moduleToFile = require( './module-to-file' );
        var upFirstAlpha = require( './up-first-alpha' );

        var model = options.module;
        var modelSegs = model.split( '/' );
        for ( var i = 0; i < modelSegs.length; i++ ) {
            var seg = modelSegs[ i ];
            modelSegs[ i ] = upFirstAlpha( seg );
        }

        var modelFile = moduleToFile( projectInfo, model );
        var data = {
            model: modelSegs[ modelSegs.length - 1 ],
            type: options.type
        };

        // merge模版并生成文件
        require( './merge-tpl' )(
            options.genTemplate || 'model.tpl',
            data,
            modelFile
        );
    }
);

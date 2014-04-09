/**
 * @file merge模版
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * merge模版
 * 
 * @param {string} tplFile 模版文件路径，默认相对tpl目录
 * @param {Object} data 模版数据
 * @param {string=} toFile 写入文件
 * @param {boolean=} override 是否覆盖现有文件写入
 * @return {string}
 */
module.exports = function ( tplFile, data, toFile, override ) {
    var compileHandlebars = require( './compile-handlebars' );
    var path = require( 'path' );

    tplFile = path.resolve( __dirname, '../../tpl', tplFile );
    var tpl = compileHandlebars.fromFile( tplFile );
    data = data || {};
    require( './inject-base-data' )( data );
    var result = tpl( data );

    if ( toFile ) {
        var fs = require( 'fs' );

        if ( !fs.existsSync( toFile ) || override ) {
            require( './write-file' )( toFile, result );
        }
    }

    return result;
};

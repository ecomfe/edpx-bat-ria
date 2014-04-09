/**
 * @file 写入文件
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 写入文件
 * 
 * @param {string} file 文件路径
 * @param {string=} data 文件内容
 * @param {string=} encoding 文件编码，默认utf8
 */
module.exports = function ( file, data, encoding ) {
    encoding = encoding || 'utf8';

    var fs = require( 'fs' );
    require( 'mkdirp' ).sync( require( 'path' ).dirname( file ) );
    console.log( '+ %s', file );
    return fs.writeFileSync( file, data, encoding );
};

/**
 * @file 读取文件
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 读取文件
 * 
 * @param {string} file 文件路径
 * @param {string=} encoding 文件编码，默认utf8
 * @return {string}
 */
module.exports = function ( file, encoding ) {
    encoding = encoding || 'utf8';

    var fs = require( 'fs' );
    return fs.readFileSync( file, encoding );
};

/**
 * @file 为模版merge的数据注入基础数据项
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 为模版merge的数据注入基础数据项
 * 
 * @param {Object} data 模版数据
 * @return {Object}
 */
module.exports = function ( data ) {
    data = data || {};

    var edpConfig = require( 'edp-config' );
    var author = edpConfig.get( 'user.name' );
    var authorEmail = edpConfig.get( 'user.email' );

    data.author = data.author || author;
    data.authorEmail = data.authorEmail || authorEmail;
    data.fileDescription = data.fileDescription 
        || '[Please Input File Description]';

    return data;
}; 

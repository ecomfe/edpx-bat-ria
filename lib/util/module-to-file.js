/**
 * @file 获取module的文件路径
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 获取module的文件路径
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {string} moduleId 模版id
 * @return {string}
 */
module.exports = function ( projectInfo, moduleId ) {
    if ( !projectInfo ) {
        return;
    }

    var path = require( 'path' );
    return path.resolve( projectInfo.dir, 'src', moduleId ) + '.js';
};

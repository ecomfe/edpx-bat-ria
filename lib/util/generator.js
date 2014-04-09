/**
 * @file 产生生成器
 * @author errorrik[errorrik@gmail.com]
 */


/**
 * 产生生成器
 * 
 * @param {Function} genFunc 生成函数
 * @return {Function}
 */
module.exports = function ( genFunc ) {
    return function ( projectInfo, options ) {
        if ( projectInfo ) {
            options = options || {};
            genFunc( projectInfo, options );
        }
    };
};

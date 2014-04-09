/**
 * @file 将字符串首字母变成大写
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 将字符串首字母变成大写
 * hello_world_show_case -> HelloWorldShowCase
 * 
 * @param {string} source 源字符串
 * @return {string}
 */
module.exports = function ( source )  {
    source = source[ 0 ].toUpperCase() + source.slice( 1 );
    source = source.replace(/_([a-z])/, function(m, $1) {
        return $1.toUpperCase();
    });
    return source;
};

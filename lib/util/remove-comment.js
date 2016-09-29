/**
 * @file 清除注释
 * @author chesnutchen[mini.chenli@gmail.com]
 */

/**
 * 清除注释
 *
 * 单行注释需要符合规范，//需要位于行首或者前后都有空格
 * 符合规范的单行注释应该可以很大程度避免误伤的，带协议的url反正没问题
 *
 * @param  {string} str 需要清除注释的内容
 * @return {string}     清除后的内容
 */
module.exports = function (str) {
    return str.replace(/(?:^|\s+)\/\/\s.*\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');
};

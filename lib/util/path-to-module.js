/**
 * @file 根据Action路径获取module ID
 * @author Justineo(justice360@gmail.com)
 */

var upFirstAlpha = require('./up-first-alpha');

/**
 * 获取module的文件路径
 *
 * @param {string} pagePath Action路径
 * @param {string} entryName Action所在的entry
 * @return {string}
 */
module.exports = function (pagePath, entryName) {
    if (!pagePath) {
        return '';
    }

    var pathSeg = pagePath.replace(/^\//, '').split('/');
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[lastIndex];
    pathSeg[lastIndex] = upFirstAlpha(templateName);

    var action = pathSeg.join('/');
    return (entryName ? entryName + '/' : '') + action;
};

/**
 * @file 数组去重
 * @author chesnutchen[mini.chenli@gmail.com]
 */

/**
 * 数组去重
 *
 * @param  {Array} arr  数组
 * @return {Array}      去重后数组
 */
module.exports = function (arr) {
    var arrMap = {};
    var uniqueArr = [];
    arr.forEach(function (item) {
        var type = typeof item;
        if (!arrMap[item]) {
            uniqueArr.push(item);
            arrMap[item] = [type];
        }
        else if (arrMap[item].indexOf(type) === -1) {
            uniqueArr.push(item);
            arrMap[item].push(type);
        }
    });
    return uniqueArr;
};

/**
 * @file 编译handlebars模板
 * @author errorrik[errorrik@gmail.com]
 */

var Handlebars = require('handlebars');

// 添加针对hash参数的forEach循环遍历
Handlebars.registerHelper('forEach', function (context, options) {
    var res = [];
    var items = [];
    for (var key in context) {
        if (context.hasOwnProperty(key)) {
            items.push({ key: key, value: context[key] });
        }
    }

    for (var i = 0, item; !!(item = items[i]); i++) {
        item.last = i >= items.length - 1;
        res.push(options.fn(item));
    }
    return res.join('');
});

Handlebars.registerHelper('eq', function(lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error('Handlebars Helper equal needs 2 parameters');
    }

    if (lvalue !== rvalue) {
        return options.inverse(this);
    }
    else {
        return options.fn(this);
    }
});

Handlebars.registerHelper('neq', function(lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error('Handlebars Helper equal needs 2 parameters');
    }

    if (lvalue !== rvalue) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});

/**
 * 编译handlebars模板
 *
 * @param {string} source 模板源串
 * @return {Function}
 */
module.exports = exports = function (source) {
    return Handlebars.compile(source);
};

/**
 * 从文件编译handlebars模板
 *
 * @param {string} file 模板文件
 * @param {string=} encoding 编码格式，默认utf-8
 * @return {Function}
 */
exports.fromFile = function (file, encoding) {
    encoding = encoding || 'UTF-8';

    var fs = require('fs');
    var source = fs.readFileSync(file, encoding);

    return exports(source);
};


/**
 * @file 处理格式化日志输出
 * @author Justineo(justice360@gmail.com)
 */
var chalk = require('chalk');

function log(mod, status, msg, color) {
    var paint = chalk[color] || function(msg) { return msg };
    console.log(mod + ' ' + paint(status) + ' ' + msg);
}

var logger = {
    info: log,
    ok:  function(mod, status, msg) {
        log(mod, status, msg, 'green');
    },
    warn: function(mod, status, msg) {
        log(mod, status, msg, 'yellow');
    },
    error: function(mod, status, msg) {
        log(mod, status, msg, 'red');
    }
};

module.exports = exports = logger;




















/* vim: set ts=4 sw=4 sts=4 tw=100: */

/**
 * @file bat-ria主命令
 * @author Justineo[justice360@gmail.com]
 */

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '品牌广告业务端脚手架';

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function (args) {
    console.log( 'See `edp bat-ria --help`' );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

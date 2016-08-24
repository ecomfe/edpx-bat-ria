/**
 * 创建内容
 *
 * @ignore
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'create';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加新内容';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [
    'esnext:'
];

var chalk = require('edp-core').chalk;
var read = require('read');
var logger = require('bat-ria-tool/logger');

var creators = {
    action: require('../../lib/util/create-action'),
    api: require('../../lib/util/create-api'),
    entry: require('../../lib/util/create-entry'),
    test: require('../../lib/util/create-test')
};
var typeCreator = {
    action: 'action',
    base: 'action',
    list: 'action',
    form: 'action',
    api: 'api',
    entry: 'entry',
    test: 'test'
};

function readType(callback) {
    logger.verbose('ria', 'INFO', 'Please enter <type> for `bat-ria create`.');
    console.log(chalk.bold.green('action') + ' | list | form | api | entry | test');
    read({
        prompt: '<type>: ',
        'default': 'action'
    }, function (err, result, isDefault) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var type = result.toLowerCase();

        if (!typeCreator[type]) {
            logger.error('ria', 'ERROR', '"' + type + '" is not a valid type for `bat-ria create`.');
            readType(callback);
            return;
        }

        callback && callback(type);
    });
}

/**
 * 模块命令行运行入口
 *
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function (args, opts) {
    var dir = process.cwd();
    var edpProject = require('edp-project');
    var projectInfo = edpProject.getInfo(dir);

    if (!projectInfo) {
        logger.error('ria', 'ERROR', 'Project info is not found.');
        return;
    }

    var config = require('../../lib/util/rc')(projectInfo);
    var isESNext = config.esnext;

    if ('esnext' in opts) {
        isESNext = opts['esnext'] !== 'false';
    }

    var options = {
        isESNext: isESNext
    };

    var type = args[0];
    // no `<type>` specified
    if (!type) {
        readType(function (type) {
            args[0] = type;
            creators[typeCreator[type]](projectInfo, args, options);
        });
    }
    else {
        creators[typeCreator[type]](projectInfo, args, options);
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

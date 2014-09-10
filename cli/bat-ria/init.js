/**
 * 初始化系统代码框架
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
cli.command = 'init';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化品牌广告业务端项目';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp bat-ria init';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [];

var read = require('read');
var logger = require('../../tool/logger');

function readEntry(callback) {
    logger.verbose('ria', 'INFO', 'Are you going to initialize a multi-entry project?');
    read({
        prompt: 'Y / N: ',
        'default': 'N'
    }, function (err, result, isDefault) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        result = result.toLowerCase();

        if (['y', 'yes', 'n', 'no'].indexOf(result) === -1) {
            readEntry(callback);
        }
        else {
            var isMulti = result === 'y' || result === 'yes';

            if (isMulti) {
                readEntryName(callback);
            }
            else {
                callback && callback('');
            }
        }
    });
}

function readEntryName(callback) {
    logger.verbose('ria', 'INFO', 'Please enter <name> for the first entry.');

    read({
        prompt: '<name>: '
    }, function (err, result, isDefault) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        if (!result) {
            readEntryName(callback);
        }
        else {
            callback && callback(result);
        }
    });
}

/**
 * 模块命令行运行入口
 *
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function (args, opts) {
    var path = require('path');
    var dir = args[0];
    if (dir) {
        dir = path.resolve(dir);
    }
    else {
        dir = process.cwd();
    }

    readEntry(function (entry) {

        var edpProject = require('edp-project');
        var projectInfo = edpProject.init(dir);
        edpProject.build.createConfigFile(projectInfo);

        var mkdirp = require('mkdirp');
        mkdirp.sync(path.resolve(dir, 'src/common'));

        entry = entry || '';

        var options = {
            entryName: entry
        };

        require('../../lib/util/gen-main-module')(projectInfo, options);
        require('../../lib/util/gen-common-config')(projectInfo, options);
        require('../../lib/util/gen-constants')(projectInfo);
        require('../../lib/util/gen-webserver-config')(projectInfo);

        var copies = [
            { source: '../../img', target: 'src/common/img' },
            { source: '../../css', target: 'src/common/css' }
        ];
        require('../../lib/util/copy')(projectInfo, copies);

        var Deferred = require('edp-core').Deferred;
        var edpPackage = require('edp-package');

        var spawn = process.env.comspec ? function (command, args, options) {
            var spawn = require('child_process').spawn;
            return spawn(
                process.env.comspec,
                ['/c', command].concat(args),
                options
            );
        } : function (command, args, options) {
            var spawn = require('child_process').spawn;
            return spawn(command, args, options);
        };

        function npmInstall(pkg) {
            return function () {
                var deferred = new Deferred();
                var options = {
                    stdio: 'inherit'
                };

                var npm = spawn('npm', ['install', pkg], options);

                npm.on('close', function (code) {
                    if (code !== 0) {
                        deferred.reject();
                    }
                    else {
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            };
        }

        function edpImport(pkg) {
            return function () {
                var deferred = new Deferred();

                edpPackage.importFromRegistry(pkg, dir, function (error, pkg) {
                    if (error) {
                        deferred.reject(error);
                    }
                    else {
                        deferred.resolve(pkg);
                    }
                });

                return deferred.promise;
            };
        }

        var npmPkgs = ['bat-ria-tool'];
        var edpPkgs = ['ef', 'esf-ms', 'bat-ria'];

        var tasks = npmPkgs.map(npmInstall)
            .concat(edpPkgs.map(edpImport));

        // 每次迭代将上一个task返回的`promise`和下一个task用`then`关联起来
        tasks
            .reduce(function (prev, task) {
                return prev.then(task);
            }, Deferred.resolved())
            .then(function () {
                require('../../lib/util/gen-main-less')(projectInfo, options);
                require('../../lib/util/gen-index')(projectInfo, options);
                if (entry) {
                    require('../../lib/util/gen-entry-main-less')(projectInfo, options);
                }

                // 生成默认的API配置和mockup
                var createApi = require('../../lib/util/create-api');
                createApi(projectInfo, ['api', 'constants', '/data/system/constants', 'ok']);
                createApi(projectInfo, ['api', 'user', '/data/system/user', 'session']);

                var createAction = require('../../lib/util/create-action');
                createAction(projectInfo, ['action', '/dev/index', entry]);

                // 更新本地的配置文件
                var updateLoaderConfig = require('edp-project/cli/project/updateLoaderConfig');
                updateLoaderConfig.cli.main();
            });
    });

};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

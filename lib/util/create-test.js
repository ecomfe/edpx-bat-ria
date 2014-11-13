/**
 * @file 生成 Action / Model / View 的测试 spec
 * @author Justineo(justice360@gmail.com)
 */

var read = require('read');
var path = require('path');
var fs = require('fs');

var upFirstAlpha = require('./up-first-alpha');
var genActionTest = require('./gen-action-test');
var genActionTestConfig = require('./gen-action-test-config');
var moduleToFile = require('./module-to-file');
var pathToModule = require('./path-to-module');

var logger = require('bat-ria-tool/logger');

function readAll(isAll, callback) {
    if (typeof isAll === 'boolean') {
        callback && callback(isAll);
        return;
    }

    logger.verbose('ria', 'INFO', 'Are you going to create tests for all actions?');
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
            readAll(false, callback);
        }
        else {
            var all = result === 'y' || result === 'yes';

            callback && callback(all);
        }
    });
}

function readPath(pagePath, callback) {

    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        var pagePath = (result || '').trim().toLowerCase();

        if (!pagePath) {
            readPath(null, callback);
            return;
        }

        if (pagePath[0] !== '/') {
            pagePath = '/' + pagePath;
        }

        if (!/^(\/?[a-z0-9_])+$/.test(pagePath)) {
            logger.error('ria', 'ERROR', '"' + pagePath + '" is not a valid <path> for `bat-ria create test`.');
            logger.warn('ria', 'WARN', '<path> should be something like `/promotion/ad/list`.');
            readPath(null, callback);
            return;
        }

        callback && callback(pagePath);
    }

    if (!pagePath) {
        logger.verbose('ria', 'INFO', 'Please enter <path> for `bat-ria create test`.');
        read({ prompt: '<path>: ' }, validate);
    }
    else {
        validate(null, pagePath);
    }

}

function readEntry(entries, entryName, callback) {
    function validate(err, result) {
        if (err) {
            logger.error('ria', 'ERROR', err.message);
            return;
        }

        if (entries.indexOf(result) === -1) {
            logger.error('ria', 'ERROR', 'Entry "' + result + '" does not exist.');
            readEntry(entries, null, callback);
            return;
        }

        callback && callback(result);
    }

    if (!entryName) {
        logger.verbose('ria', 'INFO', 'Please enter <entry> for `bat-ria create`.');
        read({ prompt: '<entry>: ' }, validate);
    }
    else {
        validate(null, entryName);
    }
}

function produce(projectInfo, pagePath, entryName) {

    var testDir = path.resolve(projectInfo.dir, 'test');
    if (!fs.existsSync(testDir)) {
        require('./gen-test-config')(projectInfo);
    }

    var isAll = pagePath === true;

    if (!isAll) {
        produceSingle(projectInfo, pagePath, entryName);
    }
    else {
        var entryDir = path.resolve(projectInfo.dir, 'entry');
        if (fs.existsSync(entryDir) && fs.statSync(entryDir).isDirectory()) {
            var entries = fs.readdirSync(entryDir).map(function (entry) {
                return entry.replace(/\.html$/, '');
            });

            entries.forEach(function (entry) {
                if (!fs.existsSync(testDir + '/specs/' + entry)) {
                    require('./gen-default-specs')(projectInfo, {
                        entryName: entry
                    });
                }
                produceDir(projectInfo, path.resolve(projectInfo.dir, 'src', entry), entry);
            });
        }
        else {
            if (!fs.existsSync(testDir + '/specs/common/main.js')) {
                require('./gen-default-specs')(projectInfo, {});
            }
            produceDir(projectInfo, path.resolve(projectInfo.dir, 'src'));
        }
    }
}

function produceDir(projectInfo, dir, entry) {
    var configFile = dir + '/config.js';
    if (fs.existsSync(configFile)) { // check if it has a module config
        var configContent = fs.readFileSync(configFile, 'utf8');
        var match = configContent.match(/\n\s*var\s+actionsConfig\s+=\s+(\[[^\]]*\])?/);

        if (match && match.length === 2) {
            var configString = match[1];

            try {
                var actionsConfig = eval('(' + configString + ')');

                actionsConfig.forEach(function (config) {
                    produceSingle(projectInfo, config.path, entry, config.type);
                });
            }
            catch (err) {
                logger.error('ria', 'ERROR', err.message);
            }
        }
    }

    // recursively handle sub-directories
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        var files = fs.readdirSync(dir);
        files.forEach(function (file) {
            var full = dir + '/' + file;
            if (fs.statSync(full).isDirectory()) {
                produceDir(projectInfo, full, entry);
            }
        });
    }
}

function produceSingle(projectInfo, pagePath, entryName, fullModule) {
    var pathSeg = pagePath.slice(1).split('/');
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[lastIndex];
    pathSeg[lastIndex] = upFirstAlpha(templateName);

    if (!fullModule) {
        var action = pathSeg.join('/');
        fullModule = (entryName ? entryName + '/' : '') + action;
    }

    var type = pathSeg[lastIndex].match(/(?:List|Form)$/);
    type = type ? type[0] : 'Base';

    genActionTest(projectInfo, {
        entryName: entryName,
        fullModule: fullModule,
        type: type
    });

    genActionTestConfig(projectInfo, {
        fullModule: fullModule,
        pagePath: pagePath,
        entryName: entryName
    });
}

/**
 * 生成Spec
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function (projectInfo, args) {
    var pagePath = args[1];
    var entryName = args[2];
    var isAll = pagePath ? false : null;

    function readFullPath() {
        readPath(pagePath, function (pagePath) {
            var entryDir = path.resolve(projectInfo.dir, 'entry');
            if (fs.existsSync(entryDir) && fs.statSync(entryDir).isDirectory()) {
                var entries = fs.readdirSync(entryDir).map(function (entry) {
                    return entry.replace(/\.html$/, '');
                });

                readEntry(entries, entryName, function (entry)  {
                    var mod = pathToModule(entry + '/' + pagePath);
                    var file = moduleToFile(projectInfo, mod);
                    if (fs.existsSync(file)) {
                        produce(projectInfo, pagePath, entry);
                    }
                    else {
                        logger.error('ria', 'ERROR', 'Action "' + mod + '" does not exist.');
                        readFullPath();
                    }
                });
            }
            else {
                var mod = pathToModule(pagePath);
                var file = moduleToFile(projectInfo, mod);
                if (fs.existsSync(file)) {
                    produce(projectInfo, pagePath);
                }
                else {
                    logger.error('ria', 'ERROR', 'Action "' + mod + '" does not exist.');
                    readFullPath();
                }
            }
        });
    }

    readAll(isAll, function (all) {
        if (all) {
            produce(projectInfo, true);
        }
        else {
            readFullPath();
        }
    });

};

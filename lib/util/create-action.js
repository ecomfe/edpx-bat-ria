/**
 * @file 生成 Action / Model / View 及相应配置
 * @author Justineo(justice360@gmail.com)
 */

var read = require('read');
var path = require('path');
var fs = require('fs');

var upFirstAlpha = require('./up-first-alpha');
var genAction = require('./gen-action');
var genActionConfig = require('./gen-action-config');
var genModel = require('./gen-model');
var genView = require('./gen-view');
var genTemplate = require('./gen-template');
var genStyle = require('./gen-style');
var genLessImport = require('./gen-less-import');
var moduleToFile = require('./module-to-file');

var logger = require('bat-ria-tool/logger');

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
            logger.error('ria', 'ERROR', '"' + pagePath + '" is not a valid <path> for `bat-ria create action`.');
            logger.warn('ria', 'WARN', '<path> should be something like `/promotion/ad/list`.');
            readPath(null, callback);
            return;
        }

        callback && callback(pagePath);
    }

    if (!pagePath) {
        logger.verbose('ria', 'INFO', 'Please enter <path> for `bat-ria create`.');
        read({ prompt: '<path>: ' }, validate);
    }
    else {
        validate(null, pagePath);
    }

}

function apis(pagePath) {
    var util = require('util');
    var crypto = require('crypto');
    var md5sum = crypto.createHash('md5');
    md5sum.update(new Buffer(pagePath, 'utf-8'));

    var value = md5sum.digest('hex').slice(0, 8);

    return {
        list: util.format('a%sList', value),
        update: util.format('a%sUpdate', value),
        detail: util.format('a%sDetail', value)
    };
}

/**
 * 如果可以输入一个eml格式的文件，然后处理一下自动生成
 * 这个配置就好了（eml -> ECOM Meta Language）
 */
function getDefaultFormFields() {
    return [
        { id: 'id', label: 'Id', type: 'TextBox', value: '${formData.id}' },
        { id: 'name', label: 'Name', type: 'TextBox', value: '${formData.name}' },
        { id: 'email', label: 'Email', type: 'TextBox', value: '${formData.email}' },
        { id: 'age', label: 'Age', type: 'TextBox', value: '${formData.age}' }
    ];
}

function produce(projectInfo, type, pagePath, entryName) {
    if (type === 'action') {
        type = 'base';
    }

    type = upFirstAlpha(type);

    var pathSeg = pagePath.slice(1).split('/');
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[lastIndex];
    pathSeg[lastIndex] = upFirstAlpha(templateName);

    var action = pathSeg.join('/');
    var model = action + 'Model';
    var view = action + 'View';
    var templateFile = path.resolve(
        moduleToFile(projectInfo, (entryName ? entryName + '/' : '') + action),
        '..',
        templateName
    ) + '.tpl.html';
    var styleFile = path.resolve(
        moduleToFile(projectInfo, (entryName ? entryName + '/' : '') + action),
        '..',
        templateName
    ) + '.less';

    var actionSegs = action.split('/');
    var templateTarget = 'TPL_' + actionSegs.join('_').toLowerCase();
    var templateClasses = [];
    templateClasses.push(actionSegs.join('-').toLowerCase().replace('_', '-'));
    templateClasses = templateClasses.join(' ');
    var styleClass = actionSegs.join('-').toLowerCase().replace('_', '-');

    genActionConfig(projectInfo, {
        actionName: action,
        actionPath: pagePath,
        entryName: entryName
    });

    genAction(projectInfo, {
        module: action,
        model: './' + pathSeg[lastIndex] + 'Model',
        view: './' + pathSeg[lastIndex] + 'View',
        type: type,
        entryName: entryName
    });

    genModel(projectInfo, {
        module: model,
        type: type,
        pagePath: pagePath,
        api: apis(pagePath),
        entryName: entryName
    });

    genView(projectInfo, {
        module: view,
        templateTarget: templateTarget,
        templateFile: './' + path.basename(templateFile),
        type: type,
        entryName: entryName
    });

    genTemplate(projectInfo, {
        type: type,
        file: templateFile,
        pagePath: pagePath,
        target: templateTarget,
        classes: templateClasses,
        fields: (type === 'Form') ? getDefaultFormFields() : [],
        entryName: entryName
    });

    genStyle(projectInfo, {
        type: type,
        file: styleFile,
        pagePath: pagePath,
        mainClass: styleClass,
        entryName: entryName
    });

    genLessImport(projectInfo, {
        styleFile: pagePath + '.less',
        entryName: entryName
    });

    // autoGenerateAPI(projectInfo, type, pagePath);
}

// function autoGenerateAPI(projectInfo, type, pagePath) {
//     var createApi = require('./create-api');
//     var api = apis(pagePath);
//     if (type === 'List') {
//         createApi(
//             projectInfo,
//             [
//                 'api',
//                 api.list,                 // apiName
//                 '/data/v1' + pagePath,    // apiPath
//                 'list'                    // apiType
//            ]
//         );
//     }
//     else if (type === 'Form') {
//         createApi(
//             projectInfo,
//             [
//                 'api',
//                 api.detail,                           // apiName
//                 '/data/v1' + pagePath + '/detail',    // apiPath
//                 'form'                                // apiType
//            ]
//         );

//         createApi(
//             projectInfo,
//             [
//                 'api',
//                 api.update,                           // apiName
//                 '/data/v1' + pagePath + '/update',    // apiPath
//                 'form'                                // apiType
//            ]
//         );
//     }
// }

/**
 * 生成Action
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function (projectInfo, args) {
    var type = args[0];

    var pagePath = args[1];
    var entryName = args[2];

    readPath(pagePath, function (pagePath) {
        var entryDir = path.resolve(projectInfo.dir, 'entry');
        if (fs.existsSync(entryDir)) {
            var entries = fs.readdirSync(entryDir).map(function (entry) {
                return entry.replace(/\.html$/, '');
            });

            readEntry(entries, entryName, function (entry)  {
                produce(projectInfo, type, pagePath, entry);
            });
        }
        else {
            produce(projectInfo, type, pagePath);
        }
    });
};

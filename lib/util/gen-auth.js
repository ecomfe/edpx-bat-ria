/**
 * @file 生成锦囊风格的 modules_tree.txt 和 auth.txt
 *       继承只检查common下边的超类，对于特殊超类，请手动加上url的dependencies
 * @author chesnutchen[mini.chenli@gmail.com]
 */

var fs = require('fs');
var path = require('path');
var readFile = require('./read-file');
var writeFile = require('./write-file');
var unique = require('./array-unique');
var removeComment = require('./remove-comment');

var writableAuths = ['create', 'update', 'save', 'submit', 'upload',
    'publish', 'delete', 'remove', 'check', 'review', 'confirm', 'register'];
var modulesTree = [];   // 最后的modules_tree.txt
var urlAuthMap = {};    // 最后的auth.txt
var apiMap = {};        // apiConfig
var apiNames = [];      // 所有的url的名字
var isESNext = false;

/**
 * 生成锦囊风格的 module.tree 和 auth.txt
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.configPath common/config的path
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        isESNext = options.isESNext;
        var configPath = options.configPath;
        var configContent = readFile(configPath);

        // 把 {...} 部分拿出来 parse 成对象用
        var apiConfig = configContent.match(/\n\s*(?:var|let)\s+apiConfig\s+=\s+(\{[\s\S]*?\})/);
        apiConfig = removeComment(apiConfig[1]);
        apiConfig = apiConfig.replace(/([\w]+?):/g, '"$1":').replace(/'/g, '"');
        apiMap = JSON.parse(apiConfig);

        // 建🌲建表
        apiNames = Object.keys(apiMap);
        apiNames.forEach(function (name) {
            var action = apiMap[name].match(/[^\/]+$/)[0];
            urlAuthMap[apiMap[name]] = {
                modules: [],
                authLevel: writableAuths.indexOf(action) === -1 ? 'r' : 'w'
            };
        });

        var modulePath = path.resolve(projectInfo.dir, 'src');
        buildTreeAndAuth(getModuleNames(modulePath), 'auth', modulePath, modulesTree, null);

        // 写modules_tree.txt
        var modulesTreePath = path.resolve(projectInfo.dir, 'modules_tree.txt');
        if (fs.existsSync(modulesTreePath)) {
            // 把以前填充的name补回来
            var oldMoudles = JSON.parse(readFile(modulesTreePath));
            mergeOldMoudles(modulesTree, oldMoudles);
        }
        writeFile(modulesTreePath, JSON.stringify(modulesTree, null, 4));

        // 写auth.txt
        var authTxt = '';
        apiNames.forEach(function (name, index) {
            var authInfo = urlAuthMap[apiMap[name]];
            var modulesText = authInfo.modules.join(',') || '-';
            authTxt += ''
                + apiMap[name] + '\t'
                + modulesText + '\t'
                + authInfo.authLevel + (index < apiNames.length - 1 ? '\n' : '');
        });
        writeFile(path.resolve(projectInfo.dir, 'auth.txt'), authTxt);
    }
);

/**
 * 可能添加过text了，尽量merge回来
 *
 * @param  {Array} latest    新模块
 * @param  {Array} old       原有文件
 */
function mergeOldMoudles(latest, old) {
    old.forEach(function (oldModule, index) {
        var newModule = latest.find(function (item) {
            return item.id === oldModule.id;
        });
        if (newModule) {
            // 如果改过就填回来
            if (oldModule.text) {
                newModule.text = oldModule.text;
            }
            if (oldModule.children && newModule.children) {
                mergeOldMoudles(newModule.children, oldModule.children);
            }
        }
    });
}

/**
 * 看下目录下边还有没有子目录
 *
 * @param  {string}  modulePath 模块路径
 * @return {boolean}            是否是模块(有没有子目录)
 */
function isModule(modulePath) {
    return fs.readdirSync(modulePath).some(function (item) {
        return fs.statSync(path.resolve(modulePath, item)).isDirectory();
    });
}

/**
 * 过滤掉一些文件和ui文件夹
 *
 * @param  {string} modulePath 文件夹路径
 * @return {Array}             子文件(夹)名
 */
function getModuleNames(modulePath) {
    // 过滤掉ui文件夹和非MVC文件
    return fs.readdirSync(modulePath).filter(function (item) {
        var isDirectory = fs.statSync(path.resolve(modulePath, item)).isDirectory();
        return isDirectory && item !== 'ui'
            || !isDirectory && item.match(/.+?(Model|View)?\.js$/);
    });
}

/**
 * 记录超类，只需要MVC文件
 *
 * @param  {Array|undefined} supers     超类记录
 * @param  {string}          superPath  超类的路径
 * @return {Array|undefined}            记录或无
 */
function markSuper(supers, superPath) {
    var mvcs = [];
    var modules = [];
    var moduleNames = fs.readdirSync(superPath);
    moduleNames.forEach(function (item) {
        item.match(/.+?(Model|View)?\.js$/)
            ? mvcs.push(item)
            : fs.statSync(path.resolve(superPath, item)).isDirectory() && modules.push(item);
    });
    // 解析一下第一层的MVC
    if (mvcs.length) {
        mvcs.forEach(function (mvc) {
            var modelPath = path.resolve(superPath, mvc);
            var dependencies = parseDependency(modelPath, supers);
            if (dependencies.length) {
                supers = supers || [];
                supers.push({
                    name: mvc.slice(0, -3),   // 去掉.js，因为import和require都是不带后缀的
                    path: modelPath,
                    dependencies: dependencies
                });
            }
        });
    }
    // 解析一下子文件夹里头的
    if (modules.length) {
        modules.forEach(function (moduleName) {
            supers = markSuper(supers, path.resolve(superPath, moduleName));
        });
    }
    return supers;
}

/**
 * 解析Model中引用的api url
 *
 * @param  {string}          modulePath  文件路径
 * @param  {Array|undefined} supers      超类
 * @return {Array}                       依赖api
 */
function parseDependency(modulePath, supers) {
    var content = readFile(modulePath);
    var dependencies = [];

    if (supers && supers.length) {
        // 查一下是不是继承了已知含有依赖api的超类
        supers.forEach(function (superClass) {
            // 判断下是不是同种类型
            if (superClass.name.match(/.+?(Model|View)?$/)[1] === modulePath.match(/\/[^\/]+?(Model|View)?\.js$/)[1]) {
                var relativePath;
                var matched;
                if (isESNext) {
                    matched = content.match(new RegExp('from \'(.+' + superClass.name + ')\''));
                    relativePath = matched && matched[1];
                }
                else {
                    matched = content.match(new RegExp('require\\(\'(.+' + superClass.name + ')\'\\)'));
                    relativePath = matched && matched[1];
                }

                // 解出来相对路径看下是不是沿途记录过的superClass，理论上内层的superClass，外层不能去继承它们
                if (relativePath && path.resolve(modulePath, '..', relativePath + '.js') === superClass.path) {
                    dependencies = dependencies.concat(superClass.dependencies);
                }
            }
        });
    }

    apiNames.forEach(function (apiName) {
        if (content.indexOf('api.' + apiName) !== -1) {
            dependencies.push(apiName);
        }
    });

    return unique(dependencies);
}

/**
 * 建🌲建表
 * 递归遍历文件夹，解析出module tree，然后提取每个module里对每个url的引用
 *
 * @param  {Array}   moduleNames        一个模块下的子模块集合，其实就是一个文件夹下的子文件夹名
 * @param  {string}  superChain         auth.xx.xx
 * @param  {string}  superModulePath    上一级的路径
 * @param  {Array}   moduleTree         每一层的module tree，子数就是某个auth.children
 * @param  {Array}   supers             沿途记录下来的超类，可能有继承，但是没有引用url的不会记录进来
 */
function buildTreeAndAuth(moduleNames, superChain, superModulePath, moduleTree, supers) {
    // 先把common干掉去记录superClass，对于没有放在common里边的超类，请手动
    if (moduleNames.indexOf('common') !== -1) {
        supers = markSuper(supers, path.resolve(superModulePath, 'common'));
        moduleNames.splice(moduleNames.indexOf('common'), 1);
    }

    moduleNames.forEach(function (moduleName) {
        var modulePath = path.resolve(superModulePath, moduleName);

        // 文件夹，识别为模块
        if (fs.statSync(modulePath).isDirectory()) {
            var chain = superChain + '.' + moduleName;
            var jnModule = {
                id: chain,
                text: ''
            };
            moduleTree.push(jnModule);

            var subModuleNames = getModuleNames(modulePath);
            if (subModuleNames.length) {
                isModule(modulePath) && (jnModule.children = []);
                buildTreeAndAuth(subModuleNames, chain, modulePath, jnModule.children, supers);
            }
        }
        // 文件，这里已经保证只是MVC文件
        else {
            var dependencies = parseDependency(modulePath, supers);
            dependencies.forEach(function (apiName) {
                var authModuels = urlAuthMap[apiMap[apiName]].modules;
                authModuels.indexOf(superChain) === -1 && authModuels.push(superChain);
            });
        }
    });
}

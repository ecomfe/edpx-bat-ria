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

var projectDir = '';
var writableAuths = ['create', 'update', 'save', 'submit', 'upload', 'cancel',
    'publish', 'delete', 'remove', 'check', 'review', 'confirm', 'register'];
var apiMap = {};        // apiConfig
var apiNames = [];      // 所有的url的名字
var isESNext = false;

/**
 * 生成锦囊风格的 module.tree 和 auth.txt
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.configPath common/config的path
 * @param {boolean} options.isESNext 是否为ES6语法
 * @param {boolean} options.isCreateAuth 是创建modules.json还是根据modules.json创建auth.txt
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        projectDir = projectInfo.dir;
        isESNext = options.isESNext;
        var modulesJSONPath = path.resolve(projectDir, 'modules.json');
        var authTxtPath = path.resolve(projectDir, 'auth.txt');
        var configPath = options.configPath;
        var configContent = readFile(configPath);
        var modulesJSON = [];

        // 把 {...} 部分拿出来 parse 成对象用
        var apiConfig = configContent.match(/\n\s*(?:var|let)\s+apiConfig\s+=\s+(\{[\s\S]*?\});/);
        apiConfig = removeComment(apiConfig[1]);
        // 处理一下function
        if (apiConfig.indexOf('function') !== -1) {
            apiConfig = apiConfig.replace(/([\w]+?): function[\s\S]+?'(\/data.+?)'[\s\S]+?\}/g, '"$1": "$2"');
        }
        else if (isESNext && /\w+?\(\)/.test(apiConfig)) {
            apiConfig = apiConfig.replace(/([\w]+?)\(\)[\s\S]+?'(\/data.+?)'[\s\S]+?\}/g, '"$1": "$2"');
        }
        apiConfig = apiConfig.replace(/([\w]+?):/g, '"$1":').replace(/'/g, '"');
        apiMap = JSON.parse(apiConfig);
        apiNames = Object.keys(apiMap);

        // 有moduels.json，而且指定要创建auth.txt和modules_tree.txt
        if (options.isCreateAuth && fs.existsSync(modulesJSONPath)) {
            modulesJSON = JSON.parse(readFile(modulesJSONPath));
            var urlAuthMap = {};
            var oldAuthMap = parseOldAuthTxt(authTxtPath);
            apiNames.forEach(function (name) {
                var url = apiMap[name];
                var action = url.match(/[^\/]+$/)[0];
                urlAuthMap[url] = {
                    modules: [],
                    authLevel: oldAuthMap[url] && oldAuthMap[url].authLevel
                        || (writableAuths.indexOf(action) === -1 ? 'r' : 'w')
                };
            });

            // 把url算出来顺便去掉
            pluckUrlAuthMap(modulesJSON, urlAuthMap);

            // 写modules_tree.txt
            deleteIgnore(modulesJSON, null);
            writeFile(path.resolve(projectDir, 'modules_tree.txt'), JSON.stringify(modulesJSON, null, 4));

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
            writeFile(authTxtPath, authTxt);

            return;
        }

        // 没有modules.json，先创建出来
        // 建🌲
        var modulePath = path.resolve(projectDir, 'src');
        buildTree(filterFiles(modulePath), 'auth', modulePath, modulesJSON);

        // 写modules.json
        if (fs.existsSync(modulesJSONPath)) {
            // 把以前填充的name补回来
            var oldMoudles = JSON.parse(readFile(modulesJSONPath));
            mergeOldMoudles(modulesJSON, oldMoudles);
        }
        writeFile(modulesJSONPath, JSON.stringify(modulesJSON, null, 4));
    }
);

/**
 * 把不需要输出的module去掉
 *
 * @param  {Array} tree 模块🌲
 * @param  {Object} [parent] 上级模块
 */
function deleteIgnore(tree, parent) {
    var children = [];
    tree.forEach(function (jnModule, index) {
        if (!jnModule.ignore) {
            children.push(jnModule);
            if (jnModule.children) {
                deleteIgnore(jnModule.children, jnModule);
            }
        }
    });
    if (parent) {
        if (children.length) {
            parent.children = children;
        }
        else {
            delete parent.children;
        }
    }
}

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
 * 可能修改过auth level了，尽量merge回来
 *
 * @param {string} filePath auth.txt的路径
 * @return {Object}         旧auth.txt的信息
 */
function parseOldAuthTxt(filePath) {
    if (!fs.existsSync(filePath)) {
        return {};
    }
    var content = readFile(filePath);
    var urlInfos = content.split('\n');
    var oldAuthMap = {};
    urlInfos.forEach(function (value) {
        var urlInfo = value.split('\t');
        oldAuthMap[urlInfo[0]] = {
            authLevel: urlInfo[2]
        };
    });
    return oldAuthMap;
}

/**
 * 获取子文件夹
 *
 * @param  {string} modulePath 文件夹路径
 * @return {Array}            子文件夹们
 */
function getDirectories(modulePath) {
    return fs.readdirSync(modulePath).filter(function (item) {
        return fs.statSync(path.resolve(modulePath, item)).isDirectory();
    });
}

/**
 * 过滤掉一些文件和ui文件夹
 *
 * @param  {string} modulePath 文件夹路径
 * @return {Array}             子文件(夹)名
 */
function filterFiles(modulePath) {
    // 过滤掉ui文件夹和非MVC、config.js文件
    return fs.readdirSync(modulePath).filter(function (item) {
        var isDirectory = fs.statSync(path.resolve(modulePath, item)).isDirectory();
        return isDirectory && item !== 'ui'
            || !isDirectory && item.match(/^[A-Z].+?(Model|View)?\.js$/);
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
        item.match(/^[A-Z].+?(Model|View)?\.js$/)
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
    var content = removeComment(readFile(modulePath));
    var dependencies = [];

    if (supers && supers.length) {
        // 查一下是不是继承了已知含有依赖api的超类
        supers.forEach(function (superClass) {
            // 判断下是不是同种类型
            if (superClass.name.match(/^[A-Z].+?(Model|View)?$/)[1]
                === modulePath.match(/\/[^\/]+?(Model|View)?\.js$/)[1]) {
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
        if (new RegExp('api\\.' + apiName + '\\b').test(content)) {
            dependencies.push(apiName);
        }
    });

    return unique(dependencies);
}

/**
 * 建🌲
 * 递归遍历文件夹和叶子config.js中的path，解析出module tree，然后提取每个module里对每个url的引用
 *
 * @param  {Array}   moduleNames        一个模块下的子模块集合，其实就是一个文件夹下的子文件夹名
 * @param  {string}  superChain         auth.xx.xx
 * @param  {string}  superModulePath    上一级的路径
 * @param  {Array}   moduleTree         每一层的module tree，子🌲就是某个auth.children
 * @param  {Array}   supers             沿途记录下来的超类，可能有继承，但是没有引用url的不会记录进来
 */
function buildTree(moduleNames, superChain, superModulePath, moduleTree, supers) {
    // 先把common干掉去记录superClass，对于没有放在common里边的超类，请手动
    if (moduleNames.indexOf('common') !== -1) {
        supers = markSuper(supers, path.resolve(superModulePath, 'common'));
        moduleNames.splice(moduleNames.indexOf('common'), 1);
    }

    moduleNames.forEach(function (moduleName) {
        var modulePath = path.resolve(superModulePath, moduleName);

        // 把自己加上
        var chain = superChain + '.' + moduleName;
        var jnModule = {
            id: chain,
            text: ''
        };
        moduleTree.push(jnModule);

        // 如果有config.js，把这一层的叶子节点加上，从config.js里边找path
        var configPath = path.resolve(modulePath, 'config.js');
        if (fs.existsSync(configPath)) {
            var configContent = readFile(configPath);
            var actionsConfig = configContent.match(/actionsConfig\s+=\s+(\[[\s\S]*?\]);/);
            if (actionsConfig) {
                var actionPaths = JSON.parse(
                    removeComment(actionsConfig[1]).replace(/([\w]+?):/g, '"$1":').replace(/'/g, '"')
                );
                actionPaths.length && (jnModule.children = []);
                // 这里有比较坑爹的情况就是path是和module path不太一致的，那就取最小公共集，type的路径也是。。
                actionPaths.forEach(function (actionPath) {
                    var pathComponents = actionPath.path.split('/');
                    pathComponents = pathComponents.filter(function (component) {
                        return chain.indexOf(component) === -1;
                    });

                    // 算出叶子的模块id
                    var subChain = chain + '.' + pathComponents.join('.');
                    var jnModulePath = path.resolve(projectDir, 'src', actionPath.type);
                    // 针对path解析出依赖的url
                    var dependencies = [];
                    ['.js', 'Model.js', 'View.js'].forEach(function (suffix) {
                        dependencies = dependencies.concat(parseDependency(jnModulePath + suffix, supers));
                    });

                    jnModule.children.push({
                        id: subChain,
                        text: '',
                        url: dependencies.map(function (apiName) {
                            return apiMap[apiName];
                        })
                    });
                });
            }
        }

        // 往下查查有没有文件夹
        var subModuleNames = getDirectories(modulePath);
        if (subModuleNames.length) {
            jnModule.children = jnModule.children || [];
            buildTree(subModuleNames, chain, modulePath, jnModule.children, supers);
        }
        else {
            // 如果是最后一层module，把url统计一下
            jnModule.children.forEach(function (subJnModule) {
                jnModule.url = (jnModule.url || []).concat(subJnModule.url || []);
            });
            jnModule.url = unique(jnModule.url);
        }
    });
}

/**
 * 提取tree中的url，并删除
 *
 * @param  {Object} tree 权限模块🌲
 * @param  {Object} map  url auth的记录
 */
function pluckUrlAuthMap(tree, map) {
    tree.forEach(function (jnModule) {
        if (jnModule.url) {
            var urls = jnModule.url;
            delete jnModule.url;

            urls.forEach(function (url) {
                map[url].modules.push(jnModule.id);
            });
        }
        if (jnModule.children) {
            pluckUrlAuthMap(jnModule.children, map);
        }
    });
}

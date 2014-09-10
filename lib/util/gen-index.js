/**
 * @file 生成index页面
 * @author errorrik[errorrik@gmail.com]
 */

var edp = require('edp-core');
var fs = require('fs');

/**
 * 生成index页面
 *
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {boolean} options.sidebar 系统是否包含侧边栏
 * @param {string=} options.filename index页面文件名，默认`index.html`
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 * @param {string=} options.entryName 多入口页系统时指定的入口名称
 */
module.exports = require('./generator')(
    function (projectInfo, options) {
        var path = require('path');
        var entryName = options.entryName;
        var file = path.join(projectInfo.dir, entryName ? 'entry/' + entryName + '.html' : 'index.html');
        var dir = edp.path.dirname(file);
        if (!fs.existsSync(dir)) {
            require('mkdirp').sync(dir);
        }
        var cssPath = entryName ? '../src/' + entryName + '/main.css' : 'src/common/css/main.css';
        var tplData = {
            cssLinks: [
                { href: cssPath }
            ],
            title: '[请输入页面标题]'
        };

        var bodyMainFile = 'index-main.tpl';
        tplData.bodyMain = require('./read-file')(
            path.resolve(__dirname, '../../tpl', bodyMainFile)
        );

        // 构建loader和require config数据
        var loaderData = require('edp-project').loader.getConfig(file);
        if (loaderData && loaderData.url) {
            var packages = loaderData.packages;
            packages.length > 0 && (packages[packages.length - 1].last = true);

            tplData.loader = true;
            tplData.loaderConfig = true;
            tplData.loaderUrl = loaderData.url;
            tplData.loaderBaseUrl = loaderData.baseUrl;
            tplData.loaderPaths = loaderData.paths;
            tplData.loaderPackages = packages;

        }

        if (entryName) {
            tplData.entryMainModule = entryName + '/main';
            tplData.imgDir = '../src/common/img';
        }
        else {
            tplData.entryMainModule = 'common/main';
            tplData.imgDir = 'src/common/img';
        }

        // merge模版并生成文件
        require('./merge-tpl')(
            options.genTemplate || 'index.tpl',
            tplData,
            file
        );
    }
);

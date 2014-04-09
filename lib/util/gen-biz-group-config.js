/**
 * @file 生成业务组配置模块
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成业务组配置模块
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {boolean} options.groupModule 业务组模块id
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var moduleToFile = require( './module-to-file' );

        var groupModule = options.groupModule;
        var configModule = groupModule.join( '/' ) + '/config';
        var configFile = moduleToFile( projectInfo, configModule );

        var path = require( 'path' );
        var fs = require( 'fs' );
        if ( fs.existsSync( configFile ) ) {
            return;
        }

        // merge模版并生成biz group config文件
        require( './merge-tpl' )(
            options.genTemplate || 'biz-group-config.tpl',
            {},
            configFile
        );

        // 在业务主模块中，添加业务组配置模块的require
        var mainModule = 'common/main';
        var mainFile = moduleToFile( projectInfo, mainModule );
        if ( fs.existsSync( mainFile ) ) {
            var mainContent = fs.readFileSync( mainFile, 'utf8' );
            var requireConfigModule = '../' + configModule;

            // 判断是否require过该模块。不严谨的判断
            if ( mainContent.indexOf( requireConfigModule ) > 0 ) {
                return;
            }

            mainContent = mainContent.replace(
                /\n(\s*)function requireConfigs\(\)\s*\{/,
                function ( $0, indent ) {
                    var indentUnit = indent[ 0 ] == '\t'
                        ? '\t'
                        : '    ';
                    return $0 + '\n' + indent + indentUnit
                        + 'require( \''
                        + requireConfigModule
                        + '\' );';
                }
            );

            fs.writeFileSync( mainFile, mainContent, 'utf8' );
        }
    }
);

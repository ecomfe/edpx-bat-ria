/**
 * @file 生成Action配置
 * @author errorrik[errorrik@gmail.com]
 */

var genBizGroupConfig = require( './gen-biz-group-config' );
var moduleToFile = require( './module-to-file' );

/**
 * 生成Action配置
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.actionName Action的模块id
 * @param {string=} options.actionPath Action对应的路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var actionName = options.actionName;
        var actionPath = options.actionPath || '/' + actionName;

        // 尝试生成biz group config模块文件
        var groupModule = actionName.split( '/' );
        groupModule.length = groupModule.length - 1;
        genBizGroupConfig( projectInfo, { groupModule: groupModule } );

        var configModule = groupModule.join( '/' ) + '/config';
        var configFile = moduleToFile( projectInfo, configModule );

        // 尝试在biz group config模块文件中，加入action配置
        var fs = require( 'fs' );
        if ( fs.existsSync( configFile ) ) {
            var configContent = fs.readFileSync( configFile, 'utf8' ).replace( 
                /\n(\s*)var\s+actionsConfig\s+=\s+\[\s*(\])?/, 
                function ( $0, indent, end ) {
                    var indentUnit = indent[ 0 ] == '\t'
                        ? '\t'
                        : '    ';
                    var indent1 = indent + indentUnit;

                    return ( end 
                            ? $0.slice( 0, $0.length - 1 ) 
                            : $0.replace( /\s*$/, '' ) 
                           )  
                        + '\n'
                        + require( './merge-tpl' )( 
                            'action-config.tpl',
                            {
                                indent1: indent1,
                                indent2: indent1 + indentUnit,
                                action: actionName,
                                path: actionPath
                            }
                          )
                        + ( end ? '' : ',' )
                        + '\n' + indent
                        + ( end ? ']' : indent );
                }
            );

            fs.writeFileSync( configFile, configContent, 'utf8' );
        }
    }
);

/**
 * @file 生成API配置
 * @author Justineo[justice360@gmail.com]
 */

var path = require( 'path' );

/**
 * 生成API配置
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string} options.apiName API的配置项名称
 * @param {string} options.apiPath API对应的路径
 * @param {string=} options.apiType API对应的返回格式，可以为`normal`/`list`/`download`
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var apiName = options.apiName;
        var apiPath = options.apiPath;
        var apiType = options.apiType;

        var configFile = path.resolve( projectInfo.dir, 'src/common/config.js' );

        var fs = require( 'fs' );
        if ( fs.existsSync( configFile ) ) {
            var configContent = fs.readFileSync( configFile, 'utf8' ).replace( 
                /\n(\s*)var\s+apiConfig\s+=\s+\{\s*(\})?/, 
                function ( $0, indent, end ) {
                    var indentUnit = indent[ 0 ] == '\t'
                        ? '\t'
                        : '    ';
                    var indentMore = indent + indentUnit;

                    return ( end 
                            ? $0.slice( 0, $0.length - 1 ) 
                            : $0.replace( /\s*$/, '' ) 
                           )  
                        + '\n'
                        + indentMore + apiName + ': \'' + apiPath + '\''
                        + ( end ? '' : ',' )
                        + '\n' + indent
                        + ( end ? '}' : indent );
                }
            );

            console.log( 'M %s', configFile );

            fs.writeFileSync( configFile, configContent, 'utf8' );
        }
    }
);

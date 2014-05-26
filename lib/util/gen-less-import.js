/**
 * @file 在main.less中导入文件
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成在main.less中导入文件
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {boolean} options.styleFile Action样式文件路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        var path = require( 'path' );
        var fs = require( 'fs' );

        var styleFile = options.styleFile;
        if ( fs.existsSync( path.resolve( projectInfo.dir, styleFile ) ) ) {
            return;
        }

        // 在main.less中，添加Action对应样式文件
        var mainFile = path.resolve( projectInfo.dir, 'src/common/css/main.less' );
        if ( fs.existsSync( mainFile ) ) {
            var mainContent = fs.readFileSync( mainFile, 'utf8' );
            var importFile = '../..' + styleFile;

            // 判断是否import过该文件。不严谨的判断
            if ( mainContent.indexOf( importFile ) > 0 ) {
                return;
            }

            mainContent = mainContent.replace(
                /\/\/ 模块样式.*/,
                function ( $0 ) {
                    return $0 + '\n'
                        + '@import "' + importFile + '";';
                }
            );

            console.log( 'M %s', path.relative( process.cwd(), mainFile ) );

            fs.writeFileSync( mainFile, mainContent, 'utf8' );
        }
    }
);

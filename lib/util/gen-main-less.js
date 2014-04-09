/**
 * @file 生成系统主less文件
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 生成系统主less文件
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Object} options 生成选项
 * @param {string=} options.genTemplate 用于生成的模板文件，绝对路径
 */
module.exports = require( './generator' )(
    function ( projectInfo, options ) {
        // 构造数据
        var pkgs = require( 'edp-package' ).getImported( projectInfo.dir );
        var lessImports = [];
        addLessImportData( lessImports, pkgs, 'esui', 'css/main.less' );
        addLessImportData( lessImports, pkgs, 'est', 'all.less' );
        addLessImportData( lessImports, pkgs, 'esf-ms', 'main.less' );
        
        // merge模版并生成文件
        var path = require( 'path' );
        require( './merge-tpl' )(
            options.genTemplate || 'main-less.tpl',
            { imports: lessImports },
            path.resolve( projectInfo.dir, 'src/common/css/main.less' )
        );
    }
);

/**
 * 添加less导入数据
 * 
 * @inner
 * @param {Array} sourceData 要添加入的数据对象
 * @param {Object} pkgs 包集合对象
 * @param {string} pkgName 包名称
 * @param {string} mainFile 主less文件名，相对包的src目录
 */
function addLessImportData( sourceData, pkgs, pkgName, mainFile ) {
    if ( pkgName in pkgs ) {
        var pkg = pkgs[ pkgName ];
        
        sourceData.push( {
            url: '../../../dep/' 
                + pkgName + '/' 
                + getLatestVersion( pkg ) 
                + '/src/' + mainFile
        } ); 
    }
} 

/**
 * 获取包的最新版本号
 * 
 * @inner
 * @param {Object} pkg 包对象数据
 * @return {string}
 */
function getLatestVersion( pkg ) {
    return Object.keys( pkg ).sort( require( 'semver' ).rcompare )[ 0 ];
}

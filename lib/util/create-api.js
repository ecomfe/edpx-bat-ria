/**
 * @file 生成 API 配置及其默认 mockup 模块
 * @author Justineo[justice360@gmail.com]
 */

var upFirstAlpha = require( './up-first-alpha' );
var genApiConfig = require( './gen-api-config' );
var genMockup = require( './gen-mockup' );
var logger = require( '../../tools/logger' );

/**
 * 生成API
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function ( projectInfo, args ) {
    var apiName = args[ 1 ];
    var apiPath = args[ 2 ];
    var apiType = args[ 3 ];

    if ( !apiName ) {
        logger.error( 'CREATE', 'ERROR', '<name> is required for `bat-ria create api`.' );
        return;
    }

    if ( !apiPath ) {
        logger.error( 'CREATE', 'ERROR', '<path> is required for `bat-ria create api`.' );
        return;
    }

    if ( apiPath[ 0 ] !== '/' ) {
        apiPath = '/' + apiPath;
    }

    if (apiType) {
        apiPath = apiPath.toLowerCase();
    }

    var apiTypes = [
        'ok', 'session', 'list', 'form',
        'global', 'field', 'download'
    ];

    if ( apiTypes.indexOf( apiType ) === -1 ) {
        apiType = 'ok';
    }

    var apiSeg = apiPath.slice( 1 ).split( '/' )
    if ( apiSeg[ 0 ] === 'data' ) {
        apiSeg = apiSeg.slice( 1 );
        apiPath = '/' + apiSeg.join( '/' );
    }

    // 到这里`apiPath`已保证是`/a/b/c`形式
    genApiConfig( projectInfo, {
        apiName: apiName,
        apiPath: apiPath,
        apiType: apiType
    } );

    // 根据模板创建mockup文件，download类型不需要创建
    if ( apiType !== 'download' ) {
        genMockup( projectInfo, {
            apiName: apiName,
            apiPath: apiPath,
            apiType: apiType
        } );
    }
};

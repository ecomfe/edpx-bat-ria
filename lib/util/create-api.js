/**
 * @file 生成 API 配置及其默认 mockup 模块
 * @author Justineo[justice360@gmail.com]
 */

var upFirstAlpha = require( './up-first-alpha' );
var path = require( 'path' );
var genAction = require( '../../lib/util/gen-action' );
var genActionConfig = require( '../../lib/util/gen-action-config' );
var genModel = require( '../../lib/util/gen-model' );
var genView = require( '../../lib/util/gen-view' );
var genTemplate = require( '../../lib/util/gen-template' );
var moduleToFile = require( '../../lib/util/module-to-file' );
var logger = require( '../../tools/logger' );

/**
 * 生成Action
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function ( projectInfo, args ) {
    var name = args[ 1 ];
    var apiPath = args[ 2 ];

    if (!name) {
        logger.error('CREATE', 'ERROR', '<name> is required for `bat-ria create ' + type + '`.' );
        return;
    }

    if (!apiPath) {
        logger.error('CREATE', 'ERROR', '<path> is required for `bat-ria create ' + type + '`.' );
        return;
    }

    type = upFirstAlpha( type );

    if ( pagePath[ 0 ] !== '/' ) {
        pagePath = '/' + pagePath;
    }

};

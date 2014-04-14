/**
 * @file 生成 Action / Model / View 及相应配置
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
    var type = args[ 0 ];
    var pagePath = args[ 1 ];

    if (!pagePath) {
        logger.error('CREATE', 'ERROR', '<path> is required for `bat-ria create ' + type + '`.' );
        return;
    }

    if ( type === 'action' ) {
        type = 'base';
    }

    type = upFirstAlpha( type );

    if ( pagePath[ 0 ] !== '/' ) {
        pagePath = '/' + pagePath;
    }

    var pathSeg = pagePath.slice( 1 ).split( '/' );
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[ lastIndex ];
    pathSeg[ lastIndex ] = upFirstAlpha( templateName );

    var action = pathSeg.join( '/' );
    var model = action + 'Model';
    var view = action + 'View';
    var templateFile = path.resolve( moduleToFile( projectInfo, action ), '..', templateName ) + '.tpl.html';

    var actionSegs = action.split( '/' );
    var templateTarget = 'TPL_' + actionSegs.join( '_' ).toLowerCase();
    var templateClasses = [];
    templateClasses.push( actionSegs.join( '-' ).toLowerCase() );
    templateClasses = templateClasses.join( ' ' );

    genActionConfig( projectInfo, {
        actionName: action, 
        actionPath: pagePath
    } );

    genAction( projectInfo, {
        module: action,
        model: './' + pathSeg[ lastIndex ] + 'Model',
        view: './' + pathSeg[ lastIndex ] + 'View',
        type: type
    } );

    genModel( projectInfo, {
        module: model,
        type: type
    } );

    genView( projectInfo, {
        module: view,
        templateTarget: templateTarget,
        templateFile: './' + path.basename( templateFile ),
        type: type
    } );

    genTemplate( projectInfo, {
        file: templateFile, 
        target: templateTarget,
        classes: templateClasses
    } );
};

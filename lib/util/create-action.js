/**
 * @file 生成 Action / Model / View 及相应配置
 * @author Justineo(justice360@gmail.com)
 */

var read = require( 'read' );
var upFirstAlpha = require( './up-first-alpha' );
var path = require( 'path' );
var genAction = require( '../../lib/util/gen-action' );
var genActionConfig = require( '../../lib/util/gen-action-config' );
var genModel = require( '../../lib/util/gen-model' );
var genView = require( '../../lib/util/gen-view' );
var genTemplate = require( '../../lib/util/gen-template' );
var genStyle = require( '../../lib/util/gen-style' );
var genLessImport = require( './gen-less-import' );
var moduleToFile = require( '../../lib/util/module-to-file' );
var logger = require( '../../tool/logger' );

function readPath( pagePath, callback ) {

    function validate( err, result ) {
        if ( err ) {
            logger.error( 'ria', 'ERROR', err.message );
            return;
        }

        var pagePath = (result || '').trim().toLowerCase();

        if ( !pagePath ) {
            readPath( null, callback );
            return;
        }

        if ( pagePath[ 0 ] !== '/' ) {
            pagePath = '/' + pagePath;
        }

        if ( !/^(\/?[a-z0-9_])+$/.test( pagePath ) ) {
            logger.error( 'ria', 'ERROR', '"' + pagePath + '" is not a valid <path> for `bat-ria create action`.' );
            logger.warn( 'ria', 'WARN', '<path> should be something like `/promotion/ad/list`.' );
            readPath( callback );
            return;
        }

        callback && callback( pagePath );
    }

    if ( !pagePath ) {
        logger.verbose( 'ria', 'INFO', 'Please enter <path> for `bat-ria create`.' );
        read( { prompt: '<path>: ' }, validate );
    }
    else {
        validate( null, pagePath );
    }

}

function apis( pagePath ) {
    var util = require( 'util' );
    var crypto = require( 'crypto' );
    var md5sum = crypto.createHash( 'md5' );
    md5sum.update( new Buffer( pagePath, 'utf-8' ) );

    var value = md5sum.digest( 'hex' ).slice( 0, 8 );

    return {
        list: util.format( 'a%sList', value ),
        update: util.format( 'a%sUpdate', value ),
        detail: util.format( 'a%sDetail', value )
    };
}

function produce( projectInfo, type, pagePath ) {
    if ( type === 'action' ) {
        type = 'base';
    }

    type = upFirstAlpha( type );

    var pathSeg = pagePath.slice( 1 ).split( '/' );
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[ lastIndex ];
    pathSeg[ lastIndex ] = upFirstAlpha( templateName );

    var action = pathSeg.join( '/' );
    var model = action + 'Model';
    var view = action + 'View';
    var templateFile = path.resolve( moduleToFile( projectInfo, action ), '..', templateName ) + '.tpl.html';
    var styleFile = path.resolve( moduleToFile( projectInfo, action ), '..', templateName ) + '.less';

    var actionSegs = action.split( '/' );
    var templateTarget = 'TPL_' + actionSegs.join( '_' ).toLowerCase();
    var templateClasses = [];
    templateClasses.push( actionSegs.join( '-' ).toLowerCase().replace('_', '-') );
    templateClasses = templateClasses.join( ' ' );
    var styleClass = actionSegs.join( '-' ).toLowerCase().replace('_', '-');

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
        type: type,
        pagePath: pagePath,
        api: apis( pagePath )
    } );

    genView( projectInfo, {
        module: view,
        templateTarget: templateTarget,
        templateFile: './' + path.basename( templateFile ),
        type: type
    } );

    genTemplate( projectInfo, {
        type: type,
        file: templateFile,
        pagePath: pagePath,
        target: templateTarget,
        classes: templateClasses
    } );

    genStyle( projectInfo, {
        file: styleFile,
        pagePath: pagePath,
        mainClass: styleClass
    } );

    genLessImport( projectInfo, {
        styleFile: pagePath + '.less'
    } );

    if ( type === 'List' ) {
        var createApi = require( './create-api' );
        createApi(
            projectInfo,
            [
                'api',
                apis( pagePath ).list,    // apiName
                '/data/v1' + pagePath,    // apiPath
                'list'                    // apiType
            ]
        );
    }
} 

/**
 * 生成Action
 * 
 * @param {Object} projectInfo 项目信息对象
 * @param {Array} args 参数数组
 */
module.exports = function ( projectInfo, args ) {
    var type = args[ 0 ];

    var pagePath = args[ 1 ];

    readPath( pagePath, function ( pagePath ) {
        produce( projectInfo, type, pagePath );
    } );
};

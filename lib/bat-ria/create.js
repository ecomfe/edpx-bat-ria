/**
 * @file riaproject genpage子命令
 * @author errorrik[errorrik@gmail.com], Justineo[justice360@gmail.com]
 */

/**
 * 命令行配置项
 *
 * @inner
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'create';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '添加新的一组 Action / Model / View 和对应的 Action 配置。';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp bat-ria create <path>';

cli.options = [ 'type:' ];

var path = require( 'path' );
var genAction = require( '../util/gen-action' );
var genActionConfig = require( '../util/gen-action-config' );
var genModel = require( '../util/gen-model' );
var genView = require( '../util/gen-view' );
var genTemplate = require( '../util/gen-template' );
var moduleToFile = require( '../util/module-to-file' );

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 */
cli.main = function ( args ) {
    var dir = process.cwd();
    var edpProject = require( 'edp-project' );
    var projectInfo = edpProject.getInfo( dir );

    if ( !projectInfo ) {
        return;
    }

    var pagePath = args[ args.length - 1 ];
    if ( pagePath[ 0 ] !== '/' ) {
        pagePath = '/' + pagePath;
    }

    var pathSeg = pagePath.slice( 1 ).split( '/' );
    var lastIndex = pathSeg.length - 1;
    var templateName = pathSeg[ lastIndex ];
    var upFirstAlpha = require( '../util/up-first-alpha' );
    pathSeg[ lastIndex ] = upFirstAlpha( templateName );
    
    var type;
    if ( args[ 1 ] ) {
        type = args[ 0 ].toLowerCase();
    }
    if ( [ 'base', 'list', 'form' ].indexOf( type ) === -1 ) {
        type = 'base';
    }
    type = upFirstAlpha( type );

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

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

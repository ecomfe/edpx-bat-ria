/**
 * 更新本地工具
 *
 * @ignore
 * @type {Object}
 */
var cli = {};

/**
 * 命令名称
 *
 * @type {string}
 */
cli.command = 'update';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '更新本地工具';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [];

var chalk = require( 'edp-core' ).chalk;
var read = require( 'read' );
var logger = require( '../../tool/logger' );


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
        logger.error( 'ria', 'ERROR', 'Project info is not found.' );
        return;
    }

    var type = args[ 0 ];
    // no `<type>` specified
    if ( !type ) {
        readType( function ( type ) {
            args[ 0 ] = type;
            creators[ typeCreator[ type ] ]( projectInfo, args );
        } );
    }
    else {
        creators[ typeCreator[ type ] ]( projectInfo, args );
    }
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

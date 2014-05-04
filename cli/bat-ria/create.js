/**
 * 创建内容
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
cli.description = '添加新内容';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [];

var chalk = require( 'edp-core' ).chalk;
var read = require( 'read' );
var logger = require( '../../tool/logger' );
var Deferred = require( 'edp-core' ).Deferred;

var creators = {
    action: require( '../../lib/util/create-action' ),
    api: require( '../../lib/util/create-api' )
};
var typeCreator = {
    action: 'action',
    base: 'action',
    list: 'action',
    form: 'action',
    api: 'api'
};

function readType( callback ) {
    logger.verbose( 'ria', 'INFO', 'Please enter <type> for `bat-ria create`.' );
    console.log( chalk.bold.green( 'action' ) + ' | list | form | api' );
    read({
        prompt: '<type>: ',
        'default': 'action'
    }, function ( err, result, isDefault ) {
        if ( err ) {
            logger.error( 'ria', 'ERROR', err.message );
            return;
        }

        var type = result.toLowerCase();

        if ( !typeCreator[ type ] ) {
            logger.error( 'ria', 'ERROR', '"' + type + '" is not a valid type for `bat-ria create`.' );
            readType( callback );
            return;
        }

        callback && callback( type );
    });
}

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

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

function readConfirm( callback ) {
    logger.verbose( 'ria', 'INFO', '`bat-ria update` will overwrite files under `tool` directory. Proceed?' );
    read( {
        prompt: 'Y / N: ',
        'default': 'N'
    }, function ( err, result, isDefault ) {
        if ( err ) {
            logger.error( 'ria', 'ERROR', err.message );
            return;
        }

        result = result.toLowerCase();

        if ( [ 'y', 'yes', 'n', 'no' ].indexOf( result ) === -1 ) {
            readEntry( callback );
        }
        else {
            var confirmed = result == 'y' || result == 'yes';

            if ( confirmed ) {
                callback && callback();
            }
            else {
                logger.info( 'ria', 'INFO', 'Update canceled.' );
            }
        }
    } );
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

    readConfirm( function () {
        var copies = [
            { source: '../../tool', target: 'tool' }
        ];
        require( '../../lib/util/copy' )( projectInfo, copies );
        logger.info( 'ria', 'INFO', 'Update complete.' );
    } );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

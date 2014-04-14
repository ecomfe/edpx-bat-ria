/**
 * 初始化系统代码框架
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
cli.command = 'init';

/**
 * 命令描述信息
 *
 * @type {string}
 */
cli.description = '初始化品牌广告业务端项目';

/**
 * 命令用法信息
 *
 * @type {string}
 */
cli.usage = 'edp bat-ria init';

/**
 * 命令选项信息
 *
 * @type {Array}
 */
cli.options = [];

/**
 * 模块命令行运行入口
 * 
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令运行选项
 */
cli.main = function ( args, opts ) {
    var path = require( 'path' );
    var dir = args[ 0 ];
    if ( dir ) {
        dir = path.resolve( dir );
    }
    else {
        dir = process.cwd();
    }

    var edpProject = require( 'edp-project' );
    var projectInfo = edpProject.init( dir );
    edpProject.build.createConfigFile( projectInfo );

    var mkdirp = require( 'mkdirp' );
    mkdirp.sync( path.resolve( dir, 'src/common' ) );
    require( '../../lib/util/gen-main-module' )( projectInfo );
    require( '../../lib/util/gen-common-config' )( projectInfo );
    require( '../../lib/util/gen-constants' )( projectInfo );
    require( '../../lib/util/gen-webserver-config' )( projectInfo );

    var copies = [
        { source: '../../img', target: 'src/common/img' },
        { source: '../../css', target: 'src/common/css' },
        { source: '../../tools', target: 'tools' }
    ];
    require( '../../lib/util/copy' )( projectInfo, copies );

    var Deferred = require( 'edp-core' ).Deferred;
    console.log(Deferred);
    var exec = require( 'child_process' ).exec;
    var edpPackage = require( 'edp-package' );

    function npmInstall() {
        var deferred = new Deferred;

        console.log('npm install ' + this);

        exec( 'npm install ' + this, function ( error, stdout, stderr ) {
            if ( error ) {
                console.error( stderr );
                deferred.reject( error );
            }
            else {
                console.log( stdout );
                deferred.resolve( stdout );
            }
        } );
        return deferred.promise;
    }

    function edpImport() {
        var deferred = new Deferred;

        console.log('edp import ' + this);

        edpPackage.importFromRegistry( this, dir, function ( error, pkg ) {
            if ( error ) {
                deferred.reject( error );
            }
            else {
                deferred.resolve( pkg );
            }
        } );

        return deferred.promise;
    }

    var npmPkgs = [ 'chalk' ];
    var edpPkgs = [ 'ef', 'esf-ms', 'bat-ria' ];

    var tasks = npmPkgs.map( function ( pkg ) {
        return npmInstall.bind( pkg );
    } ).concat( edpPkgs.map( function ( pkg ) {
        return edpImport.bind( pkg );
    } ) );

    // 每次迭代将上一个task返回的`promise`和下一个task用`then`关联起来
    tasks.reduce( function ( prev, task ) {
        return prev.then( task );
    }, Deferred.resolved() )
        .then( function () {
            require( '../../lib/util/gen-main-less' )( projectInfo );
            require( '../../lib/util/gen-index' )( projectInfo );
        } );
};

/**
 * 命令行配置项
 *
 * @type {Object}
 */
exports.cli = cli;

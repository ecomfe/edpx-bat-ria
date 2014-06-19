var fs = require( 'fs' );
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );
var crypto = require('crypto');

module.exports = function ( projectInfo, map ) {
    if ( !projectInfo ) {
        return;
    }

    map.forEach(
        function ( copy ) {
            var sourceDir = path.resolve( __dirname, copy.source );
            var targetDir = path.resolve( projectInfo.dir, copy.target );

            mkdirp.sync( targetDir );
            fs.readdirSync( sourceDir ).forEach(
                function ( file ) {
                    var sourceFile = path.join( sourceDir, file );
                    var targetFile = path.join( targetDir, file );
                    var showPath = path.relative( process.cwd(), targetFile );
                    var source = fs.readFileSync( sourceFile );
                    var target;
                    if ( fs.statSync( sourceFile ).isFile() ) {
                        if ( fs.existsSync( targetFile ) && fs.statSync( targetFile ).isFile() ) {
                            target = fs.readFileSync( targetFile );
                            var sourceHash = crypto.createHash( 'md5' ).update( source ).digest( 'hex' );
                            var targetHash = crypto.createHash( 'md5' ).update( target ).digest( 'hex' );
                            if ( sourceHash != targetHash ) {
                                console.log( 'M %s', showPath );
                                fs.writeFileSync( targetFile, source );
                            }
                        }
                        else {
                            console.log( '+ %s', showPath );
                            fs.writeFileSync( targetFile, source );
                        }
                    }
                }
            );
        }
    );
};

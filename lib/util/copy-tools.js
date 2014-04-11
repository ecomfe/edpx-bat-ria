module.exports = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    var fs = require( 'fs' );
    var path = require( 'path' );
    var sourceDir = path.resolve( __dirname, '../../tools' );
    var targetDir = path.resolve( projectInfo.dir, 'tools' );

    require( 'mkdirp' ).sync( targetDir );
    fs.readdirSync( sourceDir ).forEach(
        function ( file ) {
            var sourceFile = path.join( sourceDir, file );
            var targetFile = path.join( targetDir, file );
            if ( fs.statSync( sourceFile ).isFile() ) {
                fs.writeFileSync( targetFile, fs.readFileSync( sourceFile ) );
            }
        }
    );
};

module.exports = function ( projectInfo, map ) {
    if ( !projectInfo ) {
        return;
    }

    var fs = require( 'fs' );
    var path = require( 'path' );
    var mkdirp = require( 'mkdirp' );

    map.forEach(
        function ( copy ) {
            var sourceDir = path.resolve( __dirname, copy.source );
            var targetDir = path.resolve( projectInfo.dir, copy.target );

            mkdirp.sync( targetDir );
            fs.readdirSync( sourceDir ).forEach(
                function ( file ) {
                    var sourceFile = path.join( sourceDir, file );
                    var targetFile = path.join( targetDir, file );
                    if ( fs.statSync( sourceFile ).isFile() ) {
                        fs.writeFileSync( targetFile, fs.readFileSync( sourceFile ) );
                    }
                }
            );
        }
    );
};

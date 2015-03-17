exports.input = __dirname;

var path = require( 'path' );
exports.output = path.resolve( __dirname, 'git2svn_output' );

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler({
        files: [
            'src/common/css/main.less'
        ]
    });

    return {
        'default': [ lessProcessor ]
    };
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.fecsrc',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    'index-debug.html',
    'admin-debug.html',
    'mockup',
    'node_modules',
    'build.sh',
    'output'
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

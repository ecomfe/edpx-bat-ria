exports.input = __dirname;

var path = require('path');
exports.output = path.resolve(__dirname, 'output');

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler({
        files: [
            '{{#if entryName}}src/{{entryName}}/main.less{{else}}src/common/css/main.less{{/if}}'
        ],
        pageFiles: [
            '{{#if entryName}}entry/{{entryName}}.html{{else}}index.html{{/if}}'
        ]
    });

    var cssProcessor = new CssCompressor();

    var moduleProcessor = new ModuleCompiler({
        files: [
            'dep/**/*.js',
            'src/**/*.js',
            '!customShim.js'
        ]
    });

    var tplMergeProcessor = new TplMerge({
        pluginIds: [
            'bat-ria/tpl', '../tpl'
        ],
        files: [
            'src/**/*.js',
            'dep/bat-ria/**/*.js'
        ]
    });

    var jsProcessor = new JsCompressor();
{{#entryName}}
    var pathMapperProcessor = new PathMapper({
        mapper: function (value) {
            return value.replace(/entry\/([a-zA-Z0-9_]+)\.html/g, '$1/index.html').replace('src', 'asset');
        }
    });

    var stringReplacer = new StringReplace({
        files: [
            'main.html',
            'index.html',
            '**/*.js'
        ],
        replacements: [
            {from: /entry\/([a-zA-Z0-9_]+)\.html/g, to: '$1/index.html'},
            {from: /src\/common\/img/g, to: 'asset/common/img'}
        ]
    });
{{/entryName}}
    var addCopyright = new AddCopyright();

    return {
        'debug': [lessProcessor],
        'default': [lessProcessor, moduleProcessor{{#entryName}}, pathMapperProcessor, stringReplacer{{/entryName}}],
        'release': [
            lessProcessor, cssProcessor, moduleProcessor, tplMergeProcessor,
            jsProcessor{{#entryName}}, pathMapperProcessor, stringReplacer{{/entryName}}, addCopyright
        ]
    };
};

exports.exclude = [
    'doc',
    'test',
    'module.conf',
    'node_modules',
    'mockup',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    'Desktop.ini',
    'Thumbs.db',
    'GIT_COMMIT',
    '*.tmp',
    '*.bak',
    '*.swp',
    '.*'
];

exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};

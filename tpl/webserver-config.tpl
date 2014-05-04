exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var mockup = require('./tool/mockup');
var upload = require('./tool/upload');
var cors = require('./tool/cors');

exports.getLocations = function () {
    return [
        {
            location: function(request) {
                return /\/$/.test(request.pathname);
            },
            handler: home( 'index.html' )
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: upload.getLocation(), 
            handler: upload.getHandlers()
        },
        {
            location: mockup.getLocation(),
            handler: mockup.getHandlers()
        },
        { 
            location: cors.getLocation(), 
            handler: cors.getHandlers()
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};

/**
 * @file {{{fullModule}}}View模块单测spec
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    describe('{{{fullModule}}}View', function () {
        var View = require('{{{fullModule}}}View');
        var {{{type}}}View = require('bat-ria/mvc/{{{type}}}View');
        var view = new View();

        it('extends {{{type}}}View', function () {
            expect(view instanceof {{{type}}}View).toBe(true);
        });
    });
});

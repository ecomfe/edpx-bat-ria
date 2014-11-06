/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var View = require('{{{module}}}View');
    var {{{type}}}View = require('bat-ria/mvc/{{{type}}}View');

    describe('{{{module}}}View', function () {
        var view = new View();

        it('extends {{{type}}}View', function () {
            expect(view instanceof {{{type}}}View).toBe(true);
        });
    });
});

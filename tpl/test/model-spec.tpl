/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var Model = require('{{{module}}}Model');
    var {{{type}}}Model = require('bat-ria/mvc/{{{type}}}Model');

    describe('{{{module}}}Model', function () {
        var model = new Model();

        it('extends {{{type}}}Model', function () {
            expect(model instanceof {{{type}}}Model).toBe(true);
        });
{{#eq type "List"}}
        it('must have configured a list requester', function () {
            expect(model.listRequester).toBeDefined();
        });
{{/eq}}{{#eq type "Form"}}
        it('must have configured a list requester', function () {
            expect(model.submitRequester).toBeDefined();
        });{{/eq}}
    });
});

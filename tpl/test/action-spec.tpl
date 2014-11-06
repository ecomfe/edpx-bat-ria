/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var Action = require('{{{module}}}');
    var View = require('{{{module}}}View');
    var Model = require('{{{module}}}Model');
    var {{{type}}}Action = require('bat-ria/mvc/{{{type}}}Action');

    describe('{{{module}}}', function () {
        var action = new Action();

        it('extends {{{type}}}Action', function () {
            expect(action instanceof {{{type}}}Action).toBe(true);
        });

        it('has correct type of model', function () {
            expect(action.createModel() instanceof Model).toBe(true);
        });

        it('has correct type of view', function () {
            expect(action.createView() instanceof View).toBe(true);
        });
    });
});

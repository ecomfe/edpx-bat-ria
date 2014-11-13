/**
 * @file {{{fullModule}}}模块单测spec
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    describe('{{{fullModule}}}', function () {
        var u = require('underscore');
        var Action = require('{{{fullModule}}}');
        var View = require('{{{fullModule}}}View');
        var Model = require('{{{fullModule}}}Model');
        var {{{type}}}Action = require('bat-ria/mvc/{{{type}}}Action');
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

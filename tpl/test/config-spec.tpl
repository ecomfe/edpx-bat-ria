/**
 * @file common/config模块单测spec
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    describe('config', function () {
        var config = require('common/config');

        it('should be an object', function () {
            expect(typeof config).toBe('object');
        });

        it('should have an `api` config', function () {
            expect(typeof config.api).toBe('object');
        });

        it('should have an `index` config', function () {
            expect(typeof config.index).toBe('string');
        });
    });
});

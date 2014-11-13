/**
 * @file common/constants模块单测spec
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    describe('constants', function () {
        var constants = require('common/constants');

        it('should be an object', function () {
            expect(typeof constants).toBe('object');
        });
    });
});

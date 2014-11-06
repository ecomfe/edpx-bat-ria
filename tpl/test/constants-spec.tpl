/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var constants = require('common/constants');

    describe('constants', function () {

        it('should be an object', function () {
            expect(typeof constants).toBe('object');
        });
    });
});

/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var main = require('{{{entryName}}}/main');
    var Deferred = require('er/Deferred');
    var controller = require('er/controller');
    var URL = require('er/URL');
    var ria = require('bat-ria/main');
    var u = require('underscore');

    function fakePromise(isResolved) {
        if (isResolved || isResolved === undefined) {
            return Deferred.resolved();
        }
        else {
            return Deferred.rejected();
        }
    }

    describe('main', function () {


        beforeEach(function () {
            Deferred.prototype.syncModeEnabled = true;

            spyOn(ria, 'start').and.callFake(function () {
                return fakePromise(false); // 阻止后续可能依赖后端返回的逻辑继续进行
            });

            main.start();
        });

        it('require all sub modules', function () {

            // Action配置
            // 如果期望添加action时工具自动配置，请保持actionPaths名称不变
            var actionPaths = [
                '/dev/index'
            ];

            var actionContexts = u.map(actionPaths, function (path) {
                return {
                    url: URL.parse(path)
                };
            });

            u.each(actionContexts, function (actionContext) {
                expect(controller.findActionConfig(actionContext)).toBeDefined();
            });
        });

        it('should call `start` on `bat-ria`', function () {
            expect(ria.start).toHaveBeenCalled();
        });
    });
});

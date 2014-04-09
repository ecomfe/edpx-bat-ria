/**
 * @file 入口模块
 * @author {{{author}}}({{{authorEmail}}})
 */

define(
    function (require) {

        /**
         * 引入各业务模块的Action配置
         * 如果期望添加action时工具自动配置，请保持requireConfigs名称不变
         *
         * @inner
         */
        function requireConfigs() {
            // require( '../plan/config' );
            // require( '../report/config' );
        }

        /**
         * 初始化UI，填写用户信息等
         *
         * @inner
         */
        function initView() {

            var user = require('bat-ria/system/user');
            var visitor = user.visitor;

            // 在这里用 visitor 信息初始化用户信息等 UI 元素
        }

        /**
         * 初始化系统启动
         *
         * @inner
         */
        function init() {
            require('bat-ria/main')
                .start(require('common/config'))
                .then(initView);
        }

        return {
            init: init
        };
    }
);

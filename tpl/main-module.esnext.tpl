/**
 * @file 入口模块
 * @author {{{author}}}({{{authorEmail}}})
 */

import config from 'common/config';
import user from 'bat-ria/system/user';
import nav from 'bat-ria/ui/navigator';
import main from 'bat-ria/main';

/**
 * 引入各业务模块的Action配置
 * 如果期望添加action时工具自动配置，请保持requireConfigs名称不变
 *
 * @ignore
 */
function requireConfigs() {
}

requireConfigs();

/**
 * 初始化UI，填写用户信息、初始化导航栏等
 *
 * @ignore
 */
function init() {

    let visitor = user.visitor;

    // 在这里用 visitor 信息初始化用户信息等 UI 元素
    // 以及自定义各种系统配置、导航栏等等

    // // 初始化主导航栏
    // let navConfig = config.nav;
    // if (navConfig && navConfig.navId && navConfig.tabs) {
    //     nav.init(navConfig.navId, navConfig.tabs);
    // }
}

/**
 * 启动RIA系统，请求关键数据等
 *
 * @ignore
 */
function start() {
    main.start(config).then(init);
}

export default {start};

/**
 * @file 全局配置
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {

    // 接口配置
    // 如果期望添加API时工具自动配置，请保持apiConfig名称不变
    var apiConfig = {
        user: '/data/system/session',
        constants: '/data/system/constants'
    };

    var config = {
        
        // API配置
        api: apiConfig,

        // ER默认路径
        index: '/'
    };

    return config;
});

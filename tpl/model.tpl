/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var {{{type}}}Model = require('bat-ria/mvc/{{{type}}}Model');
    var datasource = require('er/datasource');
    var api = require('common/config').api;
    var batUtil = require('bat-ria/util');

    /**
     * [Please Input Model Description]
     * 
     * @constructor
     */
    function {{{model}}}() {
        {{{type}}}Model.apply(this, arguments);{{#eq type "List"}}

        // 绑定列表请求API配置（必须）
        // this.listRequester = api.someList;{{/eq}}{{#eq type "Form"}}

        {{/eq}}
    }

    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.datasource = null;
{{#eq type "List"}}
    /**
     * @inheritDoc
     */
    // {{{model}}}.prototype.defaultTimeRange = batUtil.getTimeRange();

    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.defaultArgs = {
        order: 'desc',
        pageSize: 15
    };
{{/eq}}
    // return模块
    require('er/util').inherits({{{model}}}, {{{type}}}Model);
    return {{{model}}};
});

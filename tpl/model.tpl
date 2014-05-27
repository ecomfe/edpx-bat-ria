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

        // 列表请求器 (*)
        this.listRequester = api.{{{api.list}}};{{/eq}}{{#eq type "Form"}}

        // 表单数据请求器
        this.formRequester = api.{{{api.detail}}};

        // 表单提交请求器 (*)
        this.submitRequester = api.{{{api.update}}};{{/eq}}
    }

{{#neq pagePath "/dev/index" }}
    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.datasource = null;
{{/neq}}
{{#eq pagePath "/dev/index" }}
    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.datasource = {
        actionList: function( model ){
            return Object.keys( require('er/controller').actionPathMapping );
        }
    };
{{/eq}}
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
{{#eq type "Form"}}
    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.defaultArgs = {};

    /**
     * @inheritDoc
     */
    {{{model}}}.prototype.getExtraData = function () {
        return {};
    };
{{/eq}}
    // return模块
    require('er/util').inherits({{{model}}}, {{{type}}}Model);
    return {{{model}}};
});

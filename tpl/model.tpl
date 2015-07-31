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
     * {{{model}}}构造函数
     *
     * @class
     */
    function {{{model}}}() {
        {{{type}}}Model.apply(this, arguments);{{#eq type "List"}}

        // 列表请求器 (*)
        // this.listRequester = api.someList;{{/eq}}{{#eq type "Form"}}

        // 表单数据请求器
        // this.formRequester = api.someDetail;

        // 表单提交请求器 (*)
        // this.submitRequester = api.someUpdate;{{/eq}}
    }

{{#neq pagePath "/dev/index" }}
    /**
     * @inheritdoc
     */
    {{{model}}}.prototype.datasource = null;
{{/neq}}{{#eq pagePath "/dev/index" }}
    /**
     * @inheritdoc
     */
    {{{model}}}.prototype.datasource = {
        actionList: function (model) {
            return Object.keys(require('er/controller').actionPathMapping);
        }
    };
{{/eq}}{{#eq type "List"}}
    /**
     * @inheritdoc
     */
    // {{{model}}}.prototype.defaultTimeRange = batUtil.getTimeRange();

    /**
     * @inheritdoc
     */
    {{{model}}}.prototype.defaultArgs = {
        order: 'desc',
        pageSize: 15
    };
{{/eq}}
{{#eq type "Form"}}
    /**
     * @inheritdoc
     */
    {{{model}}}.prototype.getDefaultArgs = function () {
        return {
            id: this.get('id')
        };
    };

    /**
     * @inheritdoc
     */
    {{{model}}}.prototype.getExtraData = function () {
        return {};
    };
{{/eq}}
    // return模块
    require('er/util').inherits({{{model}}}, {{{type}}}Model);
    return {{{model}}};
});

/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */
import {{{type}}}Model from 'bat-ria/mvc/{{{type}}}Model';
import {api} from 'common/config';
{{#eq type "List"}}import {getTimeRange} from 'bat-ria/util';
{{/eq}}{{#eq pagePath "/dev/index"}}import controller from 'er/controller';
{{/eq}}

/**
 * {{{model}}}类
 *
 * @class
 */
export default class {{{model}}} extends {{{type}}}Model {

    /**
     * @override
     */
    constructor(...args) {
        super(...args);{{#eq type "List"}}

        // 列表请求器 (*)
        // this.listRequester = api.someList;{{/eq}}{{#eq type "Form"}}

        // 表单数据请求器
        // this.formRequester = api.someDetail;

        // 表单提交请求器 (*)
        // this.submitRequester = api.someUpdate;{{/eq}}
    }

    /**
     * @override
     */
    requesters = {};

{{#neq pagePath "/dev/index" }}
    /**
     * @override
     */
    datasource = null;
{{/neq}}{{#eq pagePath "/dev/index" }}
    /**
     * @override
     */
    datasource = {
        actionList(model) {
            return Object.keys(controller.actionPathMapping);
        }
    };
{{/eq}}{{#eq type "List"}}
    // /**
    //  * @override
    //  */
    // defaultTimeRange = getTimeRange();

    /**
     * @override
     */
    defaultArgs = {
        order: 'desc',
        pageSize: 15
    };
{{/eq}}
{{#eq type "Form"}}
    /**
     * @override
     */
    getDefaultArgs() {
        return {
            id: this.get('id')
        };
    }

    /**
     * @override
     */
    getExtraData() {
        return {};
    }
{{/eq}}
}

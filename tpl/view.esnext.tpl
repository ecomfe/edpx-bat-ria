/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */
import 'bat-ria/tpl!{{{templateFile}}}';
import {{{type}}}View from 'bat-ria/mvc/{{{type}}}View';
{{#eq type "List"}}import {escape} from 'underscore';
import {genListOperations} from 'bat-ria/util';

var tableFields = [
    // {
    //     field: 'id',
    //     title: 'ID',
    //     content(item) {
    //         return '#' + escape(item.id);
    //     }
    // },
    // {
    //     field: 'name',
    //     title: 'Name',
    //     content: 'name'
    // },
    // {
    //     field: 'email',
    //     title: 'Email',
    //     content(item) {
    //         var email = escape(item.email);
    //         return '<a href="mailto:' + email + '">' + email + '</a>';
    //     }
    // }
];
{{/eq}}

/**
 * {{{view}}}类
 *
 * @class
 * @extends bat-ria/mvc/{{{type}}}View
 */
export default class {{{view}}} extends {{{type}}}View {

    /**
     * @override
     */
    template = '{{{templateTarget}}}';

    /**
     * @override
     */
    uiProperties = { {{~#eq type "List"}}
        table: {
            fields: tableFields,
            sortable: true,
            columnResizable: true
        }
    {{/eq~}} };

    /**
     * @override
     */
    uiEvents = {};
}

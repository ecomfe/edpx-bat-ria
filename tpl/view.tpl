/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    // require template
    require('bat-ria/tpl!{{{templateFile}}}');

    var {{{type}}}View = require('bat-ria/mvc/{{{type}}}View');
    
    /**
     * [Please Input View Description]
     * 
     * @constructor
     */
    function {{{view}}}() {
        {{{type}}}View.apply(this, arguments);
    }
    
    /**
     * @inheritDoc
     */
    {{{view}}}.prototype.template = '{{{templateTarget}}}';
{{#eq type "List"}}
    var tableFields = [];
{{/eq}}
    /**
     * @inheritDoc
     */
    {{{view}}}.prototype.uiProperties = {
{{#eq type "List"}}
        table: {
            fields: tableFields,
            sortable: true,
            columnResizable: true
        }
{{/eq}}
    };

    /**
     * @inheritDoc
     */
    {{{view}}}.prototype.uiEvents = {};

    require('er/util').inherits({{{view}}}, {{{type}}}View);
    return {{{view}}};
});

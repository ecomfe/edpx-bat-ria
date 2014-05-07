/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var {{{type}}}Action = require('bat-ria/mvc/{{{type}}}Action');

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function {{{action}}}() {
        {{{type}}}Action.apply(this, arguments);
    }

    {{{action}}}.prototype.modelType = require('{{{model}}}');
    {{{action}}}.prototype.viewType = require('{{{view}}}');

    require('er/util').inherits({{{action}}}, {{{type}}}Action);
    return {{{action}}};
});

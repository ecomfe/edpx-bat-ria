/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var Action = require('bat-ria/mvc/{{{type}}}Action');

    /**
     * [Please Input Action Description]
     * 
     * @constructor
     */
    function {{{action}}}() {
        Action.apply(this, arguments);
    }

    {{{action}}}.prototype.modelType = require('{{{model}}}');
    {{{action}}}.prototype.viewType = require('{{{view}}}');

    /**
     * 初始化交互行为
     *
     * @protected
     * @override
     */
    {{{action}}}.prototype.initBehavior = function () {
    };

    require('er/util').inherits({{{action}}}, Action);
    return {{{action}}};
});

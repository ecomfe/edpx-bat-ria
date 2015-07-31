/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

define(function (require) {
    var {{{type}}}Action = require('bat-ria/mvc/{{{type}}}Action');

    /**
     * {{{action}}}构造函数
     *
     * @class
     */
    function {{{action}}}() {
        {{{type}}}Action.apply(this, arguments);
    }

    {{{action}}}.prototype.modelType = require('{{{model}}}');
    {{{action}}}.prototype.viewType = require('{{{view}}}');

    /**
     * @protected
     * @inheritdoc
     */
    {{{action}}}.prototype.initBehavior = function () {
        {{{type}}}Action.prototype.initBehavior.apply(this, arguments);

        // bind event handlers here
    };

    require('er/util').inherits({{{action}}}, {{{type}}}Action);
    return {{{action}}};
});

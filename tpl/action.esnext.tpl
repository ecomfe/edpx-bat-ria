/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */
import {{{type}}}Action from 'bat-ria/mvc/{{{type}}}Action';
import Model from '{{{model}}}';
import View from '{{{view}}}';

/**
 * {{{action}}}Action类
 *
 * @class
 * @extends bat-ria/mvc/{{{type}}}Action
 */
export default class {{{action}}}Action extends {{{type}}}Action {

    /**
     * @override
     */
    modelType = Model;

    /**
     * @override
     */
    viewType = View;

    /**
     * @override
     */
    initBehavior(...args) {
        super.initBehavior(...args);

        // bind event handlers here
    }
}

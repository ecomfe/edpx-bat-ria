/**
 * @file {{{fileDescription}}}
 * @author {{{author}}}({{{authorEmail}}})
 */

.{{{mainClass}}} {
{{#eq pagePath "/dev/index"}}
    line-height: 1.5;
    font-size: 120%;
    h1 {
        display: none;
    }
{{/eq}}
{{#eq type "Form"}}
    line-height: 1.5;
    font-size: 120%;

    .form-title-bar {
        height: 15px;
        line-height: 15px;
        padding: 7px 10px;
        font-weight: bold;
        color: #333333;
        border: 1px solid #BAD5F1;
        background-color: #F1F6FC;
        position: relative;
    }


    .form-data-body {
        padding: 15px 10px;
        border-left: 1px solid #BAD5F1;
        border-right: 1px solid #BAD5F1;
        border-bottom: 1px solid #BAD5F1;
        background-image: -webkit-gradient(linear, 0 0, 0 2, from(#ececec), to(#ffffff));
        background-image: -moz-linear-gradient(top, #ececec, #ffffff 2px, #ffffff);
    }
{{/eq}}
}

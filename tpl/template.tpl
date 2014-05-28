<!-- target: {{{target}}} -->
<div class="{{{classes}}}">
<h1>{{{target}}}</h1>{{#eq type "List"}}
<!-- import: listTable -->
<!-- import: listPager -->
{{/eq}}{{#eq type "Form"}}
<form class="setting-form"
      data-ui-type="Form"
      data-ui-id="form"
      data-ui-auto-validate="true"
      method="POST">
    <div class="form-title-bar">Form Title</div>
    <div class="form-data-body">
        {{#fields}}
        <div class="form-row">
            <div class="form-key">{{label}}：</div>
            <div class="form-value">
                <input data-ui-id="{{id}}"
                       data-ui-type="{{type}}"
                       data-ui-required="required"
                       data-ui-mode="text"
                       name="{{id}}"
                       value="{{value}}"/>
            </div>
        </div>
        {{/fields}}
    </div>
    <div class="form-row">
        <div class="form-key">&nbsp;</div>
        <div class="form-value">
            <button data-ui-type="Button" data-ui-id="submit" data-ui-skin="winter" type="submit">提交</button>
            <button data-ui-type="Button" data-ui-id="cancel" data-ui-skin="link" type="button">取消</button>
        </div>
    </div>
</div>
{{/eq}}
{{#eq pagePath "/dev/index"}}
<dl>
    <dt>Action列表</dt>
    <dd>
        <ol>
        <!-- for: ${actionList} as ${path}, ${index} -->
        <li>[${index}] <a href="#${path}">${path}</a></li>
        <!-- /for -->
        </ol>
    </dd>
</dl>
{{/eq}}
</div>

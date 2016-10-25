<!-- target: {{{target}}} -->
<div class="{{{classes}}}">
<h1>{{{target}}}</h1>
{{#eq type "List"}}<!-- import: listPage -->
    <!-- block: summaryContent -->
    <h3>列表页标题</h3>
    <!-- /block -->
    <!-- block: filterContent -->
    <input type="text" data-ui-type="TextBox" data-ui-id="keyword" name="keyword">
    <div data-ui-type="Button" data-ui-id="search"
        data-ui-extension-submit-type="AutoSubmit">搜索</div>
    <!-- /block -->
    <!-- block: batchContent -->
    <div data-ui-type="Button" data-ui-id="create" data-ui-skin="spring-add">新建</div>
    <!-- /block -->
<!-- /import -->
{{/eq}}{{#eq type "Form"}}<form data-ui-type="Form" data-ui-id="form" data-ui-auto-validate="true" method="POST">
    <div class="form-block">
        <h3>表单页标题</h3>
        <div class="form-body">
        {{#fields}}
            <div class="form-row">
                <div class="form-key">{{label}}：</div>
                <div class="form-value">
                    <input data-ui-id="{{id}}"
                        data-ui-type="{{type}}"
                        data-ui-required="required"
                        name="{{id}}"
                        data-ui-value="{{value}}">
                </div>
            </div>
        {{/fields}}
        </div>
    </div>
    <div class="form-operation">
        <button data-ui-type="Button" data-ui-id="submit" data-ui-skin="spring" type="submit">提交</button>
        <button data-ui-type="Button" data-ui-id="cancel" data-ui-skin="link" type="button">取消</button>
    </div>
</form>
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

<!-- target: {{{target}}} -->
<div class="{{{classes}}}">
<h1>{{{target}}}</h1>{{#eq type "List"}}
<!-- import: listTable -->
<!-- import: listPager -->
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

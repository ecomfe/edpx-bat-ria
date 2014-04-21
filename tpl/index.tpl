<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>{{title}}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    {{#cssLinks}}<link rel="stylesheet" href="{{{href}}}" />{{/cssLinks}}
    {{#loader}}<script src="{{{loaderUrl}}}"></script>{{/loader}} 
</head>

<body>
<!--[if IE 6]>
<div class="layout-ie6-out"><div class="layout-ie6-in">
<![endif]-->

<div class="header">
    <a class="logo" href="#"><img alt="" title="" src="src/common/img/logo.png" width="177" height="34"></a>
    <ul class="nav">
        <li class="nav-item-current"><a href="#">首页</a></li>
        <li><a href="#">导航1</a></li>
        <li><a href="#">导航2</a></li>
    </ul>
    <div class="user-info">
        <a class="user-name"></a>
        <a href="/user/logout">退出</a>
    </div>
</div>

{{{bodyMain}}}
<!--[if IE 6]></div></div><![endif]-->

{{#loaderConfig}}
<script>
require.config({
    baseUrl: '{{{loaderBaseUrl}}}',
    paths: { {{#forEach loaderPaths}}
        {{{key}}}: '{{{value}}}'{{^last}},{{/last}}{{/forEach}}
    },
    packages: [ {{#loaderPackages}}
        {
            name: '{{{name}}}',
            location: '{{{location}}}',
            main: '{{{main}}}'
        }{{^last}},{{/last}}
    {{/loaderPackages}}]
});
</script>
{{/loaderConfig}}
<script>
require(['common/main'], function (main) {
    main.init();
});
</script>
</body>
</html>

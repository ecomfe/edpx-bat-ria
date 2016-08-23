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
    <div class="header">
        <a class="logo" href="#"><img alt="" title="" src="{{{imgDir}}}/logo.png" width="177" height="34"></a>
        <ul id="nav" class="nav"></ul>
        <div class="user-info">
            <a class="user-name"></a>
            <a href="/user/logout">退出</a>
        </div>
    </div>
{{{bodyMain}}}
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
require(['{{{entryMainModule}}}'], function (main) {
    main.start();
});
</script>
</body>
</html>

var mockup = require('{{{toolModule}}}');

exports.response = function (path, params) {
{{#eq type "session"}}
    return mockup.session(
        // {
        //     visitor: {
        //         username: '访问者',
        //         roleId: 1,
        //         id: 123
        //     },
        //     adOwner: {
        //         username: '广告主',
        //         roleId: 1,
        //         id: 124
        //     }
        // }
    );

    // return mockup.globalFail('无法读取用户信息！');
{{/eq}}{{#eq type "ok"}}
    return mockup.ok(
        {
            // id: 1
        }
    );
{{/eq}}{{#eq type "list"}}
    return mockup.list(
        [
            {
                id: 1,
                name: 'leeight',
                email: 'liyubei@baidu.com',
                age: 10
            },
            {
                id: 2,
                name: 'Justineo',
                email: 'justice360@gmail.com',
                age: 11
            },
            {
                id: 3,
                name: 'chestnutchen',
                email: 'mini.chenli@gmail.com',
                age: 12
            },
            {
                id: 4,
                name: 'erik168',
                email: 'errorrik@gmail.com',
                age: 13
            }
        ],
        {
            totalCount: params.totalCount || 100,
            pageNo: params.pageNo || 1,
            pageSize: params.pageSize || 15,
            orderBy: params.orderBy || 'id',
            order: params.order || 'desc',
        }
    );
{{/eq}}{{#eq type "form"}}
    return mockup.ok(
        {
            id: 4,
            name: 'erik168',
            email: 'errorrik@gmail.com',
            age: 13
        }
    );

    // return mockup.globalFail('提交失败！');

    // return mockup.fieldFail(
    //     {
    //         // name: '名称过长！'
    //     }
    // );
{{/eq}}{{#eq type "global"}}
    return mockup.globalFail('请求失败！');
{{/eq}}{{#eq type "field"}}
    return mockup.fieldFail(
        {
            // name: '名称过长！'
        }
    );
{{/eq}}{{#eq type "upload"}}
    return mockup.iframeCallback(
        (params && params.callback) + '(' + JSON.stringify(params) + ');'
    );
{{/eq}}
};

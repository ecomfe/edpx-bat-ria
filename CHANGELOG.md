* 0.4.0
    - 增加权限处理的模块

* 0.3.2
    - 修复了 Model 模板中多余的分号
    - 补充了 Model 的 `@extends` 注释
    - 修复了一些其他模板上的问题

* 0.3.1
    - 添加 `.batriarc`，支持只在 `init` 时只配置一次 `esnext`

* 0.3.0
    - 增加了 ESNext 语法的支持

* 0.2.1
    - 去除了 `webserver-config.tpl` 中的 `css2file`
    - `bat-ria init` 时不再生成 `dev` Action
    - 按 `fecs` 检查结果优化了 `tpl` 目录下模板的代码格式
    - 增加了在 `create test` 时自动复制 `context.html` 的逻辑
    - 在 `context.html` 中自动补充了激活 `bat-ria/extension/underscore` 扩展的功能
    - 增加了一种新的 mockup 类型：`page`

* 0.2.0
    - 修正了 `tool` 模块引用错误导致无法正常执行的问题
    - 增加单测生成功能

* 0.1.11
    - 调整编码风格，以适应编码规范
    - 修正了一处 JS 文件模板不符合编码规范的问题

* 0.1.10
    - 将 `tool` 目录下的模块发布为单独的 NPM 包 `bat-ria-tool`
    - 更新生成 Action 时的默认模板
    - 修复了新建 Action 时没有 `@import` 相关 Less 文件的问题
    - 修复了一处代码模板包含 BOM 头的问题

* 0.1.9
    - 增加多入口页系统的相关功能
    - 修正mockup接口时上传文件保存在本地的逻辑，增加对 `multiparty` 的依赖
    - 增加 `css2file` 模块，在编译 Less 时总是输出对应 CSS 文件，方便后端调试
    - 增加 `bat-ria update` 功能
    - 增加 `CHANGELOG.md`

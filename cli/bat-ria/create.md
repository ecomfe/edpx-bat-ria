# edpx-bat-ria

## create

```bash
edp bat-ria create
```

可以用来创建 Action 或是 API 配置及 mockup。

### 创建 Action

```bash
edp bat-ria create <action-type> <action-path> <entry-name>?
```

* `<action-type>` - Action 类型，可取值为 `action` / `list` / `form`
* `<action-path>` - Action 路径，如 `/promotion/ad/list`
* `<entry-name>` - 对于多入口页系统需要指定入口名称，如 `admin`

`<action-type>` 对应的三个类型分别会使 Action 继承 `bat-ria/mvc` 下的 `BaseAction` / `ListAction` / `FormAction`，Model / View 与 Action 类似。

### 创建 API

```bash
edp bat-ria create api <api-name> <api-path> <api-type>
```

* `<api-name>` - `common/config` 的 `api` 字段下对应的 `key` 名称，后续可以通过 `api.<api-name>` 调用
* `<api-path>` - API 对应的接口路径，如 `/data/promotion/173/list`
* `<api-type>` - API 返回的数据类型，用来根据对应的模板生成初始的 mockup，可用的类型有 `ok` / `list` / `form` / `global` / `field` / `download`，其中 `download` 类型的 API 目前不会生成 mockup 数据

**仅输入 `edp bat-ria create` 或缺失参数时，可以根据向导的提示按步骤填写。**

### 创建 Entry

```bash
edp bat-ria create entry <entry-name>
```

* `<entry-name` - 入口页名称

**这个命令只能在多入口页系统中使用。**

### 创建 Auth

```bash
edp bat-ria create auth
```

用来生成锦囊风格的 `modules_tree.txt` 和 `auth.txt`，由于er2-3升级的原因，目前无法完全生成，生成的内容为大部分可预判的结构，注意手动修改。

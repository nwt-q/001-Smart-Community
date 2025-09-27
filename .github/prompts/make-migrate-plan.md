# 制作迁移计划

请深度思考。

我需要你帮我给出一个迁移计划，从旧版本的 vue2 uniapp 项目，改造迁移到现在的 vue3 版本的 uniapp 项目内。

## 术语说明

- `vue3项目` ： 即 `package.json` 指代的 uniapp 项目。
- `本项目`： 即 `vue3项目` 。
- `vue2项目`： `gitee-example` 目录下的 uniapp 项目。
- `旧项目`： 即 `vue2项目` 。

## 明确迁移内容

- 样式编写
- 接口请求
- uniapp 代码写法
- 路由
- 组件库替换

## 编写迁移计划

将你的迁移计划写在 `.github\prompts\migrate-plan` 目录内。

## 其他内容

### 001 更新，弱化接口请求的方式

请深度思考。

请你更改接口迁移计划文档。 `.github\prompts\migrate-plan\api-migration.md` 。

1. 不需要做任何鉴权功能。我不需要你增加 token 检查和鉴权的功能。全部的接口默认直接请求就能获取到数据。
2. 在你迁移接口时，请你生成合适的 typescript 类型。
3. 请你编写模拟用的假接口。接口名称和 url 路径，保持和 `旧项目` 一样的路径，但是使用的是假接口。返回写死的假数据即可。

请你按照该要求，更新接口迁移计划文档。

### 002 新建本地的 claude code agent 文件

请深度思考。

我需要你将这些迁移计划，改造成能够被 claude code 识别使用的本地 agent 文件。

1. 阅读 `.github\prompts\migrate-plan` 的迁移计划文件。
2. 将 `api-migration.md` `code-migration.md` 和 `style-migration.md` 新建为 claude code 的子代理。
3. 删除掉这三个文件，以后的迁移计划一律以 claude code 子代理的形式展示出来。
4. 恰当的更新 .github\prompts\migrate-plan\README.md 文件。

### 003 补全代理文件的 description 描述项

请深度思考。

请阅读 .claude\agents 目录下的 3 个子代理。并为最顶部的 description 部分编写简要的中文描述。

### 004 新建路由子代理

请你为我制作路由迁移功能的子代理。

1. 请先阅读 .github\prompts\make-migrate-plan.md 文档。但是你不阅读 `其他内容` 栏目下的内容。
2. 阅读 .github\prompts\migrate-plan\README.md 文档。
3. 粗略地阅读 `.claude\agents` 文件夹下面的子代理，了解子代理的格式写法。你稍后将模仿这些子代理的写法。
4. 搞清楚 `本项目` 和 `旧项目` 的路由差异，指定合适的路由迁移计划，并在 `.claude\agents` 下面制作子代理。

### 005 更新 api-migration 接口请求迁移专家 子代理

请深度思考。

我需要你更新 `api-migration` 子代理，重点更新 `2. 模拟接口实现策略` 这一部分的提示词写法。这部分的提示词写法使用了不存在的 `registerMockHandler` 函数。这不正确。

1. 请阅读 `.claude\agents\api-migration.md` 文件。**针对性**的阅读 `2. 模拟接口实现策略` 这一部分的提示词写法。不需要你全面的阅读。
2. 请阅读 `vite-plugin-mock-dev-server` 这个库。阅读 ： https://github.com/pengzhanbo/vite-plugin-mock-dev-server 这个仓库。
3. 请阅读 https://vite-plugin-mock-dev-server.netlify.app/llms.txt 文档。**请充分的**阅读关于 `vite-plugin-mock-dev-server` API 使用的文档。
4. 定义的 mock 接口，其文件格式为 `*.mock.ts` ，不是定义在 `api/mock` 这样的文件夹内。请在子代理内重点说明这个要求。
5. 按照 `vite-plugin-mock-dev-server` 的文档要求，重写基于 `vite-plugin-mock-dev-server` 的 `2. 模拟接口实现策略` 。

### 006 安装 `vite-plugin-mock-dev-server`

请深度思考。

1. 按照文档 https://vite-plugin-mock-dev-server.netlify.app/zh/guide/install 的要求，在本项目内安装该包，并在 vite 配置内配置该插件。
2. 阅读 `api-migration` 子代理的要求，安装并配置 `vite-plugin-mock-dev-server` 插件。

### 007 重构 `vite-plugin-mock-dev-server` 的目录结构

请深度思考。

目前的 mock 规则不符合我的期望，我希望你帮我更改掉目录结构。

最核心的更改： mock 文件目录从 `mock` 迁移到 `src\api\mock` 内。

1. 请你同步更改掉 `.claude\agents\api-migration.md` 文档关于此目录结构的写法。mock 文件位置改了，但是 mock 文件的格式仍旧是 `*.mock.ts` 。
2. 请阅读 https://vite-plugin-mock-dev-server.netlify.app/zh/guide/plugin-config 文档。
3. 请你同步更新 `vite.config.ts` 关于文件目录的部分，同步更改成期望的 `src\api\mock` 文件夹内。
4. 请你移动现有的 `mock` 文件，到 `src\api\mock` 内。
5. 请你及时同步更改 `src\api\mock\README.md` 文档的说明。

### 008 应用最新的 `api-migration` 子代理

请深度思考。

对 `src\api\mock` 文件夹的 mock 接口代码，应用 `api-migration` 子代理做出修改。

### 009 在 `eslint.config.mjs` 内忽略 `style/multiline-ternary` 规则

请深度思考。

在 `eslint.config.mjs` 内，为 `*.mock.ts` 格式的文件，增加规则忽略，忽略掉 `style/multiline-ternary` 规则，设置为 `off` 。

### 010 拆分业务类型

请深度思考。

请阅读 `src\types\api.ts` 和 `src\types\activity.ts` 。做好业务类型拆分。

我不希望看到全部的类型都集中在唯一一个 `src\types\api.ts` 文件内。

请你适度的做好业务类型拆分。将业务类型和公共通用的类型拆分好。

1. 将 mock 相关的类型拆分迁移到 `src\api\mock\shared` 目录内，这些类型将作为 mock 的通用工具类型。定义一个 `src\api\mock\shared\types.ts` 文件来管理这些类型。
2. 将通用类型继续保留在 `src\types\api.ts` 内。
3. 模仿 `src\types\activity.ts` 的写法，将业务类型做合理的拆分。

### 011 给 `api-migration` 子代理增加新的 mock 数据存储规则

请深度思考。

`api-migration` 子代理需要细化针对 mock 数据的存储规则。增加以下这几条规则。

- 每一个 `*.mock.ts` 单文件包含：数据库对象 + 接口定义
- 数据生成函数从 `src\api\mock\shared\mockData.ts` 导入
- 主动的使用来自 `src\types` 文件夹内拆分划分出来的业务类型。确保 mock 生成的假数据均满足业务类型。

请修改 `.claude\agents\api-migration.md` 文件。使得生成 mock 接口数据时，满足改规则。

### 012 mock 的 url 不提供明显的 `/api` 前缀

针对新建 mock 函数， `api-migration` 子代理需要增加新建 mock 函数时，其 url 地址前缀需要变更的规则。例子如下：

- 错误的 url： `/api/app/activities.updateStatus` 。
- 正确的 url： `/app/activities.updateStatus` 。

1. 在 `.claude\agents\api-migration.md` 文件内，增加该规则。确保以后使用该代理时，生成的 mock 文件的 url，不会多出额外的`/api`前缀。
2. 请你更新 `.claude\agents\api-migration.md` 文件，确保本文件内设计到的 mock 示例的 url，不包含额外的`/api`前缀。

### 013 应用 `api-migration` 子代理

请你使用 `api-migration` 子代理，对 `src\api\mock` 目录下的 `*.mock.ts` 规则的文件，使用该代理，应用该代理的规则。

1. 确保 mock 文件的 url 没有出现额外的`/api`前缀。
2. 确保 mock 文件导入了业务类型，并使用业务类型。

### 014 自定义 mock 转换器

`api-migration` 子代理定义的 mock 写法，有变化。按照以下要求更改：

1. 在 `src\api\mock\shared\utils.ts` 目录内，使用 vite-plugin-mock-dev-server 包的 `createDefineMock` 函数，定义一个 `defineUniAppMock` 函数，并对外导出。其语法请阅读： https://vite-plugin-mock-dev-server.netlify.app/zh/guide/create-define-mock 文档。
2. defineUniAppMock 函数的职责，目前仅负责实现 mock.url 的更改。增加来自环境变量的前缀即可。
3. 使用 import.meta.env.VITE_APP_PROXY_PREFIX 写法来获取环境变量的前缀。使用模板字符串来实现 url 的重新拼接。
4. 请更新 `.claude\agents\api-migration.md` 文件，我们定义 mock 接口文件时，不再直接使用 vite-plugin-mock-dev-server 提供的 `defineMock` 函数，而是使用 `src\api\mock\shared\utils.ts` 导出的 `defineUniAppMock` 函数。请更改 `api-migration` 子代理，更新该规则。
5. 更新 `api-migration` 子代理涉及到的代码示例。更新示例换成 `defineUniAppMock` 函数。

### 015 应用 `api-migration` 子代理，更新 `defineMock` 函数为 `defineUniAppMock` 函数

请你使用 `api-migration` 子代理，对 `src\api\mock` 目录下的 `*.mock.ts` 规则的文件，使用该代理，应用该代理的规则。

1. 更新 `defineMock` 函数为 `defineUniAppMock` 函数。

### 015 设计 `component-migration` 组件迁移子代理

请深度思考。

我需要你帮我设计出一个全新的子代理，名为 `component-migration` ，帮助我实现 `本项目` 和 `旧项目` 之间的组件的迁移，编写一个通用的子代理。

最终实现 ColorUI + uni-app 内置组件迁移成 wot-design-uni 组件库。

1. 简单的，粗略的阅读 `.claude\agents\style-migration.md` 文件，明确子代理的写法格式。
2. 全面的阅读 `gitee-example/components/**/*.vue` 和 `gitee-example/pages/**/*.vue` 的 vue 组件，只针对性的阅读 vue 组件的使用情况。搞清楚 `旧项目` 使用了那些旧组件。
3. 全面的阅读 https://wot-ui.cn/ 所提供的组件库列表。搞清楚有哪些组件可以使用，那些组合式 api 可以使用，可以用于替换旧组件。
4. 在 `component-migration` 子代理内，请绘制一个 markdown 格式的 table 表格，罗列出预期被迁移改造的`旧组件`，和改造替换后的`新组件`。制作一个总览性质的表格，便于我整体性的阅读。
5. `component-migration` 子代理是具体实现组件迁移的子代理，不应该包含任何迁移进度的报告。
6. 预期新建一个 `.claude\agents\component-migration.md` 文件。和其他子代理保持相同的文件目录。
7. 在 `.github\prompts\migrate-plan\README.md` 内同步补充说明 `component-migration` 代理的相关信息。

### 016 美化 `component-migration` 文档格式

阅读 `.claude\agents\component-migration.md` 文件。

将该 markdown 文档涉及到的 table 表格，改成每一列居中对齐的效果。使用 markdown 的表格语法实现表格列居中对齐。

仅需要阅读并修改表格即可。

### 017 更新 `component-migration` 子代理

1. 请阅读 https://wot-ui.cn/component/img.html 文档。
2. 针对 `component-migration` 子代理，在迁移原生 `<image>` 组件时，换成 `wd-img` 智能图片组件。请在 `component-migration` 子代理内，增加该项作为迁移要求。请不要使用不存在的 `<wd-image>` 组件，而是 `<wd-img>` 组件。
3. 更新 `.claude\agents\component-migration.md` 文件。

### 018 更新 `api-migration` 子代理

请深度思考。

1. 请阅读 `.claude\agents\api-migration.md` 文档。
2. 数据生成导入的规则，改了。我**不希望**所有数据生成函数必须从 `src/api/mock/shared/mockData.ts` 导入，这很容易导致该文件冗余，膨胀。
3. 请你更新子代理的核心规则，要求在生成 `*.mock.ts` mock 接口数据时，数据直接写在具体的 `*.mock.ts` 模拟接口内。既然每个 `*.mock.ts` 文件必须包含**数据库对象**，那么我希望具体的模拟业务数据可以存储在你设计的**数据库对象**内。请思考并理解该要求，更新 `api-migration` 子代理文档。

### 019 为 `component-migration` 子代理增加关于 `<wd-status-tip>` 组件的使用情况

首先，我需要你**全面的**、**有策略的**阅读满足一下 glob 匹配的文件。

你仅仅阅读关于空占位符，默认留空的代码实现。

- `gitee-example\components\**\*.vue`
- `gitee-example\pages\**\*.vue`

请深度思考。

1. 思考在 `gitee-example` 这个旧项目内，是如何实现空占位符的？如果接口请求没有数据时，在 vue 页面内是如何展示的？
2. 思考如何使用 `<wd-status-tip>` 组件的 api 实现替换。我的核心需求是实现项目写法迁移。

然后请你按照以下步骤和要求修改代理文件：

1. 请阅读 https://wot-ui.cn/component/status-tip.html 文档。
2. 针对 `component-migration` 子代理，在实现空状态的时候，请使用 `<wd-status-tip>` 组件。
3. 请不要使用不存在的 `<wd-empty>` 组件，而是 `<wd-status-tip>` 组件。
4. 更新 `.claude\agents\component-migration.md` 文件。重点说明该子代理要在何种情况下使用 `<wd-status-tip>` 组件，并完成组件迁移。

### 020 迁移补全 `style-migration` 子代理

1. 请完整阅读以下文件：

- `docs\style-migration\guide.md`
- `docs\style-migration\addressList-migration.md`

2. 完整阅读 `.claude\agents\style-migration.md` 文件。
3. 我需要你实现样式迁移，请你认真**思考**如何从 ColorUI 迁移到 UnoCSS + wot-design-uni 样式系统。
4. 将 `docs\style-migration\guide.md` 和 `docs\style-migration\addressList-migration.md` 的内容迁移整合到 `style-migration` 子代理内。并让 `style-migration` 子代理知道如何实现具体的样式类迁移规则。明确清楚完整的样式映射规则。
5. 对 `style-migration` 子代理文件做 markdown 表格的格式化，其 table 表格改成**居中对齐**格式。
6. 最后删除掉 `docs\style-migration` 目录内全部的 markdown 文件，我希望集合整合全部关于样式迁移的内容到 `.claude\agents\style-migration.md` 文件内，即 `style-migration` 子代理内。

### 021 uno.config.ts 应用 `style-migration` 子代理

对 `uno.config.ts` 应用 `style-migration` 子代理，确保该配置文件遵循 `style-migration` 子代理的指导原则。

请深度思考。思考如何发挥 `uno.config.ts` 的优势，实现更加完整的样式迁移配置？

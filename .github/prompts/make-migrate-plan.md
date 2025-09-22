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

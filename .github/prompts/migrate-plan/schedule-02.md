# 迁移进度与跟进提示词 02

这是一系列迁移用途的提示词。长度过长，拆分到下一个提示词文件内。

## 017 `维修工单流程模块` 系列页面迁移

我需要你帮我实现一整个 `维修工单流程模块` 系列页面的迁移。

目前全部按照 `docs\reports\repair-module-migration-plan.md` 文档重新整理的一套迁移计划，来完成该模块的集中迁移。

### 01 按照路由要求，新建简单占位符页面

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚要处理的页面。
2. 阅读 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容。
3. 我们一共需要新建 13 个页面。按照 `维修工单流程模块` 的说明。需要新建 13 个页面。
4. 阅读 `route-migration` 子代理文档。
5. 开始新建我需要的这 13 个页面。按照上述文档的要求，新增满足正确路径的页面文件。
6. 每个页面文件的最顶上，必须包括文本注释，注释说明
7. 在 `.github\prompts\route-migration-map.yml` 标记 `3. 维修管理模块 (10个页面)` 都迁移完成了。

### 02 新建路由跳转函数并在页面内使用

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚跳路由时需要传递的参数。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，针对性的阅读关于路由跳转的函数，针对性的用 `uni.navigateTo` 函数在 `旧项目` 的 vue 组件内查询清楚跳路由时的传参。
3. 按照 `route-migration` 子代理的要求，新建整个 `维修工单流程模块` 所需要的强类型路由跳转函数。
4. 在 `维修工单流程模块系列页面` 内，每一个 vue 组件顶部都补全说明跳转路由的地址、并且提供一个临时性质的按钮，和临时性质的，写死的假数据，实现点击按钮即可跳路由的功能，我需要尽早在 `维修工单流程模块系列页面` 内模拟整个跳路由的业务流程。

### 03 新建接口

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，理清楚这 13 个页面的接口。
3. 按照 `api-migration` 子代理的要求，完成接口迁移。
4. 在 `src\types\repair.ts` 内补全业务类型。
5. 允许在页面内以简陋的方式，输出全部的数据。本阶段不考虑任何美观，只考虑接口迁移，和数据展示。
6. 务必确保 `维修工单流程模块系列页面` 内，都能看到接口数据。

### 04 迁移组件

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现组件迁移。
3. 按照 `component-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的组件迁移。
4. 这个阶段只负责实现组件迁移，不考虑样式迁移。

#### 01 更改正确的图片预览写法

针对 `src\pages-sub\repair\order-detail.vue` 的 `wd-image-preview` 组件，这个组件是不存在的。

1. 请阅读 `https://github.com/Moonofweisheng/wot-design-uni/blob/master/docs/component/img.md` 文档。学会使用 `<wd-img>` 的预览功能写法。
2. 阅读`旧项目`代码 `gitee-example/pages/repairDetail/repairDetail.vue` 。think hard 了解清楚旧项目如何使用图片预览的。
3. 按照 `component-migration` 子代理的要求，修复 `src\pages-sub\repair\order-detail.vue` 组件错误使用不存在组件 `wd-image-preview` 的故障。

#### 02 逐个复查组件并依次使用 `component-migration` 子代理完成修改

<!-- TODO: 有很多 维修工单流程模块系列页面 的代码没有严格按照子代理的要求 更改替换组件 所以需要逐个检查 -->

### 05 迁移样式

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现样式迁移。
3. 按照 `style-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的样式迁移。

### 06 代码写法迁移

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件，准备实现代码迁移。
3. 按照 `code-migration` 子代理的要求，完成全部 `维修工单流程模块系列页面` 的代码迁移。

### 07 整体性检查

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确要迁移的代码。一共 13 个页面。
2. 通过 `.github\prompts\route-migration-map.yml` 关于 `3. 维修管理模块 (10个页面)` 的内容，反向阅读 `旧项目` 的 vue 组件。
3. 对全部的 `维修工单流程模块系列页面` 组件，使用全部的迁移子代理，做全面的检查，最后输出一个查漏补缺的文档。

### 08 整体性修复

1. 按照检查报告，对全部的 `维修工单流程模块系列页面` 组件，做统一的修复处理。

## 018 手动的实现 `维修工单流程模块系列页面` 的故障处理

### 01 处理类型故障

阅读以下文件出现的类型故障，并修复。

- src\api\repair.ts
- src\pages-sub\repair\add-order.vue
- src\pages-sub\repair\order-detail.vue
- src\pages-sub\repair\order-list.vue
- src\pages-sub\repair\select-resource.vue
- src\pages-sub\repair\dispatch.vue
- src\pages-sub\repair\handle.vue

请你阅读 `api-migration` code-migration component-migration 这三个子代理文件，并按照子代理的要求，修复上述文件的类型报错。并在必要的时候改写代码写法，改换合适的组件。

**绝对不要独立运行子代理**。现在的业务场景是混合上下文场景，不需要独立上下文，请你不要独立运行子代理。

你敢未经我允许就独立运行子代理，消耗了过多的 token。下次 claude code 调查文件出来的时候，我就给你打差评。

听懂了么？阅读子代理，而不是运行子代理。

### 02 继续处理类型故障

请继续处理以下文件出现的类型故障，请你通过运行类型检查命令的方式，统一处理这些类型报错：

src\api\repair.ts
src\api\mock\repair.mock.ts
src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\end-order.vue
src\pages-sub\repair\finish.vue

src\pages-sub\repair\add-order.vue
src\pages-sub\repair\order-detail.vue
src\pages-sub\repair\select-resource.vue
src\pages-sub\repair\finish.vue
src\pages-sub\repair\dispatch.vue
src\pages-sub\repair\handle.vue

请你在处理类型报错时，以 `src\types\repair.ts` 提供的类型为准，以 `src\api\repair.ts` 接口的字段为准，适当的修改上述 vue 组件的代码，确保满足类型约束。使得上述代码不出现类型报错。

---

请你以 ultrathink 的思考模式，认真阅读并思考文档要求。在思考上，请你大胆的多使用 token 做深度的，全面的，细致的推理思考。这是一个复杂的多步骤任务，请你认真的动态编排。执行每一个步骤时，都务必要主动使用尽可能多的 token 做充分详实完善完整的思考，允许你多花费时间做阅读，对比，思考。最后严格按照文档要求落实。

## 019 按照 `api-migration` 的要求重构代码

1. 认真阅读 `api-migration` 的要求。
2. 你要处理 `维修工单流程模块系列页面` 涉及到的 vue 组件。
3. 检查我列举给你的代码，确保这些异步请求，是否都统一使用了 `api-migration` 所要求的 `useRequest` 函数。如果没有，请按照 `api-migration` 的要求做
4. 检查是否缺少了 `immediate: false` 配置。缺少了就手动补全。

## 020 补全 `src\api\mock\repair.mock.ts` 的 mock 接口

1. 完整阅读 `api-migration` 子代理文件。
2. 完整阅读 `src\api\repair.ts` 接口。
3. 完整阅读 `src\api\mock\repair.mock.ts` 接口。
4. 在不允许修改 `src\api\repair.ts` 接口的情况下，按照 `api-migration` 的要求，为 `src\api\mock\repair.mock.ts` mock 接口文件，补充接口。
5. 独立运行 `api-migration` 子代理。

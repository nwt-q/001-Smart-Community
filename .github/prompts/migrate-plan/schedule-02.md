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

### 01 处理 `src\api\repair.ts` 类型故障

<!-- TODO: -->

### 02

<!-- 继续提前设计好需要批处理的故障和内容 -->

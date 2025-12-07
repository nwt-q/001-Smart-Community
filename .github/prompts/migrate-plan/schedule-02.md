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

### 01

1. 补充的 mock 接口请注意按照注释说明的序号，做好排序。
2. 在 `docs\reports\2025-11-16-api-migration-validation-repair.md` 编写你的报告。
3. 继续按照 `api-migration` 子代理的要求实现，独立运行子代理。

## 021 设计迁移 selectFloor selectUnit selectRoom 这三个页面的迁移计划

1. 阅读 `docs\reports\vue2-route-navigation-map.md` 文档的 `维修工单流程模块` 。明确清楚该模块的引用关系。
2. 重点阅读 `选择房屋相关页面` 和其他模块的关联关系。
3. 从 `维修工单流程模块` 的 `选择房屋相关页面` 内，得知 `旧项目` 的代码，搞清楚这三个页面在旧项目的 `维修工单流程模块` 内，是如何使用的。
4. 阅读 `.github\prompts\route-migration-map.yml` 关于 `选择器页面 (3个)` 的内容。明确清楚这三个旧页面在新项目内如何新建页面，如何新建路由。
5. 安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。
6. 按照顺序，按照上述子代理的要求，逐步对三个 `选择器页面` 实现代码迁移改造。
7. 这是复杂的任务，请你设计好合适的任务执行步骤。
8. 在你执行时，请**不要直接运行子代理**。否则 token 的消耗会过快。
9. 请你先设计好一个完整的，全面的迁移计划，未来我会择机要求你独立执行完整的迁移任务计划。
10. 有疑问请直接咨询我。

### 01

1. 生成你的迁移计划 markdown 文档，生成在 `.github\prompts\migrate-plan` 目录内。
2. 不要更新 `docs\reports\vue2-route-navigation-map.md` 文档，你应该更新 `.github\prompts\route-migration-map.yml` 的 `选择器页面 (3个)` 部分，来标记你已完成迁移任务。

## 022 补全完善接口

阅读以下文件：

1. src\api\floor.ts
2. src\api\room.ts
3. src\api\unit.ts

根据 `api-migration` 代理的要求，同时阅读相关的，与文件名对应的 mock 接口文件。

1. 按照 `api-migration` 代理的要求，运行 `api-migration` 代理，修复这些接口文件不规范的部分。
2. 运行 `api-migration` 代理，修复这些对应 mock 接口的内容，确保每一个接口都有对应的 mock 接口实现。
3. 不要修改掉上述文件的接口，以上述文件接口为数据源，以 `api-migration` 代理为要求，补全，修复内容。
4. 请你修复接口文件不规范的部分，但是不要新增，删除接口。接口数目不应该变化。
5. 修复完接口文件后，请你修复，补全对应的 mock 接口文件。

<!-- TODO: -->

## 023 处理代码报错

1. 阅读 `.github\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 迁移报告。
2. 阅读 `.github\prompts\route-migration-map.yml` `选择器页面 (3个)` 部分的路由迁移映射。
3. 反向阅读旧项目内对应的代码。
4. 针对 `src\pages-sub\selector` 目录下的几个选择用途的页面。
5. 这几个页面出现明显的故障，请对这三个页面，安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

## 024 对接口代码做处理

阅读以下文件：

1. src\api\floor.ts
2. src\api\room.ts
3. src\api\unit.ts

根据 `api-migration` 代理的要求，同时阅读相关的，与文件名对应的 mock 接口文件。

1. 按照 `api-migration` 代理的要求，运行 `api-migration` 代理，修复这些接口文件不规范的部分。
2. 不要修改掉上述文件的接口，以上述文件接口为数据源，以 `api-migration` 代理为要求，补全，修复内容。
3. 请你修复接口文件不规范的部分，但是不要新增，删除接口。接口数目不应该变化。

## 025 处理代码的组件使用错误

1. 阅读 `.github\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 迁移报告。
2. 阅读 `.github\prompts\route-migration-map.yml` `选择器页面 (3个)` 部分的路由迁移映射。
3. 反向阅读旧项目内对应的代码。
4. 针对 `src\pages-sub\selector` 目录下的几个选择用途的页面。
5. 这几个页面出现明显的故障，请对这三个页面，安排任务，依次按照子代理的要求，对这三个 `选择器页面` 实现代码迁移改造。
   - `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
   - `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
   - `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

## 026 添加维修记录 页面，补全选择列表的入口页面

1. 阅读 `src\pages-sub\repair\add-order.vue` 出现的 TODO 部分。
2. 阅读 `src\pages-sub\selector` 目录下的几个选择用途的页面。
3. 目前已经实现了这些选择器页面，请你在 `添加维修记录` 页面内，对接实现这些功能。
4. 实现路由跳转时，请务必使用 `.claude\agents\route-migration.md` 子代理，按照 `路由迁移子代理` 的要求实现页面跳转。
5. 请你主动使用谷歌浏览器 MCP，实现该页面的测试，测试 `添加维修记录` 页面是否能访问这些选择页面。
6. `添加维修记录` 页面可访问的 url 地址，在 `src\pages-sub\repair\add-order.vue` 文件最上面提供的 url 内可见。

## <!-- TODO: --> 027 反向检查业务字段是否准确

1. 请你阅读 `docs\reports\vue2-route-navigation-map.md` 的 `维修工单流程模块` 。
2. 根据 `.github\prompts\route-migration-map.yml` ，反向的阅读旧代码对应的 vue2 代码，确定在旧代码内，已经有的业务类型。
3. 检查 `src\pages-sub\repair` 和 `src\pages-sub\selector` 的 vue 组件，确保这些组件内的代码均满足旧代码的业务类型。
4. 按照 `.github\prompts\migrate-plan\2025-11-17-select-floor-unit-room-migration-plan.md` 文档的要求，修改对应的迁移后的代码。
5. 修改以下几个接口文件，确保这些接口文件所对应的业务类型都是准确的：
   - src\api\floor.ts
   - src\api\room.ts
   - src\api\unit.ts
   - src\api\repair.ts
6. 修改以上几个业务接口对应的 mock 接口，确保这些接口满足正确的业务类型命名。不要出现任何兼容字段名的写法。确保字段缺漏的校验写法，满足业务类型字段的要求。
7. 请你确定以旧代码出现的业务类型为准，修改现有代码的业务类型。

### 01 回答 AI 问题

1. 维修类型值：旧版 repairAdd 从 listRepairSettings 拿到的 repairType 是代码（如 1001/1002...），repairTypeName 才是中文。当前新代码的类型/Mock 使用中文枚举（如“水电维修”）。需要改成 `以代码为准，配合 repairTypeName 字段`。同时要去掉 RepairOrder 里与中文枚举绑定的类型定义（改成 string）。`repairType` 和 `repairTypeName` 都一起使用。
2. 兼容字段清理：Repair 类型里现在有 description/context、ownerName/repairName、ownerPhone/tel 等并存。按照严格的“**不要出现兼容字段名**”的要求，**全部收敛为旧版主字段**（如 context/repairName/tel 等），并同步页面/Mock。
3. 选择器接口响应形态：旧版返回字段是 apiFloorDataVoList / rooms 等，新版 API/Mock 统一返回 { list,total,... }，页面用 z-paging 直接吃 list。**保持新版分页形态**，只保证**列表元素字段**（floorId/floorNum/floorName 等）对齐旧版即可。
4. 单元/房屋字段取值：旧版 unitNum/roomNum 是纯编号，新版 Mock 里 unitNum 带了“单元”后缀，roomNum 也有构造规则。需要改成纯编号（与旧版一致）。需要补充 communityId 返回到单元/房屋项里。并且去对应使用 `unitNum/roomNum` 字段的前端页面内，加上基于 computed 的字段格式化，加上“单元”后缀。
5. 维修状态/字典：旧版状态/字典字段是 statusCd/name。当前 API/Mock 已用 statusCd/name，但 RepairStatus 类型枚举是英文单词。需要把列表里的 status/state 完全切换为 statusCd 代码（与旧版一致）。

# 迁移进度与跟进提示词

## 001 `activityDetail`

请深度思考。

1. 请阅读 `gitee-example\pages\activityDetail` 目录。
2. 请使用 `.claude\agents` 目录下面的全部的子代理 ，实现 `gitee-example\pages\activityDetail\activityDetail.vue` 页面的迁移。

## 002 `activityes`

请深度思考。

1. 请阅读 `gitee-example\pages\activityes` 目录。
2. 请使用 `.claude\agents` 目录下面的全部的子代理 ，实现 `gitee-example\pages\activityes\activityes.vue` 页面的迁移。

## 003 应用 `api-migration` 子代理更新 mock 数据存储方式

请深度思考。

1. 请阅读 `src\pages\activity` 文件夹内的 vue 组件。
2. 请使用 `api-migration` 子代理，更新 `src\api\mock\activity.mock.ts` 和 `src\api\mock\shared\mockData.ts` 文件的数据存储方式。并确保这些 mock 数据能够满足 `src\pages\activity` 文件夹内的页面的业务需求。

## 004 使用 `component-migration` 子代理更新错误的组件使用

请深度思考。

1. 请阅读 `src\pages\activity` 文件夹内的 vue 组件。
2. 请使用 `component-migration` 子代理，检查是否有使用错误的，不存在的组件。如果有，请更换成正确的组件。
3. 请你帮我把错误的 `<wd-empty>` 组件换成子代理说要求的组件。

## 005 `addressList`

请深度思考。

1. 请阅读 `gitee-example\pages\addressList` 目录。
2. 请使用 `.claude\agents` 目录下面的全部的子代理 ，实现 `gitee-example\pages\addressList\addressList.vue` 页面的迁移。

## 006 迁移整合 useAddressList.ts 文件

请深度思考。

阅读 `src\hooks\useAddressList.ts` 和 `src\pages\addressList\index.vue` 文件。

1. 请确保 `src\hooks\useAddressList.ts` 实现了 `gitee-example\pages\activityes\activityes.vue` 页面的迁移，实现了其业务逻辑。
2. 让 `src\pages\addressList\index.vue` 全面地使用 `src\hooks\useAddressList.ts` 提供的函数。将该页面全部的复杂逻辑迁移到这个组合式 api 内，并让页面使用该组合式 api。

## 007 将 `activityes` 活动列表页的代码写法改成符合子代理要求的写法

用 `style-migration` 和 `component-migration` 子代理对 `src/pages/activity/index.vue` 活动列表页做代码重构。

请深度思考。

1. 请阅读以下图，明确清楚 UI 的显示效果，确保 UI 样式不会发生更改。且更改后的 UI 样式完全相同。

![2025-10-06-07-28-17](https://s2.loli.net/2025/10/06/mTIjRd8UViBlwp5.png)

2. 阅读以下代码：

- gitee-example/pages/activityes/activityes.vue 旧代码
- src/pages/activity/index.vue 本项目。即将被更改的代码写法。

3. `src/pages/activity/index.vue` 是活动列表页，但是目前的代码写法是回退到原生的写法了，没有完全的按照子代理的要求来做。我要求你主动使用 `style-migration` 和 `component-migration` 子代理，将活动列表页的代码写法，改成满足子代理要求的写法。并同时满足 UI 样式不发生任何变化的要求。
4. 请你主动使用 `chrome-devtools` mcp 工具，以 H5 方式启动项目，预期在 `http://localhost:9000/#/pages/activity/index?currentCommunityId=COMM_001` 这个访问地址内，访问到活动列表页。请你在 `chrome-devtools` mcp 工具的帮助下，阅读代码显示效果。并确保 UI 样式在代码重构的时候，不发生任何变化。

### 01

我选择方案 1。同时你需要满足以下要求：

1. 要求继续使用 `<wd-img>` 组件。请你适当的阅读 https://wot-ui.cn/component/img.html 文档，避免上下文超限。并学会使用 `<wd-img>` 组件。
2. 按照你的建议，那就不使用 `<wd-card>` 组件。
3. 用 `<wd-img>` 组件实现 Avatar 头像组件。

### 02

请深度思考。请你继续处理样式错误。

1. 如下图所示：图标没有看到。是空白的，和之前说提供的样式差距过大。

![2025-10-06-07-59-08](https://s2.loli.net/2025/10/06/qadXpLROD8usZo5.png)

2. 如下图所示：文本全部挤压在一起了。

![2025-10-06-08-00-21](https://s2.loli.net/2025/10/06/3zwApsMJXuVDZEG.png)

请你在样式层面上解决此问题，使用 unocss 原子式样式解决。

请你继续使用 `chrome-devtools` mcp 工具，实时检查 UI 样式效果。

### 03

效果很差，请你继续处理样式问题。

1. 如下图所示：文本仍旧是出现严重的挤压。请检查 `text-gray-600 text-28rpx leading-1.6 line-clamp-2` 样式。

![2025-10-06-08-06-18](https://s2.loli.net/2025/10/06/oP1OI7lh3fa6nSt.png)

2. 如下图所示：文本显示不完全。被间距挤压。

![2025-10-06-08-07-24](https://s2.loli.net/2025/10/06/O6HLx7WsTqPE1bz.png)

3. 发布者头像是空白的。没有显示出内容。

![2025-10-06-08-08-19](https://s2.loli.net/2025/10/06/tluoWUy7RnBEj6G.png)

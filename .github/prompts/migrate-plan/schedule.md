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

### 04

你做的很好，活动说明文本，和发布者图标都显示出来了。还差一个。活动标题显示仍旧是不完全，不完整的。

如下图所示：`亲子瑜伽体验课（限额招募）` 这行文本显示不完整。只显示了中间，上下两块缺省了。请检查`底部渐变遮罩和标题`这一小块部分的样式写法。改写并确保标题文本能够正常显示出来。

请深度思考。认真检查此处的样式是否生效？

![2025-10-06-08-14-19](https://s2.loli.net/2025/10/06/N7x4Tr82Qjkbues.png)

### 05

针对 Icon 显示问题，你的解决方案是：

- 解决方案：使用 Unicode Emoji 替代 `i-carbon-*` 图标类
- 图标列表：⏰ 时间、👁 浏览、👍 点赞、💬 评论

我不认同这个方案。不希望你使用 `Unicode Emoji` 来实现 icon。

请你用以下的方式来实现这些 icon。如下例子所示：

```html
<wd-icon name="" custom-class="i-carbon-thumbs-up" />
```

1. 使用 `<wd-icon>` 组件。
2. `<wd-icon>` 组件的要求是 name 属性必填。这里你固定填写为空字符串即可。
3. `i-carbon-*` 图标类在 custom-class 内就可以生效了。请你用 custom-class 来解决 `i-carbon-*` 图标类不生效的故障。
4. 按钮大小调整等功能，请主动使用 `custom-class` 加上 unocss 的方式解决。

## 008 调整 `activityes` 活动列表页 的文本样式，放大文本样式

如下图所示：

![2025-10-06-09-51-27](https://s2.loli.net/2025/10/06/B985vTJSleayG6d.png)

1. `活动状态标签` 显示太小了。文本显示的太小了。请将其放大一些。
2. `查看详情按钮` 显示太小了。文本显示的太小了。请将其放大一些。

请你主动使用 `chrome-devtools` mcp 工具，以 H5 方式启动项目，预期在 `http://localhost:9000/#/pages/activity/index?currentCommunityId=COMM_001` 这个访问地址内，访问到活动列表页。请你在 `chrome-devtools` mcp 工具的帮助下，阅读代码显示效果。并确保只修改我所说的部分的样式，其他部分的样式不作处理。

## 009 优化 `活动详情页` 的显示效果

请深度思考。

阅读以下文件：

- gitee-example/pages/activityDetail/activityDetail.vue
- src/pages/activity/detail.vue

在 `src/pages/activity/detail.vue` `活动详情页`内，显示效果如下图所示：

![2025-10-06-10-10-07](https://s2.loli.net/2025/10/06/LnjamMf2XPBwc1I.png)

显示效果很不美观，不好看。请你在先阅读旧代码的前提下，针对性的优化 `src/pages/activity/detail.vue` `活动详情页` 的样式展示效果。

请你发挥样式想象力，制作出好看的 UI 效果。加油！

请你在 `style-migration` 和 `component-migration` 这两个子代理的约束下，完成任务。

请你主动使用 `chrome-devtools` mcp 工具，针对具体的一个活动详情，其 `活动详情页` 的访问地址为： `http://localhost:9000/#/pages/activity/index?currentCommunityId=COMM_001` 。请访问该地址来检验 UI 样式风格。

### 01 避免出现滥用 unocss 的 shortcuts 功能的情况

请深度思考。

阅读 uno.config.ts 文件，在你实现样式优化时，很多业务性质的样式都被你改写迁移到 unocss 内。请你将这具体样式写入到具体的组件内，而不是集中到 uno.config.ts 文件内。

### 02 使用 `style-migration` 子代理优化组件

阅读以下代码：

- `src\pages\activity\detail.vue`
- `src/components/activity/**/*.vue`

1. 将这些组件的命名风格改掉。严格遵循短横杠规范，并移除掉冗余多余的文件名单词。
2. 对这些 vue 组件使用 `style-migration` 子代理，用 `style-migration` 子代理实现对这些组件的样式优化。集中使用 unocss，避免出现组件长度过长的情况。简化优化 css 实现。请你认真思考，该如何将 css 样式逐步改写成 unocss，且不更改掉原有的样式。
3. 请主动使用 `chrome-devtools` mcp 工具，自主检查其 `活动详情页` 的样式情况。其 `活动详情页` 的访问地址为： `http://localhost:9000/#/pages/activity/index?currentCommunityId=COMM_001` 。请访问该地址来检验 UI 样式风格。避免出现在改造成 unocss 时，页面整体样式出现大幅度的扭曲变化的情况。

### 03 代码重构

请深度思考。

阅读以下代码：

- `src\pages\activity\detail.vue`
- `src/components/activity/**/*.vue`

1. 删除掉全部关于性能监控的内容。我们不需要考虑性能监控的东西。
2. 删除掉开发环境判断的逻辑。
3. 请认真阅读之前的图片实现逻辑，不需要使用复杂的计算属性来动态计算图片路径。请使用原来的图片显示逻辑即可。
4. 重构 src\components\activity\skeleton.vue 骨架屏的实现方式，请改成使用 https://wot-ui.cn/component/skeleton.html `<wd-skeleton>` 组件实现骨架屏。避免出现重复冗余的过度封装。

### 04 开启骨架屏动态效果和重构`交互反馈`功能的实现方式

请深度思考。

1. 骨架屏 `src\components\activity\skeleton.vue` 组件的 `<wd-skeleton>` 组件，都默认启用动态加载的动画效果。使用 `flashed` 动画效果。
2. 重构 `交互反馈` 功能。阅读 `src\components\activity\InteractionFeedback.vue` 组件。请改成使用 `<wd-toast>` 组件实现 Toast 轻提示的效果。`src\components\activity\InteractionFeedback.vue` 组件本质上属于交互提示效果的集成组件，请你用 https://wot-ui.cn/component/toast.html 来重构交互提示的效果。
3. 重构完成 `交互反馈` 功能后，请删除掉 `src\components\activity\InteractionFeedback.vue` 组件。

### 05 抽离独立的，面向 mock 的`图片路径处理函数`

请深度思考。

1. 阅读 `src\pages\activity\detail.vue` 和 `src\pages\activity\index.vue` 。
2. 找到关于 `function getImageUrl(headerImg: string)` 的`图片路径处理函数`。保留其针对 mock 场景下的路径处理逻辑。
3. 重构抽离该函数，将该函数迁移到 `src\utils\index.ts` 文件内。
4. 修改 `code-migration` 子代理，并告诉 `code-migration` 子代理，何时使用专门的`图片路径处理函数`。并确保以后执行该代理时，能够恰当的使用该`图片路径处理函数`。
5. 对 `src\pages\activity\detail.vue` 和 `src\pages\activity\index.vue` 文件，应用 `code-migration` 子代理，并使用统一的`图片路径处理函数`来实现图片加载的功能。

### 06 对齐骨架屏和实际展示内容的容器宽度

请深度思考。

现在的显示效果不好看。原本卡片之间的间距丢失了，请你在保证 unocss 原子样式的前提下，恢复卡片之间的间距。

请参考 `activity-detail-fixed-shortcuts.png` 截图。

也可以参考下图，把握清楚卡片和页面两侧之间的间距：

![2025-10-06-19-43-10](https://s2.loli.net/2025/10/06/MQdB6Z3kPYmaDbj.png)

### 07 重做 `showInteractionFeedback` 显示交互反馈函数

请深度思考。

1. 请你有策略地，针对性的，只阅读文档信息，避免出现上下文超限的情况。阅读以下文档地址：

- https://wot-ui.cn/component/toast.html
- https://wot-ui.cn/component/use-toast.html

2. 文件 `src\pages\activity\detail.vue` `活动详情页` ，根本就没有使用 wot-design-uni 的 toast 组件。请你阅读并改写该函数，使其使用 wot-design-uni 的 toast 组件实现弹框效果。

### 08 重做 `activity-actions.vue` `活动操作按钮组件`

这个组件有非常多的功能、事件、函数、属性。都是被暴露在父组件 `活动详情页` 内。这个耦合程度很高，是很糟糕的代码实践。请你仔细阅读`活动操作按钮组件`的实现功能，将这些内部功能都封装到内部组件内。就比如 `showInteractionFeedback` 显示交互反馈函数，这个函数就应该存放在 `活动操作按钮组件` 内，而不是暴露在 `活动详情页` 内。

请你仔细思考这两个组件的数据通信关系，将该组件的功能集中封装到 `活动操作按钮组件` 内。增强内聚性。避免这两个组件的高耦合。

1. 阅读 `活动详情页` src\pages\activity\detail.vue
2. 阅读 `活动操作按钮组件` src\components\activity\activity-actions.vue
3. 重构优化 `activity-actions.vue` `活动操作按钮组件` 。
4. 必须保证 `showInteractionFeedback` 显示交互反馈函数被迁移到 `活动操作按钮组件` 内。`showInteractionFeedback` 显示交互反馈函数就不应该出现在父组件 `活动详情页` 内。

### 09 编写模拟性质的 mock 接口实现，并继续重构 `活动详情页` 和 `活动操作按钮组件` 的写法

请深度思考。

1. 请阅读以下代码：

- 活动详情页 src\pages\activity\detail.vue
- 活动操作按钮组件 src\components\activity\activity-actions.vue

2. 我需要你在 `src\api\mock\activity.mock.ts` 内新建新的模拟接口。模拟实现以下接口：

- 活动点赞数变更接口。接口传参 isLiked likeCount 。
- 活动收藏数变更接口。接口传参 isCollected collectCount 。

3. 主动使用 `api-migration` 子代理，新建上述接口。
4. 在 `活动详情页` 内，收藏和点赞两个子组件事件传递上来时，作为父组件的 `活动详情页` 只做活动数据的模拟变更。只更改数据，不做接口请求。
5. 在 `活动操作按钮组件` 内，作为子组件将会调用刚才新建的这两个模拟接口。请务必使用 `code-migration` 子代理，遵照 `code-migration` 的要求，使用正确的接口请求工具，来做接口请求。
6. 在 `活动操作按钮组件` 子组件内做接口请求；在 `活动详情页` 父组件内不做接口请求，只做简单的模拟数据修改，并单向传递数据给子组件。

### 10 使用 `api-migration` 子代理优化 `活动操作按钮组件` 的接口请求

使用 `api-migration` 子代理优化 `活动操作按钮组件` 的接口请求，优化 `src\components\activity\activity-actions.vue` 组件的写法。

特别是这一段 【用组合式 api 优化这里的接口请求交互过程】，请严格遵循 `api-migration` 子代理的要求，避免写 `try/catch` 来管理接口请求的成功和失败情况。

## 010 处理 `活动操作按钮组件` 内提示框层叠位置不合适的故障

请深度思考。

如下图所示：

![2025-10-07-09-26-32](https://s2.loli.net/2025/10/07/mbVJM7Nf4KX1yap.png)

在 `src\components\activity\activity-actions.vue` 活动操作按钮组件 内，Toast 提示弹框的位置出现了遮挡。这是因为在子组件范围内，空间就只有那么大，所以会遮挡。

请你按照我提供的方案和步骤，逐步完成故障修复：

1. **全局组件的格式准备**： 请你对 `src\components\global` 内的 vue 组件做目录层级划分，并对组件做文件重命名，整理好这些文件。
2. **注册使用全局组件**： 去 `src\App.ku.vue` 内检查这些全局组件是否按照各自的文档要求所述，在根组件内定义好这些全局组件。
3. **补全 CommonUtil 导入**： 去 `src\hooks\useGlobal*.ts` 这几个组合式 api 文件内，补全从 `wot-design-uni` 模块导出的 CommonUtil 对象。
4. **补全 getCurrentPath 导入**： 去 `src\hooks\useGlobal*.ts` 这几个组合式 api 文件内，补全从 `src\utils\index.ts` 模块导出的 getCurrentPath 函数。
5. **及时更新文档说明的路径地址**：去 `src\components\global` 内找到你整理好的 md 文件，找到类似于 `import { useGlobalMessage } from '@/composables/useGlobalMessage'` 的写法，及时的从 composables 改成 hooks 。因为组合式 api 的文件导入地址是 hooks，而不是 composables 。
6. **更新 component-migration**： 在 `component-migration` 子代理内，更新关于的 Toast 、 Message 、 Loading 这三个组件的用法。以后实现类似的功能时，一律使用全局组件提供的功能，一律使用组合式 api 来实现该功能。子代理提供这几个组合式 api 的使用文档链接即可，不需要写很详细的组件用法，避免 `component-migration` 子代理文件文本过长。
7. **使用子代理改写组件写法**： 使用 `component-migration` 子代理去改写 活动操作按钮组件对 Toast 组件的用法，改成组合式 api 的用法。
8. **运行项目并检查**： 主动使用 MCP 工具 `chrome-devtools` ，以 `/pages/activity/detail?activitiesId=ACT_018&currentCommunityId=COMM_001` 地址为例，进入该活动详情页，并模拟用户的点赞、收藏这两个行为，检查提示框是否还会出现遮挡的情况。

## 011 微调优化 `活动详情页` 的页面元素布局

<!-- TODO -->

请深度思考。

请阅读以下截图：

1. 点赞按钮在点击后，没有颜色了看不到其图标了。请优化。

![2025-10-09-11-46-22](https://s2.loli.net/2025/10/09/ZIWbikBqNGTvQKH.png)

2. 在 `活动信息组件` 内，活动标题 和 状态标签 在视觉效果上没有对齐成一条线，请调整成水平对齐。请优化。请确保在优化后，当活动标题比较长时，其 状态标签 仍旧排在标题后面，正常换行。

![2025-10-09-11-48-03](https://s2.loli.net/2025/10/09/J1qdxBrnvFszkDu.png)

## 012 处理错误的活动状态取值

在 `活动详情页` 内，activity 的 status 取值不满足类型约束，请修改。并连带地将相关的组件，对 status 的使用也一同更改。不要出现错误使用 status 取值的情况。

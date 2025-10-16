# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 主动问询实施细节

在我与你沟通并要求你具体实施更改时，难免会遇到很多模糊不清的事情。

请你深度思考这些`遗漏点`，`缺漏点`，和`冲突相悖点`，**并主动的向我问询这些你不清楚的实施细节**。

我会与你共同补充细化实现细节。我们先迭代出一轮完整完善的实施清单，然后再由你亲自落实实施下去。

## 对话沟通术语表

在我和你沟通时，我会使用以下术语，便于你理解。

### 全局术语

在任何沟通下，这些术语都生效。

- `vue3项目` ： 即 `package.json` 指代的 uniapp 项目。
- `本项目`： 即 `vue3项目` 。
- `vue2项目`： `gitee-example` 目录下的 uniapp 项目。
- `旧项目`： 即 `vue2项目` 。
- `Vue2 到 Vue3 uni-app 路由迁移映射表`： `.github\prompts\route-migration-map.yml` 文件。
- `api-migration`： api 迁移子代理。位于 `.claude\agents` 目录内。
- `code-migration`： 代码写法迁移子代理。位于 `.claude\agents` 目录内。
- `component-migration`： 组件迁移子代理。位于 `.claude\agents` 目录内。
- `route-migration`： 路由迁移子代理。位于 `.claude\agents` 目录内。
- `style-migration`： 样式迁移子代理。位于 `.claude\agents` 目录内。

### 业务术语

在实现具体业务时，某些热点组件会经常修改，为了便于沟通，这里说明清楚其简称，便于你快速找到对应组件。

- `房屋申请系列页面` ： `src\pages-sub\property\*.vue` ，一个 glob 匹配语法，指代一系列 vue 组件。
- `活动操作按钮组件` ： `src\components\activity\activity-actions.vue`
- `活动信息组件` ： `src\components\activity\activity-info.vue`
- `活动详情页` ： `src\pages\activity\detail.vue`
- `活动列表页` ： `src\pages\activity\index.vue`

## 迁移任务的重要原则

在实现 `vue3项目` 迁移到 `vue2项目` 时，请遵守以下几条重要原则：

1. 所有的接口都是mock假接口： 全部的接口都是使用本地的 `vite-plugin-mock-dev-server` 插件实现的假接口。
2. 不考虑严格的登录逻辑： 我们不做任何登录功能。关于token的存储，读取，管理，使用的功能与逻辑，在 `vue3项目` 内都不做。
3. 不考虑严格的鉴权逻辑： 我们不做任何鉴权功能。在跳转路由的时候，`vue3项目` 不做任何形式的鉴权处理。任何页面都可以随意跳转，任意访问。
4. 不许滥用 unocss 的 shortcuts 功能： 不要将业务性质的，非公共性质的样式类，都写入到 `uno.config.ts` 配置文件内。避免滥用全局变量性质的配置文件，

## 代码/编码格式要求

### 1. markdown 文档的 table 编写格式

每当你在 markdown 文档内编写表格时，表格的格式一定是**居中对齐**的，必须满足**居中对齐**的格式要求。

### 2. javascript / typescript 的代码注释写法

代码注释写法应该写成jsdoc格式。而不是单纯的双斜杠注释。比如：

不合适的双斜线注释写法如下：

```ts
// 模拟成功响应
export function successResponse<T>(data: T, message: string = '操作成功') {
  return {
    success: true,
    code: ResultEnum.Success,
    message,
    data,
    timestamp: Date.now(),
  }
}
```

合适的，满足期望的 jsdoc 注释写法如下：

```ts
/** 模拟成功响应 */
export function successResponse<T>(data: T, message: string = '操作成功') {
  return {
    success: true,
    code: ResultEnum.Success,
    message,
    data,
    timestamp: Date.now(),
  }
}
```

### 3. unocss 配置不应该创建过多的 shortcuts 样式类快捷方式

在你做样式迁移的时候，**不允许滥用** unocss 的 shortcuts 功能。不要把那么多样式类都设计成公共全局级别的快捷方式。

### 4. vue组件编写规则

1. vue组件命名风格，使用短横杠的命名风格，而不是大驼峰命名。
2. 先 `<script setup lang="ts">`、然后 `<template>`、最后是 `<style scoped>` 。
3. 每个vue组件的最前面，提供少量的html注释，说明本组件是做什么的。

### 5. jsdoc 注释的 `@example` 标签不要写冗长复杂的例子

1. 你应该积极主动的函数编写 jsdoc 注释的 `@example` 标签。
2. 但是 `@example` 标签不允许写复杂的例子，请写简单的单行例子。完整的函数使用例子，你应该择机在函数文件的附近编写md文档，在文档内给出使用例子。

## 其他注意事项

1. 每次你完成更改时，都**不要运行**任何类型检查命令。我们项目不需要你去运行类型检查命令。
2. 不要去更改 `prettier.config.js` 文件，**不要自作主张**的给这个配置文件**增加单引号**。

## 项目概述

这是基于 unibest 框架的智慧社区物业管理系统，使用 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 技术栈开发，支持 H5、小程序、APP 多平台。

## 开发环境要求

- Node.js >= 22
- pnpm >= 10
- Vue Official >= 2.1.10
- TypeScript >= 5.0

## 常用开发命令

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
# H5 开发 (默认端口 9000)
pnpm dev
pnpm dev:h5

# 微信小程序开发
pnpm dev:mp
pnpm dev:mp-weixin

# APP 开发
pnpm dev:app

# 其他小程序平台
pnpm dev:mp-alipay    # 支付宝小程序
pnpm dev:mp-baidu     # 百度小程序
pnpm dev:mp-toutiao   # 字节跳动小程序

# 测试/生产环境
pnpm dev:test         # 测试环境
pnpm dev:prod         # 生产环境
```

### 构建打包

```bash
# H5 构建
pnpm build
pnpm build:h5

# 微信小程序构建
pnpm build:mp
pnpm build:mp-weixin

# APP 构建
pnpm build:app

# 环境区分构建
pnpm build:test       # 测试环境构建
pnpm build:prod       # 生产环境构建
```

### 代码质量检查

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check
```

### 其他常用命令

```bash
# 依赖升级
pnpm up-taze

# API 接口类型生成
pnpm openapi-ts-request

# 文档开发/构建
pnpm docs:dev
pnpm docs:build

# 持续集成构建
pnpm ci
```

## 项目架构与目录结构

### 核心配置文件

- `package.json` - 项目依赖和脚本配置
- `vite.config.ts` - Vite 构建配置，包含插件配置和平台适配
- `manifest.config.ts` - uni-app 应用清单配置
- `pages.config.ts` - 页面路由配置
- `uno.config.ts` - UnoCSS 配置
- `tsconfig.json` - TypeScript 配置

### 源码目录结构

```
src/
├── api/            # API 接口定义
├── components/     # 公共组件
├── hooks/          # Vue3 组合式函数
├── http/           # HTTP 请求封装
├── layouts/        # 页面布局组件
├── pages/          # 主要页面文件
├── pages-sub/      # 分包页面
├── router/         # 路由配置
├── service/        # 业务服务层
├── static/         # 静态资源
├── store/          # 状态管理 (Pinia)
├── style/          # 全局样式
├── tabbar/         # 底部导航栏
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── App.vue         # 应用入口组件
├── main.ts         # 应用入口文件
└── uni.scss        # uni-app 全局样式
```

### 核心技术栈

- **框架**: uni-app 3.x (Vue3 + TypeScript)
- **构建工具**: Vite 5.x
- **状态管理**: Pinia 2.x + pinia-plugin-persistedstate (持久化)
- **HTTP 请求**: Alova (适配 uni-app)
- **UI 组件库**: wot-design-uni
- **样式方案**: UnoCSS + SCSS
- **分页组件**: z-paging
- **日期处理**: dayjs
- **代码质量**: ESLint + TypeScript + husky + commitlint

### 环境配置

项目使用自定义 `env/` 目录管理环境变量：

- `env/.env.development` - 开发环境配置
- `env/.env.test` - 测试环境配置
- `env/.env.production` - 生产环境配置

### 路由与页面管理

- 使用约定式路由，文件名即路由路径
- 支持分包加载，分包页面放在 `pages-sub/` 目录
- 布局组件放在 `layouts/` 目录，支持嵌套布局

### 平台适配策略

- 使用条件编译 (`#ifdef` / `#endif`) 处理平台差异
- 支持的平台：H5、微信小程序、APP、支付宝小程序等
- 平台特定代码应放在对应的条件编译块中

### 开发调试

- **H5**: 访问 http://localhost:9000
- **微信小程序**: 构建后导入 `dist/dev/mp-weixin` 到微信开发者工具
- **APP**: 构建后导入 `dist/dev/app` 到 HBuilderX

### 业务特点

这是一个智慧社区物业管理系统，主要功能模块包括：

- 公告管理
- 维修录单
- 通讯录
- 投诉录单
- 物业员工工作台

当前项目处于开发阶段，使用 `dev-rc` 分支进行开发，主分支为 `main`。

### 重要注意事项

1. 必须使用 pnpm 作为包管理器
2. 代码提交前会自动进行 ESLint 检查和格式化
3. 遵循 uni-app Vue3 + TypeScript 开发规范
4. 新增组件会自动注册，无需手动引入
5. 使用 UnoCSS 进行样式开发，支持原子化 CSS

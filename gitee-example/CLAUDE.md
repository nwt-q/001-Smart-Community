# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

HC掌上物业是一个完全开源的小区物业管理系统移动端应用，基于uni-app框架开发，支持一次编码多端运行（小程序、H5、APP）。项目包含工单维修、巡检打卡、采购管理、物品领用、投诉处理、房产管理、通讯录、公告等功能模块。

## 开发环境配置

### 运行和构建命令

此项目使用uni-app框架，开发和构建主要通过HBuilderX IDE进行：

- **开发调试**: 在HBuilderX中打开项目，选择运行到对应平台
- **H5开发**: 运行到浏览器，开发服务器端口为8000
- **小程序开发**: 运行到微信开发者工具
- **APP调试**: 运行到手机基座或自定义调试基座

### 配置文件

- **主配置**: `conf/config.js` - 核心配置文件，包含服务器地址、日志级别等
- **页面配置**: `pages.json` - 页面路由和导航配置
- **应用配置**: `manifest.json` - 应用打包和平台配置
- **依赖管理**: `package.json` - npm依赖管理

### 重要配置说明

在`conf/config.js`中需要根据部署环境修改：
- `baseUrl`: 后端服务器地址
- `commonBaseUrl`: 图片等资源服务器地址
- `QQMapKey`: 腾讯地图API密钥
- `appPayKey`: APP支付密钥

## 项目架构

### 目录结构

```
├── api/           # API接口模块，按功能域划分
├── components/    # 公用组件
├── conf/          # 配置文件
├── constant/      # 常量定义
├── lib/           # 第三方库和工具类
├── pages/         # 页面文件，按功能模块组织
├── static/        # 静态资源
├── store/         # Vuex状态管理
└── style/         # 全局样式
```

### 核心架构模式

1. **Java110Context模式**:
   - 统一的上下文对象，提供全局工具方法和API调用
   - 通过`lib/java110/Java110Context.js`提供统一接口
   - 在`main.js`中注册为Vue原型方法

2. **模块化API设计**:
   - API按业务域划分（如repair、complaint、inspection等）
   - 每个模块包含独立的接口定义和数据处理
   - 使用统一的请求封装和错误处理

3. **页面路由结构**:
   - 首页(`pages/index`) - 主要功能入口
   - 工作台(`pages/index/work`) - 工作流程管理
   - 功能模块页面按业务分组（维修、投诉、巡检、采购等）

### 关键技术组件

- **UI框架**: ColorUI + uni-app内置组件
- **状态管理**: Vuex (store目录)
- **地图服务**: 腾讯地图API
- **文件处理**: file-saver库
- **网络请求**: uni.request封装 + vue-jsonp

### 业务流程核心模块

1. **用户认证流程**:
   - 登录页面: `pages/login/login`
   - 会话管理: `lib/java110/api/Java110SessionApi.js`
   - 权限控制: 通过`hasPrivilege()`方法检查

2. **工单处理流程**:
   - 维修工单: `pages/repairOrder/` 系列页面
   - 投诉处理: `pages/complaint*/` 系列页面
   - 巡检管理: `pages/inspection*/` 系列页面

3. **资源管理流程**:
   - 采购申请: `pages/resource/` 下的采购相关页面
   - 物品管理: `pages/resource*/` 系列页面

## 开发注意事项

### 环境适配

项目需要适配多个平台，在开发时注意：

- 使用`#ifdef` / `#ifndef`条件编译指令适配不同平台
- H5环境使用代理配置处理跨域问题
- 小程序需要配置合法域名和权限

### 数据存储

- 使用`uni.setStorageSync/getStorageSync`进行本地存储
- 通过Java110Context提供的`setJson/getJson`方法处理复杂对象
- 敏感信息如用户token通过加密存储

### 接口调用规范

- 统一使用`lib/java110/request.js`进行网络请求
- API接口定义在`constant/url.js`中统一管理
- 请求头通过`getHeaders()`方法统一设置

### 组件使用

- 优先使用uni-app内置组件保证跨平台兼容性
- 自定义组件放在`components`目录
- 使用ColorUI提供的样式组件
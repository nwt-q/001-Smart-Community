# 初始化 turbo 配置

请深度思考。

1. 安装 turbo 依赖。开发环境依赖即可。
2. 配置 turbo 任务。配置 turbo.json 任务依赖文件。
3. 定义位于根包的 `do-build` 任务。该任务依赖于 build 和 docs:build 这两个根包内的命令。
4. 运行 ci 任务，用于测试。

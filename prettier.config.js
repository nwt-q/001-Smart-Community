// @ts-check
/**
 * @type {import("prettier").Config}
 * @description 此处的配置均照搬至 .editorconfig 文件
 */
const config = {
  plugins: ['prettier-plugin-lint-md', '@prettier/plugin-oxc'],

  // 本项目的代码风格是使用单引号 而不是双引号
  singleQuote: true,
  printWidth: 120,

  // 本项目的代码风格是不使用分号
  semi: false,
  // jsxSingleQuote: true,

  // 本项目的代码风格是不使用tab 而是使用空格
  useTabs: false,

  // 缩进大小 2
  tabWidth: 2,

  // 本项目的代码风格是使用lf
  endOfLine: 'lf',

  'space-around-alphabet': true,
  'space-around-number': true,
  'no-empty-code-lang': false,
  'no-empty-code': false,
}

export default config

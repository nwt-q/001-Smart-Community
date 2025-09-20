/**
 * @filename: lint-staged.config.js
 * @description 用于配置lint-staged的配置文件。
 * @type {import('lint-staged').Configuration}
 * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#typescript
 */
export default {
  /**
   * 排除gitee-example目录
   * @see https://github.com/lint-staged/lint-staged/blob/main/README.md#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports
   * @example '*': 'prettier --ignore-unknown --experimental-cli --write'
   * @description
   * !(gitee-example) - 排除 gitee-example 文件夹
   */
  '!(gitee-example)/**/*': 'eslint --fix',
}

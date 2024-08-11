module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native',

    'plugin:@typescript-eslint/recommended',
    'prettier', // 确保 ESLint 配置中的规则不会与 Prettier 规则冲突
    'plugin:prettier/recommended', // 自动启用 Prettier 插件，并将 Prettier 规则作为 ESLint 错误
  ],
  plugins: ['prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': 'error',

    // 检测并删除未使用的导入
    'unused-imports/no-unused-imports-ts': 'warn',
    'unused-imports/no-unused-vars-ts': [
      'warn',
      {
        varsIgnorePattern: '^_', // 确保这里没有设置成 "^.*$" 或类似的模式
        argsIgnorePattern: '^_',
      },
    ],

    // 关闭默认的未使用变量检测规则
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    // 其他 ESLint 规则
    // quotes: ['error', 'single'], // 使用单引号

    indent: 'off', // 不使用 indent 规则
    'no-tabs': 'off',
    'keyword-spacing': ['error', { before: true, after: true }], // 冒号后面必须有一个空格
    // 'space-before-function-paren': ['error', 'always'], // 函数名与括号之间有一个空格
    'space-before-function-paren': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }], // 最多有2个空行，文件末尾不能有空行
    'react-native/no-inline-styles': 'off',
    'object-property-newline': 'off',
  },
}

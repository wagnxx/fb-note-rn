module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native',

    'plugin:@typescript-eslint/recommended',
    'prettier', // 确保 ESLint 配置中的规则不会与 Prettier 规则冲突
    'plugin:prettier/recommended', // 自动启用 Prettier 插件，并将 Prettier 规则作为 ESLint 错误
  ],
  plugins: ['prettier'],
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     singleQuote: true, // 使用单引号而不是双引号
    //     semi: false, // 不在语句末尾添加分号
    //     trailingComma: 'all', // 多行对象和数组最后一个元素后添加逗号
    //     arrowParens: 'avoid', // 箭头函数参数避免使用圆括号
    //     bracketSpacing: true, // 对象字面量的大括号内部前后添加空格
    //     jsxBracketSameLine: false, // 多行 JSX 元素的结束符号不与起始标签对齐
    //     endOfLine: 'auto', // 行尾换行符的样式，自动匹配当前操作系统的默认设置
    //     spaceBeforeFunctionParen: true, // 在 Prettier 的配置中禁用函数名和括号之间的空格规则
    //     tabWidth: 2,
    //     useTabs: false,
    //   },
    // ],
    'prettier/prettier': 'error',

    // 其他 ESLint 规则
    // quotes: ['error', 'single'], // 使用单引号

    indent: ['error', 2, { SwitchCase: 2 }], // 缩进为 2 个空格，SwitchCase 缩进也为 2
    'no-tabs': 'off',
    'keyword-spacing': ['error', { before: true, after: true }], // 冒号后面必须有一个空格
    // 'space-before-function-paren': ['error', 'always'], // 函数名与括号之间有一个空格
    'space-before-function-paren': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }], // 最多有2个空行，文件末尾不能有空行
    '@typescript-eslint/no-unused-vars': 2,
    'no-unused-vars': 'off',
    'react-native/no-inline-styles': 'off',
    'object-property-newline': 'off',
  },
}

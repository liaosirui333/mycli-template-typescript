const { getESLintConfig } = require('@iceworks/spec');

module.exports = getESLintConfig('react-ts', {
  rules: {
    'react/jsx-filename-extension': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    "no-const-assign": 2,//禁止修改const声明的变量
    "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-dupe-args": 2,//函数参数不能重复
    "no-duplicate-case": 2,//switch中的case标签不能重复
    "no-eq-null": 2,//禁止对null使用==或!=运算符
    "no-func-assign": 2,//禁止重复的函数声明
    "no-implicit-coercion": 1,//禁止隐式转换
    "no-redeclare": 2,//禁止重复声明变量
    "no-sparse-arrays": 2,//禁止稀疏数组， [1,,2]
    "no-unneeded-ternary": 2,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
    "no-var": 2,//禁用var，用let和const代替
    "camelcase": 2,//强制驼峰法命名
    "eqeqeq": 2,//必须使用全等
    "quotes": [2, "single"],//引号类型 `` "" ''
    "prefer-spread": 0,//首选展开运算
    "max-len": [2, { code: 400 }]  // 单个文件代码行数不得超过400行
  },
});

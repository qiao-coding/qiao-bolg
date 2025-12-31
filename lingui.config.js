module.exports = {
  locales: ['zh', 'en', 'jp'], // 支持的语言
  sourceLocale: 'zh', // 源语言（代码中使用的语言）
  catalogs: [
    {
      path: 'locales/{locale}',
      include: ['src'],
      exclude: ['**/node_modules/**', '**/*.test.{js,jsx,ts,tsx}', '**/*.stories.{js,jsx,ts,tsx}'],
    },
  ],
  compile: {
    strict: false, // 允许缺失的翻译
    pseudolocale: {
      locale: 'pseudo', // 伪本地化语言
      prefix: '【',
      suffix: '】',
    },
  },
  extract: {
    // 提取配置
    js: {
      babelOptions: {
        plugins: [
          ['@lingui/babel-plugin-jsx-icu', { 
            // ICU 消息格式化选项
            enforceDescriptions: false,
            sourceMaps: true,
          }],
        ],
      },
    },
  },
  formatOptions: {
    // 格式化选项
    origins: true, // 包含源文件信息
    lineNumbers: true, // 包含行号
  },
};

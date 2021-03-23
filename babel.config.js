module.exports = {
  presets: [
    [
      '@babel/preset-env',
      // 待配置
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
};

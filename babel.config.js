module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@contexts': './src/contexts',
            '@theme': './src/theme',
            '@assets': './src/assets',
            '@lib': './src/lib',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@i18n': './src/i18n',
          },
        },
      ],
    ],
  };
}; 
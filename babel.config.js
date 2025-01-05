module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.web.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.web.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@symptoms': './src/features/symptoms',
            '@symptoms/components': './src/features/symptoms/components',
            '@symptoms/hooks': './src/features/symptoms/hooks',
            '@symptoms/types': './src/features/symptoms/types',
            '@symptoms/constants': './src/features/symptoms/constants',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@theme': './src/theme',
            '@services': './src/services',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@lib': './src/lib',
            '@i18n': './src/i18n',
            '@styles': './src/styles',
            '@context': './src/context',
            '@navigation': './src/navigation'
          },
        },
      ],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ]
    ]
  };
}; 
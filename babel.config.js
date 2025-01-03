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
            '@screens': './src/screens',
            '@screens/*': './src/screens/*',
            '@contexts': './src/contexts',
            '@theme': './src/theme',
            '@lib': './src/lib',
            '@navigation': './src/navigation',
            '@assets': './src/assets'
          },
        },
      ],
    ],
  };
}; 
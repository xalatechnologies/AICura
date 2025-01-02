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
            '@services': './src/services',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@styles': './src/styles',
            '@hooks': './src/hooks'
          }
        }
      ]
    ]
  };
}; 
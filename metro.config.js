// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add TypeScript extensions
config.resolver.sourceExts.push('tsx', 'ts');

// Add web extensions
config.resolver.assetExts.push('cjs');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.ts', 'web.tsx'];

module.exports = config;

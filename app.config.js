import 'dotenv/config';

module.exports = {
  name: 'AICura',
  slug: 'aicura',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1E293B'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.aicura.healthcareapp'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1E293B'
    },
    package: 'com.aicura.healthcareapp'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-build-properties',
      {
        ios: {
          newArchEnabled: true,
          deploymentTarget: '15.1',
        },
        android: {
          newArchEnabled: true,
          compileSdkVersion: 33,
          targetSdkVersion: 33,
          buildToolsVersion: '33.0.0',
        },
      },
    ],
  ],
}; 
import 'dotenv/config';

module.exports = {
  name: 'HealthcareApp',
  slug: 'HealthcareApp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/app-icon.svg',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/splash.svg',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ailege.healthcareapp',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/app-icon.svg',
      backgroundColor: '#5AB19A',
    },
    package: 'com.ailege.healthcareapp',
  },
  web: {
    favicon: './src/assets/images/app-icon.svg',
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
    'expo-localization'
  ],
};
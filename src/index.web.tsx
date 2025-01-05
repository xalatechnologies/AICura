import { AppRegistry } from 'react-native';
import App from '../App';

const APP_NAME = 'AICura';

// Register the app
AppRegistry.registerComponent(APP_NAME, () => App);

// Setup web-specific configuration
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  AppRegistry.runApplication(APP_NAME, {
    rootTag,
    initialProps: {},
  });
} 
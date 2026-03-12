/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// No notification code here at all
// Everything is handled in NotificationHandler.js

AppRegistry.registerComponent(appName, () => App);
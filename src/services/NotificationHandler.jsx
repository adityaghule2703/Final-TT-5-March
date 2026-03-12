import messaging from '@react-native-firebase/messaging';
import NotifeeService from './NotifeeService';

class NotificationHandler {
  constructor() {
    this.initialized = false;
    this.handlersSet = false;
  }

  initialize = () => {
    if (this.initialized) {
      console.log('🔔 Already initialized');
      return;
    }
    
    console.log('🔔 Setting up notifications...');
    
    // Initialize Notifee
    NotifeeService.initialize();
    
    // Disable FCM auto-init
    messaging().setAutoInitEnabled(false);
    
    // Foreground handler - only set once
    const foregroundUnsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("📨 Foreground message");
      await NotifeeService.displayNotification(remoteMessage);
    });

    // Background handler - only set once (using a flag to ensure it's only set once globally)
    if (!this.handlersSet) {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("📨 Background message");
        await NotifeeService.initialize();
        await NotifeeService.displayNotification(remoteMessage);
        return Promise.resolve();
      });
      
      this.handlersSet = true;
      console.log('✅ Background handler set');
    }

    this.initialized = true;
    console.log('✅ Notifications ready');
    
    return foregroundUnsubscribe;
  };
}

export default new NotificationHandler();
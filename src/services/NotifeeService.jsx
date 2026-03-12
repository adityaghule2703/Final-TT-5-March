import notifee, { AndroidImportance, AndroidCategory, AndroidVisibility, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Store for recently processed notifications with timestamp
const processedNotifications = new Map();
const DEDUP_TIMEOUT = 5000; // 5 seconds

class NotifeeService {
  constructor() {
    this.initialized = false;
  }

  initialize = async () => {
    if (this.initialized) return;
    
    try {
      console.log('🚀 Initializing Notifee...');
      await notifee.requestPermission();
      await this.createChannels();
      this.setupListeners();
      this.initialized = true;
      console.log('✅ Notifee initialized');
    } catch (error) {
      console.log('❌ Init error:', error);
    }
  };

  createChannels = async () => {
    try {
      await notifee.createChannel({
        id: 'ticket_channel',
        name: 'Ticket Notifications',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
        lights: true,
        visibility: AndroidVisibility.PUBLIC,
        bypassDnd: true,
      });

      console.log('✅ Channel created');
    } catch (error) {
      console.log('❌ Channel error:', error);
    }
  };

  setupListeners = () => {
    notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) console.log('📱 Notification pressed');
    });
  };

  // Generate a unique key for any notification
  generateNotificationKey = (remoteMessage) => {
    const data = remoteMessage.data || {};
    
    // For ticket requests, use ticket ID as primary key
    if (data.ticket_request_id) {
      return `ticket_${data.ticket_request_id}`;
    }
    
    // For test notifications, use a combination of title and timestamp
    const title = remoteMessage.notification?.title || data.title || '';
    const timestamp = data.timestamp || Date.now();
    
    // Create a hash of the content
    const content = `${title}_${timestamp}`;
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash |= 0;
    }
    return `notif_${hash}`;
  };

  displayNotification = async (remoteMessage) => {
    try {
      const now = Date.now();
      const data = remoteMessage.data || {};
      
      // Generate unique key for this notification
      const notificationKey = this.generateNotificationKey(remoteMessage);
      
      // CLEANUP: Remove old entries
      for (const [key, timestamp] of processedNotifications.entries()) {
        if (now - timestamp > DEDUP_TIMEOUT) {
          processedNotifications.delete(key);
        }
      }
      
      // Check if this notification was recently shown
      if (processedNotifications.has(notificationKey)) {
        console.log(`⏭️ Duplicate prevented: ${notificationKey.substring(0, 12)}...`);
        return null;
      }
      
      // Store this notification
      processedNotifications.set(notificationKey, now);
      console.log(`✅ New notification: ${notificationKey.substring(0, 12)}...`);

      // Get title and body
      const title = remoteMessage.notification?.title || data.title || '📝 New Ticket Request';
      const body = remoteMessage.notification?.body || data.message || 'Someone requested tickets';

      console.log(`📨 Showing: ${title}`);

      // Cancel any existing notification with same tag before showing new one
      const ticketId = data.ticket_request_id;
      if (ticketId) {
        await notifee.cancelNotification(`ticket_${ticketId}`);
      }

      // Show notification
      await notifee.displayNotification({
        id: notificationKey, // Use our generated key as ID
        title: title,
        body: body,
        data: data,
        android: {
          channelId: 'ticket_channel',
          importance: AndroidImportance.HIGH,
          pressAction: { 
            id: 'default',
            launchActivity: 'default',
          },
          smallIcon: 'ic_launcher',
          fullScreenAction: {
            id: 'default',
            launchActivity: 'default',
          },
          asForegroundService: true,
          priority: 'high',
          category: AndroidCategory.SOCIAL,
          showTimestamp: true,
          timestamp: now,
          vibrationPattern: [300, 500],
          sound: 'default',
          autoCancel: true,
          ...(ticketId && { tag: `ticket_${ticketId}` }),
        },
        ios: {
          foregroundPresentationOptions: {
            banner: true,
            list: true,
            badge: true,
            sound: true,
            alert: true,
          },
        },
      });

      console.log('✅ Heads-up notification shown');
      return notificationKey;
    } catch (error) {
      console.log('❌ Error:', error);
    }
  };

  // Test function with built-in deduplication
  testHeadsUp = async () => {
    console.log('🔔 Testing heads-up...');
    await this.initialize();
    
    const timestamp = Date.now();
    
    await this.displayNotification({
      notification: {
        title: '🔔 HEADS-UP TEST',
        body: 'This should pop from the top!',
      },
      data: {
        type: 'test',
        timestamp: timestamp.toString(),
      },
    });
  };
}

export default new NotifeeService();
import notifee, { AndroidImportance, AndroidCategory, AndroidVisibility, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Simple deduplication
const processedTickets = new Set();
const TICKET_TIMEOUT = 5000;

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
      // Create channel with MAX importance for heads-up
      await notifee.createChannel({
        id: 'ticket_channel',
        name: 'Ticket Notifications',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
        lights: true,
        visibility: AndroidVisibility.PUBLIC,
        bypassDnd: true,
        description: 'Channel for ticket request notifications',
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

    notifee.onBackgroundEvent(async ({ type }) => {
      if (type === EventType.PRESS) console.log('📱 Background notification pressed');
    });
  };

  displayNotification = async (remoteMessage) => {
    try {
      const data = remoteMessage.data || {};
      const ticketId = data.ticket_request_id;
      
      // Deduplication
      if (ticketId) {
        if (processedTickets.has(ticketId)) {
          console.log(`⏭️ Duplicate ticket ${ticketId}`);
          return;
        }
        processedTickets.add(ticketId);
        setTimeout(() => processedTickets.delete(ticketId), TICKET_TIMEOUT);
      }

      // Get title and body (prioritize notification object for background)
      const title = remoteMessage.notification?.title || data.title || '📝 New Ticket Request';
      const body = remoteMessage.notification?.body || data.message || 'Someone requested tickets';

      console.log(`📨 Showing: ${title}`);

      // FORCE HEADS-UP for both foreground and background
      await notifee.displayNotification({
        id: ticketId ? `ticket_${ticketId}` : Date.now().toString(),
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
          
          // CRITICAL FOR BACKGROUND HEADS-UP
          fullScreenAction: {
            id: 'default',
            launchActivity: 'default',
          },
          asForegroundService: true,
          
          // Force high priority
          priority: 'high',
          category: AndroidCategory.SOCIAL,
          
          // Visual options
          showTimestamp: true,
          timestamp: Date.now(),
          vibrationPattern: [300, 500],
          sound: 'default',
          autoCancel: true,
          
          // Tag for replacement
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
          categoryIdentifier: 'ticket',
          sound: 'default',
        },
      });

      console.log('✅ Heads-up notification sent');
    } catch (error) {
      console.log('❌ Error:', error);
    }
  };

  // Test function
  testHeadsUp = async () => {
    console.log('🔔 Testing heads-up...');
    await this.initialize();
    
    await this.displayNotification({
      notification: {
        title: '🔔 HEADS-UP TEST',
        body: 'This should pop from the top!',
      },
      data: {
        type: 'test',
        timestamp: Date.now().toString(),
      },
    });
  };
}

export default new NotifeeService();
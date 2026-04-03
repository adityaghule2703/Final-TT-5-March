import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Image,
  Dimensions,
  Linking,
  Alert,
  PermissionsAndroid,
  Keyboard,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Pusher } from '@pusher/pusher-websocket-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HostLiveChat = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [currentHostId, setCurrentHostId] = useState(null);
  const [currentHostName, setCurrentHostName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [pendingMessages, setPendingMessages] = useState({});
  
  const scrollViewRef = useRef(null);
  const messageInputRef = useRef(null);
  const isMounted = useRef(true);
  const initialLoadDoneRef = useRef(false);
  const scrollOffsetRef = useRef(0);
  
  // Pusher refs
  const pusherRef = useRef(null);
  const chatChannelRef = useRef(null);
  const isPusherConnectedRef = useRef(false);
  const missedEventsQueueRef = useRef([]);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 10;

  // Helper function to get full image URL
  const getFullImageUrl = (attachment) => {
    if (!attachment) return null;
    
    if (attachment.url) {
      if (attachment.url.startsWith('http')) {
        return attachment.url;
      }
      return `https://tambolatime.co.in/public${attachment.url}`;
    }
    
    if (attachment.path) {
      if (attachment.path.startsWith('http')) {
        return attachment.path;
      }
      return `https://tambolatime.co.in/public${attachment.path}`;
    }
    
    return null;
  };

  // Track scroll position
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
   
    scrollOffsetRef.current = offsetY;
   
    const isNearBottom = contentHeight - offsetY - layoutHeight < 100;
    setShouldScrollToBottom(isNearBottom);
   
    setShowScrollToBottom(!isNearBottom && newMessageCount > 0);
  };

  // Get the latest message ID
  const getLatestMessageId = (messagesArray) => {
    if (!messagesArray || messagesArray.length === 0) return null;
    return messagesArray[messagesArray.length - 1]?.id || null;
  };

  // Fetch current host info
  const getCurrentHostInfo = async () => {
    try {
      const tokenData = await AsyncStorage.getItem("host");
      if (tokenData) {
        const host = JSON.parse(tokenData);
        setCurrentHostId(host.id);
        setCurrentHostName(host.name || "Host");
        return host;
      }
      return null;
    } catch (error) {
      console.log("Error getting host info:", error);
      return null;
    }
  };

  // Fetch chat messages
  const fetchMessages = async (isManualRefresh = false) => {
    if (!isMounted.current) return;

    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMounted.current) {
        const apiMessages = response.data.data || [];
        
        // Filter out system messages (joined/left notifications)
        const filteredMessages = apiMessages.filter(msg => msg.type !== 'system');
        
        const newMessages = filteredMessages.map(msg => {
          const messageType = msg.message_type || msg.type;
          const isVoice = messageType === 'media' && 
                         (msg.attachment?.mime_type?.includes('audio') || 
                          msg.message?.includes('Voice') ||
                          msg.message?.includes('🎤'));
          const isImage = messageType === 'image' || msg.message_type === 'image';
          const isVideo = messageType === 'media' && !isVoice;
          
          let mediaUrl = null;
          if ((isImage || isVideo) && msg.attachment) {
            mediaUrl = getFullImageUrl(msg.attachment);
          }
          
          return {
            id: msg.id.toString(),
            type: isVoice ? 'voice' : (isImage ? 'image' : (isVideo ? 'video' : (messageType || 'text'))),
            message: msg.message || '',
            timestamp: msg.timestamp,
            created_at: msg.created_at,
            sender_id: msg.sender?.id,
            sender_name: msg.sender?.name,
            sender_type: msg.sender?.type,
            is_muted: msg.is_muted,
            attachment: msg.attachment,
            attachment_url: mediaUrl,
            attachment_thumb: msg.attachment?.thumb ? getFullImageUrl({ url: msg.attachment.thumb }) : null
          };
        });

        setMessages(prevMessages => {
          const existingIds = new Set(prevMessages.map(m => m.id));
          const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
          
          if (uniqueNewMessages.length === 0 && prevMessages.length === newMessages.length) {
            return prevMessages;
          }
          
          const mergedMessages = [...prevMessages, ...uniqueNewMessages];
          mergedMessages.sort((a, b) => {
            const timeA = new Date(a.created_at || a.timestamp);
            const timeB = new Date(b.created_at || b.timestamp);
            return timeA - timeB;
          });
          
          if ((shouldScrollToBottom || isManualRefresh) && uniqueNewMessages.length > 0) {
            setTimeout(() => {
              if (isMounted.current && scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }, 100);
          }
          
          return mergedMessages;
        });
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  // Fetch muted users
  const fetchMutedUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/chat/muted-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setMutedUsers(response.data.data.muted_users || []);
      }
    } catch (error) {
      console.log("Error fetching muted users:", error);
    }
  };

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchMessages(true);
      await fetchMutedUsers();
      setNewMessageCount(0);
      setShowScrollToBottom(false);
    } catch (error) {
      console.log("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch with loading state
  const initialFetch = async () => {
    try {
      await fetchMessages();
      await fetchMutedUsers();
      
      if (!initialLoadDoneRef.current) {
        initialLoadDoneRef.current = true;
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false });
          }
        }, 100);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error in initial fetch:", error);
      setLoading(false);
    }
  };

  // Send text message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage = {
      id: tempId,
      type: "text",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      sender_id: currentHostId,
      sender_name: currentHostName,
      sender_type: "host",
      is_muted: false,
      isPending: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setPendingMessages(prev => ({ ...prev, [tempId]: true }));
    setNewMessage("");
    setShouldScrollToBottom(true);
    
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 50);
    
    setSending(true);
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/send`,
        {
          message: newMessage.trim(),
          type: "text",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const serverMessage = response.data.data;
        const isImage = serverMessage.message_type === 'image';
        const isVideo = serverMessage.message_type === 'media';
        const mediaUrl = (isImage || isVideo) && serverMessage.attachment ? getFullImageUrl(serverMessage.attachment) : null;
        
        const newMsg = {
          id: serverMessage.id ? serverMessage.id.toString() : `${Date.now()}-${Math.random()}`,
          type: serverMessage.message_type || "text",
          message: serverMessage.message || '',
          timestamp: serverMessage.timestamp,
          created_at: serverMessage.created_at,
          sender_id: serverMessage.sender?.id || currentHostId,
          sender_name: serverMessage.sender?.name || currentHostName,
          sender_type: serverMessage.sender?.type || "host",
          is_muted: serverMessage.is_muted || false,
          attachment: serverMessage.attachment,
          attachment_url: mediaUrl,
          attachment_thumb: serverMessage.attachment?.thumb ? getFullImageUrl({ url: serverMessage.attachment.thumb }) : null
        };
        
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== tempId);
          return [...filtered, newMsg].sort((a, b) => {
            const timeA = new Date(a.created_at || a.timestamp);
            const timeB = new Date(b.created_at || b.timestamp);
            return timeA - timeB;
          });
        });
        
        setPendingMessages(prev => {
          const newPending = { ...prev };
          delete newPending[tempId];
          return newPending;
        });
        
        setNewMessageCount(0);
        setShowScrollToBottom(false);
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        setPendingMessages(prev => {
          const newPending = { ...prev };
          delete newPending[tempId];
          return newPending;
        });
        Alert.alert("Error", "Failed to send message");
      }
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setPendingMessages(prev => {
        const newPending = { ...prev };
        delete newPending[tempId];
        return newPending;
      });
      Alert.alert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Request permissions for images
  const requestMediaPermissions = async (mediaType) => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        let permissions = [];
        
        if (mediaType === "camera") {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        
        if (androidVersion >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        } else {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        
        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = permissions.every(
          permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (!allGranted) {
          const rationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
            permissions[0]
          );
          
          if (!rationale) {
            Alert.alert(
              "Permission Required",
              "Please grant camera and storage permissions to use this feature.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => {
                    if (Platform.OS === 'android') {
                      Linking.openSettings();
                    }
                  }
                }
              ]
            );
          }
          return false;
        }
        
        return true;
      } catch (error) {
        console.warn("Permission request error:", error);
        return true;
      }
    }
    return true;
  };

  // Send image
  const sendImage = async (uri, filename) => {
    const tempId = `temp-image-${Date.now()}-${Math.random()}`;
    const tempMessage = {
      id: tempId,
      type: 'image',
      message: '📷 Image',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      sender_id: currentHostId,
      sender_name: currentHostName,
      sender_type: "host",
      is_muted: false,
      isPending: true,
      attachment_url: uri,
      attachment: { url: uri }
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setPendingMessages(prev => ({ ...prev, [tempId]: true }));
    setShouldScrollToBottom(true);
    
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 50);
    
    setUploading(true);
    setShowAttachmentOptions(false);
    
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const formData = new FormData();
      formData.append('type', 'image');
      
      let type = 'image/jpeg';
      if (filename) {
        const match = /\.(\w+)$/.exec(filename);
        if (match) {
          const ext = match[1].toLowerCase();
          type = `image/${ext}`;
        }
      }
      
      formData.append('attachment', {
        uri: uri,
        type: type,
        name: filename || `image_${Date.now()}.jpg`,
      });

      const response = await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        const serverMessage = response.data.data;
        const mediaUrl = serverMessage.attachment ? getFullImageUrl(serverMessage.attachment) : null;
        
        const newMsg = {
          id: serverMessage.id ? serverMessage.id.toString() : `${Date.now()}-${Math.random()}`,
          type: serverMessage.message_type || 'image',
          message: serverMessage.message || '📷 Image',
          timestamp: serverMessage.timestamp,
          created_at: serverMessage.created_at,
          sender_id: serverMessage.sender?.id || currentHostId,
          sender_name: serverMessage.sender?.name || currentHostName,
          sender_type: serverMessage.sender?.type || "host",
          is_muted: serverMessage.is_muted || false,
          attachment: serverMessage.attachment,
          attachment_url: mediaUrl,
          attachment_thumb: serverMessage.attachment?.thumb ? getFullImageUrl({ url: serverMessage.attachment.thumb }) : null
        };
        
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== tempId);
          return [...filtered, newMsg].sort((a, b) => {
            const timeA = new Date(a.created_at || a.timestamp);
            const timeB = new Date(b.created_at || b.timestamp);
            return timeA - timeB;
          });
        });
        
        setPendingMessages(prev => {
          const newPending = { ...prev };
          delete newPending[tempId];
          return newPending;
        });
        
        setNewMessageCount(0);
        setShowScrollToBottom(false);
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        setPendingMessages(prev => {
          const newPending = { ...prev };
          delete newPending[tempId];
          return newPending;
        });
        Alert.alert("Error", "Failed to send image");
      }
    } catch (error) {
      console.log("Error sending image:", error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setPendingMessages(prev => {
        const newPending = { ...prev };
        delete newPending[tempId];
        return newPending;
      });
      Alert.alert("Error", error.response?.data?.message || "Failed to send image");
    } finally {
      setUploading(false);
    }
  };

  // Handle media picker (only images)
  const handleMediaPick = async (source) => {
    const hasPermission = await requestMediaPermissions(source);
    if (!hasPermission) {
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
      saveToPhotos: false,
      selectionLimit: 1,
    };

    try {
      let result;
      
      if (source === "camera") {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const uri = selectedImage.uri;
        const filename = selectedImage.fileName || selectedImage.uri.split('/').pop();
        
        if (uri) {
          await sendImage(uri, filename);
        }
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Handle attachment press
  const handleAttachmentPress = () => {
    setShowAttachmentOptions(true);
  };

  // Mute user
  const muteUser = async (userId, userName) => {
    try {
      Alert.alert(
        "Mute User",
        `Are you sure you want to mute ${userName} for 30 minutes?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Mute",
            onPress: async () => {
              try {
                const token = await AsyncStorage.getItem("hostToken");
                const response = await axios.post(
                  `https://tambolatime.co.in/public/api/host/games/${gameId}/chat/mute-user`,
                  {
                    user_id: userId,
                    user_type: "user",
                    duration_minutes: 30,
                    reason: "Violating chat rules",
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                    },
                  }
                );

                if (response.data.success) {
                  await fetchMutedUsers();
                  Alert.alert("Success", `${userName} has been muted`);
                }
              } catch (error) {
                console.log("Error muting user:", error);
                Alert.alert("Error", "Failed to mute user");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.log("Error in mute user:", error);
    }
  };

  // Unmute user
  const unmuteUser = async (userId, userName) => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/chat/unmute-user`,
        {
          user_id: userId,
          user_type: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        await fetchMutedUsers();
        Alert.alert("Success", `${userName} has been unmuted`);
      }
    } catch (error) {
      console.log("Error unmuting user:", error);
      Alert.alert("Error", "Failed to unmute user");
    }
  };

  // Clear chat
  const clearChat = async () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all chat messages? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("hostToken");
              const response = await axios.delete(
                `https://tambolatime.co.in/public/api/host/games/${gameId}/chat/clear`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success) {
                setMessages([]);
                Alert.alert("Success", "Chat has been cleared");
              }
            } catch (error) {
              console.log("Error clearing chat:", error);
              Alert.alert("Error", "Failed to clear chat");
            }
          },
        },
      ]
    );
  };

  // Leave chat
  const leaveChat = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      navigation.goBack();
    } catch (error) {
      console.log("Error leaving chat:", error);
      navigation.goBack();
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    setShouldScrollToBottom(true);
    setNewMessageCount(0);
    setShowScrollToBottom(false);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Handle new message from Pusher
  const handleNewMessage = (data) => {
    console.log(`[Chat ${gameId}] 📨 New message received:`, data);
    
    const messageType = data.message_type || data.type;
    const isVoice = messageType === 'media' && 
                   (data.attachment?.mime_type?.includes('audio') || 
                    data.message?.includes('Voice') ||
                    data.message?.includes('🎤'));
    const isImage = messageType === 'image';
    const isVideo = messageType === 'media' && !isVoice;
    const mediaUrl = (isImage || isVideo) && data.attachment ? getFullImageUrl(data.attachment) : null;
    
    const newMessage = {
      id: data.id ? data.id.toString() : `${Date.now()}-${Math.random()}`,
      type: isVoice ? 'voice' : (isImage ? 'image' : (isVideo ? 'video' : (messageType || 'text'))),
      message: data.message || '',
      timestamp: data.timestamp,
      created_at: data.created_at,
      sender_id: data.sender?.id,
      sender_name: data.sender?.name,
      sender_type: data.sender?.type,
      is_muted: data.is_muted || false,
      attachment: data.attachment,
      attachment_url: mediaUrl,
      attachment_thumb: data.attachment?.thumb ? getFullImageUrl({ url: data.attachment.thumb }) : null
    };
    
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) {
        console.log(`[Chat ${gameId}] Message ${newMessage.id} already exists, skipping`);
        return prev;
      }
      
      console.log(`[Chat ${gameId}] Adding new ${newMessage.type} message from ${newMessage.sender_name}`);
      const newMessages = [...prev, newMessage];
      
      newMessages.sort((a, b) => {
        const timeA = new Date(a.created_at || a.timestamp);
        const timeB = new Date(b.created_at || b.timestamp);
        return timeA - timeB;
      });
      
      if (!shouldScrollToBottom) {
        setNewMessageCount(prevCount => prevCount + 1);
        setShowScrollToBottom(true);
      }
      
      if (shouldScrollToBottom) {
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      }
      
      return newMessages;
    });
  };

  // Handle user joined - REMOVED - don't show these messages
  const handleUserJoined = (data) => {
    console.log(`[Chat ${gameId}] 👋 User joined:`, data);
    // Don't add system message - just log it
  };

  // Handle user left - REMOVED - don't show these messages
  const handleUserLeft = (data) => {
    console.log(`[Chat ${gameId}] 👋 User left:`, data);
    // Don't add system message - just log it
  };

  // Handle user muted
  const handleUserMuted = (data) => {
    console.log(`[Chat ${gameId}] 🔇 User muted:`, data);
    fetchMutedUsers();
  };

  // Handle chat cleared
  const handleChatCleared = (data) => {
    console.log(`[Chat ${gameId}] 🧹 Chat cleared:`, data);
    setMessages([]);
    Alert.alert("Chat Cleared", "Chat has been cleared by the host");
  };

  // Initialize Pusher
  const initializePusher = async () => {
    try {
      console.log(`[Chat ${gameId}] 📱 Initializing Pusher for chat`);
      const pusher = Pusher.getInstance();
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`[Chat ${gameId}] 🔌 Connection state: ${previousState} → ${currentState}`);
          if (currentState === 'CONNECTED') {
            console.log(`[Chat ${gameId}] ✅ Connected to Pusher`);
            isPusherConnectedRef.current = true;
            reconnectAttemptsRef.current = 0;
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            processMissedEventsQueue();
          }
          if (currentState === 'DISCONNECTED' && isMounted.current) {
            console.log(`[Chat ${gameId}] ❌ Disconnected, scheduling reconnection...`);
            isPusherConnectedRef.current = false;
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`[Chat ${gameId}] ❌ Pusher error: ${message}`, error);
          isPusherConnectedRef.current = false;
          scheduleReconnection();
        },
      });
      await pusher.connect();
      console.log(`[Chat ${gameId}] 🚀 Pusher connected`);
      
      const channelName = `game.${gameId}.chat`;
      console.log(`[Chat ${gameId}] 📡 Subscribing to channel: ${channelName}`);
      
      const chatChannel = await pusher.subscribe({
        channelName: channelName,
        onEvent: (event) => {
          console.log(`[Chat ${gameId}] 📨 Received event: ${event.eventName}`);
          if (isMounted.current) handlePusherEvent(event);
        }
      });
      
      chatChannelRef.current = chatChannel;
      pusherRef.current = pusher;
      isPusherConnectedRef.current = true;
      console.log(`[Chat ${gameId}] ✅ Pusher initialized successfully`);
    } catch (error) {
      console.log(`[Chat ${gameId}] ❌ Error initializing Pusher:`, error);
      isPusherConnectedRef.current = false;
      scheduleReconnection();
      throw error;
    }
  };

  // Process missed events
  const processMissedEventsQueue = async () => {
    if (missedEventsQueueRef.current.length === 0) return;
    console.log(`[Chat ${gameId}] 📦 Processing ${missedEventsQueueRef.current.length} missed events`);
    const events = [...missedEventsQueueRef.current];
    missedEventsQueueRef.current = [];
    for (const event of events) {
      if (!isMounted.current) break;
      try {
        handlePusherEvent(event);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`[Chat ${gameId}] ❌ Error processing missed event:`, error);
      }
    }
  };

  // Schedule reconnection
  const scheduleReconnection = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(`[Chat ${gameId}] ⚠️ Max reconnection attempts reached`);
      Alert.alert("Connection Issue", "Having trouble connecting to chat. Please pull down to refresh.");
      return;
    }
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(`[Chat ${gameId}] 🔄 Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    reconnectTimeoutRef.current = setTimeout(() => reconnectPusher(), delay);
  };

  // Reconnect Pusher
  const reconnectPusher = async () => {
    try {
      console.log(`[Chat ${gameId}] 🔄 Attempting to reconnect Pusher...`);
      reconnectAttemptsRef.current += 1;
      await cleanupPusher();
      await initializePusher();
      reconnectAttemptsRef.current = 0;
      console.log(`[Chat ${gameId}] ✅ Reconnected successfully`);
    } catch (error) {
      console.log(`[Chat ${gameId}] ❌ Reconnection failed:`, error);
      scheduleReconnection();
    }
  };

  // Cleanup Pusher
  const cleanupPusher = async () => {
    if (pusherRef.current) {
      try {
        const pusher = Pusher.getInstance();
        if (chatChannelRef.current) {
          await pusher.unsubscribe({ channelName: `game.${gameId}.chat` });
          chatChannelRef.current = null;
          console.log(`[Chat ${gameId}] 📤 Unsubscribed from chat channel`);
        }
        await pusher.disconnect();
        console.log(`[Chat ${gameId}] 🔌 Pusher disconnected`);
      } catch (error) {
        console.log(`[Chat ${gameId}] ❌ Error cleaning up Pusher:`, error);
      }
    }
  };

  // Handle Pusher events
  const handlePusherEvent = (event) => {
    console.log(`[Chat ${gameId}] 🔄 Processing event: ${event.eventName}`);
    try {
      let data;
      if (typeof event.data === 'string') {
        data = JSON.parse(event.data);
      } else {
        data = event.data;
      }
      
      console.log(`[Chat ${gameId}] Event data:`, JSON.stringify(data).substring(0, 200));
      
      if (!isPusherConnectedRef.current) {
        console.log(`[Chat ${gameId}] Pusher disconnected, queueing event: ${event.eventName}`);
        missedEventsQueueRef.current.push(event);
        return;
      }
      
      switch (event.eventName) {
        case 'new.message':
          handleNewMessage(data);
          break;
        case 'user.joined':
          handleUserJoined(data);
          break;
        case 'user.left':
          handleUserLeft(data);
          break;
        case 'user.muted':
          handleUserMuted(data);
          break;
        case 'chat.cleared':
          handleChatCleared(data);
          break;
        default:
          console.log(`[Chat ${gameId}] 📭 Unhandled event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Chat ${gameId}] ❌ Error handling Pusher event:`, error);
    }
  };

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const refreshOnFocus = navigation.addListener('focus', () => {
      fetchMessages();
      fetchMutedUsers();
    });

    return refreshOnFocus;
  }, [navigation]);

  useEffect(() => {
    isMounted.current = true;
   
    const initializeChat = async () => {
      await getCurrentHostInfo();
      
      try {
        const token = await AsyncStorage.getItem("hostToken");
        
        console.log(`[Chat ${gameId}] Joining chat...`);
        await axios.post(
          `https://tambolatime.co.in/public/api/games/${gameId}/chat/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        
        await initialFetch();
        await initializePusher();
        
        console.log(`[Chat ${gameId}] Chat initialized successfully`);
      } catch (error) {
        console.log("Error joining chat:", error);
        Alert.alert("Error", "Failed to join chat");
        navigation.goBack();
      }
    };
   
    initializeChat();

    return () => {
      console.log(`[Chat ${gameId}] Cleaning up...`);
      isMounted.current = false;
      cleanupPusher();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleManualRefresh}
      colors={["#25D366"]}
      tintColor="#25D366"
    />
  );

  // Attachment Options Modal (only image options)
  const AttachmentOptionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAttachmentOptions}
      onRequestClose={() => setShowAttachmentOptions(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowAttachmentOptions(false)}
      >
        <View style={styles.attachmentModalContainer}>
          <View style={styles.attachmentModalHeader}>
            <Text style={styles.attachmentModalTitle}>Send Image</Text>
            <TouchableOpacity onPress={() => setShowAttachmentOptions(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.attachmentOptions}>
            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={() => {
                setShowAttachmentOptions(false);
                handleMediaPick("camera");
              }}
            >
              <View style={[styles.attachmentIcon, { backgroundColor: "#FF9800" }]}>
                <Ionicons name="camera" size={28} color="#FFF" />
              </View>
              <Text style={styles.attachmentOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentOption}
              onPress={() => {
                setShowAttachmentOptions(false);
                handleMediaPick("gallery");
              }}
            >
              <View style={[styles.attachmentIcon, { backgroundColor: "#4CAF50" }]}>
                <Ionicons name="images" size={28} color="#FFF" />
              </View>
              <Text style={styles.attachmentOptionText}>Choose Image</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.cancelAttachmentButton}
            onPress={() => setShowAttachmentOptions(false)}
          >
            <Text style={styles.cancelAttachmentText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderMessage = (message, uniqueKey) => {
    const isHost = message.sender_type === "host";
    const isOwnMessage = isHost && message.sender_id === currentHostId;
    const isMuted = message.is_muted;
    const isVoice = message.type === 'voice';
    const isImage = message.type === 'image';
    const isVideo = message.type === 'video';
    
    let mediaUrl = null;
    if (isImage || isVideo) {
      if (message.attachment_url) {
        mediaUrl = message.attachment_url;
      } 
      else if (message.attachment) {
        if (message.attachment.url) {
          if (message.attachment.url.startsWith('http')) {
            mediaUrl = message.attachment.url;
          } else {
            mediaUrl = `https://tambolatime.co.in/public${message.attachment.url}`;
          }
        } else if (message.attachment.path) {
          if (message.attachment.path.startsWith('http')) {
            mediaUrl = message.attachment.path;
          } else {
            mediaUrl = `https://tambolatime.co.in/public${message.attachment.path}`;
          }
        }
      }
    }

    const isPending = message.isPending === true;

    if (isVoice) {
      if (isOwnMessage) {
        return (
          <View key={uniqueKey} style={styles.ownMessageContainer}>
            <View style={[styles.ownMessageBubble, isPending && styles.pendingMessage]}>
              <View style={styles.voiceContainer}>
                <View style={styles.voiceContent}>
                  <Ionicons name="mic" size={20} color="#075E54" />
                  <View style={styles.voiceInfo}>
                    <Text style={styles.voiceText}>Voice message</Text>
                    <Text style={styles.voiceDuration}>
                      {message.attachment?.duration || '00:30'}
                    </Text>
                  </View>
                  <Ionicons name="play-circle" size={24} color="#25D366" />
                </View>
              </View>
              <View style={styles.ownMessageFooter}>
                <Text style={styles.ownTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isPending ? (
                  <ActivityIndicator size="small" color="#999" style={styles.pendingIcon} />
                ) : (
                  <Ionicons
                    name="checkmark-done"
                    size={12}
                    color={isMuted ? "#666" : "#34B7F1"}
                    style={styles.messageStatusIcon}
                  />
                )}
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View key={uniqueKey} style={styles.otherMessageContainer}>
            <View style={styles.otherMessageBubble}>
              <Text style={styles.senderName}>
                {message.sender_name || "User"}
                {isHost && " (Host)"}
                {isMuted && " 🔇"}
              </Text>
              <View style={styles.voiceContainer}>
                <View style={styles.voiceContent}>
                  <Ionicons name="mic" size={20} color="#075E54" />
                  <View style={styles.voiceInfo}>
                    <Text style={styles.voiceText}>Voice message</Text>
                    <Text style={styles.voiceDuration}>
                      {message.attachment?.duration || '00:30'}
                    </Text>
                  </View>
                  <Ionicons name="play-circle" size={24} color="#25D366" />
                </View>
              </View>
              <View style={styles.otherMessageFooter}>
                <Text style={styles.otherTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {!isHost && (
                  <TouchableOpacity
                    style={styles.muteButtonSmall}
                    onPress={() => {
                      if (isMuted) {
                        unmuteUser(message.sender_id, message.sender_name);
                      } else {
                        muteUser(message.sender_id, message.sender_name);
                      }
                    }}
                  >
                    <Ionicons
                      name={isMuted ? "mic" : "mic-off"}
                      size={12}
                      color={isMuted ? "#4CAF50" : "#FF5252"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      }
    }

    if (isImage) {
      if (isOwnMessage) {
        return (
          <View key={uniqueKey} style={styles.ownMessageContainer}>
            <View style={[styles.ownMessageBubble, isPending && styles.pendingMessage]}>
              <View style={styles.mediaContainer}>
                {mediaUrl ? (
                  <Image
                    source={{ uri: mediaUrl }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                    onError={(e) => console.log(`[Chat ${gameId}] Image load error:`, e.nativeEvent.error, mediaUrl)}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#999" />
                    <Text style={styles.uploadingText}>No image URL</Text>
                  </View>
                )}
                {isPending && !mediaUrl?.startsWith('http') && (
                  <View style={styles.imagePlaceholderOverlay}>
                    <ActivityIndicator size="small" color="#25D366" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
                {message.message && message.message.trim() && !message.message.includes('📷') && (
                  <Text style={styles.mediaCaption}>{message.message}</Text>
                )}
              </View>
              <View style={styles.ownMessageFooter}>
                <Text style={styles.ownTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isPending ? (
                  <ActivityIndicator size="small" color="#999" style={styles.pendingIcon} />
                ) : (
                  <Ionicons
                    name="checkmark-done"
                    size={12}
                    color={isMuted ? "#666" : "#34B7F1"}
                    style={styles.messageStatusIcon}
                  />
                )}
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View key={uniqueKey} style={styles.otherMessageContainer}>
            <View style={styles.otherMessageBubble}>
              <Text style={styles.senderName}>
                {message.sender_name || "User"}
                {isHost && " (Host)"}
                {isMuted && " 🔇"}
              </Text>
              
              <View style={styles.mediaContainer}>
                {mediaUrl ? (
                  <Image
                    source={{ uri: mediaUrl }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                    onError={(e) => console.log(`[Chat ${gameId}] Image load error from other:`, e.nativeEvent.error, mediaUrl)}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color="#999" />
                    <Text style={styles.uploadingText}>Image not available</Text>
                  </View>
                )}
                {message.message && message.message.trim() && !message.message.includes('📷') && (
                  <Text style={styles.mediaCaption}>{message.message}</Text>
                )}
              </View>
              
              <View style={styles.otherMessageFooter}>
                <Text style={styles.otherTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {!isHost && (
                  <TouchableOpacity
                    style={styles.muteButtonSmall}
                    onPress={() => {
                      if (isMuted) {
                        unmuteUser(message.sender_id, message.sender_name);
                      } else {
                        muteUser(message.sender_id, message.sender_name);
                      }
                    }}
                  >
                    <Ionicons
                      name={isMuted ? "mic" : "mic-off"}
                      size={12}
                      color={isMuted ? "#4CAF50" : "#FF5252"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      }
    }

    if (isVideo) {
      if (isOwnMessage) {
        return (
          <View key={uniqueKey} style={styles.ownMessageContainer}>
            <View style={[styles.ownMessageBubble, isPending && styles.pendingMessage]}>
              <View style={styles.mediaContainer}>
                {mediaUrl ? (
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="play-circle" size={48} color="#FFF" />
                    {message.message && message.message.trim() && !message.message.includes('🎥') && (
                      <Text style={styles.mediaCaption}>{message.message}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="videocam-outline" size={40} color="#999" />
                    <Text style={styles.uploadingText}>No video URL</Text>
                  </View>
                )}
                {isPending && !mediaUrl?.startsWith('http') && (
                  <View style={styles.imagePlaceholderOverlay}>
                    <ActivityIndicator size="small" color="#25D366" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
              </View>
              <View style={styles.ownMessageFooter}>
                <Text style={styles.ownTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isPending ? (
                  <ActivityIndicator size="small" color="#999" style={styles.pendingIcon} />
                ) : (
                  <Ionicons
                    name="checkmark-done"
                    size={12}
                    color={isMuted ? "#666" : "#34B7F1"}
                    style={styles.messageStatusIcon}
                  />
                )}
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View key={uniqueKey} style={styles.otherMessageContainer}>
            <View style={styles.otherMessageBubble}>
              <Text style={styles.senderName}>
                {message.sender_name || "User"}
                {isHost && " (Host)"}
                {isMuted && " 🔇"}
              </Text>
              
              <View style={styles.mediaContainer}>
                {mediaUrl ? (
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="play-circle" size={48} color="#FFF" />
                    {message.message && message.message.trim() && !message.message.includes('🎥') && (
                      <Text style={styles.mediaCaption}>{message.message}</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="videocam-outline" size={40} color="#999" />
                    <Text style={styles.uploadingText}>Video not available</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.otherMessageFooter}>
                <Text style={styles.otherTimestamp}>
                  {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {!isHost && (
                  <TouchableOpacity
                    style={styles.muteButtonSmall}
                    onPress={() => {
                      if (isMuted) {
                        unmuteUser(message.sender_id, message.sender_name);
                      } else {
                        muteUser(message.sender_id, message.sender_name);
                      }
                    }}
                  >
                    <Ionicons
                      name={isMuted ? "mic" : "mic-off"}
                      size={12}
                      color={isMuted ? "#4CAF50" : "#FF5252"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      }
    }

    // Text message
    if (isOwnMessage) {
      return (
        <View key={uniqueKey} style={styles.ownMessageContainer}>
          <View style={[styles.ownMessageBubble, isPending && styles.pendingMessage]}>
            <Text style={[
              styles.ownMessageText,
              isMuted && styles.mutedMessageText
            ]}>
              {isMuted ? "[This message was sent while muted]" : message.message}
            </Text>
            <View style={styles.ownMessageFooter}>
              <Text style={styles.ownTimestamp}>
                {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {isPending ? (
                <ActivityIndicator size="small" color="#999" style={styles.pendingIcon} />
              ) : (
                <Ionicons
                  name="checkmark-done"
                  size={12}
                  color={isMuted ? "#666" : "#34B7F1"}
                  style={styles.messageStatusIcon}
                />
              )}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View key={uniqueKey} style={styles.otherMessageContainer}>
          <View style={styles.otherMessageBubble}>
            <Text style={styles.senderName}>
              {message.sender_name || "User"}
              {isHost && " (Host)"}
              {isMuted && " 🔇"}
            </Text>
            <Text style={[
              styles.otherMessageText,
              isMuted && styles.mutedMessageText
            ]}>
              {isMuted ? "[This user is muted]" : message.message}
            </Text>
            <View style={styles.otherMessageFooter}>
              <Text style={styles.otherTimestamp}>
                {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {!isHost && (
                <TouchableOpacity
                  style={styles.muteButtonSmall}
                  onPress={() => {
                    if (isMuted) {
                      unmuteUser(message.sender_id, message.sender_name);
                    } else {
                      muteUser(message.sender_id, message.sender_name);
                    }
                  }}
                >
                  <Ionicons
                    name={isMuted ? "mic" : "mic-off"}
                    size={12}
                    color={isMuted ? "#4CAF50" : "#FF5252"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading Chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
     
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
       
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {gameName}
          </Text>
          <Text style={styles.headerSubtitle}>Host Chat</Text>
        </View>
       
        <TouchableOpacity
          style={styles.headerButton}
          onPress={clearChat}
        >
          <Ionicons name="trash-outline" size={22} color="#FFF" />
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.headerButton}
          onPress={leaveChat}
        >
          <Ionicons name="exit-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
      >
        {/* Welcome message */}
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeBubble}>
            <Ionicons name="chatbubbles" size={24} color="#075E54" />
            <Text style={styles.welcomeTitle}>Welcome to Host Chat!</Text>
            <Text style={styles.welcomeText}>
              You're hosting the chat for {gameName}. Use your host privileges to manage the conversation.
            </Text>
            <View style={styles.welcomeTips}>
              <View style={styles.tipItem}>
                <Ionicons name="mic-off" size={14} color="#FF5252" />
                <Text style={styles.tipText}>Mute disruptive users</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="trash" size={14} color="#2196F3" />
                <Text style={styles.tipText}>Clear chat if needed</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="image" size={14} color="#4CAF50" />
                <Text style={styles.tipText}>Send images</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        {messages.length === 0 ? (
          <View style={styles.emptyMessages}>
            <Ionicons name="chatbubble-outline" size={60} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Start the conversation! 👋
            </Text>
          </View>
        ) : (
          messages.map((message, index) => renderMessage(message, `${message.id}-${index}`))
        )}
       
        <View style={{ height: 10 }} />
      </ScrollView>

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <TouchableOpacity
          style={styles.scrollToBottomButton}
          onPress={scrollToBottom}
        >
          <View style={styles.scrollToBottomContent}>
            <Ionicons name="arrow-down" size={18} color="#FFF" />
            <Text style={styles.scrollToBottomText}>
              {newMessageCount} new message{newMessageCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Message Input - Fixed at bottom */}
      <View style={[
        styles.inputContainer,
        keyboardHeight > 0 && { marginBottom: keyboardHeight }
      ]}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleAttachmentPress}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="add-circle" size={28} color="#075E54" />
            )}
          </TouchableOpacity>
         
          <TextInput
            ref={messageInputRef}
            style={styles.textInput}
            placeholder="Type a message as host..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
         
          {newMessage.trim() ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderButton} />
          )}
        </View>
      </View>

      {/* Modals */}
      <AttachmentOptionsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECE5DD",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#075E54",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeBubble: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#075E54",
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  welcomeTips: {
    width: "100%",
    gap: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  emptyMessages: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  ownMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  ownMessageBubble: {
    backgroundColor: "#DCF8C6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderTopRightRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  pendingMessage: {
    opacity: 0.7,
  },
  ownMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#000",
  },
  mutedMessageText: {
    color: "#999",
    fontStyle: 'italic',
  },
  ownMessageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  ownTimestamp: {
    fontSize: 11,
    color: "rgba(0,0,0,0.6)",
    marginRight: 4,
  },
  messageStatusIcon: {
    marginLeft: 2,
  },
  pendingIcon: {
    marginLeft: 4,
  },
  otherMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  otherMessageBubble: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#075E54",
    marginBottom: 2,
  },
  otherMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  otherMessageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  otherTimestamp: {
    fontSize: 11,
    color: "rgba(0,0,0,0.6)",
    marginRight: 6,
  },
  muteButtonSmall: {
    padding: 4,
  },
  voiceContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    marginVertical: 4,
  },
  voiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  voiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  voiceDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mediaContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 4,
    position: 'relative',
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  mediaCaption: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  videoThumbnail: {
    width: 200,
    height: 200,
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: "#F0F0F0",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: "#333",
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#25D366',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  scrollToBottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollToBottomText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  attachmentModalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  attachmentModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  attachmentModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#075E54",
  },
  attachmentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  attachmentOption: {
    alignItems: "center",
    width: "45%",
    marginBottom: 20,
  },
  attachmentIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  attachmentOptionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cancelAttachmentButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginTop: 8,
  },
  cancelAttachmentText: {
    fontSize: 16,
    color: "#FF5252",
    fontWeight: "600",
  },
});

export default HostLiveChat;
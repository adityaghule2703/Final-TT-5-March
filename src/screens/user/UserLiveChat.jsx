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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const UserLiveChat = ({ navigation, route }) => {
  const { gameId, gameName, participantCount } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [muteDetails, setMuteDetails] = useState(null);
  
  const scrollViewRef = useRef(null);
  const messageInputRef = useRef(null);
  const isMounted = useRef(true);
  const initialLoadDoneRef = useRef(false);
  const scrollOffsetRef = useRef(0);
  const lastMessageIdRef = useRef(null);

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

  // Fetch current user info
  const getCurrentUserInfo = async () => {
    try {
      const tokenData = await AsyncStorage.getItem("user");
      if (tokenData) {
        const user = JSON.parse(tokenData);
        setCurrentUserId(user.id);
        setCurrentUserName(user.name || "User");
        return user;
      }
      return null;
    } catch (error) {
      console.log("Error getting user info:", error);
      return null;
    }
  };

  // Fetch chat messages
  const fetchMessages = async (isManualRefresh = false) => {
    if (!isMounted.current) return;

    try {
      const token = await AsyncStorage.getItem("token");
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
        
        const newMessages = apiMessages.map(msg => {
          if (msg.type === 'system') {
            return {
              id: msg.id.toString(),
              type: "system",
              message: msg.message,
              timestamp: msg.timestamp,
              created_at: msg.created_at,
              metadata: msg.metadata,
              is_muted: msg.is_muted
            };
          }
          
          if (msg.type === 'chat') {
            const messageType = msg.message_type;
            const isVoice = messageType === 'media' && 
                           (msg.attachment?.mime_type?.includes('audio') || 
                            msg.message?.includes('Voice') ||
                            msg.message?.includes('🎤'));
            
            return {
              id: msg.id.toString(),
              type: isVoice ? 'voice' : messageType,
              message: msg.message,
              timestamp: msg.timestamp,
              created_at: msg.created_at,
              sender_id: msg.sender?.id,
              sender_name: msg.sender?.name,
              sender_type: msg.sender?.type,
              is_muted: msg.is_muted,
              attachment: msg.attachment
            };
          }
          
          return {
            id: msg.id.toString(),
            type: "text",
            message: msg.message,
            timestamp: msg.timestamp,
            created_at: msg.created_at,
            sender_id: msg.sender?.id,
            sender_name: msg.sender?.name,
            sender_type: msg.sender?.type,
            is_muted: msg.is_muted,
            attachment: msg.attachment
          };
        });

        const currentLatestId = getLatestMessageId(messages);
        const newLatestId = getLatestMessageId(newMessages);
       
        setMessages(prevMessages => {
          const prevString = JSON.stringify(prevMessages);
          const newString = JSON.stringify(newMessages);
         
          if (prevString !== newString) {
            if (!shouldScrollToBottom && currentLatestId !== newLatestId) {
              const prevCount = prevMessages.length;
              const newCount = newMessages.length;
              const addedMessages = newCount - prevCount;
             
              if (addedMessages > 0 && !isManualRefresh) {
                setNewMessageCount(prev => prev + addedMessages);
                setShowScrollToBottom(true);
              }
            }
           
            if ((shouldScrollToBottom || isManualRefresh) && newMessages.length > prevMessages.length) {
              setTimeout(() => {
                if (isMounted.current && scrollViewRef.current) {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }
              }, 100);
            }
           
            return newMessages;
          }
         
          return prevMessages;
        });
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  // Fetch mute status
  const fetchMuteStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/mute-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const { is_muted, remaining_time, muted_details } = response.data.data;
        setIsMuted(is_muted);
        setMuteDetails(muted_details);
      }
    } catch (error) {
      console.log("Error fetching mute status:", error);
    }
  };

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchMessages(true);
      await fetchParticipants();
      await fetchMuteStatus();
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
      await fetchParticipants();
      await fetchMuteStatus();
      
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

  // Fetch participants
  const fetchParticipants = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const { participants, total_participants, online_count } = response.data.data;
        setParticipants(participants || []);
        setTotalParticipants(total_participants || 0);
        setOnlineCount(online_count || 0);
      }
    } catch (error) {
      console.log("Error fetching participants:", error);
    }
  };

  // Send text message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending || isMuted) return;

    setSending(true);
    try {
      const token = await AsyncStorage.getItem("token");
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
        setNewMessage("");
        
        const newMsg = response.data.data || {
          id: Date.now().toString(),
          sender_id: currentUserId,
          sender_name: currentUserName,
          sender_type: "user",
          message: newMessage.trim(),
          type: "text",
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_muted: false,
        };
       
        setMessages(prev => [...prev, newMsg]);
        setShouldScrollToBottom(true);
        setNewMessageCount(0);
        setShowScrollToBottom(false);
       
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 50);
      }
    } catch (error) {
      console.log("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Request permissions for image/video
  const requestMediaPermissions = async (mediaType) => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        let permissions = [];
        
        // For camera, need camera permission
        if (mediaType === "camera") {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        
        // For storage permission
        if (androidVersion >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
        } else {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        
        // Request permissions
        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        // Check if all permissions are granted
        const allGranted = permissions.every(
          permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (!allGranted) {
          // Check if user denied permanently
          const rationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
            permissions[0]
          );
          
          // Only show alert if user denied permanently
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
        // Continue anyway - the image picker might still work
        return true;
      }
    }
    return true; // For iOS
  };

  // Send image or video
  const sendMedia = async (mediaType, uri, filename) => {
    if (isMuted) {
      Alert.alert("Muted", "You cannot send messages while muted");
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('type', mediaType);
      
      // Extract file extension and set correct MIME type
      let type = mediaType === 'image' ? 'image/jpeg' : 'video/mp4';
      if (filename) {
        const match = /\.(\w+)$/.exec(filename);
        if (match) {
          const ext = match[1].toLowerCase();
          if (mediaType === 'image') {
            type = `image/${ext}`;
          } else {
            type = `video/${ext}`;
          }
        }
      }
      
      formData.append('attachment', {
        uri: uri,
        type: type,
        name: filename || `${mediaType}_${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`,
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
        const newMsg = response.data.data || {
          id: Date.now().toString(),
          sender_id: currentUserId,
          sender_name: currentUserName,
          sender_type: "user",
          message: mediaType === 'image' ? '📷 Image' : '🎥 Video',
          type: mediaType,
          attachment_url: response.data.data?.attachment_url || uri,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          is_muted: false,
        };
       
        setMessages(prev => [...prev, newMsg]);
        setShouldScrollToBottom(true);
        setNewMessageCount(0);
        setShowScrollToBottom(false);
       
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 50);
      }
    } catch (error) {
      console.log("Error sending media:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || "Failed to send media"
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle image/video picker
  const handleMediaPick = async (source, mediaType) => {
    if (isMuted) {
      Alert.alert("Muted", "You cannot send messages while muted");
      return;
    }

    // Check permissions before proceeding
    const hasPermission = await requestMediaPermissions(source);
    if (!hasPermission) {
      return;
    }

    const options = {
      mediaType: mediaType === 'image' ? 'photo' : 'video',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
      saveToPhotos: false,
      selectionLimit: 1,
    };

    if (mediaType === 'video') {
      options.videoQuality = 'high';
    }

    try {
      let result;
      
      if (source === "camera") {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel) {
        console.log('User cancelled media picker');
        return;
      }

      if (result.errorCode) {
        console.log('Media Picker Error:', result.errorMessage);
        Alert.alert("Error", result.errorMessage || "Failed to pick media");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedMedia = result.assets[0];
        const uri = selectedMedia.uri;
        const filename = selectedMedia.fileName || selectedMedia.uri.split('/').pop();
        
        if (uri) {
          await sendMedia(mediaType, uri, filename);
        }
      }
    } catch (error) {
      console.log("Media picker error:", error);
      Alert.alert("Error", "Failed to pick media");
    }
  };

  // Handle attachment press
  const handleAttachmentPress = async () => {
    if (isMuted) {
      Alert.alert("Muted", "You cannot send messages while muted");
      return;
    }

    Alert.alert(
      "Send Media",
      "Choose media type",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: () => handleMediaPick("camera", "image")
        },
        {
          text: "Choose Image",
          onPress: () => handleMediaPick("gallery", "image")
        },
        {
          text: "Take Video",
          onPress: () => handleMediaPick("camera", "video")
        },
        {
          text: "Choose Video",
          onPress: () => handleMediaPick("gallery", "video")
        }
      ]
    );
  };

  // Handle video playback
  const handleVideoPress = async (message) => {
    const mediaUrl = message.attachment?.url 
      ? `https://tambolatime.co.in/public${message.attachment.url}`
      : message.attachment_url;
    
    if (!mediaUrl) {
      Alert.alert("Error", "Video URL not available");
      return;
    }

    Alert.alert(
      "Video",
      "View this video in browser",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Open in Browser",
          onPress: () => {
            Linking.openURL(mediaUrl).catch(err => {
              console.log("Error opening URL:", err);
              Alert.alert("Error", "Cannot open this video URL");
            });
          }
        }
      ]
    );
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

  // Leave chat
  const leaveChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
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

  // Add event listener for app coming to foreground
  useEffect(() => {
    const refreshOnFocus = navigation.addListener('focus', () => {
      // Refresh messages when screen comes into focus
      fetchMessages();
      fetchParticipants();
      fetchMuteStatus();
    });

    return refreshOnFocus;
  }, [navigation]);

  useEffect(() => {
    isMounted.current = true;
   
    const initializeChat = async () => {
      await getCurrentUserInfo();
      
      try {
        const token = await AsyncStorage.getItem("token");
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
      } catch (error) {
        console.log("Error joining chat:", error);
        Alert.alert("Error", "Failed to join chat");
        navigation.goBack();
      }
    };
   
    initializeChat();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Add refresh control to ScrollView
  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleManualRefresh}
      colors={["#25D366"]}
      tintColor="#25D366"
    />
  );

  const renderMessage = (message, index) => {
    const isSystem = message.type === "system";
    const isOwnMessage = message.sender_type === "user" && message.sender_id === currentUserId;
    const isVoice = message.type === 'voice';
    const isMedia = message.type === 'image' || message.type === 'media';
    const isVideo = message.type === 'media' && !isVoice;
    const isImage = message.type === 'image';
    const isMutedMessage = message.is_muted;

    if (isSystem) {
      return (
        <View key={message.id || index} style={styles.systemMessageContainer}>
          <View style={styles.systemMessage}>
            <Ionicons name="information-circle" size={14} color="#666" />
            <Text style={styles.systemMessageText}>{message.message}</Text>
          </View>
          <Text style={styles.systemTimestamp}>
            {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      );
    }

    if (isVoice) {
      if (isOwnMessage) {
        return (
          <View key={message.id || index} style={styles.ownMessageContainer}>
            <View style={styles.ownMessageBubble}>
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
                <Ionicons
                  name="checkmark-done"
                  size={12}
                  color={isMutedMessage ? "#666" : "#34B7F1"}
                  style={styles.messageStatusIcon}
                />
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View key={message.id || index} style={styles.otherMessageContainer}>
            <View style={styles.otherMessageBubble}>
              <Text style={styles.senderName}>
                {message.sender_name || "User"}
                {message.sender_type === "host" && " (Host)"}
                {isMutedMessage && " 🔇"}
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
              </View>
            </View>
          </View>
        );
      }
    }

    const mediaUrl = message.attachment?.url 
      ? `https://tambolatime.co.in/public${message.attachment.url}`
      : message.attachment_url;

    if (isOwnMessage) {
      return (
        <View key={message.id || index} style={styles.ownMessageContainer}>
          <View style={styles.ownMessageBubble}>
            {isMedia ? (
              <View style={styles.mediaContainer}>
                {isVideo ? (
                  <TouchableOpacity
                    style={styles.videoContainer}
                    onPress={() => handleVideoPress(message)}
                  >
                    <>
                      <View style={styles.videoThumbnail}>
                        <Ionicons name="play-circle" size={40} color="#FFF" />
                      </View>
                      {message.message && message.message.trim() && (
                        <Text style={styles.mediaCaption}>{message.message}</Text>
                      )}
                      <View style={styles.videoInfo}>
                        <Ionicons name="videocam" size={12} color="#666" />
                        <Text style={styles.videoText}>Video</Text>
                      </View>
                    </>
                  </TouchableOpacity>
                ) : isImage ? (
                  <>
                    <Image
                      source={{ uri: mediaUrl }}
                      style={styles.mediaImage}
                      resizeMode="cover"
                    />
                    {message.message && message.message.trim() && (
                      <Text style={styles.mediaCaption}>{message.message}</Text>
                    )}
                  </>
                ) : null}
              </View>
            ) : (
              <Text style={[
                styles.ownMessageText,
                isMutedMessage && styles.mutedMessageText
              ]}>
                {isMutedMessage ? "[This message was sent while muted]" : message.message}
              </Text>
            )}
            <View style={styles.ownMessageFooter}>
              <Text style={styles.ownTimestamp}>
                {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Ionicons
                name="checkmark-done"
                size={12}
                color={isMutedMessage ? "#666" : "#34B7F1"}
                style={styles.messageStatusIcon}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View key={message.id || index} style={styles.otherMessageContainer}>
          <View style={styles.otherMessageBubble}>
            <Text style={styles.senderName}>
              {message.sender_name || "User"}
              {message.sender_type === "host" && " (Host)"}
              {isMutedMessage && " 🔇"}
            </Text>
            
            {isMedia ? (
              <View style={styles.mediaContainer}>
                {isVideo ? (
                  <TouchableOpacity
                    style={styles.videoContainer}
                    onPress={() => handleVideoPress(message)}
                  >
                    <>
                      <View style={styles.videoThumbnail}>
                        <Ionicons name="play-circle" size={40} color="#FFF" />
                      </View>
                      {message.message && message.message.trim() && (
                        <Text style={styles.mediaCaption}>{message.message}</Text>
                      )}
                      <View style={styles.videoInfo}>
                        <Ionicons name="videocam" size={12} color="#666" />
                        <Text style={styles.videoText}>Video</Text>
                      </View>
                    </>
                  </TouchableOpacity>
                ) : isImage ? (
                  <>
                    <Image
                      source={{ uri: mediaUrl }}
                      style={styles.mediaImage}
                      resizeMode="cover"
                    />
                    {message.message && message.message.trim() && (
                      <Text style={styles.mediaCaption}>{message.message}</Text>
                    )}
                  </>
                ) : null}
              </View>
            ) : (
              <Text style={[
                styles.otherMessageText,
                isMutedMessage && styles.mutedMessageText
              ]}>
                {isMutedMessage ? "[This user is muted]" : message.message}
              </Text>
            )}
            
            <View style={styles.otherMessageFooter}>
              <Text style={styles.otherTimestamp}>
                {message.timestamp || new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  const ParticipantsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showParticipantsModal}
      onRequestClose={() => setShowParticipantsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chat Participants</Text>
            <TouchableOpacity onPress={() => setShowParticipantsModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
         
          <View style={styles.participantsStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={18} color="#075E54" />
              <Text style={styles.statText}>Total: {totalParticipants}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="wifi" size={18} color="#4CAF50" />
              <Text style={styles.statText}>Online: {onlineCount}</Text>
            </View>
          </View>
         
          <ScrollView style={styles.participantsList}>
            {participants.map((participant, index) => (
              <View key={index} style={styles.participantItem}>
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantAvatarText}>
                    {participant.name?.charAt(0) || "U"}
                  </Text>
                  <View style={[
                    styles.participantOnlineStatus,
                    { backgroundColor: participant.is_online ? '#4CAF50' : '#9E9E9E' }
                  ]} />
                </View>
                <View style={styles.participantInfo}>
                  <View style={styles.participantNameRow}>
                    <Text style={styles.participantName}>{participant.name}</Text>
                    {participant.is_host && (
                      <View style={styles.hostBadge}>
                        <Ionicons name="shield-checkmark" size={10} color="#FFF" />
                        <Text style={styles.hostBadgeText}>Host</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.participantType}>
                    {participant.type === 'host' ? 'Host' : 'User'}
                  </Text>
                </View>
                <View style={styles.participantStatus}>
                  <Text style={[
                    styles.participantStatusText,
                    { color: participant.is_online ? '#4CAF50' : '#9E9E9E' }
                  ]}>
                    {participant.is_online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
         
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowParticipantsModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading Chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
     
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() => setShowParticipantsModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {gameName}
            </Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>
                {onlineCount} online
              </Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Game Chat</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowParticipantsModal(true)}
        >
          <Ionicons name="people" size={22} color="#FFF" />
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.headerButton}
          onPress={leaveChat}
        >
          <Ionicons name="exit-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Mute Status Banner */}
      {isMuted && (
        <View style={styles.muteBanner}>
          <Ionicons name="mic-off" size={18} color="#FFF" />
          <Text style={styles.muteText}>
            You are muted{muteDetails?.duration_text ? ` for ${muteDetails.duration_text}` : ''}
          </Text>
        </View>
      )}

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
            <Text style={styles.welcomeTitle}>Welcome to Game Chat!</Text>
            <Text style={styles.welcomeText}>
              Chat with other players, share your excitement, and discuss the game!
              This chat is for {gameName} only.
            </Text>
            <View style={styles.welcomeTips}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.tipText}>Be respectful to other players</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.tipText}>No spam or advertising</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                <Text style={styles.tipText}>Have fun and good luck!</Text>
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
              Be the first to say hello! 👋
            </Text>
          </View>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
       
        <View style={styles.messagesSpacer} />
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

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleAttachmentPress}
            disabled={uploading || isMuted}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={isMuted ? "#CCC" : "#666"} />
            ) : (
              <Ionicons 
                name="attach" 
                size={22} 
                color={isMuted ? "#CCC" : "#666"} 
              />
            )}
          </TouchableOpacity>
         
          <TextInput
            ref={messageInputRef}
            style={[
              styles.textInput,
              isMuted && styles.disabledInput
            ]}
            placeholder={isMuted ? "You are muted" : "Type a message..."}
            placeholderTextColor={isMuted ? "#FF5252" : "#999"}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            editable={!isMuted}
          />
         
          {newMessage.trim() && !isMuted ? (
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
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons 
                name="happy-outline" 
                size={24} 
                color={isMuted ? "#CCC" : "#666"} 
              />
            </TouchableOpacity>
          )}
        </View>
       
        <View style={styles.inputFooter}>
          <Text style={styles.charCount}>
            {newMessage.length}/500
          </Text>
          <View style={styles.connectionStatus}>
            <View style={[
              styles.connectionDot,
              { backgroundColor: isConnected ? '#4CAF50' : '#FF5252' }
            ]} />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ParticipantsModal />
    </SafeAreaView>
  );
};

// Styles remain exactly the same...
const styles = StyleSheet.create({
  safeArea: {
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
    paddingRight: 12,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginRight: 8,
    flex: 1,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  // Mute Banner
  muteBanner: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  muteText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
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
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  systemMessage: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "90%",
  },
  systemMessageText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  systemTimestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  // OWN MESSAGE STYLES - Right aligned
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
  // OTHER MESSAGE STYLES - Left aligned
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
  },
  // VOICE MESSAGE STYLES - Compact
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
  messagesSpacer: {
    height: 80,
  },
  // MEDIA MESSAGE STYLES
  mediaContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 4,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  mediaCaption: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  // VIDEO STYLES
  videoContainer: {
    width: 200,
  },
  videoThumbnail: {
    width: 200,
    height: 200,
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
    gap: 4,
  },
  videoText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "#F0F0F0",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emojiButton: {
    width: 40,
    height: 40,
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
  disabledInput: {
    backgroundColor: "#F5F5F5",
    borderColor: "#FFCDD2",
    color: "#FF5252",
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  connectionText: {
    fontSize: 12,
    color: "#666",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#075E54",
  },
  participantsStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  participantsList: {
    maxHeight: 300,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#075E54",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  participantAvatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  participantOnlineStatus: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  participantInfo: {
    flex: 1,
  },
  participantNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 2,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  hostBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  hostBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  participantType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  participantStatus: {
    marginLeft: 8,
  },
  participantStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  closeModalButton: {
    backgroundColor: "#075E54",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeModalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
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
});

export default UserLiveChat;
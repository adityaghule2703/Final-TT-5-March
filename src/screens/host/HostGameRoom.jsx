// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Alert,
//   Animated,
//   RefreshControl,
//   Modal,
//   Platform,
//   AppState,
// } from "react-native";
// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get("window");

// // Custom Snackbar Component
// const CustomSnackbar = ({ visible, message, onDismiss, action }) => {
//   const [animation] = useState(new Animated.Value(0));

//   useEffect(() => {
//     if (visible) {
//       Animated.timing(animation, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(animation, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   if (!visible) return null;

//   const translateY = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [100, 0],
//   });

//   return (
//     <Modal
//       transparent={true}
//       visible={visible}
//       animationType="none"
//       onRequestClose={onDismiss}
//     >
//       <View style={styles.snackbarOverlay}>
//         <Animated.View
//           style={[
//             styles.snackbarContainer,
//             { transform: [{ translateY }] },
//           ]}
//         >
//           <Text style={styles.snackbarText}>{message}</Text>
//           {action && (
//             <TouchableOpacity onPress={action.onPress}>
//               <Text style={styles.snackbarActionText}>{action.label}</Text>
//             </TouchableOpacity>
//           )}
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// // Custom Slider Component with 8-15 second range
// const CustomSlider = ({ 
//   value, 
//   onValueChange, 
//   min = 8, 
//   max = 15, 
//   step = 1,
//   disabled = false 
// }) => {
//   const [sliderWidth, setSliderWidth] = useState(0);
//   const [isSliding, setIsSliding] = useState(false);

//   const handleLayout = (event) => {
//     setSliderWidth(event.nativeEvent.layout.width);
//   };

//   const calculateValue = (x) => {
//     if (sliderWidth === 0 || disabled) return value;
    
//     let percentage = (x / sliderWidth) * 100;
//     percentage = Math.max(0, Math.min(100, percentage));
    
//     const range = max - min;
//     const rawValue = min + (percentage / 100) * range;
    
//     let newValue = Math.round(rawValue / step) * step;
//     newValue = Math.max(min, Math.min(max, newValue));
    
//     return newValue;
//   };

//   const handleTouchStart = (event) => {
//     if (disabled) return;
//     setIsSliding(true);
//     const x = event.nativeEvent.locationX;
//     const newValue = calculateValue(x);
//     if (newValue !== value) {
//       onValueChange(newValue);
//     }
//   };

//   const handleTouchMove = (event) => {
//     if (disabled || !isSliding) return;
//     const x = event.nativeEvent.locationX;
//     const newValue = calculateValue(x);
//     if (newValue !== value) {
//       onValueChange(newValue);
//     }
//   };

//   const handleTouchEnd = () => {
//     setIsSliding(false);
//   };

//   const percentage = ((value - min) / (max - min)) * 100;

//   return (
//     <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
//       <View 
//         style={styles.sliderTrackWrapper}
//         onLayout={handleLayout}
//       >
//         <View style={styles.sliderTrack}>
//           <View 
//             style={[
//               styles.sliderFill,
//               { width: `${percentage}%` }
//             ]} 
//           />
//         </View>
        
//         <View
//           style={styles.sliderTouchArea}
//           onStartShouldSetResponder={() => !disabled}
//           onMoveShouldSetResponder={() => !disabled}
//           onResponderGrant={handleTouchStart}
//           onResponderMove={handleTouchMove}
//           onResponderRelease={handleTouchEnd}
//           onResponderTerminate={handleTouchEnd}
//         />
        
//         <View 
//           style={[
//             styles.sliderThumb,
//             { left: `${percentage}%`, marginLeft: -12 },
//             isSliding && styles.sliderThumbActive,
//             disabled && styles.sliderThumbDisabled
//           ]}
//         />
//       </View>
      
//       <View style={styles.sliderLabels}>
//         <Text style={styles.sliderLabel}>{min}s</Text>
//         <Text style={styles.sliderValueLabel}>{value}s</Text>
//         <Text style={styles.sliderLabel}>{max}s</Text>
//       </View>
//     </View>
//   );
// };

// const HostGameRoom = ({ navigation, route }) => {
//   const { gameId, gameName } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [gameStatus, setGameStatus] = useState(null);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [sortedNumbers, setSortedNumbers] = useState([]);
//   const [numberCallingStatus, setNumberCallingStatus] = useState(null);
//   const [initializing, setInitializing] = useState(false);
//   const [startingAutoMode, setStartingAutoMode] = useState(false);
//   const [pausing, setPausing] = useState(false);
//   const [resuming, setResuming] = useState(false);
//   const [callingManual, setCallingManual] = useState(false);
//   const [intervalSeconds, setIntervalSeconds] = useState(10);
//   const [updatingInterval, setUpdatingInterval] = useState(false);
//   const [endingGame, setEndingGame] = useState(false);
  
//   // Live Chat States
//   const [participantCount, setParticipantCount] = useState(0);
//   const [isChatJoined, setIsChatJoined] = useState(false);
  
//   // Pending Claims States
//   const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
//   const [claims, setClaims] = useState([]);
  
//   // Snackbar States
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
  
//   // App State for foreground/background detection
//   const [appState, setAppState] = useState(AppState.currentState);
  
//   // Pusher Refs
//   const pusherRef = useRef(null);
//   const gameChannelRef = useRef(null);
//   const adminChannelRef = useRef(null);
//   const isMountedRef = useRef(true);
  
//   // Reconnection Refs
//   const reconnectAttemptsRef = useRef(0);
//   const reconnectTimeoutRef = useRef(null);
//   const maxReconnectAttempts = 10;
  
//   // Queue for missed events during disconnection
//   const missedEventsQueueRef = useRef([]);
//   const processingQueueRef = useRef(false);
//   const isPusherConnectedRef = useRef(false);

//   // Refs for latest values
//   const calledNumbersRef = useRef([]);
//   const numberCallingStatusRef = useRef(null);
//   const pendingClaimsRef = useRef(0);
//   const fetchGameStatusTimeoutRef = useRef(null);
//   const autoModeWasRunningRef = useRef(false);
  
//   // Auto-start retry ref
//   const autoStartRetryTimeoutRef = useRef(null);

//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const manualButtonAnim = useRef(new Animated.Value(1)).current;

//   // Handle App State changes (foreground/background)
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appState.match(/inactive|background/) && nextAppState === 'active') {
//         console.log(`[Game ${gameId}] App came to foreground - refreshing data`);
//         handleAppForeground();
//       }
//       setAppState(nextAppState);
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [appState, gameId]);

//   // Handle app coming to foreground
//   const handleAppForeground = async () => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] 📱 App in foreground - checking connections`);
    
//     try {
//       const pusher = Pusher.getInstance();
//       if (!isPusherConnectedRef.current) {
//         await reconnectPusher();
//       }
      
//       await fetchGameStatus();
//       await fetchPendingClaimsCount();
//       await checkChatStatus();
      
//       processMissedEventsQueue();
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error in handleAppForeground:`, error);
//     }
//   };

//   // Update refs when state changes
//   useEffect(() => {
//     calledNumbersRef.current = calledNumbers;
//   }, [calledNumbers]);

//   useEffect(() => {
//     numberCallingStatusRef.current = numberCallingStatus;
//   }, [numberCallingStatus]);

//   useEffect(() => {
//     pendingClaimsRef.current = pendingClaimsCount;
//   }, [pendingClaimsCount]);

//   // Set mounted ref
//   useEffect(() => {
//     isMountedRef.current = true;
    
//     return () => {
//       isMountedRef.current = false;
//       if (autoStartRetryTimeoutRef.current) {
//         clearTimeout(autoStartRetryTimeoutRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => { 
//     const initializeApp = async () => {
//       try {
//         await initializePusher();
//         await fetchInitialData();
//         startPulseAnimation();
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       } catch (error) {
//         console.log(`[Game ${gameId}] Error initializing app:`, error);
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       }
//     };
    
//     initializeApp();
    
//     return () => {
//       console.log(`[Game ${gameId}] Cleaning up...`);
//       cleanupPusher();
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
//     };
//   }, [gameId]);

//   // Initialize Pusher with better connection handling
//   const initializePusher = async () => {
//     try {
//       console.log(`[Game ${gameId}] Initializing Pusher...`);
      
//       const pusher = Pusher.getInstance();
      
//       await pusher.init({
//         apiKey: '9c1d16690beded57332a',
//         cluster: 'ap2',
//         forceTLS: true,
//         activityTimeout: 30000,
//         pongTimeout: 30000,
//         onConnectionStateChange: (currentState, previousState) => {
//           console.log(`[Game ${gameId}] Connection state changed from ${previousState} to ${currentState}`);
          
//           if (currentState === 'CONNECTED') {
//             console.log(`[Game ${gameId}] ✅ Connected successfully`);
//             isPusherConnectedRef.current = true;
//             reconnectAttemptsRef.current = 0;
            
//             if (reconnectTimeoutRef.current) {
//               clearTimeout(reconnectTimeoutRef.current);
//               reconnectTimeoutRef.current = null;
//             }
            
//             processMissedEventsQueue();
//           }
          
//           if (currentState === 'DISCONNECTED' && isMountedRef.current) {
//             console.log(`[Game ${gameId}] ❌ Disconnected, will attempt to reconnect...`);
//             isPusherConnectedRef.current = false;
//             scheduleReconnection();
//           }
//         },
//         onError: (message, code, error) => {
//           console.log(`[Game ${gameId}] Pusher error: ${message}`, error);
//           isPusherConnectedRef.current = false;
//           if (isMountedRef.current) {
//             scheduleReconnection();
//           }
//         }
//       });
      
//       await pusher.connect();
      
//       const gameChannel = await pusher.subscribe({
//         channelName: `game.${gameId}`,
//         onEvent: (event) => {
//           if (isMountedRef.current) {
//             handleGameEvent(event);
//           }
//         }
//       });
//       gameChannelRef.current = gameChannel;
      
//       const adminChannel = await pusher.subscribe({
//         channelName: `admin.game.${gameId}`,
//         onEvent: (event) => {
//           if (isMountedRef.current) {
//             handleAdminEvent(event);
//           }
//         }
//       });
//       adminChannelRef.current = adminChannel;
      
//       pusherRef.current = pusher;
//       isPusherConnectedRef.current = true;
      
//       console.log(`[Game ${gameId}] ✅ Pusher initialized successfully`);
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
//       isPusherConnectedRef.current = false;
//       if (isMountedRef.current) {
//         scheduleReconnection();
//       }
//       throw error;
//     }
//   };

//   // Process missed events queue
//   const processMissedEventsQueue = async () => {
//     if (processingQueueRef.current || missedEventsQueueRef.current.length === 0) {
//       return;
//     }
    
//     processingQueueRef.current = true;
//     console.log(`[Game ${gameId}] 📦 Processing ${missedEventsQueueRef.current.length} missed events`);
    
//     const events = [...missedEventsQueueRef.current].sort((a, b) => {
//       return (a.timestamp || 0) - (b.timestamp || 0);
//     });
    
//     missedEventsQueueRef.current = [];
    
//     for (const event of events) {
//       if (!isMountedRef.current) break;
      
//       try {
//         if (event.type === 'number.called') {
//           await handleNumberCalled(event.data);
//         } else if (event.type === 'calling.status.updated') {
//           await handleStatusUpdated(event.data);
//         }
        
//         await new Promise(resolve => setTimeout(resolve, 100));
//       } catch (error) {
//         console.log(`[Game ${gameId}] Error processing missed event:`, error);
//       }
//     }
    
//     processingQueueRef.current = false;
    
//     if (isMountedRef.current) {
//       await fetchGameStatus();
//     }
//   };

//   // Handle game channel events with queueing
//   const handleGameEvent = (event) => {
//     console.log(`[Game ${gameId}] Game channel event: ${event.eventName}`);
    
//     try {
//       const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
//       if (data.game_id && data.game_id !== parseInt(gameId)) {
//         console.log(`[Game ${gameId}] Ignoring event for game ${data.game_id}`);
//         return;
//       }
      
//       if (!isPusherConnectedRef.current) {
//         console.log(`[Game ${gameId}] Pusher disconnected, queueing event: ${event.eventName}`);
//         missedEventsQueueRef.current.push({
//           type: event.eventName,
//           data: data,
//           timestamp: Date.now()
//         });
//         return;
//       }
      
//       switch (event.eventName) {
//         case 'number.called':
//           handleNumberCalled(data);
//           break;
//         case 'calling.status.updated':
//           handleStatusUpdated(data);
//           break;
//         case 'game.completed':
//           handleGameCompleted(data);
//           break;
//         case 'claim.submitted':
//           handleNewClaimSubmitted(data);
//           break;
//         case 'claim.approved':
//         case 'claim.rejected':
//           handleClaimProcessed(data);
//           break;
//         default:
//           console.log(`[Game ${gameId}] Unhandled game event: ${event.eventName}`);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error handling game event:`, error);
//     }
//   };

//   // Handle admin channel events with queueing
//   const handleAdminEvent = (event) => {
//     console.log(`[Game ${gameId}] Admin channel event: ${event.eventName}`);
    
//     try {
//       const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
//       if (data.game_id && data.game_id !== parseInt(gameId)) {
//         console.log(`[Game ${gameId}] Ignoring admin event for game ${data.game_id}`);
//         return;
//       }
      
//       if (!isPusherConnectedRef.current) {
//         console.log(`[Game ${gameId}] Pusher disconnected, queueing admin event: ${event.eventName}`);
//         missedEventsQueueRef.current.push({
//           type: event.eventName,
//           data: data,
//           timestamp: Date.now()
//         });
//         return;
//       }
      
//       switch (event.eventName) {
//         case 'number.called':
//           handleNumberCalled(data);
//           break;
//         case 'calling.status.updated':
//           handleStatusUpdated(data);
//           break;
//         case 'game.completed':
//           handleGameCompleted(data);
//           break;
//         case 'claim.submitted':
//           handleNewClaimSubmitted(data);
//           break;
//         case 'claim.approved':
//         case 'claim.rejected':
//           handleClaimProcessed(data);
//           break;
//         default:
//           console.log(`[Game ${gameId}] Unhandled admin event: ${event.eventName}`);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error handling admin event:`, error);
//     }
//   };

//   // Handle number called event - improved
//   const handleNumberCalled = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] 📞 Processing number called event:`, data);
    
//     try {
//       const number = data.number;
//       const totalCalled = data.total_called;
//       const sorted = data.sorted_numbers || [];
      
//       console.log(`[Game ${gameId}] New number: ${number}, Total called: ${totalCalled}`);
      
//       setCalledNumbers(prev => {
//         if (!prev.includes(number)) {
//           const updated = [...prev, number];
//           console.log(`[Game ${gameId}] Called numbers updated: ${prev.length} → ${updated.length}`);
//           return updated;
//         }
//         console.log(`[Game ${gameId}] Number ${number} already exists, skipping`);
//         return prev;
//       });
      
//       setSortedNumbers(sorted);
      
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
      
//       fetchGameStatusTimeoutRef.current = setTimeout(() => {
//         if (isMountedRef.current) {
//           fetchGameStatus(false);
//         }
//       }, 1000);
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error handling number called event:`, error);
//     }
//   };

//   // Handle status updated event
//   const handleStatusUpdated = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] Processing status updated event:`, data);
    
//     try {
//       const newStatus = {
//         auto_mode: data.auto_mode || false,
//         is_running: data.is_running || false,
//         is_paused: data.is_paused || false,
//         interval_seconds: data.interval_seconds || data.interval || 10,
//         total_calls: data.total_calls || 0,
//         next_call_in: data.next_call_in,
//         next_call_at: data.next_call_at,
//         status: data.status,
//         started_at: data.started_at,
//         paused_at: data.paused_at,
//         resumed_at: data.resumed_at,
//         stopped_at: data.stopped_at,
//       };
      
//       setNumberCallingStatus(newStatus);
      
//       if (data.interval_seconds && data.interval_seconds !== intervalSeconds) {
//         setIntervalSeconds(data.interval_seconds);
//       }
      
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
      
//       fetchGameStatusTimeoutRef.current = setTimeout(() => {
//         if (isMountedRef.current) {
//           fetchGameStatus(false);
//         }
//       }, 500);
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error handling status updated event:`, error);
//     }
//   };

//   // Handle new claim submitted event
//   const handleNewClaimSubmitted = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] 📝 New claim submitted event:`, data);
    
//     const claimData = data.claim || data;
    
//     setPendingClaimsCount(prevCount => prevCount + 1);
    
//     setClaims(prevClaims => {
//       const exists = prevClaims.some(claim => claim.id === claimData.id);
//       if (exists) return prevClaims;
      
//       const newClaim = {
//         id: claimData.id,
//         user_name: claimData.user_name,
//         pattern_name: claimData.pattern_name || claimData.reward_name,
//         winning_amount: claimData.winning_amount || "100.00",
//         time_since_claim: "Just now",
//         can_process: true
//       };
      
//       return [newClaim, ...prevClaims];
//     });
    
//     showSnackbar(`📝 New claim from ${claimData.user_name || 'player'}!`);
    
//     if (numberCallingStatusRef.current?.is_running && !numberCallingStatusRef.current?.is_paused) {
//       console.log(`[Game ${gameId}] ⏸️ Auto-calling paused due to new claim`);
//       autoModeWasRunningRef.current = true;
//       pauseNumberCallingAutomatically();
//     }
//   };

//   // Handle claim processed event
//   const handleClaimProcessed = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] ✅ Claim processed event:`, data);
    
//     const claimData = data.claim || data;
    
//     setPendingClaimsCount(prevCount => {
//       const newCount = Math.max(0, prevCount - 1);
//       console.log(`[Game ${gameId}] Pending claims count: ${prevCount} → ${newCount}`);
      
//       if (newCount === 0 && autoModeWasRunningRef.current) {
//         autoModeWasRunningRef.current = false;
//       }
      
//       return newCount;
//     });
    
//     setClaims(prevClaims => {
//       const filtered = prevClaims.filter(claim => claim.id !== claimData.id);
//       console.log(`[Game ${gameId}] Claims list: ${prevClaims.length} → ${filtered.length}`);
//       return filtered;
//     });
    
//     setTimeout(() => {
//       if (isMountedRef.current) {
//         fetchPendingClaimsCount();
//       }
//     }, 500);
//   };

//   // Handle game completed event
//   const handleGameCompleted = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log(`[Game ${gameId}] Processing game completed event:`, data);
    
//     Alert.alert(
//       "🎉 Game Completed",
//       `${data.game_name} has been completed!\nTotal Numbers: ${data.total_numbers}`,
//       [
//         {
//           text: "OK",
//           onPress: () => {
//             navigation.goBack();
//           }
//         }
//       ]
//     );
//   };

//   // Schedule reconnection with exponential backoff
//   const scheduleReconnection = () => {
//     if (!isMountedRef.current) return;
    
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//     }
    
//     if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
//       console.log(`[Game ${gameId}] Max reconnection attempts reached`);
//       Alert.alert(
//         "Connection Issue",
//         "Unable to maintain real-time connection. Please pull down to refresh.",
//         [{ text: "OK" }]
//       );
//       return;
//     }
    
//     const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
//     console.log(`[Game ${gameId}] Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
//     reconnectTimeoutRef.current = setTimeout(() => {
//       if (isMountedRef.current) {
//         reconnectPusher();
//       }
//     }, delay);
//   };

//   // Reconnect function
//   const reconnectPusher = async () => {
//     try {
//       console.log(`[Game ${gameId}] Attempting to reconnect Pusher...`);
      
//       reconnectAttemptsRef.current += 1;
      
//       await cleanupPusher();
      
//       if (isMountedRef.current) {
//         await initializePusher();
//         await fetchGameStatus();
//         await fetchPendingClaimsCount();
        
//         reconnectAttemptsRef.current = 0;
//       }
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] Reconnection failed:`, error);
//       if (isMountedRef.current) {
//         scheduleReconnection();
//       }
//     }
//   };

//   // Cleanup Pusher connections
//   const cleanupPusher = async () => {
//     console.log(`[Game ${gameId}] Cleaning up Pusher...`);
    
//     try {
//       const pusher = Pusher.getInstance();
      
//       if (gameChannelRef.current) {
//         await pusher.unsubscribe({ channelName: `game.${gameId}` });
//         gameChannelRef.current = null;
//       }
//       if (adminChannelRef.current) {
//         await pusher.unsubscribe({ channelName: `admin.game.${gameId}` });
//         adminChannelRef.current = null;
//       }
      
//       console.log(`[Game ${gameId}] Pusher cleaned up`);
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error cleaning up Pusher:`, error);
//     }
//   };

//   // Custom Snackbar functions
//   const showSnackbar = (message) => {
//     if (!isMountedRef.current) return;
    
//     setSnackbarMessage(message);
//     setSnackbarVisible(true);
    
//     setTimeout(() => {
//       if (isMountedRef.current) {
//         setSnackbarVisible(false);
//       }
//     }, 3000);
//   };

//   const fetchInitialData = async () => {
//     await Promise.all([
//       fetchGameStatus(),
//       checkChatStatus(),
//       fetchPendingClaimsCount(),
//     ]);
//   };

//   const pauseNumberCallingAutomatically = async () => {
//     try {
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         fetchGameStatus();
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error automatically pausing number calling:`, error);
//     }
//   };

//   const checkChatStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("hostToken");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         setParticipantCount(response.data.total_participants || 0);
//         const tokenData = await AsyncStorage.getItem("host");
//         if (tokenData) {
//           const host = JSON.parse(tokenData);
//           const participants = response.data.data || [];
//           const isParticipant = Array.isArray(participants) ? participants.some(p => p.id === host.id) : false;
//           setIsChatJoined(isParticipant);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error checking chat status:`, error);
//     }
//   };

//   const fetchPendingClaimsCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/pending`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         const previousCount = pendingClaimsCount;
//         const newCount = response.data.data?.summary?.total_pending || 0;
//         const newClaims = response.data.data?.claims || [];
        
//         console.log(`[Game ${gameId}] 📊 Pending claims fetched: ${previousCount} → ${newCount}`);
        
//         setPendingClaimsCount(newCount);
//         setClaims(newClaims);
        
//         if (newCount > previousCount) {
//           const message = `📝 ${newCount - previousCount} new claim${newCount - previousCount > 1 ? 's' : ''} submitted!`;
//           showSnackbar(message);
          
//           if (numberCallingStatusRef.current?.is_running && !numberCallingStatusRef.current?.is_paused) {
//             autoModeWasRunningRef.current = true;
//             pauseNumberCallingAutomatically();
//           }
//         }
        
//         if (newCount < previousCount) {
//           console.log(`[Game ${gameId}] ✅ ${previousCount - newCount} claims processed`);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching pending claims count:`, error);
//       if (isMountedRef.current) {
//         setPendingClaimsCount(0);
//         setClaims([]);
//       }
//     }
//   };

//   const endGame = async () => {
//     Alert.alert(
//       "End Game",
//       "Are you sure you want to end this game? This action cannot be undone.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "End Game",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setEndingGame(true);
//               const token = await AsyncStorage.getItem("hostToken");
              
//               const response = await axios.post(
//                 `https://tambolatime.co.in/public/api/host/game/${gameId}/complete`,
//                 {},
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                     Accept: "application/json",
//                   },
//                 }
//               );

//               if (response.data.success && isMountedRef.current) {
//                 Alert.alert(
//                   "Success",
//                   "Game ended successfully!",
//                   [
//                     {
//                       text: "OK",
//                       onPress: () => {
//                         navigation.goBack();
//                         if (navigation.getParent()) {
//                           navigation.getParent().navigate('HostDashboard');
//                         }
//                       }
//                     }
//                   ]
//                 );
//               } else {
//                 throw new Error(response.data.message || "Failed to end game");
//               }
//             } catch (error) {
//               console.log(`[Game ${gameId}] Error ending game:`, error);
//               if (isMountedRef.current) {
//                 Alert.alert(
//                   "Error",
//                   error.response?.data?.message || error.message || "Failed to end game"
//                 );
//               }
//             } finally {
//               if (isMountedRef.current) {
//                 setEndingGame(false);
//               }
//             }
//           },
//         },
//       ]
//     );
//   };

//   const joinChat = async () => {
//     try {
//       const token = await AsyncStorage.getItem("hostToken");
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/games/${gameId}/chat/join`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         setIsChatJoined(true);
//         setParticipantCount(response.data.participant_count || 1);
//         navigation.navigate('HostLiveChat', {
//           gameId,
//           gameName,
//           participantCount: response.data.participant_count || 1
//         });
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error joining chat:`, error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchGameStatus(),
//       checkChatStatus(),
//       fetchPendingClaimsCount(),
//     ]);
    
//     if (!isPusherConnectedRef.current) {
//       await reconnectPusher();
//     }
    
//     if (isMountedRef.current) {
//       setRefreshing(false);
//     }
//   };

//   const startPulseAnimation = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const startManualButtonAnimation = () => {
//     Animated.sequence([
//       Animated.timing(manualButtonAnim, {
//         toValue: 0.9,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(manualButtonAnim, {
//         toValue: 1.1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.spring(manualButtonAnim, {
//         toValue: 1,
//         friction: 3,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   // Improved fetchGameStatus
//   const fetchGameStatus = async (showLoading = true) => {
//     if (!isMountedRef.current) return;
    
//     try {
//       const token = await AsyncStorage.getItem("hostToken");
      
//       console.log(`[Game ${gameId}] 🔍 Fetching game status...`);
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/status`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         const data = response.data.data;
        
//         setGameStatus(data.game);
        
//         const callingStatus = {
//           auto_mode: data.calling?.auto_mode || false,
//           is_running: data.calling?.is_running || false,
//           is_paused: data.calling?.is_paused || false,
//           interval_seconds: data.calling?.interval_seconds || 10,
//           total_calls: data.calling?.total_calls || 0,
//           next_call_in: data.calling?.next_call_in_seconds || data.calling?.next_call_in,
//           next_call_at: data.calling?.next_call_at,
//           status: data.calling?.status,
//           started_at: data.calling?.started_at,
//           paused_at: data.calling?.paused_at,
//           resumed_at: data.calling?.resumed_at,
//           stopped_at: data.calling?.stopped_at,
//         };
        
//         setNumberCallingStatus(callingStatus);
        
//         const newCalledNumbers = data.numbers?.called_numbers || [];
//         const currentCalledNumbers = calledNumbersRef.current;
        
//         const missedNumbers = newCalledNumbers.filter(num => !currentCalledNumbers.includes(num));
//         if (missedNumbers.length > 0) {
//           console.log(`[Game ${gameId}] Found ${missedNumbers.length} missed numbers:`, missedNumbers);
//           setCalledNumbers(newCalledNumbers);
//         } else if (JSON.stringify(currentCalledNumbers) !== JSON.stringify(newCalledNumbers)) {
//           setCalledNumbers(newCalledNumbers);
//         }
        
//         setSortedNumbers(data.numbers?.sorted_numbers || []);
        
//         if (data.calling?.interval_seconds) {
//           setIntervalSeconds(data.calling.interval_seconds);
//         }
        
//         console.log(`[Game ${gameId}] ✅ Game status fetched successfully`);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error fetching game status:`, error);
//     }
//   };

//   const callNextNumberManually = async () => {
//     try {
//       setCallingManual(true);
//       startManualButtonAnimation();
      
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/call-next`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         await fetchGameStatus();
//       } else {
//         throw new Error("Failed to call next number");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error calling next number:`, error);
//       if (isMountedRef.current) {
//         Alert.alert(
//           "Error",
//           error.response?.data?.message || error.message || "Failed to call next number"
//         );
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setCallingManual(false);
//       }
//     }
//   };

//   const initializeNumberCalling = async () => {
//     try {
//       setInitializing(true);
//       console.log(`[Game ${gameId}] 🚀 Initializing number calling...`);
      
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/initialize`,
//         { interval_seconds: 10 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         setIntervalSeconds(10);
        
//         setNumberCallingStatus(prev => ({
//           ...prev,
//           auto_mode: true,
//           interval_seconds: 10
//         }));
        
//         await fetchGameStatus();
        
//         console.log(`[Game ${gameId}] ✅ Number calling initialized successfully`);
//       } else {
//         throw new Error("Failed to initialize number calling");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error initializing number calling:`, error);
//       if (isMountedRef.current) {
//         Alert.alert(
//           "Error",
//           error.response?.data?.message || error.message || "Failed to initialize number calling"
//         );
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setInitializing(false);
//       }
//     }
//   };

//   const updateIntervalSeconds = async () => {
//     try {
//       setUpdatingInterval(true);
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.put(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/interval`,
//         { interval_seconds: intervalSeconds },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         await fetchGameStatus();
//         Alert.alert("Success", "Interval updated successfully");
//       } else {
//         throw new Error("Failed to update interval");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error updating interval:`, error);
//       if (isMountedRef.current) {
//         Alert.alert(
//           "Error",
//           error.response?.data?.message || error.message || "Failed to update interval"
//         );
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setUpdatingInterval(false);
//       }
//     }
//   };

//   // Improved startAutoNumberCalling with retry mechanism
//   const startAutoNumberCalling = async () => {
//     try {
//       setStartingAutoMode(true);
//       const token = await AsyncStorage.getItem("hostToken");
      
//       console.log(`[Game ${gameId}] 🚀 Attempting to start auto number calling...`);
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/start-auto`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//           timeout: 10000,
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         console.log(`[Game ${gameId}] ✅ Auto number calling started successfully`);
        
//         await fetchGameStatus();
        
//         if (autoStartRetryTimeoutRef.current) {
//           clearTimeout(autoStartRetryTimeoutRef.current);
//         }
        
//         autoStartRetryTimeoutRef.current = setTimeout(async () => {
//           if (isMountedRef.current) {
//             const currentStatus = numberCallingStatusRef.current;
//             if (!currentStatus?.is_running || currentStatus?.is_paused) {
//               console.log(`[Game ${gameId}] Auto start didn't take effect, retrying...`);
//               if (isMountedRef.current && !startingAutoMode) {
//                 startAutoNumberCalling();
//               }
//             }
//           }
//         }, 2000);
        
//       } else {
//         throw new Error(response.data.message || "Failed to start auto number calling");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error starting auto number calling:`, error);
      
//       if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
//         console.log(`[Game ${gameId}] Request timeout, checking status...`);
//         setTimeout(async () => {
//           if (isMountedRef.current) {
//             await fetchGameStatus();
//             const currentStatus = numberCallingStatusRef.current;
//             if (!currentStatus?.is_running || currentStatus?.is_paused) {
//               Alert.alert(
//                 "Error",
//                 "Request timed out. Please check if auto calling started and try again."
//               );
//             }
//           }
//         }, 3000);
//       } else {
//         if (isMountedRef.current) {
//           Alert.alert(
//             "Error",
//             error.response?.data?.message || error.message || "Failed to start auto number calling"
//           );
//         }
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setStartingAutoMode(false);
//       }
//     }
//   };

//   const pauseNumberCalling = async () => {
//     try {
//       setPausing(true);
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         await fetchGameStatus();
//       } else {
//         throw new Error("Failed to pause number calling");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error pausing number calling:`, error);
//       if (isMountedRef.current) {
//         Alert.alert(
//           "Error",
//           error.response?.data?.message || error.message || "Failed to pause number calling"
//         );
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setPausing(false);
//       }
//     }
//   };

//   const resumeNumberCalling = async () => {
//     try {
//       setResuming(true);
//       const token = await AsyncStorage.getItem("hostToken");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/resume`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success && isMountedRef.current) {
//         await fetchGameStatus();
//       } else {
//         throw new Error("Failed to resume number calling");
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error resuming number calling:`, error);
//       if (isMountedRef.current) {
//         Alert.alert(
//           "Error",
//           error.response?.data?.message || error.message || "Failed to resume number calling"
//         );
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setResuming(false);
//       }
//     }
//   };

//   const navigateToCalledNumbers = () => {
//     navigation.navigate("HostCalledNumbers", {
//       gameId: gameId,
//       gameName: gameName,
//       calledNumbers: calledNumbers,
//       sortedNumbers: sortedNumbers,
//     });
//   };

//   const navigateToClaimRequests = () => {
//     navigation.navigate("HostClaimRequests", {
//       gameId: gameId,
//       gameName: gameName,
//     });
//   };

//   const hasPendingClaims = pendingClaimsCount > 0;

//   const renderNumberGrid = () => {
//     const numbers = [];
//     for (let i = 1; i <= 90; i++) {
//       const isCalled = calledNumbers.includes(i);
      
//       numbers.push(
//         <View
//           key={i}
//           style={[
//             styles.numberCell,
//             isCalled && styles.calledNumberCell,
//           ]}
//         >
//           <Text style={[
//             styles.numberText,
//             isCalled && styles.calledNumberText
//           ]}>
//             {i}
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.numberGrid}>
//         {numbers}
//       </View>
//     );
//   };

//   const renderLastCalledSection = () => {
//     if (calledNumbers.length === 0) return null;
    
//     const lastFive = [...calledNumbers].slice(-5).reverse();
    
//     return (
//       <View style={styles.lastCalledCard}>
//         <View style={styles.lastCalledHeader}>
//           <Ionicons name="megaphone-outline" size={24} color="#9C27B0" />
//           <Text style={styles.lastCalledTitle}>Last Called Number</Text>
//         </View>
        
//         <View style={styles.lastNumberContainer}>
//           <Text style={styles.lastNumber}>
//             {calledNumbers[calledNumbers.length - 1]}
//           </Text>
//         </View>
        
//         <View style={styles.calledSequence}>
//           <Text style={styles.calledSequenceTitle}>Recently Called:</Text>
//           <View style={styles.calledSequenceNumbers}>
//             {lastFive.map((num, index) => (
//               <View
//                 key={`${num}-${index}`}
//                 style={styles.sequenceNumber}
//               >
//                 <Text style={styles.sequenceNumberText}>{num}</Text>
//               </View>
//             ))}
//           </View>
          
//           <TouchableOpacity
//             style={styles.loadMoreButton}
//             onPress={navigateToCalledNumbers}
//           >
//             <Text style={styles.loadMoreText}>View All Called Numbers</Text>
//             <Ionicons name="chevron-forward" size={16} color="#3498db" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const renderIntervalSlider = () => (
//     <View style={styles.intervalContainer}>
//       <View style={styles.intervalHeader}>
//         <Ionicons name="time-outline" size={20} color="#3498db" />
//         <Text style={styles.intervalTitle}>Calling Interval</Text>
//         <View style={styles.intervalBadge}>
//           <Text style={styles.intervalBadgeText}>{intervalSeconds}s</Text>
//         </View>
//       </View>
      
//       <CustomSlider
//         value={intervalSeconds}
//         onValueChange={setIntervalSeconds}
//         min={8}
//         max={15}
//         step={1}
//         disabled={updatingInterval || hasPendingClaims}
//       />
      
//       <View style={styles.sliderSpeedLabels}>
//         <Text style={styles.sliderSpeedLabel}>Fast (8s)</Text>
//         <Text style={styles.sliderSpeedLabel}>Slow (15s)</Text>
//       </View>
      
//       <TouchableOpacity
//         style={[
//           styles.updateIntervalButton,
//           (updatingInterval || hasPendingClaims) && styles.updateIntervalButtonDisabled
//         ]}
//         onPress={hasPendingClaims ? () => {
//           Alert.alert(
//             "Pending Claims",
//             `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before updating interval.`,
//             [
//               { text: "View Claims", onPress: navigateToClaimRequests },
//               { text: "OK", style: "default" }
//             ]
//           );
//         } : updateIntervalSeconds}
//         disabled={updatingInterval || hasPendingClaims}
//       >
//         {updatingInterval ? (
//           <ActivityIndicator size="small" color="#FFF" />
//         ) : (
//           <>
//             <Ionicons name="sync" size={18} color="#FFF" />
//             <Text style={styles.updateIntervalButtonText}>
//               {hasPendingClaims ? "Claims Pending" : "Update Interval"}
//             </Text>
//           </>
//         )}
//       </TouchableOpacity>
//     </View>
//   );

//   // UseFocusEffect to refresh when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       console.log(`[Game ${gameId}] 📱 Screen focused - refreshing data`);
      
//       const refreshOnFocus = async () => {
//         await fetchGameStatus();
//         await fetchPendingClaimsCount();
//         await checkChatStatus();
        
//         if (!isPusherConnectedRef.current) {
//           await reconnectPusher();
//         }
//       };
      
//       refreshOnFocus();
      
//       return () => {
//         console.log(`[Game ${gameId}] 📱 Screen unfocused`);
//       };
//     }, [gameId])
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//         <Text style={styles.loadingText}>Loading Game Room...</Text>
//       </View>
//     );
//   }

//   const isInitialized = numberCallingStatus?.auto_mode || false;
//   const isRunning = numberCallingStatus?.is_running || false;
//   const isPaused = numberCallingStatus?.is_paused || false;

//   console.log(`[Game ${gameId}] 🎨 Rendering with state:`, {
//     isInitialized,
//     isRunning,
//     isPaused,
//     hasPendingClaims,
//     calledNumbersCount: calledNumbers.length,
//     pusherConnected: isPusherConnectedRef.current
//   });

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#3498db" barStyle="light-content" />

//       <CustomSnackbar
//         visible={snackbarVisible}
//         message={snackbarMessage}
//         onDismiss={() => setSnackbarVisible(false)}
//         action={{
//           label: 'VIEW',
//           onPress: navigateToClaimRequests,
//         }}
//       />

//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-back" size={24} color="#FFF" />
//         </TouchableOpacity>
        
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>{gameName}</Text>
//           <Text style={styles.headerSubtitle}>Game Room</Text>
//         </View>
        
//         <View style={styles.headerButtons}>
//           <TouchableOpacity
//             style={[styles.headerActionButton, styles.endGameButton]}
//             onPress={endGame}
//             disabled={endingGame}
//           >
//             {endingGame ? (
//               <ActivityIndicator size="small" color="#FFF" />
//             ) : (
//               <>
//                 <Ionicons name="flag-outline" size={18} color="#FFF" />
//                 <Text style={styles.endGameButtonText}>End</Text>
//               </>
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.headerActionButton, styles.claimRequestsButton]}
//             onPress={navigateToClaimRequests}
//           >
//             <Ionicons name="checkmark-done-outline" size={18} color="#FFF" />
//             {pendingClaimsCount > 0 && (
//               <View style={styles.claimBadge}>
//                 <Text style={styles.claimBadgeText}>
//                   {pendingClaimsCount > 99 ? '99+' : pendingClaimsCount}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#3498db"
//             colors={["#3498db"]}
//             progressViewOffset={20}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.statusCard}>
//           <View style={styles.statusHeader}>
//             <MaterialCommunityIcons name="broadcast" size={24} color="#2196F3" />
//             <Text style={styles.statusTitle}>Game Status</Text>
//             <View style={[
//               styles.statusBadge,
//               { backgroundColor: gameStatus?.status === 'live' ? '#4CAF5015' : '#FF980015' }
//             ]}>
//               <Text style={[
//                 styles.statusBadgeText,
//                 { color: gameStatus?.status === 'live' ? '#4CAF50' : '#FF9800' }
//               ]}>
//                 {gameStatus?.status?.toUpperCase() || 'LOADING'}
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.statsGrid}>
//             <View style={styles.statItem}>
//               <Ionicons name="ticket-outline" size={20} color="#9C27B0" />
//               <Text style={styles.statValue}>{calledNumbers.length}</Text>
//               <Text style={styles.statLabel}>Called</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="grid-outline" size={20} color="#2196F3" />
//               <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
//               <Text style={styles.statLabel}>Remaining</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="chatbubble-outline" size={20} color="#25D366" />
//               <Text style={styles.statValue}>{participantCount}</Text>
//               <Text style={styles.statLabel}>In Chat</Text>
//             </View>
            
//             <View style={styles.statItem}>
//               <Ionicons name="checkmark-done-outline" size={20} color={hasPendingClaims ? "#FF5722" : "#4CAF50"} />
//               <Text style={styles.statValue}>{pendingClaimsCount}</Text>
//               <Text style={styles.statLabel}>Pending Claims</Text>
//             </View>
//           </View>
          
//           {/* Connection status indicator */}
//           <View style={[styles.pendingClaimsWarning, { borderLeftColor: isPusherConnectedRef.current ? '#4CAF50' : '#FF5722' }]}>
//             <Ionicons 
//               name={isPusherConnectedRef.current ? "wifi" : "wifi-outline"} 
//               size={18} 
//               color={isPusherConnectedRef.current ? "#4CAF50" : "#FF5722"} 
//             />
//             <Text style={[styles.pendingClaimsWarningText, { color: isPusherConnectedRef.current ? '#4CAF50' : '#FF5722' }]}>
//               {isPusherConnectedRef.current ? 'Real-time connected' : 'Real-time disconnected - pull to refresh'}
//             </Text>
//           </View>
          
//           {hasPendingClaims && (
//             <View style={styles.pendingClaimsWarning}>
//               <Ionicons name="warning-outline" size={18} color="#FF5722" />
//               <Text style={styles.pendingClaimsWarningText}>
//                 {pendingClaimsCount} pending claim{pendingClaimsCount !== 1 ? 's' : ''}. Number calling is disabled until resolved.
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.winnersButtonContainer}>
//           <TouchableOpacity
//             style={styles.winnersButton}
//             onPress={() => navigation.navigate("HostGameWinners", {
//               gameId: gameId,
//               gameName: gameName,
//             })}
//           >
//             <Ionicons name="trophy-outline" size={24} color="#FFF" />
//             <Text style={styles.winnersButtonText}>Show Winners</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Manual call card */}
//         {isInitialized && (
//           <Animated.View style={[
//             styles.manualCallCard,
//             { transform: [{ scale: manualButtonAnim }] },
//             hasPendingClaims && styles.disabledCard
//           ]}>
//             <View style={styles.manualCallHeader}>
//               <Ionicons name="hand-right" size={24} color={hasPendingClaims ? "#999" : "#FF4081"} />
//               <Text style={[styles.manualCallTitle, hasPendingClaims && styles.disabledText]}>
//                 Manual Number Calling
//               </Text>
//             </View>
            
//             <Text style={[styles.manualCallDescription, hasPendingClaims && styles.disabledText]}>
//               Call the next number manually. This will call a random uncalled number.
//             </Text>
            
//             <View style={styles.manualCallInfo}>
//               <View style={styles.manualCallInfoItem}>
//                 <Ionicons name="information-circle" size={16} color={hasPendingClaims ? "#999" : "#2196F3"} />
//                 <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
//                   Available: {90 - calledNumbers.length} numbers
//                 </Text>
//               </View>
//               <View style={styles.manualCallInfoItem}>
//                 <Ionicons name="power" size={16} color={hasPendingClaims ? "#999" : (isRunning && !isPaused ? "#4CAF50" : "#FF9800")} />
//                 <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
//                   Auto Mode: {isRunning && !isPaused ? 'Active' : 'Inactive'}
//                 </Text>
//               </View>
//             </View>
            
//             <TouchableOpacity
//               style={[
//                 styles.manualCallButton,
//                 (callingManual || hasPendingClaims) && styles.manualCallButtonDisabled,
//                 (isRunning && !isPaused) && styles.manualCallButtonActive
//               ]}
//               onPress={hasPendingClaims ? () => {
//                 Alert.alert(
//                   "Pending Claims",
//                   `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before calling more numbers.`,
//                   [
//                     { text: "View Claims", onPress: navigateToClaimRequests },
//                     { text: "OK", style: "default" }
//                   ]
//                 );
//               } : callNextNumberManually}
//               disabled={callingManual || hasPendingClaims}
//             >
//               {callingManual ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="megaphone" size={22} color="#FFF" />
//                   <Text style={styles.manualCallButtonText}>
//                     {hasPendingClaims ? "Pending Claims (Disabled)" : "Call Next Number Now"}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
            
//             <Text style={[styles.manualCallHint, hasPendingClaims && styles.disabledText]}>
//               {hasPendingClaims 
//                 ? `Number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
//                 : (isRunning && !isPaused 
//                   ? "Manual calls will override the auto timer temporarily."
//                   : "Use this to call numbers when auto calling is paused.")}
//             </Text>
//           </Animated.View>
//         )}

//         {/* Auto mode controls */}
//         {!isInitialized ? (
//           <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
//             <View style={styles.controlHeader}>
//               <Ionicons name="play-circle-outline" size={24} color={hasPendingClaims ? "#999" : "#666"} />
//               <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
//                 Initialize Number Calling
//               </Text>
//             </View>
//             <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
//               Initialize the number calling system to start calling numbers automatically.
//             </Text>
//             <TouchableOpacity
//               style={[
//                 styles.controlButton,
//                 (initializing || hasPendingClaims) && styles.controlButtonDisabled
//               ]}
//               onPress={hasPendingClaims ? () => {
//                 Alert.alert(
//                   "Pending Claims",
//                   `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before initializing number calling.`,
//                   [
//                     { text: "View Claims", onPress: navigateToClaimRequests },
//                     { text: "OK", style: "default" }
//                   ]
//                 );
//               } : initializeNumberCalling}
//               disabled={initializing || hasPendingClaims}
//             >
//               {initializing ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="rocket-outline" size={18} color="#FFF" />
//                   <Text style={styles.controlButtonText}>
//                     {hasPendingClaims ? "Pending Claims" : "Initialize System"}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         ) : isRunning && !isPaused ? (
//           <Animated.View style={[
//             styles.controlCard,
//             { transform: [{ scale: pulseAnim }] },
//             hasPendingClaims && styles.disabledCard
//           ]}>
//             <View style={styles.controlHeader}>
//               <Ionicons name="radio" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
//               <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
//                 Auto Number Calling Active
//               </Text>
//             </View>
//             <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
//               {hasPendingClaims 
//                 ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
//                 : "Auto number calling is running. Numbers are being called automatically."}
//             </Text>
            
//             {renderIntervalSlider()}
            
//             <TouchableOpacity
//               style={[styles.controlButton, styles.pauseButton, (pausing || hasPendingClaims) && styles.controlButtonDisabled]}
//               onPress={hasPendingClaims ? () => {
//                 Alert.alert(
//                   "Pending Claims",
//                   `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before pausing.`,
//                   [
//                     { text: "View Claims", onPress: navigateToClaimRequests },
//                     { text: "OK", style: "default" }
//                   ]
//                 );
//               } : pauseNumberCalling}
//               disabled={pausing || hasPendingClaims}
//             >
//               {pausing ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="pause-circle" size={18} color="#FFF" />
//                   <Text style={styles.controlButtonText}>
//                     {hasPendingClaims ? "Claims Pending" : "Pause Auto Calling"}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </Animated.View>
//         ) : isPaused ? (
//           <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
//             <View style={styles.controlHeader}>
//               <Ionicons name="pause-circle" size={24} color={hasPendingClaims ? "#999" : "#FF9800"} />
//               <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
//                 Auto Number Calling Paused
//               </Text>
//             </View>
//             <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
//               {hasPendingClaims 
//                 ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
//                 : "Auto number calling is currently paused. Tap resume to continue."}
//             </Text>
            
//             {renderIntervalSlider()}
            
//             <TouchableOpacity
//               style={[styles.controlButton, styles.resumeButton, (resuming || hasPendingClaims) && styles.controlButtonDisabled]}
//               onPress={hasPendingClaims ? () => {
//                 Alert.alert(
//                   "Pending Claims",
//                   `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before resuming.`,
//                   [
//                     { text: "View Claims", onPress: navigateToClaimRequests },
//                     { text: "OK", style: "default" }
//                   ]
//                 );
//               } : resumeNumberCalling}
//               disabled={resuming || hasPendingClaims}
//             >
//               {resuming ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="play-circle" size={18} color="#FFF" />
//                   <Text style={styles.controlButtonText}>
//                     {hasPendingClaims ? "Claims Pending" : "Resume Auto Calling"}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
//             <View style={styles.controlHeader}>
//               <Ionicons name="play-circle" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
//               <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
//                 Start Auto Number Calling
//               </Text>
//             </View>
//             <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
//               {hasPendingClaims 
//                 ? `Auto number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
//                 : "Start automatic number calling with configured intervals."}
//             </Text>
            
//             {renderIntervalSlider()}
            
//             <TouchableOpacity
//               style={[
//                 styles.controlButton,
//                 styles.startButton,
//                 (startingAutoMode || hasPendingClaims) && styles.controlButtonDisabled
//               ]}
//               onPress={hasPendingClaims ? () => {
//                 Alert.alert(
//                   "Pending Claims",
//                   `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before starting.`,
//                   [
//                     { text: "View Claims", onPress: navigateToClaimRequests },
//                     { text: "OK", style: "default" }
//                   ]
//                 );
//               } : startAutoNumberCalling}
//               disabled={startingAutoMode || hasPendingClaims}
//             >
//               {startingAutoMode ? (
//                 <ActivityIndicator size="small" color="#FFF" />
//               ) : (
//                 <>
//                   <Ionicons name="play" size={18} color="#FFF" />
//                   <Text style={styles.controlButtonText}>
//                     {hasPendingClaims ? "Claims Pending" : "Start Auto Calling"}
//                   </Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}

//         {renderLastCalledSection()}

//         <View style={styles.numbersSection}>
//           <View style={styles.sectionHeader}>
//             <Ionicons name="grid" size={24} color="#333" />
//             <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
//             <View style={styles.sectionBadge}>
//               <Text style={styles.sectionBadgeText}>
//                 {calledNumbers.length}/90 called
//               </Text>
//             </View>
//           </View>
          
//           {renderNumberGrid()}
          
//           <Text style={styles.numbersHint}>
//             Called numbers are highlighted in green.
//           </Text>
//         </View>

//         <View style={styles.actionsSection}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate("HostTicketRequests", {
//               gameId: gameId,
//               gameName: gameName,
//             })}
//           >
//             <Ionicons name="ticket-outline" size={20} color="#FFF" />
//             <Text style={styles.actionButtonText}>Ticket Requests</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.actionButton, styles.secondaryAction]}
//             onPress={() => navigation.navigate("HostGameUsers", {
//               gameId: gameId,
//               gameName: gameName,
//             })}
//           >
//             <Ionicons name="people-outline" size={20} color="#FFF" />
//             <Text style={styles.actionButtonText}>Players List</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.actionButton, styles.tertiaryAction]}
//             onPress={navigateToCalledNumbers}
//           >
//             <Ionicons name="list-outline" size={20} color="#FFF" />
//             <Text style={styles.actionButtonText}>Called Numbers</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.refreshHint}>
//           <Ionicons name="arrow-down" size={14} color="#9CA3AF" />
//           <Text style={styles.refreshHintText}>Pull down to refresh</Text>
//         </View>
//       </ScrollView>

//       <TouchableOpacity
//         style={styles.floatingChatButton}
//         onPress={joinChat}
//         activeOpacity={0.8}
//       >
//         <View style={styles.chatButtonContent}>
//           <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
//           {participantCount > 0 && (
//             <View style={styles.chatBadge}>
//               <Text style={styles.chatBadgeText}>
//                 {participantCount > 99 ? '99+' : participantCount}
//               </Text>
//             </View>
//           )}
//         </View>
//         <Text style={styles.chatButtonText}>
//           {isChatJoined ? 'Live Chat' : 'Join Chat'}
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     backgroundColor: "#3498db",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: Platform.OS === 'ios' ? 20 : 20,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFF",
//     marginBottom: 2,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "rgba(255,255,255,0.9)",
//     fontWeight: "500",
//   },
//   headerButtons: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   headerActionButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },
//   endGameButton: {
//     backgroundColor: "#FF5722",
//   },
//   endGameButtonText: {
//     color: "#FFF",
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   claimRequestsButton: {
//     backgroundColor: "rgba(255,255,255,0.2)",
//   },
//   claimBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "#FF5722",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#3498db",
//   },
//   claimBadgeText: {
//     color: "#FFF",
//     fontSize: 10,
//     fontWeight: 'bold',
//     paddingHorizontal: 4,
//   },
//   snackbarOverlay: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'flex-end',
//     paddingBottom: 80,
//   },
//   snackbarContainer: {
//     backgroundColor: '#FF9800',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   snackbarText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '600',
//     flex: 1,
//   },
//   snackbarActionText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginLeft: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#666",
//     fontWeight: "500",
//   },
//   statusCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   statusHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     gap: 12,
//   },
//   statusTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#333",
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusBadgeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     textTransform: "uppercase",
//   },
//   statsGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     flexWrap: "wrap",
//     marginBottom: 10,
//   },
//   statItem: {
//     alignItems: "center",
//     width: "25%",
//     marginBottom: 10,
//   },
//   statValue: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#333",
//     marginTop: 8,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: "#666",
//     fontWeight: "500",
//     marginTop: 4,
//     textAlign: "center",
//   },
//   pendingClaimsWarning: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFEBEE",
//     padding: 12,
//     borderRadius: 10,
//     borderLeftWidth: 4,
//     borderLeftColor: "#FF5722",
//     marginTop: 10,
//     gap: 10,
//   },
//   pendingClaimsWarningText: {
//     fontSize: 13,
//     color: "#D32F2F",
//     fontWeight: "500",
//     flex: 1,
//   },
//   winnersButtonContainer: {
//     marginHorizontal: 20,
//     marginBottom: 16,
//   },
//   winnersButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FF9800",
//     paddingVertical: 16,
//     borderRadius: 12,
//     gap: 10,
//     shadowColor: "#FF9800",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   winnersButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   manualCallCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: "#FF4081",
//     shadowColor: "#FF4081",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   disabledCard: {
//     borderColor: "#E0E0E0",
//     shadowColor: "#9E9E9E",
//     opacity: 0.8,
//   },
//   manualCallHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     gap: 12,
//   },
//   manualCallTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#333",
//     flex: 1,
//   },
//   disabledText: {
//     color: "#999",
//   },
//   manualCallDescription: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   manualCallInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     padding: 12,
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   manualCallInfoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   manualCallInfoText: {
//     fontSize: 13,
//     color: "#666",
//     fontWeight: "500",
//   },
//   manualCallButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FF4081",
//     paddingVertical: 16,
//     borderRadius: 12,
//     gap: 10,
//     shadowColor: "#FF4081",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   manualCallButtonActive: {
//     backgroundColor: "#E91E63",
//     borderWidth: 2,
//     borderColor: "#FFF",
//   },
//   manualCallButtonDisabled: {
//     backgroundColor: "#BDBDBD",
//     opacity: 0.7,
//   },
//   manualCallButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   manualCallHint: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     textAlign: "center",
//     marginTop: 12,
//     fontStyle: "italic",
//   },
//   controlCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   controlHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     gap: 12,
//   },
//   controlTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//   },
//   controlDescription: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   controlButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#3498db",
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 8,
//   },
//   startButton: {
//     backgroundColor: "#4CAF50",
//   },
//   pauseButton: {
//     backgroundColor: "#FF5722",
//   },
//   resumeButton: {
//     backgroundColor: "#4CAF50",
//   },
//   controlButtonDisabled: {
//     backgroundColor: "#BDBDBD",
//     opacity: 0.7,
//   },
//   controlButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   sliderContainer: {
//     marginVertical: 10,
//   },
//   sliderDisabled: {
//     opacity: 0.5,
//   },
//   sliderTrackWrapper: {
//     height: 50,
//     justifyContent: 'center',
//     position: 'relative',
//   },
//   sliderTrack: {
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 3,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   sliderFill: {
//     position: 'absolute',
//     height: 6,
//     backgroundColor: '#3498db',
//     borderRadius: 3,
//   },
//   sliderTouchArea: {
//     position: 'absolute',
//     top: -20,
//     left: 0,
//     right: 0,
//     bottom: -20,
//     backgroundColor: 'transparent',
//   },
//   sliderThumb: {
//     position: 'absolute',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: '#3498db',
//     borderWidth: 3,
//     borderColor: '#FFF',
//     top: -9,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   sliderThumbActive: {
//     transform: [{ scale: 1.1 }],
//     backgroundColor: '#1E6AB1',
//   },
//   sliderThumbDisabled: {
//     backgroundColor: '#9CA3AF',
//   },
//   sliderLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     paddingHorizontal: 2,
//   },
//   sliderLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   sliderValueLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#3498db',
//   },
//   intervalContainer: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   intervalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 10,
//   },
//   intervalTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//   },
//   intervalBadge: {
//     backgroundColor: "#E6F0FF",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   intervalBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#3498db",
//   },
//   sliderSpeedLabels: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 4,
//   },
//   sliderSpeedLabel: {
//     fontSize: 12,
//     color: "#666",
//     fontWeight: "500",
//   },
//   updateIntervalButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#9C27B0",
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 8,
//     marginTop: 16,
//   },
//   updateIntervalButtonDisabled: {
//     backgroundColor: "#BDBDBD",
//     opacity: 0.7,
//   },
//   updateIntervalButtonText: {
//     color: "#FFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   lastCalledCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   lastCalledHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 12,
//   },
//   lastCalledTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//   },
//   lastNumberContainer: {
//     alignItems: "center",
//     backgroundColor: "#F3F0FF",
//     padding: 30,
//     borderRadius: 20,
//     marginBottom: 16,
//     borderWidth: 3,
//     borderColor: "#7E57C2",
//   },
//   lastNumber: {
//     fontSize: 72,
//     fontWeight: "900",
//     color: "#7E57C2",
//     textShadowColor: "rgba(0,0,0,0.1)",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   calledSequence: {
//     marginTop: 8,
//   },
//   calledSequenceTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#666",
//     marginBottom: 8,
//   },
//   calledSequenceNumbers: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 12,
//   },
//   sequenceNumber: {
//     backgroundColor: "#E6F0FF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     minWidth: 40,
//     alignItems: "center",
//   },
//   sequenceNumberText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#3498db",
//   },
//   loadMoreButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F0F9FF",
//     paddingVertical: 10,
//     borderRadius: 8,
//     gap: 6,
//     borderWidth: 1,
//     borderColor: "#E6F0FF",
//   },
//   loadMoreText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#3498db",
//   },
//   numbersSection: {
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     gap: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#333",
//     flex: 1,
//   },
//   sectionBadge: {
//     backgroundColor: "#E6F0FF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   sectionBadgeText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#3498db",
//   },
//   numberGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     justifyContent: "center",
//   },
//   numberCell: {
//     width: (width - 80) / 10,
//     height: (width - 80) / 10,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   calledNumberCell: {
//     backgroundColor: "#4CAF50",
//     borderColor: "#388E3C",
//     shadowColor: "#4CAF50",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   numberText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//   },
//   calledNumberText: {
//     color: "#FFF",
//     fontWeight: "700",
//   },
//   numbersHint: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     textAlign: "center",
//     marginTop: 16,
//     fontStyle: "italic",
//   },
//   actionsSection: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//     paddingHorizontal: 20,
//     marginTop: 8,
//   },
//   actionButton: {
//     flex: 1,
//     minWidth: "30%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#9C27B0",
//     paddingVertical: 14,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     gap: 8,
//     shadowColor: "#9C27B0",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   secondaryAction: {
//     backgroundColor: "#FF9800",
//   },
//   tertiaryAction: {
//     backgroundColor: "#2196F3",
//   },
//   actionButtonText: {
//     color: "#FFF",
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   refreshHint: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//     marginBottom: 10,
//     gap: 6,
//   },
//   refreshHintText: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     fontStyle: "italic",
//   },
//   floatingChatButton: {
//     position: 'absolute',
//     bottom: 80,
//     right: 20,
//     backgroundColor: '#075E54',
//     borderRadius: 50,
//     width: 140,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//     borderWidth: 2,
//     borderColor: '#FFF',
//   },
//   chatButtonContent: {
//     position: 'relative',
//     marginRight: 8,
//   },
//   chatBadge: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#FFF',
//   },
//   chatBadgeText: {
//     color: '#FFF',
//     fontSize: 10,
//     fontWeight: 'bold',
//     paddingHorizontal: 4,
//   },
//   chatButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 4,
//   },
// });

// export default HostGameRoom;




import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Animated,
  RefreshControl,
  Modal,
  Platform,
  AppState,
} from "react-native";
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

// Custom Snackbar Component - Non-blocking
const CustomSnackbar = ({ visible, message, onDismiss, action }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={styles.snackbarAbsoluteContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.snackbarContainer,
          { transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.snackbarText}>{message}</Text>
        {action && (
          <TouchableOpacity onPress={action.onPress}>
            <Text style={styles.snackbarActionText}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

// Fixed Smooth Slider Component
const SmoothSlider = ({ 
  value, 
  onValueChange, 
  min = 8, 
  max = 15, 
  step = 1,
  disabled = false 
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.Value(0)).current;
  const valueRef = useRef(value);

  // Update ref when value changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Update thumb position when value changes externally
  useEffect(() => {
    if (!isDragging && sliderWidth > 0) {
      const percentage = (value - min) / (max - min);
      Animated.spring(pan, {
        toValue: percentage * sliderWidth,
        useNativeDriver: false,
        friction: 7,
        tension: 40,
      }).start();
    }
  }, [value, sliderWidth, isDragging]);

  const handleLayout = (event) => {
    const newWidth = event.nativeEvent.layout.width;
    setSliderWidth(newWidth);
    const percentage = (value - min) / (max - min);
    pan.setValue(percentage * newWidth);
  };

  const calculateValueFromPosition = (x) => {
    const percentage = Math.max(0, Math.min(1, x / sliderWidth));
    const range = max - min;
    const rawValue = min + (percentage * range);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleStartShouldSetResponder = () => !disabled;
  const handleMoveShouldSetResponder = () => !disabled;

  const handleResponderGrant = (evt) => {
    setIsDragging(true);
    const { locationX } = evt.nativeEvent;
    const newValue = calculateValueFromPosition(locationX);
    onValueChange(newValue);
    pan.setValue(locationX);
  };

  const handleResponderMove = (evt) => {
    const { locationX } = evt.nativeEvent;
    const clampedX = Math.max(0, Math.min(sliderWidth, locationX));
    const newValue = calculateValueFromPosition(clampedX);
    onValueChange(newValue);
    pan.setValue(clampedX);
  };

  const handleResponderRelease = () => {
    setIsDragging(false);
  };

  const handleResponderTerminate = () => {
    setIsDragging(false);
  };

  // For preset buttons
  const handlePresetPress = (newValue) => {
    if (disabled) return;
    onValueChange(newValue);
    if (sliderWidth > 0) {
      const percentage = (newValue - min) / (max - min);
      Animated.spring(pan, {
        toValue: percentage * sliderWidth,
        useNativeDriver: false,
        friction: 7,
        tension: 40,
      }).start();
    }
  };

  return (
    <View style={[styles.sliderContainer, disabled && styles.sliderDisabled]}>
      {/* Current Value Display */}
      <View style={styles.sliderValueContainer}>
        <Text style={styles.sliderValueLabel}>{value} seconds</Text>
      </View>

      {/* Slider Track */}
      <View 
        style={styles.sliderTrackContainer}
        onLayout={handleLayout}
      >
        <View style={styles.sliderTrack}>
          <Animated.View 
            style={[
              styles.sliderFill,
              {
                width: pan.interpolate({
                  inputRange: [0, sliderWidth],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }
            ]} 
          />
        </View>

        {/* Thumb */}
        <Animated.View
          style={[
            styles.sliderThumb,
            isDragging && styles.sliderThumbActive,
            {
              transform: [
                {
                  translateX: pan.interpolate({
                    inputRange: [0, sliderWidth],
                    outputRange: [0, sliderWidth],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.sliderThumbInner} />
        </Animated.View>

        {/* Touchable area */}
        <View
          style={styles.sliderTouchArea}
          onStartShouldSetResponder={handleStartShouldSetResponder}
          onMoveShouldSetResponder={handleMoveShouldSetResponder}
          onResponderGrant={handleResponderGrant}
          onResponderMove={handleResponderMove}
          onResponderRelease={handleResponderRelease}
          onResponderTerminate={handleResponderTerminate}
        />
      </View>

      {/* Min/Max Labels */}
      <View style={styles.sliderMinMax}>
        <Text style={styles.sliderMinMaxText}>{min}s</Text>
        <Text style={styles.sliderMinMaxText}>{max}s</Text>
      </View>

      {/* Quick Select Buttons */}
      <View style={styles.quickSelectContainer}>
        <TouchableOpacity
          style={[styles.quickSelectButton, value === 8 && styles.quickSelectButtonActive]}
          onPress={() => handlePresetPress(8)}
          disabled={disabled}
        >
          <Text style={[styles.quickSelectText, value === 8 && styles.quickSelectTextActive]}>8s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickSelectButton, value === 10 && styles.quickSelectButtonActive]}
          onPress={() => handlePresetPress(10)}
          disabled={disabled}
        >
          <Text style={[styles.quickSelectText, value === 10 && styles.quickSelectTextActive]}>10s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickSelectButton, value === 12 && styles.quickSelectButtonActive]}
          onPress={() => handlePresetPress(12)}
          disabled={disabled}
        >
          <Text style={[styles.quickSelectText, value === 12 && styles.quickSelectTextActive]}>12s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickSelectButton, value === 15 && styles.quickSelectButtonActive]}
          onPress={() => handlePresetPress(15)}
          disabled={disabled}
        >
          <Text style={[styles.quickSelectText, value === 15 && styles.quickSelectTextActive]}>15s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HostGameRoom = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [numberCallingStatus, setNumberCallingStatus] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [startingAutoMode, setStartingAutoMode] = useState(false);
  const [pausing, setPausing] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [callingManual, setCallingManual] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(10);
  const [updatingInterval, setUpdatingInterval] = useState(false);
  const [endingGame, setEndingGame] = useState(false);
  const [hasAppliedInterval, setHasAppliedInterval] = useState(false);
  const [isInitializationComplete, setIsInitializationComplete] = useState(false);
  
  // Live Chat States
  const [participantCount, setParticipantCount] = useState(0);
  const [isChatJoined, setIsChatJoined] = useState(false);
  
  // Pending Claims States
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [claims, setClaims] = useState([]);
  
  // Snackbar States
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // App State for foreground/background detection
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Pusher Refs
  const pusherRef = useRef(null);
  const gameChannelRef = useRef(null);
  const adminChannelRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Reconnection Refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 10;
  
  // Queue for missed events during disconnection
  const missedEventsQueueRef = useRef([]);
  const processingQueueRef = useRef(false);
  const isPusherConnectedRef = useRef(false);

  // Refs for latest values
  const calledNumbersRef = useRef([]);
  const numberCallingStatusRef = useRef(null);
  const pendingClaimsRef = useRef(0);
  const fetchGameStatusTimeoutRef = useRef(null);
  const autoModeWasRunningRef = useRef(false);
  
  // Auto-start retry ref
  const autoStartRetryTimeoutRef = useRef(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const manualButtonAnim = useRef(new Animated.Value(1)).current;

  // Handle App State changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log(`[Game ${gameId}] App came to foreground - refreshing data`);
        handleAppForeground();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, gameId]);

  // Set hasAppliedInterval when initialization is complete
  useEffect(() => {
    if (numberCallingStatus?.auto_mode && intervalSeconds) {
      setHasAppliedInterval(true);
      setIsInitializationComplete(true);
      console.log(`[Game ${gameId}] ✅ Initialization confirmed, interval applied:`, intervalSeconds);
    }
  }, [numberCallingStatus, intervalSeconds]);

  // Handle app coming to foreground
  const handleAppForeground = async () => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] 📱 App in foreground - checking connections`);
    
    try {
      const pusher = Pusher.getInstance();
      if (!isPusherConnectedRef.current) {
        await reconnectPusher();
      }
      
      await fetchGameStatus();
      await fetchPendingClaimsCount();
      await checkChatStatus();
      
      processMissedEventsQueue();
    } catch (error) {
      console.log(`[Game ${gameId}] Error in handleAppForeground:`, error);
    }
  };

  // Update refs when state changes
  useEffect(() => {
    calledNumbersRef.current = calledNumbers;
  }, [calledNumbers]);

  useEffect(() => {
    numberCallingStatusRef.current = numberCallingStatus;
  }, [numberCallingStatus]);

  useEffect(() => {
    pendingClaimsRef.current = pendingClaimsCount;
  }, [pendingClaimsCount]);

  // Set mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (autoStartRetryTimeoutRef.current) {
        clearTimeout(autoStartRetryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => { 
    const initializeApp = async () => {
      try {
        await initializePusher();
        await fetchInitialData();
        startPulseAnimation();
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.log(`[Game ${gameId}] Error initializing app:`, error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    initializeApp();
    
    return () => {
      console.log(`[Game ${gameId}] Cleaning up...`);
      cleanupPusher();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
    };
  }, [gameId]);

  // Initialize Pusher with better connection handling
  const initializePusher = async () => {
    try {
      console.log(`[Game ${gameId}] Initializing Pusher...`);
      
      const pusher = Pusher.getInstance();
      
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`[Game ${gameId}] Connection state changed from ${previousState} to ${currentState}`);
          
          if (currentState === 'CONNECTED') {
            console.log(`[Game ${gameId}] ✅ Connected successfully`);
            isPusherConnectedRef.current = true;
            reconnectAttemptsRef.current = 0;
            
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
            
            processMissedEventsQueue();
          }
          
          if (currentState === 'DISCONNECTED' && isMountedRef.current) {
            console.log(`[Game ${gameId}] ❌ Disconnected, will attempt to reconnect...`);
            isPusherConnectedRef.current = false;
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`[Game ${gameId}] Pusher error: ${message}`, error);
          isPusherConnectedRef.current = false;
          if (isMountedRef.current) {
            scheduleReconnection();
          }
        }
      });
      
      await pusher.connect();
      
      const gameChannel = await pusher.subscribe({
        channelName: `game.${gameId}`,
        onEvent: (event) => {
          if (isMountedRef.current) {
            handleGameEvent(event);
          }
        }
      });
      gameChannelRef.current = gameChannel;
      
      const adminChannel = await pusher.subscribe({
        channelName: `admin.game.${gameId}`,
        onEvent: (event) => {
          if (isMountedRef.current) {
            handleAdminEvent(event);
          }
        }
      });
      adminChannelRef.current = adminChannel;
      
      pusherRef.current = pusher;
      isPusherConnectedRef.current = true;
      
      console.log(`[Game ${gameId}] ✅ Pusher initialized successfully`);
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
      isPusherConnectedRef.current = false;
      if (isMountedRef.current) {
        scheduleReconnection();
      }
      throw error;
    }
  };

  // Process missed events queue
  const processMissedEventsQueue = async () => {
    if (processingQueueRef.current || missedEventsQueueRef.current.length === 0) {
      return;
    }
    
    processingQueueRef.current = true;
    console.log(`[Game ${gameId}] 📦 Processing ${missedEventsQueueRef.current.length} missed events`);
    
    const events = [...missedEventsQueueRef.current].sort((a, b) => {
      return (a.timestamp || 0) - (b.timestamp || 0);
    });
    
    missedEventsQueueRef.current = [];
    
    for (const event of events) {
      if (!isMountedRef.current) break;
      
      try {
        if (event.type === 'number.called') {
          await handleNumberCalled(event.data);
        } else if (event.type === 'calling.status.updated') {
          await handleStatusUpdated(event.data);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`[Game ${gameId}] Error processing missed event:`, error);
      }
    }
    
    processingQueueRef.current = false;
    
    if (isMountedRef.current) {
      await fetchGameStatus();
    }
  };

  // Handle game channel events with queueing
  const handleGameEvent = (event) => {
    console.log(`[Game ${gameId}] Game channel event: ${event.eventName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      if (data.game_id && data.game_id !== parseInt(gameId)) {
        console.log(`[Game ${gameId}] Ignoring event for game ${data.game_id}`);
        return;
      }
      
      if (!isPusherConnectedRef.current) {
        console.log(`[Game ${gameId}] Pusher disconnected, queueing event: ${event.eventName}`);
        missedEventsQueueRef.current.push({
          type: event.eventName,
          data: data,
          timestamp: Date.now()
        });
        return;
      }
      
      switch (event.eventName) {
        case 'number.called':
          handleNumberCalled(data);
          break;
        case 'calling.status.updated':
          handleStatusUpdated(data);
          break;
        case 'game.completed':
          handleGameCompleted(data);
          break;
        case 'claim.submitted':
          handleNewClaimSubmitted(data);
          break;
        case 'claim.approved':
        case 'claim.rejected':
          handleClaimProcessed(data);
          break;
        default:
          console.log(`[Game ${gameId}] Unhandled game event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling game event:`, error);
    }
  };

  // Handle admin channel events with queueing
  const handleAdminEvent = (event) => {
    console.log(`[Game ${gameId}] Admin channel event: ${event.eventName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      if (data.game_id && data.game_id !== parseInt(gameId)) {
        console.log(`[Game ${gameId}] Ignoring admin event for game ${data.game_id}`);
        return;
      }
      
      if (!isPusherConnectedRef.current) {
        console.log(`[Game ${gameId}] Pusher disconnected, queueing admin event: ${event.eventName}`);
        missedEventsQueueRef.current.push({
          type: event.eventName,
          data: data,
          timestamp: Date.now()
        });
        return;
      }
      
      switch (event.eventName) {
        case 'number.called':
          handleNumberCalled(data);
          break;
        case 'calling.status.updated':
          handleStatusUpdated(data);
          break;
        case 'game.completed':
          handleGameCompleted(data);
          break;
        case 'claim.submitted':
          handleNewClaimSubmitted(data);
          break;
        case 'claim.approved':
        case 'claim.rejected':
          handleClaimProcessed(data);
          break;
        default:
          console.log(`[Game ${gameId}] Unhandled admin event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling admin event:`, error);
    }
  };

  // Handle number called event - improved
  const handleNumberCalled = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] 📞 Processing number called event:`, data);
    
    try {
      const number = data.number;
      const totalCalled = data.total_called;
      const sorted = data.sorted_numbers || [];
      
      console.log(`[Game ${gameId}] New number: ${number}, Total called: ${totalCalled}`);
      
      setCalledNumbers(prev => {
        if (!prev.includes(number)) {
          const updated = [...prev, number];
          console.log(`[Game ${gameId}] Called numbers updated: ${prev.length} → ${updated.length}`);
          return updated;
        }
        console.log(`[Game ${gameId}] Number ${number} already exists, skipping`);
        return prev;
      });
      
      setSortedNumbers(sorted);
      
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus(false);
        }
      }, 1000);
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling number called event:`, error);
    }
  };

  // Handle status updated event
  const handleStatusUpdated = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] Processing status updated event:`, data);
    
    try {
      const newStatus = {
        auto_mode: data.auto_mode || false,
        is_running: data.is_running || false,
        is_paused: data.is_paused || false,
        interval_seconds: data.interval_seconds || data.interval || 10,
        total_calls: data.total_calls || 0,
        next_call_in: data.next_call_in,
        next_call_at: data.next_call_at,
        status: data.status,
        started_at: data.started_at,
        paused_at: data.paused_at,
        resumed_at: data.resumed_at,
        stopped_at: data.stopped_at,
      };
      
      setNumberCallingStatus(newStatus);
      
      if (data.interval_seconds && data.interval_seconds !== intervalSeconds) {
        setIntervalSeconds(data.interval_seconds);
        // If we receive interval from server, mark as applied
        setHasAppliedInterval(true);
      }
      
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus(false);
        }
      }, 500);
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error handling status updated event:`, error);
    }
  };

  // Handle new claim submitted event
  const handleNewClaimSubmitted = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] 📝 New claim submitted event:`, data);
    
    const claimData = data.claim || data;
    
    setPendingClaimsCount(prevCount => prevCount + 1);
    
    setClaims(prevClaims => {
      const exists = prevClaims.some(claim => claim.id === claimData.id);
      if (exists) return prevClaims;
      
      const newClaim = {
        id: claimData.id,
        user_name: claimData.user_name,
        pattern_name: claimData.pattern_name || claimData.reward_name,
        winning_amount: claimData.winning_amount || "100.00",
        time_since_claim: "Just now",
        can_process: true
      };
      
      return [newClaim, ...prevClaims];
    });
    
    showSnackbar(`📝 New claim from ${claimData.user_name || 'player'}!`);
    
    if (numberCallingStatusRef.current?.is_running && !numberCallingStatusRef.current?.is_paused) {
      console.log(`[Game ${gameId}] ⏸️ Auto-calling paused due to new claim`);
      autoModeWasRunningRef.current = true;
      pauseNumberCallingAutomatically();
    }
  };

  // Handle claim processed event
  const handleClaimProcessed = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] ✅ Claim processed event:`, data);
    
    const claimData = data.claim || data;
    
    setPendingClaimsCount(prevCount => {
      const newCount = Math.max(0, prevCount - 1);
      console.log(`[Game ${gameId}] Pending claims count: ${prevCount} → ${newCount}`);
      
      if (newCount === 0 && autoModeWasRunningRef.current) {
        autoModeWasRunningRef.current = false;
      }
      
      return newCount;
    });
    
    setClaims(prevClaims => {
      const filtered = prevClaims.filter(claim => claim.id !== claimData.id);
      console.log(`[Game ${gameId}] Claims list: ${prevClaims.length} → ${filtered.length}`);
      return filtered;
    });
    
    setTimeout(() => {
      if (isMountedRef.current) {
        fetchPendingClaimsCount();
      }
    }, 500);
  };

  // Handle game completed event
  const handleGameCompleted = (data) => {
    if (!isMountedRef.current) return;
    
    console.log(`[Game ${gameId}] Processing game completed event:`, data);
    
    Alert.alert(
      "🎉 Game Completed",
      `${data.game_name} has been completed!\nTotal Numbers: ${data.total_numbers}`,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          }
        }
      ]
    );
  };

  // Schedule reconnection with exponential backoff
  const scheduleReconnection = () => {
    if (!isMountedRef.current) return;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(`[Game ${gameId}] Max reconnection attempts reached`);
      Alert.alert(
        "Connection Issue",
        "Unable to maintain real-time connection. Please pull down to refresh.",
        [{ text: "OK" }]
      );
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    
    console.log(`[Game ${gameId}] Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        reconnectPusher();
      }
    }, delay);
  };

  // Reconnect function
  const reconnectPusher = async () => {
    try {
      console.log(`[Game ${gameId}] Attempting to reconnect Pusher...`);
      
      reconnectAttemptsRef.current += 1;
      
      await cleanupPusher();
      
      if (isMountedRef.current) {
        await initializePusher();
        await fetchGameStatus();
        await fetchPendingClaimsCount();
        
        reconnectAttemptsRef.current = 0;
      }
      
    } catch (error) {
      console.log(`[Game ${gameId}] Reconnection failed:`, error);
      if (isMountedRef.current) {
        scheduleReconnection();
      }
    }
  };

  // Cleanup Pusher connections
  const cleanupPusher = async () => {
    console.log(`[Game ${gameId}] Cleaning up Pusher...`);
    
    try {
      const pusher = Pusher.getInstance();
      
      if (gameChannelRef.current) {
        await pusher.unsubscribe({ channelName: `game.${gameId}` });
        gameChannelRef.current = null;
      }
      if (adminChannelRef.current) {
        await pusher.unsubscribe({ channelName: `admin.game.${gameId}` });
        adminChannelRef.current = null;
      }
      
      console.log(`[Game ${gameId}] Pusher cleaned up`);
    } catch (error) {
      console.log(`[Game ${gameId}] Error cleaning up Pusher:`, error);
    }
  };

  // Custom Snackbar functions
  const showSnackbar = (message) => {
    if (!isMountedRef.current) return;
    
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setSnackbarVisible(false);
      }
    }, 3000);
  };

  const fetchInitialData = async () => {
    await Promise.all([
      fetchGameStatus(),
      checkChatStatus(),
      fetchPendingClaimsCount(),
    ]);
  };

  const pauseNumberCallingAutomatically = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        fetchGameStatus();
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error automatically pausing number calling:`, error);
    }
  };

  const checkChatStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        setParticipantCount(response.data.total_participants || 0);
        const tokenData = await AsyncStorage.getItem("host");
        if (tokenData) {
          const host = JSON.parse(tokenData);
          const participants = response.data.data || [];
          const isParticipant = Array.isArray(participants) ? participants.some(p => p.id === host.id) : false;
          setIsChatJoined(isParticipant);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error checking chat status:`, error);
    }
  };

  const fetchPendingClaimsCount = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        const previousCount = pendingClaimsCount;
        const newCount = response.data.data?.summary?.total_pending || 0;
        const newClaims = response.data.data?.claims || [];
        
        console.log(`[Game ${gameId}] 📊 Pending claims fetched: ${previousCount} → ${newCount}`);
        
        setPendingClaimsCount(newCount);
        setClaims(newClaims);
        
        if (newCount > previousCount) {
          const message = `📝 ${newCount - previousCount} new claim${newCount - previousCount > 1 ? 's' : ''} submitted!`;
          showSnackbar(message);
          
          if (numberCallingStatusRef.current?.is_running && !numberCallingStatusRef.current?.is_paused) {
            autoModeWasRunningRef.current = true;
            pauseNumberCallingAutomatically();
          }
        }
        
        if (newCount < previousCount) {
          console.log(`[Game ${gameId}] ✅ ${previousCount - newCount} claims processed`);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pending claims count:`, error);
      if (isMountedRef.current) {
        setPendingClaimsCount(0);
        setClaims([]);
      }
    }
  };

  const endGame = async () => {
    Alert.alert(
      "End Game",
      "Are you sure you want to end this game? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Game",
          style: "destructive",
          onPress: async () => {
            try {
              setEndingGame(true);
              const token = await AsyncStorage.getItem("hostToken");
              
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/host/game/${gameId}/complete`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success && isMountedRef.current) {
                Alert.alert(
                  "Success",
                  "Game ended successfully!",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.goBack();
                        if (navigation.getParent()) {
                          navigation.getParent().navigate('HostDashboard');
                        }
                      }
                    }
                  ]
                );
              } else {
                throw new Error(response.data.message || "Failed to end game");
              }
            } catch (error) {
              console.log(`[Game ${gameId}] Error ending game:`, error);
              if (isMountedRef.current) {
                Alert.alert(
                  "Error",
                  error.response?.data?.message || error.message || "Failed to end game"
                );
              }
            } finally {
              if (isMountedRef.current) {
                setEndingGame(false);
              }
            }
          },
        },
      ]
    );
  };

  const joinChat = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/games/${gameId}/chat/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        setIsChatJoined(true);
        setParticipantCount(response.data.participant_count || 1);
        navigation.navigate('HostLiveChat', {
          gameId,
          gameName,
          participantCount: response.data.participant_count || 1
        });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error joining chat:`, error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchGameStatus(),
      checkChatStatus(),
      fetchPendingClaimsCount(),
    ]);
    
    if (!isPusherConnectedRef.current) {
      await reconnectPusher();
    }
    
    if (isMountedRef.current) {
      setRefreshing(false);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startManualButtonAnimation = () => {
    Animated.sequence([
      Animated.timing(manualButtonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(manualButtonAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(manualButtonAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Improved fetchGameStatus
  const fetchGameStatus = async (showLoading = true) => {
    if (!isMountedRef.current) return;
    
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      console.log(`[Game ${gameId}] 🔍 Fetching game status...`);
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        const data = response.data.data;
        
        setGameStatus(data.game);
        
        const callingStatus = {
          auto_mode: data.calling?.auto_mode || false,
          is_running: data.calling?.is_running || false,
          is_paused: data.calling?.is_paused || false,
          interval_seconds: data.calling?.interval_seconds || 10,
          total_calls: data.calling?.total_calls || 0,
          next_call_in: data.calling?.next_call_in_seconds || data.calling?.next_call_in,
          next_call_at: data.calling?.next_call_at,
          status: data.calling?.status,
          started_at: data.calling?.started_at,
          paused_at: data.calling?.paused_at,
          resumed_at: data.calling?.resumed_at,
          stopped_at: data.calling?.stopped_at,
        };
        
        setNumberCallingStatus(callingStatus);
        
        // If auto_mode is true, mark as initialized and interval applied
        if (callingStatus.auto_mode) {
          setIsInitializationComplete(true);
          if (callingStatus.interval_seconds) {
            setHasAppliedInterval(true);
          }
        }
        
        const newCalledNumbers = data.numbers?.called_numbers || [];
        const currentCalledNumbers = calledNumbersRef.current;
        
        const missedNumbers = newCalledNumbers.filter(num => !currentCalledNumbers.includes(num));
        if (missedNumbers.length > 0) {
          console.log(`[Game ${gameId}] Found ${missedNumbers.length} missed numbers:`, missedNumbers);
          setCalledNumbers(newCalledNumbers);
        } else if (JSON.stringify(currentCalledNumbers) !== JSON.stringify(newCalledNumbers)) {
          setCalledNumbers(newCalledNumbers);
        }
        
        setSortedNumbers(data.numbers?.sorted_numbers || []);
        
        if (data.calling?.interval_seconds) {
          setIntervalSeconds(data.calling.interval_seconds);
        }
        
        console.log(`[Game ${gameId}] ✅ Game status fetched successfully`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error fetching game status:`, error);
    }
  };

  const callNextNumberManually = async () => {
    try {
      setCallingManual(true);
      startManualButtonAnimation();
      
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/call-next`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        await fetchGameStatus();
      } else {
        throw new Error("Failed to call next number");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error calling next number:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to call next number"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setCallingManual(false);
      }
    }
  };

  // Improved initializeNumberCalling function
  const initializeNumberCalling = async () => {
    try {
      setInitializing(true);
      console.log(`[Game ${gameId}] 🚀 Initializing number calling...`);
      
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/initialize`,
        { interval_seconds: 10 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data.success && isMountedRef.current) {
        // Set interval first
        setIntervalSeconds(10);
        
        // Update status with all necessary flags
        setNumberCallingStatus(prev => ({
          ...prev,
          auto_mode: true,
          interval_seconds: 10,
          is_running: false,
          is_paused: false
        }));
        
        // Mark initialization as complete and interval as applied
        setIsInitializationComplete(true);
        setHasAppliedInterval(true);
        
        // Fetch fresh status
        await fetchGameStatus();
        
        console.log(`[Game ${gameId}] ✅ Number calling initialized successfully`);
        
        // Show success message
        Alert.alert(
          "Success",
          "Number calling system initialized. You can now start auto calling.",
          [{ text: "OK" }]
        );
      } else {
        throw new Error("Failed to initialize number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to initialize number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setInitializing(false);
      }
    }
  };

  const updateIntervalSeconds = async () => {
    try {
      setUpdatingInterval(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.put(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/interval`,
        { interval_seconds: intervalSeconds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        await fetchGameStatus();
        setHasAppliedInterval(true);
        Alert.alert("Success", "Interval updated successfully");
      } else {
        throw new Error("Failed to update interval");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error updating interval:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to update interval"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setUpdatingInterval(false);
      }
    }
  };

  // Improved startAutoNumberCalling with better state handling
  const startAutoNumberCalling = async () => {
    // Double-check if we can start
    if (!hasAppliedInterval) {
      Alert.alert(
        "Apply Interval First",
        "Please apply your desired interval before starting auto number calling.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    if (hasPendingClaims) {
      Alert.alert(
        "Pending Claims",
        `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before starting.`,
        [
          { text: "View Claims", onPress: navigateToClaimRequests },
          { text: "OK", style: "default" }
        ]
      );
      return;
    }

    try {
      setStartingAutoMode(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      console.log(`[Game ${gameId}] 🚀 Attempting to start auto number calling...`);
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/start-auto`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data.success && isMountedRef.current) {
        console.log(`[Game ${gameId}] ✅ Auto number calling started successfully`);
        
        // Immediately update local state to reflect running status
        setNumberCallingStatus(prev => ({
          ...prev,
          is_running: true,
          is_paused: false
        }));
        
        await fetchGameStatus();
        
        if (autoStartRetryTimeoutRef.current) {
          clearTimeout(autoStartRetryTimeoutRef.current);
        }
        
        // Verify the start was successful
        autoStartRetryTimeoutRef.current = setTimeout(async () => {
          if (isMountedRef.current) {
            await fetchGameStatus();
            const currentStatus = numberCallingStatusRef.current;
            if (!currentStatus?.is_running || currentStatus?.is_paused) {
              console.log(`[Game ${gameId}] Auto start verification failed, retrying...`);
              if (isMountedRef.current && !startingAutoMode) {
                startAutoNumberCalling();
              }
            }
          }
        }, 2000);
        
      } else {
        throw new Error(response.data.message || "Failed to start auto number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error starting auto number calling:`, error);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.log(`[Game ${gameId}] Request timeout, checking status...`);
        setTimeout(async () => {
          if (isMountedRef.current) {
            await fetchGameStatus();
            const currentStatus = numberCallingStatusRef.current;
            if (!currentStatus?.is_running || currentStatus?.is_paused) {
              Alert.alert(
                "Error",
                "Request timed out. Please check if auto calling started and try again."
              );
            }
          }
        }, 3000);
      } else {
        if (isMountedRef.current) {
          Alert.alert(
            "Error",
            error.response?.data?.message || error.message || "Failed to start auto number calling"
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        setStartingAutoMode(false);
      }
    }
  };

  const pauseNumberCalling = async () => {
    try {
      setPausing(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        // Immediately update local state
        setNumberCallingStatus(prev => ({
          ...prev,
          is_paused: true
        }));
        await fetchGameStatus();
      } else {
        throw new Error("Failed to pause number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error pausing number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to pause number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setPausing(false);
      }
    }
  };

  const resumeNumberCalling = async () => {
    try {
      setResuming(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/resume`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success && isMountedRef.current) {
        // Immediately update local state
        setNumberCallingStatus(prev => ({
          ...prev,
          is_paused: false
        }));
        await fetchGameStatus();
      } else {
        throw new Error("Failed to resume number calling");
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error resuming number calling:`, error);
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          error.response?.data?.message || error.message || "Failed to resume number calling"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setResuming(false);
      }
    }
  };

  const navigateToCalledNumbers = () => {
    navigation.navigate("HostCalledNumbers", {
      gameId: gameId,
      gameName: gameName,
      calledNumbers: calledNumbers,
      sortedNumbers: sortedNumbers,
    });
  };

  const navigateToClaimRequests = () => {
    navigation.navigate("HostClaimRequests", {
      gameId: gameId,
      gameName: gameName,
    });
  };

  const hasPendingClaims = pendingClaimsCount > 0;

  const renderNumberGrid = () => {
    const numbers = [];
    for (let i = 1; i <= 90; i++) {
      const isCalled = calledNumbers.includes(i);
      
      numbers.push(
        <View
          key={i}
          style={[
            styles.numberCell,
            isCalled && styles.calledNumberCell,
          ]}
        >
          <Text style={[
            styles.numberText,
            isCalled && styles.calledNumberText
          ]}>
            {i}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.numberGrid}>
        {numbers}
      </View>
    );
  };

  const renderLastCalledSection = () => {
    if (calledNumbers.length === 0) return null;
    
    const lastFive = [...calledNumbers].slice(-5).reverse();
    
    return (
      <View style={styles.lastCalledCard}>
        <View style={styles.lastCalledHeader}>
          <Ionicons name="megaphone-outline" size={24} color="#9C27B0" />
          <Text style={styles.lastCalledTitle}>Last Called Number</Text>
        </View>
        
        <View style={styles.lastNumberContainer}>
          <Text style={styles.lastNumber}>
            {calledNumbers[calledNumbers.length - 1]}
          </Text>
        </View>
        
        <View style={styles.calledSequence}>
          <Text style={styles.calledSequenceTitle}>Recently Called:</Text>
          <View style={styles.calledSequenceNumbers}>
            {lastFive.map((num, index) => (
              <View
                key={`${num}-${index}`}
                style={styles.sequenceNumber}
              >
                <Text style={styles.sequenceNumberText}>{num}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={navigateToCalledNumbers}
          >
            <Text style={styles.loadMoreText}>View All Called Numbers</Text>
            <Ionicons name="chevron-forward" size={16} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // UseFocusEffect to refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log(`[Game ${gameId}] 📱 Screen focused - refreshing data`);
      
      const refreshOnFocus = async () => {
        await fetchGameStatus();
        await fetchPendingClaimsCount();
        await checkChatStatus();
        
        if (!isPusherConnectedRef.current) {
          await reconnectPusher();
        }
      };
      
      refreshOnFocus();
      
      return () => {
        console.log(`[Game ${gameId}] 📱 Screen unfocused`);
      };
    }, [gameId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading Game Room...</Text>
      </View>
    );
  }

  const isInitialized = numberCallingStatus?.auto_mode || false;
  const isRunning = numberCallingStatus?.is_running || false;
  const isPaused = numberCallingStatus?.is_paused || false;

  console.log(`[Game ${gameId}] 🎨 Rendering with state:`, {
    isInitialized,
    isRunning,
    isPaused,
    hasPendingClaims,
    calledNumbersCount: calledNumbers.length,
    pusherConnected: isPusherConnectedRef.current,
    hasAppliedInterval,
    isInitializationComplete
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />

      <CustomSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'VIEW',
          onPress: navigateToClaimRequests,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{gameName}</Text>
          <Text style={styles.headerSubtitle}>Game Room</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerActionButton, styles.claimRequestsButton]}
            onPress={navigateToClaimRequests}
          >
            <MaterialCommunityIcons name="clipboard-text-clock" size={22} color="#FFF" />
            {pendingClaimsCount > 0 && (
              <View style={styles.claimBadge}>
                <Text style={styles.claimBadgeText}>
                  {pendingClaimsCount > 99 ? '99+' : pendingClaimsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerActionButton, styles.endGameButton]}
            onPress={endGame}
            disabled={endingGame}
          >
            {endingGame ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <MaterialCommunityIcons name="flag-checkered" size={22} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3498db"
            colors={["#3498db"]}
            progressViewOffset={20}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons name="broadcast" size={24} color="#2196F3" />
            <Text style={styles.statusTitle}>Game Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: gameStatus?.status === 'live' ? '#4CAF5015' : '#FF980015' }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: gameStatus?.status === 'live' ? '#4CAF50' : '#FF9800' }
              ]}>
                {gameStatus?.status?.toUpperCase() || 'LOADING'}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="ticket-outline" size={20} color="#9C27B0" />
              <Text style={styles.statValue}>{calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Called</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="grid-outline" size={20} color="#2196F3" />
              <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#25D366" />
              <Text style={styles.statValue}>{participantCount}</Text>
              <Text style={styles.statLabel}>In Chat</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="alert-outline" size={20} color={hasPendingClaims ? "#FF5722" : "#4CAF50"} />
              <Text style={styles.statValue}>{pendingClaimsCount}</Text>
              <Text style={styles.statLabel}>Pending Claims</Text>
            </View>
          </View>
          
          {hasPendingClaims && (
            <View style={styles.pendingClaimsWarning}>
              <Ionicons name="warning-outline" size={18} color="#FF5722" />
              <Text style={styles.pendingClaimsWarningText}>
                {pendingClaimsCount} pending claim{pendingClaimsCount !== 1 ? 's' : ''}. Number calling is disabled until resolved.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.winnersButtonContainer}>
          <TouchableOpacity
            style={styles.winnersButton}
            onPress={() => navigation.navigate("HostGameWinners", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="trophy-outline" size={24} color="#FFF" />
            <Text style={styles.winnersButtonText}>Show Winners</Text>
          </TouchableOpacity>
        </View>

        {/* Manual call card */}
        {isInitialized && (
          <Animated.View style={[
            styles.manualCallCard,
            { transform: [{ scale: manualButtonAnim }] },
            hasPendingClaims && styles.disabledCard
          ]}>
            <View style={styles.manualCallHeader}>
              <Ionicons name="hand-right" size={24} color={hasPendingClaims ? "#999" : "#FF4081"} />
              <Text style={[styles.manualCallTitle, hasPendingClaims && styles.disabledText]}>
                Manual Number Calling
              </Text>
            </View>
            
            <Text style={[styles.manualCallDescription, hasPendingClaims && styles.disabledText]}>
              Call the next number manually. This will call a random uncalled number.
            </Text>
            
            <View style={styles.manualCallInfo}>
              <View style={styles.manualCallInfoItem}>
                <Ionicons name="information-circle" size={16} color={hasPendingClaims ? "#999" : "#2196F3"} />
                <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
                  Available: {90 - calledNumbers.length} numbers
                </Text>
              </View>
              <View style={styles.manualCallInfoItem}>
                <Ionicons name="power" size={16} color={hasPendingClaims ? "#999" : (isRunning && !isPaused ? "#4CAF50" : "#FF9800")} />
                <Text style={[styles.manualCallInfoText, hasPendingClaims && styles.disabledText]}>
                  Auto Mode: {isRunning && !isPaused ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.manualCallButton,
                (callingManual || hasPendingClaims) && styles.manualCallButtonDisabled,
                (isRunning && !isPaused) && styles.manualCallButtonActive
              ]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before calling more numbers.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : callNextNumberManually}
              disabled={callingManual || hasPendingClaims}
            >
              {callingManual ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="megaphone" size={22} color="#FFF" />
                  <Text style={styles.manualCallButtonText}>
                    {hasPendingClaims ? "Pending Claims (Disabled)" : "Call Next Number Now"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.manualCallHint, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : (isRunning && !isPaused 
                  ? "Manual calls will override the auto timer temporarily."
                  : "Use this to call numbers when auto calling is paused.")}
            </Text>
          </Animated.View>
        )}

        {/* Auto mode controls */}
        {!isInitialized ? (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="play-circle-outline" size={24} color={hasPendingClaims ? "#999" : "#666"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Initialize Number Calling
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              Initialize the number calling system to start calling numbers automatically.
            </Text>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (initializing || hasPendingClaims) && styles.controlButtonDisabled
              ]}
              onPress={hasPendingClaims ? () => {
                Alert.alert(
                  "Pending Claims",
                  `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before initializing number calling.`,
                  [
                    { text: "View Claims", onPress: navigateToClaimRequests },
                    { text: "OK", style: "default" }
                  ]
                );
              } : initializeNumberCalling}
              disabled={initializing || hasPendingClaims}
            >
              {initializing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="rocket-outline" size={18} color="#FFF" />
                  <Text style={styles.controlButtonText}>
                    {hasPendingClaims ? "Pending Claims" : "Initialize System"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : isRunning && !isPaused ? (
          <Animated.View style={[
            styles.controlCard,
            { transform: [{ scale: pulseAnim }] },
            hasPendingClaims && styles.disabledCard
          ]}>
            <View style={styles.controlHeader}>
              <Ionicons name="radio" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Auto Number Calling Active
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Auto number calling is running. Numbers are being called automatically."}
            </Text>
            
            {/* Interval Slider without outer box */}
            <SmoothSlider
              value={intervalSeconds}
              onValueChange={setIntervalSeconds}
              min={8}
              max={15}
              step={1}
              disabled={updatingInterval || hasPendingClaims}
            />
            
            {/* Two equal width buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.pauseButton,
                  (pausing || hasPendingClaims) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before pausing.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : pauseNumberCalling}
                disabled={pausing || hasPendingClaims}
              >
                {pausing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="pause-circle" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>Pause</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.applyButton,
                  (updatingInterval || hasPendingClaims) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before updating interval.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : updateIntervalSeconds}
                disabled={updatingInterval || hasPendingClaims}
              >
                {updatingInterval ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>Apply</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : isPaused ? (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="pause-circle" size={24} color={hasPendingClaims ? "#999" : "#FF9800"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Auto Number Calling Paused
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is paused due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Auto number calling is currently paused. Tap resume to continue."}
            </Text>
            
            {/* Interval Slider without outer box */}
            <SmoothSlider
              value={intervalSeconds}
              onValueChange={setIntervalSeconds}
              min={8}
              max={15}
              step={1}
              disabled={updatingInterval || hasPendingClaims}
            />
            
            {/* Two equal width buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.resumeButton,
                  (resuming || hasPendingClaims) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before resuming.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : resumeNumberCalling}
                disabled={resuming || hasPendingClaims}
              >
                {resuming ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="play-circle" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>Resume</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.applyButton,
                  (updatingInterval || hasPendingClaims) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before updating interval.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : updateIntervalSeconds}
                disabled={updatingInterval || hasPendingClaims}
              >
                {updatingInterval ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>Apply</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.controlCard, hasPendingClaims && styles.disabledCard]}>
            <View style={styles.controlHeader}>
              <Ionicons name="play-circle" size={24} color={hasPendingClaims ? "#999" : "#4CAF50"} />
              <Text style={[styles.controlTitle, hasPendingClaims && styles.disabledText]}>
                Start Auto Number Calling
              </Text>
            </View>
            <Text style={[styles.controlDescription, hasPendingClaims && styles.disabledText]}>
              {hasPendingClaims 
                ? `Auto number calling is disabled due to ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}.`
                : "Start automatic number calling with configured intervals."}
            </Text>
            
            {/* Interval Slider without outer box */}
            <SmoothSlider
              value={intervalSeconds}
              onValueChange={setIntervalSeconds}
              min={8}
              max={15}
              step={1}
              disabled={updatingInterval || hasPendingClaims}
            />
            
            {/* Two equal width buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.applyButton,
                  (updatingInterval || hasPendingClaims) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before updating interval.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : updateIntervalSeconds}
                disabled={updatingInterval || hasPendingClaims}
              >
                {updatingInterval ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>Apply</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.halfButton,
                  styles.startButton,
                  (startingAutoMode || hasPendingClaims || !hasAppliedInterval) && styles.controlButtonDisabled
                ]}
                onPress={hasPendingClaims ? () => {
                  Alert.alert(
                    "Pending Claims",
                    `You have ${pendingClaimsCount} pending claim${pendingClaimsCount !== 1 ? 's' : ''}. Please resolve all claims before starting.`,
                    [
                      { text: "View Claims", onPress: navigateToClaimRequests },
                      { text: "OK", style: "default" }
                    ]
                  );
                } : (!hasAppliedInterval ? () => {
                  Alert.alert(
                    "Apply Interval First",
                    "Please apply your desired interval before starting auto number calling.",
                    [{ text: "OK", style: "default" }]
                  );
                } : startAutoNumberCalling)}
                disabled={startingAutoMode || hasPendingClaims || !hasAppliedInterval}
              >
                {startingAutoMode ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="play" size={18} color="#FFF" />
                    <Text style={styles.controlButtonText}>
                      {!hasAppliedInterval ? "Apply First" : "Start"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Hint to apply interval first */}
            {!hasAppliedInterval && !hasPendingClaims && (
              <Text style={styles.applyHint}>
                👆 Apply your interval first to enable auto calling
              </Text>
            )}
          </View>
        )}

        {renderLastCalledSection()}

        <View style={styles.numbersSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid" size={24} color="#333" />
            <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>
                {calledNumbers.length}/90 called
              </Text>
            </View>
          </View>
          
          {renderNumberGrid()}
          
          <Text style={styles.numbersHint}>
            Called numbers are highlighted in green.
          </Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("HostTicketRequests", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="ticket-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Ticket Requests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => navigation.navigate("HostGameUsers", {
              gameId: gameId,
              gameName: gameName,
            })}
          >
            <Ionicons name="people-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Players List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.tertiaryAction]}
            onPress={navigateToCalledNumbers}
          >
            <Ionicons name="list-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Called Numbers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.refreshHint}>
          <Ionicons name="arrow-down" size={14} color="#9CA3AF" />
          <Text style={styles.refreshHintText}>Pull down to refresh</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={joinChat}
        activeOpacity={0.8}
      >
        <View style={styles.chatButtonContent}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
          {participantCount > 0 && (
            <View style={styles.chatBadge}>
              <Text style={styles.chatBadgeText}>
                {participantCount > 99 ? '99+' : participantCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.chatButtonText}>
          {isChatJoined ? 'Live Chat' : 'Join Chat'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#3498db",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  endGameButton: {
    backgroundColor: "#FF5722",
  },
  claimRequestsButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  claimBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5722",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  claimBadgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  snackbarOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: 80,
  },
  snackbarAbsoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  snackbarContainer: {
    backgroundColor: '#FF9800',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  snackbarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  snackbarActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
    width: "25%",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  pendingClaimsWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5722",
    marginTop: 10,
    gap: 10,
  },
  pendingClaimsWarningText: {
    fontSize: 13,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
  },
  winnersButtonContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  winnersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9800",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  winnersButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  manualCallCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#FF4081",
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  disabledCard: {
    borderColor: "#E0E0E0",
    shadowColor: "#9E9E9E",
    opacity: 0.8,
  },
  manualCallHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  manualCallTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  disabledText: {
    color: "#999",
  },
  manualCallDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  manualCallInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  manualCallInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  manualCallInfoText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  manualCallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4081",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#FF4081",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  manualCallButtonActive: {
    backgroundColor: "#E91E63",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  manualCallButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  manualCallButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  manualCallHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  controlCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  controlDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF5722",
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
  },
  applyButton: {
    backgroundColor: "#9C27B0",
  },
  controlButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  controlButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Button row for two equal buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  halfButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },

  // Smooth Slider Styles
  sliderContainer: {
    marginVertical: 10,
  },
  sliderDisabled: {
    opacity: 0.5,
  },
  sliderValueContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  sliderValueLabel: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3498db',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 30,
    overflow: 'hidden',
  },
  sliderTrackContainer: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderFill: {
    position: 'absolute',
    height: 8,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#3498db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    top: 10,
    marginLeft: -15,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.2 }],
    borderColor: '#1E6AB1',
  },
  sliderThumbInner: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: '#3498db',
    margin: 2,
  },
  sliderTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  sliderMinMax: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
  },
  sliderMinMaxText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 5,
  },
  quickSelectButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickSelectButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  quickSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  quickSelectTextActive: {
    color: '#FFF',
  },
  intervalContainer: {
    marginVertical: 10,
  },
  updateIntervalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  updateIntervalButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.7,
  },
  updateIntervalButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  applyHint: {
    fontSize: 13,
    color: '#9C27B0',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  lastCalledCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  lastCalledHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  lastCalledTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  lastNumberContainer: {
    alignItems: "center",
    backgroundColor: "#F3F0FF",
    padding: 30,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#7E57C2",
  },
  lastNumber: {
    fontSize: 72,
    fontWeight: "900",
    color: "#7E57C2",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  calledSequence: {
    marginTop: 8,
  },
  calledSequenceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  calledSequenceNumbers: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  sequenceNumber: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  sequenceNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E6F0FF",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3498db",
  },
  numbersSection: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3498db",
  },
  numberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  numberCell: {
    width: (width - 80) / 10,
    height: (width - 80) / 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  calledNumberCell: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  calledNumberText: {
    color: "#FFF",
    fontWeight: "700",
  },
  numbersHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  actionsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryAction: {
    backgroundColor: "#FF9800",
  },
  tertiaryAction: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  refreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 6,
  },
  refreshHintText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#075E54',
    borderRadius: 50,
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatButtonContent: {
    position: 'relative',
    marginRight: 8,
  },
  chatBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default HostGameRoom;
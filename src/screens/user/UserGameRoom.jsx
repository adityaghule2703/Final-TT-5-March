// import React, { useState, useEffect, useRef } from "react";
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
//   RefreshControl,
//   Modal,
//   Animated,
//   Easing,
//   Platform,
//   useWindowDimensions,
//   AppState,
//   Alert,
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
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Sound from "react-native-sound";
// import Tts from "react-native-tts";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // Parameters from TicketsScreen
// const NUM_COLUMNS = 9;
// const CELL_MARGIN = 2;
// const TICKET_PADDING = 8;
// const HORIZONTAL_MARGIN = 10;

// // Calculation from TicketsScreen
// const CELL_WIDTH = 
//   (SCREEN_WIDTH - 
//    HORIZONTAL_MARGIN * 2 - 
//    TICKET_PADDING * 2 - 
//    CELL_MARGIN * 2 * NUM_COLUMNS) / 
//   NUM_COLUMNS;

// // Updated color scheme
// const PRIMARY_COLOR = "#4facfe";
// const ACCENT_COLOR = "#ff9800";
// const BACKGROUND_COLOR = "#f5f8ff";
// const WHITE = "#FFFFFF";
// const TEXT_DARK = "#333333";
// const TEXT_LIGHT = "#777777";
// const BORDER_COLOR = "#EEEEEE";
// const SUCCESS_COLOR = "#4CAF50";
// const ERROR_COLOR = "#E74C3C";
// const WARNING_ORANGE = "#ff9800";
// const UNMARKED_CELL_COLOR = "#62cff4";
// const MARKED_CELL_COLOR = "#E74C3C";

// // Cell colors for different states
// const ROW_COLOR_1 = "#f0f8ff";
// const ROW_COLOR_2 = "#e6f3ff";
// const FILLED_CELL_BG = UNMARKED_CELL_COLOR;
// const CELL_BORDER_COLOR = PRIMARY_COLOR;
// const NUMBER_COLOR = WHITE;
// const EMPTY_CELL_BG = "transparent";
// const MARKED_CELL_BG = MARKED_CELL_COLOR;
// const MARKED_CELL_BORDER = "#C0392B";

// // Pattern sequence for sorting
// const PATTERN_SEQUENCE = [
//   { keywords: ['top line', 'topline', 'top-line'] },
//   { keywords: ['middle line', 'middleline', 'middle-line'] },
//   { keywords: ['bottom line', 'bottomline', 'bottom-line'] },
//   { keywords: ['breakfast'] },
//   { keywords: ['lunch'] },
//   { keywords: ['dinner'] },
//   { keywords: ['four corners', '4 corners', 'fourcorners'] },
//   { keywords: ['bamboo'] },
//   { keywords: ['early five', 'early 5', 'earlyfive'] },
//   { keywords: ['non claimers', 'nonclaimers', 'non-claimers'] },
//   { keywords: ['full house', 'fullhouse'] }
// ];

// // Helper function to sort patterns by sequence
// const sortPatternsBySequence = (patterns) => {
//   if (!patterns || patterns.length === 0) return patterns;
  
//   const getPatternIndex = (pattern) => {
//     const patternName = (pattern.display_name || pattern.pattern_name || pattern.reward_name || '').toLowerCase();
    
//     for (let i = 0; i < PATTERN_SEQUENCE.length; i++) {
//       if (PATTERN_SEQUENCE[i].keywords.some(keyword => patternName.includes(keyword))) {
//         return i;
//       }
//     }
//     return PATTERN_SEQUENCE.length;
//   };

//   return [...patterns].sort((a, b) => {
//     const aIndex = getPatternIndex(a);
//     const bIndex = getPatternIndex(b);
//     return aIndex - bIndex;
//   });
// };

// const UserGameRoom = ({ navigation, route }) => {
//   const { gameId, gameName } = route.params;
//   const { width, height } = useWindowDimensions();
//   const isLandscape = width > height;
  
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [gameStatus, setGameStatus] = useState(null);
//   const [callingStatus, setCallingStatus] = useState(null);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [myTickets, setMyTickets] = useState([]);
//   const [isChatJoined, setIsChatJoined] = useState(false);
//   const [participantCount, setParticipantCount] = useState(0);
//   const [markingLoading, setMarkingLoading] = useState(false);
//   const [voiceType, setVoiceType] = useState('female');
//   const [showVoiceModal, setShowVoiceModal] = useState(false);
//   const [showGameEndModal, setShowGameEndModal] = useState(false);
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [claims, setClaims] = useState([]);
//   const [initialClaimsFetched, setInitialClaimsFetched] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [patternRewards, setPatternRewards] = useState([]);
//   const [submittingClaim, setSubmittingClaim] = useState(false);
//   const [showWinningCelebration, setShowWinningCelebration] = useState(false);
//   const [winningMessage, setWinningMessage] = useState('');
//   const [winningUser, setWinningUser] = useState('');
//   const [winningAmount, setWinningAmount] = useState(0);
//   const [winningPattern, setWinningPattern] = useState('');
  
//   const [patternsByTicket, setPatternsByTicket] = useState({});
//   const [totalPatternCounts, setTotalPatternCounts] = useState({});
//   const [processingCells, setProcessingCells] = useState(new Set());
  
//   const [showPatternsModal, setShowPatternsModal] = useState(false);
//   const [availablePatterns, setAvailablePatterns] = useState([]);
//   const [menuPatterns, setMenuPatterns] = useState([]);
//   const [loadingPatterns, setLoadingPatterns] = useState(false);
//   const [selectedPatternForView, setSelectedPatternForView] = useState(null);
  
//   const [blinkingPattern, setBlinkingPattern] = useState(null);
//   const [blinkingCells, setBlinkingCells] = useState({});
//   const [blinkingAnimations, setBlinkingAnimations] = useState({});
  
//   const [clickSound, setClickSound] = useState(null);
  
//   const [voices, setVoices] = useState({ male: null, female: null });
//   const [voiceLoading, setVoiceLoading] = useState(true);
  
//   // Custom Snackbar state
//   const [snackbarVisible, setSnackbarVisible] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarType, setSnackbarType] = useState('info');
  
//   // App State for foreground/background detection
//   const [appState, setAppState] = useState(AppState.currentState);
  
//   // Pusher Refs
//   const pusherRef = useRef(null);
//   const gameChannelRef = useRef(null);
//   const isMountedRef = useRef(true);
  
//   // Reconnection Refs
//   const reconnectAttemptsRef = useRef(0);
//   const reconnectTimeoutRef = useRef(null);
//   const maxReconnectAttempts = 10;
  
//   // Queue for missed events during disconnection
//   const missedEventsQueueRef = useRef([]);
//   const processingQueueRef = useRef(false);
//   const isPusherConnectedRef = useRef(false);
  
//   // Refs for latest values to avoid stale closures
//   const calledNumbersRef = useRef([]);
//   const claimsRef = useRef([]);
//   const announcedNumbersRef = useRef(new Set()); // Track announced numbers to avoid re-announcing
  
//   // Other refs
//   const lastCalledRef = useRef(null);
//   const confettiAnimation = useRef(new Animated.Value(0)).current;
//   const menuRefs = useRef([]);
//   const lastApprovedClaimRef = useRef(null);
//   const audioEnabled = useRef(true);
//   const blinkingIntervals = useRef({});
//   const blinkingTimeouts = useRef({});
//   const gameEndShownRef = useRef(false);
//   const announcedClaimIds = useRef(new Set());
//   const isSubmittingClaimRef = useRef(false);
//   const snackbarTimeout = useRef(null);
//   const fetchGameStatusTimeoutRef = useRef(null);
  
//   // Animation refs
//   const celebrationOpacity = useRef(new Animated.Value(0)).current;
//   const celebrationScale = useRef(new Animated.Value(0.5)).current;
//   const celebrationTranslateY = useRef(new Animated.Value(50)).current;
//   const [updateTrigger, setUpdateTrigger] = useState(0);
//   const confettiTranslateY = useRef([]);

//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const shineAnim = useRef(new Animated.Value(0)).current;

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
//       await fetchCalledNumbers();
//       await fetchMyTickets();
//       await fetchClaims();
      
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
//     claimsRef.current = claims;
//   }, [claims]);

//   // Set mounted ref
//   useEffect(() => {
//     isMountedRef.current = true;
    
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   // Initialize app and Pusher
//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         await initializeTTS();
//         startAnimations();
//         await loadSounds();
//         await initializePusher();
//         await fetchInitialData();
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       } catch (error) {
//         console.log("Error initializing app:", error);
//         showSnackbar("Failed to initialize. Please try again.", 'error');
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       }
//     };
    
//     initializeApp();
    
//     return () => {
//       cleanupPusher();
//       Tts.stop();
      
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
      
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
      
//       if (clickSound) {
//         clickSound.release();
//       }
      
//       Object.values(blinkingIntervals.current).forEach(interval => {
//         if (interval && interval.animation && interval.animation.stop) {
//           interval.animation.stop();
//         }
//       });
      
//       Object.values(blinkingTimeouts.current).forEach(timeout => {
//         if (timeout) clearTimeout(timeout);
//       });
      
//       if (snackbarTimeout.current) {
//         clearTimeout(snackbarTimeout.current);
//       }
      
//       stopConfettiAnimation();
//       stopWinningCelebration();
//       stopAllBlinking();
//     };
//   }, [gameId]);

//   // Initialize Pusher with auto-reconnection
//   const initializePusher = async () => {
//     try {
//       console.log(`[Game ${gameId}] 📱 Initializing Pusher for user game`);
      
//       const pusher = Pusher.getInstance();
      
//       await pusher.init({
//         apiKey: '9c1d16690beded57332a',
//         cluster: 'ap2',
//         forceTLS: true,
//         activityTimeout: 30000,
//         pongTimeout: 30000,
//         onConnectionStateChange: (currentState, previousState) => {
//           console.log(`[Game ${gameId}] 🔌 Connection state: ${previousState} → ${currentState}`);
          
//           if (currentState === 'CONNECTED') {
//             console.log(`[Game ${gameId}] ✅ Connected to Pusher`);
//             isPusherConnectedRef.current = true;
//             reconnectAttemptsRef.current = 0;
//             if (reconnectTimeoutRef.current) {
//               clearTimeout(reconnectTimeoutRef.current);
//               reconnectTimeoutRef.current = null;
//             }
//             processMissedEventsQueue();
//           }
          
//           if (currentState === 'DISCONNECTED' && isMountedRef.current) {
//             console.log(`[Game ${gameId}] ❌ Disconnected, scheduling reconnection...`);
//             isPusherConnectedRef.current = false;
//             scheduleReconnection();
//           }
//         },
//         onError: (message, code, error) => {
//           console.log(`[Game ${gameId}] ❌ Pusher error: ${message}`, error);
//           isPusherConnectedRef.current = false;
//           scheduleReconnection();
//         },
//       });
      
//       await pusher.connect();
//       console.log(`[Game ${gameId}] 🚀 Pusher connected`);
      
//       const gameChannel = await pusher.subscribe({
//         channelName: `game.${gameId}`,
//         onEvent: (event) => {
//           if (isMountedRef.current) {
//             handlePusherEvent(event);
//           }
//         }
//       });
//       gameChannelRef.current = gameChannel;
      
//       pusherRef.current = pusher;
//       isPusherConnectedRef.current = true;
//       console.log(`[Game ${gameId}] ✅ Pusher initialized successfully`);
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
//       isPusherConnectedRef.current = false;
//       scheduleReconnection();
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
//         } else if (event.type === 'game.completed') {
//           await handleGameCompleted(event.data);
//         } else if (event.type === 'claim.submitted') {
//           await handleClaimSubmitted(event.data);
//         } else if (event.type === 'claim.approved') {
//           await handleClaimApproved(event.data);
//         } else if (event.type === 'claim.rejected') {
//           await handleClaimRejected(event.data);
//         }
        
//         await new Promise(resolve => setTimeout(resolve, 100));
//       } catch (error) {
//         console.log(`[Game ${gameId}] Error processing missed event:`, error);
//       }
//     }
    
//     processingQueueRef.current = false;
    
//     if (isMountedRef.current) {
//       await fetchGameStatus();
//       await fetchCalledNumbers();
//       await fetchClaims();
//     }
//   };

//   const scheduleReconnection = () => {
//     if (reconnectTimeoutRef.current) {
//       clearTimeout(reconnectTimeoutRef.current);
//     }
    
//     if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
//       console.log(`[Game ${gameId}] ⚠️ Max reconnection attempts reached`);
//       showSnackbar("Connection issues. Please pull down to refresh.", 'warning');
//       return;
//     }
    
//     const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
//     console.log(`[Game ${gameId}] 🔄 Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
//     reconnectTimeoutRef.current = setTimeout(() => {
//       reconnectPusher();
//     }, delay);
//   };

//   const reconnectPusher = async () => {
//     try {
//       console.log(`[Game ${gameId}] 🔄 Attempting to reconnect Pusher...`);
//       reconnectAttemptsRef.current += 1;
      
//       await cleanupPusher();
//       await initializePusher();
      
//       reconnectAttemptsRef.current = 0;
//       console.log(`[Game ${gameId}] ✅ Reconnected successfully`);
//       await fetchInitialData();
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Reconnection failed:`, error);
//       scheduleReconnection();
//     }
//   };

//   const cleanupPusher = async () => {
//     if (pusherRef.current) {
//       try {
//         const pusher = Pusher.getInstance();
        
//         if (gameChannelRef.current) {
//           await pusher.unsubscribe({ channelName: `game.${gameId}` });
//           gameChannelRef.current = null;
//           console.log(`[Game ${gameId}] 📤 Unsubscribed from game channel`);
//         }
        
//         await pusher.disconnect();
//         console.log(`[Game ${gameId}] 🔌 Pusher disconnected`);
//       } catch (error) {
//         console.log(`[Game ${gameId}] ❌ Error cleaning up Pusher:`, error);
//       }
//     }
//   };

//   const handlePusherEvent = (event) => {
//     console.log(`[Game ${gameId}] 🔄 Processing event: ${event.eventName}`);
    
//     try {
//       const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
//       // If Pusher is not connected, queue the event
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
//           handleClaimSubmitted(data);
//           break;
//         case 'claim.approved':
//           handleClaimApproved(data);
//           break;
//         case 'claim.rejected':
//           handleClaimRejected(data);
//           break;
//         default:
//           console.log(`[Game ${gameId}] 📭 Unhandled event: ${event.eventName}`);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error handling Pusher event:`, error);
//     }
//   };

//   const handleNumberCalled = (data) => {
//     console.log(`[Game ${gameId}] 🔔 Processing number called event:`, data);
    
//     try {
//       const number = data.number;
//       const calledNumbersList = data.called_numbers || data.sorted_numbers || [];
      
//       console.log(`[Game ${gameId}] 🎲 New number called: ${number}`);
//       console.log(`[Game ${gameId}] 📊 Total called: ${calledNumbersList.length}`);
      
//       // Update called numbers with the full list from server
//       if (calledNumbersList.length > 0) {
//         setCalledNumbers(calledNumbersList);
        
//         // Check if this number hasn't been announced before
//         if (!announcedNumbersRef.current.has(number)) {
//           announcedNumbersRef.current.add(number);
          
//           if (audioEnabled.current) {
//             speakNumber(number);
//           }
          
//           if (number === 90) {
//             showSnackbar("Number 90 has been called! The game might be ending soon.", 'warning');
//           }
//         }
        
//         // Force re-render
//         setUpdateTrigger(prev => prev + 1);
//       }
      
//       // Cancel any pending fetch and schedule a new one
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
      
//       fetchGameStatusTimeoutRef.current = setTimeout(() => {
//         if (isMountedRef.current) {
//           fetchGameStatus();
//           fetchCalledNumbers();
//         }
//       }, 1000);
      
//       // Check if game completed
//       if (calledNumbersList.length >= 90) {
//         checkGameCompletion();
//       }
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error in handleNumberCalled:`, error);
//     }
//   };

//   const handleStatusUpdated = (data) => {
//     console.log(`[Game ${gameId}] ⏸️ Processing status updated event:`, data);
    
//     try {
//       setCallingStatus(data);
//       setGameStatus(data.game);
      
//       const statusMessage = data.is_paused ? "Game paused by host" : "Game resumed by host";
//       showSnackbar(statusMessage, data.is_paused ? 'warning' : 'info');
      
//       if (fetchGameStatusTimeoutRef.current) {
//         clearTimeout(fetchGameStatusTimeoutRef.current);
//       }
      
//       fetchGameStatusTimeoutRef.current = setTimeout(() => {
//         if (isMountedRef.current) {
//           fetchGameStatus();
//         }
//       }, 500);
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] ❌ Error handling status updated:`, error);
//     }
//   };

//   const handleGameCompleted = (data) => {
//     console.log(`[Game ${gameId}] 🏁 Processing game completed event:`, data);
    
//     setGameCompleted(true);
//     setShowGameEndModal(true);
//     startConfettiAnimation();
    
//     showSnackbar("Game has been completed!", 'success');
    
//     if (audioEnabled.current) {
//       setTimeout(() => {
//         Tts.stop();
//         Tts.speak(`Game completed! Thank you for playing ${gameName}!`);
//       }, 1000);
//     }
//   };

//   const handleClaimSubmitted = (data) => {
//     console.log(`[Game ${gameId}] 📝 Processing claim submitted event:`, data);
    
//     showSnackbar(`${data.user_name} submitted a ${data.reward_name} claim!`, 'info');
    
//     fetchClaims();
    
//     if (audioEnabled.current) {
//       Tts.stop();
//       Tts.speak(`${data.user_name} has submitted a ${data.reward_name} claim!`);
//     }
//   };

//   const handleClaimApproved = (data) => {
//     console.log(`[Game ${gameId}] 🏆 Processing claim approved event:`, data);
    
//     const notification = {
//       type: 'claim_approved',
//       claim: data,
//       message: `🏆 ${data.user_name} WON ₹${data.winning_amount} for ${data.reward_name}! CONGRATULATIONS! 🎊`
//     };
    
//     if (!announcedClaimIds.current.has(data.id)) {
//       announcedClaimIds.current.add(data.id);
//       showNotification(notification);
//     }
    
//     fetchClaims();
//   };

//   const handleClaimRejected = (data) => {
//     console.log(`[Game ${gameId}] ❌ Processing claim rejected event:`, data);
    
//     const notification = {
//       type: 'claim_rejected',
//       claim: data,
//       message: `❌ ${data.user_name}'s ${data.reward_name} claim was rejected`
//     };
    
//     showNotification(notification);
    
//     fetchClaims();
//   };

//   const fetchInitialData = async () => {
//     await Promise.all([
//       fetchGameStatus(),
//       fetchCalledNumbers(),
//       fetchMyTickets(),
//       checkChatStatus(),
//       fetchClaims(),
//       fetchPatternRewards(),
//       fetchGamePatternsForViewing(),
//     ]);
//   };

//   const fetchCalledNumbers = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/${gameId}/called-numbers`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const data = response.data.data;
//         const newCalledNumbers = data.called_numbers || [];
        
//         console.log(`[Game ${gameId}] 📥 Fetched called numbers:`, newCalledNumbers);
        
//         // Update announced numbers set with existing called numbers
//         newCalledNumbers.forEach(num => {
//           announcedNumbersRef.current.add(num);
//         });
        
//         setCalledNumbers(newCalledNumbers);
        
//         // Update last called ref
//         if (newCalledNumbers.length > 0) {
//           lastCalledRef.current = newCalledNumbers[newCalledNumbers.length - 1];
//         }
        
//         // Force re-render
//         setUpdateTrigger(prev => prev + 1);
        
//         return data;
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching called numbers:`, error);
//       return null;
//     }
//   };

//   const fetchGameStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/${gameId}/calling/status`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const data = response.data.data;
//         const previousGameStatus = gameStatus?.status;
//         const newGameStatus = data.game?.status;
        
//         setGameStatus(data.game);
//         setCallingStatus(data.calling);
        
//         if (previousGameStatus !== 'completed' && newGameStatus === 'completed') {
//           checkGameCompletion();
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching game status:`, error);
//     }
//   };

//   const fetchMyTickets = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       console.log(`[Game ${gameId}] Fetching tickets`);
      
//       try {
//         const response = await axios.get(
//           `https://tambolatime.co.in/public/api/user/games/${gameId}/my-tickets`,
//           { 
//             headers: { 
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//             } 
//           }
//         );

//         if (response.data.success) {
//           const tickets = response.data.tickets || response.data.data || [];
//           console.log(`[Game ${gameId}] Found tickets:`, tickets.length);
//           setMyTickets(tickets);
//           return;
//         }
//       } catch (specificError) {
//         console.log(`[Game ${gameId}] Specific endpoint failed:`, specificError.message);
//       }

//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           } 
//         }
//       );
      
//       if (res.data.success) {
//         let tickets = [];
        
//         if (res.data.tickets && res.data.tickets.data) {
//           tickets = res.data.tickets.data;
//         } else if (res.data.data && Array.isArray(res.data.data)) {
//           tickets = res.data.data;
//         } else if (res.data.tickets && Array.isArray(res.data.tickets)) {
//           tickets = res.data.tickets;
//         }
        
//         const gameTickets = tickets.filter((ticket) => {
//           const ticketGameId = ticket.game_id || ticket.game?.id;
//           return parseInt(ticketGameId) === parseInt(gameId);
//         });
        
//         console.log(`[Game ${gameId}] Filtered tickets:`, gameTickets.length);
//         setMyTickets(gameTickets);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching tickets:`, error);
//       showSnackbar("Failed to load tickets", 'error');
//     }
//   };

//   const checkChatStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/games/${gameId}/chat/participants`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setParticipantCount(response.data.total_participants || 0);
//         const tokenData = await AsyncStorage.getItem("user");
//         if (tokenData) {
//           const user = JSON.parse(tokenData);
//           const isParticipant = response.data.data.some(p => p.id === user.id);
//           setIsChatJoined(isParticipant);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error checking chat status:`, error);
//     }
//   };

//   const joinChat = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
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

//       if (response.data.success) {
//         setIsChatJoined(true);
//         setParticipantCount(response.data.participant_count || 1);
//         navigation.navigate('UserLiveChat', {
//           gameId,
//           gameName,
//           participantCount: response.data.participant_count || 1
//         });
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error joining chat:`, error);
//     }
//   };

//   const initializeTTS = async () => {
//     try {
//       await Tts.getInitStatus();
//       const availableVoices = await Tts.voices();
      
//       const englishVoices = availableVoices.filter(v => v.language.startsWith('en'));

//       const maleVoice = englishVoices.find(v => 
//         v.name?.toLowerCase().includes('male') || 
//         v.id.toLowerCase().includes('male') ||
//         v.id.toLowerCase().includes('daniel')
//       );

//       const femaleVoice = englishVoices.find(v => 
//         v.name?.toLowerCase().includes('female') || 
//         v.id.toLowerCase().includes('female') ||
//         v.id.toLowerCase().includes('samantha')
//       );

//       setVoices({
//         male: maleVoice ? maleVoice.id : englishVoices[0]?.id,
//         female: femaleVoice ? femaleVoice.id : englishVoices[1]?.id,
//       });
      
//       try {
//         const savedVoice = await AsyncStorage.getItem('voiceType');
//         if (savedVoice) {
//           setVoiceType(savedVoice);
//         }
//       } catch (error) {
//         console.log(`[Game ${gameId}] Error loading voice preference:`, error);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error initializing TTS:`, error);
//     }
    
//     setVoiceLoading(false);
//   };

//   const updateVoiceSettings = async (type) => {
//     const voiceId = type === 'male' ? voices.male : voices.female;
//     if (voiceId) {
//       Tts.stop();
//       Tts.setDefaultVoice(voiceId);
//       setVoiceType(type);
      
//       try {
//         await AsyncStorage.setItem('voiceType', type);
//       } catch (error) {
//         console.log(`[Game ${gameId}] Error saving voice preference:`, error);
//       }
      
//       setTimeout(() => {
//         speak(type);
//       }, 500);
//     }
//   };

//   const speak = (gender) => {
//     const voiceId = gender === 'male' ? voices.female : voices.male;
//     if (voiceId) {
//       Tts.stop();
//       Tts.setDefaultVoice(voiceId);
//     }
//   };

//   const speakNumber = async (number) => {
//     if (!audioEnabled.current) return;
    
//     const numStr = number.toString();
//     let speechText = '';
    
//     if (numStr.length === 1) {
//       const digitWord = getSingleDigitWord(number);
//       speechText = `Single digit ${digitWord}`;
//     } else {
//       const singleDigits = numStr.split('').map(digit => {
//         switch(digit) {
//           case '0': return 'zero';
//           case '1': return 'one';
//           case '2': return 'two';
//           case '3': return 'three';
//           case '4': return 'four';
//           case '5': return 'five';
//           case '6': return 'six';
//           case '7': return 'seven';
//           case '8': return 'eight';
//           case '9': return 'nine';
//           default: return digit;
//         }
//       }).join(' ');
      
//       const fullNumberName = getNumberName(number);
//       speechText = `Number ${singleDigits}. ${fullNumberName}`;
//     }
    
//     try {
//       Tts.stop();
//       Tts.speak(speechText);
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error speaking number:`, error);
//     }
//   };

//   const getSingleDigitWord = (num) => {
//     switch(num) {
//       case 1: return 'one';
//       case 2: return 'two';
//       case 3: return 'three';
//       case 4: return 'four';
//       case 5: return 'five';
//       case 6: return 'six';
//       case 7: return 'seven';
//       case 8: return 'eight';
//       case 9: return 'nine';
//       default: return 'zero';
//     }
//   };

//   const getNumberName = (num) => {
//     const numberNames = {
//       1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
//       6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
//       11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
//       16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
//       21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
//       26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
//       31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
//       36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
//       41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
//       46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
//       51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
//       56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
//       61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
//       66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
//       71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
//       76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
//       81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
//       86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
//     };
    
//     return numberNames[num] || num.toString();
//   };

//   const showSnackbar = (message, type = 'info') => {
//     if (snackbarTimeout.current) {
//       clearTimeout(snackbarTimeout.current);
//     }
    
//     setSnackbarVisible(false);
    
//     setTimeout(() => {
//       setSnackbarType(type);
//       setSnackbarMessage(message);
//       setSnackbarVisible(true);
      
//       snackbarTimeout.current = setTimeout(() => {
//         setSnackbarVisible(false);
//       }, 3000);
//     }, 100);
//   };

//   const hideSnackbar = () => {
//     if (snackbarTimeout.current) {
//       clearTimeout(snackbarTimeout.current);
//     }
//     setSnackbarVisible(false);
//   };

//   const startAnimations = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim1, {
//           toValue: 1,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim1, {
//           toValue: 0,
//           duration: 4000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatAnim2, {
//           toValue: 1,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(floatAnim2, {
//           toValue: 0,
//           duration: 5000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.02,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(shineAnim, {
//           toValue: 1,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(shineAnim, {
//           toValue: 0,
//           duration: 3000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const translateY1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   const translateY2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -10]
//   });

//   const shineTranslateX = shineAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-100, SCREEN_WIDTH + 100]
//   });

//   const loadSounds = async () => {
//     try {
//       Sound.setCategory('Playback');
      
//       const sound = new Sound(
//         'https://www.orangefreesounds.com/wp-content/uploads/2017/01/Button-click-sound.mp3',
//         null,
//         (error) => {
//           if (error) {
//             console.log(`[Game ${gameId}] Error loading sound from URL:`, error);
//             return;
//           }
//           setClickSound(sound);
//         }
//       );
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error in loadSounds:`, error);
//     }
//   };

//   const playClickSound = async () => {
//     try {
//       if (clickSound) {
//         clickSound.play((success) => {
//           if (!success) {
//             console.log(`[Game ${gameId}] Sound playback failed`);
//           }
//         });
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error playing sound:`, error);
//     }
//   };

//   const stopAllBlinking = () => {
//     Object.values(blinkingIntervals.current).forEach(item => {
//       if (item && item.animation && item.animation.stop) {
//         item.animation.stop();
//       }
//     });
    
//     Object.values(blinkingTimeouts.current).forEach(timeout => {
//       if (timeout) clearTimeout(timeout);
//     });
    
//     blinkingIntervals.current = {};
//     blinkingTimeouts.current = {};
//     setBlinkingCells({});
//     setBlinkingAnimations({});
//     setSelectedPatternForView(null);
//     setBlinkingPattern(null);
//   };

//   const startBlinkingForAllTickets = (pattern, duration = 5000) => {
//     stopAllBlinking();
    
//     const allBlinkingCells = {};
//     const allAnimations = {};
    
//     myTickets.forEach(ticket => {
//       const patternCells = getPatternCells(ticket, pattern);
//       if (patternCells.length > 0) {
//         allBlinkingCells[ticket.id] = patternCells;
        
//         const animValue = new Animated.Value(0);
//         allAnimations[ticket.id] = animValue;
//       }
//     });
    
//     setBlinkingCells(allBlinkingCells);
//     setBlinkingAnimations(allAnimations);
//     setBlinkingPattern(pattern);
    
//     Object.keys(allAnimations).forEach(ticketId => {
//       const animValue = allAnimations[ticketId];
      
//       const startBlink = () => {
//         Animated.loop(
//           Animated.sequence([
//             Animated.timing(animValue, {
//               toValue: 1,
//               duration: 500,
//               useNativeDriver: true,
//               easing: Easing.ease,
//             }),
//             Animated.timing(animValue, {
//               toValue: 0,
//               duration: 500,
//               useNativeDriver: true,
//               easing: Easing.ease,
//             }),
//           ]),
//           { iterations: -1 }
//         ).start();
//       };
      
//       blinkingIntervals.current[ticketId] = {
//         animation: startBlink,
//         start: () => startBlink()
//       };
      
//       startBlink();
//     });

//     blinkingTimeouts.current.global = setTimeout(() => {
//       stopAllBlinking();
//     }, duration);
//   };

//   const getPatternCells = (ticket, pattern) => {
//     const processedData = processTicketData(ticket.ticket_data);
//     const cells = [];
    
//     switch(pattern.pattern_name) {
//       case 'bamboo':
//         for (let row = 0; row < 3; row++) {
//           const nonEmptyCells = [];
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null) {
//               nonEmptyCells.push({ row, col, cell });
//             }
//           }
//           if (nonEmptyCells.length >= 3) {
//             cells.push({ row: nonEmptyCells[2].row, col: nonEmptyCells[2].col });
//           }
//         }
//         break;
        
//       case 'bottom_line':
//         for (let col = 0; col < 9; col++) {
//           const cell = processedData[2][col];
//           if (cell && cell.number !== null) {
//             cells.push({ row: 2, col });
//           }
//         }
//         break;
        
//       case 'breakfast':
//         for (let row = 0; row < 3; row++) {
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null && cell.number >= 1 && cell.number <= 30) {
//               cells.push({ row, col });
//             }
//           }
//         }
//         break;
        
//       case 'dinner':
//         for (let row = 0; row < 3; row++) {
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null && cell.number >= 61 && cell.number <= 90) {
//               cells.push({ row, col });
//             }
//           }
//         }
//         break;
        
//       case 'early_five':
//         const ticketNumbers = [];
//         const ticketNumberPositions = {};
        
//         for (let row = 0; row < 3; row++) {
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null) {
//               ticketNumbers.push(cell.number);
//               ticketNumberPositions[cell.number] = { row, col };
//             }
//           }
//         }
        
//         let foundCount = 0;
//         for (const calledNumber of calledNumbers) {
//           if (ticketNumberPositions[calledNumber] && foundCount < 5) {
//             const position = ticketNumberPositions[calledNumber];
//             cells.push({ row: position.row, col: position.col });
//             foundCount++;
//           }
//           if (foundCount >= 5) break;
//         }
//         break;
        
//       case 'four_corners':
//         const firstRowCells = [];
//         for (let col = 0; col < 9; col++) {
//           const cell = processedData[0][col];
//           if (cell && cell.number !== null) {
//             firstRowCells.push({ row: 0, col, cell });
//           }
//         }
//         if (firstRowCells.length > 0) {
//           cells.push({ row: 0, col: firstRowCells[0].col });
//           cells.push({ row: 0, col: firstRowCells[firstRowCells.length - 1].col });
//         }
        
//         const lastRowCells = [];
//         for (let col = 0; col < 9; col++) {
//           const cell = processedData[2][col];
//           if (cell && cell.number !== null) {
//             lastRowCells.push({ row: 2, col, cell });
//           }
//         }
//         if (lastRowCells.length > 0) {
//           cells.push({ row: 2, col: lastRowCells[0].col });
//           cells.push({ row: 2, col: lastRowCells[lastRowCells.length - 1].col });
//         }
//         break;
        
//       case 'full_house':
//         for (let row = 0; row < 3; row++) {
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null) {
//               cells.push({ row, col });
//             }
//           }
//         }
//         break;
        
//       case 'lunch':
//         for (let row = 0; row < 3; row++) {
//           for (let col = 0; col < 9; col++) {
//             const cell = processedData[row][col];
//             if (cell && cell.number !== null && cell.number >= 31 && cell.number <= 60) {
//               cells.push({ row, col });
//             }
//           }
//         }
//         break;
        
//       case 'middle_line':
//         for (let col = 0; col < 9; col++) {
//           const cell = processedData[1][col];
//           if (cell && cell.number !== null) {
//             cells.push({ row: 1, col });
//           }
//         }
//         break;
        
//       case 'top_line':
//         for (let col = 0; col < 9; col++) {
//           const cell = processedData[0][col];
//           if (cell && cell.number !== null) {
//             cells.push({ row: 0, col });
//           }
//         }
//         break;
        
//       default:
//         break;
//     }
    
//     return cells;
//   };

//   const getPatternDescription = (patternName) => {
//     const descriptions = {
//       'full_house': 'Mark all numbers on your ticket',
//       'early_five': 'First 5 numbers called on your ticket',
//       'top_line': 'All numbers in the top row',
//       'middle_line': 'All numbers in the middle row',
//       'bottom_line': 'All numbers in the bottom row',
//       'four_corners': 'Four corner numbers of your ticket',
//       'bamboo': 'Third number in each row',
//       'breakfast': 'Numbers 1-30',
//       'lunch': 'Numbers 31-60',
//       'dinner': 'Numbers 61-90',
//     };
    
//     return descriptions[patternName] || 'Complete this pattern to win prize';
//   };

//   const fetchPatternRewardCounts = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/game/${gameId}/reward-counts`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.status) {
//         return response.data.data.patterns || [];
//       }
//       return [];
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching pattern reward counts:`, error);
//       return [];
//     }
//   };

//   const checkGameCompletion = () => {
//     const isNumbersCompleted = calledNumbers.length >= 90;
//     const isGameStatusCompleted = gameStatus?.status === 'completed';
    
//     if ((isNumbersCompleted || isGameStatusCompleted) && !gameEndShownRef.current) {
//       gameEndShownRef.current = true;
//       setGameCompleted(true);
//       setShowGameEndModal(true);
//       startConfettiAnimation();
      
//       if (audioEnabled.current) {
//         setTimeout(() => {
//           Tts.stop();
//           Tts.speak(`Game completed! All 90 numbers have been called. Thank you for playing ${gameName}!`);
//         }, 1000);
//       }
//     }
//   };

//   const fetchGamePatternsForViewing = async () => {
//     try {
//       setLoadingPatterns(true);
      
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/games",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const games = response.data.games.data;
//         const currentGame = games.find((game) => game.id === parseInt(gameId));

//         if (currentGame && currentGame.pattern_rewards) {
//           const gamePatterns = currentGame.pattern_rewards.map(pattern => ({
//             ...pattern,
//             id: pattern.pattern_id,
//             pattern_id: pattern.pattern_id,
//             pattern_name: pattern.reward_name.toLowerCase().replace(/ /g, '_'),
//             display_name: pattern.reward_name,
//             amount: pattern.amount,
//           }));
          
//           const sortedPatterns = sortPatternsBySequence(gamePatterns);
//           setAvailablePatterns(sortedPatterns);
//         } else {
//           setAvailablePatterns([]);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching game patterns for viewing:`, error);
//       showSnackbar("Failed to load patterns", 'error');
//       setAvailablePatterns([]);
//     } finally {
//       setLoadingPatterns(false);
//     }
//   };

//   const handleViewPatterns = (ticketId) => {
//     setSelectedTicket(ticketId);
//     setShowPatternsModal(true);
    
//     fetchGamePatternsForViewing();
//   };

//   const handlePatternSelect = (pattern) => {
//     setSelectedPatternForView(pattern);
//     setBlinkingPattern(pattern);
//     setShowPatternsModal(false);
    
//     showSnackbar(`Showing ${pattern.display_name} pattern on all tickets`, 'info');
    
//     setTimeout(() => {
//       startBlinkingForAllTickets(pattern, 5000);
//     }, 300);
//   };

//   useEffect(() => {
//     checkGameCompletion();
//   }, [calledNumbers, gameStatus?.status]);

//   useEffect(() => {
//     console.log(`[Game ${gameId}] calledNumbers changed, forcing re-render`);
    
//     // Update last called ref
//     if (calledNumbers.length > 0) {
//       lastCalledRef.current = calledNumbers[calledNumbers.length - 1];
//     }
    
//     // Force re-render
//     setUpdateTrigger(prev => prev + 1);
    
//     // Check if game completed
//     if (calledNumbers.length >= 90) {
//       checkGameCompletion();
//     }
//   }, [calledNumbers]);

//   const updatePatternCounts = (claimsData) => {
//     const ticketPatterns = {};
//     const patternCounts = {};

//     patternRewards.forEach(pattern => {
//       patternCounts[pattern.pattern_id] = {
//         claimed: 0,
//         total: pattern.limit_count || 0,
//         patternName: pattern.reward_name,
//       };
//     });

//     claimsData.forEach(claim => {
//       const ticketId = claim.ticket_id;
//       const patternId = claim.game_pattern_id;
      
//       if (!ticketId || !patternId) return;

//       if (!ticketPatterns[ticketId]) {
//         ticketPatterns[ticketId] = {};
//       }

//       if (claim.claim_status === 'approved' || claim.claim_status === 'pending') {
//         ticketPatterns[ticketId][patternId] = {
//           count: (ticketPatterns[ticketId][patternId]?.count || 0) + 1,
//           status: claim.claim_status,
//         };

//         if (claim.claim_status === 'approved' && patternCounts[patternId]) {
//           patternCounts[patternId].claimed += 1;
//         }
//       }
//     });

//     setPatternsByTicket(ticketPatterns);
//     setTotalPatternCounts(patternCounts);
//   };

//   const fetchPatternRewards = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/games",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const games = response.data.games.data;
//         const currentGame = games.find((game) => game.id === parseInt(gameId));

//         if (currentGame && currentGame.pattern_rewards) {
//           setPatternRewards(currentGame.pattern_rewards);
          
//           const initialCounts = {};
//           currentGame.pattern_rewards.forEach(pattern => {
//             initialCounts[pattern.pattern_id] = {
//               claimed: 0,
//               total: pattern.limit_count || 0,
//               patternName: pattern.reward_name,
//             };
//           });
//           setTotalPatternCounts(initialCounts);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching pattern rewards:`, error);
//     }
//   };

//   const fetchClaims = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/claims/game/${gameId}/claims`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const newClaims = response.data.data.claims || [];
//         const previousClaims = claimsRef.current;
        
//         updatePatternCounts(newClaims);
        
//         if (!initialClaimsFetched) {
//           announcedClaimIds.current.clear();
//         }
        
//         const notifications = [];
        
//         newClaims.forEach(newClaim => {
//           const oldClaim = previousClaims.find(old => old.id === newClaim.id);
          
//           if (!oldClaim) {
//             if (newClaim.claim_status === 'pending') {
//               notifications.push({
//                 type: 'new_claim',
//                 claim: newClaim,
//                 message: `🎉 ${newClaim.user_name} submitted a ${newClaim.reward_name} claim!`
//               });
//             }
//           } else {
//             if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'approved') {
//               notifications.push({
//                 type: 'claim_approved',
//                 claim: newClaim,
//                 message: `🏆 ${newClaim.user_name} WON ₹${newClaim.winning_amount} for ${newClaim.reward_name}! CONGRATULATIONS! 🎊`
//               });
//             } else if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'rejected') {
//               notifications.push({
//                 type: 'claim_rejected',
//                 claim: newClaim,
//                 message: `❌ ${newClaim.user_name}'s ${newClaim.reward_name} claim was rejected`
//               });
//             }
//           }
//         });
        
//         if (notifications.length > 0) {
//           notifications.forEach((notification, index) => {
//             setTimeout(() => {
//               showNotification(notification);
//             }, index * 2000);
//           });
//         }
        
//         setClaims(newClaims);
        
//         if (!initialClaimsFetched) {
//           setInitialClaimsFetched(true);
//         }
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching claims:`, error);
//     }
//   };

//   const showNotification = (notification) => {
//     const { type, claim, message } = notification;
    
//     if (announcedClaimIds.current.has(claim.id)) {
//       return;
//     }
    
//     announcedClaimIds.current.add(claim.id);
    
//     setTimeout(() => {
//       announcedClaimIds.current.delete(claim.id);
//     }, 10000);
    
//     if (type === 'claim_approved') {
//       showSnackbar(message, 'success');
//       startWinnerCelebration(claim);
//     } else if (type === 'claim_rejected') {
//       showSnackbar(message, 'error');
//     } else {
//       showSnackbar(message, 'info');
//     }
    
//     if (audioEnabled.current) {
//       setTimeout(() => {
//         if (type === 'claim_approved') {
//           const winningAmount = parseFloat(claim.winning_amount);
//           let amountText = winningAmount === 1 ? '1 rupee' : `${winningAmount} rupees`;
//           Tts.stop();
//           Tts.speak(`Congratulations! ${claim.user_name} has won ${amountText} for completing the ${claim.reward_name} pattern! Tambola!`);
//         } else if (type === 'new_claim') {
//           Tts.stop();
//           Tts.speak(`${claim.user_name} has submitted a ${claim.reward_name} claim!`);
//         }
//       }, 1000);
//     }
//   };

//   const startWinnerCelebration = (claim) => {
//     setWinningMessage(`🏆 WINNER! 🏆`);
//     setWinningUser(claim.user_name);
//     setWinningAmount(claim.winning_amount);
//     setWinningPattern(claim.reward_name);
    
//     celebrationOpacity.setValue(0);
//     celebrationScale.setValue(0.5);
//     celebrationTranslateY.setValue(50);

//     setShowWinningCelebration(true);

//     Animated.parallel([
//       Animated.timing(celebrationOpacity, {
//         toValue: 1,
//         duration: 300,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       Animated.timing(celebrationScale, {
//         toValue: 1,
//         duration: 400,
//         easing: Easing.out(Easing.back(1.5)),
//         useNativeDriver: true,
//       }),
//       Animated.timing(celebrationTranslateY, {
//         toValue: 0,
//         duration: 400,
//         easing: Easing.out(Easing.back(1.5)),
//         useNativeDriver: true,
//       }),
//     ]).start();

//     startConfettiAnimationCelebration();

//     setTimeout(() => {
//       stopWinningCelebration();
//     }, 5000);
//   };

//   const startConfettiAnimationCelebration = () => {
//     confettiTranslateY.current.forEach((anim, index) => {
//       anim.setValue(-50);
//       Animated.timing(anim, {
//         toValue: Dimensions.get("window").height + 50,
//         duration: 1500 + Math.random() * 1000,
//         delay: index * 100,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }).start();
//     });
//   };

//   const stopWinningCelebration = () => {
//     Animated.parallel([
//       Animated.timing(celebrationOpacity, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       Animated.timing(celebrationScale, {
//         toValue: 0.5,
//         duration: 300,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//       Animated.timing(celebrationTranslateY, {
//         toValue: 50,
//         duration: 300,
//         easing: Easing.ease,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowWinningCelebration(false);
//     });
//   };

//   const submitClaim = async (ticketId, pattern) => {
//     if (isSubmittingClaimRef.current) {
//       showSnackbar("Please wait, processing previous claim...", 'warning');
//       return;
//     }
    
//     if (submittingClaim) return;
    
//     try {
//       isSubmittingClaimRef.current = true;
//       setSubmittingClaim(true);
//       const token = await AsyncStorage.getItem("token");
      
//       const ticket = myTickets.find(t => t.id === ticketId);
//       if (!ticket) {
//         showSnackbar("Ticket not found", 'error');
//         isSubmittingClaimRef.current = false;
//         return;
//       }

//       const ticketPatterns = patternsByTicket[ticketId] || {};
//       const patternOnTicket = ticketPatterns[pattern.pattern_id];
      
//       if (patternOnTicket && patternOnTicket.status !== 'rejected') {
//         showSnackbar(`You have already claimed ${pattern.reward_name || pattern.display_name} on this ticket`, 'error');
//         isSubmittingClaimRef.current = false;
//         return;
//       }

//       if (pattern.available_reward_count !== undefined && pattern.available_reward_count <= 0) {
//         showSnackbar(`${pattern.reward_name || pattern.display_name} claims are no longer available`, 'error');
//         isSubmittingClaimRef.current = false;
//         return;
//       }

//       if (pattern.is_reward_available === false) {
//         showSnackbar(`${pattern.reward_name || pattern.display_name} is not available for claims`, 'error');
//         isSubmittingClaimRef.current = false;
//         return;
//       }

//       const response = await axios.post(
//         "https://tambolatime.co.in/public/api/user/claims/submit",
//         {
//           game_id: parseInt(gameId),
//           ticket_id: parseInt(ticketId),
//           reward_name: pattern.reward_name || pattern.display_name,
//           claim_evidence: `Pattern ${pattern.game_pattern_id || pattern.pattern_id} completed on ticket ${ticket.ticket_number}`,
//           game_pattern_id: pattern.game_pattern_id || pattern.pattern_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         showSnackbar(`Claim submitted for ${pattern.reward_name || pattern.display_name}! Waiting for approval.`, 'info');
        
//         await Promise.all([
//           fetchClaims(),
//           fetchPatternRewardCounts().then(rewardCountsData => {
//             if (rewardCountsData.length > 0) {
//               const patternsWithCounts = rewardCountsData.map(pattern => ({
//                 id: pattern.game_pattern_id,
//                 pattern_id: pattern.game_pattern_id,
//                 pattern_name: pattern.pattern_name,
//                 display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
//                   word.charAt(0).toUpperCase() + word.slice(1)
//                 ).join(' '),
//                 amount: pattern.amount,
//                 total_reward_count: pattern.total_reward_count,
//                 approved_claims_count: pattern.approved_claims_count,
//                 pending_claims_count: pattern.pending_claims_count,
//                 available_reward_count: pattern.available_reward_count,
//                 is_reward_available: pattern.is_reward_available,
//                 reward_name: pattern.reward_name,
//                 game_pattern_id: pattern.game_pattern_id
//               }));
              
//               const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
//               setMenuPatterns(sortedPatterns);
//             }
//           }),
//         ]);
        
//         const updatedTicketPatterns = { ...patternsByTicket };
//         if (!updatedTicketPatterns[ticketId]) {
//           updatedTicketPatterns[ticketId] = {};
//         }
//         updatedTicketPatterns[ticketId][pattern.pattern_id] = {
//           count: 1,
//           status: 'pending',
//         };
//         setPatternsByTicket(updatedTicketPatterns);
        
//       } else {
//         showSnackbar(response.data.message || "Failed to submit claim", 'error');
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error submitting claim:`, error);
//       let errorMessage = "Failed to submit claim. Please try again.";

//       if (error.response) {
//         if (error.response.data && error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (error.response.data && error.response.data.errors) {
//           const errors = error.response.data.errors;
//           errorMessage = Object.values(errors).flat().join("\n");
//         }
//       }

//       showSnackbar(errorMessage, 'error');
//     } finally {
//       isSubmittingClaimRef.current = false;
//       setSubmittingClaim(false);
//       setMenuVisible(false);
//       setSelectedTicket(null);
//     }
//   };

//   const startConfettiAnimation = () => {
//     confettiAnimation.setValue(0);
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(confettiAnimation, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(confettiAnimation, {
//           toValue: 0,
//           duration: 2000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//       ]),
//       { iterations: -1 }
//     ).start();
//   };

//   const stopConfettiAnimation = () => {
//     confettiAnimation.stopAnimation();
//     confettiAnimation.setValue(0);
//   };

//   const handleCloseGameEndModal = () => {
//     stopConfettiAnimation();
//     setShowGameEndModal(false);
//     navigation.goBack();
//   };

//   const handleViewWinners = () => {
//     stopConfettiAnimation();
//     setShowGameEndModal(false);
//     navigation.navigate('UserGameWinners', {
//       gameId,
//       gameName,
//       gameData: gameStatus,
//       calledNumbers: calledNumbers
//     });
//   };

//   const handleViewAllCalledNumbers = () => {
//     navigation.navigate('UserCalledNumbers', {
//       gameId,
//       gameName,
//       calledNumbers,
//       voiceType,
//       gameData: gameStatus
//     });
//   };

//   const openMenu = async (ticketId) => {
//     setSelectedTicket(ticketId);
//     setMenuVisible(false);
    
//     try {
//       const rewardCountsData = await fetchPatternRewardCounts();
//       if (rewardCountsData.length > 0) {
//         const patternsWithCounts = rewardCountsData.map(pattern => ({
//           id: pattern.game_pattern_id,
//           pattern_id: pattern.game_pattern_id,
//           pattern_name: pattern.pattern_name,
//           display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
//             word.charAt(0).toUpperCase() + word.slice(1)
//           ).join(' '),
//           amount: pattern.amount,
//           total_reward_count: pattern.total_reward_count,
//           approved_claims_count: pattern.approved_claims_count,
//           pending_claims_count: pattern.pending_claims_count,
//           available_reward_count: pattern.available_reward_count,
//           is_reward_available: pattern.is_reward_available,
//           reward_name: pattern.reward_name,
//           game_pattern_id: pattern.game_pattern_id
//         }));
        
//         const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
//         setMenuPatterns(sortedPatterns);
//       }
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error fetching pattern counts:`, error);
//     }
    
//     setMenuVisible(true);
//   };

//   const closeMenu = () => {
//     setMenuVisible(false);
//     setSelectedTicket(null);
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([
//       fetchGameStatus(),
//       fetchCalledNumbers(),
//       fetchMyTickets(),
//       checkChatStatus(),
//       fetchClaims(),
//       fetchPatternRewards(),
//       fetchGamePatternsForViewing(),
//     ]);
    
//     if (!isPusherConnectedRef.current) {
//       await reconnectPusher();
//     }
    
//     setRefreshing(false);
//   };

//   const handleNumberClick = async (ticketId, cellNumber, isCurrentlyMarked) => {
//     if (cellNumber === null || markingLoading) return;
    
//     playClickSound();
    
//     const cellKey = `${ticketId}-${cellNumber}`;
    
//     setProcessingCells(prev => new Set(prev).add(cellKey));
    
//     updateTicketState(ticketId, cellNumber, !isCurrentlyMarked);
    
//     makeMarkingApiCall(ticketId, cellNumber, isCurrentlyMarked, cellKey);
//   };

//   const makeMarkingApiCall = async (ticketId, cellNumber, wasMarked, cellKey) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       if (wasMarked) {
//         await axios.post(
//           `https://tambolatime.co.in/public/api/user/tickets/${ticketId}/unmark`,
//           { number: cellNumber },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//               "Content-Type": "application/json"
//             }
//           }
//         );
//       } else {
//         await axios.post(
//           "https://tambolatime.co.in/public/api/user/tickets/mark-multiple",
//           {
//             ticket_marks: [{ ticket_id: ticketId, numbers: [cellNumber] }]
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//               "Content-Type": "application/json"
//             }
//           }
//         );
//       }
      
//     } catch (error) {
//       console.log(`[Game ${gameId}] Error marking/unmarking number:`, error);
      
//       showSnackbar("Failed to update number. Please try again.", 'error');
//       updateTicketState(ticketId, cellNumber, wasMarked);
//     } finally {
//       setProcessingCells(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(cellKey);
//         return newSet;
//       });
//     }
//   };

//   const updateTicketState = (ticketId, number, isMarked) => {
//     setMyTickets(prevTickets => 
//       prevTickets.map(ticket => {
//         if (ticket.id === ticketId) {
//           const updatedTicketData = ticket.ticket_data.map(row =>
//             row.map(cell => {
//               if (cell && cell.number === number) {
//                 return { ...cell, is_marked: isMarked };
//               }
//               return cell;
//             })
//           );
          
//           return { 
//             ...ticket, 
//             ticket_data: updatedTicketData 
//           };
//         }
//         return ticket;
//       })
//     );
//   };

//   const processTicketData = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
//     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
//       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
//       ticketData.forEach((row, rowIndex) => {
//         row.forEach((cell) => {
//           if (cell && cell.number !== null && cell.column !== undefined) {
//             processedGrid[rowIndex][cell.column] = cell;
//           }
//         });
//       });
      
//       return processedGrid;
//     } else if (ticketData[0] && Array.isArray(ticketData[0])) {
//       return ticketData.map(row => row.map(cell => cell));
//     }
    
//     return Array(3).fill(Array(9).fill(null));
//   };

//   const getTicketsPerRow = () => {
//     if (isLandscape) {
//       return 2;
//     }
//     return 1;
//   };

//   const renderTicketsGrid = () => {
//     const ticketsPerRow = getTicketsPerRow();
//     const rows = [];
    
//     for (let i = 0; i < myTickets.length; i += ticketsPerRow) {
//       const rowTickets = myTickets.slice(i, i + ticketsPerRow);
//       rows.push(rowTickets);
//     }
    
//     return rows.map((row, rowIndex) => (
//       <View key={`row-${rowIndex}`} style={styles.ticketRow}>
//         {row.map((ticket, index) => (
//           <View 
//             key={ticket.id} 
//             style={[
//               styles.ticketGridItem,
//               { width: isLandscape ? '48%' : '100%' }
//             ]}
//           >
//             {renderTicketItem({ item: ticket, index: rowIndex * ticketsPerRow + index })}
//           </View>
//         ))}
//       </View>
//     ));
//   };

//   const renderAllCalledNumbersSection = () => {
//     const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
//     const numberRows = [];
//     for (let i = 0; i < 9; i++) {
//       numberRows.push(allNumbers.slice(i * 10, (i + 1) * 10));
//     }

//     const currentCalledNumbers = calledNumbers;
    
//     return (
//       <View style={styles.allNumbersCard} key={`all-numbers-${updateTrigger}`}>
//         <View style={styles.allNumbersHeader}>
//           <View style={styles.allNumbersTitleContainer}>
//             <MaterialIcons name="format-list-numbered" size={18} color={ACCENT_COLOR} />
//             <Text style={styles.allNumbersTitle}>All Numbers (1-90)</Text>
//             <View style={styles.calledCountBadge}>
//               <Text style={styles.calledCountText}>{currentCalledNumbers.length}/90</Text>
//             </View>
//           </View>
          
//           <TouchableOpacity
//             style={styles.viewAllGridButton}
//             onPress={handleViewAllCalledNumbers}
//           >
//             <Text style={styles.viewAllGridButtonText}>View All</Text>
//             <Ionicons name="expand" size={14} color={ACCENT_COLOR} />
//           </TouchableOpacity>
//         </View>
        
//         <View style={styles.numbersGridCompact}>
//           {numberRows.map((row, idx) => (
//             <View key={`row-${idx}-${updateTrigger}`} style={styles.numberRow}>
//               {row.map((number) => {
//                 const isCalled = currentCalledNumbers.includes(number);
//                 const isLatest = currentCalledNumbers.length > 0 && 
//                   number === currentCalledNumbers[currentCalledNumbers.length - 1];
                
//                 return (
//                   <TouchableOpacity
//                     key={`${number}-${updateTrigger}`}
//                     style={[
//                       styles.numberItemCompact,
//                       isCalled && styles.calledNumberItem,
//                       isLatest && styles.latestNumberItem,
//                     ]}
//                     activeOpacity={0.7}
//                     onPress={() => speakNumber(number)}
//                     onLongPress={() => speakNumber(number)}
//                   >
//                     <Text style={[
//                       styles.numberItemTextCompact,
//                       isCalled && styles.calledNumberText,
//                       isLatest && styles.latestNumberText,
//                     ]}>
//                       {number}
//                     </Text>
//                     {isLatest && (
//                       <View style={styles.latestIndicatorCompact}>
//                         <Ionicons name="star" size={8} color={WHITE} />
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           ))}
//         </View>
        
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendNormal]} />
//             <Text style={styles.legendText}>Not Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendCalled]} />
//             <Text style={styles.legendText}>Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendLatest]} />
//             <Text style={styles.legendText}>Latest</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const renderTicketGrid = (ticketData, ticketId) => {
//     const processedData = processTicketData(ticketData);
//     const blinkingAnim = blinkingAnimations[ticketId];
//     const currentBlinkingCells = blinkingCells[ticketId] || [];
    
//     const blinkingCellMap = {};
//     currentBlinkingCells.forEach(cell => {
//       const key = `${cell.row}-${cell.col}`;
//       blinkingCellMap[key] = true;
//     });

//     return (
//       <View style={styles.ticket}>
//         {processedData.map((row, rowIndex) => (
//           <View 
//             key={`row-${rowIndex}`} 
//             style={[
//               styles.row,
//               { 
//                 backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
//               }
//             ]}
//           >
//             {row.map((cell, colIndex) => {
//               const cellObj = cell;
//               const cellNumber = cellObj?.number;
//               const isMarked = cellObj?.is_marked || false;
//               const isEmpty = cellNumber === null || cellNumber === undefined;
              
//               const shouldBlink = blinkingCellMap[`${rowIndex}-${colIndex}`];
              
//               let cellBackgroundColor;
//               let cellBorderColor;
//               let textColor;
              
//               if (isEmpty) {
//                 cellBackgroundColor = EMPTY_CELL_BG;
//                 cellBorderColor = CELL_BORDER_COLOR;
//                 textColor = "transparent";
//               } else if (isMarked) {
//                 cellBackgroundColor = MARKED_CELL_BG;
//                 cellBorderColor = MARKED_CELL_BORDER;
//                 textColor = WHITE;
//               } else {
//                 cellBackgroundColor = FILLED_CELL_BG;
//                 cellBorderColor = CELL_BORDER_COLOR;
//                 textColor = WHITE;
//               }
              
//               return (
//                 <TouchableOpacity
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.cell,
//                     { 
//                       width: CELL_WIDTH,
//                       height: CELL_WIDTH,
//                       margin: CELL_MARGIN,
//                       backgroundColor: cellBackgroundColor,
//                       borderColor: cellBorderColor,
//                     },
//                     shouldBlink && styles.blinkingCellBorder,
//                   ]}
//                   onPress={() => cellNumber && handleNumberClick(ticketId, cellNumber, isMarked)}
//                   onLongPress={() => cellNumber && speakNumber(cellNumber)}
//                   disabled={isEmpty || markingLoading}
//                 >
//                   {!isEmpty && (
//                     <>
//                       {shouldBlink && blinkingAnim ? (
//                         <Animated.View 
//                           style={[
//                             styles.blinkingOverlay,
//                             {
//                               opacity: blinkingAnim,
//                               backgroundColor: WARNING_ORANGE,
//                               transform: [{
//                                 scale: blinkingAnim.interpolate({
//                                   inputRange: [0, 1],
//                                   outputRange: [0.8, 1.2]
//                                 })
//                               }]
//                             }
//                           ]}
//                         >
//                           <Text style={[
//                             styles.number, 
//                             { 
//                               color: textColor,
//                               textShadowColor: 'rgba(255, 152, 0, 0.8)',
//                               textShadowOffset: { width: 0, height: 0 },
//                               textShadowRadius: 4,
//                             }
//                           ]}>
//                             {cellNumber}
//                           </Text>
//                         </Animated.View>
//                       ) : (
//                         <Text style={[styles.number, { color: textColor }]}>
//                           {cellNumber}
//                         </Text>
//                       )}
//                     </>
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderTicketItem = ({ item, index }) => (
//     <View style={styles.ticketItemContainer}>
//       <View style={styles.ticketHeader}>
//         <View style={styles.ticketNumberContainer}>
//           <MaterialIcons name="confirmation-number" size={20} color={PRIMARY_COLOR} />
//           <View style={styles.ticketInfo}>
//             <Text style={styles.ticketLabel}>Ticket #{item.ticket_number}</Text>
//           </View>
//         </View>
        
//         <View style={styles.ticketActions}>
//           <TouchableOpacity
//             style={styles.viewPatternsButton}
//             onPress={() => handleViewPatterns(item.id)}
//           >
//             <Ionicons name="eye-outline" size={16} color={PRIMARY_COLOR} />
//             <Text style={styles.viewPatternsButtonText}>Patterns</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.claimButton}
//             onPress={() => openMenu(item.id)}
//             ref={el => menuRefs.current[index] = el}
//           >
//             <Ionicons name="trophy" size={16} color={WHITE} />
//             <Text style={styles.claimButtonText}>Claim</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.ticketCard}>
//         {renderTicketGrid(item.ticket_data, item.id)}
//       </View>
//     </View>
//   );

//   const renderPatternMenu = () => {
//     if (!selectedTicket) return null;

//     const ticketPatterns = patternsByTicket[selectedTicket] || {};
    
//     const patternsForClaim = menuPatterns.map(pattern => {
//       const patternOnTicket = ticketPatterns[pattern.pattern_id];
      
//       const hasAvailableRewards = pattern.available_reward_count !== undefined && pattern.available_reward_count > 0;
//       const isRewardAvailable = pattern.is_reward_available !== false;
      
//       const isClaimed = patternOnTicket && patternOnTicket.status !== 'rejected';
      
//       const isDisabled = isClaimed || !hasAvailableRewards || !isRewardAvailable;
      
//       return {
//         ...pattern,
//         isDisabled,
//         isClaimed,
//         hasAvailableRewards,
//         isRewardAvailable,
//         patternOnTicket
//       };
//     });

//     const handleRefreshPatterns = async () => {
//       try {
//         const rewardCountsData = await fetchPatternRewardCounts();
//         if (rewardCountsData.length > 0) {
//           const patternsWithCounts = rewardCountsData.map(pattern => ({
//             id: pattern.game_pattern_id,
//             pattern_id: pattern.game_pattern_id,
//             pattern_name: pattern.pattern_name,
//             display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
//               word.charAt(0).toUpperCase() + word.slice(1)
//             ).join(' '),
//             amount: pattern.amount,
//             total_reward_count: pattern.total_reward_count,
//             approved_claims_count: pattern.approved_claims_count,
//             pending_claims_count: pattern.pending_claims_count,
//             available_reward_count: pattern.available_reward_count,
//             is_reward_available: pattern.is_reward_available,
//             reward_name: pattern.reward_name,
//             game_pattern_id: pattern.game_pattern_id
//           }));
          
//           const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
//           setMenuPatterns(sortedPatterns);
//           showSnackbar("Patterns refreshed successfully", 'info');
//         }
//       } catch (error) {
//         showSnackbar("Failed to refresh patterns", 'error');
//       }
//     };

//     return (
//       <Modal
//         transparent={true}
//         visible={menuVisible}
//         animationType="fade"
//         onRequestClose={closeMenu}
//       >
//         <TouchableOpacity
//           style={styles.menuOverlay}
//           activeOpacity={1}
//           onPress={closeMenu}
//         >
//           <View style={styles.menuContainer}>
//             <View style={styles.menuHeader}>
//               <Text style={styles.menuTitle}>Submit Claim</Text>
//               <View style={styles.menuHeaderActions}>
//                 <TouchableOpacity 
//                   style={styles.refreshMenuButton}
//                   onPress={handleRefreshPatterns}
//                   disabled={loadingPatterns}
//                 >
//                   {loadingPatterns ? (
//                     <ActivityIndicator size="small" color={ACCENT_COLOR} />
//                   ) : (
//                     <Ionicons name="refresh" size={20} color={ACCENT_COLOR} />
//                   )}
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={closeMenu}>
//                   <Ionicons name="close" size={24} color={TEXT_LIGHT} />
//                 </TouchableOpacity>
//               </View>
//             </View>
            
//             <ScrollView style={styles.patternsMenuScroll}>
//               {loadingPatterns ? (
//                 <View style={styles.patternsLoadingContainer}>
//                   <ActivityIndicator size="large" color={ACCENT_COLOR} />
//                   <Text style={styles.patternsLoadingText}>Loading patterns...</Text>
//                 </View>
//               ) : patternsForClaim.length === 0 ? (
//                 <View style={styles.noPatternsContainer}>
//                   <Ionicons name="alert-circle-outline" size={40} color={WARNING_ORANGE} />
//                   <Text style={styles.noPatternsText}>No patterns available for this game</Text>
//                   <TouchableOpacity
//                     style={styles.retryButton}
//                     onPress={handleRefreshPatterns}
//                   >
//                     <Ionicons name="refresh" size={16} color={ACCENT_COLOR} />
//                     <Text style={styles.retryButtonText}>Refresh Patterns</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 patternsForClaim.map((pattern, index) => {
//                   const isDisabled = pattern.isDisabled;
//                   const isClaimed = pattern.isClaimed;
//                   const isLimitReached = !pattern.hasAvailableRewards || !pattern.isRewardAvailable;
                  
//                   return (
//                     <TouchableOpacity
//                       key={index}
//                       style={[
//                         styles.patternMenuItem,
//                         isDisabled && styles.disabledPatternItem
//                       ]}
//                       onPress={() => !isDisabled && submitClaim(selectedTicket, pattern)}
//                       disabled={submittingClaim || isDisabled}
//                     >
//                       <View style={styles.patternMenuItemContent}>
//                         <Ionicons 
//                           name={isClaimed ? "checkmark-circle" : (isLimitReached ? "lock-closed" : "trophy-outline")} 
//                           size={20} 
//                           color={isClaimed ? SUCCESS_COLOR : (isLimitReached ? ERROR_COLOR : ACCENT_COLOR)} 
//                         />
//                         <View style={styles.patternMenuItemInfo}>
//                           <Text style={[
//                             styles.patternMenuItemName,
//                             isDisabled && styles.disabledPatternName
//                           ]}>
//                             {pattern.reward_name || pattern.display_name}
//                             {isClaimed && (
//                               <Text style={styles.claimedBadge}> ✓ Claimed</Text>
//                             )}
//                             {!isClaimed && isLimitReached && (
//                               <Text style={styles.limitReachedBadge}> ✗ Not Available</Text>
//                             )}
//                           </Text>
//                           <Text style={[
//                             styles.patternMenuItemDesc,
//                             isDisabled && styles.disabledPatternDesc
//                           ]} numberOfLines={2}>
//                             Prize: ₹{pattern.amount}
//                             {pattern.available_reward_count !== undefined && (
//                               <Text style={[
//                                 styles.patternLimitText,
//                                 isLimitReached && styles.limitReachedText
//                               ]}>
//                                 {" "}• Available: {pattern.available_reward_count}/{pattern.total_reward_count}
//                               </Text>
//                             )}
//                           </Text>
//                         </View>
//                         {submittingClaim && pattern.patternOnTicket ? (
//                           <ActivityIndicator size="small" color={ACCENT_COLOR} />
//                         ) : (
//                           <View style={styles.patternStatusContainer}>
//                             {isDisabled && !isClaimed && (
//                               <Ionicons name="lock-closed" size={16} color={ERROR_COLOR} />
//                             )}
//                           </View>
//                         )}
//                       </View>
//                     </TouchableOpacity>
//                   );
//                 })
//               )}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   };

//   const renderPatternsModal = () => {
//     if (!selectedTicket) return null;

//     return (
//       <Modal
//         transparent={true}
//         visible={showPatternsModal}
//         animationType="slide"
//         onRequestClose={() => {
//           setShowPatternsModal(false);
//           stopAllBlinking();
//         }}
//       >
//         <View style={styles.patternsModalOverlay}>
//           <View style={styles.patternsModalContainer}>
//             <View style={styles.patternsModalHeader}>
//               <Text style={styles.patternsModalTitle}>Available Patterns</Text>
//               <View style={styles.patternsModalHeaderActions}>
//                 <TouchableOpacity 
//                   onPress={() => fetchGamePatternsForViewing()}
//                   style={styles.refreshPatternsButton}
//                   disabled={loadingPatterns}
//                 >
//                   {loadingPatterns ? (
//                     <ActivityIndicator size="small" color={TEXT_LIGHT} />
//                   ) : (
//                     <Ionicons name="refresh" size={20} color={TEXT_LIGHT} />
//                   )}
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   onPress={() => {
//                     setShowPatternsModal(false);
//                     stopAllBlinking();
//                   }}
//                   style={styles.patternsModalCloseButton}
//                 >
//                   <Ionicons name="close" size={24} color={TEXT_LIGHT} />
//                 </TouchableOpacity>
//               </View>
//             </View>
            
//             <Text style={styles.patternsModalSubtitle}>
//               Tap on a pattern to see it highlighted on ALL your tickets for 5 seconds
//             </Text>
            
//             {blinkingPattern && (
//               <View style={styles.currentBlinkingPatternContainer}>
//                 <Ionicons name="star" size={18} color={WARNING_ORANGE} />
//                 <Text style={styles.currentBlinkingPatternText}>
//                   Showing: <Text style={styles.currentBlinkingPatternName}>{blinkingPattern.display_name}</Text>
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.stopBlinkingButton}
//                   onPress={stopAllBlinking}
//                 >
//                   <Ionicons name="stop-circle" size={16} color={ERROR_COLOR} />
//                   <Text style={styles.stopBlinkingText}>Stop</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
            
//             <View style={styles.earlyFiveNoteContainer}>
//               <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
//               <Text style={styles.earlyFiveNoteText}>
//                 <Text style={styles.earlyFiveNoteBold}>Early Five pattern:</Text> Shows the first 5 called numbers on each ticket
//               </Text>
//             </View>
            
//             {loadingPatterns ? (
//               <View style={styles.patternsLoadingContainer}>
//                 <ActivityIndicator size="large" color={ACCENT_COLOR} />
//                 <Text style={styles.patternsLoadingText}>Loading patterns...</Text>
//               </View>
//             ) : (
//               <ScrollView style={styles.patternsList} showsVerticalScrollIndicator={false}>
//                 {availablePatterns.length === 0 ? (
//                   <View style={styles.noAvailablePatternsContainer}>
//                     <Ionicons name="alert-circle-outline" size={40} color={WARNING_ORANGE} />
//                     <Text style={styles.noAvailablePatternsText}>No patterns available for this game</Text>
//                   </View>
//                 ) : (
//                   availablePatterns.map((pattern, index) => {
//                     const isSelected = selectedPatternForView?.id === pattern.id;
                    
//                     return (
//                       <TouchableOpacity
//                         key={index}
//                         style={[
//                           styles.patternListItem,
//                           isSelected && styles.selectedPatternListItem
//                         ]}
//                         onPress={() => handlePatternSelect(pattern)}
//                       >
//                         <View style={styles.patternListItemContent}>
//                           <Ionicons 
//                             name="star" 
//                             size={18} 
//                             color={isSelected ? WARNING_ORANGE : ACCENT_COLOR} 
//                           />
//                           <View style={styles.patternListItemInfo}>
//                             <Text style={styles.patternListItemName}>
//                               {pattern.display_name}
//                               {isSelected && (
//                                 <Text style={styles.selectedBadge}> • Selected</Text>
//                               )}
//                             </Text>
//                             <Text style={styles.patternListItemDesc} numberOfLines={2}>
//                               {getPatternDescription(pattern.pattern_name)}
//                               {pattern.amount && (
//                                 <Text style={styles.patternAmountText}> • Prize: ₹{pattern.amount}</Text>
//                               )}
//                             </Text>
//                           </View>
//                           <View style={styles.patternActionContainer}>
//                             {isSelected ? (
//                               <Ionicons name="checkmark-circle" size={22} color={SUCCESS_COLOR} />
//                             ) : (
//                               <Ionicons name="eye" size={18} color={ACCENT_COLOR} />
//                             )}
//                           </View>
//                         </View>
//                       </TouchableOpacity>
//                     );
//                   })
//                 )}
//               </ScrollView>
//             )}
            
//             <View style={styles.patternsModalFooter}>
//               <TouchableOpacity
//                 style={styles.clearSelectionButton}
//                 onPress={() => {
//                   setSelectedPatternForView(null);
//                   stopAllBlinking();
//                 }}
//               >
//                 <Ionicons name="refresh" size={16} color={TEXT_LIGHT} />
//                 <Text style={styles.clearSelectionButtonText}>Clear Selection</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.closePatternsButton}
//                 onPress={() => {
//                   setShowPatternsModal(false);
//                   setSelectedPatternForView(null);
//                   stopAllBlinking();
//                 }}
//               >
//                 <Text style={styles.closePatternsButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };

//   const renderWinningCelebration = () => {
//     if (!showWinningCelebration) return null;

//     return (
//       <Modal
//         transparent={true}
//         visible={showWinningCelebration}
//         animationType="fade"
//         onRequestClose={stopWinningCelebration}
//       >
//         <View style={styles.winningOverlay}>
//           {confettiTranslateY.current.map((anim, index) => (
//             <Animated.View
//               key={`confetti-${index}`}
//               style={[
//                 styles.confettiParticle,
//                 {
//                   left: `${(index * 5) % 100}%`,
//                   transform: [{ translateY: anim }],
//                   backgroundColor: [ERROR_COLOR, ACCENT_COLOR, WARNING_ORANGE, SUCCESS_COLOR][index % 4],
//                 }
//               ]}
//             />
//           ))}

//           <Animated.View style={[
//             styles.celebrationContent,
//             {
//               opacity: celebrationOpacity,
//               transform: [
//                 { scale: celebrationScale },
//                 { translateY: celebrationTranslateY }
//               ],
//             }
//           ]}>
//             <View style={styles.celebrationInner}>
//               <Ionicons name="trophy" size={40} color={WARNING_ORANGE} style={styles.trophyIcon} />
              
//               <Text style={styles.winningTitle}>{winningMessage}</Text>
              
//               <View style={styles.winnerInfo}>
//                 <Text style={styles.winnerName}>{winningUser}</Text>
//                 <Text style={styles.winnerPattern}>{winningPattern}</Text>
//               </View>
              
//               <View style={styles.prizeAmountContainer}>
//                 <Text style={styles.prizeAmount}>₹{winningAmount}</Text>
//                 <Text style={styles.prizeLabel}>WINNINGS</Text>
//               </View>
              
//               <View style={styles.celebrationMessage}>
//                 <Ionicons name="sparkles" size={16} color={WARNING_ORANGE} />
//                 <Text style={styles.celebrationText}>CONGRATULATIONS!</Text>
//                 <Ionicons name="sparkles" size={16} color={WARNING_ORANGE} />
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.closeCelebrationButton}
//               onPress={stopWinningCelebration}
//             >
//               <Text style={styles.closeCelebrationText}>Continue</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </Modal>
//     );
//   };

//   const renderCustomSnackbar = () => {
//     if (!snackbarVisible) return null;

//     const backgroundColor = snackbarType === 'success' ? SUCCESS_COLOR : 
//                           snackbarType === 'error' ? ERROR_COLOR : 
//                           snackbarType === 'warning' ? WARNING_ORANGE : PRIMARY_COLOR;

//     return (
//       <Modal
//         transparent={true}
//         visible={snackbarVisible}
//         animationType="fade"
//         onRequestClose={hideSnackbar}
//       >
//         <TouchableOpacity
//           style={styles.snackbarOverlay}
//           activeOpacity={1}
//           onPress={hideSnackbar}
//         >
//           <View style={[styles.snackbarContainer, { backgroundColor }]}>
//             <View style={styles.snackbarContent}>
//               {snackbarType === 'success' && (
//                 <Ionicons name="trophy" size={20} color={WHITE} style={styles.snackbarIcon} />
//               )}
//               {snackbarType === 'error' && (
//                 <Ionicons name="close-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
//               )}
//               {snackbarType === 'warning' && (
//                 <Ionicons name="warning" size={20} color={WHITE} style={styles.snackbarIcon} />
//               )}
//               {snackbarType === 'info' && (
//                 <Ionicons name="information-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
//               )}
//               <Text style={styles.snackbarText}>{snackbarMessage}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <View style={styles.loadingContent}>
//           <View style={styles.loadingIconWrapper}>
//             <MaterialIcons name="confirmation-number" size={40} color={PRIMARY_COLOR} />
//           </View>
//           <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
//           <Text style={styles.loadingText}>Loading Game Room...</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

//       <View style={styles.backgroundPattern}>
//         <Animated.View 
//           style={[
//             styles.pokerChip1, 
//             { 
//               transform: [
//                 { translateY: translateY1 },
//                 { translateX: translateY2 }
//               ] 
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.pokerChip2, 
//             { 
//               transform: [
//                 { translateY: translateY2 },
//                 { translateX: translateY1 }
//               ] 
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.pokerChip3, 
//             { 
//               transform: [
//                 { translateY: translateY1 },
//                 { translateX: translateY2 }
//               ] 
//             }
//           ]} 
//         />
        
//         <Animated.View 
//           style={[
//             styles.shineEffect,
//             { 
//               transform: [{ translateX: shineTranslateX }],
//               opacity: shineAnim
//             }
//           ]} 
//         />
//       </View>

//       {renderCustomSnackbar()}
//       {renderPatternsModal()}
//       {renderWinningCelebration()}

//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={showGameEndModal}
//         onRequestClose={handleCloseGameEndModal}
//       >
//         <View style={styles.gameEndModalOverlay}>
//           <Animated.View 
//             style={[
//               styles.confettiContainer,
//               {
//                 transform: [{
//                   translateY: confettiAnimation.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0, -20]
//                   })
//                 }]
//               }
//             ]}
//           >
//             <Ionicons name="confetti" size={150} color={ACCENT_COLOR} style={{ opacity: 0.7 }} />
//           </Animated.View>
          
//           <View style={styles.gameEndModalContent}>
//             <View style={styles.gameEndModalHeader}>
//               <Ionicons name="trophy" size={60} color={WARNING_ORANGE} />
//               <Text style={styles.gameEndModalTitle}>
//                 {gameStatus?.status === 'completed' ? "Game Completed!" : "Game Complete! 🎉"}
//               </Text>
//             </View>
            
//             <View style={styles.gameEndModalBody}>
//               <Text style={styles.gameEndCongratulations}>
//                 Congratulations!
//               </Text>
//               <Text style={styles.gameEndMessage}>
//                 {gameStatus?.status === 'completed' 
//                   ? "The game has been marked as completed by the host!" 
//                   : "All 90 numbers have been called! The game has ended."}
//               </Text>
              
//               <View style={styles.gameEndStats}>
//                 <View style={styles.endStatItem}>
//                   <Text style={styles.endStatValue}>{calledNumbers.length}</Text>
//                   <Text style={styles.endStatLabel}>Numbers Called</Text>
//                 </View>
//                 <View style={styles.endStatItem}>
//                   <Text style={styles.endStatValue}>{myTickets.length}</Text>
//                   <Text style={styles.endStatLabel}>Your Tickets</Text>
//                 </View>
//                 <View style={styles.endStatItem}>
//                   <Text style={styles.endStatValue}>
//                     {myTickets.flatMap(t => 
//                       t.ticket_data.flat().filter(cell => cell.is_marked)
//                     ).length}
//                   </Text>
//                   <Text style={styles.endStatLabel}>Marked Numbers</Text>
//                 </View>
//               </View>
              
//               <Text style={styles.gameEndThanks}>
//                 Thank you for playing! Check out the winners and claim your prizes.
//               </Text>
//             </View>
            
//             <View style={styles.gameEndModalFooter}>
//               <TouchableOpacity
//                 style={styles.viewWinnersButton}
//                 onPress={handleViewWinners}
//               >
//                 <Ionicons name="trophy" size={20} color={WHITE} />
//                 <Text style={styles.viewWinnersButtonText}>View Winners</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={handleCloseGameEndModal}
//               >
//                 <Text style={styles.closeButtonText}>Exit Game Room</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showVoiceModal}
//         onRequestClose={() => setShowVoiceModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Select Voice Type</Text>
//               <TouchableOpacity
//                 onPress={() => setShowVoiceModal(false)}
//                 style={styles.modalCloseButton}
//               >
//                 <Ionicons name="close" size={24} color={TEXT_LIGHT} />
//               </TouchableOpacity>
//             </View>
            
//             <Text style={styles.modalSubtitle}>
//               Choose your preferred voice for number announcements
//             </Text>
            
//             <TouchableOpacity
//               style={[
//                 styles.voiceOption,
//                 voiceType === 'female' && styles.selectedVoiceOption
//               ]}
//               onPress={() => updateVoiceSettings('female')}
//             >
//               <View style={styles.voiceOptionIcon}>
//                 <Ionicons 
//                   name="female" 
//                   size={24} 
//                   color={voiceType === 'female' ? ACCENT_COLOR : TEXT_LIGHT} 
//                 />
//               </View>
//               <View style={styles.voiceOptionInfo}>
//                 <Text style={styles.voiceOptionName}>Female Voice</Text>
//                 <Text style={styles.voiceOptionDesc}>Higher pitch, clear pronunciation</Text>
//               </View>
//               {voiceType === 'female' && (
//                 <Ionicons name="checkmark-circle" size={24} color={ACCENT_COLOR} />
//               )}
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[
//                 styles.voiceOption,
//                 voiceType === 'male' && styles.selectedVoiceOption
//               ]}
//               onPress={() => updateVoiceSettings('male')}
//             >
//               <View style={styles.voiceOptionIcon}>
//                 <Ionicons 
//                   name="male" 
//                   size={24} 
//                   color={voiceType === 'male' ? ACCENT_COLOR : TEXT_LIGHT} 
//                 />
//               </View>
//               <View style={styles.voiceOptionInfo}>
//                 <Text style={styles.voiceOptionName}>Male Voice</Text>
//                 <Text style={styles.voiceOptionDesc}>Lower pitch, deeper tone</Text>
//               </View>
//               {voiceType === 'male' && (
//                 <Ionicons name="checkmark-circle" size={24} color={ACCENT_COLOR} />
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {renderPatternMenu()}

//       <ScrollView
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={PRIMARY_COLOR}
//             colors={[PRIMARY_COLOR]}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.header}>
//           <View style={styles.headerPattern}>
//             <Animated.View 
//               style={[
//                 styles.headerShine,
//                 { transform: [{ translateX: shineTranslateX }] }
//               ]} 
//             />
//           </View>

//           <View style={styles.headerContent}>
//             <View style={styles.headerTopRow}>
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Ionicons name="arrow-back" size={24} color={WHITE} />
//               </TouchableOpacity>

//               <View style={styles.headerTextContainer}>
//                 <Text style={styles.headerTitle}>Game Room</Text>
//                 <View style={styles.gameInfoContainer}>
//                   <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
//                   <Text style={styles.gameName} numberOfLines={1}>
//                     {gameName || "Tambola Game"}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.headerActions}>
//                 <TouchableOpacity
//                   style={styles.voiceButton}
//                   onPress={() => setShowVoiceModal(true)}
//                 >
//                   <Text style={styles.voiceButtonText}>
//                     Select Gender
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Connection Status Indicator */}
//         <View style={[styles.pusherStatusCard, { borderLeftColor: isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR }]}>
//           <Ionicons 
//             name={isPusherConnectedRef.current ? "wifi" : "wifi-outline"} 
//             size={16} 
//             color={isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR} 
//           />
//           <Text style={[styles.pusherStatusText, { color: isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR }]}>
//             {isPusherConnectedRef.current ? 'Real-time connected' : 'Real-time disconnected - pull to refresh'}
//           </Text>
//         </View>

//         <View style={styles.content}>
//           {/* All Numbers Section */}
//           {renderAllCalledNumbersSection()}

//           {/* Last Called Section */}
//           <View style={styles.card} key={`last-called-${updateTrigger}`}>
//             {calledNumbers.length > 0 ? (
//               <View style={styles.lastCalledSection}>
//                 <View style={styles.lastCalledHeader}>
//                   <Ionicons name="megaphone" size={18} color={ACCENT_COLOR} />
//                   <Text style={styles.sectionTitle}>Last Called Numbers</Text>
//                 </View>
                
//                 <View style={styles.circularNumbersGrid}>
//                   {calledNumbers.slice(-5).reverse().map((num, index) => {
//                     const isLatest = index === 0;
//                     return (
//                       <TouchableOpacity
//                         key={`${num}-${index}-${updateTrigger}`}
//                         style={[
//                           styles.circularNumberItem,
//                           isLatest && styles.latestCircularNumber
//                         ]}
//                         onPress={() => speakNumber(num)}
//                         onLongPress={() => speakNumber(num)}
//                       >
//                         <Text style={[
//                           styles.circularNumberText,
//                           isLatest && styles.latestCircularNumberText
//                         ]}>
//                           {num}
//                         </Text>
//                         {isLatest && (
//                           <View style={styles.latestBadge}>
//                             <Ionicons name="star" size={8} color={WHITE} />
//                           </View>
//                         )}
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
                
//                 <TouchableOpacity
//                   style={styles.viewAllButton}
//                   onPress={handleViewAllCalledNumbers}
//                 >
//                   <Text style={styles.viewAllButtonText}>View All Called Numbers</Text>
//                   <Ionicons name="chevron-forward" size={14} color={ACCENT_COLOR} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.waitingSection}>
//                 <Ionicons name="hourglass-outline" size={32} color={WARNING_ORANGE} />
//                 <Text style={styles.waitingText}>
//                   Waiting for numbers to be called...
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.ticketsSection}>
//             {myTickets.length === 0 ? (
//               <View style={styles.emptyTicketsContainer}>
//                 <Ionicons name="ticket-outline" size={60} color={PRIMARY_COLOR} style={{ opacity: 0.7 }} />
//                 <Text style={styles.emptyTitle}>No Tickets Allocated</Text>
//                 <Text style={styles.emptySubtitle}>
//                   You haven't been allocated any tickets for this game yet
//                 </Text>
//               </View>
//             ) : (
//               <>
//                 {blinkingPattern && (
//                   <View style={styles.activePatternContainer}>
//                     <Ionicons name="star" size={14} color={WARNING_ORANGE} />
//                     <Text style={styles.activePatternText}>
//                       Showing: <Text style={styles.activePatternName}>{blinkingPattern.display_name}</Text>
//                     </Text>
//                     <TouchableOpacity
//                       style={styles.stopBlinkingSmallButton}
//                       onPress={stopAllBlinking}
//                     >
//                       <Ionicons name="close" size={12} color={ERROR_COLOR} />
//                     </TouchableOpacity>
//                   </View>
//                 )}
                
//                 <View style={styles.ticketsGridContainer}>
//                   {renderTicketsGrid()}
//                 </View>

//                 <Text style={styles.ticketsHint}>
//                   Tap numbers to mark/unmark them • Long press to hear number • Tap Patterns to view • Tap Claim to submit
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>

//         <View style={styles.bottomSpace} />
//       </ScrollView>

//       <TouchableOpacity
//         style={styles.floatingChatButton}
//         onPress={joinChat}
//         activeOpacity={0.9}
//       >
//         <View style={styles.chatButtonContent}>
//           <Ionicons name="chatbubble-ellipses" size={20} color={WHITE} />
//           {participantCount > 0 && (
//             <View style={styles.chatBadge}>
//               <Text style={styles.chatBadgeText}>
//                 {participantCount > 99 ? '99+' : participantCount}
//               </Text>
//             </View>
//           )}
//         </View>
//         <Text style={styles.chatButtonText}>
//           {isChatJoined ? 'Chat' : 'Join Chat'}
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// // All styles remain exactly the same as in the original code
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 80,
//   },
//   content: {
//     padding: HORIZONTAL_MARGIN,
//     paddingTop: 20,
//     zIndex: 1,
//   },
//   backgroundPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//     overflow: 'hidden',
//   },
//   pokerChip1: {
//     position: 'absolute',
//     top: 80,
//     left: SCREEN_WIDTH * 0.1,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: PRIMARY_COLOR,
//     shadowColor: PRIMARY_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   pokerChip2: {
//     position: 'absolute',
//     top: 120,
//     right: SCREEN_WIDTH * 0.15,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   pokerChip3: {
//     position: 'absolute',
//     top: 180,
//     left: SCREEN_WIDTH * 0.6,
//     width: 25,
//     height: 25,
//     borderRadius: 12.5,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   shineEffect: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 100,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     transform: [{ skewX: '-20deg' }],
//   },
//   header: {
//     paddingTop: 15,
//     backgroundColor: PRIMARY_COLOR,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     overflow: 'hidden',
//   },
//   headerShine: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 100,
//     height: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     transform: [{ skewX: '-20deg' }],
//   },
//   headerContent: {
//     paddingHorizontal: 20,
//   },
//   headerTopRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: WHITE,
//     letterSpacing: -0.5,
//     marginBottom: 4,
//   },
//   gameInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gameName: {
//     fontSize: 14,
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: "500",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   voiceButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     gap: 4,
//   },
//   voiceButtonText: {
//     fontSize: 12,
//     color: WHITE,
//     fontWeight: "600",
//   },
//   card: {
//     backgroundColor: WHITE,
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   lastCalledSection: {
//     marginBottom: 0,
//   },
//   lastCalledHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 6,
//   },
//   sectionTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     flex: 1,
//   },
//   circularNumbersGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   circularNumberItem: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: BACKGROUND_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     position: 'relative',
//   },
//   latestCircularNumber: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//     borderWidth: 2,
//   },
//   circularNumberText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: TEXT_DARK,
//   },
//   latestCircularNumberText: {
//     color: WHITE,
//     fontWeight: "700",
//   },
//   latestBadge: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: WHITE,
//     borderRadius: 5,
//     padding: 1,
//   },
//   viewAllButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: 'center',
//     backgroundColor: BACKGROUND_COLOR,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     gap: 6,
//   },
//   viewAllButtonText: {
//     fontSize: 13,
//     color: PRIMARY_COLOR,
//     fontWeight: "600",
//   },
//   waitingSection: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   waitingText: {
//     fontSize: 14,
//     color: WARNING_ORANGE,
//     textAlign: "center",
//     marginTop: 12,
//     fontStyle: "italic",
//   },
//   allNumbersCard: {
//     backgroundColor: WHITE,
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   allNumbersHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   allNumbersTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   allNumbersTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: TEXT_DARK,
//   },
//   calledCountBadge: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     marginLeft: 6,
//   },
//   calledCountText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: WHITE,
//   },
//   viewAllGridButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   viewAllGridButtonText: {
//     fontSize: 12,
//     color: PRIMARY_COLOR,
//     fontWeight: '600',
//   },
//   numbersGridCompact: {
//     marginVertical: 6,
//   },
//   numberRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 5,
//   },
//   numberItemCompact: {
//     width: 26,
//     height: 26,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     backgroundColor: WHITE,
//     marginHorizontal: 2,
//     position: 'relative',
//   },
//   calledNumberItem: {
//     backgroundColor: SUCCESS_COLOR,
//     borderColor: SUCCESS_COLOR,
//   },
//   latestNumberItem: {
//     backgroundColor: ACCENT_COLOR,
//     borderColor: ACCENT_COLOR,
//     borderWidth: 2,
//   },
//   numberItemTextCompact: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: TEXT_DARK,
//   },
//   calledNumberText: {
//     color: WHITE,
//     fontWeight: '700',
//   },
//   latestNumberText: {
//     color: WHITE,
//     fontWeight: '900',
//   },
//   latestIndicatorCompact: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: WHITE,
//     borderRadius: 5,
//     padding: 1,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     gap: 12,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: BORDER_COLOR,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 3,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   legendNormal: {
//     backgroundColor: WHITE,
//   },
//   legendCalled: {
//     backgroundColor: SUCCESS_COLOR,
//   },
//   legendLatest: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   legendText: {
//     fontSize: 10,
//     color: TEXT_LIGHT,
//   },
//   ticketsSection: {
//     marginBottom: 12,
//   },
//   activePatternContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: "rgba(255, 152, 0, 0.1)",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   activePatternText: {
//     fontSize: 13,
//     color: TEXT_DARK,
//     marginLeft: 6,
//     flex: 1,
//   },
//   activePatternName: {
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//   },
//   stopBlinkingSmallButton: {
//     padding: 3,
//   },
//   ticketsGridContainer: {
//     gap: 20,
//   },
//   ticketRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   ticketGridItem: {
//     // Width controlled dynamically based on orientation
//   },
//   ticketWrapper: {
//     marginBottom: 16,
//   },
//   ticketItemContainer: {
//     marginBottom: 0,
//   },
//   ticketHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   ticketNumberContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     flex: 1,
//   },
//   ticketInfo: {
//     flex: 1,
//   },
//   ticketLabel: {
//     fontSize: 13,
//     color: TEXT_DARK,
//     fontWeight: "600",
//   },
//   ticketActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   viewPatternsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: BACKGROUND_COLOR,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     gap: 4,
//   },
//   viewPatternsButtonText: {
//     fontSize: 12,
//     color: PRIMARY_COLOR,
//     fontWeight: "600",
//   },
//   claimButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     gap: 4,
//   },
//   claimButtonText: {
//     fontSize: 12,
//     color: WHITE,
//     fontWeight: "600",
//   },
//   ticketCard: {
//     backgroundColor: WHITE,
//     borderRadius: 12,
//     padding: TICKET_PADDING,
//     borderWidth: 1.5,
//     borderColor: PRIMARY_COLOR,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   ticket: {
//     backgroundColor: WHITE,
//     padding: 0,
//     borderWidth: 0,
//     borderRadius: 0,
//     overflow: "hidden",
//     width: CELL_WIDTH * NUM_COLUMNS + CELL_MARGIN * 2 * NUM_COLUMNS,
//     alignSelf: 'center',
//   },
//   row: {
//     flexDirection: "row",
//     width: '100%',
//   },
//   cell: {
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 2,
//     margin: CELL_MARGIN,
//   },
//   number: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: WHITE,
//   },
//   blinkingCellBorder: {
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   blinkingOverlay: {
//     position: 'absolute',
//     width: '120%',
//     height: '120%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 2,
//   },
//   ticketsHint: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//     textAlign: "center",
//     marginTop: 16,
//     fontStyle: "italic",
//     lineHeight: 14,
//     paddingHorizontal: 4,
//   },
//   emptyTicketsContainer: {
//     alignItems: "center",
//     backgroundColor: WHITE,
//     borderRadius: 14,
//     padding: 32,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     marginTop: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: TEXT_DARK,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   menuOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menuContainer: {
//     backgroundColor: WHITE,
//     borderRadius: 14,
//     width: '85%',
//     maxHeight: '60%',
//     overflow: 'hidden',
//   },
//   menuHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   menuTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: TEXT_DARK,
//   },
//   menuHeaderActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   refreshMenuButton: {
//     padding: 5,
//   },
//   patternsMenuScroll: {
//     maxHeight: 300,
//   },
//   patternMenuItem: {
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
//   },
//   disabledPatternItem: {
//     backgroundColor: BACKGROUND_COLOR,
//     opacity: 0.7,
//   },
//   patternMenuItemContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   patternMenuItemInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   patternMenuItemName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: TEXT_DARK,
//     marginBottom: 3,
//   },
//   patternMenuItemDesc: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//   },
//   patternStatusContainer: {
//     marginLeft: 6,
//   },
//   patternLimitText: {
//     color: ACCENT_COLOR,
//     fontWeight: '600',
//   },
//   limitReachedText: {
//     color: ERROR_COLOR,
//     fontWeight: '700',
//   },
//   claimedBadge: {
//     fontSize: 11,
//     color: SUCCESS_COLOR,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   limitReachedBadge: {
//     fontSize: 11,
//     color: ERROR_COLOR,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   noPatternsContainer: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   noPatternsText: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     marginTop: 12,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   retryButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     gap: 6,
//   },
//   retryButtonText: {
//     fontSize: 13,
//     color: PRIMARY_COLOR,
//     fontWeight: '600',
//   },
//   disabledPatternName: {
//     color: TEXT_LIGHT,
//     textDecorationLine: 'none',
//   },
//   disabledPatternDesc: {
//     color: TEXT_LIGHT,
//   },
//   patternsModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   patternsModalContainer: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     width: '90%',
//     maxHeight: '75%',
//     overflow: 'hidden',
//   },
//   patternsModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   patternsModalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: TEXT_DARK,
//   },
//   patternsModalHeaderActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   refreshPatternsButton: {
//     padding: 5,
//   },
//   patternsModalCloseButton: {
//     padding: 5,
//   },
//   patternsModalSubtitle: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     textAlign: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: WHITE,
//   },
//   currentBlinkingPatternContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: "rgba(255, 152, 0, 0.1)",
//     padding: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   currentBlinkingPatternText: {
//     fontSize: 13,
//     color: TEXT_DARK,
//     marginLeft: 8,
//     flex: 1,
//   },
//   currentBlinkingPatternName: {
//     fontWeight: '700',
//     color: ACCENT_COLOR,
//   },
//   stopBlinkingButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: BACKGROUND_COLOR,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: ERROR_COLOR,
//     gap: 4,
//   },
//   stopBlinkingText: {
//     fontSize: 12,
//     color: ERROR_COLOR,
//     fontWeight: '600',
//   },
//   earlyFiveNoteContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     padding: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   earlyFiveNoteText: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     marginLeft: 8,
//     flex: 1,
//   },
//   earlyFiveNoteBold: {
//     fontWeight: '700',
//     color: PRIMARY_COLOR,
//   },
//   patternsLoadingContainer: {
//     padding: 32,
//     alignItems: 'center',
//   },
//   patternsLoadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: TEXT_LIGHT,
//   },
//   patternsList: {
//     maxHeight: 350,
//   },
//   patternListItem: {
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
//   },
//   selectedPatternListItem: {
//     backgroundColor: "rgba(79, 172, 254, 0.05)",
//     borderLeftWidth: 4,
//     borderLeftColor: PRIMARY_COLOR,
//   },
//   patternListItemContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   patternListItemInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   patternListItemName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: TEXT_DARK,
//     marginBottom: 3,
//   },
//   patternListItemDesc: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//   },
//   patternAmountText: {
//     color: SUCCESS_COLOR,
//     fontWeight: '600',
//   },
//   selectedBadge: {
//     fontSize: 12,
//     color: SUCCESS_COLOR,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   patternActionContainer: {
//     marginLeft: 8,
//   },
//   noAvailablePatternsContainer: {
//     alignItems: 'center',
//     padding: 32,
//   },
//   noAvailablePatternsText: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     marginTop: 12,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   patternsModalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: BORDER_COLOR,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   clearSelectionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     gap: 4,
//   },
//   clearSelectionButtonText: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     fontWeight: '600',
//   },
//   closePatternsButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: PRIMARY_COLOR,
//     borderRadius: 8,
//   },
//   closePatternsButtonText: {
//     color: WHITE,
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   winningOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 9999,
//   },
//   celebrationContent: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     width: '80%',
//     maxWidth: 300,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 8,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   celebrationInner: {
//     alignItems: 'center',
//     marginBottom: 12,
//     width: '100%',
//   },
//   trophyIcon: {
//     marginBottom: 8,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   winningTitle: {
//     fontSize: 18,
//     fontWeight: '900',
//     color: ERROR_COLOR,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   winnerInfo: {
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     width: '100%',
//   },
//   winnerName: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: TEXT_DARK,
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   winnerPattern: {
//     fontSize: 13,
//     color: ERROR_COLOR,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   prizeAmountContainer: {
//     backgroundColor: "rgba(231, 76, 60, 0.1)",
//     padding: 12,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: ERROR_COLOR,
//     width: '100%',
//   },
//   prizeAmount: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: ERROR_COLOR,
//     marginBottom: 4,
//   },
//   prizeLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: TEXT_LIGHT,
//     letterSpacing: 1,
//   },
//   celebrationMessage: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: "rgba(255, 152, 0, 0.1)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   celebrationText: {
//     fontSize: 13,
//     fontWeight: '800',
//     color: TEXT_DARK,
//     marginHorizontal: 6,
//   },
//   closeCelebrationButton: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 16,
//     width: '100%',
//     alignItems: 'center',
//   },
//   closeCelebrationText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   confettiParticle: {
//     width: 6,
//     height: 6,
//     borderRadius: 1,
//     position: 'absolute',
//     top: -50,
//   },
//   gameEndModalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   confettiContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   gameEndModalContent: {
//     backgroundColor: WHITE,
//     borderRadius: 20,
//     padding: 20,
//     width: '100%',
//     maxWidth: 350,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   gameEndModalHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   gameEndModalTitle: {
//     fontSize: 24,
//     fontWeight: '900',
//     color: ACCENT_COLOR,
//     textAlign: 'center',
//   },
//   gameEndModalBody: {
//     marginBottom: 20,
//   },
//   gameEndCongratulations: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: PRIMARY_COLOR,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   gameEndMessage: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   gameEndStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   endStatItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   endStatValue: {
//     fontSize: 20,
//     fontWeight: '900',
//     color: TEXT_DARK,
//     marginBottom: 4,
//   },
//   endStatLabel: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//     fontWeight: '600',
//   },
//   gameEndThanks: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     textAlign: 'center',
//     fontStyle: 'italic',
//     lineHeight: 18,
//   },
//   gameEndModalFooter: {
//     gap: 10,
//   },
//   viewWinnersButton: {
//     backgroundColor: ACCENT_COLOR,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 6,
//   },
//   viewWinnersButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   closeButton: {
//     backgroundColor: BACKGROUND_COLOR,
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   closeButtonText: {
//     color: TEXT_LIGHT,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 20,
//     width: '90%',
//     maxWidth: 350,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: TEXT_DARK,
//   },
//   modalCloseButton: {
//     padding: 4,
//   },
//   modalSubtitle: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     marginBottom: 20,
//     lineHeight: 18,
//   },
//   voiceOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 14,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     marginBottom: 10,
//   },
//   selectedVoiceOption: {
//     borderColor: PRIMARY_COLOR,
//     backgroundColor: "rgba(79, 172, 254, 0.05)",
//   },
//   voiceOptionIcon: {
//     marginRight: 12,
//   },
//   voiceOptionInfo: {
//     flex: 1,
//   },
//   voiceOptionName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: TEXT_DARK,
//     marginBottom: 2,
//   },
//   voiceOptionDesc: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//   },
//   snackbarOverlay: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'flex-end',
//     paddingBottom: Platform.OS === 'ios' ? 100 : 80,
//   },
//   snackbarContainer: {
//     marginHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   snackbarContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   snackbarIcon: {
//     marginRight: 12,
//   },
//   snackbarText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: '600',
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   loadingContent: {
//     alignItems: 'center',
//   },
//   loadingIconWrapper: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: "rgba(79, 172, 254, 0.2)",
//   },
//   loadingSpinner: {
//     marginTop: 10,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//     marginTop: 20,
//   },
//   floatingChatButton: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//     backgroundColor: PRIMARY_COLOR,
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   chatButtonContent: {
//     position: 'relative',
//     marginRight: 6,
//   },
//   chatBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: ERROR_COLOR,
//     borderRadius: 6,
//     minWidth: 14,
//     height: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: WHITE,
//   },
//   chatBadgeText: {
//     color: WHITE,
//     fontSize: 8,
//     fontWeight: 'bold',
//     paddingHorizontal: 2,
//   },
//   chatButtonText: {
//     color: WHITE,
//     fontSize: 13,
//     fontWeight: 'bold',
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   // Additional Pusher styles
//   pusherStatusCard: {
//     backgroundColor: WHITE,
//     borderRadius: 8,
//     padding: 8,
//     marginHorizontal: 12,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderLeftWidth: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   pusherStatusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
// });

// export default UserGameRoom;



import React, { useState, useEffect, useRef } from "react";
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
  RefreshControl,
  Modal,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Sound from "react-native-sound";
import Tts from "react-native-tts";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Parameters from TicketsScreen
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 8;
const HORIZONTAL_MARGIN = 10;

// Calculation from TicketsScreen
const CELL_WIDTH = 
  (SCREEN_WIDTH - 
   HORIZONTAL_MARGIN * 2 - 
   TICKET_PADDING * 2 - 
   CELL_MARGIN * 2 * NUM_COLUMNS) / 
  NUM_COLUMNS;

// Updated color scheme
const PRIMARY_COLOR = "#4facfe";
const TICKET_BORDER_COLOR = "#fcca26"
const ACCENT_COLOR = "#ff9800";
const BACKGROUND_COLOR = "#f5f8ff";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const SUCCESS_COLOR = "#4CAF50";
const ERROR_COLOR = "#E74C3C";
const WARNING_ORANGE = "#ff9800";
const UNMARKED_CELL_COLOR = "#62cff4";
const MARKED_CELL_COLOR = "#E74C3C";

// Cell colors for different states
const ROW_COLOR_1 = "#f0f8ff";
const ROW_COLOR_2 = "#e6f3ff";
const FILLED_CELL_BG = UNMARKED_CELL_COLOR;
const CELL_BORDER_COLOR = PRIMARY_COLOR;
const NUMBER_COLOR = WHITE;
const EMPTY_CELL_BG = "transparent";
const MARKED_CELL_BG = MARKED_CELL_COLOR;
const MARKED_CELL_BORDER = "#C0392B";

// Pattern sequence for sorting
const PATTERN_SEQUENCE = [
  { keywords: ['top line', 'topline', 'top-line'] },
  { keywords: ['middle line', 'middleline', 'middle-line'] },
  { keywords: ['bottom line', 'bottomline', 'bottom-line'] },
  { keywords: ['breakfast'] },
  { keywords: ['lunch'] },
  { keywords: ['dinner'] },
  { keywords: ['four corners', '4 corners', 'fourcorners'] },
  { keywords: ['bamboo'] },
  { keywords: ['early five', 'early 5', 'earlyfive'] },
  { keywords: ['non claimers', 'nonclaimers', 'non-claimers'] },
  { keywords: ['full house', 'fullhouse'] }
];

// Helper function to sort patterns by sequence
const sortPatternsBySequence = (patterns) => {
  if (!patterns || patterns.length === 0) return patterns;
  
  const getPatternIndex = (pattern) => {
    const patternName = (pattern.display_name || pattern.pattern_name || pattern.reward_name || '').toLowerCase();
    
    for (let i = 0; i < PATTERN_SEQUENCE.length; i++) {
      if (PATTERN_SEQUENCE[i].keywords.some(keyword => patternName.includes(keyword))) {
        return i;
      }
    }
    return PATTERN_SEQUENCE.length;
  };

  return [...patterns].sort((a, b) => {
    const aIndex = getPatternIndex(a);
    const bIndex = getPatternIndex(b);
    return aIndex - bIndex;
  });
};

// Custom Snackbar Component - Non-blocking
const CustomSnackbar = ({ visible, message, type = 'info', onDismiss }) => {
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

  const backgroundColor = type === 'success' ? SUCCESS_COLOR : 
                        type === 'error' ? ERROR_COLOR : 
                        type === 'warning' ? WARNING_ORANGE : PRIMARY_COLOR;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={styles.snackbarAbsoluteContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.snackbarContainer,
          { backgroundColor, transform: [{ translateY }] }
        ]}
      >
        <View style={styles.snackbarContent}>
          {type === 'success' && (
            <Ionicons name="checkmark-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
          )}
          {type === 'error' && (
            <Ionicons name="close-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
          )}
          {type === 'warning' && (
            <Ionicons name="warning" size={20} color={WHITE} style={styles.snackbarIcon} />
          )}
          {type === 'info' && (
            <Ionicons name="information-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
          )}
          <Text style={styles.snackbarText}>{message}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const UserGameRoom = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const [callingStatus, setCallingStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [isChatJoined, setIsChatJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [markingLoading, setMarkingLoading] = useState(false);
  const [voiceType, setVoiceType] = useState('female');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [claims, setClaims] = useState([]);
  const [initialClaimsFetched, setInitialClaimsFetched] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [patternRewards, setPatternRewards] = useState([]);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [showWinningCelebration, setShowWinningCelebration] = useState(false);
  const [winningMessage, setWinningMessage] = useState('');
  const [winningUser, setWinningUser] = useState('');
  const [winningAmount, setWinningAmount] = useState(0);
  const [winningPattern, setWinningPattern] = useState('');
  
  const [patternsByTicket, setPatternsByTicket] = useState({});
  const [totalPatternCounts, setTotalPatternCounts] = useState({});
  const [processingCells, setProcessingCells] = useState(new Set());
  
  const [showPatternsModal, setShowPatternsModal] = useState(false);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [menuPatterns, setMenuPatterns] = useState([]);
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [selectedPatternForView, setSelectedPatternForView] = useState(null);
  
  const [blinkingPattern, setBlinkingPattern] = useState(null);
  const [blinkingCells, setBlinkingCells] = useState({});
  const [blinkingAnimations, setBlinkingAnimations] = useState({});
  
  const [clickSound, setClickSound] = useState(null);
  
  const [voices, setVoices] = useState({ male: null, female: null });
  const [voiceLoading, setVoiceLoading] = useState(true);
  
  // Snackbar state - using non-blocking approach
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'info'
  });
  
  // App State for foreground/background detection
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Pusher Refs
  const pusherRef = useRef(null);
  const gameChannelRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Reconnection Refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 10;
  
  // Queue for missed events during disconnection
  const missedEventsQueueRef = useRef([]);
  const processingQueueRef = useRef(false);
  const isPusherConnectedRef = useRef(false);
  
  // Refs for latest values to avoid stale closures
  const calledNumbersRef = useRef([]);
  const claimsRef = useRef([]);
  const announcedNumbersRef = useRef(new Set()); // Track announced numbers to avoid re-announcing
  
  // TTS Queue System - Fix for Issue #1
  const ttsQueueRef = useRef([]);
  const isTtsSpeakingRef = useRef(false);
  
  // Other refs
  const lastCalledRef = useRef(null);
  const confettiAnimation = useRef(new Animated.Value(0)).current;
  const menuRefs = useRef([]);
  const lastApprovedClaimRef = useRef(null);
  const audioEnabled = useRef(true);
  const blinkingIntervals = useRef({});
  const blinkingTimeouts = useRef({});
  const gameEndShownRef = useRef(false);
  const announcedClaimIds = useRef(new Set());
  const isSubmittingClaimRef = useRef(false);
  const snackbarTimeout = useRef(null);
  const fetchGameStatusTimeoutRef = useRef(null);
  const menuScrollViewRef = useRef(null); // For menu scrolling
  
  // Animation refs
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0.5)).current;
  const celebrationTranslateY = useRef(new Animated.Value(50)).current;
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const confettiTranslateY = useRef([]);

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  // Fix for Issue #1: TTS Queue System
  const addToTtsQueue = (text) => {
    ttsQueueRef.current.push(text);
    processTtsQueue();
  };

  const processTtsQueue = () => {
    if (isTtsSpeakingRef.current || ttsQueueRef.current.length === 0) {
      return;
    }

    isTtsSpeakingRef.current = true;
    const text = ttsQueueRef.current.shift();

    Tts.speak(text, {
      onFinish: () => {
        isTtsSpeakingRef.current = false;
        processTtsQueue();
      },
      onError: () => {
        isTtsSpeakingRef.current = false;
        processTtsQueue();
      }
    });
  };

  const stopTtsAndClearQueue = () => {
    Tts.stop();
    ttsQueueRef.current = [];
    isTtsSpeakingRef.current = false;
  };

  // Fix for Issue #4: Non-blocking Snackbar
  const showSnackbar = (message, type = 'info') => {
    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }
    
    setSnackbar({
      visible: false,
      message: '',
      type: 'info'
    });
    
    setTimeout(() => {
      setSnackbar({
        visible: true,
        message,
        type
      });
      
      snackbarTimeout.current = setTimeout(() => {
        setSnackbar({
          visible: false,
          message: '',
          type: 'info'
        });
      }, 3000);
    }, 100);
  };

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
      await fetchCalledNumbers();
      await fetchMyTickets();
      await fetchClaims();
      
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
    claimsRef.current = claims;
  }, [claims]);

  // Set mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      stopTtsAndClearQueue(); // Clean up TTS on unmount
    };
  }, []);

  // Add this near your other useEffect hooks
useEffect(() => {
  console.log("Blinking state updated:", {
    blinkingCells: Object.keys(blinkingCells),
    blinkingAnimations: Object.keys(blinkingAnimations),
    blinkingPattern: blinkingPattern?.display_name
  });
}, [blinkingCells, blinkingAnimations, blinkingPattern]);

  // Initialize app and Pusher
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeTTS();
        startAnimations();
        await loadSounds();
        await initializePusher();
        await fetchInitialData();
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.log("Error initializing app:", error);
        showSnackbar("Failed to initialize. Please try again.", 'error');
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    initializeApp();
    
    return () => {
      cleanupPusher();
      stopTtsAndClearQueue(); // Stop all TTS on unmount
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      if (clickSound) {
        clickSound.release();
      }
      
      Object.values(blinkingIntervals.current).forEach(interval => {
        if (interval && interval.animation && interval.animation.stop) {
          interval.animation.stop();
        }
      });
      
      Object.values(blinkingTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
      }
      
      stopConfettiAnimation();
      stopWinningCelebration();
      stopAllBlinking();
    };
  }, [gameId]);

  // Initialize Pusher with auto-reconnection
  const initializePusher = async () => {
    try {
      console.log(`[Game ${gameId}] 📱 Initializing Pusher for user game`);
      
      const pusher = Pusher.getInstance();
      
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`[Game ${gameId}] 🔌 Connection state: ${previousState} → ${currentState}`);
          
          if (currentState === 'CONNECTED') {
            console.log(`[Game ${gameId}] ✅ Connected to Pusher`);
            isPusherConnectedRef.current = true;
            reconnectAttemptsRef.current = 0;
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
            processMissedEventsQueue();
          }
          
          if (currentState === 'DISCONNECTED' && isMountedRef.current) {
            console.log(`[Game ${gameId}] ❌ Disconnected, scheduling reconnection...`);
            isPusherConnectedRef.current = false;
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`[Game ${gameId}] ❌ Pusher error: ${message}`, error);
          isPusherConnectedRef.current = false;
          scheduleReconnection();
        },
      });
      
      await pusher.connect();
      console.log(`[Game ${gameId}] 🚀 Pusher connected`);
      
      const gameChannel = await pusher.subscribe({
        channelName: `game.${gameId}`,
        onEvent: (event) => {
          if (isMountedRef.current) {
            handlePusherEvent(event);
          }
        }
      });
      gameChannelRef.current = gameChannel;
      
      pusherRef.current = pusher;
      isPusherConnectedRef.current = true;
      console.log(`[Game ${gameId}] ✅ Pusher initialized successfully`);
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error initializing Pusher:`, error);
      isPusherConnectedRef.current = false;
      scheduleReconnection();
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
        } else if (event.type === 'game.completed') {
          await handleGameCompleted(event.data);
        } else if (event.type === 'claim.submitted') {
          await handleClaimSubmitted(event.data);
        } else if (event.type === 'claim.approved') {
          await handleClaimApproved(event.data);
        } else if (event.type === 'claim.rejected') {
          await handleClaimRejected(event.data);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`[Game ${gameId}] Error processing missed event:`, error);
      }
    }
    
    processingQueueRef.current = false;
    
    if (isMountedRef.current) {
      await fetchGameStatus();
      await fetchCalledNumbers();
      await fetchClaims();
    }
  };

  const scheduleReconnection = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(`[Game ${gameId}] ⚠️ Max reconnection attempts reached`);
      showSnackbar("Connection issues. Please pull down to refresh.", 'warning');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(`[Game ${gameId}] 🔄 Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectPusher();
    }, delay);
  };

  const reconnectPusher = async () => {
    try {
      console.log(`[Game ${gameId}] 🔄 Attempting to reconnect Pusher...`);
      reconnectAttemptsRef.current += 1;
      
      await cleanupPusher();
      await initializePusher();
      
      reconnectAttemptsRef.current = 0;
      console.log(`[Game ${gameId}] ✅ Reconnected successfully`);
      await fetchInitialData();
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Reconnection failed:`, error);
      scheduleReconnection();
    }
  };

  const cleanupPusher = async () => {
    if (pusherRef.current) {
      try {
        const pusher = Pusher.getInstance();
        
        if (gameChannelRef.current) {
          await pusher.unsubscribe({ channelName: `game.${gameId}` });
          gameChannelRef.current = null;
          console.log(`[Game ${gameId}] 📤 Unsubscribed from game channel`);
        }
        
        await pusher.disconnect();
        console.log(`[Game ${gameId}] 🔌 Pusher disconnected`);
      } catch (error) {
        console.log(`[Game ${gameId}] ❌ Error cleaning up Pusher:`, error);
      }
    }
  };

  const handlePusherEvent = (event) => {
    console.log(`[Game ${gameId}] 🔄 Processing event: ${event.eventName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      // If Pusher is not connected, queue the event
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
          handleClaimSubmitted(data);
          break;
        case 'claim.approved':
          handleClaimApproved(data);
          break;
        case 'claim.rejected':
          handleClaimRejected(data);
          break;
        default:
          console.log(`[Game ${gameId}] 📭 Unhandled event: ${event.eventName}`);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error handling Pusher event:`, error);
    }
  };

 const handleNumberCalled = (data) => {
  console.log(`[Game ${gameId}] 🔔 Processing number called event:`, data);
  
  try {
    const number = data.number;
    const calledNumbersList = data.called_numbers || data.sorted_numbers || [];
    
    console.log(`[Game ${gameId}] 🎲 New number called: ${number}`);
    console.log(`[Game ${gameId}] 📊 Total called: ${calledNumbersList.length}`);
    
    // FIX: Don't trust the order from the server
    // Create a new array in the order they were called
    // We know the latest number is 'number'
    
    // Get current called numbers from ref
    const currentNumbers = [...calledNumbersRef.current];
    
    // If this number is not already in the list, add it
    if (!currentNumbers.includes(number)) {
      // Add the new number to the end (this is the correct order - latest at the end)
      const newCalledNumbers = [...currentNumbers, number];
      
      console.log(`[Game ${gameId}] ✅ Adding ${number} to the end. New order:`, newCalledNumbers);
      
      // Update state with the correctly ordered array
      setCalledNumbers(newCalledNumbers);
      
      // Update ref
      calledNumbersRef.current = newCalledNumbers;
      
      // Check if this number hasn't been announced before
      if (!announcedNumbersRef.current.has(number)) {
        announcedNumbersRef.current.add(number);
        
        if (audioEnabled.current) {
          const numStr = number.toString();
          let speechText = '';
          
          if (numStr.length === 1) {
            const digitWord = getSingleDigitWord(number);
            speechText = `Single digit ${digitWord}`;
          } else {
            const singleDigits = numStr.split('').map(digit => {
              switch(digit) {
                case '0': return 'zero';
                case '1': return 'one';
                case '2': return 'two';
                case '3': return 'three';
                case '4': return 'four';
                case '5': return 'five';
                case '6': return 'six';
                case '7': return 'seven';
                case '8': return 'eight';
                case '9': return 'nine';
                default: return digit;
              }
            }).join(' ');
            
            const fullNumberName = getNumberName(number);
            speechText = `Number ${singleDigits}. ${fullNumberName}`;
          }
          
          addToTtsQueue(speechText);
        }
      }
      
      // Force re-render
      setUpdateTrigger(prev => prev + 1);
    }
    
    // Cancel any pending fetch and schedule a new one
    if (fetchGameStatusTimeoutRef.current) {
      clearTimeout(fetchGameStatusTimeoutRef.current);
    }
    
    fetchGameStatusTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        fetchGameStatus();
        // Still fetch called numbers but we'll handle it carefully
        fetchCalledNumbers();
      }
    }, 1000);
    
    // Check if game completed
    if (calledNumbersRef.current.length >= 90) {
      checkGameCompletion();
    }
    
  } catch (error) {
    console.log(`[Game ${gameId}] ❌ Error in handleNumberCalled:`, error);
  }
};

  const handleStatusUpdated = (data) => {
    console.log(`[Game ${gameId}] ⏸️ Processing status updated event:`, data);
    
    try {
      setCallingStatus(data);
      setGameStatus(data.game);
      
      const statusMessage = data.is_paused ? "Game paused by host" : "Game resumed by host";
      showSnackbar(statusMessage, data.is_paused ? 'warning' : 'info');
      
      if (fetchGameStatusTimeoutRef.current) {
        clearTimeout(fetchGameStatusTimeoutRef.current);
      }
      
      fetchGameStatusTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchGameStatus();
        }
      }, 500);
      
    } catch (error) {
      console.log(`[Game ${gameId}] ❌ Error handling status updated:`, error);
    }
  };

  const handleGameCompleted = (data) => {
    console.log(`[Game ${gameId}] 🏁 Processing game completed event:`, data);
    
    setGameCompleted(true);
    setShowGameEndModal(true);
    startConfettiAnimation();
    
    showSnackbar("Game has been completed!", 'success');
    
    if (audioEnabled.current) {
      setTimeout(() => {
        addToTtsQueue(`Game completed! Thank you for playing ${gameName}!`);
      }, 1000);
    }
  };

  // Fix for Issue #1: Use TTS Queue for claim announcements
  const handleClaimSubmitted = (data) => {
    console.log(`[Game ${gameId}] 📝 Processing claim submitted event:`, data);
    
    showSnackbar(`${data.user_name} submitted a ${data.reward_name} claim!`, 'info');
    
    fetchClaims();
    
    if (audioEnabled.current) {
      addToTtsQueue(`${data.user_name} has submitted a ${data.reward_name} claim!`);
    }
  };

  const handleClaimApproved = (data) => {
    console.log(`[Game ${gameId}] 🏆 Processing claim approved event:`, data);
    
    const notification = {
      type: 'claim_approved',
      claim: data,
      message: `🏆 ${data.user_name} WON ₹${data.winning_amount} for ${data.reward_name}! CONGRATULATIONS! 🎊`
    };
    
    if (!announcedClaimIds.current.has(data.id)) {
      announcedClaimIds.current.add(data.id);
      showNotification(notification);
    }
    
    fetchClaims();
  };

  const handleClaimRejected = (data) => {
    console.log(`[Game ${gameId}] ❌ Processing claim rejected event:`, data);
    
    const notification = {
      type: 'claim_rejected',
      claim: data,
      message: `❌ ${data.user_name}'s ${data.reward_name} claim was rejected`
    };
    
    showNotification(notification);
    
    fetchClaims();
  };

  const fetchInitialData = async () => {
    await Promise.all([
      fetchGameStatus(),
      fetchCalledNumbers(),
      fetchMyTickets(),
      checkChatStatus(),
      fetchClaims(),
      fetchPatternRewards(),
      fetchGamePatternsForViewing(),
    ]);
  };

 const fetchCalledNumbers = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(
      `https://tambolatime.co.in/public/api/user/games/${gameId}/called-numbers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (response.data.success) {
      const data = response.data.data;
      let newCalledNumbers = data.called_numbers || [];
      
      console.log(`[Game ${gameId}] 📥 Fetched called numbers:`, newCalledNumbers);
      
      // FIX: We can't trust the order from the server
      // Let's merge with our current order to maintain sequence
      
      const currentNumbers = calledNumbersRef.current;
      
      // Create a set of current numbers for quick lookup
      const currentSet = new Set(currentNumbers);
      
      // Find numbers that are in newCalledNumbers but not in currentNumbers
      const newNumbers = newCalledNumbers.filter(num => !currentSet.has(num));
      
      if (newNumbers.length > 0) {
        // Add new numbers to the end in the order they appear
        // (assuming the API returns them in some order, but we'll just append)
        const updatedNumbers = [...currentNumbers, ...newNumbers];
        
        console.log(`[Game ${gameId}] 📊 Updated numbers in order:`, updatedNumbers);
        
        // Update state
        setCalledNumbers(updatedNumbers);
        
        // Update ref
        calledNumbersRef.current = updatedNumbers;
        
        // Update announced numbers
        newNumbers.forEach(num => {
          announcedNumbersRef.current.add(num);
        });
        
        // Force re-render
        setUpdateTrigger(prev => prev + 1);
      }
      
      return data;
    }
  } catch (error) {
    console.log(`[Game ${gameId}] Error fetching called numbers:`, error);
    return null;
  }
};

  const fetchGameStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/${gameId}/calling/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        const previousGameStatus = gameStatus?.status;
        const newGameStatus = data.game?.status;
        
        setGameStatus(data.game);
        setCallingStatus(data.calling);
        
        if (previousGameStatus !== 'completed' && newGameStatus === 'completed') {
          checkGameCompletion();
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching game status:`, error);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(`[Game ${gameId}] Fetching tickets`);
      
      try {
        const response = await axios.get(
          `https://tambolatime.co.in/public/api/user/games/${gameId}/my-tickets`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            } 
          }
        );

        if (response.data.success) {
          const tickets = response.data.tickets || response.data.data || [];
          console.log(`[Game ${gameId}] Found tickets:`, tickets.length);
          setMyTickets(tickets);
          return;
        }
      } catch (specificError) {
        console.log(`[Game ${gameId}] Specific endpoint failed:`, specificError.message);
      }

      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          } 
        }
      );
      
      if (res.data.success) {
        let tickets = [];
        
        if (res.data.tickets && res.data.tickets.data) {
          tickets = res.data.tickets.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          tickets = res.data.data;
        } else if (res.data.tickets && Array.isArray(res.data.tickets)) {
          tickets = res.data.tickets;
        }
        
        const gameTickets = tickets.filter((ticket) => {
          const ticketGameId = ticket.game_id || ticket.game?.id;
          return parseInt(ticketGameId) === parseInt(gameId);
        });
        
        console.log(`[Game ${gameId}] Filtered tickets:`, gameTickets.length);
        setMyTickets(gameTickets);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching tickets:`, error);
      showSnackbar("Failed to load tickets", 'error');
    }
  };

  const checkChatStatus = async () => {
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
        setParticipantCount(response.data.total_participants || 0);
        const tokenData = await AsyncStorage.getItem("user");
        if (tokenData) {
          const user = JSON.parse(tokenData);
          const isParticipant = response.data.data.some(p => p.id === user.id);
          setIsChatJoined(isParticipant);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error checking chat status:`, error);
    }
  };

  const joinChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
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

      if (response.data.success) {
        setIsChatJoined(true);
        setParticipantCount(response.data.participant_count || 1);
        navigation.navigate('UserLiveChat', {
          gameId,
          gameName,
          participantCount: response.data.participant_count || 1
        });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error joining chat:`, error);
    }
  };

  const initializeTTS = async () => {
    try {
      await Tts.getInitStatus();
      const availableVoices = await Tts.voices();
      
      const englishVoices = availableVoices.filter(v => v.language.startsWith('en'));

      const maleVoice = englishVoices.find(v => 
        v.name?.toLowerCase().includes('male') || 
        v.id.toLowerCase().includes('male') ||
        v.id.toLowerCase().includes('daniel')
      );

      const femaleVoice = englishVoices.find(v => 
        v.name?.toLowerCase().includes('female') || 
        v.id.toLowerCase().includes('female') ||
        v.id.toLowerCase().includes('samantha')
      );

      setVoices({
        male: maleVoice ? maleVoice.id : englishVoices[0]?.id,
        female: femaleVoice ? femaleVoice.id : englishVoices[1]?.id,
      });
      
      try {
        const savedVoice = await AsyncStorage.getItem('voiceType');
        if (savedVoice) {
          setVoiceType(savedVoice);
        }
      } catch (error) {
        console.log(`[Game ${gameId}] Error loading voice preference:`, error);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error initializing TTS:`, error);
    }
    
    setVoiceLoading(false);
  };

  const updateVoiceSettings = async (type) => {
    const voiceId = type === 'male' ? voices.male : voices.female;
    if (voiceId) {
      stopTtsAndClearQueue(); // Stop current TTS when changing voice
      Tts.setDefaultVoice(voiceId);
      setVoiceType(type);
      
      try {
        await AsyncStorage.setItem('voiceType', type);
      } catch (error) {
        console.log(`[Game ${gameId}] Error saving voice preference:`, error);
      }
      
      setTimeout(() => {
        speak(type);
      }, 500);
    }
  };

  const speak = (gender) => {
    const voiceId = gender === 'male' ? voices.female : voices.male;
    if (voiceId) {
      stopTtsAndClearQueue();
      Tts.setDefaultVoice(voiceId);
    }
  };

  const speakNumber = async (number) => {
    if (!audioEnabled.current) return;
    
    const numStr = number.toString();
    let speechText = '';
    
    if (numStr.length === 1) {
      const digitWord = getSingleDigitWord(number);
      speechText = `Single digit ${digitWord}`;
    } else {
      const singleDigits = numStr.split('').map(digit => {
        switch(digit) {
          case '0': return 'zero';
          case '1': return 'one';
          case '2': return 'two';
          case '3': return 'three';
          case '4': return 'four';
          case '5': return 'five';
          case '6': return 'six';
          case '7': return 'seven';
          case '8': return 'eight';
          case '9': return 'nine';
          default: return digit;
        }
      }).join(' ');
      
      const fullNumberName = getNumberName(number);
      speechText = `Number ${singleDigits}. ${fullNumberName}`;
    }
    
    addToTtsQueue(speechText);
  };

  const getSingleDigitWord = (num) => {
    switch(num) {
      case 1: return 'one';
      case 2: return 'two';
      case 3: return 'three';
      case 4: return 'four';
      case 5: return 'five';
      case 6: return 'six';
      case 7: return 'seven';
      case 8: return 'eight';
      case 9: return 'nine';
      default: return 'zero';
    }
  };

  const getNumberName = (num) => {
    const numberNames = {
      1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
      6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
      11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
      16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
      21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
      26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
      31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
      36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
      41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
      46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
      51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
      56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
      61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
      66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
      71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
      76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
      81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
      86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
    };
    
    return numberNames[num] || num.toString();
  };

  const startAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, SCREEN_WIDTH + 100]
  });

  const loadSounds = async () => {
    try {
      Sound.setCategory('Playback');
      
      const sound = new Sound(
        'https://www.orangefreesounds.com/wp-content/uploads/2017/01/Button-click-sound.mp3',
        null,
        (error) => {
          if (error) {
            console.log(`[Game ${gameId}] Error loading sound from URL:`, error);
            return;
          }
          setClickSound(sound);
        }
      );
    } catch (error) {
      console.log(`[Game ${gameId}] Error in loadSounds:`, error);
    }
  };

  const playClickSound = async () => {
    try {
      if (clickSound) {
        clickSound.play((success) => {
          if (!success) {
            console.log(`[Game ${gameId}] Sound playback failed`);
          }
        });
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error playing sound:`, error);
    }
  };

  const stopAllBlinking = () => {
    Object.values(blinkingIntervals.current).forEach(item => {
      if (item && item.animation && item.animation.stop) {
        item.animation.stop();
      }
    });
    
    Object.values(blinkingTimeouts.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    
    blinkingIntervals.current = {};
    blinkingTimeouts.current = {};
    setBlinkingCells({});
    setBlinkingAnimations({});
    setSelectedPatternForView(null);
    setBlinkingPattern(null);
  };

  const startBlinkingForAllTickets = (pattern, duration = 5000) => {
  console.log("Starting blinking for pattern:", pattern);
  
  // Stop any existing blinking
  stopAllBlinking();
  
  const newBlinkingCells = {};
  const newAnimations = {};
  
  // For each ticket, find the cells that belong to this pattern
  myTickets.forEach(ticket => {
    const patternCells = getPatternCells(ticket, pattern);
    console.log(`Ticket ${ticket.id} has ${patternCells.length} pattern cells`);
    
    if (patternCells.length > 0) {
      newBlinkingCells[ticket.id] = patternCells;
      
      // Create a new animation value for this ticket
      const animValue = new Animated.Value(0);
      newAnimations[ticket.id] = animValue;
      
      console.log(`Created animation for ticket ${ticket.id}`);
    }
  });
  
  // Update state with the new blinking cells and animations
  setBlinkingCells(newBlinkingCells);
  setBlinkingAnimations(newAnimations);
  setBlinkingPattern(pattern);
  
  // Force a re-render
  setUpdateTrigger(prev => prev + 1);
  
  // Start animations after state is updated
  setTimeout(() => {
    console.log("Starting animations now...");
    
    Object.keys(newAnimations).forEach(ticketId => {
      const animValue = newAnimations[ticketId];
      console.log(`Starting animation loop for ticket ${ticketId}`);
      
      // Create the animation loop
      const animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
        ]),
        { iterations: -1 }
      );
      
      // Store the animation reference
      blinkingIntervals.current[ticketId] = animationLoop;
      
      // Start the animation
      animationLoop.start(() => {
        console.log(`Animation ended for ticket ${ticketId}`);
      });
    });
  }, 100);

  // Set timeout to stop blinking after duration
  if (blinkingTimeouts.current.global) {
    clearTimeout(blinkingTimeouts.current.global);
  }
  
  blinkingTimeouts.current.global = setTimeout(() => {
    console.log("Stopping blinking after duration");
    stopAllBlinking();
  }, duration);
};

const getPatternCells = (ticket, pattern) => {
  console.log(`Getting pattern cells for pattern:`, pattern);
  const processedData = processTicketData(ticket.ticket_data);
  const cells = [];
  
  // Extract the base pattern name by removing "_prize" if present
  const patternName = pattern.pattern_name.replace('_prize', '');
  console.log(`Base pattern name: ${patternName}`);
  
  switch(patternName) {
    case 'bamboo':
      for (let row = 0; row < 3; row++) {
        const nonEmptyCells = [];
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null) {
            nonEmptyCells.push({ row, col, cell });
          }
        }
        if (nonEmptyCells.length >= 3) {
          cells.push({ row: nonEmptyCells[2].row, col: nonEmptyCells[2].col });
        }
      }
      break;
      
    case 'bottom_line':
      for (let col = 0; col < 9; col++) {
        const cell = processedData[2][col];
        if (cell && cell.number !== null) {
          cells.push({ row: 2, col });
        }
      }
      break;
      
    case 'breakfast':
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null && cell.number >= 1 && cell.number <= 30) {
            cells.push({ row, col });
          }
        }
      }
      break;
      
    case 'dinner':
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null && cell.number >= 61 && cell.number <= 90) {
            cells.push({ row, col });
          }
        }
      }
      break;
      
    case 'early_five':
      const ticketNumbers = [];
      const ticketNumberPositions = {};
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null) {
            ticketNumbers.push(cell.number);
            ticketNumberPositions[cell.number] = { row, col };
          }
        }
      }
      
      let foundCount = 0;
      for (const calledNumber of calledNumbers) {
        if (ticketNumberPositions[calledNumber] && foundCount < 5) {
          const position = ticketNumberPositions[calledNumber];
          cells.push({ row: position.row, col: position.col });
          foundCount++;
        }
        if (foundCount >= 5) break;
      }
      break;
      
    case 'four_corners':
      const firstRowCells = [];
      for (let col = 0; col < 9; col++) {
        const cell = processedData[0][col];
        if (cell && cell.number !== null) {
          firstRowCells.push({ row: 0, col, cell });
        }
      }
      if (firstRowCells.length > 0) {
        cells.push({ row: 0, col: firstRowCells[0].col });
        cells.push({ row: 0, col: firstRowCells[firstRowCells.length - 1].col });
      }
      
      const lastRowCells = [];
      for (let col = 0; col < 9; col++) {
        const cell = processedData[2][col];
        if (cell && cell.number !== null) {
          lastRowCells.push({ row: 2, col, cell });
        }
      }
      if (lastRowCells.length > 0) {
        cells.push({ row: 2, col: lastRowCells[0].col });
        cells.push({ row: 2, col: lastRowCells[lastRowCells.length - 1].col });
      }
      break;
      
    case 'full_house':
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null) {
            cells.push({ row, col });
          }
        }
      }
      break;
      
    case 'lunch':
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) {
          const cell = processedData[row][col];
          if (cell && cell.number !== null && cell.number >= 31 && cell.number <= 60) {
            cells.push({ row, col });
          }
        }
      }
      break;
      
    case 'middle_line':
      for (let col = 0; col < 9; col++) {
        const cell = processedData[1][col];
        if (cell && cell.number !== null) {
          cells.push({ row: 1, col });
        }
      }
      break;
      
    case 'top_line':
      for (let col = 0; col < 9; col++) {
        const cell = processedData[0][col];
        if (cell && cell.number !== null) {
          cells.push({ row: 0, col });
        }
      }
      break;
      
    default:
      console.log(`Unknown pattern: ${patternName}`);
      break;
  }
  
  console.log(`Found ${cells.length} cells for pattern ${patternName}`);
  return cells;
};

  const getPatternDescription = (patternName) => {
  // Remove "_prize" if present
  const baseName = patternName.replace('_prize', '');
  
  const descriptions = {
    'full_house': 'Mark all numbers on your ticket',
    'early_five': 'First 5 numbers called on your ticket',
    'top_line': 'All numbers in the top row',
    'middle_line': 'All numbers in the middle row',
    'bottom_line': 'All numbers in the bottom row',
    'four_corners': 'Four corner numbers of your ticket',
    'bamboo': 'Third number in each row',
    'breakfast': 'Numbers 1-30',
    'lunch': 'Numbers 31-60',
    'dinner': 'Numbers 61-90',
  };
  
  return descriptions[baseName] || 'Complete this pattern to win prize';
};

  const fetchPatternRewardCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/game/${gameId}/reward-counts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status) {
        return response.data.data.patterns || [];
      }
      return [];
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern reward counts:`, error);
      return [];
    }
  };

  const checkGameCompletion = () => {
    const isNumbersCompleted = calledNumbers.length >= 90;
    const isGameStatusCompleted = gameStatus?.status === 'completed';
    
    if ((isNumbersCompleted || isGameStatusCompleted) && !gameEndShownRef.current) {
      gameEndShownRef.current = true;
      setGameCompleted(true);
      setShowGameEndModal(true);
      startConfettiAnimation();
      
      if (audioEnabled.current) {
        setTimeout(() => {
          addToTtsQueue(`Game completed! All 90 numbers have been called. Thank you for playing ${gameName}!`);
        }, 1000);
      }
    }
  };

  const fetchGamePatternsForViewing = async () => {
    try {
      setLoadingPatterns(true);
      
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/games",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const games = response.data.games.data;
        const currentGame = games.find((game) => game.id === parseInt(gameId));

        if (currentGame && currentGame.pattern_rewards) {
          const gamePatterns = currentGame.pattern_rewards.map(pattern => ({
            ...pattern,
            id: pattern.pattern_id,
            pattern_id: pattern.pattern_id,
            pattern_name: pattern.reward_name.toLowerCase().replace(/ /g, '_'),
            display_name: pattern.reward_name,
            amount: pattern.amount,
          }));
          
          const sortedPatterns = sortPatternsBySequence(gamePatterns);
          setAvailablePatterns(sortedPatterns);
        } else {
          setAvailablePatterns([]);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching game patterns for viewing:`, error);
      showSnackbar("Failed to load patterns", 'error');
      setAvailablePatterns([]);
    } finally {
      setLoadingPatterns(false);
    }
  };

  const handleViewPatterns = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowPatternsModal(true);
    
    fetchGamePatternsForViewing();
  };

  const handlePatternSelect = (pattern) => {
  console.log("Selected pattern:", pattern);
  
  // Ensure pattern has the correct structure
  const patternToUse = {
    ...pattern,
    pattern_name: pattern.pattern_name || pattern.id?.toString() // Adjust based on your data
  };
  
  setSelectedPatternForView(patternToUse);
  setBlinkingPattern(patternToUse);
  setShowPatternsModal(false);
  
  showSnackbar(`Showing ${pattern.display_name} pattern on all tickets`, 'info');
  
  setTimeout(() => {
    startBlinkingForAllTickets(patternToUse, 5000);
  }, 300);
};

  useEffect(() => {
    checkGameCompletion();
  }, [calledNumbers, gameStatus?.status]);

  useEffect(() => {
    console.log(`[Game ${gameId}] calledNumbers changed, forcing re-render`);
    
    // Update last called ref
    if (calledNumbers.length > 0) {
      lastCalledRef.current = calledNumbers[calledNumbers.length - 1];
    }
    
    // Force re-render
    setUpdateTrigger(prev => prev + 1);
    
    // Check if game completed
    if (calledNumbers.length >= 90) {
      checkGameCompletion();
    }
  }, [calledNumbers]);

  const updatePatternCounts = (claimsData) => {
    const ticketPatterns = {};
    const patternCounts = {};

    patternRewards.forEach(pattern => {
      patternCounts[pattern.pattern_id] = {
        claimed: 0,
        total: pattern.limit_count || 0,
        patternName: pattern.reward_name,
      };
    });

    claimsData.forEach(claim => {
      const ticketId = claim.ticket_id;
      const patternId = claim.game_pattern_id;
      
      if (!ticketId || !patternId) return;

      if (!ticketPatterns[ticketId]) {
        ticketPatterns[ticketId] = {};
      }

      if (claim.claim_status === 'approved' || claim.claim_status === 'pending') {
        ticketPatterns[ticketId][patternId] = {
          count: (ticketPatterns[ticketId][patternId]?.count || 0) + 1,
          status: claim.claim_status,
        };

        if (claim.claim_status === 'approved' && patternCounts[patternId]) {
          patternCounts[patternId].claimed += 1;
        }
      }
    });

    setPatternsByTicket(ticketPatterns);
    setTotalPatternCounts(patternCounts);
  };

  const fetchPatternRewards = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/games",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const games = response.data.games.data;
        const currentGame = games.find((game) => game.id === parseInt(gameId));

        if (currentGame && currentGame.pattern_rewards) {
          setPatternRewards(currentGame.pattern_rewards);
          
          const initialCounts = {};
          currentGame.pattern_rewards.forEach(pattern => {
            initialCounts[pattern.pattern_id] = {
              claimed: 0,
              total: pattern.limit_count || 0,
              patternName: pattern.reward_name,
            };
          });
          setTotalPatternCounts(initialCounts);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern rewards:`, error);
    }
  };

  const fetchClaims = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/claims/game/${gameId}/claims`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const newClaims = response.data.data.claims || [];
        const previousClaims = claimsRef.current;
        
        updatePatternCounts(newClaims);
        
        if (!initialClaimsFetched) {
          announcedClaimIds.current.clear();
        }
        
        const notifications = [];
        
        newClaims.forEach(newClaim => {
          const oldClaim = previousClaims.find(old => old.id === newClaim.id);
          
          if (!oldClaim) {
            if (newClaim.claim_status === 'pending') {
              notifications.push({
                type: 'new_claim',
                claim: newClaim,
                message: `🎉 ${newClaim.user_name} submitted a ${newClaim.reward_name} claim!`
              });
            }
          } else {
            if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'approved') {
              notifications.push({
                type: 'claim_approved',
                claim: newClaim,
                message: `🏆 ${newClaim.user_name} WON ₹${newClaim.winning_amount} for ${newClaim.reward_name}! CONGRATULATIONS! 🎊`
              });
            } else if (oldClaim.claim_status === 'pending' && newClaim.claim_status === 'rejected') {
              notifications.push({
                type: 'claim_rejected',
                claim: newClaim,
                message: `❌ ${newClaim.user_name}'s ${newClaim.reward_name} claim was rejected`
              });
            }
          }
        });
        
        if (notifications.length > 0) {
          notifications.forEach((notification, index) => {
            setTimeout(() => {
              showNotification(notification);
            }, index * 2000);
          });
        }
        
        setClaims(newClaims);
        
        if (!initialClaimsFetched) {
          setInitialClaimsFetched(true);
        }
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching claims:`, error);
    }
  };

  const showNotification = (notification) => {
    const { type, claim, message } = notification;
    
    if (announcedClaimIds.current.has(claim.id)) {
      return;
    }
    
    announcedClaimIds.current.add(claim.id);
    
    setTimeout(() => {
      announcedClaimIds.current.delete(claim.id);
    }, 10000);
    
    if (type === 'claim_approved') {
      showSnackbar(message, 'success');
      startWinnerCelebration(claim);
    } else if (type === 'claim_rejected') {
      showSnackbar(message, 'error');
    } else {
      showSnackbar(message, 'info');
    }
    
    if (audioEnabled.current) {
      setTimeout(() => {
        if (type === 'claim_approved') {
          const winningAmount = parseFloat(claim.winning_amount);
          let amountText = winningAmount === 1 ? '1 rupee' : `${winningAmount} rupees`;
          addToTtsQueue(`Congratulations! ${claim.user_name} has won ${amountText} for completing the ${claim.reward_name} pattern! Tambola!`);
        } else if (type === 'new_claim') {
          addToTtsQueue(`${claim.user_name} has submitted a ${claim.reward_name} claim!`);
        }
      }, 1000);
    }
  };

  const startWinnerCelebration = (claim) => {
    setWinningMessage(`🏆 WINNER! 🏆`);
    setWinningUser(claim.user_name);
    setWinningAmount(claim.winning_amount);
    setWinningPattern(claim.reward_name);
    
    celebrationOpacity.setValue(0);
    celebrationScale.setValue(0.5);
    celebrationTranslateY.setValue(50);

    setShowWinningCelebration(true);

    Animated.parallel([
      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(celebrationTranslateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    startConfettiAnimationCelebration();

    setTimeout(() => {
      stopWinningCelebration();
    }, 5000);
  };

  const startConfettiAnimationCelebration = () => {
    confettiTranslateY.current.forEach((anim, index) => {
      anim.setValue(-50);
      Animated.timing(anim, {
        toValue: Dimensions.get("window").height + 50,
        duration: 1500 + Math.random() * 1000,
        delay: index * 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  };

  const stopWinningCelebration = () => {
    Animated.parallel([
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationScale, {
        toValue: 0.5,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationTranslateY, {
        toValue: 50,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowWinningCelebration(false);
    });
  };

  // Fix for Issue #2 & #3: Improved menu handling with better scroll and performance
  const openMenu = async (ticketId) => {
    playClickSound(); // Add haptic feedback
    
    setSelectedTicket(ticketId);
    
    try {
      setLoadingPatterns(true); // Show loading immediately for better UX
      const rewardCountsData = await fetchPatternRewardCounts();
      if (rewardCountsData.length > 0) {
        const patternsWithCounts = rewardCountsData.map(pattern => ({
          id: pattern.game_pattern_id,
          pattern_id: pattern.game_pattern_id,
          pattern_name: pattern.pattern_name,
          display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          amount: pattern.amount,
          total_reward_count: pattern.total_reward_count,
          approved_claims_count: pattern.approved_claims_count,
          pending_claims_count: pattern.pending_claims_count,
          available_reward_count: pattern.available_reward_count,
          is_reward_available: pattern.is_reward_available,
          reward_name: pattern.reward_name,
          game_pattern_id: pattern.game_pattern_id
        }));
        
        const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
        setMenuPatterns(sortedPatterns);
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error fetching pattern counts:`, error);
    } finally {
      setLoadingPatterns(false);
      setMenuVisible(true); // Show menu after data is ready
    }
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedTicket(null);
  };

  const submitClaim = async (ticketId, pattern) => {
    if (isSubmittingClaimRef.current) {
      showSnackbar("Please wait, processing previous claim...", 'warning');
      return;
    }
    
    if (submittingClaim) return;
    
    try {
      isSubmittingClaimRef.current = true;
      setSubmittingClaim(true);
      const token = await AsyncStorage.getItem("token");
      
      const ticket = myTickets.find(t => t.id === ticketId);
      if (!ticket) {
        showSnackbar("Ticket not found", 'error');
        isSubmittingClaimRef.current = false;
        return;
      }

      const ticketPatterns = patternsByTicket[ticketId] || {};
      const patternOnTicket = ticketPatterns[pattern.pattern_id];
      
      if (patternOnTicket && patternOnTicket.status !== 'rejected') {
        showSnackbar(`You have already claimed ${pattern.reward_name || pattern.display_name} on this ticket`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }

      if (pattern.available_reward_count !== undefined && pattern.available_reward_count <= 0) {
        showSnackbar(`${pattern.reward_name || pattern.display_name} claims are no longer available`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }

      if (pattern.is_reward_available === false) {
        showSnackbar(`${pattern.reward_name || pattern.display_name} is not available for claims`, 'error');
        isSubmittingClaimRef.current = false;
        return;
      }

      const response = await axios.post(
        "https://tambolatime.co.in/public/api/user/claims/submit",
        {
          game_id: parseInt(gameId),
          ticket_id: parseInt(ticketId),
          reward_name: pattern.reward_name || pattern.display_name,
          claim_evidence: `Pattern ${pattern.game_pattern_id || pattern.pattern_id} completed on ticket ${ticket.ticket_number}`,
          game_pattern_id: pattern.game_pattern_id || pattern.pattern_id,
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
        showSnackbar(`Claim submitted for ${pattern.reward_name || pattern.display_name}! Waiting for approval.`, 'info');
        
        // Optimistic update
        const updatedTicketPatterns = { ...patternsByTicket };
        if (!updatedTicketPatterns[ticketId]) {
          updatedTicketPatterns[ticketId] = {};
        }
        updatedTicketPatterns[ticketId][pattern.pattern_id] = {
          count: 1,
          status: 'pending',
        };
        setPatternsByTicket(updatedTicketPatterns);
        
        // Background refresh
        Promise.all([
          fetchClaims(),
          fetchPatternRewardCounts().then(rewardCountsData => {
            if (rewardCountsData.length > 0) {
              const patternsWithCounts = rewardCountsData.map(pattern => ({
                id: pattern.game_pattern_id,
                pattern_id: pattern.game_pattern_id,
                pattern_name: pattern.pattern_name,
                display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                amount: pattern.amount,
                total_reward_count: pattern.total_reward_count,
                approved_claims_count: pattern.approved_claims_count,
                pending_claims_count: pattern.pending_claims_count,
                available_reward_count: pattern.available_reward_count,
                is_reward_available: pattern.is_reward_available,
                reward_name: pattern.reward_name,
                game_pattern_id: pattern.game_pattern_id
              }));
              
              const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
              setMenuPatterns(sortedPatterns);
            }
          }),
        ]);
        
      } else {
        showSnackbar(response.data.message || "Failed to submit claim", 'error');
      }
    } catch (error) {
      console.log(`[Game ${gameId}] Error submitting claim:`, error);
      let errorMessage = "Failed to submit claim. Please try again.";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join("\n");
        }
      }

      showSnackbar(errorMessage, 'error');
    } finally {
      isSubmittingClaimRef.current = false;
      setSubmittingClaim(false);
      setMenuVisible(false);
      setSelectedTicket(null);
    }
  };

  const startConfettiAnimation = () => {
    confettiAnimation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  };

  const stopConfettiAnimation = () => {
    confettiAnimation.stopAnimation();
    confettiAnimation.setValue(0);
  };

  const handleCloseGameEndModal = () => {
    stopConfettiAnimation();
    setShowGameEndModal(false);
    navigation.goBack();
  };

  const handleViewWinners = () => {
    stopConfettiAnimation();
    setShowGameEndModal(false);
    navigation.navigate('UserGameWinners', {
      gameId,
      gameName,
      gameData: gameStatus,
      calledNumbers: calledNumbers
    });
  };

  const handleViewAllCalledNumbers = () => {
    navigation.navigate('UserCalledNumbers', {
      gameId,
      gameName,
      calledNumbers,
      voiceType,
      gameData: gameStatus
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchGameStatus(),
      fetchCalledNumbers(),
      fetchMyTickets(),
      checkChatStatus(),
      fetchClaims(),
      fetchPatternRewards(),
      fetchGamePatternsForViewing(),
    ]);
    
    if (!isPusherConnectedRef.current) {
      await reconnectPusher();
    }
    
    setRefreshing(false);
  };

  const handleNumberClick = async (ticketId, cellNumber, isCurrentlyMarked) => {
    if (cellNumber === null || markingLoading) return;
    
    playClickSound();
    
    const cellKey = `${ticketId}-${cellNumber}`;
    
    setProcessingCells(prev => new Set(prev).add(cellKey));
    
    updateTicketState(ticketId, cellNumber, !isCurrentlyMarked);
    
    makeMarkingApiCall(ticketId, cellNumber, isCurrentlyMarked, cellKey);
  };

  const makeMarkingApiCall = async (ticketId, cellNumber, wasMarked, cellKey) => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (wasMarked) {
        await axios.post(
          `https://tambolatime.co.in/public/api/user/tickets/${ticketId}/unmark`,
          { number: cellNumber },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        );
      } else {
        await axios.post(
          "https://tambolatime.co.in/public/api/user/tickets/mark-multiple",
          {
            ticket_marks: [{ ticket_id: ticketId, numbers: [cellNumber] }]
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        );
      }
      
    } catch (error) {
      console.log(`[Game ${gameId}] Error marking/unmarking number:`, error);
      
      showSnackbar("Failed to update number. Please try again.", 'error');
      updateTicketState(ticketId, cellNumber, wasMarked);
    } finally {
      setProcessingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  const updateTicketState = (ticketId, number, isMarked) => {
    setMyTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const updatedTicketData = ticket.ticket_data.map(row =>
            row.map(cell => {
              if (cell && cell.number === number) {
                return { ...cell, is_marked: isMarked };
              }
              return cell;
            })
          );
          
          return { 
            ...ticket, 
            ticket_data: updatedTicketData 
          };
        }
        return ticket;
      })
    );
  };

  const processTicketData = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
    if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
      const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
      ticketData.forEach((row, rowIndex) => {
        row.forEach((cell) => {
          if (cell && cell.number !== null && cell.column !== undefined) {
            processedGrid[rowIndex][cell.column] = cell;
          }
        });
      });
      
      return processedGrid;
    } else if (ticketData[0] && Array.isArray(ticketData[0])) {
      return ticketData.map(row => row.map(cell => cell));
    }
    
    return Array(3).fill(Array(9).fill(null));
  };

  const getTicketsPerRow = () => {
    if (isLandscape) {
      return 2;
    }
    return 1;
  };

  const renderTicketsGrid = () => {
    const ticketsPerRow = getTicketsPerRow();
    const rows = [];
    
    for (let i = 0; i < myTickets.length; i += ticketsPerRow) {
      const rowTickets = myTickets.slice(i, i + ticketsPerRow);
      rows.push(rowTickets);
    }
    
    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.ticketRow}>
        {row.map((ticket, index) => (
          <View 
            key={ticket.id} 
            style={[
              styles.ticketGridItem,
              { width: isLandscape ? '48%' : '100%' }
            ]}
          >
            {renderTicketItem({ item: ticket, index: rowIndex * ticketsPerRow + index })}
          </View>
        ))}
      </View>
    ));
  };

  const renderAllCalledNumbersSection = () => {
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const numberRows = [];
  for (let i = 0; i < 9; i++) {
    numberRows.push(allNumbers.slice(i * 10, (i + 1) * 10));
  }

  const currentCalledNumbers = calledNumbers;
  
  return (
    <View style={styles.allNumbersCard} key={`all-numbers-${updateTrigger}`}>
      <View style={styles.allNumbersHeader}>
        <View style={styles.allNumbersTitleContainer}>
          <MaterialIcons name="format-list-numbered" size={18} color={ACCENT_COLOR} />
          <Text style={styles.allNumbersTitle}>All Numbers (1-90)</Text>
          <View style={styles.calledCountBadge}>
            <Text style={styles.calledCountText}>{currentCalledNumbers.length}/90</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.viewAllGridButton}
          onPress={handleViewAllCalledNumbers}
        >
          <Text style={styles.viewAllGridButtonText}>View All</Text>
          <Ionicons name="expand" size={14} color={ACCENT_COLOR} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.numbersGridCompact}>
        {numberRows.map((row, idx) => (
          <View key={`row-${idx}-${updateTrigger}`} style={styles.numberRow}>
            {row.map((number) => {
              const isCalled = currentCalledNumbers.includes(number);
              const isLatest = currentCalledNumbers.length > 0 && 
                number === currentCalledNumbers[currentCalledNumbers.length - 1];
              
              return (
                <TouchableOpacity
                  key={`${number}-${updateTrigger}`}
                  style={[
                    styles.numberItemCompact,
                    isCalled && styles.calledNumberItem,
                    isLatest && styles.latestNumberItem,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => speakNumber(number)}
                  onLongPress={() => speakNumber(number)}
                >
                  <Text style={[
                    styles.numberItemTextCompact,
                    isCalled && styles.calledNumberText,
                    isLatest && styles.latestNumberText,
                  ]}>
                    {number}
                  </Text>
                  {isLatest && (
                    <View style={styles.latestIndicatorCompact}>
                      <Ionicons name="star" size={8} color={WHITE} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.legendNormal]} />
          <Text style={styles.legendText}>Not Called</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.legendCalled]} />
          <Text style={styles.legendText}>Called</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.legendLatest]} />
          <Text style={styles.legendText}>Latest</Text>
        </View>
      </View>
    </View>
  );
};

  const renderTicketGrid = (ticketData, ticketId) => {
  const processedData = processTicketData(ticketData);
  const blinkingAnim = blinkingAnimations[ticketId];
  const currentBlinkingCells = blinkingCells[ticketId] || [];
  
  console.log(`Rendering ticket ${ticketId}, has animation:`, !!blinkingAnim, 'blinking cells:', currentBlinkingCells.length);
  
  const blinkingCellMap = {};
  currentBlinkingCells.forEach(cell => {
    const key = `${cell.row}-${cell.col}`;
    blinkingCellMap[key] = true;
    console.log(`Cell ${key} should blink for ticket ${ticketId}`);
  });

  return (
    <View style={styles.ticket}>
      {processedData.map((row, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={[
            styles.row,
            { 
              backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
            }
          ]}
        >
          {row.map((cell, colIndex) => {
            const cellObj = cell;
            const cellNumber = cellObj?.number;
            const isMarked = cellObj?.is_marked || false;
            const isEmpty = cellNumber === null || cellNumber === undefined;
            
            const shouldBlink = blinkingCellMap[`${rowIndex}-${colIndex}`];
            
            // Debug for first few cells
            if (rowIndex === 0 && colIndex === 0) {
              console.log(`Cell [${rowIndex},${colIndex}] shouldBlink:`, shouldBlink);
            }
            
            let cellBackgroundColor;
            let cellBorderColor;
            let textColor;
            
            if (isEmpty) {
              cellBackgroundColor = EMPTY_CELL_BG;
              cellBorderColor = CELL_BORDER_COLOR;
              textColor = "transparent";
            } else if (isMarked) {
              cellBackgroundColor = MARKED_CELL_BG;
              cellBorderColor = MARKED_CELL_BORDER;
              textColor = WHITE;
            } else {
              cellBackgroundColor = FILLED_CELL_BG;
              cellBorderColor = CELL_BORDER_COLOR;
              textColor = WHITE;
            }
            
            return (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  { 
                    width: CELL_WIDTH,
                    height: CELL_WIDTH,
                    margin: CELL_MARGIN,
                    backgroundColor: cellBackgroundColor,
                    borderColor: cellBorderColor,
                  },
                  shouldBlink && styles.blinkingCellBorder,
                ]}
                onPress={() => cellNumber && handleNumberClick(ticketId, cellNumber, isMarked)}
                onLongPress={() => cellNumber && speakNumber(cellNumber)}
                disabled={isEmpty || markingLoading}
              >
                {!isEmpty && (
                  <>
                    {shouldBlink && blinkingAnim ? (
                      <Animated.View 
                        style={[
                          {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            backgroundColor: WARNING_ORANGE,
                            opacity: blinkingAnim,
                            transform: [{
                              scale: blinkingAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1.2]
                              })
                            }]
                          }
                        ]}
                      >
                        <Text style={[
                          styles.number, 
                          { 
                            color: textColor,
                            fontWeight: 'bold',
                          }
                        ]}>
                          {cellNumber}
                        </Text>
                      </Animated.View>
                    ) : (
                      <Text style={[styles.number, { color: textColor }]}>
                        {cellNumber}
                      </Text>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

  const renderTicketItem = ({ item, index }) => (
    <View style={styles.ticketItemContainer}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketNumberContainer}>
          <MaterialIcons name="confirmation-number" size={20} color={PRIMARY_COLOR} />
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketLabel}>Ticket #{item.ticket_number}</Text>
          </View>
        </View>
        
        <View style={styles.ticketActions}>
          <TouchableOpacity
            style={styles.viewPatternsButton}
            onPress={() => handleViewPatterns(item.id)}
          >
            <Ionicons name="eye-outline" size={16} color={PRIMARY_COLOR} />
            <Text style={styles.viewPatternsButtonText}>Patterns</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => openMenu(item.id)}
            ref={el => menuRefs.current[index] = el}
          >
            <Ionicons name="trophy" size={16} color={WHITE} />
            <Text style={styles.claimButtonText}>Claim</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ticketCard}>
        {renderTicketGrid(item.ticket_data, item.id)}
      </View>
    </View>
  );

  // Fix for Issue #2 & #3: Improved menu modal with proper scrolling
  const renderPatternMenu = () => {
    if (!selectedTicket) return null;

    const ticketPatterns = patternsByTicket[selectedTicket] || {};
    
    const patternsForClaim = menuPatterns.map(pattern => {
      const patternOnTicket = ticketPatterns[pattern.pattern_id];
      
      const hasAvailableRewards = pattern.available_reward_count !== undefined && pattern.available_reward_count > 0;
      const isRewardAvailable = pattern.is_reward_available !== false;
      
      const isClaimed = patternOnTicket && patternOnTicket.status !== 'rejected';
      
      const isDisabled = isClaimed || !hasAvailableRewards || !isRewardAvailable;
      
      return {
        ...pattern,
        isDisabled,
        isClaimed,
        hasAvailableRewards,
        isRewardAvailable,
        patternOnTicket
      };
    });

    const handleRefreshPatterns = async () => {
      try {
        setLoadingPatterns(true);
        const rewardCountsData = await fetchPatternRewardCounts();
        if (rewardCountsData.length > 0) {
          const patternsWithCounts = rewardCountsData.map(pattern => ({
            id: pattern.game_pattern_id,
            pattern_id: pattern.game_pattern_id,
            pattern_name: pattern.pattern_name,
            display_name: pattern.reward_name.replace(' Prize', '').replace(/_/g, ' ').split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            amount: pattern.amount,
            total_reward_count: pattern.total_reward_count,
            approved_claims_count: pattern.approved_claims_count,
            pending_claims_count: pattern.pending_claims_count,
            available_reward_count: pattern.available_reward_count,
            is_reward_available: pattern.is_reward_available,
            reward_name: pattern.reward_name,
            game_pattern_id: pattern.game_pattern_id
          }));
          
          const sortedPatterns = sortPatternsBySequence(patternsWithCounts);
          setMenuPatterns(sortedPatterns);
          showSnackbar("Patterns refreshed successfully", 'info');
        }
      } catch (error) {
        showSnackbar("Failed to refresh patterns", 'error');
      } finally {
        setLoadingPatterns(false);
      }
    };

    return (
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View 
            style={styles.menuContainer}
            onStartShouldSetResponder={() => true} // Prevent touch from passing through
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Submit Claim</Text>
              <View style={styles.menuHeaderActions}>
                <TouchableOpacity 
                  style={styles.refreshMenuButton}
                  onPress={handleRefreshPatterns}
                  disabled={loadingPatterns}
                >
                  {loadingPatterns ? (
                    <ActivityIndicator size="small" color={ACCENT_COLOR} />
                  ) : (
                    <Ionicons name="refresh" size={20} color={ACCENT_COLOR} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}>
                  <Ionicons name="close" size={24} color={TEXT_LIGHT} />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView 
              ref={menuScrollViewRef}
              style={styles.patternsMenuScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true} // Important for nested scrolling
              bounces={true}
            >
              {loadingPatterns ? (
                <View style={styles.patternsLoadingContainer}>
                  <ActivityIndicator size="large" color={ACCENT_COLOR} />
                  <Text style={styles.patternsLoadingText}>Loading patterns...</Text>
                </View>
              ) : patternsForClaim.length === 0 ? (
                <View style={styles.noPatternsContainer}>
                  <Ionicons name="alert-circle-outline" size={40} color={WARNING_ORANGE} />
                  <Text style={styles.noPatternsText}>No patterns available for this game</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRefreshPatterns}
                  >
                    <Ionicons name="refresh" size={16} color={ACCENT_COLOR} />
                    <Text style={styles.retryButtonText}>Refresh Patterns</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                patternsForClaim.map((pattern, index) => {
                  const isDisabled = pattern.isDisabled;
                  const isClaimed = pattern.isClaimed;
                  const isLimitReached = !pattern.hasAvailableRewards || !pattern.isRewardAvailable;
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.patternMenuItem,
                        isDisabled && styles.disabledPatternItem
                      ]}
                      onPress={() => !isDisabled && submitClaim(selectedTicket, pattern)}
                      disabled={submittingClaim || isDisabled}
                      activeOpacity={0.7}
                    >
                      <View style={styles.patternMenuItemContent}>
                        <Ionicons 
                          name={isClaimed ? "checkmark-circle" : (isLimitReached ? "lock-closed" : "trophy-outline")} 
                          size={20} 
                          color={isClaimed ? SUCCESS_COLOR : (isLimitReached ? ERROR_COLOR : ACCENT_COLOR)} 
                        />
                        <View style={styles.patternMenuItemInfo}>
                          <Text style={[
                            styles.patternMenuItemName,
                            isDisabled && styles.disabledPatternName
                          ]}>
                            {pattern.reward_name || pattern.display_name}
                            {isClaimed && (
                              <Text style={styles.claimedBadge}> ✓ Claimed</Text>
                            )}
                            {!isClaimed && isLimitReached && (
                              <Text style={styles.limitReachedBadge}> ✗ Not Available</Text>
                            )}
                          </Text>
                          <Text style={[
                            styles.patternMenuItemDesc,
                            isDisabled && styles.disabledPatternDesc
                          ]} numberOfLines={2}>
                            Prize: ₹{pattern.amount}
                            {pattern.available_reward_count !== undefined && (
                              <Text style={[
                                styles.patternLimitText,
                                isLimitReached && styles.limitReachedText
                              ]}>
                                {" "}• Available: {pattern.available_reward_count}/{pattern.total_reward_count}
                              </Text>
                            )}
                          </Text>
                        </View>
                        {submittingClaim && pattern.patternOnTicket ? (
                          <ActivityIndicator size="small" color={ACCENT_COLOR} />
                        ) : (
                          <View style={styles.patternStatusContainer}>
                            {isDisabled && !isClaimed && (
                              <Ionicons name="lock-closed" size={16} color={ERROR_COLOR} />
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderPatternsModal = () => {
    if (!selectedTicket) return null;

    return (
      <Modal
        transparent={true}
        visible={showPatternsModal}
        animationType="slide"
        onRequestClose={() => {
          setShowPatternsModal(false);
          stopAllBlinking();
        }}
      >
        <TouchableOpacity
          style={styles.patternsModalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowPatternsModal(false);
            stopAllBlinking();
          }}
        >
          <View 
            style={styles.patternsModalContainer}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.patternsModalHeader}>
              <Text style={styles.patternsModalTitle}>Available Patterns</Text>
              <View style={styles.patternsModalHeaderActions}>
                <TouchableOpacity 
                  onPress={() => fetchGamePatternsForViewing()}
                  style={styles.refreshPatternsButton}
                  disabled={loadingPatterns}
                >
                  {loadingPatterns ? (
                    <ActivityIndicator size="small" color={TEXT_LIGHT} />
                  ) : (
                    <Ionicons name="refresh" size={20} color={TEXT_LIGHT} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowPatternsModal(false);
                    stopAllBlinking();
                  }}
                  style={styles.patternsModalCloseButton}
                >
                  <Ionicons name="close" size={24} color={TEXT_LIGHT} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.patternsModalSubtitle}>
              Tap on a pattern to see it highlighted on ALL your tickets for 5 seconds
            </Text>
            
            {blinkingPattern && (
              <View style={styles.currentBlinkingPatternContainer}>
                <Ionicons name="star" size={18} color={WARNING_ORANGE} />
                <Text style={styles.currentBlinkingPatternText}>
                  Showing: <Text style={styles.currentBlinkingPatternName}>{blinkingPattern.display_name}</Text>
                </Text>
                <TouchableOpacity
                  style={styles.stopBlinkingButton}
                  onPress={stopAllBlinking}
                >
                  <Ionicons name="stop-circle" size={16} color={ERROR_COLOR} />
                  <Text style={styles.stopBlinkingText}>Stop</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.earlyFiveNoteContainer}>
              <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
              <Text style={styles.earlyFiveNoteText}>
                <Text style={styles.earlyFiveNoteBold}>Early Five pattern:</Text> Shows the first 5 called numbers on each ticket
              </Text>
            </View>
            
            {loadingPatterns ? (
              <View style={styles.patternsLoadingContainer}>
                <ActivityIndicator size="large" color={ACCENT_COLOR} />
                <Text style={styles.patternsLoadingText}>Loading patterns...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.patternsList} 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {availablePatterns.length === 0 ? (
                  <View style={styles.noAvailablePatternsContainer}>
                    <Ionicons name="alert-circle-outline" size={40} color={WARNING_ORANGE} />
                    <Text style={styles.noAvailablePatternsText}>No patterns available for this game</Text>
                  </View>
                ) : (
                  availablePatterns.map((pattern, index) => {
                    const isSelected = selectedPatternForView?.id === pattern.id;
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.patternListItem,
                          isSelected && styles.selectedPatternListItem
                        ]}
                        onPress={() => handlePatternSelect(pattern)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.patternListItemContent}>
                          <Ionicons 
                            name="star" 
                            size={18} 
                            color={isSelected ? WARNING_ORANGE : ACCENT_COLOR} 
                          />
                          <View style={styles.patternListItemInfo}>
                            <Text style={styles.patternListItemName}>
                              {pattern.display_name}
                              {isSelected && (
                                <Text style={styles.selectedBadge}> • Selected</Text>
                              )}
                            </Text>
                            <Text style={styles.patternListItemDesc} numberOfLines={2}>
                              {getPatternDescription(pattern.pattern_name)}
                              {pattern.amount && (
                                <Text style={styles.patternAmountText}> • Prize: ₹{pattern.amount}</Text>
                              )}
                            </Text>
                          </View>
                          <View style={styles.patternActionContainer}>
                            {isSelected ? (
                              <Ionicons name="checkmark-circle" size={22} color={SUCCESS_COLOR} />
                            ) : (
                              <Ionicons name="eye" size={18} color={ACCENT_COLOR} />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            )}
            
            <View style={styles.patternsModalFooter}>
              <TouchableOpacity
                style={styles.clearSelectionButton}
                onPress={() => {
                  setSelectedPatternForView(null);
                  stopAllBlinking();
                }}
              >
                <Ionicons name="refresh" size={16} color={TEXT_LIGHT} />
                <Text style={styles.clearSelectionButtonText}>Clear Selection</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.closePatternsButton}
                onPress={() => {
                  setShowPatternsModal(false);
                  setSelectedPatternForView(null);
                  stopAllBlinking();
                }}
              >
                <Text style={styles.closePatternsButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderWinningCelebration = () => {
    if (!showWinningCelebration) return null;

    return (
      <Modal
        transparent={true}
        visible={showWinningCelebration}
        animationType="fade"
        onRequestClose={stopWinningCelebration}
      >
        <View style={styles.winningOverlay}>
          {confettiTranslateY.current.map((anim, index) => (
            <Animated.View
              key={`confetti-${index}`}
              style={[
                styles.confettiParticle,
                {
                  left: `${(index * 5) % 100}%`,
                  transform: [{ translateY: anim }],
                  backgroundColor: [ERROR_COLOR, ACCENT_COLOR, WARNING_ORANGE, SUCCESS_COLOR][index % 4],
                }
              ]}
            />
          ))}

          <Animated.View style={[
            styles.celebrationContent,
            {
              opacity: celebrationOpacity,
              transform: [
                { scale: celebrationScale },
                { translateY: celebrationTranslateY }
              ],
            }
          ]}>
            <View style={styles.celebrationInner}>
              <Ionicons name="trophy" size={40} color={WARNING_ORANGE} style={styles.trophyIcon} />
              
              <Text style={styles.winningTitle}>{winningMessage}</Text>
              
              <View style={styles.winnerInfo}>
                <Text style={styles.winnerName}>{winningUser}</Text>
                <Text style={styles.winnerPattern}>{winningPattern}</Text>
              </View>
              
              <View style={styles.prizeAmountContainer}>
                <Text style={styles.prizeAmount}>₹{winningAmount}</Text>
                <Text style={styles.prizeLabel}>WINNINGS</Text>
              </View>
              
              <View style={styles.celebrationMessage}>
                <Ionicons name="sparkles" size={16} color={WARNING_ORANGE} />
                <Text style={styles.celebrationText}>CONGRATULATIONS!</Text>
                <Ionicons name="sparkles" size={16} color={WARNING_ORANGE} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeCelebrationButton}
              onPress={stopWinningCelebration}
            >
              <Text style={styles.closeCelebrationText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconWrapper}>
            <MaterialIcons name="confirmation-number" size={40} color={PRIMARY_COLOR} />
          </View>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading Game Room...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      <View style={styles.backgroundPattern}>
        <Animated.View 
          style={[
            styles.pokerChip1, 
            { 
              transform: [
                { translateY: translateY1 },
                { translateX: translateY2 }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pokerChip2, 
            { 
              transform: [
                { translateY: translateY2 },
                { translateX: translateY1 }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pokerChip3, 
            { 
              transform: [
                { translateY: translateY1 },
                { translateX: translateY2 }
              ] 
            }
          ]} 
        />
        
        <Animated.View 
          style={[
            styles.shineEffect,
            { 
              transform: [{ translateX: shineTranslateX }],
              opacity: shineAnim
            }
          ]} 
        />
      </View>

      {/* Non-blocking Snackbar - Fix for Issue #4 */}
      <CustomSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
      />

      {renderPatternsModal()}
      {renderWinningCelebration()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showGameEndModal}
        onRequestClose={handleCloseGameEndModal}
      >
        <View style={styles.gameEndModalOverlay}>
          <Animated.View 
            style={[
              styles.confettiContainer,
              {
                transform: [{
                  translateY: confettiAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20]
                  })
                }]
              }
            ]}
          >
            <Ionicons name="confetti" size={150} color={ACCENT_COLOR} style={{ opacity: 0.7 }} />
          </Animated.View>
          
          <View style={styles.gameEndModalContent}>
            <View style={styles.gameEndModalHeader}>
              <Ionicons name="trophy" size={60} color={WARNING_ORANGE} />
              <Text style={styles.gameEndModalTitle}>
                {gameStatus?.status === 'completed' ? "Game Completed!" : "Game Complete! 🎉"}
              </Text>
            </View>
            
            <View style={styles.gameEndModalBody}>
              <Text style={styles.gameEndCongratulations}>
                Congratulations!
              </Text>
              <Text style={styles.gameEndMessage}>
                {gameStatus?.status === 'completed' 
                  ? "The game has been marked as completed by the host!" 
                  : "All 90 numbers have been called! The game has ended."}
              </Text>
              
              <View style={styles.gameEndStats}>
                <View style={styles.endStatItem}>
                  <Text style={styles.endStatValue}>{calledNumbers.length}</Text>
                  <Text style={styles.endStatLabel}>Numbers Called</Text>
                </View>
                <View style={styles.endStatItem}>
                  <Text style={styles.endStatValue}>{myTickets.length}</Text>
                  <Text style={styles.endStatLabel}>Your Tickets</Text>
                </View>
                <View style={styles.endStatItem}>
                  <Text style={styles.endStatValue}>
                    {myTickets.flatMap(t => 
                      t.ticket_data.flat().filter(cell => cell.is_marked)
                    ).length}
                  </Text>
                  <Text style={styles.endStatLabel}>Marked Numbers</Text>
                </View>
              </View>
              
              <Text style={styles.gameEndThanks}>
                Thank you for playing! Check out the winners and claim your prizes.
              </Text>
            </View>
            
            <View style={styles.gameEndModalFooter}>
              <TouchableOpacity
                style={styles.viewWinnersButton}
                onPress={handleViewWinners}
              >
                <Ionicons name="trophy" size={20} color={WHITE} />
                <Text style={styles.viewWinnersButtonText}>View Winners</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseGameEndModal}
              >
                <Text style={styles.closeButtonText}>Exit Game Room</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showVoiceModal}
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVoiceModal(false)}
        >
          <View 
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Voice Type</Text>
              <TouchableOpacity
                onPress={() => setShowVoiceModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={TEXT_LIGHT} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Choose your preferred voice for number announcements
            </Text>
            
            <TouchableOpacity
              style={[
                styles.voiceOption,
                voiceType === 'female' && styles.selectedVoiceOption
              ]}
              onPress={() => updateVoiceSettings('female')}
            >
              <View style={styles.voiceOptionIcon}>
                <Ionicons 
                  name="female" 
                  size={24} 
                  color={voiceType === 'female' ? ACCENT_COLOR : TEXT_LIGHT} 
                />
              </View>
              <View style={styles.voiceOptionInfo}>
                <Text style={styles.voiceOptionName}>Female Voice</Text>
                <Text style={styles.voiceOptionDesc}>Higher pitch, clear pronunciation</Text>
              </View>
              {voiceType === 'female' && (
                <Ionicons name="checkmark-circle" size={24} color={ACCENT_COLOR} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.voiceOption,
                voiceType === 'male' && styles.selectedVoiceOption
              ]}
              onPress={() => updateVoiceSettings('male')}
            >
              <View style={styles.voiceOptionIcon}>
                <Ionicons 
                  name="male" 
                  size={24} 
                  color={voiceType === 'male' ? ACCENT_COLOR : TEXT_LIGHT} 
                />
              </View>
              <View style={styles.voiceOptionInfo}>
                <Text style={styles.voiceOptionName}>Male Voice</Text>
                <Text style={styles.voiceOptionDesc}>Lower pitch, deeper tone</Text>
              </View>
              {voiceType === 'male' && (
                <Ionicons name="checkmark-circle" size={24} color={ACCENT_COLOR} />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {renderPatternMenu()}

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerPattern}>
            <Animated.View 
              style={[
                styles.headerShine,
                { transform: [{ translateX: shineTranslateX }] }
              ]} 
            />
          </View>

          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={WHITE} />
              </TouchableOpacity>

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Game Room</Text>
                <View style={styles.gameInfoContainer}>
                  <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.gameName} numberOfLines={1}>
                    {gameName || "Tambola Game"}
                  </Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={() => setShowVoiceModal(true)}
                >
                  <Text style={styles.voiceButtonText}>
                    Select Gender
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Connection Status Indicator */}
        {/* <View style={[styles.pusherStatusCard, { borderLeftColor: isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR }]}>
          <Ionicons 
            name={isPusherConnectedRef.current ? "wifi" : "wifi-outline"} 
            size={16} 
            color={isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR} 
          />
          <Text style={[styles.pusherStatusText, { color: isPusherConnectedRef.current ? SUCCESS_COLOR : ERROR_COLOR }]}>
            {isPusherConnectedRef.current ? 'Real-time connected' : 'Real-time disconnected - pull to refresh'}
          </Text>
        </View> */}

        <View style={styles.content}>
          {/* All Numbers Section */}
          {renderAllCalledNumbersSection()}

          {/* Last Called Section */}
{/* Last Called Section */}
<View style={styles.card} key={`last-called-${updateTrigger}`}>
  {calledNumbers.length > 0 ? (
    <View style={styles.lastCalledSection}>
      <View style={styles.lastCalledHeader}>
        <Ionicons name="megaphone" size={18} color={ACCENT_COLOR} />
        <Text style={styles.sectionTitle}>Last Called Numbers</Text>
      </View>
      
      {/* FIX: Add a key that changes only when the last number changes */}
      <View 
        key={`last-five-${calledNumbers[calledNumbers.length - 1] || 'none'}`} 
        style={styles.circularNumbersGrid}
      >
        {calledNumbers.slice(-5).reverse().map((num, index) => {
          const isLatest = index === 0; // First item is newest
          return (
            <TouchableOpacity
              key={`${num}-${index}`}
              style={[
                styles.circularNumberItem,
                isLatest && styles.latestCircularNumber
              ]}
              onPress={() => speakNumber(num)}
              onLongPress={() => speakNumber(num)}
            >
              <Text style={[
                styles.circularNumberText,
                isLatest && styles.latestCircularNumberText
              ]}>
                {num}
              </Text>
              {isLatest && (
                <View style={styles.latestBadge}>
                  <Ionicons name="star" size={8} color={WHITE} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={handleViewAllCalledNumbers}
      >
        <Text style={styles.viewAllButtonText}>View All Called Numbers</Text>
        <Ionicons name="chevron-forward" size={14} color={ACCENT_COLOR} />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.waitingSection}>
      <Ionicons name="hourglass-outline" size={32} color={WARNING_ORANGE} />
      <Text style={styles.waitingText}>
        Waiting for numbers to be called...
      </Text>
    </View>
  )}
</View>

          <View style={styles.ticketsSection}>
            {myTickets.length === 0 ? (
              <View style={styles.emptyTicketsContainer}>
                <Ionicons name="ticket-outline" size={60} color={PRIMARY_COLOR} style={{ opacity: 0.7 }} />
                <Text style={styles.emptyTitle}>No Tickets Allocated</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't been allocated any tickets for this game yet
                </Text>
              </View>
            ) : (
              <>
                {blinkingPattern && (
                  <View style={styles.activePatternContainer}>
                    <Ionicons name="star" size={14} color={WARNING_ORANGE} />
                    <Text style={styles.activePatternText}>
                      Showing: <Text style={styles.activePatternName}>{blinkingPattern.display_name}</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.stopBlinkingSmallButton}
                      onPress={stopAllBlinking}
                    >
                      <Ionicons name="close" size={12} color={ERROR_COLOR} />
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.ticketsGridContainer}>
                  {renderTicketsGrid()}
                </View>

                <Text style={styles.ticketsHint}>
                  Tap numbers to mark/unmark them • Long press to hear number • Tap Patterns to view • Tap Claim to submit
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={joinChat}
        activeOpacity={0.9}
      >
        <View style={styles.chatButtonContent}>
          <Ionicons name="chatbubble-ellipses" size={20} color={WHITE} />
          {participantCount > 0 && (
            <View style={styles.chatBadge}>
              <Text style={styles.chatBadgeText}>
                {participantCount > 99 ? '99+' : participantCount}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.chatButtonText}>
          {isChatJoined ? 'Chat' : 'Join Chat'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Add new styles for non-blocking snackbar
const additionalStyles = {
  snackbarAbsoluteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    pointerEvents: 'none',
  },
  snackbarContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snackbarIcon: {
    marginRight: 12,
  },
  snackbarText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
};

// Merge with existing styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  content: {
    padding: HORIZONTAL_MARGIN,
    paddingTop: 20,
    zIndex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  pokerChip1: {
    position: 'absolute',
    top: 80,
    left: SCREEN_WIDTH * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pokerChip2: {
    position: 'absolute',
    top: 120,
    right: SCREEN_WIDTH * 0.15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  pokerChip3: {
    position: 'absolute',
    top: 180,
    left: SCREEN_WIDTH * 0.6,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: ACCENT_COLOR,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  header: {
    paddingTop: 15,
    backgroundColor: PRIMARY_COLOR,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  headerShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: WHITE,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  gameInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gameName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  voiceButtonText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "600",
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  lastCalledSection: {
    marginBottom: 0,
  },
  lastCalledHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    flex: 1,
  },
  circularNumbersGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  circularNumberItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
  },
  latestCircularNumber: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    borderWidth: 2,
  },
  circularNumberText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  latestCircularNumberText: {
    color: WHITE,
    fontWeight: "700",
  },
  latestBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: WHITE,
    borderRadius: 5,
    padding: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 6,
  },
  viewAllButtonText: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  waitingSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  waitingText: {
    fontSize: 14,
    color: WARNING_ORANGE,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  allNumbersCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  allNumbersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allNumbersTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allNumbersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  calledCountBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
  },
  calledCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: WHITE,
  },
  viewAllGridButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  viewAllGridButtonText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  numbersGridCompact: {
    marginVertical: 6,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  numberItemCompact: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: WHITE,
    marginHorizontal: 2,
    position: 'relative',
  },
  calledNumberItem: {
    backgroundColor: SUCCESS_COLOR,
    borderColor: SUCCESS_COLOR,
  },
  latestNumberItem: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
    borderWidth: 2,
  },
  numberItemTextCompact: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  calledNumberText: {
    color: WHITE,
    fontWeight: '700',
  },
  latestNumberText: {
    color: WHITE,
    fontWeight: '900',
  },
  latestIndicatorCompact: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: WHITE,
    borderRadius: 5,
    padding: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  legendNormal: {
    backgroundColor: WHITE,
  },
  legendCalled: {
    backgroundColor: SUCCESS_COLOR,
  },
  legendLatest: {
    backgroundColor: ACCENT_COLOR,
  },
  legendText: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  ticketsSection: {
    marginBottom: 12,
  },
  activePatternContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  activePatternText: {
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 6,
    flex: 1,
  },
  activePatternName: {
    fontWeight: '700',
    color: ACCENT_COLOR,
  },
  stopBlinkingSmallButton: {
    padding: 3,
  },
  ticketsGridContainer: {
    gap: 20,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ticketGridItem: {
    // Width controlled dynamically based on orientation
  },
  ticketWrapper: {
    marginBottom: 16,
  },
  ticketItemContainer: {
    marginBottom: 0,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ticketNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketLabel: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: "600",
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewPatternsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    gap: 4,
  },
  viewPatternsButtonText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    gap: 4,
  },
  claimButtonText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: "600",
  },
  ticketCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: TICKET_PADDING,
    borderWidth: 1.5,
    borderColor: TICKET_BORDER_COLOR,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ticket: {
    backgroundColor: WHITE,
    padding: 0,
    borderWidth: 0,
    borderRadius: 0,
    overflow: "hidden",
    width: CELL_WIDTH * NUM_COLUMNS + CELL_MARGIN * 2 * NUM_COLUMNS,
    alignSelf: 'center',
  },
  row: {
    flexDirection: "row",
    width: '100%',
  },
  cell: {
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    margin: CELL_MARGIN,
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: WHITE,
  },
  // Add to your styles object
blinkingCellBorder: {
  borderWidth: 3,
  borderColor: WARNING_ORANGE,
  shadowColor: WARNING_ORANGE,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 5,
},
  blinkingOverlay: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  ticketsHint: {
    fontSize: 11,
    color: TEXT_LIGHT,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
    lineHeight: 14,
    paddingHorizontal: 4,
  },
  emptyTicketsContainer: {
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 32,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: WHITE,
    borderRadius: 14,
    width: '85%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  menuHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshMenuButton: {
    padding: 5,
  },
  patternsMenuScroll: {
    maxHeight: 300,
  },
  patternMenuItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  disabledPatternItem: {
    backgroundColor: BACKGROUND_COLOR,
    opacity: 0.7,
  },
  patternMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternMenuItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  patternMenuItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 3,
  },
  patternMenuItemDesc: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  patternStatusContainer: {
    marginLeft: 6,
  },
  patternLimitText: {
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  limitReachedText: {
    color: ERROR_COLOR,
    fontWeight: '700',
  },
  claimedBadge: {
    fontSize: 11,
    color: SUCCESS_COLOR,
    fontWeight: '600',
    marginLeft: 4,
  },
  limitReachedBadge: {
    fontSize: 11,
    color: ERROR_COLOR,
    fontWeight: '600',
    marginLeft: 4,
  },
  noPatternsContainer: {
    alignItems: 'center',
    padding: 24,
  },
  noPatternsText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    gap: 6,
  },
  retryButtonText: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  disabledPatternName: {
    color: TEXT_LIGHT,
    textDecorationLine: 'none',
  },
  disabledPatternDesc: {
    color: TEXT_LIGHT,
  },
  patternsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternsModalContainer: {
    backgroundColor: WHITE,
    borderRadius: 16,
    width: '90%',
    maxHeight: '75%',
    overflow: 'hidden',
  },
  patternsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  patternsModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  patternsModalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshPatternsButton: {
    padding: 5,
  },
  patternsModalCloseButton: {
    padding: 5,
  },
  patternsModalSubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  currentBlinkingPatternContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  currentBlinkingPatternText: {
    fontSize: 13,
    color: TEXT_DARK,
    marginLeft: 8,
    flex: 1,
  },
  currentBlinkingPatternName: {
    fontWeight: '700',
    color: ACCENT_COLOR,
  },
  stopBlinkingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: ERROR_COLOR,
    gap: 4,
  },
  stopBlinkingText: {
    fontSize: 12,
    color: ERROR_COLOR,
    fontWeight: '600',
  },
  earlyFiveNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  earlyFiveNoteText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    marginLeft: 8,
    flex: 1,
  },
  earlyFiveNoteBold: {
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  patternsLoadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  patternsLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: TEXT_LIGHT,
  },
  patternsList: {
    maxHeight: 350,
  },
  patternListItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  selectedPatternListItem: {
    backgroundColor: "rgba(79, 172, 254, 0.05)",
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  patternListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternListItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  patternListItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 3,
  },
  patternListItemDesc: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  patternAmountText: {
    color: SUCCESS_COLOR,
    fontWeight: '600',
  },
  selectedBadge: {
    fontSize: 12,
    color: SUCCESS_COLOR,
    fontWeight: '600',
    marginLeft: 4,
  },
  patternActionContainer: {
    marginLeft: 8,
  },
  noAvailablePatternsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noAvailablePatternsText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  patternsModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  clearSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 4,
  },
  clearSelectionButtonText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: '600',
  },
  closePatternsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
  },
  closePatternsButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '600',
  },
  winningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  celebrationContent: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  celebrationInner: {
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  trophyIcon: {
    marginBottom: 8,
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  winningTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: ERROR_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  winnerInfo: {
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    width: '100%',
  },
  winnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 4,
    textAlign: 'center',
  },
  winnerPattern: {
    fontSize: 13,
    color: ERROR_COLOR,
    fontWeight: '600',
    textAlign: 'center',
  },
  prizeAmountContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ERROR_COLOR,
    width: '100%',
  },
  prizeAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: ERROR_COLOR,
    marginBottom: 4,
  },
  prizeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_LIGHT,
    letterSpacing: 1,
  },
  celebrationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  celebrationText: {
    fontSize: 13,
    fontWeight: '800',
    color: TEXT_DARK,
    marginHorizontal: 6,
  },
  closeCelebrationButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  closeCelebrationText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  confettiParticle: {
    width: 6,
    height: 6,
    borderRadius: 1,
    position: 'absolute',
    top: -50,
  },
  gameEndModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gameEndModalContent: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  gameEndModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameEndModalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: ACCENT_COLOR,
    textAlign: 'center',
  },
  gameEndModalBody: {
    marginBottom: 20,
  },
  gameEndCongratulations: {
    fontSize: 20,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 10,
  },
  gameEndMessage: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  gameEndStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  endStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  endStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  endStatLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: '600',
  },
  gameEndThanks: {
    fontSize: 13,
    color: TEXT_LIGHT,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  gameEndModalFooter: {
    gap: 10,
  },
  viewWinnersButton: {
    backgroundColor: ACCENT_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  viewWinnersButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  closeButtonText: {
    color: TEXT_LIGHT,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: TEXT_LIGHT,
    marginBottom: 20,
    lineHeight: 18,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 10,
  },
  selectedVoiceOption: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: "rgba(79, 172, 254, 0.05)",
  },
  voiceOptionIcon: {
    marginRight: 12,
  },
  voiceOptionInfo: {
    flex: 1,
  },
  voiceOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  voiceOptionDesc: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(79, 172, 254, 0.2)",
  },
  loadingSpinner: {
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginTop: 20,
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatButtonContent: {
    position: 'relative',
    marginRight: 6,
  },
  chatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: ERROR_COLOR,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WHITE,
  },
  chatBadgeText: {
    color: WHITE,
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 2,
  },
  chatButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 20,
  },
  // Additional Pusher styles
  pusherStatusCard: {
    backgroundColor: WHITE,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pusherStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  ...additionalStyles, // Merge the additional snackbar styles
});

export default UserGameRoom;
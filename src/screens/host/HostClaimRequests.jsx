// HostClaimRequests.js
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Modal,
  RefreshControl,
  Animated,
  Easing,
  Platform,
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
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

// Colors from UserGameRoom
const PRIMARY_COLOR = "#4facfe";
const ACCENT_COLOR = "#ff9800";
const BACKGROUND_COLOR = "#f5f8ff";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const SUCCESS_COLOR = "#4CAF50";
const ERROR_COLOR = "#E74C3C";
const WARNING_ORANGE = "#ff9800";
const SECTION_BG = "#F8F9FA";
const PRIZE_BG = "#F0F2F5";

// Row colors for ticket grid
const ROW_COLOR_1 = "#f0f8ff";
const ROW_COLOR_2 = "#e6f3ff";
const FILLED_CELL_BG = "#62cff4";
const MARKED_CELL_BG = "#FF5252";
const EMPTY_CELL_BG = "transparent";
const NUMBER_COLOR = WHITE;

// Ticket parameters - REDUCED TICKET SIZE
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 4;

// Calculate ticket width to be 85% of screen width to ensure it fits
const TICKET_CONTAINER_WIDTH = width * 0.8;

// Calculate cell width based on ticket container width
const CELL_WIDTH = Math.floor(
  (TICKET_CONTAINER_WIDTH - (TICKET_PADDING * 2) - (CELL_MARGIN * 2 * NUM_COLUMNS)) / NUM_COLUMNS
);

const HostClaimRequests = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claims, setClaims] = useState([]);
  const [gameInfo, setGameInfo] = useState(null);
  const [summary, setSummary] = useState({ total_pending: 0, average_waiting_minutes: 0 });
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [processingClaim, setProcessingClaim] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });
  
  // Bulk processing states
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkActionModalVisible, setBulkActionModalVisible] = useState(false);
  
  // Animation refs
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  
  // Custom Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');
  
  // Pusher Refs
  const pusherRef = useRef(null);
  const gameChannelRef = useRef(null);
  
  // Reconnection Refs
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 10;
  
  // Refs for latest values to avoid stale closures
  const claimsRef = useRef([]);
  const announcedClaimIds = useRef(new Set());
  const snackbarTimeout = useRef(null);
  
  // Update refs when state changes
  useEffect(() => {
    claimsRef.current = claims;
  }, [claims]);

  // Initialize app and Pusher
  useEffect(() => {
    const initializeApp = async () => {
      try {
        startAnimations();
        await initializePusher();
        await fetchClaims();
        await fetchCalledNumbers();
        setLoading(false);
      } catch (error) {
        console.log("Error initializing app:", error);
        showSnackbar("Failed to initialize. Please try again.", 'error');
        setLoading(false);
      }
    };
    
    initializeApp();
    
    return () => {
      cleanupPusher();
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (snackbarTimeout.current) {
        clearTimeout(snackbarTimeout.current);
      }
    };
  }, []);

  // Initialize Pusher with auto-reconnection
  const initializePusher = async () => {
    try {
      console.log("📱 Initializing Pusher for host game:", gameId);
      
      const pusher = Pusher.getInstance();
      
      await pusher.init({
        apiKey: '9c1d16690beded57332a',
        cluster: 'ap2',
        forceTLS: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        onConnectionStateChange: (currentState, previousState) => {
          console.log(`🔌 Connection state: ${previousState} → ${currentState}`);
          
          if (currentState === 'CONNECTED') {
            console.log('✅ Connected to Pusher');
            reconnectAttemptsRef.current = 0;
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }
          
          if (currentState === 'DISCONNECTED') {
            console.log('❌ Disconnected, scheduling reconnection...');
            scheduleReconnection();
          }
        },
        onError: (message, code, error) => {
          console.log(`❌ Pusher error: ${message}`, error);
          scheduleReconnection();
        },
        onEvent: (event) => {
          console.log(`📨 Event received: ${event.eventName} on ${event.channelName}`);
          handlePusherEvent(event);
        },
        onSubscriptionSucceeded: (channelName, data) => {
          console.log(`✅ Subscribed to ${channelName}`);
        },
        onSubscriptionError: (channelName, message, code, error) => {
          console.log(`❌ Subscription error for ${channelName}:`, error);
        }
      });
      
      await pusher.connect();
      console.log("🚀 Pusher connected");
      
      // Subscribe to admin channel for hosts
      const adminChannelName = `admin.game.${gameId}`;
      console.log(`📡 Subscribing to admin channel: ${adminChannelName}`);
      
      const adminChannel = await pusher.subscribe({
        channelName: adminChannelName,
        onEvent: (event) => {
          console.log(`📢 Admin channel event: ${event.eventName}`);
        }
      });
      
      // Also subscribe to regular game channel for number calls
      const gameChannelName = `game.${gameId}`;
      console.log(`📡 Subscribing to game channel: ${gameChannelName}`);
      
      const gameChannel = await pusher.subscribe({
        channelName: gameChannelName,
        onEvent: (event) => {
          console.log(`📢 Game channel event: ${event.eventName}`);
        }
      });
      
      gameChannelRef.current = { admin: adminChannel, game: gameChannel };
      pusherRef.current = pusher;
      console.log("✅ Pusher initialized successfully with admin and game channels");
      
    } catch (error) {
      console.log("❌ Error initializing Pusher:", error);
      scheduleReconnection();
      throw error;
    }
  };

  const scheduleReconnection = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('⚠️ Max reconnection attempts reached');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(`🔄 Scheduling reconnection attempt ${reconnectAttemptsRef.current + 1} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectPusher();
    }, delay);
  };

  const reconnectPusher = async () => {
    try {
      console.log('🔄 Attempting to reconnect Pusher...');
      reconnectAttemptsRef.current += 1;
      
      await cleanupPusher();
      await initializePusher();
      
      reconnectAttemptsRef.current = 0;
      console.log('✅ Reconnected successfully');
      await fetchClaims();
      await fetchCalledNumbers();
      
    } catch (error) {
      console.log('❌ Reconnection failed:', error);
      scheduleReconnection();
    }
  };

  const cleanupPusher = async () => {
    if (pusherRef.current) {
      try {
        const pusher = Pusher.getInstance();
        
        if (gameChannelRef.current) {
          // Unsubscribe from admin channel
          if (gameChannelRef.current.admin) {
            await pusher.unsubscribe({ channelName: `admin.game.${gameId}` });
            console.log("📤 Unsubscribed from admin channel");
          }
          
          // Unsubscribe from game channel
          if (gameChannelRef.current.game) {
            await pusher.unsubscribe({ channelName: `game.${gameId}` });
            console.log("📤 Unsubscribed from game channel");
          }
          
          gameChannelRef.current = null;
        }
        
        await pusher.disconnect();
        console.log("🔌 Pusher disconnected");
      } catch (error) {
        console.log("❌ Error cleaning up Pusher:", error);
      }
    }
  };

  const handlePusherEvent = (event) => {
    console.log(`🔄 Processing event: ${event.eventName} on ${event.channelName}`);
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      console.log('📦 Event data:', JSON.stringify(data, null, 2));
      
      // Process claim events - they can come from either channel
      if (event.eventName === 'claim.submitted') {
        handleClaimSubmitted(data);
      } 
      else if (event.eventName === 'claim.approved') {
        handleClaimApproved(data);
      }
      else if (event.eventName === 'claim.rejected') {
        handleClaimRejected(data);
      }
      else if (event.eventName === 'number.called') {
        handleNumberCalled(data);
      }
      else {
        console.log(`📭 Unhandled event: ${event.eventName} on ${event.channelName}`);
      }
    } catch (error) {
      console.log("❌ Error handling Pusher event:", error);
    }
  };

  const handleClaimSubmitted = (data) => {
    console.log("📝 Processing claim submitted event:", data);
    
    // Extract claim data - handle both direct claim object and nested claim
    let claimData = data.claim || data;
    
    // Make sure we have the necessary fields
    const newClaim = {
      id: claimData.id,
      game_id: claimData.game_id || gameId,
      user_id: claimData.user_id,
      user_name: claimData.user_name,
      username: claimData.username || claimData.user_name,
      ticket_id: claimData.ticket_id,
      ticket_number: claimData.ticket_number || 1,
      game_pattern_id: claimData.game_pattern_id,
      pattern_name: claimData.pattern_name,
      reward_name: claimData.reward_name || claimData.pattern_name,
      winning_amount: claimData.winning_amount || "100.00",
      ticket_data: claimData.ticket_data || null,
      claimed_at: claimData.claimed_at || new Date().toISOString(),
      time_since_claim: "Just now",
      waiting_time_minutes: 0,
      can_process: true
    };
    
    console.log("📝 Created new claim object:", newClaim);
    
    // Show notification
    showSnackbar(`New claim from ${newClaim.user_name} for ${newClaim.reward_name}!`, 'info');
    
    // Add to claims list if not already present
    setClaims(prevClaims => {
      // Check if claim already exists
      const exists = prevClaims.some(claim => claim.id === newClaim.id);
      if (exists) {
        console.log("Claim already exists, skipping");
        return prevClaims;
      }
      console.log("Adding new claim to list");
      // Add new claim to the beginning of the list
      return [newClaim, ...prevClaims];
    });
    
    // Update summary
    setSummary(prev => ({
      ...prev,
      total_pending: prev.total_pending + 1
    }));
  };

  const handleClaimApproved = (data) => {
    console.log("✅ Processing claim approved event:", data);
    
    const notification = {
      type: 'claim_approved',
      claim: data,
      message: `✅ Claim #${data.id} approved for ${data.user_name} - ${data.reward_name || data.pattern_name} (₹${data.winning_amount})`
    };
    
    if (!announcedClaimIds.current.has(data.id)) {
      announcedClaimIds.current.add(data.id);
      showNotification(notification);
    }
    
    // Remove from pending claims list
    setClaims(prev => prev.filter(claim => claim.id !== data.id));
    setSummary(prev => ({
      ...prev,
      total_pending: Math.max(0, prev.total_pending - 1)
    }));
    
    // Remove from selected claims if present
    setSelectedClaims(prev => prev.filter(id => id !== data.id));
    
    // Refresh claims to ensure consistency
    fetchClaims();
  };

  const handleClaimRejected = (data) => {
    console.log("❌ Processing claim rejected event:", data);
    
    const notification = {
      type: 'claim_rejected',
      claim: data,
      message: `❌ Claim #${data.id} rejected for ${data.user_name} - ${data.reward_name || data.pattern_name}`
    };
    
    showNotification(notification);
    
    // Remove from pending claims list
    setClaims(prev => prev.filter(claim => claim.id !== data.id));
    setSummary(prev => ({
      ...prev,
      total_pending: Math.max(0, prev.total_pending - 1)
    }));
    
    // Remove from selected claims if present
    setSelectedClaims(prev => prev.filter(id => id !== data.id));
    
    // Refresh claims to ensure consistency
    fetchClaims();
  };

  const handleNumberCalled = (data) => {
    console.log("🔔 Processing number called event:", data);
    
    const number = data.number;
    const calledNumbersList = data.called_numbers || data.sorted_numbers || [];
    
    if (calledNumbersList.length > 0) {
      setCalledNumbers(calledNumbersList);
    }
    
    // Check if this number affects any pending claims
    if (calledNumbersList.length > 0) {
      // Optionally refresh claims to update verification status
      fetchClaims();
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
    
    showSnackbar(message, type === 'claim_approved' ? 'success' : 'error');
  };

  const showSnackbar = (message, type = 'info') => {
    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }
    
    setSnackbarVisible(false);
    
    setTimeout(() => {
      setSnackbarType(type);
      setSnackbarMessage(message);
      setSnackbarVisible(true);
      
      snackbarTimeout.current = setTimeout(() => {
        setSnackbarVisible(false);
      }, 3000);
    }, 100);
  };

  const hideSnackbar = () => {
    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }
    setSnackbarVisible(false);
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

  const fetchCalledNumbers = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setCalledNumbers(data.numbers?.called_numbers || []);
      }
    } catch (error) {
      console.log("Error fetching called numbers:", error);
    }
  };

  const fetchClaims = useCallback(async () => {
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
      
      if (response.data.success) {
        console.log("📥 Fetched claims:", response.data.data.claims.length);
        setGameInfo(response.data.data.game);
        setSummary(response.data.data.summary);
        setClaims(response.data.data.claims);
        setPagination(response.data.data.pagination);
        // Clear selected claims on refresh
        setSelectedClaims([]);
      }
    } catch (error) {
      console.log("Error fetching claims:", error);
      showSnackbar("Failed to load claim requests", 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClaims();
    fetchCalledNumbers();
  };

  const showClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setDetailModalVisible(true);
  };

  // Bulk processing functions
  const toggleClaimSelection = (claimId) => {
    setSelectedClaims(prev => {
      if (prev.includes(claimId)) {
        return prev.filter(id => id !== claimId);
      } else {
        return [...prev, claimId];
      }
    });
  };

  const selectAllClaims = () => {
    if (selectedClaims.length === claims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(claims.map(claim => claim.id));
    }
  };

  const openBulkActionModal = () => {
    if (selectedClaims.length === 0) {
      showSnackbar("Please select at least one claim to process.", 'warning');
      return;
    }
    setBulkActionModalVisible(true);
  };

  const closeBulkActionModal = () => {
    setBulkActionModalVisible(false);
  };

  const processBulkClaims = async (action) => {
    if (selectedClaims.length === 0) return;

    const actionText = action === "approve" ? "Approve" : "Reject";
    const confirmMessage = action === "approve" 
      ? `Are you sure you want to approve ${selectedClaims.length} selected claim(s)?`
      : `Are you sure you want to reject ${selectedClaims.length} selected claim(s)?`;

    Alert.alert(
      `${actionText} Selected Claims`,
      confirmMessage,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText,
          style: action === "reject" ? "destructive" : "default",
          onPress: async () => {
            try {
              setBulkProcessing(true);
              const token = await AsyncStorage.getItem("hostToken");
              
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/bulk-process`,
                {
                  claim_ids: selectedClaims,
                  action: action,
                  host_response: `${actionText}d ${selectedClaims.length} claims in bulk`
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success) {
                showSnackbar(
                  `${selectedClaims.length} claim(s) ${actionText.toLowerCase()}d successfully!`, 
                  'success'
                );
                
                // Remove processed claims from the list
                setClaims(prev => prev.filter(claim => !selectedClaims.includes(claim.id)));
                setSummary(prev => ({
                  ...prev,
                  total_pending: prev.total_pending - selectedClaims.length
                }));
                
                // Clear selected claims
                setSelectedClaims([]);
                closeBulkActionModal();
                
                // Refresh data
                fetchClaims();
              }
            } catch (error) {
              console.log("Error processing bulk claims:", error);
              showSnackbar(
                error.response?.data?.message || `Failed to ${actionText.toLowerCase()} claims`,
                'error'
              );
            } finally {
              setBulkProcessing(false);
            }
          }
        }
      ]
    );
  };

  // Updated renderTicketGrid to match winners page design
  const renderTicketGrid = (ticketData) => {
    const processedData = Array.isArray(ticketData) ? ticketData : [];
    
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
              const cellNumber = cell?.number;
              const isMarked = cell?.is_marked;
              const isEmpty = cellNumber === null || cellNumber === undefined;
              
              let cellBackgroundColor;
              if (isEmpty) {
                cellBackgroundColor = EMPTY_CELL_BG;
              } else if (isMarked) {
                cellBackgroundColor = MARKED_CELL_BG;
              } else {
                cellBackgroundColor = FILLED_CELL_BG;
              }
              
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    { 
                      width: CELL_WIDTH,
                      height: CELL_WIDTH,
                      margin: CELL_MARGIN,
                      backgroundColor: cellBackgroundColor,
                      borderColor: PRIMARY_COLOR,
                    },
                    isEmpty && styles.emptyCell,
                    isMarked && styles.markedCell,
                  ]}
                >
                  {!isEmpty && (
                    <Text style={styles.number}>
                      {cellNumber}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // Function to render all called numbers in a compact grid
  const renderAllCalledNumbers = () => {
    if (calledNumbers.length === 0) {
      return (
        <View style={styles.noCalledNumbers}>
          <Ionicons name="megaphone-outline" size={24} color="#9CA3AF" />
          <Text style={styles.noCalledNumbersText}>No numbers called yet</Text>
        </View>
      );
    }

    const cellSize = Math.min(28, (width - 60) / 10);
    
    return (
      <View style={styles.allNumbersContainer}>
        <Text style={styles.calledNumbersTitle}>
          All Called Numbers ({calledNumbers.length}/90)
        </Text>
        
        <View style={styles.calledNumbersGrid}>
          {Array.from({ length: 90 }, (_, i) => i + 1).map((number) => {
            const isCalled = calledNumbers.includes(number);
            
            return (
              <View key={number} style={[styles.numberCell, { width: cellSize, height: cellSize }]}>
                <View style={[
                  styles.numberCellInner,
                  isCalled && styles.calledNumberCell
                ]}>
                  <Text style={[
                    styles.numberText,
                    isCalled && styles.calledNumberText
                  ]}>
                    {number}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={styles.calledNumbersSummary}>
          <View style={styles.summaryItem}>
            <View style={styles.calledIndicator} />
            <Text style={styles.summaryText}>
              Called ({calledNumbers.length})
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <View style={styles.uncalledIndicator} />
            <Text style={styles.summaryText}>
              Remaining ({90 - calledNumbers.length})
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ClaimDetailModal = () => {
    if (!selectedClaim) return null;
    
    return (
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Simplified Header with Player Name */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalTitle}>Claim Verification</Text>
                <Text style={styles.playerName}>
                  Player: {selectedClaim.user_name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDetailModalVisible(false)}
                disabled={!!processingClaim}
              >
                <Ionicons name="close" size={24} color={!!processingClaim ? "#999" : "#666"} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <View style={styles.modalScrollContainer}>
              <ScrollView 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* Pattern and Prize Info */}
                <View style={styles.claimInfoCard}>
                  <View style={styles.claimInfoRow}>
                    <View style={styles.infoItem}>
                      <MaterialIcons name="pattern" size={16} color={SUCCESS_COLOR} />
                      <Text style={styles.infoLabel}>Pattern:</Text>
                      <Text style={styles.infoValue}>{selectedClaim.reward_name || selectedClaim.pattern_name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <FontAwesome name="rupee" size={16} color={SUCCESS_COLOR} />
                      <Text style={styles.infoLabel}>Prize:</Text>
                      <Text style={styles.infoValue}>₹{selectedClaim.winning_amount}</Text>
                    </View>
                  </View>
                  <View style={styles.claimInfoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={16} color={WARNING_ORANGE} />
                      <Text style={styles.infoLabel}>Submitted:</Text>
                      <Text style={styles.infoValue}>{selectedClaim.time_since_claim || `${selectedClaim.waiting_time_minutes} min ago`}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="ticket-outline" size={16} color={PRIMARY_COLOR} />
                      <Text style={styles.infoLabel}>Ticket:</Text>
                      <Text style={styles.infoValue}>#{selectedClaim.ticket_number}</Text>
                    </View>
                  </View>
                </View>

                {/* All Called Numbers Grid */}
                <View style={styles.calledNumbersSection}>
                  {renderAllCalledNumbers()}
                </View>

                {/* Ticket Section - Updated to match winners page */}
                <View style={styles.ticketSection}>
                  <Text style={styles.sectionTitle}>
                    Player's Ticket
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Green cells are marked numbers for {selectedClaim.reward_name || selectedClaim.pattern_name} pattern
                  </Text>
                  <View style={styles.ticketPreviewContainer}>
                    <View style={styles.ticketWrapper}>
                      {selectedClaim.ticket_data && renderTicketGrid(selectedClaim.ticket_data)}
                    </View>
                    
                    {/* Ticket Legend */}
                    <View style={styles.ticketLegend}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: FILLED_CELL_BG }]} />
                        <Text style={styles.legendText}>Unmarked</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: MARKED_CELL_BG }]} />
                        <Text style={styles.legendText}>Marked (Pattern)</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* Fixed Footer with Action Buttons */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  setDetailModalVisible(false);
                  setTimeout(() => rejectClaim(selectedClaim.id), 300);
                }}
                disabled={!!processingClaim || !selectedClaim.can_process}
              >
                <Ionicons name="close-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => {
                  setDetailModalVisible(false);
                  setTimeout(() => approveClaim(selectedClaim.id), 300);
                }}
                disabled={!!processingClaim || !selectedClaim.can_process}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const BulkActionModal = () => {
    return (
      <Modal
        visible={bulkActionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeBulkActionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bulkModalContainer}>
            <View style={styles.bulkModalHeader}>
              <Text style={styles.bulkModalTitle}>
                Process {selectedClaims.length} Selected Claim(s)
              </Text>
              <TouchableOpacity onPress={closeBulkActionModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.bulkModalContent}>
              <Text style={styles.bulkModalText}>
                Choose an action for the selected {selectedClaims.length} claim(s):
              </Text>
              
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.bulkRejectButton]}
                onPress={() => processBulkClaims("reject")}
                disabled={bulkProcessing}
              >
                {bulkProcessing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="close-circle" size={20} color="#FFF" />
                    <Text style={styles.bulkActionButtonText}>Reject Selected</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.bulkActionButton, styles.bulkApproveButton]}
                onPress={() => processBulkClaims("approve")}
                disabled={bulkProcessing}
              >
                {bulkProcessing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={styles.bulkActionButtonText}>Approve Selected</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.bulkCancelButton}
                onPress={closeBulkActionModal}
                disabled={bulkProcessing}
              >
                <Text style={styles.bulkCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCustomSnackbar = () => {
    if (!snackbarVisible) return null;

    const backgroundColor = snackbarType === 'success' ? SUCCESS_COLOR : 
                          snackbarType === 'error' ? ERROR_COLOR : 
                          snackbarType === 'warning' ? WARNING_ORANGE : PRIMARY_COLOR;

    return (
      <Modal
        transparent={true}
        visible={snackbarVisible}
        animationType="fade"
        onRequestClose={hideSnackbar}
      >
        <TouchableOpacity
          style={styles.snackbarOverlay}
          activeOpacity={1}
          onPress={hideSnackbar}
        >
          <View style={[styles.snackbarContainer, { backgroundColor }]}>
            <View style={styles.snackbarContent}>
              {snackbarType === 'success' && (
                <Ionicons name="checkmark-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
              )}
              {snackbarType === 'error' && (
                <Ionicons name="close-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
              )}
              {snackbarType === 'warning' && (
                <Ionicons name="warning" size={20} color={WHITE} style={styles.snackbarIcon} />
              )}
              {snackbarType === 'info' && (
                <Ionicons name="information-circle" size={20} color={WHITE} style={styles.snackbarIcon} />
              )}
              <Text style={styles.snackbarText}>{snackbarMessage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const approveClaim = async (claimId) => {
    Alert.alert(
      "Approve Claim",
      "Are you sure you want to approve this claim? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingClaim(claimId);
              const token = await AsyncStorage.getItem("hostToken");
              
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/${claimId}/approve`,
                { host_response: "Claim verified and approved" },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success) {
                showSnackbar("Claim approved successfully!", 'success');
                
                setClaims(prev => prev.filter(claim => claim.id !== claimId));
                setSummary(prev => ({
                  ...prev,
                  total_pending: prev.total_pending - 1
                }));
                
                // Remove from selected claims if present
                setSelectedClaims(prev => prev.filter(id => id !== claimId));
                
                fetchClaims();
              }
            } catch (error) {
              console.log("Error approving claim:", error);
              showSnackbar(
                error.response?.data?.message || "Failed to approve claim",
                'error'
              );
            } finally {
              setProcessingClaim(null);
            }
          }
        }
      ]
    );
  };

  const rejectClaim = async (claimId) => {
    const claim = claims.find(c => c.id === claimId);
    
    Alert.alert(
      "Reject Claim",
      "Are you sure you want to reject this claim? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingClaim(claimId);
              const token = await AsyncStorage.getItem("hostToken");
              
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/host/games/${gameId}/claims/${claimId}/reject`,
                {
                  host_response: "Claim rejected",
                  reason: "Pattern doesn't match or numbers not called"
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );

              if (response.data.success) {
                showSnackbar("Claim rejected successfully!", 'info');
                
                setClaims(prev => prev.filter(claim => claim.id !== claimId));
                setSummary(prev => ({
                  ...prev,
                  total_pending: prev.total_pending - 1
                }));
                
                // Remove from selected claims if present
                setSelectedClaims(prev => prev.filter(id => id !== claimId));
                
                fetchClaims();
              }
            } catch (error) {
              console.log("Error rejecting claim:", error);
              showSnackbar(
                error.response?.data?.message || "Failed to reject claim",
                'error'
              );
            } finally {
              setProcessingClaim(null);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconWrapper}>
            <MaterialIcons name="assignment-late" size={40} color={PRIMARY_COLOR} />
          </View>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading Claim Requests...</Text>
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
                { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
                { translateX: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }
              ] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.pokerChip2, 
            { 
              transform: [
                { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
                { translateX: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) }
              ] 
            }
          ]} 
        />
        
        <Animated.View 
          style={[
            styles.shineEffect,
            { 
              transform: [{ 
                translateX: shineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, width + 100]
                })
              }],
              opacity: shineAnim
            }
          ]} 
        />
      </View>

      {renderCustomSnackbar()}

      <View style={styles.header}>
        <View style={styles.headerPattern}>
          <Animated.View 
            style={[
              styles.headerShine,
              { 
                transform: [{ 
                  translateX: shineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, width + 100]
                  })
                }]
              }
            ]} 
          />
        </View>

        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{gameName}</Text>
            <Text style={styles.headerSubtitle}>Claim Requests</Text>
          </View>
        </View>
      </View>

      {/* Pusher Connection Status */}
      {/* <View style={styles.pusherStatusCard}>
        <Ionicons 
          name={pusherRef.current ? "radio" : "radio-button-off"} 
          size={14} 
          color={pusherRef.current ? SUCCESS_COLOR : ERROR_COLOR} 
        />
        <Text style={[styles.pusherStatusText, { color: pusherRef.current ? SUCCESS_COLOR : ERROR_COLOR }]}>
          Real-time: {pusherRef.current ? 'Connected' : 'Disconnected'}
        </Text>
      </View> */}

      {/* Summary Card with Bulk Actions */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Ionicons name="checkmark-done" size={24} color={PRIMARY_COLOR} />
          <View style={styles.summaryTitleContainer}>
            <Text style={styles.summaryTitle}>Pending Claims</Text>
          </View>
          <View style={[styles.summaryBadge, { backgroundColor: summary.total_pending > 0 ? ERROR_COLOR : SUCCESS_COLOR }]}>
            <Text style={styles.summaryBadgeText}>
              {summary.total_pending} pending
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Ionicons name="time-outline" size={20} color={WARNING_ORANGE} />
            <Text style={styles.summaryStatValue}>
              {Math.abs(parseFloat(summary.average_waiting_minutes)).toFixed(1)} min
            </Text>
            <Text style={styles.summaryStatLabel}>Avg Wait Time</Text>
          </View>
          <View style={styles.summaryStat}>
            <Ionicons name="people-outline" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.summaryStatValue}>{claims.length}</Text>
            <Text style={styles.summaryStatLabel}>Active Claims</Text>
          </View>
          <View style={styles.summaryStat}>
            <Ionicons name="checkbox-outline" size={20} color={ACCENT_COLOR} />
            <Text style={styles.summaryStatValue}>{selectedClaims.length}</Text>
            <Text style={styles.summaryStatLabel}>Selected</Text>
          </View>
        </View>
        
        {/* Bulk Actions Row */}
        {claims.length > 0 && (
          <View style={styles.bulkActionsRow}>
            <TouchableOpacity
              style={[styles.bulkActionButtonSmall, styles.selectAllButton]}
              onPress={selectAllClaims}
            >
              <Ionicons 
                name={selectedClaims.length === claims.length ? "checkbox" : "square-outline"} 
                size={18} 
                color={PRIMARY_COLOR} 
              />
              <Text style={styles.bulkActionButtonTextSmall}>
                {selectedClaims.length === claims.length ? "Deselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
            
            {selectedClaims.length > 0 && (
              <TouchableOpacity
                style={[styles.bulkActionButtonSmall, styles.processSelectedButton]}
                onPress={openBulkActionModal}
                disabled={bulkProcessing}
              >
                {bulkProcessing ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="play-circle" size={18} color="#FFF" />
                    <Text style={[styles.bulkActionButtonTextSmall, styles.processSelectedText]}>
                      Process ({selectedClaims.length})
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

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
        {claims.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={BORDER_COLOR} />
            <Text style={styles.emptyStateTitle}>No Pending Claims</Text>
            <Text style={styles.emptyStateText}>
              All claim requests have been processed. New claims will appear here in real-time as players submit them.
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Ionicons name="refresh" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.claimsTitle}>Pending Claims ({claims.length})</Text>
            {claims.map((claim) => {
              const isSelected = selectedClaims.includes(claim.id);
              
              return (
                <TouchableOpacity
                  key={claim.id}
                  style={[
                    styles.claimCard,
                    isSelected && styles.selectedClaimCard
                  ]}
                  onPress={() => showClaimDetails(claim)}
                  onLongPress={() => toggleClaimSelection(claim.id)}
                  activeOpacity={0.7}
                  delayLongPress={300}
                >
                  <View style={styles.claimHeader}>
                    <View style={styles.userInfo}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleClaimSelection(claim.id)}
                      >
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                          {isSelected && (
                            <Ionicons name="checkmark" size={14} color="#FFF" />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      <View style={styles.userInfoText}>
                        <Text style={styles.userName}>{claim.user_name}</Text>
                        <Text style={styles.username}>@{claim.username}</Text>
                        <View style={styles.patternContainer}>
                          <MaterialIcons name="pattern" size={12} color={PRIMARY_COLOR} />
                          <Text style={styles.patternName}>{claim.reward_name || claim.pattern_name}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.claimStatus}>
                      <Text style={[styles.waitingTime, { backgroundColor: claim.can_process ? 'rgba(255,152,0,0.1)' : 'rgba(231,76,60,0.1)' }]}>
                        {claim.time_since_claim || `${claim.waiting_time_minutes} min ago`}
                      </Text>
                      <View style={styles.amountContainer}>
                        <FontAwesome name="rupee" size={14} color={SUCCESS_COLOR} />
                        <Text style={styles.winningAmount}>₹{claim.winning_amount}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.claimActions}>
                    <TouchableOpacity
                      style={[styles.quickActionButton, styles.rejectQuickButton]}
                      onPress={() => rejectClaim(claim.id)}
                      disabled={!!processingClaim || !claim.can_process}
                    >
                      {processingClaim === claim.id ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Ionicons name="close" size={16} color="#FFF" />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.quickActionButton, styles.approveQuickButton]}
                      onPress={() => approveClaim(claim.id)}
                      disabled={!!processingClaim || !claim.can_process}
                    >
                      {processingClaim === claim.id ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => showClaimDetails(claim)}
                    >
                      <Text style={styles.detailsButtonText}>Verify Claim</Text>
                      <Ionicons name="chevron-forward" size={16} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
            
            {selectedClaims.length > 0 && (
              <View style={styles.selectedSummary}>
                <Text style={styles.selectedSummaryText}>
                  {selectedClaims.length} claim(s) selected
                </Text>
                <TouchableOpacity
                  style={styles.clearSelectionButton}
                  onPress={() => setSelectedClaims([])}
                >
                  <Text style={styles.clearSelectionText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Text style={styles.refreshHint}>
              Real-time updates enabled • Long press to select multiple
            </Text>
          </>
        )}
      </ScrollView>

      <ClaimDetailModal />
      <BulkActionModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
    left: width * 0.1,
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
    right: width * 0.15,
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
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
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
    marginTop: 16,
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  // Pusher Status Card
  pusherStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  pusherStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  summaryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: WHITE,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_DARK,
    marginTop: 8,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginTop: 4,
  },
  // Bulk Actions
  bulkActionsRow: {
    flexDirection: "row",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  bulkActionButtonSmall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectAllButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 5,
  },
  processSelectedButton: {
    backgroundColor: ACCENT_COLOR,
    borderWidth: 1,
    borderColor: WARNING_ORANGE,
    marginLeft: 5,
  },
  bulkActionButtonTextSmall: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginLeft: 6,
  },
  processSelectedText: {
    color: "#FFF",
  },
  claimsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  claimCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedClaimCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  patternContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79,172,254,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  patternName: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginLeft: 4,
  },
  claimStatus: {
    alignItems: "flex-end",
  },
  waitingTime: {
    fontSize: 12,
    fontWeight: "600",
    color: WARNING_ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  winningAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: SUCCESS_COLOR,
    marginLeft: 4,
  },
  claimActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectQuickButton: {
    backgroundColor: ERROR_COLOR,
  },
  approveQuickButton: {
    backgroundColor: SUCCESS_COLOR,
  },
  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginRight: 6,
  },
  selectedSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  selectedSummaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  clearSelectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  clearSelectionText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_LIGHT,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_LIGHT,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY_COLOR,
    marginLeft: 8,
  },
  refreshHint: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    height: height * 0.85,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: 'hidden',
  },
  // Bulk Modal
  bulkModalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: 'hidden',
  },
  bulkModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  bulkModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    flex: 1,
    marginRight: 10,
  },
  bulkModalContent: {
    padding: 20,
  },
  bulkModalText: {
    fontSize: 15,
    color: TEXT_LIGHT,
    marginBottom: 24,
    textAlign: "center",
  },
  bulkActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bulkRejectButton: {
    backgroundColor: ERROR_COLOR,
  },
  bulkApproveButton: {
    backgroundColor: SUCCESS_COLOR,
  },
  bulkActionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  bulkCancelButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  bulkCancelButtonText: {
    color: TEXT_LIGHT,
    fontSize: 15,
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 6,
  },
  playerName: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  modalScrollContainer: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: "#FFF",
  },
  // Claim Info Card
  claimInfoCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  claimInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: "600",
    marginLeft: 6,
  },
  // Called Numbers Section
  calledNumbersSection: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  allNumbersContainer: {
    marginBottom: 8,
  },
  calledNumbersTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 12,
    textAlign: "center",
  },
  calledNumbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  numberCell: {
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  numberCellInner: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  calledNumberCell: {
    backgroundColor: SUCCESS_COLOR,
    borderColor: SUCCESS_COLOR,
  },
  numberText: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_LIGHT,
  },
  calledNumberText: {
    color: "#FFF",
    fontWeight: "700",
  },
  calledNumbersSummary: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  calledIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: SUCCESS_COLOR,
  },
  uncalledIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  summaryText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginLeft: 6,
  },
  noCalledNumbers: {
    padding: 16,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    alignItems: "center",
  },
  noCalledNumbersText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontStyle: "italic",
    marginTop: 6,
  },
  // Ticket Section - Updated to match winners page
  ticketSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: TEXT_LIGHT,
    marginBottom: 10,
  },
  ticketPreviewContainer: {
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: SECTION_BG,
    padding: 10,
    borderRadius: 8,
  },
  ticketWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // Ticket grid styles
  ticket: {
    backgroundColor: WHITE,
    padding: TICKET_PADDING,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'center',
    width: TICKET_CONTAINER_WIDTH,
  },
  row: {
    flexDirection: "row",
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  markedCell: {
    borderColor: MARKED_CELL_BG,
  },
  number: {
    fontSize: 14,
    fontWeight: "bold",
    color: NUMBER_COLOR,
  },
  ticketLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  legendText: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  // Modal Actions
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rejectButton: {
    backgroundColor: ERROR_COLOR,
  },
  approveButton: {
    backgroundColor: SUCCESS_COLOR,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Snackbar Styles
  snackbarOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
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
});

export default HostClaimRequests;
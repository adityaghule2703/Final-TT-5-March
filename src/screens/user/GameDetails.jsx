import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Linking,
  Platform,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#4facfe",
  primaryGradient: ['#359df9', '#64d8f8'],
  secondary: "#FDB800",
  secondaryGradient: ['#FDB800', '#FF8C00'],
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  live: "#4CAF50",
  liveGradient: ['#4CAF50', '#45a049'],
  scheduled: "#ff9800",
  scheduledGradient: ['#ff9800', '#f57c00'],
  completed: "#ff9800",
  completedGradient: ['#ff9800', '#f57c00'],
  
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
  
  purple: "#9B59B6",
  purpleGradient: ['#9B59B6', '#8E44AD'],
  orange: "#FF9800",
  orangeGradient: ['#FF9800', '#F57C00'],
  teal: "#4ECDC4",
  tealGradient: ['#4ECDC4', '#2AA7A0'],
  red: "#EF4444",
  redGradient: ['#EF4444', '#DC2626'],
  green: "#10B981",
  greenGradient: ['#10B981', '#059669'],
};

const CustomLoader = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const messages = [
    "Loading game details...",
    "Fetching game status 🎮",
    "Checking your tickets 🎟️",
    "Getting ready...",
    "Almost there! 🔥",
    "Setting up your game..."
  ];

  const [currentText, setCurrentText] = useState(0);
  const [animationLoop, setAnimationLoop] = useState(true);

  useEffect(() => {
    const animations = [];
    
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animations.push(bounceAnimation);
    bounceAnimation.start();

    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const dot1Animation = animateDot(dot1, 0);
    const dot2Animation = animateDot(dot2, 150);
    const dot3Animation = animateDot(dot3, 300);
    
    animations.push(dot1Animation, dot2Animation, dot3Animation);
    dot1Animation.start();
    dot2Animation.start();
    dot3Animation.start();

    const floatAnimation = Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    animations.push(floatAnimation);
    floatAnimation.start();

    const slideAnimation = Animated.loop(
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animations.push(slideAnimation);
    slideAnimation.start();

    const textInterval = setInterval(() => {
      if (animationLoop) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentText((prev) => (prev + 1) % messages.length);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }
    }, 2500);

    return () => {
      setAnimationLoop(false);
      clearInterval(textInterval);
      animations.forEach(animation => {
        if (animation && typeof animation.stop === 'function') {
          animation.stop();
        }
      });
      bounceAnim.stopAnimation();
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      floatAnim.stopAnimation();
      slideAnim.stopAnimation();
      fadeAnim.stopAnimation();
    };
  }, []);

  const floatUp = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      if (value >= width) {
        slideAnim.setValue(-width);
      }
    });
    
    return () => {
      slideAnim.removeListener(listener);
    };
  }, [slideAnim, width]);

  return (
    <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
      <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>
        17
      </Animated.Text>

      <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>
        42
      </Animated.Text>

      <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>
        Houzie Timez
      </Animated.Text>

      <View style={styles.loaderContainerDots}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>

      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        {messages[currentText]}
      </Animated.Text>

      <Animated.View
        style={[
          styles.ticketStrip,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.ticketText}>🎮 Loading Game...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const GameDetails = ({ route, navigation }) => {
  const { game } = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketMessage, setTicketMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [myTicketCount, setMyTicketCount] = useState(0);
  const [myRequestCount, setMyRequestCount] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [callingStatus, setCallingStatus] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  
  const requestButtonScale = useRef(new Animated.Value(1)).current;
  const myTicketsButtonScale = useRef(new Animated.Value(1)).current;
  const myRequestsButtonScale = useRef(new Animated.Value(1)).current;
  const joinRoomButtonScale = useRef(new Animated.Value(1)).current;
  const resultsButtonScale = useRef(new Animated.Value(1)).current;
  const submitButtonScale = useRef(new Animated.Value(1)).current;
  
  const letterAnims = useRef([]);

  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const MAX_TICKETS_PER_USER = 4;

  useEffect(() => {
    letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
    letterAnims.current.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 80),
          Animated.timing(anim, {
            toValue: 1.4,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.bounce,
          }),
          Animated.delay(1800),
        ])
      ).start();
    });

    startAnimations();
    
    startPulseAnimation(requestButtonScale, 800);
    startPulseAnimation(myTicketsButtonScale, 900);
    startPulseAnimation(myRequestsButtonScale, 1000);
    startPulseAnimation(joinRoomButtonScale, 1100);
    startPulseAnimation(resultsButtonScale, 1200);
    startPulseAnimation(submitButtonScale, 800);

    fetchAllData().finally(() => {
      setInitialLoading(false);
    });

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData();
      setJoiningRoom(false);
      setHasJoinedRoom(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const calculateTotalPrizePool = () => {
    if (!game.pattern_rewards || game.pattern_rewards.length === 0) {
      return null;
    }
    
    const total = game.pattern_rewards.reduce((sum, reward) => {
      const amount = parseFloat(reward.amount) || 0;
      const count = parseInt(reward.reward_count) || 1;
      return sum + (amount * count);
    }, 0);
    
    return total;
  };

  const totalPrizePool = calculateTotalPrizePool();

  const getWhatsAppNumber = () => {
    if (game.host_mobile) {
      return game.host_mobile;
    }
    if (game.user?.mobile) {
      return game.user.mobile;
    }
    return "8007395749";
  };

  const createWhatsAppMessage = () => {
    const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    
    const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
    const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
    const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
    const hostName = game.user?.name || "Game Host";
    
    return `🎯 *HOUZIE TIMEZ TICKET REQUEST* 🎯

🎮 *Game Details:*
• Game Name: ${game.game_name}
• Game ID: ${game.game_code}
• Date: ${gameDate} ${game.game_start_time}
• Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
• Host: ${hostName}
• Total Prize Pool: ₹${totalPrizePool?.toLocaleString() || "Exciting Prizes"}

🎫 *Ticket Request:*
• Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
• Total Amount: ${totalAmount}

📝 *Additional Message:*
${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

💰 *Payment Information:*
• UPI ID: ${getWhatsAppNumber()}@ybl
• PhonePe/Paytm: ${getWhatsAppNumber()}
• Please send payment screenshot with your name

✅ *Confirmation Required:*
Please confirm my ticket allocation and share payment details if needed.

Thank you! 🙏
Looking forward to playing Houzie! 🎲🎉`;
  };

  const redirectToWhatsApp = () => {
    const whatsappNumber = getWhatsAppNumber();
    const message = createWhatsAppMessage();
    const whatsappUrl = `whatsapp://send?phone=+91${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          const webWhatsappUrl = `https://wa.me/+91${whatsappNumber}?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
          [{ text: "OK" }]
        );
      });
  };

  const startPulseAnimation = (anim, duration = 800) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.08,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
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

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100]
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchGameStatus(),
        fetchMyTicketCount(),
        fetchMyRequestCount(),
        fetchTotalTicketsInGame()
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const ToastComponent = () => {
    if (!toast.visible) return null;
    
    useEffect(() => {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <LinearGradient
        colors={toast.type === "success" ? COLORS.greenGradient : COLORS.redGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.toast}
      >
        <Ionicons 
          name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
          size={20} 
          color={COLORS.surface} 
        />
        <Text style={styles.toastText}>{toast.message}</Text>
      </LinearGradient>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchGameStatus(), 
      fetchMyTicketCount(), 
      fetchMyRequestCount(),
      fetchTotalTicketsInGame()
    ]).finally(() =>
      setRefreshing(false)
    );
  }, []);

  const fetchGameStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setGameStatus(data.game);
        setCallingStatus(data.calling);
        setCalledNumbers(data.numbers?.called_numbers || []);
        
        if (data.calling?.is_running && !data.calling?.is_paused) {
          setTimer(data.calling?.interval_seconds || 60);
        }
      }
    } catch (error) {
    }
  };

  const fetchMyTicketCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const gameTickets = res.data.tickets.data.filter(
          (ticket) => ticket.game_id == game.id
        );
        setMyTicketCount(gameTickets.length);
      }
    } catch (error) {
    }
  };

  const fetchMyRequestCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const gameRequests = res.data.ticket_requests.data.filter(
          (request) => request.game_id === game.id
        );
        setMyRequestCount(gameRequests.length);
      }
    } catch (error) {
    }
  };

  const fetchTotalTicketsInGame = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const ticketsRes = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const requestsRes = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (ticketsRes.data.success && requestsRes.data.success) {
        const allocatedTickets = ticketsRes.data.tickets.data.filter(
          (ticket) => ticket.game_id == game.id
        ).length;
        
        const pendingRequests = requestsRes.data.ticket_requests.data.filter(
          (request) => 
            request.game_id == game.id && 
            request.status === 'pending'
        ).length;
        
        const total = allocatedTickets + pendingRequests;
        setTotalTicketsInGame(total);
      }
    } catch (error) {
    }
  };

  const updateGameRoomStatus = async () => {
    try {
      setJoiningRoom(true);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.post(
        `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
        {
          is_active: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setHasJoinedRoom(true);
        showToast("Joined game room successfully!", "success");
        navigation.navigate("UserGameRoom", { 
          gameId: game.id,
          gameName: game.game_name,
          gameStatus: gameStatus?.status
        });
        setJoiningRoom(false);
      } else {
        showToast(response.data.message || "Failed to join game room", "error");
        setJoiningRoom(false);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to join game room. Please try again.",
        "error"
      );
      setJoiningRoom(false);
    }
  };

  const handleRequestTickets = async () => {
    if (hasReachedTicketLimit()) {
      showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
      return;
    }

    const remaining = getRemainingTickets();
    if (ticketQuantity > remaining) {
      showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
      return;
    }

    if (ticketQuantity < 1 || ticketQuantity > 4) {
      showToast("Ticket quantity must be between 1 and 4", "error");
      return;
    }

    setRequestLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://tambolatime.co.in/public/api/user/ticket-requests/send",
        {
          game_id: game.id,
          ticket_quantity: ticketQuantity,
          message:
            ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isSuccess = 
        response.data.success === true || 
        response.data.status === true || 
        response.data.message?.toLowerCase().includes("success");

      if (isSuccess) {
        const whatsappNumber = getWhatsAppNumber();
        showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
        setTicketModalVisible(false);
        setTicketQuantity(1);
        setTicketMessage("");
        
        fetchMyRequestCount();
        fetchMyTicketCount();
        fetchTotalTicketsInGame();
        
        setTimeout(() => {
          redirectToWhatsApp();
        }, 1000);
        
        setTimeout(() => {
          navigation.navigate("TicketRequestsScreen", { 
            gameId: game.id,
            gameName: game.game_name 
          });
        }, 4000);
      } else {
        const errorMessage = response.data.message || 
                            response.data.error || 
                            "Failed to submit request";
        showToast(errorMessage, "error");
      }
    } catch (error) {
      let errorMessage = "Failed to submit ticket request. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
      
      showToast(errorMessage, "error");
    } finally {
      setRequestLoading(false);
    }
  };

  const navigateToTickets = () => {
    navigation.navigate("TicketsScreen", { game });
  };

  const navigateToMyRequests = () => {
    navigation.navigate("TicketRequestsScreen", { 
      gameId: game.id,
      gameName: game.game_name 
    });
  };

  const handleJoinGameRoom = () => {
    if (gameStatus?.status === 'scheduled') {
      showToast("Game has not started yet!", "info");
      return;
    }
    
    if (hasJoinedRoom) {
      navigation.navigate("UserGameRoom", { 
        gameId: game.id,
        gameName: game.game_name,
        gameStatus: gameStatus?.status
      });
    } else {
      updateGameRoomStatus();
    }
  };

  const renderTicketLimitInfo = () => {
    const remaining = getRemainingTickets();
    const hasLimit = hasReachedTicketLimit();
    
    return (
      <LinearGradient
        colors={hasLimit ? [COLORS.red + '10', COLORS.red + '05'] : [COLORS.primary + '10', COLORS.primary + '05']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.ticketLimitContainer,
          hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
        ]}
      >
        <LinearGradient
          colors={hasLimit ? COLORS.redGradient : COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ticketLimitIcon}
        >
          <Ionicons 
            name={hasLimit ? "alert-circle" : "ticket"} 
            size={16} 
            color={COLORS.surface} 
          />
        </LinearGradient>
        <View style={styles.ticketLimitInfo}>
          <Text style={[
            styles.ticketLimitTitle,
            hasLimit && styles.ticketLimitTitleReached
          ]}>
            {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
          </Text>
          <Text style={styles.ticketLimitText}>
            {hasLimit 
              ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
              : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
            }
          </Text>
        </View>
      </LinearGradient>
    );
  };

  const getRemainingTickets = () => {
    return MAX_TICKETS_PER_USER - totalTicketsInGame;
  };

  const hasReachedTicketLimit = () => {
    return totalTicketsInGame >= MAX_TICKETS_PER_USER;
  };

  const canRequestTickets = () => {
    const remaining = getRemainingTickets();
    return ticketQuantity <= remaining && remaining > 0;
  };

  const renderBackgroundPatterns = () => (
    <View style={styles.backgroundPattern}>
      <Animated.View 
        style={[
          styles.pokerChip1, 
          { 
            transform: [
              { translateY: translateY1 },
              { translateX: translateY2 },
              { rotate }
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
              { translateX: translateY1 },
              { rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg']
              }) }
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
      
      <LinearGradient
        colors={['rgba(255,152,0,0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.yellowGradient}
      />
      <LinearGradient
        colors={['transparent', 'rgba(79,172,254,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.blueGradient}
      />
    </View>
  );

  const renderHeaderPatterns = () => (
    <View style={styles.headerPattern}>
      <Animated.View 
        style={[
          styles.headerShine,
          { transform: [{ translateX: shineTranslateX }] }
        ]} 
      />
    </View>
  );

  const Header = () => {
    const gameNameLetters = game.game_name.split('').slice(0, 8).map((char, index) => ({
      char,
      index: index + 10,
      isSpecial: index === 3 || index === 6
    }));

    return (
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {renderHeaderPatterns()}
        
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <View style={styles.cartoonTitleRow}>
                {gameNameLetters.map((item) => (
                  <Animated.Text
                    key={item.index}
                    style={[
                      styles.cartoonLetter,
                      item.isSpecial && styles.specialCartoonLetter,
                      { 
                        transform: [{ scale: letterAnims.current[item.index] || 1 }],
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {item.char}
                  </Animated.Text>
                ))}
              </View>
              <View style={styles.gameCodeContainer}>
                <MaterialIcons
                  name="fingerprint"
                  size={14}
                  color={COLORS.surface}
                />
                <Text style={styles.gameCode}>{game.game_code}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ToastComponent />
      {renderBackgroundPatterns()}
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={styles.content}>
          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardPattern}
            />
            
            <View style={styles.cardHeader}>
              <View style={styles.gameIconContainer}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gameIconWrapper}
                >
                  <MaterialIcons name="confirmation-number" size={32} color={COLORS.secondary} />
                </LinearGradient>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>
                    {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
                      ? 'Game Status' 
                      : 'Game Schedule'
                    }
                  </Text>
                  <LinearGradient
                    colors={gameStatus?.status === 'live' ? COLORS.liveGradient : 
                            gameStatus?.status === 'completed' ? COLORS.completedGradient : 
                            COLORS.scheduledGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.statusBadge}
                  >
                    <Ionicons 
                      name={
                        gameStatus?.status === 'live' 
                          ? 'radio-button-on' 
                          : gameStatus?.status === 'completed'
                          ? 'trophy'
                          : 'time'
                      } 
                      size={12} 
                      color={COLORS.surface} 
                    />
                    <Text style={styles.statusBadgeText}>
                      {gameStatus?.status?.toUpperCase() || 'LOADING'}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
            
            {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
              <View>
                <Text style={styles.cardDescription}>
                  {gameStatus?.status === 'live'
                    ? "The game is now live! Number calling has started."
                    : "Game has been completed. You can view winners and results below."
                  }
                </Text>
                {callingStatus?.is_running ? (
                  <View style={styles.statsContainer}>
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="megaphone" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Called</Text>
                    </LinearGradient>
                    
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="time" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {timer}s
                      </Text>
                      <Text style={styles.statLabel}>Next Call</Text>
                    </LinearGradient>
                    
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="grid" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {90 - calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Remaining</Text>
                    </LinearGradient>
                  </View>
                ) : gameStatus?.status === 'completed' ? (
                  <View style={styles.statsContainer}>
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Total Called</Text>
                    </LinearGradient>
                    
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="trophy" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        Completed
                      </Text>
                      <Text style={styles.statLabel}>Status</Text>
                    </LinearGradient>
                    
                    <LinearGradient
                      colors={[COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statCard}
                    >
                      <LinearGradient
                        colors={COLORS.prizeGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIcon}
                      >
                        <Ionicons name="time" size={20} color={COLORS.primary} />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {game.game_start_time}
                      </Text>
                      <Text style={styles.statLabel}>Started At</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <Text style={styles.waitingText}>
                    Number calling will start soon...
                  </Text>
                )}
                
                {gameStatus?.status === 'completed' ? (
                  <View>
                    <Animated.View style={{ transform: [{ scale: joinRoomButtonScale }] }}>
                      <TouchableOpacity
                        style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
                        onPress={() => {
                          navigation.navigate("UserGameWinners", { 
                            gameId: game.id,
                            gameName: game.game_name,
                            gameData: game,
                            calledNumbers: calledNumbers
                          });
                        }}
                        disabled={joiningRoom}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={COLORS.primaryGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.primaryButtonGradient}
                        >
                          <LinearGradient
                            colors={COLORS.glassGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.glassEffectOverlay}
                          />
                          {joiningRoom ? (
                            <ActivityIndicator size="small" color={COLORS.surface} />
                          ) : (
                            <>
                              <Ionicons name="trophy" size={20} color={COLORS.surface} />
                              <Text style={styles.primaryButtonText}>
                                Game Winners
                              </Text>
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                    
                    <Animated.View style={{ transform: [{ scale: resultsButtonScale }] }}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate("UserGameResult", { 
                          gameId: game.id,
                          gameName: game.game_name 
                        })}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.surface, COLORS.surface]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.secondaryButtonGradient}
                        >
                          <Ionicons name="stats-chart" size={20} color={COLORS.primary} />
                          <Text style={styles.secondaryButtonText}>Game Results</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ) : (
                  <Animated.View style={{ transform: [{ scale: joinRoomButtonScale }] }}>
                    <TouchableOpacity
                      style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
                      onPress={handleJoinGameRoom}
                      disabled={joiningRoom}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={COLORS.primaryGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.primaryButtonGradient}
                      >
                        <LinearGradient
                          colors={COLORS.glassGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.glassEffectOverlay}
                        />
                        {joiningRoom ? (
                          <ActivityIndicator size="small" color={COLORS.surface} />
                        ) : (
                          <>
                            <Ionicons 
                              name="enter" 
                              size={20} 
                              color={COLORS.surface} 
                            />
                            <Text style={styles.primaryButtonText}>
                              {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
                            </Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            ) : (
              <View>
                <Text style={styles.cardDescription}>
                  Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })} at {game.game_start_time}
                </Text>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scheduledBadgeContainer}
                >
                  <Ionicons name="calendar" size={20} color={COLORS.primary} />
                  <Text style={styles.scheduledBadgeText}>
                    Game is Scheduled
                  </Text>
                </LinearGradient>
              </View>
            )}
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Game Details</Text>
              <Ionicons name="game-controller" size={24} color={COLORS.secondary} />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="calendar" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {new Date(game.game_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="time" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {game.game_start_time}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <MaterialIcons name="account-balance-wallet" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Total Prize Pool</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {totalPrizePool ? `₹${totalPrizePool.toLocaleString()}` : "Exciting Prizes"}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="person" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Host</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {game.user?.name || 'Houzie Timez'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="call" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Host Contact</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {getWhatsAppNumber()}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <MaterialIcons name="confirmation-number" size={16} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Per Ticket</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
                  </Text>
                </View>
              </View>
            </View>

            {renderTicketLimitInfo()}

            <View style={styles.myCountContainer}>
              <Animated.View style={{ transform: [{ scale: myTicketsButtonScale }], flex: 1 }}>
                <TouchableOpacity
                  style={[
                    styles.countButton,
                    myTicketCount > 0 ? styles.hasCountButton : styles.noCountButton,
                  ]}
                  onPress={navigateToTickets}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.prizeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.countIcon}
                  >
                    <Ionicons name="ticket" size={20} color={COLORS.primary} />
                  </LinearGradient>
                  <View style={styles.countInfo}>
                    <Text style={styles.countLabel}>My Tickets</Text>
                    <Text style={[
                      styles.countValue,
                      myTicketCount > 0 ? styles.hasCountValue : styles.noCountValue,
                    ]}>
                      {myTicketCount > 0
                        ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
                        : "No Tickets"}
                    </Text>
                  </View>
                  {myTicketCount > 0 && (
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: myRequestsButtonScale }], flex: 1 }}>
                <TouchableOpacity
                  style={[
                    styles.countButton,
                    myRequestCount > 0 ? styles.hasCountButton : styles.noCountButton,
                  ]}
                  onPress={navigateToMyRequests}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.prizeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.countIcon}
                  >
                    <Ionicons name="list-circle" size={20} color={COLORS.primary} />
                  </LinearGradient>
                  <View style={styles.countInfo}>
                    <Text style={styles.countLabel}>My Requests</Text>
                    <Text style={[
                      styles.countValue,
                      myRequestCount > 0 ? styles.hasCountValue : styles.noCountValue,
                    ]}>
                      {myRequestCount > 0
                        ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
                        : "No Requests"}
                    </Text>
                  </View>
                  {myRequestCount > 0 && (
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>

            {game.message && (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.messageCard}
              >
                <View style={styles.messageHeader}>
                  <MaterialIcons name="message" size={18} color={COLORS.primary} />
                  <Text style={styles.messageTitle}>Host Message</Text>
                </View>
                <Text style={styles.messageContent}>{game.message}</Text>
              </LinearGradient>
            )}
          </LinearGradient>

          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actions</Text>
              <Ionicons name="flash" size={24} color={COLORS.secondary} />
            </View>

            <View style={styles.actionsContainer}>
              <Animated.View style={{ transform: [{ scale: requestButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (hasReachedTicketLimit() || loading) && styles.disabledButton,
                  ]}
                  onPress={() => {
                    if (!hasReachedTicketLimit()) {
                      setTicketModalVisible(true);
                    } else {
                      showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
                    }
                  }}
                  disabled={hasReachedTicketLimit() || loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={hasReachedTicketLimit() ? COLORS.completedGradient : COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryActionButton}
                  >
                    <LinearGradient
                      colors={COLORS.glassGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.glassEffectOverlay}
                    />
                    <View style={styles.actionButtonIcon}>
                      <Ionicons name="add-circle" size={24} color={COLORS.surface} />
                    </View>
                    <Text style={styles.actionButtonText}>
                      {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: myTicketsButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    myTicketCount === 0 && styles.disabledButton,
                  ]}
                  onPress={navigateToTickets}
                  disabled={myTicketCount === 0}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.surface, COLORS.surface]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.secondaryActionButton}
                  >
                    <View style={styles.actionButtonIcon}>
                      <Ionicons name="ticket" size={24} color={COLORS.primary} />
                    </View>
                    <Text style={styles.secondaryActionButtonText}>
                      My Tickets
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ transform: [{ scale: myRequestsButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    myRequestCount === 0 && styles.disabledButton,
                  ]}
                  onPress={navigateToMyRequests}
                  disabled={myRequestCount === 0}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.surface, COLORS.surface]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.secondaryActionButton}
                  >
                    <View style={styles.actionButtonIcon}>
                      <Ionicons name="list-circle" size={24} color={COLORS.primary} />
                    </View>
                    <Text style={styles.secondaryActionButtonText}>
                      My Requests
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>

          {game.pattern_rewards && game.pattern_rewards.length > 0 && (
            <LinearGradient
              colors={[COLORS.surface, COLORS.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Game Rewards</Text>
                <LinearGradient
                  colors={COLORS.secondaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.totalRewardsBadge}
                >
                  <Text style={styles.totalRewardsText}>
                    Total: ₹{totalPrizePool?.toLocaleString()}
                  </Text>
                </LinearGradient>
              </View>
              
              {game.pattern_rewards.map((reward, index) => (
                <LinearGradient
                  key={reward.pattern_id}
                  colors={COLORS.winnerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.rewardCard}
                >
                  <LinearGradient
                    colors={COLORS.prizeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.rewardPattern}
                  />
                  
                  <View style={styles.rewardHeader}>
                    <LinearGradient
                      colors={COLORS.prizeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.rewardIcon}
                    >
                      <MaterialIcons name="emoji-events" size={24} color={COLORS.secondary} />
                    </LinearGradient>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardName} numberOfLines={1}>
                        {reward.reward_name}
                      </Text>
                      <Text style={styles.rewardDescription} numberOfLines={2}>
                        {reward.description}
                      </Text>
                    </View>
                    <View style={styles.rewardAmountContainer}>
                      <Text style={styles.rewardAmount} numberOfLines={1}>
                        ₹{(parseFloat(reward.amount) * parseInt(reward.reward_count || 1)).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.rewardFooter}>
                    <View style={styles.rewardDetail}>
                      <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
                      <Text style={styles.rewardDetailText} numberOfLines={1}>
                        {reward.reward_count} Winner{reward.reward_count > 1 ? 's' : ''} × ₹{reward.amount}
                      </Text>
                    </View>
                    <LinearGradient
                      colors={COLORS.prizeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.patternBadge}
                    >
                      <Text style={styles.patternBadgeText} numberOfLines={1}>
                        Pattern {reward.pattern_id}
                      </Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              ))}
            </LinearGradient>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketModalVisible}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Tickets</Text>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGameInfo}
            >
              <Text style={styles.modalGameName} numberOfLines={2}>
                {game.game_name}
              </Text>
              <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
              <View style={styles.modalTicketCost}>
                <Text style={[
                  styles.modalTicketCostText,
                  { color: game.ticket_type === "paid" ? COLORS.secondary : COLORS.secondary }
                ]}>
                  Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
                </Text>
              </View>
              {totalPrizePool && (
                <View style={styles.modalPrizePool}>
                  <Text style={styles.modalPrizePoolText}>
                    Total Prize Pool: ₹{totalPrizePool.toLocaleString()}
                  </Text>
                </View>
              )}
              <View style={styles.modalHostInfo}>
                <Text style={styles.modalHostText}>
                  Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={hasReachedTicketLimit() ? [COLORS.red + '10', COLORS.red + '05'] : [COLORS.primary + '10', COLORS.primary + '05']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.modalLimitInfo,
                hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
              ]}
            >
              <Ionicons 
                name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
                size={18} 
                color={hasReachedTicketLimit() ? COLORS.red : COLORS.primary} 
              />
              <Text style={styles.modalLimitText}>
                {hasReachedTicketLimit() 
                  ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
                  : `You can request up to ${getRemainingTickets()} more ticket(s)`
                }
              </Text>
            </LinearGradient>

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
              <View style={styles.quantitySelector}>
                {[1, 2, 3, 4].map((num) => {
                  const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.quantityButton,
                        ticketQuantity === num && styles.quantityButtonActive,
                        !canSelect && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => canSelect && setTicketQuantity(num)}
                      disabled={!canSelect}
                    >
                      <LinearGradient
                        colors={ticketQuantity === num ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quantityButtonGradient}
                      >
                        <Text
                          style={[
                            styles.quantityButtonText,
                            ticketQuantity === num && styles.quantityButtonTextActive,
                            !canSelect && styles.quantityButtonTextDisabled,
                          ]}
                        >
                          {num}
                        </Text>
                        {!canSelect && (
                          <Ionicons 
                            name="close-circle" 
                            size={12} 
                            color={COLORS.red} 
                            style={styles.quantityDisabledIcon}
                          />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {game.ticket_type === "paid" && (
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.totalSection}
              >
                <View style={styles.totalLabelContainer}>
                  <Ionicons name="wallet" size={20} color={COLORS.secondary} />
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                </View>
                <Text style={styles.totalAmount} numberOfLines={1}>
                  ₹{(game.ticket_cost * ticketQuantity).toLocaleString()}
                </Text>
              </LinearGradient>
            )}

            <View style={styles.messageSection}>
              <Text style={styles.messageLabel}>Message (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                value={ticketMessage}
                onChangeText={setTicketMessage}
                placeholder="Add a message for the host..."
                multiline
                numberOfLines={3}
                maxLength={200}
                placeholderTextColor={COLORS.textLight}
              />
              <Text style={styles.charCount}>
                {ticketMessage.length}/200 characters
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTicketModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: submitButtonScale }], flex: 2 }}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.submitButtonDisabled,
                  ]}
                  onPress={handleRequestTickets}
                  disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButtonGradient}
                  >
                    <LinearGradient
                      colors={COLORS.glassGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.glassEffectOverlay}
                    />
                    {requestLoading ? (
                      <ActivityIndicator size="small" color={COLORS.surface} />
                    ) : (
                      <>
                        <Ionicons name="send" size={18} color={COLORS.surface} />
                        <Text style={styles.submitButtonText}>
                          {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 20,
  },

  loaderContainerDots: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginHorizontal: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },

  number: {
    position: 'absolute',
    left: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  number2: {
    position: 'absolute',
    right: 30,
    bottom: 0,
    fontSize: 28,
    color: '#fff',
    opacity: 0.5,
    fontWeight: 'bold',
  },

  ticketStrip: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#ffffff90',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  ticketText: {
    fontWeight: 'bold',
    color: '#333',
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
    top: 40,
    left: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pokerChip2: {
    position: 'absolute',
    top: 80,
    right: width * 0.15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
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
  yellowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  blueGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 999,
  },
  toastText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cartoonLetter: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FDB800',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    includeFontPadding: false,
    marginHorizontal: 2,
    ...Platform.select({
      android: {
        elevation: 5,
        textShadowColor: '#FFB300',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
      },
    }),
  },
  specialCartoonLetter: {
    fontSize: 32,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginHorizontal: 2,
  },
  gameCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  gameCode: {
    fontSize: 14,
    color: COLORS.surface,
    fontWeight: "600",
  },
  content: {
    padding: 20,
    zIndex: 1,
    marginTop: 0,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 25,
  },
  cardHeader: {
    marginBottom: 16,
  },
  gameIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gameIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.surface,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  waitingText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
    position: 'relative',
  },
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  scheduledBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  scheduledBadgeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  viewRoomButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  secondaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  totalRewardsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalRewardsText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  ticketLimitContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
  },
  ticketLimitReached: {
    borderColor: COLORS.red,
  },
  ticketLimitAvailable: {
    borderColor: COLORS.primary,
  },
  ticketLimitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketLimitInfo: {
    flex: 1,
  },
  ticketLimitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  ticketLimitTitleReached: {
    color: COLORS.red,
  },
  ticketLimitText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  myCountContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  countButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  hasCountButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
  },
  noCountButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    opacity: 0.7,
  },
  countIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  countInfo: {
    flex: 1,
  },
  countLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  countValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  hasCountValue: {
    color: COLORS.textDark,
  },
  noCountValue: {
    color: COLORS.textLight,
  },
  messageCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  messageContent: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  primaryActionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
    position: 'relative',
  },
  actionButtonIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryActionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  secondaryActionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
  rewardCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  rewardPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 15,
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  rewardIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  rewardAmountContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary,
    textAlign: 'right',
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rewardDetailText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  patternBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  patternBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  bottomSpace: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalGameInfo: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalGameName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  modalGameId: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  modalTicketCost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTicketCostText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalPrizePool: {
    marginBottom: 8,
  },
  modalPrizePoolText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.green,
  },
  modalHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHostText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalLimitInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    gap: 10,
    borderWidth: 1,
  },
  modalLimitReached: {
    borderColor: COLORS.red,
  },
  modalLimitAvailable: {
    borderColor: COLORS.primary,
  },
  modalLimitText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  quantityButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonActive: {
    borderColor: COLORS.primary,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  quantityButtonTextActive: {
    color: COLORS.surface,
  },
  quantityButtonTextDisabled: {
    color: COLORS.textLight,
  },
  quantityDisabledIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.secondary,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textDark,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    gap: 8,
    position: 'relative',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.surface,
  },
});

export default GameDetails;
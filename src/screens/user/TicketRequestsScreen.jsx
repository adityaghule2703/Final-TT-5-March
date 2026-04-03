import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
    "Loading your requests...",
    "Fetching ticket details 🎟️",
    "Checking request status...",
    "Almost there...",
    "Getting your data 📋",
    "Processing requests..."
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
        <Text style={styles.ticketText}>🎫 Loading Requests...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const TicketRequestsScreen = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const cancelButtonScales = useRef([]);
  const refreshButtonScale = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  
  const letterAnims = useRef([]);

  useEffect(() => {
    const newLetterAnims = Array(10).fill().map(() => new Animated.Value(1));
    letterAnims.current = newLetterAnims;
    
    letterAnims.current.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(1);
    });
    
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextLetter = () => {
      if (!isAnimating) return;
      
      letterAnims.current.forEach(anim => {
        anim.setValue(1);
      });
      
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.delay(200),
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          currentIndex = (currentIndex + 1) % letterAnims.current.length;
          animateNextLetter();
        }
      });
    };
    
    animateNextLetter();

    startAnimations();
    
    startPulseAnimation(refreshButtonScale, 800);
    startPulseAnimation(backButtonScale, 900);

    fetchTicketRequests().finally(() => {
      setInitialLoading(false);
    });
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTicketRequests();
    });

    return () => {
      isAnimating = false;
      unsubscribe();
      if (letterAnims.current) {
        letterAnims.current.forEach(anim => {
          anim.stopAnimation();
        });
      }
    };
  }, [navigation, gameId]);

  useEffect(() => {
    if (requests.length > 0) {
      cancelButtonScales.current = requests.map(() => new Animated.Value(1));
      cancelButtonScales.current.forEach((anim) => {
        startPulseAnimation(anim, 800);
      });
    }
  }, [requests.length]);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTicketRequests().finally(() => {
      setRefreshing(false);
    });
  }, []);

  const fetchTicketRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        const allRequests = response.data.ticket_requests?.data || [];
        const gameRequests = allRequests.filter(
          (request) => request.game_id == gameId || request.game_id === gameId
        );
        updateRequestsAndStats(gameRequests);
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch requests");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestsAndStats = (gameRequests) => {
    setRequests(gameRequests);
    
    const pendingCount = gameRequests.filter(r => r.status === "pending").length;
    const approvedCount = gameRequests.filter(r => r.status === "approved").length;
    const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
    const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
    setStats({
      total: gameRequests.length,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      cancelled: cancelledCount,
    });
  };

  const cancelTicketRequest = async (requestId, index) => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this ticket request?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await axios.post(
                `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
                {},
                { 
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  } 
                }
              );

              if (response.data.success) {
                Alert.alert("Success", "Ticket request cancelled successfully!");
                fetchTicketRequests();
              } else {
                Alert.alert("Error", response.data.message || "Failed to cancel request");
              }
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to cancel ticket request"
              );
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return COLORS.green;
      case "pending": return COLORS.secondary;
      case "rejected": return COLORS.red;
      case "cancelled": return COLORS.textLight;
      default: return COLORS.textLight;
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case "approved": return COLORS.greenGradient;
      case "pending": return COLORS.secondaryGradient;
      case "rejected": return COLORS.redGradient;
      case "cancelled": return [COLORS.textLight, COLORS.textLight];
      default: return [COLORS.textLight, COLORS.textLight];
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return "checkmark-circle";
      case "pending": return "time";
      case "rejected": return "close-circle";
      case "cancelled": return "close-circle-outline";
      default: return "help-circle";
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString || "N/A";
    }
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

  const Header = () => {
    const letters = [
      { char: 'M', index: 0 },
      { char: 'Y', index: 1 },
      { char: ' ', index: 2, isSpace: true, width: 15 },
      { char: 'T', index: 3 },
      { char: 'I', index: 4 },
      { char: 'C', index: 5 },
      { char: 'K', index: 6 },
      { char: 'E', index: 7 },
      { char: 'T', index: 8 },
      { char: 'S', index: 9, isSpecial: true },
    ];

    return (
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.headerTextContainer}>
              <View style={styles.cartoonTitleRow}>
                {letters.map((item) => {
                  const animValue = letterAnims.current && letterAnims.current[item.index] 
                    ? letterAnims.current[item.index] 
                    : new Animated.Value(1);
                  
                  return (
                    <Animated.Text
                      key={`letter-${item.index}`}
                      style={[
                        styles.cartoonLetter,
                        item.isSpecial && styles.specialCartoonLetter,
                        item.isSpace && { width: item.width || 20 },
                        { 
                          transform: [{ scale: animValue }],
                        }
                      ]}
                    >
                      {item.char}
                    </Animated.Text>
                  );
                })}
              </View>
              <View style={styles.gameInfoContainer}>
                <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.gameName} numberOfLines={1}>
                  {gameName || "Game"}
                </Text>
              </View>
            </View>
            
            <Animated.View style={{ transform: [{ scale: refreshButtonScale }] }}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchTicketRequests}
              >
                <Ionicons name="refresh" size={20} color={COLORS.surface} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const StatCard = ({ icon, value, label, color, gradient }) => {
    const floatValue = floatAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5]
    });

    return (
      <Animated.View 
        style={[
          styles.statCard,
          { transform: [{ translateY: floatValue }] }
        ]}
      >
        <LinearGradient
          colors={gradient || [color + '20', color + '10']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statIconContainer}
        >
          <Ionicons name={icon} size={18} color={color === COLORS.surface ? color : COLORS.surface} />
        </LinearGradient>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
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
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
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

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.statsOverview}>
            <StatCard 
              icon="receipt" 
              value={stats.total} 
              label="Total" 
              color={COLORS.primary}
              gradient={COLORS.primaryGradient}
            />
            <StatCard 
              icon="time" 
              value={stats.pending} 
              label="Pending" 
              color={COLORS.secondary}
              gradient={COLORS.secondaryGradient}
            />
            <StatCard 
              icon="checkmark-circle" 
              value={stats.approved} 
              label="Approved" 
              color={COLORS.green}
              gradient={COLORS.greenGradient}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sectionIcon}
                >
                  <Ionicons name="list-circle" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>Ticket Requests</Text>
              </View>
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionCountBadge}
              >
                <Text style={styles.sectionCount}>{requests.length}</Text>
              </LinearGradient>
            </View>

            {requests.length === 0 ? (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyState}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.emptyIconWrapper}
                >
                  <MaterialIcons name="confirmation-number" size={30} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.emptyTitle}>No Requests Found</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't made any ticket requests for this game yet
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.newRequestButton}
                  >
                    <LinearGradient
                      colors={COLORS.glassGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.glassEffectOverlay}
                    />
                    <Ionicons name="arrow-back" size={18} color={COLORS.surface} />
                    <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <View style={styles.requestsList}>
                {requests.map((request, index) => (
                  <LinearGradient
                    key={request.id}
                    colors={[COLORS.surface, COLORS.surface]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.requestCard}
                  >
                    <LinearGradient
                      colors={COLORS.prizeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardPattern}
                    />
                    
                    <LinearGradient
                      colors={getStatusGradient(request.status)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.statusBadge}
                    >
                      <Ionicons 
                        name={getStatusIcon(request.status)} 
                        size={12} 
                        color={COLORS.surface} 
                      />
                      <Text style={styles.statusText}>
                        {request.status?.toUpperCase() || "UNKNOWN"}
                      </Text>
                    </LinearGradient>

                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.requestId}>Request #{request.id}</Text>
                        <Text style={styles.requestDateTime}>
                          {formatDateTime(request.requested_at || request.created_at)}
                        </Text>
                      </View>
                      
                      <LinearGradient
                        colors={request.payment_status === "paid" ? COLORS.greenGradient : COLORS.secondaryGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.paymentStatusBadge}
                      >
                        <Text style={styles.paymentStatusText}>
                          {(request.payment_status || "pending").toUpperCase()}
                        </Text>
                      </LinearGradient>
                    </View>

                    <View style={styles.requestDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <LinearGradient
                            colors={COLORS.prizeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.detailIcon}
                          >
                            <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
                          </LinearGradient>
                          <View>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailText}>
                              {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
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
                            <MaterialIcons name="account-balance-wallet" size={14} color={COLORS.primary} />
                          </LinearGradient>
                          <View>
                            <Text style={styles.detailLabel}>Amount</Text>
                            <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {request.notes && (
                      <LinearGradient
                        colors={COLORS.winnerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notesContainer}
                      >
                        <LinearGradient
                          colors={COLORS.prizeGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.notesIcon}
                        >
                          <Feather name="message-square" size={14} color={COLORS.primary} />
                        </LinearGradient>
                        <View style={styles.notesContent}>
                          <Text style={styles.notesLabel}>Your Note</Text>
                          <Text style={styles.notesText}>{request.notes}</Text>
                        </View>
                      </LinearGradient>
                    )}

                    {request.rejection_reason && (
                      <LinearGradient
                        colors={[COLORS.red + '10', COLORS.red + '05']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.rejectionContainer}
                      >
                        <LinearGradient
                          colors={COLORS.redGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.rejectionIcon}
                        >
                          <Ionicons name="alert-circle" size={14} color={COLORS.surface} />
                        </LinearGradient>
                        <View style={styles.rejectionContent}>
                          <Text style={styles.rejectionLabel}>Rejection Reason</Text>
                          <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
                        </View>
                      </LinearGradient>
                    )}

                    <View style={styles.actionContainer}>
                      {request.status === "pending" ? (
                        <Animated.View style={{ transform: [{ scale: cancelButtonScales.current[index] || 1 }] }}>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => cancelTicketRequest(request.id, index)}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={COLORS.primaryGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.cancelButtonGradient}
                            >
                              <LinearGradient
                                colors={COLORS.glassGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.glassEffectOverlay}
                              />
                              <Ionicons name="close-circle" size={16} color={COLORS.surface} />
                              <Text style={styles.cancelButtonText}>Cancel Request</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animated.View>
                      ) : (
                        <LinearGradient
                          colors={COLORS.winnerGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.cancelButton, styles.disabledButton]}
                        >
                          <Ionicons 
                            name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
                            size={16} 
                            color={request.status === "approved" ? COLORS.green : COLORS.red} 
                          />
                          <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
                            {request.status === "approved" ? "Request Approved" : 
                             request.status === "rejected" ? "Request Rejected" : 
                             request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
                          </Text>
                        </LinearGradient>
                      )}
                    </View>
                  </LinearGradient>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomSpace} />
        </Animated.View>
      </ScrollView>
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
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
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
  gameInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gameName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: "500",
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sectionCount: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    borderRadius: 16,
    padding: 16,
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
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.surface,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 25,
    marginBottom: 16,
  },
  requestId: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  requestDateTime: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.surface,
  },
  requestDetails: {
    marginBottom: 16,
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
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  notesContent: {
    flex: 1,
  },
  notesLabel: {
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: "600",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  rejectionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  rejectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 11,
    color: COLORS.red,
    fontWeight: "600",
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
    fontStyle: "italic",
  },
  actionContainer: {
    marginTop: 8,
  },
  cancelButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  cancelButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
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
  cancelButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  disabledButtonText: {
    color: COLORS.textLight,
  },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  newRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  newRequestButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpace: {
    height: 20,
  },
});

export default TicketRequestsScreen;
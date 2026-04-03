import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TextInput,
  Keyboard,
  Animated,
  Easing,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: "#4facfe",
  primaryLight: "#9fcdff",
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
  
  deposit: "#4facfe",
  withdraw: "#FF6B6B",
  refer: "#4ECDC4",
  support: "#9B59B6",
  
  patternGradients: [
    ['#0282E9', '#0056b3'],
    ['#F59E0B', '#d97706'],
    ['#10B981', '#059669'],
    ['#EF4444', '#dc2626'],
    ['#8B5CF6', '#6d28d9'],
    ['#EC4899', '#db2777'],
    ['#06B6D4', '#0891b2'],
    ['#F97316', '#ea580c'],
  ],
  
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
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
    "Loading games...",
    "Fetching latest games 🎮",
    "Getting your tickets 🎟️",
    "Almost ready...",
    "Exciting games await! 🔥",
    "Setting up game lobby..."
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
        <Text style={styles.ticketText}>🎮 Games Loading...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const Game = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userGameData, setUserGameData] = useState({
    myTickets: [],
    myRequests: []
  });
  const [activeTab, setActiveTab] = useState('myGames');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const buttonScaleAnims = useRef([]);
  const letterAnims = useRef([]);

  useEffect(() => {
    fetchAllData();
    startAnimations();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      buttonScaleAnims.current = games.map(() => new Animated.Value(1));
      
      buttonScaleAnims.current.forEach((anim) => {
        startPulseAnimation(anim);
      });
    }
  }, [games.length]);

  useEffect(() => {
    const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
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
    
    return () => {
      isAnimating = false;
      if (letterAnims.current) {
        letterAnims.current.forEach(anim => {
          anim.stopAnimation();
        });
      }
    };
  }, []);

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
  };

  const translateY1 = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15]
  });

  const translateY2 = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchAllData(true).finally(() => setRefreshing(false));
  }, []);

  const fetchAllData = async (reset = false) => {
    if (reset) {
      setGames([]);
    }
    setLoading(true);
    try {
      await Promise.all([
        fetchGames(1, reset),
        fetchMyTickets(),
        fetchMyRequests()
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to load games data!");
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async (page = 1, reset = false) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `https://tambolatime.co.in/public/api/user/games?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const gamesData = res.data.games.data || [];
        const paginationData = res.data.games;
        
        if (reset) {
          setGames(gamesData);
        } else {
          setGames(prev => [...prev, ...gamesData]);
        }
        
        setCurrentPage(paginationData.current_page);
        setLastPage(paginationData.last_page);
        setHasMore(paginationData.current_page < paginationData.last_page);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load games!");
    }
  };

  const fetchMyTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUserGameData(prev => ({
          ...prev,
          myTickets: res.data.tickets.data || []
        }));
      }
    } catch (error) {}
  };

  const fetchMyRequests = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-ticket-requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUserGameData(prev => ({
          ...prev,
          myRequests: res.data.ticket_requests.data || []
        }));
      }
    } catch (error) {}
  };

  const loadMoreGames = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      fetchGames(nextPage).finally(() => setLoadingMore(false));
    }
  };

  const isUserPlayingGame = (gameId) => {
    const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
    const hasPendingRequests = userGameData.myRequests.some(request => 
      request.game_id == gameId && request.status === 'pending'
    );
    
    return hasTickets || hasPendingRequests;
  };

  const getUserTicketCount = (gameId) => {
    const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
    const pendingRequestsCount = userGameData.myRequests.filter(request => 
      request.game_id == gameId && request.status === 'pending'
    ).length;
    
    return {
      tickets: ticketsCount,
      pendingRequests: pendingRequestsCount,
      total: ticketsCount + pendingRequestsCount
    };
  };

  const getFilteredGames = () => {
    let filtered = games;

    if (searchQuery.trim()) {
      filtered = filtered.filter(game =>
        game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === 'myGames') {
      filtered = filtered.filter(game => isUserPlayingGame(game.id));
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(game => game.status === 'completed');
    }

    return filtered;
  };

  const renderPlayingBadge = (game) => {
    const ticketInfo = getUserTicketCount(game.id);
    
    if (ticketInfo.total === 0) return null;
    
    return (
      <LinearGradient
        colors={['rgba(79, 172, 254, 0.1)', 'rgba(0, 198, 251, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.playingBadge}
      >
        <View style={styles.playingBadgeIcon}>
          <Ionicons name="person-circle" size={12} color={COLORS.surface} />
        </View>
        <Text style={styles.playingBadgeText}>
          {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
          {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
          {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
        </Text>
      </LinearGradient>
    );
  };

  const calculatePrizePool = (game) => {
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

  const Header = () => {
    const letters = [
      { char: 'H', index: 0 },
      { char: 'O', index: 1, isSpecial: true },
      { char: 'U', index: 2 },
      { char: 'Z', index: 3 },
      { char: 'I', index: 4 },
      { char: 'E', index: 5 },
      { char: ' ', index: 6, isSpace: true, width: 20 },
      { char: 'T', index: 7 },
      { char: 'I', index: 8 },
      { char: 'M', index: 9 },
      { char: 'E', index: 10 },
      { char: 'Z', index: 11, isSpecial: true },
    ];

    return (
      <LinearGradient
        colors={COLORS.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => (
              <Animated.Text
                key={item.index}
                style={[
                  styles.cartoonLetter,
                  item.isSpecial && styles.specialCartoonLetter,
                  item.isSpace && { width: item.width || 20 },
                  { 
                    transform: [{ scale: letterAnims.current[item.index] || 1 }],
                    marginHorizontal: item.isSpace ? 0 : 2,
                  }
                ]}
              >
                {item.char}
              </Animated.Text>
            ))}
          </View>
          <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderGameCard = ({ item: game, index }) => {
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const ticketInfo = getUserTicketCount(game.id);
    const isPlaying = isUserPlayingGame(game.id);
    const isCompleted = game.status === 'completed';
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    
    const prizePool = calculatePrizePool(game);
    
    const buttonScale = buttonScaleAnims.current[index] || new Animated.Value(1);
    
    return (
      <TouchableOpacity
        key={game.id}
        style={styles.gameCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("GameDetails", { game })}
      >
        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gameCardPattern}
        />
        
        <LinearGradient
          colors={isLive ? COLORS.liveGradient : 
                  isCompleted ? COLORS.completedGradient : 
                  COLORS.scheduledGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusBadge}
        >
          <Ionicons 
            name={
              isLive ? 'radio-button-on' : 
              isCompleted ? 'trophy' :
              'time'
            } 
            size={10} 
            color={COLORS.surface} 
          />
          <Text style={styles.statusText}>
            {isLive ? 'LIVE' : 
             isCompleted ? 'COMPLETED' : 
             'SOON'}
          </Text>
        </LinearGradient>

        {isPlaying && (
          <View style={styles.playingCardOverlay}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playingCardLabel}
            >
              <Ionicons name="checkmark-circle" size={12} color={COLORS.surface} />
              <Text style={styles.playingCardLabelText}>You're Playing</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.gameIconContainer}>
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameIconWrapper}
            >
              <MaterialIcons 
                name={isCompleted ? "trophy" : "confirmation-number"} 
                size={32} 
                color={COLORS.secondary} 
              />
            </LinearGradient>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name}
              </Text>
              <Text style={styles.gameId}>
                ID: {game.game_code}
              </Text>
              {isPlaying && renderPlayingBadge(game)}
            </View>
          </View>
          
          <LinearGradient
            colors={game.ticket_type === "paid" ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gameTypeBadge}
          >
            {game.ticket_type === "paid" ? (
              <>
                <MaterialIcons name="diamond" size={14} color={COLORS.surface} />
                <Text style={styles.gameTypeText}>
                  ₹{ticketCost}
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.surface} />
                <Text style={styles.gameTypeText}>
                  FREE
                </Text>
              </>
            )}
          </LinearGradient>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <LinearGradient
                colors={COLORS.prizeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.detailIcon}
              >
                <Ionicons name="calendar" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailText}>
                  {game.game_date_formatted || game.game_date}
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
                <Ionicons name="time" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailText}>
                  {game.game_time_formatted || game.game_start_time}
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
                <Ionicons name="person" size={14} color={COLORS.primary} />
              </LinearGradient>
              <View>
                <Text style={styles.detailLabel}>Host</Text>
                <Text style={styles.detailText}>
                  {game.user ? game.user.name : 'Houzie Timez'}
                </Text>
              </View>
            </View>
            
            {game.available_tickets !== undefined && !isCompleted && (
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
                  <Text style={styles.detailLabel}>Tickets</Text>
                  <Text style={styles.detailText}>
                    {game.available_tickets} Left
                  </Text>
                </View>
              </View>
            )}
            {isCompleted && (
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={COLORS.prizeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.detailIcon}
                >
                  <Ionicons name="trophy" size={14} color={COLORS.primary} />
                </LinearGradient>
                <View>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailText}>Completed</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.prizeContainer}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.prizeIcon}
          >
            <MaterialIcons 
              name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
              size={18} 
              color={COLORS.surface} 
            />
          </LinearGradient>
          <View style={styles.prizeInfo}>
            <Text style={styles.prizeLabel}>
              {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
            </Text>
            <Text style={styles.prizeText}>
              {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
            </Text>
            {game.pattern_rewards && game.pattern_rewards.length > 0 && (
              <Text style={styles.prizeSubtext}>
                {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </LinearGradient>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => navigation.navigate("GameDetails", { game })}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isCompleted ? COLORS.completedGradient : 
                     isPlaying ? COLORS.primaryGradient : 
                     COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButtonGradient}
            >
              <LinearGradient
                colors={COLORS.glassGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassEffectOverlay}
              />
              <Text style={styles.joinButtonText}>
                {isCompleted 
                  ? 'VIEW RESULTS' 
                  : isPlaying 
                    ? 'VIEW MY GAME' 
                    : isLive
                      ? 'JOIN GAME' 
                      : 'VIEW DETAILS'}
              </Text>
              <Ionicons 
                name={isCompleted ? "trophy" : "arrow-forward"} 
                size={16} 
                color={COLORS.surface} 
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isActive ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabButtonGradient}
      >
        <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
          {title}
        </Text>
        {count > 0 && (
          <LinearGradient
            colors={isActive ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] : COLORS.prizeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.tabCount, isActive && styles.tabCountActive]}
          >
            <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
              {count}
            </Text>
          </LinearGradient>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more games...</Text>
      </View>
    );
  };

  const renderEmptyList = () => (
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
        <Ionicons 
          name={
            activeTab === 'myGames' ? "game-controller-outline" : 
            activeTab === 'completed' ? "trophy-outline" : 
            "search-outline"
          } 
          size={30} 
          color={COLORS.surface} 
        />
      </LinearGradient>
      <Text style={styles.emptyTitle}>
        {activeTab === 'myGames' 
          ? 'No Games Found' 
          : activeTab === 'completed'
          ? 'No Completed Games'
          : 'No Games Available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `No games found for "${searchQuery}"`
          : activeTab === 'myGames'
          ? "You haven't joined any games yet. Browse all games to get started!"
          : activeTab === 'completed'
          ? "No completed games available yet. Check back later!"
          : "Check back later for new exciting games!"}
      </Text>
      {searchQuery && (
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={() => setSearchQuery('')}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.clearFiltersGradient}
          >
            <LinearGradient
              colors={COLORS.glassGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassEffectOverlay}
            />
            <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {activeTab === 'myGames' && !searchQuery && (
        <TouchableOpacity 
          style={styles.browseGamesButton}
          onPress={() => setActiveTab('allGames')}
        >
          <LinearGradient
            colors={[COLORS.surface, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.browseGamesGradient}
          >
            <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );

  const renderHeader = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sectionIcon}
          >
            <Ionicons name="game-controller-outline" size={16} color={COLORS.surface} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>
            {activeTab === 'myGames' ? 'MY GAMES' : 
             activeTab === 'completed' ? 'COMPLETED GAMES' : 
             'ALL GAMES'}
          </Text>
        </View>
        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gameCountBadge}
        >
          <Text style={styles.gameCount}>
            {getFilteredGames().length}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );

  if (loading && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
  const completedGamesCount = games.filter(game => game.status === 'completed').length;
  const allGamesCount = games.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.backgroundPattern}>
          <Animated.View 
            style={[
              styles.pokerChip1, 
              { transform: [{ translateY: translateY1 }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.pokerChip2, 
              { transform: [{ translateY: translateY2 }] }
            ]} 
          />
        </View>

        <Header />

        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchWrapper}
        >
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search games by name or ID..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <View style={styles.tabsContainer}>
          <TabButton
            title="My Games"
            count={myGamesCount}
            isActive={activeTab === 'myGames'}
            onPress={() => setActiveTab('myGames')}
          />
          <TabButton
            title="All Games"
            count={allGamesCount}
            isActive={activeTab === 'allGames'}
            onPress={() => setActiveTab('allGames')}
          />
          <TabButton
            title="Completed"
            count={completedGamesCount}
            isActive={activeTab === 'completed'}
            onPress={() => setActiveTab('completed')}
          />
        </View>

        <FlatList
          data={getFilteredGames()}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          onEndReached={loadMoreGames}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          ListHeaderComponent={renderHeader}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Game;

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

  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  loadingMoreText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 10,
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
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
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
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    paddingHorizontal: 4,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  cartoonLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FBC10B',
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
    fontSize: 40,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginHorizontal: 2,
  },
  appTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: "500",
    marginTop: 4,
    marginLeft: 4,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    paddingVertical: 4,
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabButtonActive: {
    borderColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  tabButtonTextActive: {
    color: COLORS.surface,
  },
  tabCount: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabCountText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  tabCountTextActive: {
    color: COLORS.surface,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  gameCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  gameCount: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
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
  gameCardPattern: {
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
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 14,
    gap: 4,
    zIndex: 2,
  },
  statusText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  playingCardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  playingCardLabel: {
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playingCardLabelText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  gameIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  gameId: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  playingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  playingBadgeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  gameTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    marginLeft: 8,
  },
  gameTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.surface,
  },
  gameDetails: {
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
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prizeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  prizeInfo: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginBottom: 2,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  prizeSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "500",
    marginTop: 2,
  },
  joinButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  joinButtonGradient: {
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
  },
  joinButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginTop: 20,
    marginHorizontal: 16,
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
  clearFiltersButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  clearFiltersGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  clearFiltersButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  browseGamesButton: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  browseGamesGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  browseGamesButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
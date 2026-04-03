import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Easing,
  Platform,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

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
    "Setting up your game...",
    "Shuffling Tambola tickets 🎟️",
    "Picking lucky numbers 🎲",
    "Joining the game room...",
    "Almost ready to play 🔥",
    "Still loading... your luck is being calculated 😄"
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
        <Text style={styles.ticketText}>🎟️ 12 34 56 78 90</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [loadingPatterns, setLoadingPatterns] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingSliders, setLoadingSliders] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [upcomingGamePopup, setUpcomingGamePopup] = useState(false);
  const [upcomingGame, setUpcomingGame] = useState(null);
  const [popupShown, setPopupShown] = useState(false);
  
  const slideAnimPopup = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const buttonScaleAnims = useRef([]);
  const patternScaleAnims = useRef([]);
  const glowAnims = useRef([]);
  const letterAnims = useRef([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const sliderRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollTimeout = useRef(null);

  const filters = ['All Games', 'Live Now', 'Upcoming', 'Completed'];
  const [activeFilter, setActiveFilter] = useState('All Games');

  useEffect(() => {
    buttonScaleAnims.current = games.map(() => new Animated.Value(1));
    
    buttonScaleAnims.current.forEach((anim, index) => {
      startPulseAnimation(anim);
    });
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

  useEffect(() => {
    if (patterns.length > 0) {
      patternScaleAnims.current = patterns.map(() => new Animated.Value(1));
      glowAnims.current = patterns.map(() => new Animated.Value(0));
      
      patternScaleAnims.current.forEach((anim, index) => {
        startPulseAnimation(anim, 1000 + (index * 200));
      });
      
      glowAnims.current.forEach((anim, index) => {
        startGlowAnimation(anim, 1500 + (index * 300));
      });
    }
  }, [patterns.length]);

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

  const startGlowAnimation = (anim, duration = 1500) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
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

  const startAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    
    if (sliders.length <= 1) return;
    
    scrollInterval.current = setInterval(() => {
      setActiveSlide((prevActiveSlide) => {
        let nextIndex = prevActiveSlide + 1;
        if (nextIndex >= sliders.length) {
          nextIndex = 0;
        }
        
        if (sliderRef.current) {
          const slideWidth = width - 32;
          sliderRef.current.scrollToOffset({
            offset: nextIndex * slideWidth,
            animated: true
          });
        }
        
        return nextIndex;
      });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const resetAutoScroll = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  useEffect(() => {
    fetchInitialData();
    
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (games.length > 0 && !popupShown) {
      setTimeout(() => {
        checkUpcomingGame();
      }, 1500);
    }
  }, [games, popupShown]);

  useEffect(() => {
    if (sliders.length > 1) {
      startAutoScroll();
    }
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [sliders.length]);

  useEffect(() => {
    let filtered = games;
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(game =>
        game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeFilter === 'Live Now') {
      filtered = filtered.filter(game => game.status === 'live');
    } else if (activeFilter === 'Upcoming') {
      filtered = filtered.filter(game => game.status === 'scheduled');
    } else if (activeFilter === 'Completed') {
      filtered = filtered.filter(game => game.status === 'completed');
    }
    
    setFilteredGames(filtered);
  }, [searchQuery, games, activeFilter]);

  useEffect(() => {
    if (upcomingGamePopup) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimPopup, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacityAnim.setValue(0);
      slideAnimPopup.setValue(300);
    }
  }, [upcomingGamePopup]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchNotifications(),
        fetchSliders(),
        fetchGames(1),
        fetchPatterns()
      ]);
    } catch (error) {
      console.log("Error fetching initial data:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setGames([]);
    setFilteredGames([]);
    setPopupShown(false);
    Promise.all([
      fetchNotifications(),
      fetchSliders(),
      fetchGames(1),
      fetchPatterns()
    ]).finally(() => setRefreshing(false));
  }, []);

  const checkUpcomingGame = () => {
    try {
      const now = new Date();
      
      const scheduledGames = games.filter(game => 
        game.status === 'scheduled'
      );
      
      if (scheduledGames.length === 0) return;
      
      const gamesWithEndDateTime = scheduledGames.map(game => {
        let endDateTime;
        
        try {
          if (game.ticket_request_end_date) {
            endDateTime = new Date(game.ticket_request_end_date);
          } else {
            endDateTime = new Date(game.game_date);
          }
        } catch (e) {
          endDateTime = new Date();
        }
        
        return {
          ...game,
          endDateTime
        };
      });
      
      const sortedGames = gamesWithEndDateTime.sort((a, b) => a.endDateTime - b.endDateTime);
      const earliestEndGame = sortedGames[0];
      
      const timeDiff = earliestEndGame.endDateTime - now;
      
      if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
        setUpcomingGame(earliestEndGame);
        setUpcomingGamePopup(true);
        setPopupShown(true);
      }
    } catch (error) {
      console.log("Error checking upcoming game:", error);
    }
  };

  const getTimeRemaining = (endDateTime) => {
    const now = new Date();
    const diff = endDateTime - now;
    
    if (diff <= 0) return "Ending soon";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchSliders = async () => {
    try {
      setLoadingSliders(true);
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/sliders"
      );
      if (res.data.success) {
        setSliders(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching sliders:", error);
      setSliders([]);
    } finally {
      setLoadingSliders(false);
    }
  };

  const fetchGames = async (page = 1) => {
    try {
      if (page === 1) {
        setLoadingGames(true);
      }
      
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      
      const res = await axios.get(
        `https://tambolatime.co.in/public/api/user/games?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const newGames = res.data.games.data || [];
        const pagination = res.data.games;
        
        if (page === 1) {
          setGames(newGames);
          setFilteredGames(newGames);
        } else {
          setGames(prev => [...prev, ...newGames]);
          setFilteredGames(prev => [...prev, ...newGames]);
        }
        
        setCurrentPage(pagination.current_page);
        setLastPage(pagination.last_page);
      }
    } catch (error) {
      console.log("Error fetching games:", error);
    } finally {
      if (page === 1) {
        setLoadingGames(false);
      }
      setLoadingMore(false);
    }
  };

  const fetchPatterns = async () => {
    try {
      setLoadingPatterns(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        setLoadingPatterns(false);
        return;
      }

      const response = await axios.get(
        "https://tambolatime.co.in/public/api/user/patterns/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data && response.data.status) {
        const patternsData = response.data.data?.patterns || [];
        
        const patternSequence = [
          'top line',
          'middle line', 
          'bottom line',
          'breakfast',
          'lunch',
          'dinner',
          'four corners',
          'bamboo',
          'early five',
          'non claimers',
          'full house'
        ];
        
        const sortedPatterns = patternsData.sort((a, b) => {
          const aName = (a.display_name || a.pattern_name || '').toLowerCase();
          const bName = (b.display_name || b.pattern_name || '').toLowerCase();
          
          const aIndex = patternSequence.findIndex(pattern => aName.includes(pattern));
          const bIndex = patternSequence.findIndex(pattern => bName.includes(pattern));
          
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          
          return aIndex - bIndex;
        });
        
        setPatterns(sortedPatterns.slice(0, 8));
      }
    } catch (error) {
      console.log('Error fetching patterns in Home:', error);
    } finally {
      setLoadingPatterns(false);
    }
  };

  const loadMoreGames = () => {
    if (!loadingMore && currentPage < lastPage) {
      setLoadingMore(true);
      fetchGames(currentPage + 1);
    }
  };

  const handleGamePress = (game) => {
    navigation.navigate("GameDetails", { game });
  };

  const handleAllGamesPress = () => {
    navigation.navigate("Game");
  };

  const handleAllPatternsPress = () => {
    navigation.navigate("UserGamePatterns");
  };

  const handleViewAllWinners = () => {
    navigation.navigate("Game");
  };

  const handlePatternPress = (pattern) => {
    navigation.navigate("UserGamePatterns", { 
      selectedPatternId: pattern.id,
      selectedPattern: pattern 
    });
  };

  const handlePopupJoinNow = () => {
    setUpcomingGamePopup(false);
    if (upcomingGame) {
      navigation.navigate("GameDetails", { game: upcomingGame });
    }
  };

  const handlePopupLater = () => {
    setUpcomingGamePopup(false);
  };

  const navigateToDemoGame = () => {
    navigation.navigate("UserDemoGame");
  };

  const getPatternIcon = (pattern) => {
    const patternName = pattern.display_name?.toLowerCase() || pattern.pattern_name?.toLowerCase() || '';
    
    const iconMap = {
      'bamboo': 'leaf',
      'bottom line': 'arrow-down',
      'breakfast': 'cafe',
      'dinner': 'restaurant',
      'early five': '5',
      'four corners': 'apps',
      'full house': 'home',
      'lunch': 'fast-food',
      'middle line': 'remove',
      'non claimer': 'close',
      'top line': 'arrow-up'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (patternName.includes(key)) return icon;
    }
    
    return 'grid-outline';
  };

  const formatPatternName = (name) => {
    if (!name) return 'Unknown Pattern';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
        <View style={styles.logoContainer}>
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
                      marginHorizontal: item.isSpace ? 0 : 2,
                    }
                  ]}
                >
                  {item.char}
                </Animated.Text>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.notification}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const renderPatternCard = (pattern, index) => {
    const icon = getPatternIcon(pattern);
    const displayName = pattern.display_name || formatPatternName(pattern.pattern_name);
    
    const patterns = [
      'Top Line',
      'Middle',
      'Bottom',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Corners',
      'Bamboo',
    ];
    
    const patternName = patterns[index % patterns.length];
    const gradientColors = COLORS.patternGradients[index % COLORS.patternGradients.length];
    
    const scaleAnim = patternScaleAnims.current[index] || new Animated.Value(1);
    const glowAnim = glowAnims.current[index] || new Animated.Value(0);
    
    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7]
    });
    
    return (
      <Animated.View
        key={pattern.id}
        style={[
          styles.patternCardContainer,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.compactPatternCard}
          onPress={() => handlePatternPress(pattern)}
          activeOpacity={0.7}
        >
          <Animated.View style={[
            styles.glowEffect,
            {
              backgroundColor: gradientColors[0],
              opacity: glowOpacity,
              transform: [{ scale: 1.2 }]
            }
          ]} />
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.compactIconWrapper}
          >
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.compactPatternName} numberOfLines={1}>
            {patternName}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ 
          uri: item.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
        }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </View>
  );

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffset / slideSize);
    
    if (currentIndex !== activeSlide && currentIndex < sliders.length) {
      setActiveSlide(currentIndex);
      stopAutoScroll();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        startAutoScroll();
      }, 5000);
    }
  };

  const renderPagination = () => {
    if (sliders.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {sliders.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderGameCard = ({ item: game, index }) => {
    if (!game) return null;
    
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const isPaid = game.ticket_type === "paid";
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    const isCompleted = game.status === 'completed';
    
    const prizePool = calculatePrizePool(game);
    
    if (!buttonScaleAnims.current[index]) {
      buttonScaleAnims.current[index] = new Animated.Value(1);
      startPulseAnimation(buttonScaleAnims.current[index]);
    }
    
    const buttonScale = buttonScaleAnims.current[index];
    
    return (
      <TouchableOpacity
        style={styles.gameCard}
        activeOpacity={0.9}
        onPress={() => handleGamePress(game)}
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
          style={[
            styles.statusBadge,
          ]}
        >
          <Ionicons 
            name={
              isLive ? 'radio-button-on' : 
              isCompleted ? 'checkmark-circle' :
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

        <View style={styles.cardHeader}>
          <View style={styles.gameIconContainer}>
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gameIconWrapper}
            >
              <MaterialIcons name="confirmation-number" size={32} color={COLORS.primary} />
            </LinearGradient>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.game_name || "Tambola Game"}
              </Text>
              <Text style={styles.gameId}>
                ID: {game.game_code || "N/A"}
              </Text>
            </View>
          </View>
          
          <LinearGradient
            colors={isPaid ? COLORS.secondaryGradient : ['#4CAF50', '#45a049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gameTypeBadge,
            ]}
          >
            {isPaid ? (
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
                  {game.game_date_formatted || game.game_date || "Date TBA"}
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
                  {game.game_time_formatted || game.game_start_time || "Time TBA"}
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
            <MaterialIcons name="account-balance-wallet" size={18} color={COLORS.surface} />
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
            style={[
              styles.joinButton,
              isCompleted && styles.completedJoinButton
            ]}
            onPress={() => handleGamePress(game)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isCompleted ? COLORS.completedGradient : COLORS.primaryGradient}
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

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const UpcomingGamePopup = () => {
    if (!upcomingGame) return null;
    
    const ticketCost = parseFloat(upcomingGame.ticket_cost || 0);
    const isPaid = upcomingGame.ticket_type === "paid";
    const endDateTime = upcomingGame.endDateTime || new Date(upcomingGame.ticket_request_end_date);
    const timeRemaining = getTimeRemaining(endDateTime);
    
    const prizePool = calculatePrizePool(upcomingGame);
    
    return (
      <Modal
        visible={upcomingGamePopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePopupLater}
      >
        <View style={styles.popupOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                opacity: opacityAnim,
                transform: [{ translateY: slideAnimPopup }]
              }
            ]}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupIcon}
            >
              <Ionicons name="timer-outline" size={32} color={COLORS.surface} />
            </LinearGradient>
            
            <Text style={styles.popupTitle}>Booking closing soon!</Text>
            <Text style={styles.popupGameName}>{upcomingGame.game_name}</Text>
            
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupTimer}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.popupTimerText}>{timeRemaining}</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={COLORS.prizeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popupPrize}
            >
              <Text style={styles.popupPrizeLabel}>Total Prize Pool</Text>
              <Text style={styles.popupPrizeValue}>
                {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
              </Text>
              {upcomingGame.pattern_rewards && upcomingGame.pattern_rewards.length > 0 && (
                <Text style={styles.popupPrizeSubtext}>
                  {upcomingGame.pattern_rewards.length} Patterns
                </Text>
              )}
            </LinearGradient>
            
            <View style={styles.popupActions}>
              <TouchableOpacity 
                onPress={handlePopupJoinNow}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.popupPrimaryButton}
                >
                  <Text style={styles.popupPrimaryButtonText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.popupSecondaryButton}
                onPress={handlePopupLater}
              >
                <Text style={styles.popupSecondaryButtonText}>Later</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  if (loadingGames && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CustomLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.container}>
        <Header />

        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.searchWrapper}
        >
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
            <TextInput
              placeholder="Search games by name or ID..."
              placeholderTextColor={COLORS.textLight}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            ) : (
              <Ionicons name="options-outline" size={18} color={COLORS.textLight} />
            )}
          </View>
        </LinearGradient>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {loadingSliders ? (
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sliderLoadingContainer}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading offers...</Text>
            </LinearGradient>
          ) : sliders.length > 0 ? (
            <View style={styles.sliderSection}>
              <View style={styles.sliderWrapper}>
                <FlatList
                  ref={sliderRef}
                  data={sliders}
                  renderItem={renderSliderItem}
                  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
                
                {renderPagination()}
              </View>
            </View>
          ) : null}

          {patterns.length > 0 && (
            <View style={styles.patternsSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sectionIcon}
                  >
                    <Ionicons name="grid-outline" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>GAME PATTERNS</Text>
                </View>
                <TouchableOpacity onPress={handleAllPatternsPress}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllText}>See All</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.surface} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {loadingPatterns ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.patternsList}
                >
                  {patterns.map((pattern, index) => renderPatternCard(pattern, index))}
                </ScrollView>
              )}
            </View>
          )}

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
                <Text style={styles.sectionTitle}>ALL GAMES</Text>
              </View>
              <TouchableOpacity onPress={handleAllGamesPress}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {loadingGames ? (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gamesLoadingContainer}
              >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading games...</Text>
              </LinearGradient>
            ) : filteredGames.length > 0 ? (
              <View style={styles.gamesContainer}>
                {filteredGames.map((game, index) => (
                  <View key={game.id || `game_${index}_${game.game_code}`}>
                    {renderGameCard({ item: game, index })}
                  </View>
                ))}
                {loadingMore && (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                )}
              </View>
            ) : (
              <LinearGradient
                colors={COLORS.winnerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.noGamesContainer}
              >
                <Ionicons name="game-controller-outline" size={50} color={COLORS.primary} />
                <Text style={styles.noGamesText}>
                  {searchQuery ? 'No games found' : 'No games available at the moment'}
                </Text>
                {searchQuery && (
                  <TouchableOpacity 
                    style={styles.refreshGamesBtn}
                    onPress={clearSearch}
                  >
                    <LinearGradient
                      colors={COLORS.primaryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.refreshGamesGradient}
                    >
                      <Text style={styles.refreshGamesText}>Clear Search</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            )}
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
                  <Ionicons name="shield-checkmark" size={16} color={COLORS.surface} />
                </LinearGradient>
                <Text style={styles.sectionTitle}>WHY PLAY WITH US</Text>
              </View>
            </View>
            
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoCard}
            >
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Fast & Fair Games</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Real Players</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>24x7 Rooms Available</Text>
                </View>
                <View style={styles.infoItem}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoIcon}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.surface} />
                  </LinearGradient>
                  <Text style={styles.infoText}>Safe & Fun Experience</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        <TouchableOpacity style={styles.floatingDemoButton} onPress={navigateToDemoGame} activeOpacity={0.9}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.demoButtonGradient}
          >
            <LinearGradient
              colors={COLORS.glassGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassEffectOverlay}
            />
            <View style={styles.demoButtonContent}>
              <Ionicons name="game-controller" size={20} color={COLORS.surface} />
            </View>
            <Text style={styles.demoButtonText}>DEMO</Text>
          </LinearGradient>
        </TouchableOpacity>

        <UpcomingGamePopup />

        <Modal 
          visible={modalVisible} 
          transparent={true} 
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={['#ffffff', '#f8f9ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalContent}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <LinearGradient
                      colors={COLORS.primaryGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modalIcon}
                    >
                      <Ionicons name="notifications" size={18} color={COLORS.surface} />
                    </LinearGradient>
                    <Text style={styles.modalTitle}>Notifications</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textDark} />
                  </TouchableOpacity>
                </View>

                {loadingNotifications ? (
                  <View style={styles.modalLoadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.modalLoadingText}>Loading notifications...</Text>
                  </View>
                ) : (
                  <FlatList
                    data={notifications}
                    keyExtractor={(item, index) => {
                      if (item && item.id) {
                        return item.id.toString();
                      }
                      return `notification_${index}_${Date.now()}_${Math.random().toString(36)}`;
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notificationsList}
                    renderItem={({ item, index }) => (
                      <View style={styles.modalNotificationItem}>
                        <LinearGradient
                          colors={COLORS.primaryGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.modalNotificationIcon}
                        >
                          <Ionicons name="notifications-outline" size={18} color={COLORS.surface} />
                        </LinearGradient>
                        <View style={styles.modalNotificationContent}>
                          <Text style={styles.modalNotificationTitle}>
                            {item.title || "New Update"}
                          </Text>
                          <Text style={styles.modalNotificationMessage} numberOfLines={2}>
                            {item.message || "Check out the new features!"}
                          </Text>
                          <Text style={styles.modalNotificationDate}>
                            {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                          </Text>
                        </View>
                      </View>
                    )}
                    ListEmptyComponent={
                      <View style={styles.modalEmptyContainer}>
                        <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
                        <Text style={styles.modalEmptyText}>No notifications yet</Text>
                        <Text style={styles.modalEmptySubtext}>
                          We'll notify you when something new arrives
                        </Text>
                      </View>
                    }
                  />
                )}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalFooter}
                >
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalCloseBtn}
                  >
                    <Text style={styles.modalCloseBtnText}>Close</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  spaceLetter: {
    width: 20,
    marginHorizontal: 0,
  },
  notification: {
    position: "relative",
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: "700",
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: COLORS.textDark,
    padding: 0,
  },
  floatingDemoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
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
  demoButtonContent: {
    position: 'relative',
    marginRight: 6,
  },
  demoButtonText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: 'bold',
  },
  sliderSection: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sliderWrapper: {
    height: 150,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLoadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  slideContainer: {
    width: width - 32,
    height: 150,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.surface,
    width: 20,
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
    fontSize: 14,
  },
  patternsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.surface,
    fontWeight: '600',
  },
  patternsList: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    gap: 12,
  },
  patternCardContainer: {
    position: 'relative',
    marginRight: 12,
    marginTop: 8,
    paddingTop: 4,
  },
  compactPatternCard: {
    alignItems: 'center',
    width: 60,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    top: -2,
    left: 4,
    zIndex: 0,
  },
  compactIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    zIndex: 1,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  compactPatternName: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textDark,
    textAlign: 'center',
    zIndex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  gamesLoadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  noGamesContainer: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noGamesText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
  },
  refreshGamesBtn: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  refreshGamesGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  refreshGamesText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
  gamesContainer: {
    gap: 12,
  },
  gameCard: {
    backgroundColor: COLORS.surface,
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
    marginBottom: 12,
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
  completedJoinButton: {
    backgroundColor: COLORS.completed,
  },
  joinButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "700",
  },
  winnersContainer: {
    gap: 8,
  },
  winnerCard: {
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  winnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerInitial: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  winnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  winnerPrize: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  winnerTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupContainer: {
    width: width * 0.85,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  popupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  popupGameName: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  popupTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  popupTimerText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  popupPrize: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
    width: '100%',
  },
  popupPrizeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 3,
  },
  popupPrizeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  popupPrizeSubtext: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 3,
  },
  popupActions: {
    width: '100%',
    gap: 10,
  },
  popupPrimaryButton: {
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  popupPrimaryButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  popupSecondaryButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  popupSecondaryButtonText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxHeight: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoadingText: {
    marginTop: 10,
    color: COLORS.textLight,
    fontSize: 12,
  },
  notificationsList: {
    paddingVertical: 4,
  },
  modalNotificationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  modalNotificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalNotificationContent: {
    flex: 1,
  },
  modalNotificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  modalNotificationMessage: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
    lineHeight: 16,
  },
  modalNotificationDate: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  modalEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  modalEmptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  modalEmptySubtext: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  modalFooter: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCloseBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Home;
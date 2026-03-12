// // import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   StyleSheet,
// //   RefreshControl,
// //   Dimensions,
// //   TextInput,
// //   Keyboard,
// //   Animated,
// //   Easing,
// //   FlatList,
// //   SafeAreaView,
// //   Alert,
// //   StatusBar,
// //   Platform,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// // const { width } = Dimensions.get('window');

// // // Enhanced color palette with more shades
// // const COLORS = {
// //   background: '#F0F7FF',
// //   surface: '#FFFFFF',
// //   primary: '#2E5BFF', // Vibrant blue
// //   primaryLight: '#E1EBFF',
// //   primaryDark: '#1A3A9E',
// //   accent: '#3B82F6', // Medium blue for accents
// //   secondary: '#60A5FA', // Light blue
// //   tertiary: '#2563EB', // Darker blue for contrast
// //   text: '#1E293B',
// //   textSecondary: '#64748B',
// //   textLight: '#94A3B8',
// //   border: '#E2E8F0',
  
// //   // New card background variants
// //   cardBlue1: '#E8F0FE',
// //   cardBlue2: '#D4E4FF',
// //   cardBlue3: '#C2D6FF',
// //   cardBlue4: '#E3F2FD',
// //   cardBlue5: '#E6F0FA',
  
// //   // Accent colors
// //   purple: '#8B5CF6',
// //   purpleLight: '#EDE9FE',
// //   orange: '#F97316',
// //   orangeLight: '#FFF3E6',
// //   pink: '#EC4899',
// //   pinkLight: '#FCE8F0',
// //   teal: '#14B8A6',
// //   tealLight: '#D5F5F0',
  
// //   // Status colors
// //   live: '#10B981',
// //   scheduled: '#F59E0B',
// //   completed: '#ed3e3e',
  
// //   // Block colors - Blue shades
// //   blockLightBlue: '#E1EBFF',
// //   blockMediumBlue: '#C2D6FF',
// //   blockDarkBlue: '#A3C1FF',
// // };

// // const Game = ({ navigation }) => {
// //   const [games, setGames] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [userGameData, setUserGameData] = useState({
// //     myTickets: [],
// //     myRequests: []
// //   });
// //   const [activeTab, setActiveTab] = useState('myGames');
  
// //   // Scroll Y position for background animation
// //   const scrollY = useRef(new Animated.Value(0)).current;
  
// //   // Cache for filtered results
// //   const [filteredGamesCache, setFilteredGamesCache] = useState({
// //     myGames: [],
// //     allGames: [],
// //     completed: []
// //   });

// //   // Filter options for tabs
// //   const tabs = [
// //     { id: 'myGames', label: 'My Games' },
// //     { id: 'allGames', label: 'All Games' },
// //     { id: 'completed', label: 'Completed' }
// //   ];

// //   useEffect(() => {
// //     fetchAllData();
// //   }, []);

// //   // Update cache whenever games or userGameData changes
// //   useEffect(() => {
// //     if (games.length > 0) {
// //       updateFilteredGamesCache();
// //     }
// //   }, [games, userGameData, searchQuery]);

// //   const updateFilteredGamesCache = useCallback(() => {
// //     let filtered = games;

// //     if (searchQuery.trim()) {
// //       filtered = filtered.filter(game =>
// //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //     }

// //     const myGamesFiltered = filtered.filter(game => isUserPlayingGame(game.id));
// //     const completedFiltered = filtered.filter(game => game.status === 'completed');
// //     const allGamesFiltered = filtered;

// //     setFilteredGamesCache({
// //       myGames: myGamesFiltered,
// //       allGames: allGamesFiltered,
// //       completed: completedFiltered
// //     });
// //   }, [games, searchQuery, userGameData]);

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     setGames([]);
// //     setUserGameData({
// //       myTickets: [],
// //       myRequests: []
// //     });
// //     fetchAllData(true).finally(() => setRefreshing(false));
// //   }, []);

// //   const fetchAllData = async (reset = false) => {
// //     setLoading(true);
// //     try {
// //       // Fetch all pages of games
// //       await fetchAllGames();
      
// //       // Fetch user data
// //       await Promise.all([
// //         fetchMyTickets(),
// //         fetchMyRequests()
// //       ]);
      
// //     } catch (error) {
// //       console.log("Error fetching data:", error);
// //       Alert.alert("Error", "Failed to load games data!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAllGames = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       let page = 1;
// //       let allGames = [];
// //       let hasMorePages = true;
      
// //       while (hasMorePages) {
// //         const res = await axios.get(
// //           `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );
        
// //         if (res.data.success) {
// //           const gamesData = res.data.games.data || [];
// //           allGames = [...allGames, ...gamesData];
          
// //           const paginationData = res.data.games;
// //           hasMorePages = paginationData.current_page < paginationData.last_page;
// //           page++;
// //         } else {
// //           hasMorePages = false;
// //         }
// //       }
      
// //       setGames(allGames);
// //     } catch (error) {
// //       console.log("Error fetching games:", error);
// //       Alert.alert("Error", "Failed to load games!");
// //     }
// //   };

// //   const fetchMyTickets = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myTickets: res.data.tickets.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching tickets:", error);
// //     }
// //   };

// //   const fetchMyRequests = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.success) {
// //         setUserGameData(prev => ({
// //           ...prev,
// //           myRequests: res.data.ticket_requests.data || []
// //         }));
// //       }
// //     } catch (error) {
// //       console.log("Error fetching requests:", error);
// //     }
// //   };

// //   const isUserPlayingGame = useCallback((gameId) => {
// //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// //     const hasPendingRequests = userGameData.myRequests.some(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     );
    
// //     return hasTickets || hasPendingRequests;
// //   }, [userGameData]);

// //   const getUserTicketCount = useCallback((gameId) => {
// //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// //       request.game_id == gameId && request.status === 'pending'
// //     ).length;
    
// //     return {
// //       tickets: ticketsCount,
// //       pendingRequests: pendingRequestsCount,
// //       total: ticketsCount + pendingRequestsCount
// //     };
// //   }, [userGameData]);

// //   const handleTabChange = useCallback((tab) => {
// //     setActiveTab(tab);
    
// //     if (tab === 'myGames') {
// //       fetchMyTickets();
// //       fetchMyRequests();
// //     }
// //   }, []);

// //   const getCurrentTabData = useCallback(() => {
// //     switch (activeTab) {
// //       case 'myGames':
// //         return filteredGamesCache.myGames;
// //       case 'completed':
// //         return filteredGamesCache.completed;
// //       case 'allGames':
// //       default:
// //         return filteredGamesCache.allGames;
// //     }
// //   }, [activeTab, filteredGamesCache]);

// //   const getTabCount = useCallback((tab) => {
// //     switch (tab) {
// //       case 'myGames':
// //         return filteredGamesCache.myGames.length;
// //       case 'completed':
// //         return filteredGamesCache.completed.length;
// //       case 'allGames':
// //       default:
// //         return filteredGamesCache.allGames.length;
// //     }
// //   }, [filteredGamesCache]);

// //   const clearSearch = () => {
// //     setSearchQuery('');
// //   };

// //   // Animated background that moves with scroll
// //   const AnimatedBackground = () => {
// //     const block1TranslateY = scrollY.interpolate({
// //       inputRange: [0, 300],
// //       outputRange: [0, -50],
// //       extrapolate: 'clamp'
// //     });

// //     const block2TranslateY = scrollY.interpolate({
// //       inputRange: [0, 400],
// //       outputRange: [0, -30],
// //       extrapolate: 'clamp'
// //     });

// //     const block3TranslateY = scrollY.interpolate({
// //       inputRange: [0, 500],
// //       outputRange: [0, -20],
// //       extrapolate: 'clamp'
// //     });

// //     const opacity = scrollY.interpolate({
// //       inputRange: [0, 200, 400],
// //       outputRange: [1, 0.8, 0.6],
// //       extrapolate: 'clamp'
// //     });

// //     return (
// //       <>
// //         <Animated.View 
// //           style={[
// //             styles.blueBlock1,
// //             {
// //               transform: [{ translateY: block1TranslateY }],
// //               opacity
// //             }
// //           ]} 
// //         />
// //         <Animated.View 
// //           style={[
// //             styles.blueBlock2,
// //             {
// //               transform: [{ translateY: block2TranslateY }],
// //               opacity: opacity.interpolate({
// //                 inputRange: [0.6, 1],
// //                 outputRange: [0.4, 0.8]
// //               })
// //             }
// //           ]} 
// //         />
// //         <Animated.View 
// //           style={[
// //             styles.blueBlock3,
// //             {
// //               transform: [{ translateY: block3TranslateY }],
// //               opacity: opacity.interpolate({
// //                 inputRange: [0.6, 1],
// //                 outputRange: [0.2, 0.5]
// //               })
// //             }
// //           ]} 
// //         />
// //       </>
// //     );
// //   };

// //   // Enhanced Card Background with only circles (removed all patterns)
// //   const CardBackground = ({ game, accentColor }) => {
// //     const isPlaying = isUserPlayingGame(game.id);
// //     const isCompleted = game.status === 'completed';
// //     const isLive = game.status === 'live';
    
// //     // Choose background color based on game status
// //     let backgroundColor;
// //     if (isPlaying) {
// //       backgroundColor = COLORS.cardBlue1;
// //     } else if (isLive) {
// //       backgroundColor = COLORS.cardBlue2;
// //     } else if (isCompleted) {
// //       backgroundColor = '#F8FAFC';
// //     } else {
// //       backgroundColor = COLORS.cardBlue4;
// //     }
    
// //     return (
// //       <View style={[styles.cardBackground, { backgroundColor }]}>
// //         {/* Decorative circles with different colors */}
// //         <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
// //         <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
// //         <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
        
// //         {/* Small floating particles */}
// //         <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
// //         <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
// //         <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
// //         <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
// //       </View>
// //     );
// //   };

// //   // Enhanced Header with semicircle shape and UK-style rounded lines
// //   const Header = () => (
// //     <View style={styles.headerWrapper}>
// //       {/* Semicircle Background */}
// //       <View style={styles.semicircleBackground}>
// //         <View style={styles.semicircle} />
// //       </View>
      
// //       {/* UK-style Rounded Lines Pattern */}
// //       <View style={styles.ukPatternContainer}>
// //         <View style={styles.curvedLine1} />
// //         <View style={styles.curvedLine2} />
// //         <View style={styles.curvedLine3} />
        
// //         <View style={styles.parallelLines}>
// //           <View style={styles.parallelLine} />
// //           <View style={styles.parallelLine} />
// //           <View style={styles.parallelLine} />
// //         </View>
        
// //         <View style={styles.dottedCircle1}>
// //           {[...Array(8)].map((_, i) => (
// //             <View 
// //               key={i} 
// //               style={[
// //                 styles.dottedCircleDot,
// //                 {
// //                   transform: [
// //                     { rotate: `${i * 45}deg` },
// //                     { translateX: 30 }
// //                   ]
// //                 }
// //               ]} 
// //             />
// //           ))}
// //         </View>
        
// //         <View style={styles.decorativeDot1} />
// //         <View style={styles.decorativeDot2} />
// //         <View style={styles.decorativeLine1} />
// //         <View style={styles.decorativeLine2} />
// //       </View>

// //       {/* Header Content */}
// //       <View style={styles.headerContent}>
// //         <View>
// //           <Text style={styles.greeting}>Welcome back to</Text>
// //           <Text style={styles.title}>
// //             Tambola <Text style={styles.titleBold}>Games</Text>
// //           </Text>
// //         </View>
// //         <View style={styles.headerRight}>
// //           {filteredGamesCache.myGames.length > 0 && (
// //             <View style={styles.playingCountBadge}>
// //               <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
// //               <Text style={styles.playingCountText}>{filteredGamesCache.myGames.length}</Text>
// //             </View>
// //           )}
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   const renderGameCard = useCallback(({ item: game, index }) => {
// //     const ticketCost = parseFloat(game.ticket_cost || 0);
// //     const ticketInfo = getUserTicketCount(game.id);
// //     const isPlaying = isUserPlayingGame(game.id);
// //     const isCompleted = game.status === 'completed';
// //     const isLive = game.status === 'live';
// //     const isScheduled = game.status === 'scheduled';
    
// //     // Get status color and text
// //     let statusColor = COLORS.scheduled;
// //     let statusText = 'Upcoming';
// //     let statusIcon = 'time-outline';
// //     if (isLive) {
// //       statusColor = COLORS.live;
// //       statusText = 'Live Now';
// //       statusIcon = 'radio-button-on';
// //     } else if (isCompleted) {
// //       statusColor = COLORS.completed;
// //       statusText = 'Completed';
// //       statusIcon = 'checkmark-circle';
// //     }
    
// //     // Different accent colors for each card
// //     const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.pink, COLORS.teal];
// //     const accentColor = accentColors[index % accentColors.length];
// //     const accentLight = accentColors.map(c => c + '20')[index % accentColors.length];
    
// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.gameCard,
// //           isPlaying && styles.playingGameCard,
// //         ]}
// //         activeOpacity={0.95}
// //         onPress={() => navigation.navigate("GameDetails", { game })}
// //       >
// //         {/* Layered Background with colors and only circles */}
// //         <CardBackground game={game} accentColor={accentColor} />

// //         {/* Status badge - TOP LEFT corner */}
// //         <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
// //           <Ionicons name={statusIcon} size={12} color="#FFFFFF" />
// //           <Text style={styles.statusBadgeText}>{statusText}</Text>
// //         </View>

// //         {/* Playing indicator - TOP RIGHT corner */}
// //         {isPlaying && (
// //           <View style={[styles.playingBadge, { backgroundColor: COLORS.primary }]}>
// //             <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
// //             <Text style={styles.playingBadgeText}>You're Playing</Text>
// //           </View>
// //         )}

// //         <View style={styles.gameCardHeader}>
// //           {/* Icon/Logo at top left */}
// //           <View style={styles.gameIconContainer}>
// //             <View style={[
// //               styles.gameIconWrapper, 
// //               { backgroundColor: accentLight || COLORS.primaryLight }
// //             ]}>
// //               <MaterialIcons name="sports-esports" size={24} color={accentColor || COLORS.primary} />
// //             </View>
            
// //             <View style={styles.gameTitleContainer}>
// //               <Text style={styles.gameName} numberOfLines={1}>
// //                 {game.game_name || "Tambola Game"}
// //               </Text>
// //               <Text style={styles.gameCode}>
// //                 #{game.game_code || "N/A"}
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         <View style={styles.gameCardContent}>
// //           {/* Game Meta Information */}
// //           <View style={styles.gameMetaRow}>
// //             <View style={styles.metaItem}>
// //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// //               <Text style={styles.metaText}>
// //                 {game.game_date_formatted || game.game_date || "TBA"}
// //               </Text>
// //             </View>
// //             <View style={styles.metaItem}>
// //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// //               <Text style={styles.metaText}>
// //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// //               </Text>
// //             </View>
// //           </View>

// //           <View style={styles.gameMetaRow}>
// //             <View style={styles.metaItem}>
// //               <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
// //               <Text style={styles.metaText} numberOfLines={1}>
// //                 {game.user ? game.user.name : 'Tambola Timez'}
// //               </Text>
// //             </View>
// //             {game.available_tickets !== undefined && !isCompleted && (
// //               <View style={styles.metaItem}>
// //                 <MaterialIcons name="confirmation-number" size={14} color={COLORS.textSecondary} />
// //                 <Text style={styles.metaText}>
// //                   {game.available_tickets} Left
// //                 </Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* Ticket info if user is playing */}
// //           {isPlaying && (
// //             <View style={[styles.ticketInfoContainer, { backgroundColor: accentLight }]}>
// //               <Text style={[styles.ticketInfoText, { color: accentColor }]}>
// //                 {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// //                 {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' • ' : ''}
// //                 {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// //               </Text>
// //             </View>
// //           )}

// //           {/* Prize Pool Section with Ticket Price */}
// //           <View style={styles.prizeContainer}>
// //             <View style={styles.prizeLeftSection}>
// //               <Text style={styles.prizeLabel}>
// //                 {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// //               </Text>
// //               <Text style={styles.prizeValue}>
// //                 {game.ticket_type === "paid" && game.max_tickets 
// //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// //                   : "Exciting Prizes"}
// //               </Text>
// //             </View>

// //             {/* Ticket Price Badge - Next to prize pool */}
// //             {game.ticket_type === "paid" && (
// //               <View style={[styles.ticketPriceBadge, { backgroundColor: accentLight }]}>
// //                 <MaterialIcons name="diamond" size={14} color={accentColor} />
// //                 <Text style={[styles.ticketPriceText, { color: accentColor }]}>₹{ticketCost}</Text>
// //               </View>
// //             )}
            
// //             {/* Action Button */}
// //             <TouchableOpacity 
// //               style={[styles.actionButton, 
// //                 isPlaying && { backgroundColor: accentColor },
// //                 isCompleted && { backgroundColor: COLORS.completed }
// //               ]}
// //               onPress={() => navigation.navigate("GameDetails", { game })}
// //             >
// //               <Text style={styles.actionButtonText}>
// //                 {isCompleted ? 'Results' : isPlaying ? 'View' : isLive ? 'Join' : 'Details'}
// //               </Text>
// //               <Ionicons 
// //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// //                 size={14} 
// //                 color="#FFFFFF" 
// //               />
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   }, [isUserPlayingGame, getUserTicketCount, navigation]);

// //   const renderTabBar = () => (
// //     <View style={styles.tabsContainer}>
// //       {tabs.map((tab) => {
// //         const isActive = activeTab === tab.id;
// //         const tabKey = tab.id;
        
// //         return (
// //           <TouchableOpacity
// //             key={tab.id}
// //             style={[
// //               styles.tabButton,
// //               isActive && styles.tabButtonActive,
// //             ]}
// //             onPress={() => handleTabChange(tab.id)}
// //           >
// //             <Text style={[
// //               styles.tabButtonText,
// //               isActive && styles.tabButtonTextActive
// //             ]}>
// //               {tab.label}
// //             </Text>
// //             <View style={[
// //               styles.tabCount,
// //               isActive && styles.tabCountActive
// //             ]}>
// //               <Text style={[
// //                 styles.tabCountText,
// //                 isActive && styles.tabCountTextActive
// //               ]}>
// //                 {getTabCount(tabKey)}
// //               </Text>
// //             </View>
// //           </TouchableOpacity>
// //         );
// //       })}
// //     </View>
// //   );

// //   const renderEmptyList = useCallback(() => (
// //     <View style={styles.emptyGames}>
// //       <Ionicons 
// //         name={
// //           activeTab === 'myGames' ? "person-outline" : 
// //           activeTab === 'completed' ? "trophy-outline" : 
// //           "game-controller-outline"
// //         } 
// //         size={48} 
// //         color={COLORS.textLight} 
// //       />
// //       <Text style={styles.emptyGamesText}>
// //         {activeTab === 'myGames' 
// //           ? "You haven't joined any games yet"
// //           : activeTab === 'completed'
// //           ? 'No completed games available'
// //           : searchQuery ? 'No games found' : 'No games available'}
// //       </Text>
// //       {searchQuery && (
// //         <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// //           <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// //         </TouchableOpacity>
// //       )}
// //       {activeTab === 'myGames' && !searchQuery && (
// //         <TouchableOpacity 
// //           style={styles.clearSearchButton}
// //           onPress={() => handleTabChange('allGames')}
// //         >
// //           <Text style={styles.clearSearchButtonText}>Browse All Games</Text>
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   ), [activeTab, searchQuery]);

// //   // Handle main scroll for background animation
// //   const handleMainScroll = Animated.event(
// //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// //     { useNativeDriver: false }
// //   );

// //   if (loading && games.length === 0) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color={COLORS.primary} />
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// //       <View style={styles.container}>
// //         {/* Animated Color Blocks */}
// //         <AnimatedBackground />

// //         <Animated.FlatList
// //           data={getCurrentTabData()}
// //           renderItem={renderGameCard}
// //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor={COLORS.primary}
// //               colors={[COLORS.primary]}
// //             />
// //           }
// //           onScroll={handleMainScroll}
// //           scrollEventThrottle={16}
// //           ListHeaderComponent={
// //             <>
// //               {/* Enhanced Header */}
// //               <Header />

// //               {/* Search */}
// //               <View style={styles.searchBox}>
// //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// //                 <TextInput
// //                   placeholder="Search games by name or ID..."
// //                   placeholderTextColor={COLORS.textLight}
// //                   style={styles.searchInput}
// //                   value={searchQuery}
// //                   onChangeText={setSearchQuery}
// //                   returnKeyType="search"
// //                   onSubmitEditing={Keyboard.dismiss}
// //                 />
// //                 {searchQuery.length > 0 ? (
// //                   <TouchableOpacity onPress={clearSearch}>
// //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// //                   </TouchableOpacity>
// //                 ) : (
// //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// //                 )}
// //               </View>

// //               {/* Tabs */}
// //               {renderTabBar()}

// //               {/* Games Count */}
// //               <View style={styles.gamesCountContainer}>
// //                 <Text style={styles.gamesCount}>
// //                   {getCurrentTabData().length} {getCurrentTabData().length === 1 ? 'Game' : 'Games'} Available
// //                 </Text>
// //               </View>
// //             </>
// //           }
// //           ListEmptyComponent={renderEmptyList}
// //           contentContainerStyle={styles.flatListContent}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.background,
// //     paddingHorizontal: 16,
// //   },
  
// //   /* COLOR BLOCKS - Blue Shades - Animated */
// //   blueBlock1: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 280,
// //     backgroundColor: COLORS.blockLightBlue,
// //     borderBottomLeftRadius: 50,
// //     borderBottomRightRadius: 50,
// //   },
// //   blueBlock2: {
// //     position: 'absolute',
// //     top: 200,
// //     left: 0,
// //     right: 0,
// //     height: 160,
// //     backgroundColor: COLORS.blockMediumBlue,
// //   },
// //   blueBlock3: {
// //     position: 'absolute',
// //     top: 300,
// //     left: 0,
// //     right: 0,
// //     height: 100,
// //     backgroundColor: COLORS.blockDarkBlue,
// //     opacity: 0.3,
// //   },
  
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
  
// //   /* Enhanced Header with Semicircle and UK Pattern */
// //   headerWrapper: {
// //     position: 'relative',
// //     marginTop: 8,
// //     marginBottom: 16,
// //     overflow: 'hidden',
// //   },
  
// //   /* Semicircle Background */
// //   semicircleBackground: {
// //     position: 'absolute',
// //     top: -40,
// //     right: -30,
// //     width: 200,
// //     height: 200,
// //     overflow: 'hidden',
// //   },
// //   semicircle: {
// //     position: 'absolute',
// //     width: 400,
// //     height: 200,
// //     backgroundColor: COLORS.primaryLight,
// //     borderTopLeftRadius: 200,
// //     borderTopRightRadius: 200,
// //     transform: [{ rotate: '-15deg' }],
// //     opacity: 0.3,
// //   },
  
// //   /* UK-style Rounded Lines Pattern */
// //   ukPatternContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //   },
  
// //   curvedLine1: {
// //     position: 'absolute',
// //     top: 20,
// //     right: 50,
// //     width: 80,
// //     height: 40,
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //     borderTopWidth: 0,
// //     borderRightWidth: 0,
// //     borderRadius: 40,
// //     opacity: 0.15,
// //     transform: [{ rotate: '-10deg' }],
// //   },
// //   curvedLine2: {
// //     position: 'absolute',
// //     bottom: 10,
// //     left: 30,
// //     width: 60,
// //     height: 30,
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //     borderBottomWidth: 0,
// //     borderLeftWidth: 0,
// //     borderRadius: 30,
// //     opacity: 0.15,
// //     transform: [{ rotate: '15deg' }],
// //   },
// //   curvedLine3: {
// //     position: 'absolute',
// //     top: 40,
// //     left: 100,
// //     width: 100,
// //     height: 50,
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //     borderTopWidth: 0,
// //     borderLeftWidth: 0,
// //     borderRadius: 50,
// //     opacity: 0.1,
// //     transform: [{ rotate: '20deg' }],
// //   },
  
// //   parallelLines: {
// //     position: 'absolute',
// //     top: 30,
// //     left: 20,
// //   },
// //   parallelLine: {
// //     width: 80,
// //     height: 2,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.1,
// //     marginVertical: 4,
// //     borderRadius: 1,
// //   },
  
// //   dottedCircle1: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 30,
// //     width: 60,
// //     height: 60,
// //   },
// //   dottedCircleDot: {
// //     position: 'absolute',
// //     width: 4,
// //     height: 4,
// //     borderRadius: 2,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.2,
// //     top: 28,
// //     left: 28,
// //   },
  
// //   decorativeDot1: {
// //     position: 'absolute',
// //     top: 60,
// //     right: 80,
// //     width: 6,
// //     height: 6,
// //     borderRadius: 3,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.2,
// //   },
// //   decorativeDot2: {
// //     position: 'absolute',
// //     bottom: 40,
// //     left: 150,
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.15,
// //   },
// //   decorativeLine1: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 150,
// //     width: 40,
// //     height: 2,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.1,
// //     borderRadius: 1,
// //     transform: [{ rotate: '30deg' }],
// //   },
// //   decorativeLine2: {
// //     position: 'absolute',
// //     bottom: 30,
// //     right: 100,
// //     width: 50,
// //     height: 2,
// //     backgroundColor: COLORS.primary,
// //     opacity: 0.1,
// //     borderRadius: 1,
// //     transform: [{ rotate: '-20deg' }],
// //   },
  
// //   /* Header Content */
// //   headerContent: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     position: 'relative',
// //     zIndex: 2,
// //     paddingVertical: 10,
// //   },
// //   greeting: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     marginBottom: 2,
// //   },
// //   title: {
// //     fontSize: 24,
// //     color: COLORS.text,
// //     lineHeight: 32,
// //   },
// //   titleBold: {
// //     fontWeight: '700',
// //     color: COLORS.primary,
// //   },
// //   headerRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   playingCountBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.primary,
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     gap: 4,
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   playingCountText: {
// //     color: '#FFFFFF',
// //     fontSize: 12,
// //     fontWeight: '700',
// //   },
  
// //   /* Search Box */
// //   searchBox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 18,
// //     paddingHorizontal: 14,
// //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// //     marginBottom: 16,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     marginHorizontal: 10,
// //     color: COLORS.text,
// //     fontSize: 14,
// //     padding: 0,
// //   },
  
// //   /* Tabs - Without Icons */
// //   tabsContainer: {
// //     flexDirection: 'row',
// //     marginBottom: 16,
// //     gap: 8,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: COLORS.surface,
// //     paddingVertical: 10,
// //     paddingHorizontal: 8,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     gap: 4,
// //   },
// //   tabButtonActive: {
// //     backgroundColor: COLORS.primary,
// //     borderColor: COLORS.primary,
// //   },
// //   tabButtonText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: COLORS.textSecondary,
// //   },
// //   tabButtonTextActive: {
// //     color: COLORS.surface,
// //   },
// //   tabCount: {
// //     backgroundColor: COLORS.background,
// //     borderRadius: 12,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     marginLeft: 2,
// //   },
// //   tabCountActive: {
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //   },
// //   tabCountText: {
// //     fontSize: 10,
// //     fontWeight: '700',
// //     color: COLORS.textSecondary,
// //   },
// //   tabCountTextActive: {
// //     color: COLORS.surface,
// //   },
  
// //   /* Games Count */
// //   gamesCountContainer: {
// //     marginBottom: 16,
// //   },
// //   gamesCount: {
// //     fontSize: 14,
// //     color: COLORS.textSecondary,
// //     fontWeight: '500',
// //   },
  
// //   /* Card Background - New enhanced styles */
// //   cardBackground: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     borderRadius: 24,
// //   },
  
// //   /* Decorative circles */
// //   cardDecorativeCircle: {
// //     position: 'absolute',
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     opacity: 0.08,
// //   },
// //   circle1: {
// //     top: -30,
// //     right: -30,
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //   },
// //   circle2: {
// //     bottom: -20,
// //     left: -20,
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     opacity: 0.06,
// //   },
// //   circle3: {
// //     top: '40%',
// //     left: '30%',
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     opacity: 0.05,
// //   },
  
// //   /* Floating particles */
// //   floatingParticle: {
// //     position: 'absolute',
// //     width: 4,
// //     height: 4,
// //     borderRadius: 2,
// //     opacity: 0.12,
// //   },
// //   particle1: {
// //     top: 20,
// //     right: 40,
// //     width: 6,
// //     height: 6,
// //   },
// //   particle2: {
// //     bottom: 30,
// //     left: 50,
// //     width: 5,
// //     height: 5,
// //   },
// //   particle3: {
// //     top: '60%',
// //     right: 60,
// //     width: 7,
// //     height: 7,
// //   },
// //   particle4: {
// //     bottom: '20%',
// //     left: 80,
// //     width: 4,
// //     height: 4,
// //   },
  
// //   /* Game Cards */
// //   gameCard: {
// //     borderRadius: 24,
// //     marginBottom: 16,
// //     padding: 16,
// //     paddingTop: 40, // Space for badges
// //     elevation: 4,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.5)',
// //   },
// //   playingGameCard: {
// //     borderWidth: 2,
// //     borderColor: COLORS.primary,
// //     shadowColor: COLORS.primary,
// //     shadowOpacity: 0.15,
// //   },

// //   /* Status Badge - TOP LEFT corner */
// //   statusBadge: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderBottomRightRadius: 20,
// //     borderTopLeftRadius: 24,
// //     gap: 4,
// //     zIndex: 10,
// //     elevation: 5,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   statusBadgeText: {
// //     color: '#FFFFFF',
// //     fontSize: 11,
// //     fontWeight: '700',
// //   },

// //   /* Playing Badge - TOP RIGHT corner */
// //   playingBadge: {
// //     position: 'absolute',
// //     top: 0,
// //     right: 0,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderBottomLeftRadius: 20,
// //     borderTopRightRadius: 24,
// //     gap: 4,
// //     zIndex: 10,
// //     elevation: 5,
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     borderWidth: 2,
// //     borderColor: COLORS.surface,
// //   },
// //   playingBadgeText: {
// //     color: '#FFFFFF',
// //     fontSize: 11,
// //     fontWeight: '700',
// //   },

// //   /* Game Card Header with Icon */
// //   gameCardHeader: {
// //     marginBottom: 16,
// //     marginTop: 1, // Space between badges and content
// //     zIndex: 2,
// //   },
// //   gameIconContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   gameIconWrapper: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   gameTitleContainer: {
// //     flex: 1,
// //   },
// //   gameName: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: COLORS.text,
// //     marginBottom: 4,
// //   },
// //   gameCode: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //   },

// //   /* Game Content */
// //   gameCardContent: {
// //     gap: 12,
// //     zIndex: 2,
// //   },
// //   gameMetaRow: {
// //     flexDirection: 'row',
// //     gap: 16,
// //   },
// //   metaItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //     flex: 1,
// //   },
// //   metaText: {
// //     fontSize: 13,
// //     color: COLORS.textSecondary,
// //     flex: 1,
// //   },

// //   /* Ticket Info */
// //   ticketInfoContainer: {
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     alignSelf: 'flex-start',
// //   },
// //   ticketInfoText: {
// //     fontSize: 11,
// //     fontWeight: '600',
// //   },

// //   /* Prize and Action */
// //   prizeContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 8,
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(0,0,0,0.05)',
// //   },
// //   prizeLeftSection: {
// //     flex: 1,
// //   },
// //   prizeLabel: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   prizeValue: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: COLORS.text,
// //   },
// //   ticketPriceBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     gap: 4,
// //     marginRight: 8,
// //   },
// //   ticketPriceText: {
// //     fontSize: 12,
// //     fontWeight: '700',
// //   },
// //   actionButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: COLORS.primary,
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderRadius: 30,
// //     gap: 6,
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   actionButtonText: {
// //     color: '#FFFFFF',
// //     fontSize: 13,
// //     fontWeight: '600',
// //   },

// //   /* Empty State */
// //   emptyGames: {
// //     alignItems: 'center',
// //     padding: 40,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 24,
// //     marginTop: 20,
// //   },
// //   emptyGamesText: {
// //     fontSize: 16,
// //     color: COLORS.textSecondary,
// //     marginTop: 12,
// //     marginBottom: 16,
// //     textAlign: 'center',
// //   },
// //   clearSearchButton: {
// //     backgroundColor: COLORS.primary,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 20,
// //   },
// //   clearSearchButtonText: {
// //     color: COLORS.surface,
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
  
// //   flatListContent: {
// //     paddingBottom: 20,
// //   },
// // });

// // export default Game;
















// // // import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // //   RefreshControl,
// // //   Dimensions,
// // //   TextInput,
// // //   Keyboard,
// // //   Animated,
// // //   Easing,
// // //   FlatList,
// // //   SafeAreaView,
// // //   Alert,
// // //   StatusBar,
// // //   Platform,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// // // const { width } = Dimensions.get('window');

// // // // Color palette with orange shade as primary (SINGLE CONSISTENT COLOR)
// // // const COLORS = {
// // //   background: '#F0F7FF',
// // //   surface: '#FFFFFF',
// // //   primary: '#F97316', // Vibrant orange (main color)
// // //   primaryLight: '#FFEDD5', // Light orange
// // //   primaryDark: '#C2410C', // Dark orange
// // //   accent: '#FB923C', // Medium orange for accents
// // //   secondary: '#FCD34D', // Light amber/gold
// // //   tertiary: '#EA580C', // Darker orange for contrast
// // //   text: '#1E293B',
// // //   textSecondary: '#64748B',
// // //   textLight: '#94A3B8',
// // //   border: '#E2E8F0',
  
// // //   // Card background variants - all orange-tinted (SAME FOR ALL CARDS)
// // //   cardOrange: '#FFF7ED', // Single consistent card background
  
// // //   // Status colors (only these remain different for clarity)
// // //   live: '#10B981', // Green for live (keeping for contrast)
// // //   scheduled: '#F97316', // Orange for scheduled
// // //   completed: '#e24c2e', // Gray for completed
  
// // //   // Block colors - Orange shades for background
// // //   blockLightOrange: '#FFEDD5',
// // //   blockMediumOrange: '#FED7AA',
// // //   blockDarkOrange: '#FDBA74',
// // // };

// // // const Game = ({ navigation }) => {
// // //   const [games, setGames] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [userGameData, setUserGameData] = useState({
// // //     myTickets: [],
// // //     myRequests: []
// // //   });
// // //   const [activeTab, setActiveTab] = useState('myGames');
  
// // //   // Scroll Y position for background animation
// // //   const scrollY = useRef(new Animated.Value(0)).current;
  
// // //   // Cache for filtered results
// // //   const [filteredGamesCache, setFilteredGamesCache] = useState({
// // //     myGames: [],
// // //     allGames: [],
// // //     completed: []
// // //   });

// // //   // Filter options for tabs
// // //   const tabs = [
// // //     { id: 'myGames', label: 'My Games' },
// // //     { id: 'allGames', label: 'All Games' },
// // //     { id: 'completed', label: 'Completed' }
// // //   ];

// // //   useEffect(() => {
// // //     fetchAllData();
// // //   }, []);

// // //   // Update cache whenever games or userGameData changes
// // //   useEffect(() => {
// // //     if (games.length > 0) {
// // //       updateFilteredGamesCache();
// // //     }
// // //   }, [games, userGameData, searchQuery]);

// // //   const updateFilteredGamesCache = useCallback(() => {
// // //     let filtered = games;

// // //     if (searchQuery.trim()) {
// // //       filtered = filtered.filter(game =>
// // //         game.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //         game.game_code?.toLowerCase().includes(searchQuery.toLowerCase())
// // //       );
// // //     }

// // //     const myGamesFiltered = filtered.filter(game => isUserPlayingGame(game.id));
// // //     const completedFiltered = filtered.filter(game => game.status === 'completed');
// // //     const allGamesFiltered = filtered;

// // //     setFilteredGamesCache({
// // //       myGames: myGamesFiltered,
// // //       allGames: allGamesFiltered,
// // //       completed: completedFiltered
// // //     });
// // //   }, [games, searchQuery, userGameData]);

// // //   const onRefresh = useCallback(() => {
// // //     setRefreshing(true);
// // //     setGames([]);
// // //     setUserGameData({
// // //       myTickets: [],
// // //       myRequests: []
// // //     });
// // //     fetchAllData(true).finally(() => setRefreshing(false));
// // //   }, []);

// // //   const fetchAllData = async (reset = false) => {
// // //     setLoading(true);
// // //     try {
// // //       // Fetch all pages of games
// // //       await fetchAllGames();
      
// // //       // Fetch user data
// // //       await Promise.all([
// // //         fetchMyTickets(),
// // //         fetchMyRequests()
// // //       ]);
      
// // //     } catch (error) {
// // //       console.log("Error fetching data:", error);
// // //       Alert.alert("Error", "Failed to load games data!");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchAllGames = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       let page = 1;
// // //       let allGames = [];
// // //       let hasMorePages = true;
      
// // //       while (hasMorePages) {
// // //         const res = await axios.get(
// // //           `https://tambolatime.co.in/public/api/user/games?page=${page}`,
// // //           { headers: { Authorization: `Bearer ${token}` } }
// // //         );
        
// // //         if (res.data.success) {
// // //           const gamesData = res.data.games.data || [];
// // //           allGames = [...allGames, ...gamesData];
          
// // //           const paginationData = res.data.games;
// // //           hasMorePages = paginationData.current_page < paginationData.last_page;
// // //           page++;
// // //         } else {
// // //           hasMorePages = false;
// // //         }
// // //       }
      
// // //       setGames(allGames);
// // //     } catch (error) {
// // //       console.log("Error fetching games:", error);
// // //       Alert.alert("Error", "Failed to load games!");
// // //     }
// // //   };

// // //   const fetchMyTickets = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.success) {
// // //         setUserGameData(prev => ({
// // //           ...prev,
// // //           myTickets: res.data.tickets.data || []
// // //         }));
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching tickets:", error);
// // //     }
// // //   };

// // //   const fetchMyRequests = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.success) {
// // //         setUserGameData(prev => ({
// // //           ...prev,
// // //           myRequests: res.data.ticket_requests.data || []
// // //         }));
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching requests:", error);
// // //     }
// // //   };

// // //   const isUserPlayingGame = useCallback((gameId) => {
// // //     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
// // //     const hasPendingRequests = userGameData.myRequests.some(request => 
// // //       request.game_id == gameId && request.status === 'pending'
// // //     );
    
// // //     return hasTickets || hasPendingRequests;
// // //   }, [userGameData]);

// // //   const getUserTicketCount = useCallback((gameId) => {
// // //     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
// // //     const pendingRequestsCount = userGameData.myRequests.filter(request => 
// // //       request.game_id == gameId && request.status === 'pending'
// // //     ).length;
    
// // //     return {
// // //       tickets: ticketsCount,
// // //       pendingRequests: pendingRequestsCount,
// // //       total: ticketsCount + pendingRequestsCount
// // //     };
// // //   }, [userGameData]);

// // //   const handleTabChange = useCallback((tab) => {
// // //     setActiveTab(tab);
    
// // //     if (tab === 'myGames') {
// // //       fetchMyTickets();
// // //       fetchMyRequests();
// // //     }
// // //   }, []);

// // //   const getCurrentTabData = useCallback(() => {
// // //     switch (activeTab) {
// // //       case 'myGames':
// // //         return filteredGamesCache.myGames;
// // //       case 'completed':
// // //         return filteredGamesCache.completed;
// // //       case 'allGames':
// // //       default:
// // //         return filteredGamesCache.allGames;
// // //     }
// // //   }, [activeTab, filteredGamesCache]);

// // //   const getTabCount = useCallback((tab) => {
// // //     switch (tab) {
// // //       case 'myGames':
// // //         return filteredGamesCache.myGames.length;
// // //       case 'completed':
// // //         return filteredGamesCache.completed.length;
// // //       case 'allGames':
// // //       default:
// // //         return filteredGamesCache.allGames.length;
// // //     }
// // //   }, [filteredGamesCache]);

// // //   const clearSearch = () => {
// // //     setSearchQuery('');
// // //   };

// // //   // Animated background that moves with scroll
// // //   const AnimatedBackground = () => {
// // //     const block1TranslateY = scrollY.interpolate({
// // //       inputRange: [0, 300],
// // //       outputRange: [0, -50],
// // //       extrapolate: 'clamp'
// // //     });

// // //     const block2TranslateY = scrollY.interpolate({
// // //       inputRange: [0, 400],
// // //       outputRange: [0, -30],
// // //       extrapolate: 'clamp'
// // //     });

// // //     const block3TranslateY = scrollY.interpolate({
// // //       inputRange: [0, 500],
// // //       outputRange: [0, -20],
// // //       extrapolate: 'clamp'
// // //     });

// // //     const opacity = scrollY.interpolate({
// // //       inputRange: [0, 200, 400],
// // //       outputRange: [1, 0.8, 0.6],
// // //       extrapolate: 'clamp'
// // //     });

// // //     return (
// // //       <>
// // //         <Animated.View 
// // //           style={[
// // //             styles.orangeBlock1,
// // //             {
// // //               transform: [{ translateY: block1TranslateY }],
// // //               opacity
// // //             }
// // //           ]} 
// // //         />
// // //         <Animated.View 
// // //           style={[
// // //             styles.orangeBlock2,
// // //             {
// // //               transform: [{ translateY: block2TranslateY }],
// // //               opacity: opacity.interpolate({
// // //                 inputRange: [0.6, 1],
// // //                 outputRange: [0.4, 0.8]
// // //               })
// // //             }
// // //           ]} 
// // //         />
// // //         <Animated.View 
// // //           style={[
// // //             styles.orangeBlock3,
// // //             {
// // //               transform: [{ translateY: block3TranslateY }],
// // //               opacity: opacity.interpolate({
// // //                 inputRange: [0.6, 1],
// // //                 outputRange: [0.2, 0.5]
// // //               })
// // //             }
// // //           ]} 
// // //         />
// // //       </>
// // //     );
// // //   };

// // //   // Card Background with only circles - SAME ORANGE FOR ALL CARDS
// // //   const CardBackground = ({ game }) => {
// // //     const isPlaying = isUserPlayingGame(game.id);
// // //     const isCompleted = game.status === 'completed';
// // //     const isLive = game.status === 'live';
    
// // //     // ALL CARDS USE THE SAME BACKGROUND COLOR - ORANGE
// // //     // No more different colors based on status
// // //     const backgroundColor = COLORS.cardOrange; // Single consistent color
    
// // //     return (
// // //       <View style={[styles.cardBackground, { backgroundColor }]}>
// // //         {/* Decorative circles - all using the same orange shades */}
// // //         <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: COLORS.primary }]} />
// // //         <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
// // //         <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
        
// // //         {/* Small floating particles - all orange shades */}
// // //         <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: COLORS.primary }]} />
// // //         <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primaryDark }]} />
// // //         <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.primaryLight }]} />
// // //         <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.secondary }]} />
// // //       </View>
// // //     );
// // //   };

// // //   // Enhanced Header with semicircle shape and UK-style rounded lines
// // //   const Header = () => (
// // //     <View style={styles.headerWrapper}>
// // //       {/* Semicircle Background */}
// // //       <View style={styles.semicircleBackground}>
// // //         <View style={styles.semicircle} />
// // //       </View>
      
// // //       {/* UK-style Rounded Lines Pattern */}
// // //       <View style={styles.ukPatternContainer}>
// // //         <View style={styles.curvedLine1} />
// // //         <View style={styles.curvedLine2} />
// // //         <View style={styles.curvedLine3} />
        
// // //         <View style={styles.parallelLines}>
// // //           <View style={styles.parallelLine} />
// // //           <View style={styles.parallelLine} />
// // //           <View style={styles.parallelLine} />
// // //         </View>
        
// // //         <View style={styles.dottedCircle1}>
// // //           {[...Array(8)].map((_, i) => (
// // //             <View 
// // //               key={i} 
// // //               style={[
// // //                 styles.dottedCircleDot,
// // //                 {
// // //                   transform: [
// // //                     { rotate: `${i * 45}deg` },
// // //                     { translateX: 30 }
// // //                   ]
// // //                 }
// // //               ]} 
// // //             />
// // //           ))}
// // //         </View>
        
// // //         <View style={styles.decorativeDot1} />
// // //         <View style={styles.decorativeDot2} />
// // //         <View style={styles.decorativeLine1} />
// // //         <View style={styles.decorativeLine2} />
// // //       </View>

// // //       {/* Header Content */}
// // //       <View style={styles.headerContent}>
// // //         <View>
// // //           <Text style={styles.greeting}>Welcome back to</Text>
// // //           <Text style={styles.title}>
// // //             Tambola <Text style={styles.titleBold}>Games</Text>
// // //           </Text>
// // //         </View>
// // //         <View style={styles.headerRight}>
// // //           {filteredGamesCache.myGames.length > 0 && (
// // //             <View style={styles.playingCountBadge}>
// // //               <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
// // //               <Text style={styles.playingCountText}>{filteredGamesCache.myGames.length}</Text>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );

// // //   const renderGameCard = useCallback(({ item: game }) => {
// // //     const ticketCost = parseFloat(game.ticket_cost || 0);
// // //     const ticketInfo = getUserTicketCount(game.id);
// // //     const isPlaying = isUserPlayingGame(game.id);
// // //     const isCompleted = game.status === 'completed';
// // //     const isLive = game.status === 'live';
    
// // //     // Get status color and text (only these remain different)
// // //     let statusColor = COLORS.scheduled;
// // //     let statusText = 'Upcoming';
// // //     let statusIcon = 'time-outline';
// // //     if (isLive) {
// // //       statusColor = COLORS.live;
// // //       statusText = 'Live Now';
// // //       statusIcon = 'radio-button-on';
// // //     } else if (isCompleted) {
// // //       statusColor = COLORS.completed;
// // //       statusText = 'Completed';
// // //       statusIcon = 'checkmark-circle';
// // //     }
    
// // //     // ALL CARDS USE THE SAME ORANGE ACCENT
// // //     const accentColor = COLORS.primary;
// // //     const accentLight = COLORS.primaryLight;
    
// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.gameCard,
// // //           isPlaying && styles.playingGameCard,
// // //         ]}
// // //         activeOpacity={0.95}
// // //         onPress={() => navigation.navigate("GameDetails", { game })}
// // //       >
// // //         {/* Layered Background with colors and only circles - SAME FOR ALL */}
// // //         <CardBackground game={game} />

// // //         {/* Status badge - TOP LEFT corner (these vary by status for clarity) */}
// // //         <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
// // //           <Ionicons name={statusIcon} size={12} color="#FFFFFF" />
// // //           <Text style={styles.statusBadgeText}>{statusText}</Text>
// // //         </View>

// // //         {/* Playing indicator - TOP RIGHT corner */}
// // //         {isPlaying && (
// // //           <View style={[styles.playingBadge, { backgroundColor: COLORS.primary }]}>
// // //             <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
// // //             <Text style={styles.playingBadgeText}>You're Playing</Text>
// // //           </View>
// // //         )}

// // //         <View style={styles.gameCardHeader}>
// // //           {/* Icon/Logo at top left */}
// // //           <View style={styles.gameIconContainer}>
// // //             <View style={[
// // //               styles.gameIconWrapper, 
// // //               { backgroundColor: accentLight }
// // //             ]}>
// // //               <MaterialIcons name="sports-esports" size={24} color={accentColor} />
// // //             </View>
            
// // //             <View style={styles.gameTitleContainer}>
// // //               <Text style={styles.gameName} numberOfLines={1}>
// // //                 {game.game_name || "Tambola Game"}
// // //               </Text>
// // //               <Text style={styles.gameCode}>
// // //                 #{game.game_code || "N/A"}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         <View style={styles.gameCardContent}>
// // //           {/* Game Meta Information */}
// // //           <View style={styles.gameMetaRow}>
// // //             <View style={styles.metaItem}>
// // //               <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
// // //               <Text style={styles.metaText}>
// // //                 {game.game_date_formatted || game.game_date || "TBA"}
// // //               </Text>
// // //             </View>
// // //             <View style={styles.metaItem}>
// // //               <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
// // //               <Text style={styles.metaText}>
// // //                 {game.game_time_formatted || game.game_start_time || "TBA"}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           <View style={styles.gameMetaRow}>
// // //             <View style={styles.metaItem}>
// // //               <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
// // //               <Text style={styles.metaText} numberOfLines={1}>
// // //                 {game.user ? game.user.name : 'Tambola Timez'}
// // //               </Text>
// // //             </View>
// // //             {game.available_tickets !== undefined && !isCompleted && (
// // //               <View style={styles.metaItem}>
// // //                 <MaterialIcons name="confirmation-number" size={14} color={COLORS.textSecondary} />
// // //                 <Text style={styles.metaText}>
// // //                   {game.available_tickets} Left
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* Ticket info if user is playing */}
// // //           {isPlaying && (
// // //             <View style={[styles.ticketInfoContainer, { backgroundColor: accentLight }]}>
// // //               <Text style={[styles.ticketInfoText, { color: accentColor }]}>
// // //                 {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
// // //                 {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' • ' : ''}
// // //                 {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
// // //               </Text>
// // //             </View>
// // //           )}

// // //           {/* Prize Pool Section with Ticket Price */}
// // //           <View style={styles.prizeContainer}>
// // //             <View style={styles.prizeLeftSection}>
// // //               <Text style={styles.prizeLabel}>
// // //                 {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
// // //               </Text>
// // //               <Text style={styles.prizeValue}>
// // //                 {game.ticket_type === "paid" && game.max_tickets 
// // //                   ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
// // //                   : "Exciting Prizes"}
// // //               </Text>
// // //             </View>

// // //             {/* Ticket Price Badge - Next to prize pool */}
// // //             {game.ticket_type === "paid" && (
// // //               <View style={[styles.ticketPriceBadge, { backgroundColor: accentLight }]}>
// // //                 <MaterialIcons name="diamond" size={14} color={accentColor} />
// // //                 <Text style={[styles.ticketPriceText, { color: accentColor }]}>₹{ticketCost}</Text>
// // //               </View>
// // //             )}
            
// // //             {/* Action Button */}
// // //             <TouchableOpacity 
// // //               style={[styles.actionButton, 
// // //                 isPlaying && { backgroundColor: accentColor },
// // //                 isCompleted && { backgroundColor: COLORS.completed }
// // //               ]}
// // //               onPress={() => navigation.navigate("GameDetails", { game })}
// // //             >
// // //               <Text style={styles.actionButtonText}>
// // //                 {isCompleted ? 'Results' : isPlaying ? 'View' : isLive ? 'Join' : 'Details'}
// // //               </Text>
// // //               <Ionicons 
// // //                 name={isCompleted ? "trophy" : "arrow-forward"} 
// // //                 size={14} 
// // //                 color="#FFFFFF" 
// // //               />
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   }, [isUserPlayingGame, getUserTicketCount, navigation]);

// // //   const renderTabBar = () => (
// // //     <View style={styles.tabsContainer}>
// // //       {tabs.map((tab) => {
// // //         const isActive = activeTab === tab.id;
// // //         const tabKey = tab.id;
        
// // //         return (
// // //           <TouchableOpacity
// // //             key={tab.id}
// // //             style={[
// // //               styles.tabButton,
// // //               isActive && styles.tabButtonActive,
// // //             ]}
// // //             onPress={() => handleTabChange(tab.id)}
// // //           >
// // //             <Text style={[
// // //               styles.tabButtonText,
// // //               isActive && styles.tabButtonTextActive
// // //             ]}>
// // //               {tab.label}
// // //             </Text>
// // //             <View style={[
// // //               styles.tabCount,
// // //               isActive && styles.tabCountActive
// // //             ]}>
// // //               <Text style={[
// // //                 styles.tabCountText,
// // //                 isActive && styles.tabCountTextActive
// // //               ]}>
// // //                 {getTabCount(tabKey)}
// // //               </Text>
// // //             </View>
// // //           </TouchableOpacity>
// // //         );
// // //       })}
// // //     </View>
// // //   );

// // //   const renderEmptyList = useCallback(() => (
// // //     <View style={styles.emptyGames}>
// // //       <Ionicons 
// // //         name={
// // //           activeTab === 'myGames' ? "person-outline" : 
// // //           activeTab === 'completed' ? "trophy-outline" : 
// // //           "game-controller-outline"
// // //         } 
// // //         size={48} 
// // //         color={COLORS.textLight} 
// // //       />
// // //       <Text style={styles.emptyGamesText}>
// // //         {activeTab === 'myGames' 
// // //           ? "You haven't joined any games yet"
// // //           : activeTab === 'completed'
// // //           ? 'No completed games available'
// // //           : searchQuery ? 'No games found' : 'No games available'}
// // //       </Text>
// // //       {searchQuery && (
// // //         <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
// // //           <Text style={styles.clearSearchButtonText}>Clear Search</Text>
// // //         </TouchableOpacity>
// // //       )}
// // //       {activeTab === 'myGames' && !searchQuery && (
// // //         <TouchableOpacity 
// // //           style={styles.clearSearchButton}
// // //           onPress={() => handleTabChange('allGames')}
// // //         >
// // //           <Text style={styles.clearSearchButtonText}>Browse All Games</Text>
// // //         </TouchableOpacity>
// // //       )}
// // //     </View>
// // //   ), [activeTab, searchQuery]);

// // //   // Handle main scroll for background animation
// // //   const handleMainScroll = Animated.event(
// // //     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // //     { useNativeDriver: false }
// // //   );

// // //   if (loading && games.length === 0) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <View style={styles.loadingContainer}>
// // //           <ActivityIndicator size="large" color={COLORS.primary} />
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

// // //       <View style={styles.container}>
// // //         {/* Animated Color Blocks */}
// // //         <AnimatedBackground />

// // //         <Animated.FlatList
// // //           data={getCurrentTabData()}
// // //           renderItem={renderGameCard}
// // //           keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               tintColor={COLORS.primary}
// // //               colors={[COLORS.primary]}
// // //             />
// // //           }
// // //           onScroll={handleMainScroll}
// // //           scrollEventThrottle={16}
// // //           ListHeaderComponent={
// // //             <>
// // //               {/* Enhanced Header */}
// // //               <Header />

// // //               {/* Search */}
// // //               <View style={styles.searchBox}>
// // //                 <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
// // //                 <TextInput
// // //                   placeholder="Search games by name or ID..."
// // //                   placeholderTextColor={COLORS.textLight}
// // //                   style={styles.searchInput}
// // //                   value={searchQuery}
// // //                   onChangeText={setSearchQuery}
// // //                   returnKeyType="search"
// // //                   onSubmitEditing={Keyboard.dismiss}
// // //                 />
// // //                 {searchQuery.length > 0 ? (
// // //                   <TouchableOpacity onPress={clearSearch}>
// // //                     <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
// // //                   </TouchableOpacity>
// // //                 ) : (
// // //                   <Ionicons name="options-outline" size={18} color={COLORS.textSecondary} />
// // //                 )}
// // //               </View>

// // //               {/* Tabs */}
// // //               {renderTabBar()}

// // //               {/* Games Count */}
// // //               <View style={styles.gamesCountContainer}>
// // //                 <Text style={styles.gamesCount}>
// // //                   {getCurrentTabData().length} {getCurrentTabData().length === 1 ? 'Game' : 'Games'} Available
// // //                 </Text>
// // //               </View>
// // //             </>
// // //           }
// // //           ListEmptyComponent={renderEmptyList}
// // //           contentContainerStyle={styles.flatListContent}
// // //         />
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: COLORS.background,
// // //     paddingHorizontal: 16,
// // //   },
  
// // //   /* COLOR BLOCKS - Orange Shades - Animated */
// // //   orangeBlock1: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     height: 280,
// // //     backgroundColor: COLORS.blockLightOrange,
// // //     borderBottomLeftRadius: 50,
// // //     borderBottomRightRadius: 50,
// // //   },
// // //   orangeBlock2: {
// // //     position: 'absolute',
// // //     top: 200,
// // //     left: 0,
// // //     right: 0,
// // //     height: 160,
// // //     backgroundColor: COLORS.blockMediumOrange,
// // //   },
// // //   orangeBlock3: {
// // //     position: 'absolute',
// // //     top: 300,
// // //     left: 0,
// // //     right: 0,
// // //     height: 100,
// // //     backgroundColor: COLORS.blockDarkOrange,
// // //     opacity: 0.3,
// // //   },
  
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
  
// // //   /* Enhanced Header with Semicircle and UK Pattern */
// // //   headerWrapper: {
// // //     position: 'relative',
// // //     marginTop: 8,
// // //     marginBottom: 16,
// // //     overflow: 'hidden',
// // //   },
  
// // //   /* Semicircle Background */
// // //   semicircleBackground: {
// // //     position: 'absolute',
// // //     top: -40,
// // //     right: -30,
// // //     width: 200,
// // //     height: 200,
// // //     overflow: 'hidden',
// // //   },
// // //   semicircle: {
// // //     position: 'absolute',
// // //     width: 400,
// // //     height: 200,
// // //     backgroundColor: COLORS.primaryLight,
// // //     borderTopLeftRadius: 200,
// // //     borderTopRightRadius: 200,
// // //     transform: [{ rotate: '-15deg' }],
// // //     opacity: 0.3,
// // //   },
  
// // //   /* UK-style Rounded Lines Pattern */
// // //   ukPatternContainer: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //   },
  
// // //   curvedLine1: {
// // //     position: 'absolute',
// // //     top: 20,
// // //     right: 50,
// // //     width: 80,
// // //     height: 40,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
// // //     borderTopWidth: 0,
// // //     borderRightWidth: 0,
// // //     borderRadius: 40,
// // //     opacity: 0.15,
// // //     transform: [{ rotate: '-10deg' }],
// // //   },
// // //   curvedLine2: {
// // //     position: 'absolute',
// // //     bottom: 10,
// // //     left: 30,
// // //     width: 60,
// // //     height: 30,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
// // //     borderBottomWidth: 0,
// // //     borderLeftWidth: 0,
// // //     borderRadius: 30,
// // //     opacity: 0.15,
// // //     transform: [{ rotate: '15deg' }],
// // //   },
// // //   curvedLine3: {
// // //     position: 'absolute',
// // //     top: 40,
// // //     left: 100,
// // //     width: 100,
// // //     height: 50,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
// // //     borderTopWidth: 0,
// // //     borderLeftWidth: 0,
// // //     borderRadius: 50,
// // //     opacity: 0.1,
// // //     transform: [{ rotate: '20deg' }],
// // //   },
  
// // //   parallelLines: {
// // //     position: 'absolute',
// // //     top: 30,
// // //     left: 20,
// // //   },
// // //   parallelLine: {
// // //     width: 80,
// // //     height: 2,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.1,
// // //     marginVertical: 4,
// // //     borderRadius: 1,
// // //   },
  
// // //   dottedCircle1: {
// // //     position: 'absolute',
// // //     bottom: 20,
// // //     right: 30,
// // //     width: 60,
// // //     height: 60,
// // //   },
// // //   dottedCircleDot: {
// // //     position: 'absolute',
// // //     width: 4,
// // //     height: 4,
// // //     borderRadius: 2,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.2,
// // //     top: 28,
// // //     left: 28,
// // //   },
  
// // //   decorativeDot1: {
// // //     position: 'absolute',
// // //     top: 60,
// // //     right: 80,
// // //     width: 6,
// // //     height: 6,
// // //     borderRadius: 3,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.2,
// // //   },
// // //   decorativeDot2: {
// // //     position: 'absolute',
// // //     bottom: 40,
// // //     left: 150,
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.15,
// // //   },
// // //   decorativeLine1: {
// // //     position: 'absolute',
// // //     top: 10,
// // //     left: 150,
// // //     width: 40,
// // //     height: 2,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.1,
// // //     borderRadius: 1,
// // //     transform: [{ rotate: '30deg' }],
// // //   },
// // //   decorativeLine2: {
// // //     position: 'absolute',
// // //     bottom: 30,
// // //     right: 100,
// // //     width: 50,
// // //     height: 2,
// // //     backgroundColor: COLORS.primary,
// // //     opacity: 0.1,
// // //     borderRadius: 1,
// // //     transform: [{ rotate: '-20deg' }],
// // //   },
  
// // //   /* Header Content */
// // //   headerContent: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     position: 'relative',
// // //     zIndex: 2,
// // //     paddingVertical: 10,
// // //   },
// // //   greeting: {
// // //     fontSize: 14,
// // //     color: COLORS.textSecondary,
// // //     marginBottom: 2,
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     color: COLORS.text,
// // //     lineHeight: 32,
// // //   },
// // //   titleBold: {
// // //     fontWeight: '700',
// // //     color: COLORS.primary,
// // //   },
// // //   headerRight: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   playingCountBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     gap: 4,
// // //     shadowColor: COLORS.primary,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   playingCountText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //   },
  
// // //   /* Search Box */
// // //   searchBox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 18,
// // //     paddingHorizontal: 14,
// // //     paddingVertical: Platform.OS === 'ios' ? 12 : 8,
// // //     marginBottom: 16,
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     marginHorizontal: 10,
// // //     color: COLORS.text,
// // //     fontSize: 14,
// // //     padding: 0,
// // //   },
  
// // //   /* Tabs - Without Icons */
// // //   tabsContainer: {
// // //     flexDirection: 'row',
// // //     marginBottom: 16,
// // //     gap: 8,
// // //   },
// // //   tabButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     backgroundColor: COLORS.surface,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 8,
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     gap: 4,
// // //   },
// // //   tabButtonActive: {
// // //     backgroundColor: COLORS.primary,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   tabButtonText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     color: COLORS.textSecondary,
// // //   },
// // //   tabButtonTextActive: {
// // //     color: COLORS.surface,
// // //   },
// // //   tabCount: {
// // //     backgroundColor: COLORS.background,
// // //     borderRadius: 12,
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 2,
// // //     marginLeft: 2,
// // //   },
// // //   tabCountActive: {
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //   },
// // //   tabCountText: {
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //     color: COLORS.textSecondary,
// // //   },
// // //   tabCountTextActive: {
// // //     color: COLORS.surface,
// // //   },
  
// // //   /* Games Count */
// // //   gamesCountContainer: {
// // //     marginBottom: 16,
// // //   },
// // //   gamesCount: {
// // //     fontSize: 14,
// // //     color: COLORS.textSecondary,
// // //     fontWeight: '500',
// // //   },
  
// // //   /* Card Background - New enhanced styles */
// // //   cardBackground: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     borderRadius: 24,
// // //   },
  
// // //   /* Decorative circles */
// // //   cardDecorativeCircle: {
// // //     position: 'absolute',
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     opacity: 0.08,
// // //   },
// // //   circle1: {
// // //     top: -30,
// // //     right: -30,
// // //     width: 150,
// // //     height: 150,
// // //     borderRadius: 75,
// // //   },
// // //   circle2: {
// // //     bottom: -20,
// // //     left: -20,
// // //     width: 120,
// // //     height: 120,
// // //     borderRadius: 60,
// // //     opacity: 0.06,
// // //   },
// // //   circle3: {
// // //     top: '40%',
// // //     left: '30%',
// // //     width: 80,
// // //     height: 80,
// // //     borderRadius: 40,
// // //     opacity: 0.05,
// // //   },
  
// // //   /* Floating particles */
// // //   floatingParticle: {
// // //     position: 'absolute',
// // //     width: 4,
// // //     height: 4,
// // //     borderRadius: 2,
// // //     opacity: 0.12,
// // //   },
// // //   particle1: {
// // //     top: 20,
// // //     right: 40,
// // //     width: 6,
// // //     height: 6,
// // //   },
// // //   particle2: {
// // //     bottom: 30,
// // //     left: 50,
// // //     width: 5,
// // //     height: 5,
// // //   },
// // //   particle3: {
// // //     top: '60%',
// // //     right: 60,
// // //     width: 7,
// // //     height: 7,
// // //   },
// // //   particle4: {
// // //     bottom: '20%',
// // //     left: 80,
// // //     width: 4,
// // //     height: 4,
// // //   },
  
// // //   /* Game Cards */
// // //   gameCard: {
// // //     borderRadius: 24,
// // //     marginBottom: 16,
// // //     padding: 16,
// // //     paddingTop: 40, // Space for badges
// // //     elevation: 4,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 12,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.5)',
// // //   },
// // //   playingGameCard: {
// // //     borderWidth: 2,
// // //     borderColor: COLORS.primary,
// // //     shadowColor: COLORS.primary,
// // //     shadowOpacity: 0.15,
// // //   },

// // //   /* Status Badge - TOP LEFT corner */
// // //   statusBadge: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderBottomRightRadius: 20,
// // //     borderTopLeftRadius: 24,
// // //     gap: 4,
// // //     zIndex: 10,
// // //     elevation: 5,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.surface,
// // //   },
// // //   statusBadgeText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 11,
// // //     fontWeight: '700',
// // //   },

// // //   /* Playing Badge - TOP RIGHT corner */
// // //   playingBadge: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     right: 0,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderBottomLeftRadius: 20,
// // //     borderTopRightRadius: 24,
// // //     gap: 4,
// // //     zIndex: 10,
// // //     elevation: 5,
// // //     shadowColor: COLORS.primary,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //     borderWidth: 2,
// // //     borderColor: COLORS.surface,
// // //   },
// // //   playingBadgeText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 11,
// // //     fontWeight: '700',
// // //   },

// // //   /* Game Card Header with Icon */
// // //   gameCardHeader: {
// // //     marginBottom: 16,
// // //     marginTop: 1, // Space between badges and content
// // //     zIndex: 2,
// // //   },
// // //   gameIconContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 12,
// // //   },
// // //   gameIconWrapper: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 16,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     shadowColor: COLORS.primary,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   gameTitleContainer: {
// // //     flex: 1,
// // //   },
// // //   gameName: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: COLORS.text,
// // //     marginBottom: 4,
// // //   },
// // //   gameCode: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //   },

// // //   /* Game Content */
// // //   gameCardContent: {
// // //     gap: 12,
// // //     zIndex: 2,
// // //   },
// // //   gameMetaRow: {
// // //     flexDirection: 'row',
// // //     gap: 16,
// // //   },
// // //   metaItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //     flex: 1,
// // //   },
// // //   metaText: {
// // //     fontSize: 13,
// // //     color: COLORS.textSecondary,
// // //     flex: 1,
// // //   },

// // //   /* Ticket Info */
// // //   ticketInfoContainer: {
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     alignSelf: 'flex-start',
// // //   },
// // //   ticketInfoText: {
// // //     fontSize: 11,
// // //     fontWeight: '600',
// // //   },

// // //   /* Prize and Action */
// // //   prizeContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(0,0,0,0.05)',
// // //   },
// // //   prizeLeftSection: {
// // //     flex: 1,
// // //   },
// // //   prizeLabel: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //     marginBottom: 2,
// // //   },
// // //   prizeValue: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: COLORS.text,
// // //   },
// // //   ticketPriceBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     gap: 4,
// // //     marginRight: 8,
// // //   },
// // //   ticketPriceText: {
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //   },
// // //   actionButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     borderRadius: 30,
// // //     gap: 6,
// // //     shadowColor: COLORS.primary,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   actionButtonText: {
// // //     color: '#FFFFFF',
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //   },

// // //   /* Empty State */
// // //   emptyGames: {
// // //     alignItems: 'center',
// // //     padding: 40,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 24,
// // //     marginTop: 20,
// // //   },
// // //   emptyGamesText: {
// // //     fontSize: 16,
// // //     color: COLORS.textSecondary,
// // //     marginTop: 12,
// // //     marginBottom: 16,
// // //     textAlign: 'center',
// // //   },
// // //   clearSearchButton: {
// // //     backgroundColor: COLORS.primary,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 20,
// // //   },
// // //   clearSearchButtonText: {
// // //     color: COLORS.surface,
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
  
// // //   flatListContent: {
// // //     paddingBottom: 20,
// // //   },
// // // });

// // // export default Game;









// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   RefreshControl,
//   Dimensions,
//   TextInput,
//   Keyboard,
//   Animated,
//   Easing,
//   FlatList,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width } = Dimensions.get('window');

// // NEW Color scheme matching the Home component
// const PRIMARY_COLOR = "#4facfe"; // Main blue color
// const ACCENT_COLOR = "#ff9800"; // Orange accent
// const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// const WHITE = "#FFFFFF";
// const TEXT_DARK = "#333333";
// const TEXT_LIGHT = "#777777";
// const BORDER_COLOR = "#EEEEEE";
// const CARD_BACKGROUND = "#FFFFFF";

// // Additional colors for completed games - replaced gray with teal
// const COMPLETED_COLOR = "#ff9800"; // Teal color instead of gray
// const COMPLETED_LIGHT = "#f5eee2"; // Light teal background

// const Game = ({ navigation }) => {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userGameData, setUserGameData] = useState({
//     myTickets: [],
//     myRequests: []
//   });
//   const [activeTab, setActiveTab] = useState('myGames');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
  
//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     fetchAllData();
//     startAnimations();
    
//     // Start fade animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const startAnimations = () => {
//     // First floating animation
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

//     // Second floating animation
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

//     // Pulse animation
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
//   };

//   // Interpolations for animations
//   const translateY1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   const translateY2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -10]
//   });

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     setHasMore(true);
//     fetchAllData(true).finally(() => setRefreshing(false));
//   }, []);

//   const fetchAllData = async (reset = false) => {
//     if (reset) {
//       setGames([]);
//     }
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchGames(1, reset),
//         fetchMyTickets(),
//         fetchMyRequests()
//       ]);
//     } catch (error) {
//       console.log("Error fetching data:", error);
//       Alert.alert("Error", "Failed to load games data!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGames = async (page = 1, reset = false) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games?page=${page}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.success) {
//         const gamesData = res.data.games.data || [];
//         const paginationData = res.data.games;
        
//         if (reset) {
//           setGames(gamesData);
//         } else {
//           setGames(prev => [...prev, ...gamesData]);
//         }
        
//         setCurrentPage(paginationData.current_page);
//         setLastPage(paginationData.last_page);
//         setHasMore(paginationData.current_page < paginationData.last_page);
//       }
//     } catch (error) {
//       console.log("Error fetching games:", error);
//       Alert.alert("Error", "Failed to load games!");
//     }
//   };

//   const fetchMyTickets = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setUserGameData(prev => ({
//           ...prev,
//           myTickets: res.data.tickets.data || []
//         }));
//       }
//     } catch (error) {
//       console.log("Error fetching tickets:", error);
//     }
//   };

//   const fetchMyRequests = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setUserGameData(prev => ({
//           ...prev,
//           myRequests: res.data.ticket_requests.data || []
//         }));
//       }
//     } catch (error) {
//       console.log("Error fetching requests:", error);
//     }
//   };

//   const loadMoreGames = () => {
//     if (!loadingMore && hasMore) {
//       setLoadingMore(true);
//       const nextPage = currentPage + 1;
//       fetchGames(nextPage).finally(() => setLoadingMore(false));
//     }
//   };

//   const isUserPlayingGame = (gameId) => {
//     const hasTickets = userGameData.myTickets.some(ticket => ticket.game_id == gameId);
//     const hasPendingRequests = userGameData.myRequests.some(request => 
//       request.game_id == gameId && request.status === 'pending'
//     );
    
//     return hasTickets || hasPendingRequests;
//   };

//   const getUserTicketCount = (gameId) => {
//     const ticketsCount = userGameData.myTickets.filter(ticket => ticket.game_id == gameId).length;
//     const pendingRequestsCount = userGameData.myRequests.filter(request => 
//       request.game_id == gameId && request.status === 'pending'
//     ).length;
    
//     return {
//       tickets: ticketsCount,
//       pendingRequests: pendingRequestsCount,
//       total: ticketsCount + pendingRequestsCount
//     };
//   };

//   const getFilteredGames = () => {
//     let filtered = games;

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(game =>
//         game.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         game.game_code.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (activeTab === 'myGames') {
//       filtered = filtered.filter(game => isUserPlayingGame(game.id));
//     } else if (activeTab === 'completed') {
//       filtered = filtered.filter(game => game.status === 'completed');
//     }

//     return filtered;
//   };

//   const renderPlayingBadge = (game) => {
//     const ticketInfo = getUserTicketCount(game.id);
    
//     if (ticketInfo.total === 0) return null;
    
//     return (
//       <View style={styles.playingBadge}>
//         <View style={styles.playingBadgeIcon}>
//           <Ionicons name="person-circle" size={12} color={WHITE} />
//         </View>
//         <Text style={styles.playingBadgeText}>
//           {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
//           {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
//           {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
//         </Text>
//       </View>
//     );
//   };

//   const renderGameCard = ({ item: game }) => {
//     const ticketCost = parseFloat(game.ticket_cost || 0);
//     const ticketInfo = getUserTicketCount(game.id);
//     const isPlaying = isUserPlayingGame(game.id);
//     const isCompleted = game.status === 'completed';
//     const isLive = game.status === 'live';
//     const isScheduled = game.status === 'scheduled';
    
//     return (
//       <TouchableOpacity
//         key={game.id}
//         style={[
//           styles.gameCard,
//           isPlaying && styles.playingGameCard,
//           isCompleted && styles.completedGameCard,
//         ]}
//         activeOpacity={0.9}
//         onPress={() => navigation.navigate("GameDetails", { game })}
//       >
//         {/* Background Pattern */}
//         <View style={styles.gameCardPattern} />
        
//         {/* Status badge on left top corner */}
//         <View style={[
//           styles.statusBadge,
//           isLive ? styles.liveBadge :
//           isScheduled ? styles.scheduledBadge :
//           isCompleted ? styles.completedBadgeNew :
//           styles.defaultBadge
//         ]}>
//           <Ionicons 
//             name={
//               isLive ? 'radio-button-on' : 
//               isCompleted ? 'trophy' :
//               'time'
//             } 
//             size={10} 
//             color={WHITE} 
//           />
//           <Text style={styles.statusText}>
//             {isLive ? 'LIVE' : 
//              isCompleted ? 'COMPLETED' : 
//              'SOON'}
//           </Text>
//         </View>

//         {/* Playing indicator */}
//         {isPlaying && (
//           <View style={styles.playingCardOverlay}>
//             <View style={styles.playingCardLabel}>
//               <Ionicons name="checkmark-circle" size={12} color={WHITE} />
//               <Text style={styles.playingCardLabelText}>You're Playing</Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.cardHeader}>
//           <View style={styles.gameIconContainer}>
//             <View style={[
//               styles.gameIconWrapper,
//               isCompleted && { borderColor: COMPLETED_COLOR }
//             ]}>
//               <MaterialIcons 
//                 name={isCompleted ? "trophy" : "confirmation-number"} 
//                 size={32} 
//                 color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
//               />
//             </View>
//             <View style={styles.gameInfo}>
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {game.game_name}
//               </Text>
//               <Text style={styles.gameId}>
//                 ID: {game.game_code}
//               </Text>
//               {isPlaying && renderPlayingBadge(game)}
//             </View>
//           </View>
          
//           <View style={[
//             styles.gameTypeBadge,
//             game.ticket_type === "paid" ? styles.paidBadge : styles.freeBadge,
//             isCompleted && { borderColor: COMPLETED_COLOR }
//           ]}>
//             {game.ticket_type === "paid" ? (
//               <>
//                 <MaterialIcons name="diamond" size={14} color={ACCENT_COLOR} />
//                 <Text style={styles.gameTypeText}>
//                   ₹{ticketCost}
//                 </Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="checkmark-circle" size={14} color={ACCENT_COLOR} />
//                 <Text style={styles.gameTypeText}>
//                   FREE
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>

//         <View style={styles.gameDetails}>
//           <View style={styles.detailRow}>
//             <View style={styles.detailItem}>
//               <View style={[
//                 styles.detailIcon,
//                 isCompleted && { borderColor: COMPLETED_COLOR }
//               ]}>
//                 <Ionicons 
//                   name="calendar" 
//                   size={14} 
//                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
//                 />
//               </View>
//               <View>
//                 <Text style={styles.detailLabel}>Date</Text>
//                 <Text style={styles.detailText}>
//                   {game.game_date_formatted || game.game_date}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.detailItem}>
//               <View style={[
//                 styles.detailIcon,
//                 isCompleted && { borderColor: COMPLETED_COLOR }
//               ]}>
//                 <Ionicons 
//                   name="time" 
//                   size={14} 
//                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
//                 />
//               </View>
//               <View>
//                 <Text style={styles.detailLabel}>Time</Text>
//                 <Text style={styles.detailText}>
//                   {game.game_time_formatted || game.game_start_time}
//                 </Text>
//               </View>
//             </View>
//           </View>
          
//           <View style={styles.detailRow}>
//             <View style={styles.detailItem}>
//               <View style={[
//                 styles.detailIcon,
//                 isCompleted && { borderColor: COMPLETED_COLOR }
//               ]}>
//                 <Ionicons 
//                   name="person" 
//                   size={14} 
//                   color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
//                 />
//               </View>
//               <View>
//                 <Text style={styles.detailLabel}>Host</Text>
//                 <Text style={styles.detailText}>
//                   {game.user ? game.user.name : 'Tambola Timez'}
//                 </Text>
//               </View>
//             </View>
            
//             {game.available_tickets !== undefined && !isCompleted && (
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Tickets</Text>
//                   <Text style={styles.detailText}>
//                     {game.available_tickets} Left
//                   </Text>
//                 </View>
//               </View>
//             )}
//             {isCompleted && (
//               <View style={styles.detailItem}>
//                 <View style={[styles.detailIcon, { borderColor: COMPLETED_COLOR }]}>
//                   <Ionicons name="trophy" size={14} color={COMPLETED_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Status</Text>
//                   <Text style={styles.detailText}>Completed</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={[
//           styles.prizeContainer,
//           isCompleted && { backgroundColor: COMPLETED_LIGHT }
//         ]}>
//           <View style={[
//             styles.prizeIcon,
//             isCompleted && { borderColor: COMPLETED_COLOR }
//           ]}>
//             <MaterialIcons 
//               name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
//               size={18} 
//               color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
//             />
//           </View>
//           <View style={styles.prizeInfo}>
//             <Text style={styles.prizeLabel}>
//               {isCompleted ? 'Prize Pool Was' : 'Prize Pool'}
//             </Text>
//             <Text style={styles.prizeText}>
//               {game.ticket_type === "paid" && game.max_tickets 
//                 ? `₹${(ticketCost * game.max_tickets).toLocaleString()}`
//                 : "Exciting Prizes"}
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={[
//             styles.joinButton,
//             isPlaying && styles.playingJoinButton,
//             isCompleted && styles.completedJoinButtonNew
//           ]}
//           onPress={() => navigation.navigate("GameDetails", { game })}
//         >
//           <View style={styles.glassEffectOverlay} />
//           <Text style={styles.joinButtonText}>
//             {isCompleted 
//               ? 'VIEW RESULTS' 
//               : isPlaying 
//                 ? 'VIEW MY GAME' 
//                 : isLive
//                   ? 'JOIN GAME' 
//                   : 'VIEW DETAILS'}
//           </Text>
//           <Ionicons 
//             name={isCompleted ? "trophy" : "arrow-forward"} 
//             size={16} 
//             color={WHITE} 
//           />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   const TabButton = ({ title, count, isActive, onPress }) => (
//     <TouchableOpacity
//       style={[styles.tabButton, isActive && styles.tabButtonActive]}
//       onPress={onPress}
//     >
//       <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
//         {title}
//       </Text>
//       {count > 0 && (
//         <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
//           <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
//             {count}
//           </Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   const renderFooter = () => {
//     if (!loadingMore) return null;
    
//     return (
//       <View style={styles.loadingMoreContainer}>
//         <ActivityIndicator size="small" color={PRIMARY_COLOR} />
//         <Text style={styles.loadingMoreText}>Loading more games...</Text>
//       </View>
//     );
//   };

//   const renderEmptyList = () => (
//     <View style={styles.emptyState}>
//       <View style={styles.emptyIconWrapper}>
//         <Ionicons 
//           name={
//             activeTab === 'myGames' ? "game-controller-outline" : 
//             activeTab === 'completed' ? "trophy-outline" : 
//             "search-outline"
//           } 
//           size={50} 
//           color={PRIMARY_COLOR} 
//         />
//       </View>
//       <Text style={styles.emptyTitle}>
//         {activeTab === 'myGames' 
//           ? 'No Games Found' 
//           : activeTab === 'completed'
//           ? 'No Completed Games'
//           : 'No Games Available'}
//       </Text>
//       <Text style={styles.emptySubtitle}>
//         {searchQuery 
//           ? `No games found for "${searchQuery}"`
//           : activeTab === 'myGames'
//           ? "You haven't joined any games yet. Browse all games to get started!"
//           : activeTab === 'completed'
//           ? "No completed games available yet. Check back later!"
//           : "Check back later for new exciting games!"}
//       </Text>
//       {searchQuery && (
//         <TouchableOpacity 
//           style={styles.clearFiltersButton}
//           onPress={() => setSearchQuery('')}
//         >
//           <View style={styles.glassEffectOverlay} />
//           <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
//         </TouchableOpacity>
//       )}
//       {activeTab === 'myGames' && !searchQuery && (
//         <TouchableOpacity 
//           style={styles.browseGamesButton}
//           onPress={() => setActiveTab('allGames')}
//         >
//           <View style={styles.glassEffectOverlay} />
//           <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.section}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>
//           {activeTab === 'myGames' ? 'My Games' : 
//            activeTab === 'completed' ? 'Completed Games' : 
//            'All Games'}
//         </Text>
//         <Text style={styles.gameCount}>
//           {getFilteredGames().length} Game{getFilteredGames().length !== 1 ? 's' : ''}
//         </Text>
//       </View>
//     </View>
//   );

//   if (loading && games.length === 0) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <View style={styles.backgroundPattern}>
//             <Animated.View 
//               style={[
//                 styles.pokerChip1, 
//                 { transform: [{ translateY: translateY1 }] }
//               ]} 
//             />
//             <Animated.View 
//               style={[
//                 styles.pokerChip2, 
//                 { transform: [{ translateY: translateY2 }] }
//               ]} 
//             />
//           </View>
          
//           <View style={styles.loadingAnimation}>
//             <View style={styles.loadingIconWrapper}>
//               <Ionicons name="game-controller" size={40} color={PRIMARY_COLOR} />
//             </View>
//             <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
//           </View>
//           <Text style={styles.loadingText}>Loading games...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const myGamesCount = games.filter(game => isUserPlayingGame(game.id)).length;
//   const completedGamesCount = games.filter(game => game.status === 'completed').length;
//   const allGamesCount = games.length;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
//         <View style={styles.backgroundPattern}>
//           <Animated.View 
//             style={[
//               styles.pokerChip1, 
//               { transform: [{ translateY: translateY1 }] }
//             ]} 
//           />
//           <Animated.View 
//             style={[
//               styles.pokerChip2, 
//               { transform: [{ translateY: translateY2 }] }
//             ]} 
//           />
//         </View>

//         {/* Fixed Header */}
//         <Animated.View 
//           style={[
//             styles.header,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         >
//           <View style={styles.headerContent}>
//             <View style={styles.headerTop}>
//               <View>
//                 <Text style={styles.appName}>Tambola Games</Text>
//                 <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
//               </View>
//               {myGamesCount > 0 && (
//                 <View style={styles.playingCountBadge}>
//                   <Ionicons name="checkmark-circle" size={14} color={WHITE} />
//                   <Text style={styles.playingCountText}>{myGamesCount}</Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.searchContainer}>
//               <View style={styles.searchIcon}>
//                 <Feather name="search" size={20} color={TEXT_LIGHT} />
//               </View>
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search games by name or ID..."
//                 placeholderTextColor={TEXT_LIGHT}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 returnKeyType="search"
//                 onSubmitEditing={Keyboard.dismiss}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   style={styles.clearButton}
//                   onPress={() => setSearchQuery('')}
//                 >
//                   <Ionicons name="close-circle" size={20} color={TEXT_LIGHT} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </Animated.View>

//         {/* Fixed Tabs */}
//         <View style={styles.tabsContainer}>
//           <TabButton
//             title="My Games"
//             count={myGamesCount}
//             isActive={activeTab === 'myGames'}
//             onPress={() => setActiveTab('myGames')}
//           />
//           <TabButton
//             title="All Games"
//             count={allGamesCount}
//             isActive={activeTab === 'allGames'}
//             onPress={() => setActiveTab('allGames')}
//           />
//           <TabButton
//             title="Completed"
//             count={completedGamesCount}
//             isActive={activeTab === 'completed'}
//             onPress={() => setActiveTab('completed')}
//           />
//         </View>

//         {/* Scrollable content */}
//         <FlatList
//           data={getFilteredGames()}
//           renderItem={renderGameCard}
//           keyExtractor={(item) => item.id.toString()}
//           style={styles.flatList}
//           contentContainerStyle={styles.flatListContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={PRIMARY_COLOR}
//               colors={[PRIMARY_COLOR]}
//             />
//           }
//           onEndReached={loadMoreGames}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={renderFooter}
//           ListEmptyComponent={renderEmptyList}
//           ListHeaderComponent={renderHeader}
//         />
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// export default Game;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   flatList: {
//     flex: 1,
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   loadingMoreContainer: {
//     paddingVertical: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 10,
//   },
//   loadingMoreText: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     marginLeft: 10,
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
//     left: width * 0.1,
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
//     right: width * 0.15,
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: BACKGROUND_COLOR,
//     position: 'relative',
//   },
//   loadingAnimation: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   loadingIconWrapper: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'rgba(79, 172, 254, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(79, 172, 254, 0.2)',
//   },
//   loadingSpinner: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   header: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingTop: 20,
//     paddingBottom: 15,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerContent: {
//     paddingHorizontal: 20,
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: WHITE,
//     letterSpacing: -0.5,
//   },
//   appTagline: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 2,
//     fontWeight: "500",
//   },
//   playingCountBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   playingCountText: {
//     color: WHITE,
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: WHITE,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: TEXT_DARK,
//     paddingVertical: 4,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     backgroundColor: WHITE,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   tabButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginRight: 10,
//     backgroundColor: BACKGROUND_COLOR,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   tabButtonActive: {
//     backgroundColor: PRIMARY_COLOR,
//     borderColor: PRIMARY_COLOR,
//   },
//   tabButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: TEXT_LIGHT,
//   },
//   tabButtonTextActive: {
//     color: WHITE,
//   },
//   tabCount: {
//     backgroundColor: 'rgba(79, 172, 254, 0.1)',
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginLeft: 6,
//   },
//   tabCountActive: {
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   tabCountText: {
//     color: PRIMARY_COLOR,
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   tabCountTextActive: {
//     color: WHITE,
//   },
//   section: {
//     paddingHorizontal: 20,
//     paddingTop: 15,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   gameCount: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   gameCard: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 16,
//     marginHorizontal: 20,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   playingGameCard: {
//     borderColor: PRIMARY_COLOR,
//     borderWidth: 2,
//   },
//   completedGameCard: {
//     borderColor: COMPLETED_COLOR,
//     borderWidth: 1,
//     backgroundColor: COMPLETED_LIGHT,
//   },
//   playingCardOverlay: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     zIndex: 2,
//   },
//   playingCardLabel: {
//     backgroundColor: PRIMARY_COLOR,
//     borderBottomLeftRadius: 12,
//     borderTopRightRadius: 14,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   playingCardLabelText: {
//     color: WHITE,
//     fontSize: 10,
//     fontWeight: "700",
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderBottomRightRadius: 12,
//     borderTopLeftRadius: 14,
//     gap: 4,
//     zIndex: 2,
//   },
//   liveBadge: {
//     backgroundColor: '#4CAF50',
//   },
//   scheduledBadge: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   completedBadgeNew: {
//     backgroundColor: COMPLETED_COLOR,
//   },
//   defaultBadge: {
//     backgroundColor: ACCENT_COLOR,
//   },
//   statusText: {
//     color: WHITE,
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   gameCardPattern: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 50,
//     height: 50,
//     borderBottomLeftRadius: 16,
//     borderTopRightRadius: 25,
//     backgroundColor: 'rgba(79, 172, 254, 0.05)',
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   gameIconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     gap: 12,
//   },
//   gameIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     backgroundColor: BACKGROUND_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: PRIMARY_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   gameInfo: {
//     flex: 1,
//   },
//   gameName: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 2,
//   },
//   gameId: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   playingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(79, 172, 254, 0.1)',
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(79, 172, 254, 0.2)',
//   },
//   playingBadgeIcon: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: PRIMARY_COLOR,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playingBadgeText: {
//     fontSize: 10,
//     color: PRIMARY_COLOR,
//     fontWeight: "600",
//   },
//   gameTypeBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     gap: 4,
//     marginLeft: 8,
//     borderWidth: 1,
//   },
//   paidBadge: {
//     backgroundColor: "rgba(255, 152, 0, 0.1)",
//     borderColor: ACCENT_COLOR,
//   },
//   freeBadge: {
//     backgroundColor: "rgba(76, 175, 80, 0.1)",
//     borderColor: "#4CAF50",
//   },
//   gameTypeText: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   gameDetails: {
//     marginBottom: 16,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   detailItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//     flex: 1,
//   },
//   detailIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: BACKGROUND_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   detailLabel: {
//     fontSize: 10,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   detailText: {
//     fontSize: 12,
//     color: TEXT_DARK,
//     fontWeight: "600",
//   },
//   prizeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: BACKGROUND_COLOR,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   prizeIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   prizeInfo: {
//     flex: 1,
//   },
//   prizeLabel: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   prizeText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   joinButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 6,
//     backgroundColor: PRIMARY_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   glassEffectOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.3)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//     borderRadius: 10,
//   },
//   playingJoinButton: {
//     backgroundColor: PRIMARY_COLOR,
//   },
//   completedJoinButtonNew: {
//     backgroundColor: COMPLETED_COLOR,
//   },
//   joinButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   emptyState: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     overflow: 'hidden',
//     marginTop: 20,
//     marginHorizontal: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   emptyIconWrapper: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(79, 172, 254, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(79, 172, 254, 0.2)',
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
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
//   },
//   clearFiltersButton: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   clearFiltersButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   browseGamesButton: {
//     backgroundColor: WHITE,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: PRIMARY_COLOR,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   browseGamesButtonText: {
//     color: PRIMARY_COLOR,
//     fontSize: 14,
//     fontWeight: "700",
//   },
// });





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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get('window');

// NEW Color scheme matching the Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";

// Additional colors for completed games - replaced gray with teal
const COMPLETED_COLOR = "#ff9800"; // Teal color instead of gray
const COMPLETED_LIGHT = "#f5eee2"; // Light teal background

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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAllData();
    startAnimations();
    
    // Start fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const startAnimations = () => {
    // First floating animation
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

    // Second floating animation
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

    // Pulse animation
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

  // Interpolations for animations
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
      console.log("Error fetching data:", error);
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
      console.log("Error fetching games:", error);
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
    } catch (error) {
      console.log("Error fetching tickets:", error);
    }
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
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
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
        game.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.game_code.toLowerCase().includes(searchQuery.toLowerCase())
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
      <View style={styles.playingBadge}>
        <View style={styles.playingBadgeIcon}>
          <Ionicons name="person-circle" size={12} color={WHITE} />
        </View>
        <Text style={styles.playingBadgeText}>
          {ticketInfo.tickets > 0 ? `${ticketInfo.tickets} Ticket${ticketInfo.tickets > 1 ? 's' : ''}` : ''}
          {ticketInfo.tickets > 0 && ticketInfo.pendingRequests > 0 ? ' + ' : ''}
          {ticketInfo.pendingRequests > 0 ? `${ticketInfo.pendingRequests} Request${ticketInfo.pendingRequests > 1 ? 's' : ''}` : ''}
        </Text>
      </View>
    );
  };

  const renderGameCard = ({ item: game }) => {
    const ticketCost = parseFloat(game.ticket_cost || 0);
    const ticketInfo = getUserTicketCount(game.id);
    const isPlaying = isUserPlayingGame(game.id);
    const isCompleted = game.status === 'completed';
    const isLive = game.status === 'live';
    const isScheduled = game.status === 'scheduled';
    
    // Calculate total prize pool from pattern rewards
    const calculatePrizePool = () => {
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
    
    const prizePool = calculatePrizePool();
    
    return (
      <TouchableOpacity
        key={game.id}
        style={[
          styles.gameCard,
          isPlaying && styles.playingGameCard,
          isCompleted && styles.completedGameCard,
        ]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("GameDetails", { game })}
      >
        {/* Background Pattern */}
        <View style={styles.gameCardPattern} />
        
        {/* Status badge on left top corner */}
        <View style={[
          styles.statusBadge,
          isLive ? styles.liveBadge :
          isScheduled ? styles.scheduledBadge :
          isCompleted ? styles.completedBadgeNew :
          styles.defaultBadge
        ]}>
          <Ionicons 
            name={
              isLive ? 'radio-button-on' : 
              isCompleted ? 'trophy' :
              'time'
            } 
            size={10} 
            color={WHITE} 
          />
          <Text style={styles.statusText}>
            {isLive ? 'LIVE' : 
             isCompleted ? 'COMPLETED' : 
             'SOON'}
          </Text>
        </View>

        {/* Playing indicator */}
        {isPlaying && (
          <View style={styles.playingCardOverlay}>
            <View style={styles.playingCardLabel}>
              <Ionicons name="checkmark-circle" size={12} color={WHITE} />
              <Text style={styles.playingCardLabelText}>You're Playing</Text>
            </View>
          </View>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.gameIconContainer}>
            <View style={[
              styles.gameIconWrapper,
              isCompleted && { borderColor: COMPLETED_COLOR }
            ]}>
              <MaterialIcons 
                name={isCompleted ? "trophy" : "confirmation-number"} 
                size={32} 
                color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
              />
            </View>
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
          
          <View style={[
            styles.gameTypeBadge,
            game.ticket_type === "paid" ? styles.paidBadge : styles.freeBadge,
            isCompleted && { borderColor: COMPLETED_COLOR }
          ]}>
            {game.ticket_type === "paid" ? (
              <>
                <MaterialIcons name="diamond" size={14} color={ACCENT_COLOR} />
                <Text style={styles.gameTypeText}>
                  ₹{ticketCost}
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={14} color={ACCENT_COLOR} />
                <Text style={styles.gameTypeText}>
                  FREE
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={[
                styles.detailIcon,
                isCompleted && { borderColor: COMPLETED_COLOR }
              ]}>
                <Ionicons 
                  name="calendar" 
                  size={14} 
                  color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailText}>
                  {game.game_date_formatted || game.game_date}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={[
                styles.detailIcon,
                isCompleted && { borderColor: COMPLETED_COLOR }
              ]}>
                <Ionicons 
                  name="time" 
                  size={14} 
                  color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
                />
              </View>
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
              <View style={[
                styles.detailIcon,
                isCompleted && { borderColor: COMPLETED_COLOR }
              ]}>
                <Ionicons 
                  name="person" 
                  size={14} 
                  color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
                />
              </View>
              <View>
                <Text style={styles.detailLabel}>Host</Text>
                <Text style={styles.detailText}>
                  {game.user ? game.user.name : 'Tambola Timez'}
                </Text>
              </View>
            </View>
            
            {game.available_tickets !== undefined && !isCompleted && (
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
                </View>
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
                <View style={[styles.detailIcon, { borderColor: COMPLETED_COLOR }]}>
                  <Ionicons name="trophy" size={14} color={COMPLETED_COLOR} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailText}>Completed</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={[
          styles.prizeContainer,
          isCompleted && { backgroundColor: COMPLETED_LIGHT }
        ]}>
          <View style={[
            styles.prizeIcon,
            isCompleted && { borderColor: COMPLETED_COLOR }
          ]}>
            <MaterialIcons 
              name={isCompleted ? "emoji-events" : "account-balance-wallet"} 
              size={18} 
              color={isCompleted ? COMPLETED_COLOR : ACCENT_COLOR} 
            />
          </View>
          <View style={styles.prizeInfo}>
            <Text style={styles.prizeLabel}>
              {isCompleted ? 'Total Prize Pool Was' : 'Total Prize Pool'}
            </Text>
            <Text style={styles.prizeText}>
              {prizePool ? `₹${prizePool.toLocaleString()}` : "Exciting Prizes"}
            </Text>
            {/* {game.pattern_rewards && game.pattern_rewards.length > 0 && (
              <Text style={styles.prizeSubtext}>
                {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
              </Text>
            )} */}
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.joinButton,
            isPlaying && styles.playingJoinButton,
            isCompleted && styles.completedJoinButtonNew
          ]}
          onPress={() => navigation.navigate("GameDetails", { game })}
        >
          <View style={styles.glassEffectOverlay} />
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
            color={WHITE} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
          <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        <Text style={styles.loadingMoreText}>Loading more games...</Text>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons 
          name={
            activeTab === 'myGames' ? "game-controller-outline" : 
            activeTab === 'completed' ? "trophy-outline" : 
            "search-outline"
          } 
          size={50} 
          color={PRIMARY_COLOR} 
        />
      </View>
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
          <View style={styles.glassEffectOverlay} />
          <Text style={styles.clearFiltersButtonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
      {activeTab === 'myGames' && !searchQuery && (
        <TouchableOpacity 
          style={styles.browseGamesButton}
          onPress={() => setActiveTab('allGames')}
        >
          <View style={styles.glassEffectOverlay} />
          <Text style={styles.browseGamesButtonText}>Browse All Games</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'myGames' ? 'My Games' : 
           activeTab === 'completed' ? 'Completed Games' : 
           'All Games'}
        </Text>
        <Text style={styles.gameCount}>
          {getFilteredGames().length} Game{getFilteredGames().length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  if (loading && games.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
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
          
          <View style={styles.loadingAnimation}>
            <View style={styles.loadingIconWrapper}>
              <Ionicons name="game-controller" size={40} color={PRIMARY_COLOR} />
            </View>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
          </View>
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
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

        {/* Fixed Header */}
        <Animated.View 
          style={[
            styles.header,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.appName}>Tambola Games</Text>
                <Text style={styles.appTagline}>Play, Compete & Win Big</Text>
              </View>
              {myGamesCount > 0 && (
                <View style={styles.playingCountBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={WHITE} />
                  <Text style={styles.playingCountText}>{myGamesCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Feather name="search" size={20} color={TEXT_LIGHT} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search games by name or ID..."
                placeholderTextColor={TEXT_LIGHT}
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
                  <Ionicons name="close-circle" size={20} color={TEXT_LIGHT} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Fixed Tabs */}
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

        {/* Scrollable content */}
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
              tintColor={PRIMARY_COLOR}
              colors={[PRIMARY_COLOR]}
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
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
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
    color: TEXT_LIGHT,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    position: 'relative',
  },
  loadingAnimation: {
    position: 'relative',
    marginBottom: 20,
  },
  loadingIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  loadingSpinner: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  loadingText: {
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontWeight: "500",
  },
  playingCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  playingCountText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  tabButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_LIGHT,
  },
  tabButtonTextActive: {
    color: WHITE,
  },
  tabCount: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabCountText: {
    color: PRIMARY_COLOR,
    fontSize: 10,
    fontWeight: '700',
  },
  tabCountTextActive: {
    color: WHITE,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  gameCount: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  gameCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  playingGameCard: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
  },
  completedGameCard: {
    borderColor: COMPLETED_COLOR,
    borderWidth: 1,
    backgroundColor: COMPLETED_LIGHT,
  },
  playingCardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  playingCardLabel: {
    backgroundColor: PRIMARY_COLOR,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playingCardLabelText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: "700",
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
  liveBadge: {
    backgroundColor: '#4CAF50',
  },
  scheduledBadge: {
    backgroundColor: ACCENT_COLOR,
  },
  completedBadgeNew: {
    backgroundColor: COMPLETED_COLOR,
  },
  defaultBadge: {
    backgroundColor: ACCENT_COLOR,
  },
  statusText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '700',
  },
  gameCardPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 25,
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
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
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
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
    color: TEXT_DARK,
    marginBottom: 2,
  },
  gameId: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  playingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
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
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playingBadgeText: {
    fontSize: 10,
    color: PRIMARY_COLOR,
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
    borderWidth: 1,
  },
  paidBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderColor: ACCENT_COLOR,
  },
  freeBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: "#4CAF50",
  },
  gameTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: TEXT_DARK,
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
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  detailLabel: {
    fontSize: 10,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: TEXT_DARK,
    fontWeight: "600",
  },
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  prizeInfo: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginBottom: 2,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  joinButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    backgroundColor: PRIMARY_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  glassEffectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  playingJoinButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  completedJoinButtonNew: {
    backgroundColor: COMPLETED_COLOR,
  },
  joinButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  prizeSubtext: {
  fontSize: 11,
  color: TEXT_LIGHT,
  fontWeight: "500",
  marginTop: 2,
},
  emptyState: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
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
  },
  clearFiltersButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  clearFiltersButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  browseGamesButton: {
    backgroundColor: WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    overflow: 'hidden',
    position: 'relative',
  },
  browseGamesButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
});
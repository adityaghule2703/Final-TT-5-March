// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import {
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   View,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   ActivityIndicator,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Dimensions,
// // // // //   RefreshControl,
// // // // //   Image,
// // // // //   Animated,
// // // // // } from "react-native";
// // // // // import axios from "axios";
// // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // // import Feather from "react-native-vector-icons/Feather";
// // // // // import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// // // // // import { useNavigation } from '@react-navigation/native';

// // // // // const { width, height } = Dimensions.get('window');

// // // // // // Color scheme matching Home component
// // // // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // // // const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// // // // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// // // // // const WHITE = "#FFFFFF";

// // // // // const SUCCESS_COLOR = "#27AE60"; // Green
// // // // // const WARNING_COLOR = "#f0ae13"; // Using accent as warning
// // // // // const DANGER_COLOR = "#E74C3C"; // Red
// // // // // const GRAY_COLOR = "#6C757D"; // Gray

// // // // // const UserGameResult = ({ route, navigation }) => {
// // // // //   const { gameId, gameName } = route.params;
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [gameData, setGameData] = useState(null);
// // // // //   const [myTickets, setMyTickets] = useState([]);
// // // // //   const [myWinnings, setMyWinnings] = useState([]);
// // // // //   const [allWinners, setAllWinners] = useState([]);
// // // // //   const [gameStats, setGameStats] = useState(null);
// // // // //   const [calledNumbers, setCalledNumbers] = useState([]);
// // // // //   const [selectedTab, setSelectedTab] = useState("overview");

// // // // //   // Animation values
// // // // //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// // // // //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// // // // //   const pulseAnim = useRef(new Animated.Value(1)).current;
// // // // //   const rotateAnim = useRef(new Animated.Value(0)).current;

// // // // //   // Static gold coins in background
// // // // //   const goldCoins = [
// // // // //     { id: 1, top: '15%', left: '5%', size: 25 },
// // // // //     { id: 2, top: '25%', left: '85%', size: 20 },
// // // // //     { id: 3, top: '40%', left: '15%', size: 22 },
// // // // //     { id: 4, top: '55%', left: '75%', size: 18 },
// // // // //     { id: 5, top: '70%', left: '10%', size: 24 },
// // // // //     { id: 6, top: '80%', left: '80%', size: 19 },
// // // // //     { id: 7, top: '30%', left: '60%', size: 21 },
// // // // //     { id: 8, top: '65%', left: '40%', size: 23 },
// // // // //     { id: 9, top: '45%', left: '90%', size: 17 },
// // // // //     { id: 10, top: '85%', left: '30%', size: 20 },
// // // // //   ];

// // // // //   useEffect(() => {
// // // // //     startAnimations();
// // // // //     fetchGameResults();
// // // // //   }, []);

// // // // //   const startAnimations = () => {
// // // // //     // Float animation 1
// // // // //     Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(floatAnim1, {
// // // // //           toValue: 1,
// // // // //           duration: 4000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(floatAnim1, {
// // // // //           toValue: 0,
// // // // //           duration: 4000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ])
// // // // //     ).start();

// // // // //     // Float animation 2
// // // // //     Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(floatAnim2, {
// // // // //           toValue: 1,
// // // // //           duration: 5000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(floatAnim2, {
// // // // //           toValue: 0,
// // // // //           duration: 5000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ])
// // // // //     ).start();

// // // // //     // Pulse animation
// // // // //     Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(pulseAnim, {
// // // // //           toValue: 1.02,
// // // // //           duration: 3000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //         Animated.timing(pulseAnim, {
// // // // //           toValue: 1,
// // // // //           duration: 3000,
// // // // //           useNativeDriver: true,
// // // // //         }),
// // // // //       ])
// // // // //     ).start();

// // // // //     // Rotate animation
// // // // //     Animated.loop(
// // // // //       Animated.timing(rotateAnim, {
// // // // //         toValue: 1,
// // // // //         duration: 20000,
// // // // //         useNativeDriver: true,
// // // // //       })
// // // // //     ).start();
// // // // //   };

// // // // //   const translateY1 = floatAnim1.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [0, 10]
// // // // //   });

// // // // //   const translateY2 = floatAnim2.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: [0, -8]
// // // // //   });

// // // // //   const rotate = rotateAnim.interpolate({
// // // // //     inputRange: [0, 1],
// // // // //     outputRange: ['0deg', '360deg']
// // // // //   });

// // // // //   const fetchGameResults = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
// // // // //       const response = await axios.get(
// // // // //         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`,
// // // // //             Accept: "application/json",
// // // // //           },
// // // // //         }
// // // // //       );

// // // // //       if (response.data.status) {
// // // // //         const data = response.data.data;
// // // // //         setGameData(data);
        
// // // // //         // Set tickets
// // // // //         if (data.my_tickets_complete_data) {
// // // // //           setMyTickets(data.my_tickets_complete_data);
// // // // //         }
        
// // // // //         // Set my winnings
// // // // //         if (data.my_participation?.winning_patterns) {
// // // // //           setMyWinnings(data.my_participation.winning_patterns);
// // // // //         }
        
// // // // //         // Set all winners
// // // // //         if (data.all_game_winners?.winners_list) {
// // // // //           setAllWinners(data.all_game_winners.winners_list);
// // // // //         }
        
// // // // //         // Set game stats
// // // // //         if (data.game_statistics) {
// // // // //           setGameStats(data.game_statistics);
// // // // //         }
        
// // // // //         // Set called numbers
// // // // //         if (data.number_calling_history?.called_numbers) {
// // // // //           setCalledNumbers(data.number_calling_history.called_numbers);
// // // // //         }
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.log("Error fetching game results:", error);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const onRefresh = React.useCallback(() => {
// // // // //     setRefreshing(true);
// // // // //     fetchGameResults().finally(() => setRefreshing(false));
// // // // //   }, []);

// // // // //   const renderTicketGrid = (ticketData) => {
// // // // //     const TICKET_WIDTH = width - 64;
// // // // //     const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
// // // // //     const processTicketData = (data) => {
// // // // //       if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
// // // // //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// // // // //       data.forEach((row, rowIndex) => {
// // // // //         row.forEach((cell) => {
// // // // //           if (cell && cell.number !== null && cell.column !== undefined) {
// // // // //             processedGrid[rowIndex][cell.column] = cell;
// // // // //           }
// // // // //         });
// // // // //       });
      
// // // // //       return processedGrid;
// // // // //     };

// // // // //     const processedData = processTicketData(ticketData);

// // // // //     return (
// // // // //       <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
// // // // //         {processedData.map((row, rowIndex) => (
// // // // //           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
// // // // //             {row.map((cell, colIndex) => {
// // // // //               const cellObj = cell;
// // // // //               const cellNumber = cellObj?.number;
// // // // //               const isMarked = cellObj?.is_marked || false;
// // // // //               const isEmpty = cellNumber === null || cellNumber === undefined;
              
// // // // //               return (
// // // // //                 <View
// // // // //                   key={`cell-${rowIndex}-${colIndex}`}
// // // // //                   style={[
// // // // //                     styles.ticketCell,
// // // // //                     { 
// // // // //                       width: CELL_SIZE,
// // // // //                       height: CELL_SIZE,
// // // // //                     },
// // // // //                     isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
// // // // //                     isMarked && styles.ticketCellMarked,
// // // // //                   ]}
// // // // //                 >
// // // // //                   {!isEmpty && (
// // // // //                     <Text style={[
// // // // //                       styles.ticketCellNumber,
// // // // //                       isMarked && styles.ticketCellNumberMarked
// // // // //                     ]}>
// // // // //                       {cellNumber}
// // // // //                     </Text>
// // // // //                   )}
// // // // //                 </View>
// // // // //               );
// // // // //             })}
// // // // //           </View>
// // // // //         ))}
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   const renderOverviewTab = () => (
// // // // //     <View style={styles.tabContent}>
// // // // //       {/* Game Stats - 2x2 Grid */}
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="chart-line" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>Game Statistics</Text>
// // // // //           </View>
// // // // //         </View>
        
// // // // //         {gameStats && (
// // // // //           <View style={styles.statsGrid}>
// // // // //             <View style={styles.statRow}>
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="account-group" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Participants</Text>
// // // // //                 </View>
// // // // //               </View>
              
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Tickets Sold</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             <View style={styles.statRow}>
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Winners</Text>
// // // // //                 </View>
// // // // //               </View>
              
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Total Winnings</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>

// // // // //       {/* My Performance - 2x2 Grid */}
// // // // //       {gameData?.my_participation && (
// // // // //         <View style={styles.card}>
// // // // //           <View style={styles.cardHeader}>
// // // // //             <View style={styles.cardTitleContainer}>
// // // // //               <MaterialCommunityIcons name="medal" size={20} color={ACCENT_COLOR} />
// // // // //               <Text style={styles.cardTitle}>My Performance</Text>
// // // // //             </View>
// // // // //           </View>
          
// // // // //           <View style={styles.statsGrid}>
// // // // //             <View style={styles.statRow}>
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>My Tickets</Text>
// // // // //                 </View>
// // // // //               </View>
              
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: '#27AE60' + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="check-circle" size={20} color="#27AE60" />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Approved</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             <View style={styles.statRow}>
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>My Winnings</Text>
// // // // //                 </View>
// // // // //               </View>
              
// // // // //               <View style={styles.statCard}>
// // // // //                 <View style={[styles.statIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.statInfo}>
// // // // //                   <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
// // // // //                   <Text style={styles.statLabel}>Patterns Won</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>
          
// // // // //           {gameData.my_participation.won_this_game && (
// // // // //             <View style={styles.winnerBadge}>
// // // // //               <MaterialCommunityIcons name="trophy" size={16} color={ACCENT_COLOR} />
// // // // //               <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>
// // // // //       )}

// // // // //       {/* Number Calling Summary */}
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="numeric" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>Number Calling Summary</Text>
// // // // //           </View>
// // // // //         </View>
        
// // // // //         <View style={styles.numberSummary}>
// // // // //           <View style={styles.numberSummaryItem}>
// // // // //             <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
// // // // //             <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.numberSummaryDivider} />
          
// // // // //           <View style={styles.numberSummaryItem}>
// // // // //             <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
// // // // //             <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.numberSummaryDivider} />
          
// // // // //           <View style={styles.numberSummaryItem}>
// // // // //             <Text style={styles.numberSummaryValue}>
// // // // //               {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
// // // // //             </Text>
// // // // //             <Text style={styles.numberSummaryLabel}>Last Number</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const renderWinnersTab = () => (
// // // // //     <View style={styles.tabContent}>
// // // // //       {/* Top Winners */}
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="crown" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>Top Winners</Text>
// // // // //           </View>
// // // // //           <Text style={styles.winnerCount}>
// // // // //             {gameData?.all_game_winners?.total_winners || 0} Winners
// // // // //           </Text>
// // // // //         </View>
        
// // // // //         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
// // // // //           <View style={styles.winnersList}>
// // // // //             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
// // // // //               <View key={index} style={[
// // // // //                 styles.winnerItem,
// // // // //                 winner.is_me && styles.myWinnerItem
// // // // //               ]}>
// // // // //                 <View style={[styles.winnerRank, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <Text style={[styles.winnerRankText, { color: ACCENT_COLOR }]}>#{index + 1}</Text>
// // // // //                 </View>
                
// // // // //                 <View style={styles.winnerInfo}>
// // // // //                   <Text style={[
// // // // //                     styles.winnerName,
// // // // //                     winner.is_me && styles.myWinnerName
// // // // //                   ]}>
// // // // //                     {winner.winner_name}
// // // // //                     {winner.is_me && " (You)"}
// // // // //                   </Text>
// // // // //                   <Text style={styles.winnerPattern}>{winner.pattern_name}</Text>
// // // // //                 </View>
                
// // // // //                 <View style={styles.winnerPrize}>
// // // // //                   <Text style={styles.winnerPrizeAmount}>₹{winner.winning_amount}</Text>
// // // // //                   {index === 0 && (
// // // // //                     <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
// // // // //                   )}
// // // // //                 </View>
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         ) : (
// // // // //           <View style={styles.emptyState}>
// // // // //             <MaterialCommunityIcons name="trophy-outline" size={40} color={LIGHT_ACCENT} />
// // // // //             <Text style={styles.emptyStateText}>No winners data available</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>

// // // // //       {/* All Winners List */}
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="format-list-bulleted" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>All Winners</Text>
// // // // //           </View>
// // // // //         </View>
        
// // // // //         {allWinners.length > 0 ? (
// // // // //           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
// // // // //             {allWinners.map((winner, index) => (
// // // // //               <View key={index} style={[
// // // // //                 styles.allWinnerItem,
// // // // //                 winner.is_me && styles.myAllWinnerItem
// // // // //               ]}>
// // // // //                 <View style={styles.allWinnerLeft}>
// // // // //                   <View style={[styles.allWinnerAvatar, { backgroundColor: ACCENT_COLOR }]}>
// // // // //                     <Text style={styles.allWinnerAvatarText}>
// // // // //                       {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
// // // // //                     </Text>
// // // // //                   </View>
// // // // //                   <View style={styles.allWinnerInfo}>
// // // // //                     <Text style={[
// // // // //                       styles.allWinnerName,
// // // // //                       winner.is_me && styles.myAllWinnerName
// // // // //                     ]}>
// // // // //                       {winner.winner_name}
// // // // //                       {winner.is_me && " (You)"}
// // // // //                     </Text>
// // // // //                     <Text style={styles.allWinnerPattern}>{winner.reward_name}</Text>
// // // // //                   </View>
// // // // //                 </View>
                
// // // // //                 <View style={styles.allWinnerRight}>
// // // // //                   <Text style={styles.allWinnerAmount}>₹{winner.winning_amount}</Text>
// // // // //                   <Text style={styles.allWinnerTime}>
// // // // //                     {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             ))}
// // // // //           </ScrollView>
// // // // //         ) : (
// // // // //           <View style={styles.emptyState}>
// // // // //             <MaterialCommunityIcons name="account-group-outline" size={40} color={LIGHT_ACCENT} />
// // // // //             <Text style={styles.emptyStateText}>No winners found</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const renderMyTicketsTab = () => (
// // // // //     <View style={styles.tabContent}>
// // // // //       {/* My Winnings Summary */}
// // // // //       {myWinnings.length > 0 && (
// // // // //         <View style={styles.card}>
// // // // //           <View style={styles.cardHeader}>
// // // // //             <View style={styles.cardTitleContainer}>
// // // // //               <MaterialCommunityIcons name="trophy" size={20} color={ACCENT_COLOR} />
// // // // //               <Text style={styles.cardTitle}>My Winnings</Text>
// // // // //             </View>
// // // // //             <View style={styles.winningsTotal}>
// // // // //               <Text style={styles.winningsTotalText}>
// // // // //                 ₹{gameData?.my_participation?.total_winnings || 0}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
          
// // // // //           <View style={styles.myWinningsList}>
// // // // //             {myWinnings.map((winning, index) => (
// // // // //               <View key={index} style={styles.winningItem}>
// // // // //                 <View style={[styles.winningIcon, { backgroundColor: ACCENT_COLOR + '20' }]}>
// // // // //                   <MaterialCommunityIcons name="trophy" size={18} color={ACCENT_COLOR} />
// // // // //                 </View>
// // // // //                 <View style={styles.winningInfo}>
// // // // //                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
// // // // //                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
// // // // //                   <Text style={styles.winningTime}>
// // // // //                     {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //                 <View style={styles.winningAmountContainer}>
// // // // //                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* My Tickets */}
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="ticket-confirmation" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>My Tickets</Text>
// // // // //           </View>
// // // // //           <Text style={styles.ticketCount}>
// // // // //             {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
// // // // //           </Text>
// // // // //         </View>
        
// // // // //         {myTickets.length > 0 ? (
// // // // //           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
// // // // //             {myTickets.map((ticket, index) => (
// // // // //               <View key={index} style={styles.ticketItem}>
// // // // //                 <View style={styles.ticketHeader}>
// // // // //                   <View style={styles.ticketNumberContainer}>
// // // // //                     <MaterialCommunityIcons name="ticket-confirmation" size={16} color={ACCENT_COLOR} />
// // // // //                     <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
// // // // //                   </View>
// // // // //                   <View style={[
// // // // //                     styles.ticketStatus,
// // // // //                     ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
// // // // //                   ]}>
// // // // //                     <Text style={[
// // // // //                       styles.ticketStatusText,
// // // // //                       ticket.is_completed ? { color: SUCCESS_COLOR } : { color: ACCENT_COLOR }
// // // // //                     ]}>
// // // // //                       {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
// // // // //                     </Text>
// // // // //                   </View>
// // // // //                 </View>
                
// // // // //                 {/* Ticket Grid */}
// // // // //                 {renderTicketGrid(ticket.ticket_data)}
                
// // // // //                 <View style={styles.ticketStats}>
// // // // //                   <View style={styles.ticketStat}>
// // // // //                     <MaterialCommunityIcons name="check-circle" size={12} color={SUCCESS_COLOR} />
// // // // //                     <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.ticketStat}>
// // // // //                     <MaterialCommunityIcons name="close-circle" size={12} color={DANGER_COLOR} />
// // // // //                     <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
// // // // //                   </View>
// // // // //                   {ticket.marked_numbers_count === 15 && (
// // // // //                     <View style={styles.fullHouseBadge}>
// // // // //                       <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
// // // // //                       <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
// // // // //                     </View>
// // // // //                   )}
// // // // //                 </View>
// // // // //               </View>
// // // // //             ))}
// // // // //           </ScrollView>
// // // // //         ) : (
// // // // //           <View style={styles.emptyState}>
// // // // //             <MaterialCommunityIcons name="ticket-outline" size={40} color={LIGHT_ACCENT} />
// // // // //             <Text style={styles.emptyStateText}>No tickets found</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   const renderCalledNumbersTab = () => (
// // // // //     <View style={styles.tabContent}>
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.cardTitleContainer}>
// // // // //             <MaterialCommunityIcons name="grid" size={20} color={ACCENT_COLOR} />
// // // // //             <Text style={styles.cardTitle}>Called Numbers</Text>
// // // // //           </View>
// // // // //           <Text style={styles.calledCount}>
// // // // //             {calledNumbers.length}/90 Numbers
// // // // //           </Text>
// // // // //         </View>
        
// // // // //         {calledNumbers.length > 0 ? (
// // // // //           <View style={styles.numbersGridContainer}>
// // // // //             {Array.from({ length: 9 }, (_, row) => (
// // // // //               <View key={row} style={styles.numberRow}>
// // // // //                 {Array.from({ length: 10 }, (_, col) => {
// // // // //                   const number = row * 10 + col + 1;
// // // // //                   const isCalled = calledNumbers.includes(number);
// // // // //                   const isLatest = calledNumbers.length > 0 && 
// // // // //                     number === calledNumbers[calledNumbers.length - 1];
                  
// // // // //                   return (
// // // // //                     <View
// // // // //                       key={number}
// // // // //                       style={[
// // // // //                         styles.numberCell,
// // // // //                         isCalled && styles.calledNumberCell,
// // // // //                         isLatest && styles.latestNumberCell,
// // // // //                       ]}
// // // // //                     >
// // // // //                       <Text style={[
// // // // //                         styles.numberCellText,
// // // // //                         isCalled && styles.calledNumberText,
// // // // //                         isLatest && styles.latestNumberText,
// // // // //                       ]}>
// // // // //                         {number}
// // // // //                       </Text>
// // // // //                       {isLatest && (
// // // // //                         <View style={styles.latestIndicator}>
// // // // //                           <MaterialCommunityIcons name="star" size={6} color={WHITE} />
// // // // //                         </View>
// // // // //                       )}
// // // // //                     </View>
// // // // //                   );
// // // // //                 })}
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         ) : (
// // // // //           <View style={styles.emptyState}>
// // // // //             <MaterialCommunityIcons name="numeric-off" size={40} color={LIGHT_ACCENT} />
// // // // //             <Text style={styles.emptyStateText}>No numbers called</Text>
// // // // //           </View>
// // // // //         )}
        
// // // // //         <View style={styles.legendContainer}>
// // // // //           <View style={styles.legendItem}>
// // // // //             <View style={[styles.legendColor, styles.legendNormal]} />
// // // // //             <Text style={styles.legendText}>Not Called</Text>
// // // // //           </View>
// // // // //           <View style={styles.legendItem}>
// // // // //             <View style={[styles.legendColor, styles.legendCalled]} />
// // // // //             <Text style={styles.legendText}>Called</Text>
// // // // //           </View>
// // // // //           <View style={styles.legendItem}>
// // // // //             <View style={[styles.legendColor, styles.legendLatest]} />
// // // // //             <Text style={styles.legendText}>Latest</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <View style={styles.loadingContainer}>
// // // // //         <ActivityIndicator size="large" color={ACCENT_COLOR} />
// // // // //         <Text style={styles.loadingText}>Loading Game Results...</Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
// // // // //       {/* Static Gold Coins Background */}
// // // // //       <View style={styles.goldCoinsContainer}>
// // // // //         {goldCoins.map((coin) => (
// // // // //           <View
// // // // //             key={coin.id}
// // // // //             style={[
// // // // //               styles.goldCoin,
// // // // //               {
// // // // //                 top: coin.top,
// // // // //                 left: coin.left,
// // // // //                 width: coin.size,
// // // // //                 height: coin.size,
// // // // //                 borderRadius: coin.size / 2,
// // // // //               }
// // // // //             ]}
// // // // //           >
// // // // //             <View style={styles.coinInner} />
// // // // //             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
// // // // //           </View>
// // // // //         ))}
// // // // //       </View>

// // // // //       {/* Header */}
// // // // //       <Animated.View 
// // // // //         style={[
// // // // //           styles.header,
// // // // //           { 
// // // // //             transform: [{ scale: pulseAnim }],
// // // // //           }
// // // // //         ]}
// // // // //       >
// // // // //         <View style={styles.headerPattern}>
// // // // //           <View style={styles.headerCloud1} />
// // // // //           <View style={styles.headerCloud2} />
// // // // //         </View>
        
// // // // //         <View style={styles.headerContent}>
// // // // //           <View style={styles.headerTop}>
// // // // //             <TouchableOpacity
// // // // //               style={styles.backButton}
// // // // //               onPress={() => navigation.goBack()}
// // // // //             >
// // // // //               <Ionicons name="arrow-back" size={24} color={WHITE} />
// // // // //             </TouchableOpacity>
            
// // // // //             <View style={styles.headerTextContainer}>
// // // // //               <Text style={styles.pageTitle}>Game Results</Text>
// // // // //               <View style={styles.gameInfoContainer}>
// // // // //                 <Ionicons name="game-controller" size={14} color={LIGHT_ACCENT} />
// // // // //                 <Text style={styles.gameName} numberOfLines={1}>
// // // // //                   {gameName || "Tambola Game"}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
            
// // // // //             <TouchableOpacity
// // // // //               style={styles.refreshButton}
// // // // //               onPress={fetchGameResults}
// // // // //             >
// // // // //               <Ionicons name="refresh" size={18} color={WHITE} />
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Animated.View>

// // // // //       <ScrollView
// // // // //         style={styles.container}
// // // // //         refreshControl={
// // // // //           <RefreshControl
// // // // //             refreshing={refreshing}
// // // // //             onRefresh={onRefresh}
// // // // //             tintColor={ACCENT_COLOR}
// // // // //             colors={[ACCENT_COLOR]}
// // // // //           />
// // // // //         }
// // // // //         showsVerticalScrollIndicator={false}
// // // // //       >
// // // // //         <View style={styles.content}>
// // // // //           {/* Game Completion Banner */}
// // // // //           <View style={styles.completionBanner}>
// // // // //             <View style={styles.completionBannerContent}>
// // // // //               <MaterialCommunityIcons name="party-popper" size={32} color={ACCENT_COLOR} />
// // // // //               <View style={styles.completionTextContainer}>
// // // // //                 <Text style={styles.completionTitle}>Game Completed!</Text>
// // // // //                 <Text style={styles.completionSubtitle}>
// // // // //                   All {calledNumbers.length} numbers have been called
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* Tabs */}
// // // // //           <View style={styles.tabsContainer}>
// // // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
// // // // //               <TouchableOpacity
// // // // //                 style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
// // // // //                 onPress={() => setSelectedTab("overview")}
// // // // //               >
// // // // //                 <Ionicons 
// // // // //                   name="stats-chart" 
// // // // //                   size={14} 
// // // // //                   color={selectedTab === "overview" ? WHITE : ACCENT_COLOR} 
// // // // //                 />
// // // // //                 <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
// // // // //                   Overview
// // // // //                 </Text>
// // // // //               </TouchableOpacity>
              
// // // // //               <TouchableOpacity
// // // // //                 style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
// // // // //                 onPress={() => setSelectedTab("winners")}
// // // // //               >
// // // // //                 <Ionicons 
// // // // //                   name="trophy" 
// // // // //                   size={14} 
// // // // //                   color={selectedTab === "winners" ? WHITE : ACCENT_COLOR} 
// // // // //                 />
// // // // //                 <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
// // // // //                   Winners
// // // // //                 </Text>
// // // // //               </TouchableOpacity>
              
// // // // //               <TouchableOpacity
// // // // //                 style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
// // // // //                 onPress={() => setSelectedTab("mytickets")}
// // // // //               >
// // // // //                 <Ionicons 
// // // // //                   name="ticket" 
// // // // //                   size={14} 
// // // // //                   color={selectedTab === "mytickets" ? WHITE : ACCENT_COLOR} 
// // // // //                 />
// // // // //                 <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
// // // // //                   My Tickets
// // // // //                 </Text>
// // // // //               </TouchableOpacity>
              
// // // // //               <TouchableOpacity
// // // // //                 style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
// // // // //                 onPress={() => setSelectedTab("numbers")}
// // // // //               >
// // // // //                 <Ionicons 
// // // // //                   name="grid" 
// // // // //                   size={14} 
// // // // //                   color={selectedTab === "numbers" ? WHITE : ACCENT_COLOR} 
// // // // //                 />
// // // // //                 <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
// // // // //                   Numbers
// // // // //                 </Text>
// // // // //               </TouchableOpacity>
// // // // //             </ScrollView>
// // // // //           </View>

// // // // //           {/* Tab Content */}
// // // // //           {selectedTab === "overview" && renderOverviewTab()}
// // // // //           {selectedTab === "winners" && renderWinnersTab()}
// // // // //           {selectedTab === "mytickets" && renderMyTicketsTab()}
// // // // //           {selectedTab === "numbers" && renderCalledNumbersTab()}

// // // // //           <View style={styles.bottomSpace} />
// // // // //         </View>
// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: PRIMARY_COLOR,
// // // // //   },
// // // // //   container: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   // Gold Coins Background
// // // // //   goldCoinsContainer: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     zIndex: 0,
// // // // //   },
// // // // //   goldCoin: {
// // // // //     position: 'absolute',
// // // // //     backgroundColor: ACCENT_COLOR,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     borderWidth: 1,
// // // // //     borderColor: LIGHT_ACCENT,
// // // // //     shadowColor: ACCENT_COLOR,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.4,
// // // // //     shadowRadius: 3,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   coinInner: {
// // // // //     position: 'absolute',
// // // // //     width: '70%',
// // // // //     height: '70%',
// // // // //     borderRadius: 50,
// // // // //     backgroundColor: 'rgba(255, 213, 79, 0.3)',
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'rgba(184, 134, 11, 0.3)',
// // // // //   },
// // // // //   coinSymbol: {
// // // // //     color: SECONDARY_COLOR,
// // // // //     fontWeight: 'bold',
// // // // //     textShadowColor: 'rgba(255, 255, 255, 0.3)',
// // // // //     textShadowOffset: { width: 0, height: 1 },
// // // // //     textShadowRadius: 1,
// // // // //   },
// // // // //   // Header
// // // // //   header: {
// // // // //     backgroundColor: PRIMARY_COLOR,
// // // // //     paddingTop: 15,
// // // // //     paddingBottom: 15,
// // // // //     borderBottomLeftRadius: 20,
// // // // //     borderBottomRightRadius: 20,
// // // // //     position: 'relative',
// // // // //     overflow: 'hidden',
// // // // //     zIndex: 1,
// // // // //   },
// // // // //   headerPattern: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //   },
// // // // //   headerCloud1: {
// // // // //     position: 'absolute',
// // // // //     top: 15,
// // // // //     left: 20,
// // // // //     width: 45,
// // // // //     height: 15,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // // // //   },
// // // // //   headerCloud2: {
// // // // //     position: 'absolute',
// // // // //     top: 35,
// // // // //     right: 30,
// // // // //     width: 30,
// // // // //     height: 12,
// // // // //     borderRadius: 15,
// // // // //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// // // // //   },
// // // // //   headerContent: {
// // // // //     paddingHorizontal: 16,
// // // // //   },
// // // // //   headerTop: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   backButton: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 10,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "rgba(255, 255, 255, 0.3)",
// // // // //   },
// // // // //   headerTextContainer: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   pageTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: "700",
// // // // //     color: WHITE,
// // // // //     letterSpacing: -0.3,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   gameInfoContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 5,
// // // // //   },
// // // // //   gameName: {
// // // // //     fontSize: 12,
// // // // //     color: LIGHT_ACCENT,
// // // // //     fontWeight: "500",
// // // // //     flex: 1,
// // // // //   },
// // // // //   refreshButton: {
// // // // //     width: 34,
// // // // //     height: 34,
// // // // //     borderRadius: 17,
// // // // //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginLeft: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "rgba(255, 255, 255, 0.3)",
// // // // //   },
// // // // //   content: {
// // // // //     padding: 16,
// // // // //   },
// // // // //   // Completion Banner
// // // // //   completionBanner: {
// // // // //     backgroundColor: DARK_BLUE,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 16,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 4,
// // // // //   },
// // // // //   completionBannerContent: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 12,
// // // // //   },
// // // // //   completionTextContainer: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   completionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '800',
// // // // //     color: TEXT_LIGHT,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   completionSubtitle: {
// // // // //     fontSize: 12,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   // Tabs
// // // // //   tabsContainer: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   tabsScroll: {
// // // // //     flexGrow: 0,
// // // // //   },
// // // // //   tab: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: DARK_BLUE,
// // // // //     marginRight: 8,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //     gap: 6,
// // // // //   },
// // // // //   activeTab: {
// // // // //     backgroundColor: ACCENT_COLOR,
// // // // //     borderColor: ACCENT_COLOR,
// // // // //   },
// // // // //   tabText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   activeTabText: {
// // // // //     color: SECONDARY_COLOR,
// // // // //   },
// // // // //   // Cards
// // // // //   card: {
// // // // //     backgroundColor: DARK_BLUE,
// // // // //     borderRadius: 16,
// // // // //     padding: 16,
// // // // //     marginBottom: 16,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 4,
// // // // //   },
// // // // //   cardHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   cardTitleContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 8,
// // // // //   },
// // // // //   cardTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   tabContent: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   // Stats Grid
// // // // //   statsGrid: {
// // // // //     gap: 12,
// // // // //   },
// // // // //   statRow: {
// // // // //     flexDirection: 'row',
// // // // //     gap: 12,
// // // // //   },
// // // // //   statCard: {
// // // // //     flex: 1,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //     padding: 12,
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //     gap: 12,
// // // // //   },
// // // // //   statIcon: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   statInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   statValue: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '800',
// // // // //     color: TEXT_LIGHT,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   statLabel: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   // Number Summary
// // // // //   numberSummary: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   numberSummaryItem: {
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   numberSummaryValue: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '800',
// // // // //     color: ACCENT_COLOR,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   numberSummaryLabel: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //     fontWeight: '500',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   numberSummaryDivider: {
// // // // //     width: 1,
// // // // //     height: 30,
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   // Winner Badge
// // // // //   winnerBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     padding: 12,
// // // // //     borderRadius: 10,
// // // // //     marginTop: 16,
// // // // //     borderWidth: 2,
// // // // //     borderColor: ACCENT_COLOR,
// // // // //     gap: 8,
// // // // //   },
// // // // //   winnerBadgeText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '700',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   // Winners List
// // // // //   winnerCount: {
// // // // //     fontSize: 13,
// // // // //     color: ACCENT_COLOR,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   winnersList: {
// // // // //     gap: 10,
// // // // //   },
// // // // //   winnerItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //     padding: 12,
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   myWinnerItem: {
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     borderColor: ACCENT_COLOR,
// // // // //   },
// // // // //   winnerRank: {
// // // // //     width: 32,
// // // // //     height: 32,
// // // // //     borderRadius: 16,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   winnerRankText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   winnerInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   winnerName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   myWinnerName: {
// // // // //     color: ACCENT_COLOR,
// // // // //   },
// // // // //   winnerPattern: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   winnerPrize: {
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   winnerPrizeAmount: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '700',
// // // // //     color: ACCENT_COLOR,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   // All Winners List
// // // // //   allWinnersList: {
// // // // //     maxHeight: 300,
// // // // //   },
// // // // //   allWinnerItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 12,
// // // // //     paddingHorizontal: 8,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   myAllWinnerItem: {
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     marginHorizontal: -8,
// // // // //     paddingHorizontal: 8,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   allWinnerLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   allWinnerAvatar: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   allWinnerAvatarText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '700',
// // // // //     color: SECONDARY_COLOR,
// // // // //   },
// // // // //   allWinnerInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   allWinnerName: {
// // // // //     fontSize: 13,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   myAllWinnerName: {
// // // // //     color: ACCENT_COLOR,
// // // // //   },
// // // // //   allWinnerPattern: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   allWinnerRight: {
// // // // //     alignItems: 'flex-end',
// // // // //   },
// // // // //   allWinnerAmount: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '700',
// // // // //     color: ACCENT_COLOR,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   allWinnerTime: {
// // // // //     fontSize: 10,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   // My Winnings
// // // // //   winningsTotal: {
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   winningsTotalText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '700',
// // // // //     color: ACCENT_COLOR,
// // // // //   },
// // // // //   myWinningsList: {
// // // // //     gap: 10,
// // // // //   },
// // // // //   winningItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //     padding: 12,
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   winningIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   winningInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   winningPattern: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   winningTicket: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   winningTime: {
// // // // //     fontSize: 10,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   winningAmountContainer: {
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   winningAmount: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '800',
// // // // //     color: ACCENT_COLOR,
// // // // //   },
// // // // //   // My Tickets
// // // // //   ticketCount: {
// // // // //     fontSize: 13,
// // // // //     color: ACCENT_COLOR,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   myTicketsList: {
// // // // //     maxHeight: 500,
// // // // //   },
// // // // //   ticketItem: {
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //     padding: 12,
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   ticketHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   ticketNumberContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //   },
// // // // //   ticketNumber: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   ticketStatus: {
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 10,
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.8)',
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.3)',
// // // // //   },
// // // // //   ticketCompleted: {
// // // // //     backgroundColor: 'rgba(39, 174, 96, 0.15)',
// // // // //     borderColor: SUCCESS_COLOR,
// // // // //   },
// // // // //   ticketIncomplete: {
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     borderColor: ACCENT_COLOR,
// // // // //   },
// // // // //   ticketStatusText: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   // Ticket Grid
// // // // //   ticketGridContainer: {
// // // // //     marginBottom: 10,
// // // // //   },
// // // // //   ticketRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   ticketCell: {
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     borderRadius: 6,
// // // // //     marginHorizontal: 2,
// // // // //     borderWidth: 1,
// // // // //   },
// // // // //   ticketCellEmpty: {
// // // // //     backgroundColor: 'rgba(255, 255, 255, 0.05)',
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   ticketCellFilled: {
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     borderColor: ACCENT_COLOR,
// // // // //   },
// // // // //   ticketCellMarked: {
// // // // //     backgroundColor: DANGER_COLOR,
// // // // //     borderColor: '#C0392B',
// // // // //   },
// // // // //   ticketCellNumber: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   ticketCellNumberMarked: {
// // // // //     color: WHITE,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   ticketStats: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   ticketStat: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //   },
// // // // //   ticketStatText: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   fullHouseBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     backgroundColor: 'rgba(240, 174, 19, 0.15)',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 10,
// // // // //     borderWidth: 1,
// // // // //     borderColor: ACCENT_COLOR,
// // // // //     gap: 4,
// // // // //   },
// // // // //   fullHouseBadgeText: {
// // // // //     fontSize: 10,
// // // // //     fontWeight: '700',
// // // // //     color: TEXT_LIGHT,
// // // // //   },
// // // // //   // Called Numbers
// // // // //   calledCount: {
// // // // //     fontSize: 13,
// // // // //     color: ACCENT_COLOR,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   numbersGridContainer: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   numberRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   numberCell: {
// // // // //     width: 28,
// // // // //     height: 28,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     borderRadius: 6,
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //     marginHorizontal: 1,
// // // // //     position: 'relative',
// // // // //   },
// // // // //   calledNumberCell: {
// // // // //     backgroundColor: SUCCESS_COLOR,
// // // // //     borderColor: SUCCESS_COLOR,
// // // // //   },
// // // // //   latestNumberCell: {
// // // // //     backgroundColor: ACCENT_COLOR,
// // // // //     borderColor: ACCENT_COLOR,
// // // // //   },
// // // // //   numberCellText: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: '600',
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   calledNumberText: {
// // // // //     color: WHITE,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   latestNumberText: {
// // // // //     color: SECONDARY_COLOR,
// // // // //     fontWeight: '800',
// // // // //   },
// // // // //   latestIndicator: {
// // // // //     position: 'absolute',
// // // // //     top: -2,
// // // // //     right: -2,
// // // // //     backgroundColor: WHITE,
// // // // //     borderRadius: 4,
// // // // //     padding: 1,
// // // // //   },
// // // // //   legendContainer: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     gap: 16,
// // // // //     paddingTop: 12,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   legendItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 6,
// // // // //   },
// // // // //   legendColor: {
// // // // //     width: 12,
// // // // //     height: 12,
// // // // //     borderRadius: 3,
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'rgba(240, 174, 19, 0.2)',
// // // // //   },
// // // // //   legendNormal: {
// // // // //     backgroundColor: 'rgba(1, 69, 96, 0.5)',
// // // // //   },
// // // // //   legendCalled: {
// // // // //     backgroundColor: SUCCESS_COLOR,
// // // // //   },
// // // // //   legendLatest: {
// // // // //     backgroundColor: ACCENT_COLOR,
// // // // //   },
// // // // //   legendText: {
// // // // //     fontSize: 11,
// // // // //     color: LIGHT_ACCENT,
// // // // //   },
// // // // //   // Empty State
// // // // //   emptyState: {
// // // // //     alignItems: 'center',
// // // // //     padding: 24,
// // // // //   },
// // // // //   emptyStateText: {
// // // // //     fontSize: 14,
// // // // //     color: LIGHT_ACCENT,
// // // // //     marginTop: 8,
// // // // //     textAlign: 'center',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   // Loading
// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: PRIMARY_COLOR,
// // // // //   },
// // // // //   loadingText: {
// // // // //     fontSize: 16,
// // // // //     color: ACCENT_COLOR,
// // // // //     marginTop: 12,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   bottomSpace: {
// // // // //     height: 20,
// // // // //   },
// // // // // });

// // // // // export default UserGameResult;



// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import {
// // // //   StyleSheet,
// // // //   Text,
// // // //   View,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   ActivityIndicator,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Dimensions,
// // // //   RefreshControl,
// // // //   Image,
// // // //   Animated,
// // // // } from "react-native";
// // // // import axios from "axios";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // // import Feather from "react-native-vector-icons/Feather";
// // // // import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// // // // import { useNavigation } from '@react-navigation/native';

// // // // const { width, height } = Dimensions.get('window');

// // // // // Updated color scheme matching Home component
// // // // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // // // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // // // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // // // const WHITE = "#FFFFFF";
// // // // const TEXT_DARK = "#333333";
// // // // const TEXT_LIGHT = "#777777";
// // // // const BORDER_COLOR = "#EEEEEE";
// // // // const CARD_BACKGROUND = "#FFFFFF";
// // // // const SUCCESS_COLOR = "#4CAF50"; // Green for success states
// // // // const ERROR_COLOR = "#E74C3C"; // Red for errors
// // // // const WARNING_COLOR = "#ff9800"; // Orange accent for warnings

// // // // const UserGameResult = ({ route, navigation }) => {
// // // //   const { gameId, gameName } = route.params;
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [gameData, setGameData] = useState(null);
// // // //   const [myTickets, setMyTickets] = useState([]);
// // // //   const [myWinnings, setMyWinnings] = useState([]);
// // // //   const [allWinners, setAllWinners] = useState([]);
// // // //   const [gameStats, setGameStats] = useState(null);
// // // //   const [calledNumbers, setCalledNumbers] = useState([]);
// // // //   const [selectedTab, setSelectedTab] = useState("overview");

// // // //   // Animation values
// // // //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// // // //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// // // //   const pulseAnim = useRef(new Animated.Value(1)).current;
// // // //   const rotateAnim = useRef(new Animated.Value(0)).current;

// // // //   // Static coins in background
// // // //   const goldCoins = [
// // // //     { id: 1, top: '15%', left: '5%', size: 25 },
// // // //     { id: 2, top: '25%', left: '85%', size: 20 },
// // // //     { id: 3, top: '40%', left: '15%', size: 22 },
// // // //     { id: 4, top: '55%', left: '75%', size: 18 },
// // // //     { id: 5, top: '70%', left: '10%', size: 24 },
// // // //     { id: 6, top: '80%', left: '80%', size: 19 },
// // // //     { id: 7, top: '30%', left: '60%', size: 21 },
// // // //     { id: 8, top: '65%', left: '40%', size: 23 },
// // // //     { id: 9, top: '45%', left: '90%', size: 17 },
// // // //     { id: 10, top: '85%', left: '30%', size: 20 },
// // // //   ];

// // // //   useEffect(() => {
// // // //     startAnimations();
// // // //     fetchGameResults();
// // // //   }, []);

// // // //   const startAnimations = () => {
// // // //     // Float animation 1
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(floatAnim1, {
// // // //           toValue: 1,
// // // //           duration: 4000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(floatAnim1, {
// // // //           toValue: 0,
// // // //           duration: 4000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ])
// // // //     ).start();

// // // //     // Float animation 2
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(floatAnim2, {
// // // //           toValue: 1,
// // // //           duration: 5000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(floatAnim2, {
// // // //           toValue: 0,
// // // //           duration: 5000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ])
// // // //     ).start();

// // // //     // Pulse animation
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(pulseAnim, {
// // // //           toValue: 1.02,
// // // //           duration: 3000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //         Animated.timing(pulseAnim, {
// // // //           toValue: 1,
// // // //           duration: 3000,
// // // //           useNativeDriver: true,
// // // //         }),
// // // //       ])
// // // //     ).start();

// // // //     // Rotate animation
// // // //     Animated.loop(
// // // //       Animated.timing(rotateAnim, {
// // // //         toValue: 1,
// // // //         duration: 20000,
// // // //         useNativeDriver: true,
// // // //       })
// // // //     ).start();
// // // //   };

// // // //   const translateY1 = floatAnim1.interpolate({
// // // //     inputRange: [0, 1],
// // // //     outputRange: [0, 10]
// // // //   });

// // // //   const translateY2 = floatAnim2.interpolate({
// // // //     inputRange: [0, 1],
// // // //     outputRange: [0, -8]
// // // //   });

// // // //   const rotate = rotateAnim.interpolate({
// // // //     inputRange: [0, 1],
// // // //     outputRange: ['0deg', '360deg']
// // // //   });

// // // //   const fetchGameResults = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
// // // //       const response = await axios.get(
// // // //         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
// // // //         {
// // // //           headers: {
// // // //             Authorization: `Bearer ${token}`,
// // // //             Accept: "application/json",
// // // //           },
// // // //         }
// // // //       );

// // // //       if (response.data.status) {
// // // //         const data = response.data.data;
// // // //         setGameData(data);
        
// // // //         // Set tickets
// // // //         if (data.my_tickets_complete_data) {
// // // //           setMyTickets(data.my_tickets_complete_data);
// // // //         }
        
// // // //         // Set my winnings
// // // //         if (data.my_participation?.winning_patterns) {
// // // //           setMyWinnings(data.my_participation.winning_patterns);
// // // //         }
        
// // // //         // Set all winners
// // // //         if (data.all_game_winners?.winners_list) {
// // // //           setAllWinners(data.all_game_winners.winners_list);
// // // //         }
        
// // // //         // Set game stats
// // // //         if (data.game_statistics) {
// // // //           setGameStats(data.game_statistics);
// // // //         }
        
// // // //         // Set called numbers
// // // //         if (data.number_calling_history?.called_numbers) {
// // // //           setCalledNumbers(data.number_calling_history.called_numbers);
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching game results:", error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const onRefresh = React.useCallback(() => {
// // // //     setRefreshing(true);
// // // //     fetchGameResults().finally(() => setRefreshing(false));
// // // //   }, []);

// // // //   const renderTicketGrid = (ticketData) => {
// // // //     const TICKET_WIDTH = width - 64;
// // // //     const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
// // // //     const processTicketData = (data) => {
// // // //       if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
// // // //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// // // //       data.forEach((row, rowIndex) => {
// // // //         row.forEach((cell) => {
// // // //           if (cell && cell.number !== null && cell.column !== undefined) {
// // // //             processedGrid[rowIndex][cell.column] = cell;
// // // //           }
// // // //         });
// // // //       });
      
// // // //       return processedGrid;
// // // //     };

// // // //     const processedData = processTicketData(ticketData);

// // // //     return (
// // // //       <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
// // // //         {processedData.map((row, rowIndex) => (
// // // //           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
// // // //             {row.map((cell, colIndex) => {
// // // //               const cellObj = cell;
// // // //               const cellNumber = cellObj?.number;
// // // //               const isMarked = cellObj?.is_marked || false;
// // // //               const isEmpty = cellNumber === null || cellNumber === undefined;
              
// // // //               return (
// // // //                 <View
// // // //                   key={`cell-${rowIndex}-${colIndex}`}
// // // //                   style={[
// // // //                     styles.ticketCell,
// // // //                     { 
// // // //                       width: CELL_SIZE,
// // // //                       height: CELL_SIZE,
// // // //                     },
// // // //                     isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
// // // //                     isMarked && styles.ticketCellMarked,
// // // //                   ]}
// // // //                 >
// // // //                   {!isEmpty && (
// // // //                     <Text style={[
// // // //                       styles.ticketCellNumber,
// // // //                       isMarked && styles.ticketCellNumberMarked
// // // //                     ]}>
// // // //                       {cellNumber}
// // // //                     </Text>
// // // //                   )}
// // // //                 </View>
// // // //               );
// // // //             })}
// // // //           </View>
// // // //         ))}
// // // //       </View>
// // // //     );
// // // //   };

// // // //   const renderOverviewTab = () => (
// // // //     <View style={styles.tabContent}>
// // // //       {/* Game Stats - 2x2 Grid */}
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="chart-line" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>Game Statistics</Text>
// // // //           </View>
// // // //         </View>
        
// // // //         {gameStats && (
// // // //           <View style={styles.statsGrid}>
// // // //             <View style={styles.statRow}>
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="account-group" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Participants</Text>
// // // //                 </View>
// // // //               </View>
              
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Tickets Sold</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
            
// // // //             <View style={styles.statRow}>
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Winners</Text>
// // // //                 </View>
// // // //               </View>
              
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Total Winnings</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>
// // // //         )}
// // // //       </View>

// // // //       {/* My Performance - 2x2 Grid */}
// // // //       {gameData?.my_participation && (
// // // //         <View style={styles.card}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <MaterialCommunityIcons name="medal" size={20} color={PRIMARY_COLOR} />
// // // //               <Text style={styles.cardTitle}>My Performance</Text>
// // // //             </View>
// // // //           </View>
          
// // // //           <View style={styles.statsGrid}>
// // // //             <View style={styles.statRow}>
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
// // // //                   <Text style={styles.statLabel}>My Tickets</Text>
// // // //                 </View>
// // // //               </View>
              
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="check-circle" size={20} color={SUCCESS_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Approved</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
            
// // // //             <View style={styles.statRow}>
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
// // // //                   <Text style={styles.statLabel}>My Winnings</Text>
// // // //                 </View>
// // // //               </View>
              
// // // //               <View style={styles.statCard}>
// // // //                 <View style={[styles.statIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.statInfo}>
// // // //                   <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
// // // //                   <Text style={styles.statLabel}>Patterns Won</Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>
          
// // // //           {gameData.my_participation.won_this_game && (
// // // //             <View style={styles.winnerBadge}>
// // // //               <MaterialCommunityIcons name="trophy" size={16} color={ACCENT_COLOR} />
// // // //               <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       )}

// // // //       {/* Number Calling Summary */}
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="numeric" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>Number Calling Summary</Text>
// // // //           </View>
// // // //         </View>
        
// // // //         <View style={styles.numberSummary}>
// // // //           <View style={styles.numberSummaryItem}>
// // // //             <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
// // // //             <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
// // // //           </View>
          
// // // //           <View style={styles.numberSummaryDivider} />
          
// // // //           <View style={styles.numberSummaryItem}>
// // // //             <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
// // // //             <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
// // // //           </View>
          
// // // //           <View style={styles.numberSummaryDivider} />
          
// // // //           <View style={styles.numberSummaryItem}>
// // // //             <Text style={styles.numberSummaryValue}>
// // // //               {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
// // // //             </Text>
// // // //             <Text style={styles.numberSummaryLabel}>Last Number</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const renderWinnersTab = () => (
// // // //     <View style={styles.tabContent}>
// // // //       {/* Top Winners */}
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="crown" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>Top Winners</Text>
// // // //           </View>
// // // //           <Text style={styles.winnerCount}>
// // // //             {gameData?.all_game_winners?.total_winners || 0} Winners
// // // //           </Text>
// // // //         </View>
        
// // // //         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
// // // //           <View style={styles.winnersList}>
// // // //             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
// // // //               <View key={index} style={[
// // // //                 styles.winnerItem,
// // // //                 winner.is_me && styles.myWinnerItem
// // // //               ]}>
// // // //                 <View style={[styles.winnerRank, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <Text style={[styles.winnerRankText, { color: PRIMARY_COLOR }]}>#{index + 1}</Text>
// // // //                 </View>
                
// // // //                 <View style={styles.winnerInfo}>
// // // //                   <Text style={[
// // // //                     styles.winnerName,
// // // //                     winner.is_me && styles.myWinnerName
// // // //                   ]}>
// // // //                     {winner.winner_name}
// // // //                     {winner.is_me && " (You)"}
// // // //                   </Text>
// // // //                   <Text style={styles.winnerPattern}>{winner.pattern_name}</Text>
// // // //                 </View>
                
// // // //                 <View style={styles.winnerPrize}>
// // // //                   <Text style={styles.winnerPrizeAmount}>₹{winner.winning_amount}</Text>
// // // //                   {index === 0 && (
// // // //                     <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
// // // //                   )}
// // // //                 </View>
// // // //               </View>
// // // //             ))}
// // // //           </View>
// // // //         ) : (
// // // //           <View style={styles.emptyState}>
// // // //             <MaterialCommunityIcons name="trophy-outline" size={40} color={TEXT_LIGHT} />
// // // //             <Text style={styles.emptyStateText}>No winners data available</Text>
// // // //           </View>
// // // //         )}
// // // //       </View>

// // // //       {/* All Winners List */}
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="format-list-bulleted" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>All Winners</Text>
// // // //           </View>
// // // //         </View>
        
// // // //         {allWinners.length > 0 ? (
// // // //           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
// // // //             {allWinners.map((winner, index) => (
// // // //               <View key={index} style={[
// // // //                 styles.allWinnerItem,
// // // //                 winner.is_me && styles.myAllWinnerItem
// // // //               ]}>
// // // //                 <View style={styles.allWinnerLeft}>
// // // //                   <View style={[styles.allWinnerAvatar, { backgroundColor: PRIMARY_COLOR }]}>
// // // //                     <Text style={styles.allWinnerAvatarText}>
// // // //                       {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
// // // //                     </Text>
// // // //                   </View>
// // // //                   <View style={styles.allWinnerInfo}>
// // // //                     <Text style={[
// // // //                       styles.allWinnerName,
// // // //                       winner.is_me && styles.myAllWinnerName
// // // //                     ]}>
// // // //                       {winner.winner_name}
// // // //                       {winner.is_me && " (You)"}
// // // //                     </Text>
// // // //                     <Text style={styles.allWinnerPattern}>{winner.reward_name}</Text>
// // // //                   </View>
// // // //                 </View>
                
// // // //                 <View style={styles.allWinnerRight}>
// // // //                   <Text style={styles.allWinnerAmount}>₹{winner.winning_amount}</Text>
// // // //                   <Text style={styles.allWinnerTime}>
// // // //                     {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // // //                   </Text>
// // // //                 </View>
// // // //               </View>
// // // //             ))}
// // // //           </ScrollView>
// // // //         ) : (
// // // //           <View style={styles.emptyState}>
// // // //             <MaterialCommunityIcons name="account-group-outline" size={40} color={TEXT_LIGHT} />
// // // //             <Text style={styles.emptyStateText}>No winners found</Text>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const renderMyTicketsTab = () => (
// // // //     <View style={styles.tabContent}>
// // // //       {/* My Winnings Summary */}
// // // //       {myWinnings.length > 0 && (
// // // //         <View style={styles.card}>
// // // //           <View style={styles.cardHeader}>
// // // //             <View style={styles.cardTitleContainer}>
// // // //               <MaterialCommunityIcons name="trophy" size={20} color={PRIMARY_COLOR} />
// // // //               <Text style={styles.cardTitle}>My Winnings</Text>
// // // //             </View>
// // // //             <View style={styles.winningsTotal}>
// // // //               <Text style={styles.winningsTotalText}>
// // // //                 ₹{gameData?.my_participation?.total_winnings || 0}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
          
// // // //           <View style={styles.myWinningsList}>
// // // //             {myWinnings.map((winning, index) => (
// // // //               <View key={index} style={styles.winningItem}>
// // // //                 <View style={[styles.winningIcon, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
// // // //                   <MaterialCommunityIcons name="trophy" size={18} color={PRIMARY_COLOR} />
// // // //                 </View>
// // // //                 <View style={styles.winningInfo}>
// // // //                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
// // // //                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
// // // //                   <Text style={styles.winningTime}>
// // // //                     {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // // //                   </Text>
// // // //                 </View>
// // // //                 <View style={styles.winningAmountContainer}>
// // // //                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
// // // //                 </View>
// // // //               </View>
// // // //             ))}
// // // //           </View>
// // // //         </View>
// // // //       )}

// // // //       {/* My Tickets */}
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="ticket-confirmation" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>My Tickets</Text>
// // // //           </View>
// // // //           <Text style={styles.ticketCount}>
// // // //             {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
// // // //           </Text>
// // // //         </View>
        
// // // //         {myTickets.length > 0 ? (
// // // //           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
// // // //             {myTickets.map((ticket, index) => (
// // // //               <View key={index} style={styles.ticketItem}>
// // // //                 <View style={styles.ticketHeader}>
// // // //                   <View style={styles.ticketNumberContainer}>
// // // //                     <MaterialCommunityIcons name="ticket-confirmation" size={16} color={PRIMARY_COLOR} />
// // // //                     <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
// // // //                   </View>
// // // //                   <View style={[
// // // //                     styles.ticketStatus,
// // // //                     ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
// // // //                   ]}>
// // // //                     <Text style={[
// // // //                       styles.ticketStatusText,
// // // //                       ticket.is_completed ? { color: SUCCESS_COLOR } : { color: PRIMARY_COLOR }
// // // //                     ]}>
// // // //                       {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
// // // //                     </Text>
// // // //                   </View>
// // // //                 </View>
                
// // // //                 {/* Ticket Grid */}
// // // //                 {renderTicketGrid(ticket.ticket_data)}
                
// // // //                 <View style={styles.ticketStats}>
// // // //                   <View style={styles.ticketStat}>
// // // //                     <MaterialCommunityIcons name="check-circle" size={12} color={SUCCESS_COLOR} />
// // // //                     <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
// // // //                   </View>
// // // //                   <View style={styles.ticketStat}>
// // // //                     <MaterialCommunityIcons name="close-circle" size={12} color={ERROR_COLOR} />
// // // //                     <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
// // // //                   </View>
// // // //                   {ticket.marked_numbers_count === 15 && (
// // // //                     <View style={styles.fullHouseBadge}>
// // // //                       <MaterialCommunityIcons name="trophy" size={12} color={ACCENT_COLOR} />
// // // //                       <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
// // // //                     </View>
// // // //                   )}
// // // //                 </View>
// // // //               </View>
// // // //             ))}
// // // //           </ScrollView>
// // // //         ) : (
// // // //           <View style={styles.emptyState}>
// // // //             <MaterialCommunityIcons name="ticket-outline" size={40} color={TEXT_LIGHT} />
// // // //             <Text style={styles.emptyStateText}>No tickets found</Text>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const renderCalledNumbersTab = () => (
// // // //     <View style={styles.tabContent}>
// // // //       <View style={styles.card}>
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.cardTitleContainer}>
// // // //             <MaterialCommunityIcons name="grid" size={20} color={PRIMARY_COLOR} />
// // // //             <Text style={styles.cardTitle}>Called Numbers</Text>
// // // //           </View>
// // // //           <Text style={styles.calledCount}>
// // // //             {calledNumbers.length}/90 Numbers
// // // //           </Text>
// // // //         </View>
        
// // // //         {calledNumbers.length > 0 ? (
// // // //           <View style={styles.numbersGridContainer}>
// // // //             {Array.from({ length: 9 }, (_, row) => (
// // // //               <View key={row} style={styles.numberRow}>
// // // //                 {Array.from({ length: 10 }, (_, col) => {
// // // //                   const number = row * 10 + col + 1;
// // // //                   const isCalled = calledNumbers.includes(number);
// // // //                   const isLatest = calledNumbers.length > 0 && 
// // // //                     number === calledNumbers[calledNumbers.length - 1];
                  
// // // //                   return (
// // // //                     <View
// // // //                       key={number}
// // // //                       style={[
// // // //                         styles.numberCell,
// // // //                         isCalled && styles.calledNumberCell,
// // // //                         isLatest && styles.latestNumberCell,
// // // //                       ]}
// // // //                     >
// // // //                       <Text style={[
// // // //                         styles.numberCellText,
// // // //                         isCalled && styles.calledNumberText,
// // // //                         isLatest && styles.latestNumberText,
// // // //                       ]}>
// // // //                         {number}
// // // //                       </Text>
// // // //                       {isLatest && (
// // // //                         <View style={styles.latestIndicator}>
// // // //                           <MaterialCommunityIcons name="star" size={6} color={WHITE} />
// // // //                         </View>
// // // //                       )}
// // // //                     </View>
// // // //                   );
// // // //                 })}
// // // //               </View>
// // // //             ))}
// // // //           </View>
// // // //         ) : (
// // // //           <View style={styles.emptyState}>
// // // //             <MaterialCommunityIcons name="numeric-off" size={40} color={TEXT_LIGHT} />
// // // //             <Text style={styles.emptyStateText}>No numbers called</Text>
// // // //           </View>
// // // //         )}
        
// // // //         <View style={styles.legendContainer}>
// // // //           <View style={styles.legendItem}>
// // // //             <View style={[styles.legendColor, styles.legendNormal]} />
// // // //             <Text style={styles.legendText}>Not Called</Text>
// // // //           </View>
// // // //           <View style={styles.legendItem}>
// // // //             <View style={[styles.legendColor, styles.legendCalled]} />
// // // //             <Text style={styles.legendText}>Called</Text>
// // // //           </View>
// // // //           <View style={styles.legendItem}>
// // // //             <View style={[styles.legendColor, styles.legendLatest]} />
// // // //             <Text style={styles.legendText}>Latest</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   if (loading) {
// // // //     return (
// // // //       <View style={styles.loadingContainer}>
// // // //         <ActivityIndicator size="large" color={PRIMARY_COLOR} />
// // // //         <Text style={styles.loadingText}>Loading Game Results...</Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.safeArea}>
// // // //       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
// // // //       {/* Static Coins Background */}
// // // //       <View style={styles.goldCoinsContainer}>
// // // //         {goldCoins.map((coin) => (
// // // //           <View
// // // //             key={coin.id}
// // // //             style={[
// // // //               styles.goldCoin,
// // // //               {
// // // //                 top: coin.top,
// // // //                 left: coin.left,
// // // //                 width: coin.size,
// // // //                 height: coin.size,
// // // //                 borderRadius: coin.size / 2,
// // // //               }
// // // //             ]}
// // // //           >
// // // //             <View style={styles.coinInner} />
// // // //             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
// // // //           </View>
// // // //         ))}
// // // //       </View>

// // // //       {/* Header */}
// // // //       <Animated.View 
// // // //         style={[
// // // //           styles.header,
// // // //           { transform: [{ scale: pulseAnim }] }
// // // //         ]}
// // // //       >
// // // //         <View style={styles.headerPattern}>
// // // //           <View style={styles.headerCloud1} />
// // // //           <View style={styles.headerCloud2} />
// // // //         </View>
        
// // // //         <View style={styles.headerContent}>
// // // //           <View style={styles.headerTop}>
// // // //             <TouchableOpacity
// // // //               style={styles.backButton}
// // // //               onPress={() => navigation.goBack()}
// // // //             >
// // // //               <Ionicons name="arrow-back" size={24} color={WHITE} />
// // // //             </TouchableOpacity>
            
// // // //             <View style={styles.headerTextContainer}>
// // // //               <Text style={styles.pageTitle}>Game Results</Text>
// // // //               <View style={styles.gameInfoContainer}>
// // // //                 <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
// // // //                 <Text style={styles.gameName} numberOfLines={1}>
// // // //                   {gameName || "Tambola Game"}
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
            
// // // //             {/* <TouchableOpacity
// // // //               style={styles.refreshButton}
// // // //               onPress={fetchGameResults}
// // // //             >
// // // //               <Ionicons name="refresh" size={18} color={WHITE} />
// // // //             </TouchableOpacity> */}
// // // //           </View>
// // // //         </View>
// // // //       </Animated.View>

// // // //       <ScrollView
// // // //         style={styles.container}
// // // //         refreshControl={
// // // //           <RefreshControl
// // // //             refreshing={refreshing}
// // // //             onRefresh={onRefresh}
// // // //             tintColor={PRIMARY_COLOR}
// // // //             colors={[PRIMARY_COLOR]}
// // // //           />
// // // //         }
// // // //         showsVerticalScrollIndicator={false}
// // // //       >
// // // //         <View style={styles.content}>
// // // //           {/* Game Completion Banner */}
// // // //           <View style={styles.completionBanner}>
// // // //             <View style={styles.completionBannerContent}>
// // // //               <MaterialCommunityIcons name="party-popper" size={32} color={ACCENT_COLOR} />
// // // //               <View style={styles.completionTextContainer}>
// // // //                 <Text style={styles.completionTitle}>Game Completed!</Text>
// // // //                 <Text style={styles.completionSubtitle}>
// // // //                   All {calledNumbers.length} numbers have been called
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
// // // //           </View>

// // // //           {/* Tabs */}
// // // //           <View style={styles.tabsContainer}>
// // // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
// // // //               <TouchableOpacity
// // // //                 style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
// // // //                 onPress={() => setSelectedTab("overview")}
// // // //               >
// // // //                 <Ionicons 
// // // //                   name="stats-chart" 
// // // //                   size={14} 
// // // //                   color={selectedTab === "overview" ? WHITE : PRIMARY_COLOR} 
// // // //                 />
// // // //                 <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
// // // //                   Overview
// // // //                 </Text>
// // // //               </TouchableOpacity>
              
// // // //               <TouchableOpacity
// // // //                 style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
// // // //                 onPress={() => setSelectedTab("winners")}
// // // //               >
// // // //                 <Ionicons 
// // // //                   name="trophy" 
// // // //                   size={14} 
// // // //                   color={selectedTab === "winners" ? WHITE : PRIMARY_COLOR} 
// // // //                 />
// // // //                 <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
// // // //                   Winners
// // // //                 </Text>
// // // //               </TouchableOpacity>
              
// // // //               <TouchableOpacity
// // // //                 style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
// // // //                 onPress={() => setSelectedTab("mytickets")}
// // // //               >
// // // //                 <Ionicons 
// // // //                   name="ticket" 
// // // //                   size={14} 
// // // //                   color={selectedTab === "mytickets" ? WHITE : PRIMARY_COLOR} 
// // // //                 />
// // // //                 <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
// // // //                   My Tickets
// // // //                 </Text>
// // // //               </TouchableOpacity>
              
// // // //               <TouchableOpacity
// // // //                 style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
// // // //                 onPress={() => setSelectedTab("numbers")}
// // // //               >
// // // //                 <Ionicons 
// // // //                   name="grid" 
// // // //                   size={14} 
// // // //                   color={selectedTab === "numbers" ? WHITE : PRIMARY_COLOR} 
// // // //                 />
// // // //                 <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
// // // //                   Numbers
// // // //                 </Text>
// // // //               </TouchableOpacity>
// // // //             </ScrollView>
// // // //           </View>

// // // //           {/* Tab Content */}
// // // //           {selectedTab === "overview" && renderOverviewTab()}
// // // //           {selectedTab === "winners" && renderWinnersTab()}
// // // //           {selectedTab === "mytickets" && renderMyTicketsTab()}
// // // //           {selectedTab === "numbers" && renderCalledNumbersTab()}

// // // //           <View style={styles.bottomSpace} />
// // // //         </View>
// // // //       </ScrollView>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   safeArea: {
// // // //     flex: 1,
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //   },
// // // //   container: {
// // // //     flex: 1,
// // // //   },
// // // //   // Coins Background
// // // //   goldCoinsContainer: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     zIndex: 0,
// // // //   },
// // // //   goldCoin: {
// // // //     position: 'absolute',
// // // //     backgroundColor: ACCENT_COLOR,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: 'rgba(255,255,255,0.5)',
// // // //     shadowColor: ACCENT_COLOR,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.3,
// // // //     shadowRadius: 3,
// // // //     elevation: 3,
// // // //   },
// // // //   coinInner: {
// // // //     position: 'absolute',
// // // //     width: '70%',
// // // //     height: '70%',
// // // //     borderRadius: 50,
// // // //     backgroundColor: 'rgba(255, 255, 255, 0.3)',
// // // //     borderWidth: 1,
// // // //     borderColor: 'rgba(255, 255, 255, 0.2)',
// // // //   },
// // // //   coinSymbol: {
// // // //     color: WHITE,
// // // //     fontWeight: 'bold',
// // // //     textShadowColor: 'rgba(0, 0, 0, 0.1)',
// // // //     textShadowOffset: { width: 0, height: 1 },
// // // //     textShadowRadius: 1,
// // // //   },
// // // //   // Header
// // // //   header: {
// // // //     backgroundColor: PRIMARY_COLOR,
// // // //     paddingTop: 15,
// // // //     paddingBottom: 15,
// // // //     borderBottomLeftRadius: 20,
// // // //     borderBottomRightRadius: 20,
// // // //     position: 'relative',
// // // //     overflow: 'hidden',
// // // //     zIndex: 1,
// // // //   },
// // // //   headerPattern: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //   },
// // // //   headerCloud1: {
// // // //     position: 'absolute',
// // // //     top: 15,
// // // //     left: 20,
// // // //     width: 45,
// // // //     height: 15,
// // // //     borderRadius: 20,
// // // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // // //   },
// // // //   headerCloud2: {
// // // //     position: 'absolute',
// // // //     top: 35,
// // // //     right: 30,
// // // //     width: 30,
// // // //     height: 12,
// // // //     borderRadius: 15,
// // // //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
// // // //   },
// // // //   headerContent: {
// // // //     paddingHorizontal: 16,
// // // //   },
// // // //   headerTop: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //   },
// // // //   backButton: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 10,
// // // //     borderWidth: 1,
// // // //     borderColor: "rgba(255, 255, 255, 0.3)",
// // // //   },
// // // //   headerTextContainer: {
// // // //     flex: 1,
// // // //   },
// // // //   pageTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: "700",
// // // //     color: WHITE,
// // // //     letterSpacing: -0.3,
// // // //     marginBottom: 2,
// // // //   },
// // // //   gameInfoContainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 5,
// // // //   },
// // // //   gameName: {
// // // //     fontSize: 12,
// // // //     color: "rgba(255,255,255,0.7)",
// // // //     fontWeight: "500",
// // // //     flex: 1,
// // // //   },
// // // //   refreshButton: {
// // // //     width: 34,
// // // //     height: 34,
// // // //     borderRadius: 17,
// // // //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginLeft: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: "rgba(255, 255, 255, 0.3)",
// // // //   },
// // // //   content: {
// // // //     padding: 16,
// // // //   },
// // // //   // Completion Banner
// // // //   completionBanner: {
// // // //     backgroundColor: WHITE,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   completionBannerContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 12,
// // // //   },
// // // //   completionTextContainer: {
// // // //     flex: 1,
// // // //   },
// // // //   completionTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '800',
// // // //     color: TEXT_DARK,
// // // //     marginBottom: 4,
// // // //   },
// // // //   completionSubtitle: {
// // // //     fontSize: 12,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   // Tabs
// // // //   tabsContainer: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   tabsScroll: {
// // // //     flexGrow: 0,
// // // //   },
// // // //   tab: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 20,
// // // //     backgroundColor: WHITE,
// // // //     marginRight: 8,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //     gap: 6,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   activeTab: {
// // // //     backgroundColor: PRIMARY_COLOR,
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   tabText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   activeTabText: {
// // // //     color: WHITE,
// // // //   },
// // // //   // Cards
// // // //   card: {
// // // //     backgroundColor: WHITE,
// // // //     borderRadius: 16,
// // // //     padding: 16,
// // // //     marginBottom: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: 1 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 2,
// // // //     elevation: 2,
// // // //   },
// // // //   cardHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //   },
// // // //   cardTitleContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 8,
// // // //   },
// // // //   cardTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   tabContent: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   // Stats Grid
// // // //   statsGrid: {
// // // //     gap: 12,
// // // //   },
// // // //   statRow: {
// // // //     flexDirection: 'row',
// // // //     gap: 12,
// // // //   },
// // // //   statCard: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //     gap: 12,
// // // //   },
// // // //   statIcon: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   statInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   statValue: {
// // // //     fontSize: 16,
// // // //     fontWeight: '800',
// // // //     color: TEXT_DARK,
// // // //     marginBottom: 2,
// // // //   },
// // // //   statLabel: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //     fontWeight: '500',
// // // //   },
// // // //   // Number Summary
// // // //   numberSummary: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //   },
// // // //   numberSummaryItem: {
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   numberSummaryValue: {
// // // //     fontSize: 20,
// // // //     fontWeight: '800',
// // // //     color: ACCENT_COLOR,
// // // //     marginBottom: 4,
// // // //   },
// // // //   numberSummaryLabel: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //     fontWeight: '500',
// // // //     textAlign: 'center',
// // // //   },
// // // //   numberSummaryDivider: {
// // // //     width: 1,
// // // //     height: 30,
// // // //     backgroundColor: BORDER_COLOR,
// // // //   },
// // // //   // Winner Badge
// // // //   winnerBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: 'rgba(255, 152, 0, 0.1)',
// // // //     padding: 12,
// // // //     borderRadius: 10,
// // // //     marginTop: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: ACCENT_COLOR,
// // // //     gap: 8,
// // // //   },
// // // //   winnerBadgeText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '700',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   // Winners List
// // // //   winnerCount: {
// // // //     fontSize: 13,
// // // //     color: PRIMARY_COLOR,
// // // //     fontWeight: '600',
// // // //   },
// // // //   winnersList: {
// // // //     gap: 10,
// // // //   },
// // // //   winnerItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   myWinnerItem: {
// // // //     backgroundColor: 'rgba(255, 152, 0, 0.1)',
// // // //     borderColor: ACCENT_COLOR,
// // // //   },
// // // //   winnerRank: {
// // // //     width: 32,
// // // //     height: 32,
// // // //     borderRadius: 16,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   winnerRankText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '700',
// // // //   },
// // // //   winnerInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   winnerName: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //     marginBottom: 2,
// // // //   },
// // // //   myWinnerName: {
// // // //     color: ACCENT_COLOR,
// // // //   },
// // // //   winnerPattern: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   winnerPrize: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   winnerPrizeAmount: {
// // // //     fontSize: 15,
// // // //     fontWeight: '700',
// // // //     color: ACCENT_COLOR,
// // // //     marginBottom: 2,
// // // //   },
// // // //   // All Winners List
// // // //   allWinnersList: {
// // // //     maxHeight: 300,
// // // //   },
// // // //   allWinnerItem: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 8,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: BORDER_COLOR,
// // // //   },
// // // //   myAllWinnerItem: {
// // // //     backgroundColor: 'rgba(255, 152, 0, 0.1)',
// // // //     marginHorizontal: -8,
// // // //     paddingHorizontal: 8,
// // // //     borderRadius: 8,
// // // //   },
// // // //   allWinnerLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   allWinnerAvatar: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: 'rgba(255,255,255,0.3)',
// // // //   },
// // // //   allWinnerAvatarText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '700',
// // // //     color: WHITE,
// // // //   },
// // // //   allWinnerInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   allWinnerName: {
// // // //     fontSize: 13,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //     marginBottom: 2,
// // // //   },
// // // //   myAllWinnerName: {
// // // //     color: ACCENT_COLOR,
// // // //   },
// // // //   allWinnerPattern: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   allWinnerRight: {
// // // //     alignItems: 'flex-end',
// // // //   },
// // // //   allWinnerAmount: {
// // // //     fontSize: 14,
// // // //     fontWeight: '700',
// // // //     color: ACCENT_COLOR,
// // // //     marginBottom: 2,
// // // //   },
// // // //   allWinnerTime: {
// // // //     fontSize: 10,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   // My Winnings
// // // //   winningsTotal: {
// // // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   winningsTotalText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '700',
// // // //     color: PRIMARY_COLOR,
// // // //   },
// // // //   myWinningsList: {
// // // //     gap: 10,
// // // //   },
// // // //   winningItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   winningIcon: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   winningInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   winningPattern: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //     marginBottom: 2,
// // // //   },
// // // //   winningTicket: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //     marginBottom: 2,
// // // //   },
// // // //   winningTime: {
// // // //     fontSize: 10,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   winningAmountContainer: {
// // // //     alignItems: 'center',
// // // //   },
// // // //   winningAmount: {
// // // //     fontSize: 15,
// // // //     fontWeight: '800',
// // // //     color: ACCENT_COLOR,
// // // //   },
// // // //   // My Tickets
// // // //   ticketCount: {
// // // //     fontSize: 13,
// // // //     color: PRIMARY_COLOR,
// // // //     fontWeight: '600',
// // // //   },
// // // //   myTicketsList: {
// // // //     maxHeight: 500,
// // // //   },
// // // //   ticketItem: {
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     marginBottom: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   ticketHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   ticketNumberContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 6,
// // // //   },
// // // //   ticketNumber: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   ticketStatus: {
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 10,
// // // //     backgroundColor: 'rgba(255,255,255,0.8)',
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   ticketCompleted: {
// // // //     backgroundColor: 'rgba(76, 175, 80, 0.1)',
// // // //     borderColor: SUCCESS_COLOR,
// // // //   },
// // // //   ticketIncomplete: {
// // // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   ticketStatusText: {
// // // //     fontSize: 11,
// // // //     fontWeight: '700',
// // // //   },
// // // //   // Ticket Grid
// // // //   ticketGridContainer: {
// // // //     marginBottom: 10,
// // // //   },
// // // //   ticketRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //     marginBottom: 4,
// // // //   },
// // // //   ticketCell: {
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderRadius: 6,
// // // //     marginHorizontal: 2,
// // // //     borderWidth: 1,
// // // //   },
// // // //   ticketCellEmpty: {
// // // //     backgroundColor: 'rgba(0,0,0,0.03)',
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   ticketCellFilled: {
// // // //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// // // //     borderColor: PRIMARY_COLOR,
// // // //   },
// // // //   ticketCellMarked: {
// // // //     backgroundColor: ERROR_COLOR,
// // // //     borderColor: '#C0392B',
// // // //   },
// // // //   ticketCellNumber: {
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   ticketCellNumberMarked: {
// // // //     color: WHITE,
// // // //     fontWeight: '700',
// // // //   },
// // // //   ticketStats: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // //   ticketStat: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //   },
// // // //   ticketStatText: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   fullHouseBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     backgroundColor: 'rgba(255, 152, 0, 0.1)',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 10,
// // // //     borderWidth: 1,
// // // //     borderColor: ACCENT_COLOR,
// // // //     gap: 4,
// // // //   },
// // // //   fullHouseBadgeText: {
// // // //     fontSize: 10,
// // // //     fontWeight: '700',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   // Called Numbers
// // // //   calledCount: {
// // // //     fontSize: 13,
// // // //     color: PRIMARY_COLOR,
// // // //     fontWeight: '600',
// // // //   },
// // // //   numbersGridContainer: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   numberRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //     marginBottom: 4,
// // // //   },
// // // //   numberCell: {
// // // //     width: 28,
// // // //     height: 28,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderRadius: 6,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //     backgroundColor: WHITE,
// // // //     marginHorizontal: 1,
// // // //     position: 'relative',
// // // //   },
// // // //   calledNumberCell: {
// // // //     backgroundColor: SUCCESS_COLOR,
// // // //     borderColor: SUCCESS_COLOR,
// // // //   },
// // // //   latestNumberCell: {
// // // //     backgroundColor: ACCENT_COLOR,
// // // //     borderColor: ACCENT_COLOR,
// // // //   },
// // // //   numberCellText: {
// // // //     fontSize: 11,
// // // //     fontWeight: '600',
// // // //     color: TEXT_DARK,
// // // //   },
// // // //   calledNumberText: {
// // // //     color: WHITE,
// // // //     fontWeight: '700',
// // // //   },
// // // //   latestNumberText: {
// // // //     color: WHITE,
// // // //     fontWeight: '800',
// // // //   },
// // // //   latestIndicator: {
// // // //     position: 'absolute',
// // // //     top: -2,
// // // //     right: -2,
// // // //     backgroundColor: WHITE,
// // // //     borderRadius: 4,
// // // //     padding: 1,
// // // //   },
// // // //   legendContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     gap: 16,
// // // //     paddingTop: 12,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: BORDER_COLOR,
// // // //   },
// // // //   legendItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 6,
// // // //   },
// // // //   legendColor: {
// // // //     width: 12,
// // // //     height: 12,
// // // //     borderRadius: 3,
// // // //     borderWidth: 1,
// // // //     borderColor: BORDER_COLOR,
// // // //   },
// // // //   legendNormal: {
// // // //     backgroundColor: WHITE,
// // // //   },
// // // //   legendCalled: {
// // // //     backgroundColor: SUCCESS_COLOR,
// // // //   },
// // // //   legendLatest: {
// // // //     backgroundColor: ACCENT_COLOR,
// // // //   },
// // // //   legendText: {
// // // //     fontSize: 11,
// // // //     color: TEXT_LIGHT,
// // // //   },
// // // //   // Empty State
// // // //   emptyState: {
// // // //     alignItems: 'center',
// // // //     padding: 24,
// // // //   },
// // // //   emptyStateText: {
// // // //     fontSize: 14,
// // // //     color: TEXT_LIGHT,
// // // //     marginTop: 8,
// // // //     textAlign: 'center',
// // // //     fontWeight: '500',
// // // //   },
// // // //   // Loading
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     backgroundColor: BACKGROUND_COLOR,
// // // //   },
// // // //   loadingText: {
// // // //     fontSize: 16,
// // // //     color: PRIMARY_COLOR,
// // // //     marginTop: 12,
// // // //     fontWeight: '500',
// // // //   },
// // // //   bottomSpace: {
// // // //     height: 20,
// // // //   },
// // // // });

// // // // export default UserGameResult;





// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Dimensions,
// // //   RefreshControl,
// // //   Animated,
// // //   Easing,
// // //   Platform,
// // // } from "react-native";
// // // import LinearGradient from 'react-native-linear-gradient';
// // // import axios from "axios";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";
// // // import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// // // import { useNavigation } from '@react-navigation/native';

// // // const { width, height } = Dimensions.get('window');

// // // // Enhanced color scheme with gradients
// // // const COLORS = {
// // //   primary: "#4facfe",
// // //   primaryGradient: ['#359df9', '#64d8f8'],
// // //   secondary: "#FDB800",
// // //   secondaryGradient: ['#FDB800', '#FF8C00'],
// // //   background: "#f5f8ff",
// // //   surface: "#FFFFFF",
// // //   textDark: "#333333",
// // //   textLight: "#777777",
// // //   border: "#EEEEEE",
  
// // //   // Status colors with gradients
// // //   success: "#4CAF50",
// // //   successGradient: ['#4CAF50', '#45a049'],
// // //   error: "#E74C3C",
// // //   errorGradient: ['#E74C3C', '#c0392b'],
// // //   warning: "#ff9800",
// // //   warningGradient: ['#ff9800', '#f57c00'],
  
// // //   // Additional gradients
// // //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// // //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// // //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
// // //   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
  
// // //   // Individual colors with gradients
// // //   purple: "#9B59B6",
// // //   purpleGradient: ['#9B59B6', '#8E44AD'],
// // //   orange: "#FF9800",
// // //   orangeGradient: ['#FF9800', '#F57C00'],
// // //   teal: "#4ECDC4",
// // //   tealGradient: ['#4ECDC4', '#2AA7A0'],
// // //   red: "#EF4444",
// // //   redGradient: ['#EF4444', '#DC2626'],
// // //   green: "#10B981",
// // //   greenGradient: ['#10B981', '#059669'],
// // // };

// // // const UserGameResult = ({ route, navigation }) => {
// // //   const { gameId, gameName } = route.params;
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [gameData, setGameData] = useState(null);
// // //   const [myTickets, setMyTickets] = useState([]);
// // //   const [myWinnings, setMyWinnings] = useState([]);
// // //   const [allWinners, setAllWinners] = useState([]);
// // //   const [gameStats, setGameStats] = useState(null);
// // //   const [calledNumbers, setCalledNumbers] = useState([]);
// // //   const [selectedTab, setSelectedTab] = useState("overview");

// // //   // Animation values
// // //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// // //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// // //   const pulseAnim = useRef(new Animated.Value(1)).current;
// // //   const rotateAnim = useRef(new Animated.Value(0)).current;
// // //   const shineAnim = useRef(new Animated.Value(0)).current;
  
// // //   // Button animation refs
// // //   const backButtonScale = useRef(new Animated.Value(1)).current;
// // //   const tabButtonScales = useRef({
// // //     overview: new Animated.Value(1),
// // //     winners: new Animated.Value(1),
// // //     mytickets: new Animated.Value(1),
// // //     numbers: new Animated.Value(1),
// // //   }).current;
  
// // //   // Header letter animations
// // //   const letterAnims = useRef([]);

// // //   // Static coins in background (now with animation)
// // //   const goldCoins = [
// // //     { id: 1, top: '15%', left: '5%', size: 25 },
// // //     { id: 2, top: '25%', left: '85%', size: 20 },
// // //     { id: 3, top: '40%', left: '15%', size: 22 },
// // //     { id: 4, top: '55%', left: '75%', size: 18 },
// // //     { id: 5, top: '70%', left: '10%', size: 24 },
// // //     { id: 6, top: '80%', left: '80%', size: 19 },
// // //     { id: 7, top: '30%', left: '60%', size: 21 },
// // //     { id: 8, top: '65%', left: '40%', size: 23 },
// // //     { id: 9, top: '45%', left: '90%', size: 17 },
// // //     { id: 10, top: '85%', left: '30%', size: 20 },
// // //   ];

// // //   useEffect(() => {
// // //     // Initialize letter animations for header
// // //     letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
// // //     // Animate each letter with a popping effect
// // //     letterAnims.current.forEach((anim, index) => {
// // //       Animated.loop(
// // //         Animated.sequence([
// // //           Animated.delay(index * 80),
// // //           Animated.timing(anim, {
// // //             toValue: 1.4,
// // //             duration: 300,
// // //             useNativeDriver: true,
// // //             easing: Easing.bounce,
// // //           }),
// // //           Animated.timing(anim, {
// // //             toValue: 1,
// // //             duration: 200,
// // //             useNativeDriver: true,
// // //             easing: Easing.bounce,
// // //           }),
// // //           Animated.delay(1800),
// // //         ])
// // //       ).start();
// // //     });

// // //     startAnimations();
    
// // //     // Start button animations
// // //     startPulseAnimation(backButtonScale, 800);
// // //     startPulseAnimation(tabButtonScales.overview, 800);
// // //     startPulseAnimation(tabButtonScales.winners, 850);
// // //     startPulseAnimation(tabButtonScales.mytickets, 900);
// // //     startPulseAnimation(tabButtonScales.numbers, 950);

// // //     fetchGameResults();
// // //   }, []);

// // //   const startPulseAnimation = (anim, duration = 800) => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(anim, {
// // //           toValue: 1.08,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         }),
// // //         Animated.timing(anim, {
// // //           toValue: 1,
// // //           duration: duration,
// // //           useNativeDriver: true,
// // //           easing: Easing.inOut(Easing.ease)
// // //         })
// // //       ])
// // //     ).start();
// // //   };

// // //   const startAnimations = () => {
// // //     // Float animation 1
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 1,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim1, {
// // //           toValue: 0,
// // //           duration: 4000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Float animation 2
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 1,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(floatAnim2, {
// // //           toValue: 0,
// // //           duration: 5000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Pulse animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1.02,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(pulseAnim, {
// // //           toValue: 1,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();

// // //     // Rotate animation
// // //     Animated.loop(
// // //       Animated.timing(rotateAnim, {
// // //         toValue: 1,
// // //         duration: 20000,
// // //         easing: Easing.linear,
// // //         useNativeDriver: true,
// // //       })
// // //     ).start();

// // //     // Shine animation
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(shineAnim, {
// // //           toValue: 1,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //         Animated.timing(shineAnim, {
// // //           toValue: 0,
// // //           duration: 3000,
// // //           easing: Easing.inOut(Easing.ease),
// // //           useNativeDriver: true,
// // //         }),
// // //       ])
// // //     ).start();
// // //   };

// // //   const translateY1 = floatAnim1.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, 10]
// // //   });

// // //   const translateY2 = floatAnim2.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [0, -8]
// // //   });

// // //   const rotate = rotateAnim.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: ['0deg', '360deg']
// // //   });

// // //   const shineTranslateX = shineAnim.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: [-100, width + 100]
// // //   });

// // //   const fetchGameResults = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
// // //       const response = await axios.get(
// // //         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
// // //         {
// // //           headers: {
// // //             Authorization: `Bearer ${token}`,
// // //             Accept: "application/json",
// // //           },
// // //         }
// // //       );

// // //       if (response.data.status) {
// // //         const data = response.data.data;
// // //         setGameData(data);
        
// // //         // Set tickets
// // //         if (data.my_tickets_complete_data) {
// // //           setMyTickets(data.my_tickets_complete_data);
// // //         }
        
// // //         // Set my winnings
// // //         if (data.my_participation?.winning_patterns) {
// // //           setMyWinnings(data.my_participation.winning_patterns);
// // //         }
        
// // //         // Set all winners
// // //         if (data.all_game_winners?.winners_list) {
// // //           setAllWinners(data.all_game_winners.winners_list);
// // //         }
        
// // //         // Set game stats
// // //         if (data.game_statistics) {
// // //           setGameStats(data.game_statistics);
// // //         }
        
// // //         // Set called numbers
// // //         if (data.number_calling_history?.called_numbers) {
// // //           setCalledNumbers(data.number_calling_history.called_numbers);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching game results:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     setRefreshing(true);
// // //     fetchGameResults().finally(() => setRefreshing(false));
// // //   }, []);

// // //   const renderTicketGrid = (ticketData) => {
// // //     const TICKET_WIDTH = width - 64;
// // //     const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
// // //     const processTicketData = (data) => {
// // //       if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
// // //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// // //       data.forEach((row, rowIndex) => {
// // //         row.forEach((cell) => {
// // //           if (cell && cell.number !== null && cell.column !== undefined) {
// // //             processedGrid[rowIndex][cell.column] = cell;
// // //           }
// // //         });
// // //       });
      
// // //       return processedGrid;
// // //     };

// // //     const processedData = processTicketData(ticketData);

// // //     return (
// // //       <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
// // //         {processedData.map((row, rowIndex) => (
// // //           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
// // //             {row.map((cell, colIndex) => {
// // //               const cellObj = cell;
// // //               const cellNumber = cellObj?.number;
// // //               const isMarked = cellObj?.is_marked || false;
// // //               const isEmpty = cellNumber === null || cellNumber === undefined;
              
// // //               return (
// // //                 <View
// // //                   key={`cell-${rowIndex}-${colIndex}`}
// // //                   style={[
// // //                     styles.ticketCell,
// // //                     { 
// // //                       width: CELL_SIZE,
// // //                       height: CELL_SIZE,
// // //                     },
// // //                     isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
// // //                     isMarked && styles.ticketCellMarked,
// // //                   ]}
// // //                 >
// // //                   {!isEmpty && (
// // //                     <Text style={[
// // //                       styles.ticketCellNumber,
// // //                       isMarked && styles.ticketCellNumberMarked
// // //                     ]}>
// // //                       {cellNumber}
// // //                     </Text>
// // //                   )}
// // //                 </View>
// // //               );
// // //             })}
// // //           </View>
// // //         ))}
// // //       </View>
// // //     );
// // //   };

// // //   const renderBackgroundPattern = () => (
// // //     <View style={styles.backgroundPattern}>
// // //       {/* Animated poker chips */}
// // //       <Animated.View 
// // //         style={[
// // //           styles.pokerChip1, 
// // //           { 
// // //             transform: [
// // //               { translateY: translateY1 },
// // //               { translateX: translateY2 },
// // //               { rotate }
// // //             ] 
// // //           }
// // //         ]} 
// // //       />
// // //       <Animated.View 
// // //         style={[
// // //           styles.pokerChip2, 
// // //           { 
// // //             transform: [
// // //               { translateY: translateY2 },
// // //               { translateX: translateY1 },
// // //               { rotate: rotateAnim.interpolate({
// // //                 inputRange: [0, 1],
// // //                 outputRange: ['0deg', '-360deg']
// // //               }) }
// // //             ] 
// // //           }
// // //         ]} 
// // //       />
      
// // //       {/* Animated shine effect */}
// // //       <Animated.View 
// // //         style={[
// // //           styles.shineEffect,
// // //           { 
// // //             transform: [{ translateX: shineTranslateX }],
// // //             opacity: shineAnim
// // //           }
// // //         ]} 
// // //       />
      
// // //       {/* Gradient overlays */}
// // //       <LinearGradient
// // //         colors={['rgba(255,152,0,0.05)', 'transparent']}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 0, y: 1 }}
// // //         style={styles.yellowGradient}
// // //       />
// // //       <LinearGradient
// // //         colors={['transparent', 'rgba(79,172,254,0.05)']}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 0, y: 1 }}
// // //         style={styles.blueGradient}
// // //       />
// // //     </View>
// // //   );

// // //   // Cartoon-style header with popping letters
// // //   const Header = () => {
// // //     const letters = [
// // //       { char: 'R', index: 0 },
// // //       { char: 'E', index: 1 },
// // //       { char: 'S', index: 2 },
// // //       { char: 'U', index: 3 },
// // //       { char: 'L', index: 4 },
// // //       { char: 'T', index: 5 },
// // //       { char: 'S', index: 6, isSpecial: true },
// // //     ];

// // //     return (
// // //       <LinearGradient
// // //         colors={COLORS.primaryGradient}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 0 }}
// // //         style={styles.header}
// // //       >
// // //         <View style={styles.headerPattern}>
// // //           <Animated.View 
// // //             style={[
// // //               styles.headerShine,
// // //               { transform: [{ translateX: shineTranslateX }] }
// // //             ]} 
// // //           />
// // //         </View>
        
// // //         <View style={styles.headerContent}>
// // //           <View style={styles.headerTop}>
// // //             <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
// // //               <TouchableOpacity
// // //                 style={styles.backButton}
// // //                 onPress={() => navigation.goBack()}
// // //               >
// // //                 <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
// // //               </TouchableOpacity>
// // //             </Animated.View>
            
// // //             <View style={styles.headerTextContainer}>
// // //               <View style={styles.cartoonTitleRow}>
// // //                 {letters.map((item) => (
// // //                   <Animated.Text
// // //                     key={item.index}
// // //                     style={[
// // //                       styles.cartoonLetter,
// // //                       item.isSpecial && styles.specialCartoonLetter,
// // //                       { 
// // //                         transform: [{ scale: letterAnims.current[item.index] || 1 }],
// // //                       }
// // //                     ]}
// // //                   >
// // //                     {item.char}
// // //                   </Animated.Text>
// // //                 ))}
// // //               </View>
// // //               <View style={styles.gameInfoContainer}>
// // //                 <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
// // //                 <Text style={styles.gameName} numberOfLines={1}>
// // //                   {gameName || "Tambola Game"}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </LinearGradient>
// // //     );
// // //   };

// // //   const OverviewTab = () => (
// // //     <View style={styles.tabContent}>
// // //       {/* Game Stats - 2x2 Grid */}
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="chart-line" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>Game Statistics</Text>
// // //           </View>
// // //         </View>
        
// // //         {gameStats && (
// // //           <View style={styles.statsGrid}>
// // //             <View style={styles.statRow}>
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="account-group" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
// // //                   <Text style={styles.statLabel}>Participants</Text>
// // //                 </View>
// // //               </LinearGradient>
              
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
// // //                   <Text style={styles.statLabel}>Tickets Sold</Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             </View>
            
// // //             <View style={styles.statRow}>
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="trophy" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
// // //                   <Text style={styles.statLabel}>Winners</Text>
// // //                 </View>
// // //               </LinearGradient>
              
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
// // //                   <Text style={styles.statLabel}>Total Winnings</Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             </View>
// // //           </View>
// // //         )}
// // //       </LinearGradient>

// // //       {/* My Performance - 2x2 Grid */}
// // //       {gameData?.my_participation && (
// // //         <LinearGradient
// // //           colors={[COLORS.surface, COLORS.surface]}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.card}
// // //         >
// // //           <View style={styles.cardHeader}>
// // //             <View style={styles.cardTitleContainer}>
// // //               <LinearGradient
// // //                 colors={COLORS.prizeGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.cardIcon}
// // //               >
// // //                 <MaterialCommunityIcons name="medal" size={16} color={COLORS.primary} />
// // //               </LinearGradient>
// // //               <Text style={styles.cardTitle}>My Performance</Text>
// // //             </View>
// // //           </View>
          
// // //           <View style={styles.statsGrid}>
// // //             <View style={styles.statRow}>
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
// // //                   <Text style={styles.statLabel}>My Tickets</Text>
// // //                 </View>
// // //               </LinearGradient>
              
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.green} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
// // //                   <Text style={styles.statLabel}>Approved</Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             </View>
            
// // //             <View style={styles.statRow}>
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="currency-inr" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
// // //                   <Text style={styles.statLabel}>My Winnings</Text>
// // //                 </View>
// // //               </LinearGradient>
              
// // //               <LinearGradient
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.statCard}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.statIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="trophy" size={20} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.statInfo}>
// // //                   <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
// // //                   <Text style={styles.statLabel}>Patterns Won</Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             </View>
// // //           </View>
          
// // //           {gameData.my_participation.won_this_game && (
// // //             <LinearGradient
// // //               colors={COLORS.warningGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 0 }}
// // //               style={styles.winnerBadge}
// // //             >
// // //               <MaterialCommunityIcons name="trophy" size={16} color={COLORS.surface} />
// // //               <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
// // //             </LinearGradient>
// // //           )}
// // //         </LinearGradient>
// // //       )}

// // //       {/* Number Calling Summary */}
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="numeric" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>Number Calling Summary</Text>
// // //           </View>
// // //         </View>
        
// // //         <View style={styles.numberSummary}>
// // //           <View style={styles.numberSummaryItem}>
// // //             <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
// // //             <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
// // //           </View>
          
// // //           <View style={styles.numberSummaryDivider} />
          
// // //           <View style={styles.numberSummaryItem}>
// // //             <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
// // //             <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
// // //           </View>
          
// // //           <View style={styles.numberSummaryDivider} />
          
// // //           <View style={styles.numberSummaryItem}>
// // //             <Text style={styles.numberSummaryValue}>
// // //               {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
// // //             </Text>
// // //             <Text style={styles.numberSummaryLabel}>Last Number</Text>
// // //           </View>
// // //         </View>
// // //       </LinearGradient>
// // //     </View>
// // //   );

// // //   const WinnersTab = () => (
// // //     <View style={styles.tabContent}>
// // //       {/* Top Winners */}
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="crown" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>Top Winners</Text>
// // //           </View>
// // //           <LinearGradient
// // //             colors={COLORS.prizeGradient}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.winnerCountBadge}
// // //           >
// // //             <Text style={styles.winnerCount}>
// // //               {gameData?.all_game_winners?.total_winners || 0} Winners
// // //             </Text>
// // //           </LinearGradient>
// // //         </View>
        
// // //         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
// // //           <View style={styles.winnersList}>
// // //             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
// // //               <LinearGradient
// // //                 key={index}
// // //                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 0 }}
// // //                 style={[
// // //                   styles.winnerItem,
// // //                   winner.is_me && styles.myWinnerItem
// // //                 ]}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={[styles.winnerRank, { backgroundColor: COLORS.primary + '20' }]}
// // //                 >
// // //                   <Text style={[styles.winnerRankText, { color: COLORS.primary }]}>#{index + 1}</Text>
// // //                 </LinearGradient>
                
// // //                 <View style={styles.winnerInfo}>
// // //                   <Text style={[
// // //                     styles.winnerName,
// // //                     winner.is_me && { color: COLORS.surface }
// // //                   ]}>
// // //                     {winner.winner_name}
// // //                     {winner.is_me && " (You)"}
// // //                   </Text>
// // //                   <Text style={[
// // //                     styles.winnerPattern,
// // //                     winner.is_me && { color: COLORS.surface + 'CC' }
// // //                   ]}>{winner.pattern_name}</Text>
// // //                 </View>
                
// // //                 <View style={styles.winnerPrize}>
// // //                   <Text style={[
// // //                     styles.winnerPrizeAmount,
// // //                     winner.is_me && { color: COLORS.surface }
// // //                   ]}>₹{winner.winning_amount}</Text>
// // //                   {index === 0 && (
// // //                     <MaterialCommunityIcons name="trophy" size={12} color={winner.is_me ? COLORS.surface : COLORS.secondary} />
// // //                   )}
// // //                 </View>
// // //               </LinearGradient>
// // //             ))}
// // //           </View>
// // //         ) : (
// // //           <View style={styles.emptyState}>
// // //             <MaterialCommunityIcons name="trophy-outline" size={40} color={COLORS.textLight} />
// // //             <Text style={styles.emptyStateText}>No winners data available</Text>
// // //           </View>
// // //         )}
// // //       </LinearGradient>

// // //       {/* All Winners List */}
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="format-list-bulleted" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>All Winners</Text>
// // //           </View>
// // //         </View>
        
// // //         {allWinners.length > 0 ? (
// // //           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
// // //             {allWinners.map((winner, index) => (
// // //               <LinearGradient
// // //                 key={index}
// // //                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 0 }}
// // //                 style={[
// // //                   styles.allWinnerItem,
// // //                   winner.is_me && styles.myAllWinnerItem
// // //                 ]}
// // //               >
// // //                 <View style={styles.allWinnerLeft}>
// // //                   <LinearGradient
// // //                     colors={COLORS.primaryGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 1 }}
// // //                     style={styles.allWinnerAvatar}
// // //                   >
// // //                     <Text style={styles.allWinnerAvatarText}>
// // //                       {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
// // //                     </Text>
// // //                   </LinearGradient>
// // //                   <View style={styles.allWinnerInfo}>
// // //                     <Text style={[
// // //                       styles.allWinnerName,
// // //                       winner.is_me && { color: COLORS.surface }
// // //                     ]}>
// // //                       {winner.winner_name}
// // //                       {winner.is_me && " (You)"}
// // //                     </Text>
// // //                     <Text style={[
// // //                       styles.allWinnerPattern,
// // //                       winner.is_me && { color: COLORS.surface + 'CC' }
// // //                     ]}>{winner.reward_name}</Text>
// // //                   </View>
// // //                 </View>
                
// // //                 <View style={styles.allWinnerRight}>
// // //                   <Text style={[
// // //                     styles.allWinnerAmount,
// // //                     winner.is_me && { color: COLORS.surface }
// // //                   ]}>₹{winner.winning_amount}</Text>
// // //                   <Text style={[
// // //                     styles.allWinnerTime,
// // //                     winner.is_me && { color: COLORS.surface + 'CC' }
// // //                   ]}>
// // //                     {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // //                   </Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             ))}
// // //           </ScrollView>
// // //         ) : (
// // //           <View style={styles.emptyState}>
// // //             <MaterialCommunityIcons name="account-group-outline" size={40} color={COLORS.textLight} />
// // //             <Text style={styles.emptyStateText}>No winners found</Text>
// // //           </View>
// // //         )}
// // //       </LinearGradient>
// // //     </View>
// // //   );

// // //   const MyTicketsTab = () => (
// // //     <View style={styles.tabContent}>
// // //       {/* My Winnings Summary */}
// // //       {myWinnings.length > 0 && (
// // //         <LinearGradient
// // //           colors={[COLORS.surface, COLORS.surface]}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.card}
// // //         >
// // //           <View style={styles.cardHeader}>
// // //             <View style={styles.cardTitleContainer}>
// // //               <LinearGradient
// // //                 colors={COLORS.prizeGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.cardIcon}
// // //               >
// // //                 <MaterialCommunityIcons name="trophy" size={16} color={COLORS.primary} />
// // //               </LinearGradient>
// // //               <Text style={styles.cardTitle}>My Winnings</Text>
// // //             </View>
// // //             <LinearGradient
// // //               colors={COLORS.primaryGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.winningsTotal}
// // //             >
// // //               <Text style={styles.winningsTotalText}>
// // //                 ₹{gameData?.my_participation?.total_winnings || 0}
// // //               </Text>
// // //             </LinearGradient>
// // //           </View>
          
// // //           <View style={styles.myWinningsList}>
// // //             {myWinnings.map((winning, index) => (
// // //               <LinearGradient
// // //                 key={index}
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.winningItem}
// // //               >
// // //                 <LinearGradient
// // //                   colors={COLORS.prizeGradient}
// // //                   start={{ x: 0, y: 0 }}
// // //                   end={{ x: 1, y: 1 }}
// // //                   style={styles.winningIcon}
// // //                 >
// // //                   <MaterialCommunityIcons name="trophy" size={18} color={COLORS.primary} />
// // //                 </LinearGradient>
// // //                 <View style={styles.winningInfo}>
// // //                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
// // //                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
// // //                   <Text style={styles.winningTime}>
// // //                     {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// // //                   </Text>
// // //                 </View>
// // //                 <View style={styles.winningAmountContainer}>
// // //                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
// // //                 </View>
// // //               </LinearGradient>
// // //             ))}
// // //           </View>
// // //         </LinearGradient>
// // //       )}

// // //       {/* My Tickets */}
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="ticket-confirmation" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>My Tickets</Text>
// // //           </View>
// // //           <LinearGradient
// // //             colors={COLORS.prizeGradient}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.ticketCountBadge}
// // //           >
// // //             <Text style={styles.ticketCount}>
// // //               {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
// // //             </Text>
// // //           </LinearGradient>
// // //         </View>
        
// // //         {myTickets.length > 0 ? (
// // //           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
// // //             {myTickets.map((ticket, index) => (
// // //               <LinearGradient
// // //                 key={index}
// // //                 colors={COLORS.winnerGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.ticketItem}
// // //               >
// // //                 <View style={styles.ticketHeader}>
// // //                   <View style={styles.ticketNumberContainer}>
// // //                     <LinearGradient
// // //                       colors={COLORS.prizeGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 1 }}
// // //                       style={styles.ticketNumberIcon}
// // //                     >
// // //                       <MaterialCommunityIcons name="ticket-confirmation" size={14} color={COLORS.primary} />
// // //                     </LinearGradient>
// // //                     <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
// // //                   </View>
// // //                   <LinearGradient
// // //                     colors={ticket.is_completed ? COLORS.successGradient : COLORS.prizeGradient}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={[
// // //                       styles.ticketStatus,
// // //                       ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
// // //                     ]}
// // //                   >
// // //                     <Text style={[
// // //                       styles.ticketStatusText,
// // //                       ticket.is_completed ? { color: COLORS.surface } : { color: COLORS.primary }
// // //                     ]}>
// // //                       {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
// // //                     </Text>
// // //                   </LinearGradient>
// // //                 </View>
                
// // //                 {/* Ticket Grid */}
// // //                 {renderTicketGrid(ticket.ticket_data)}
                
// // //                 <View style={styles.ticketStats}>
// // //                   <View style={styles.ticketStat}>
// // //                     <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />
// // //                     <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
// // //                   </View>
// // //                   <View style={styles.ticketStat}>
// // //                     <Ionicons name="close-circle" size={12} color={COLORS.red} />
// // //                     <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
// // //                   </View>
// // //                   {ticket.marked_numbers_count === 15 && (
// // //                     <LinearGradient
// // //                       colors={COLORS.warningGradient}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 0 }}
// // //                       style={styles.fullHouseBadge}
// // //                     >
// // //                       <MaterialCommunityIcons name="trophy" size={12} color={COLORS.surface} />
// // //                       <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
// // //                     </LinearGradient>
// // //                   )}
// // //                 </View>
// // //               </LinearGradient>
// // //             ))}
// // //           </ScrollView>
// // //         ) : (
// // //           <View style={styles.emptyState}>
// // //             <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textLight} />
// // //             <Text style={styles.emptyStateText}>No tickets found</Text>
// // //           </View>
// // //         )}
// // //       </LinearGradient>
// // //     </View>
// // //   );

// // //   const CalledNumbersTab = () => (
// // //     <View style={styles.tabContent}>
// // //       <LinearGradient
// // //         colors={[COLORS.surface, COLORS.surface]}
// // //         start={{ x: 0, y: 0 }}
// // //         end={{ x: 1, y: 1 }}
// // //         style={styles.card}
// // //       >
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.cardTitleContainer}>
// // //             <LinearGradient
// // //               colors={COLORS.prizeGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={styles.cardIcon}
// // //             >
// // //               <MaterialCommunityIcons name="grid" size={16} color={COLORS.primary} />
// // //             </LinearGradient>
// // //             <Text style={styles.cardTitle}>Called Numbers</Text>
// // //           </View>
// // //           <LinearGradient
// // //             colors={COLORS.prizeGradient}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.calledCountBadge}
// // //           >
// // //             <Text style={styles.calledCount}>
// // //               {calledNumbers.length}/90
// // //             </Text>
// // //           </LinearGradient>
// // //         </View>
        
// // //         {calledNumbers.length > 0 ? (
// // //           <View style={styles.numbersGridContainer}>
// // //             {Array.from({ length: 9 }, (_, row) => (
// // //               <View key={row} style={styles.numberRow}>
// // //                 {Array.from({ length: 10 }, (_, col) => {
// // //                   const number = row * 10 + col + 1;
// // //                   const isCalled = calledNumbers.includes(number);
// // //                   const isLatest = calledNumbers.length > 0 && 
// // //                     number === calledNumbers[calledNumbers.length - 1];
                  
// // //                   return (
// // //                     <LinearGradient
// // //                       key={number}
// // //                       colors={isLatest ? COLORS.secondaryGradient : 
// // //                              isCalled ? COLORS.successGradient : 
// // //                              [COLORS.surface, COLORS.surface]}
// // //                       start={{ x: 0, y: 0 }}
// // //                       end={{ x: 1, y: 1 }}
// // //                       style={[
// // //                         styles.numberCell,
// // //                         isCalled && styles.calledNumberCell,
// // //                         isLatest && styles.latestNumberCell,
// // //                       ]}
// // //                     >
// // //                       <Text style={[
// // //                         styles.numberCellText,
// // //                         (isCalled || isLatest) && { color: COLORS.surface }
// // //                       ]}>
// // //                         {number}
// // //                       </Text>
// // //                       {isLatest && (
// // //                         <View style={styles.latestIndicator}>
// // //                           <MaterialCommunityIcons name="star" size={6} color={COLORS.surface} />
// // //                         </View>
// // //                       )}
// // //                     </LinearGradient>
// // //                   );
// // //                 })}
// // //               </View>
// // //             ))}
// // //           </View>
// // //         ) : (
// // //           <View style={styles.emptyState}>
// // //             <MaterialCommunityIcons name="numeric-off" size={40} color={COLORS.textLight} />
// // //             <Text style={styles.emptyStateText}>No numbers called</Text>
// // //           </View>
// // //         )}
        
// // //         <View style={styles.legendContainer}>
// // //           <View style={styles.legendItem}>
// // //             <View style={[styles.legendColor, styles.legendNormal]} />
// // //             <Text style={styles.legendText}>Not Called</Text>
// // //           </View>
// // //           <View style={styles.legendItem}>
// // //             <LinearGradient
// // //               colors={COLORS.successGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={[styles.legendColor, styles.legendCalled]}
// // //             />
// // //             <Text style={styles.legendText}>Called</Text>
// // //           </View>
// // //           <View style={styles.legendItem}>
// // //             <LinearGradient
// // //               colors={COLORS.secondaryGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={[styles.legendColor, styles.legendLatest]}
// // //             />
// // //             <Text style={styles.legendText}>Latest</Text>
// // //           </View>
// // //         </View>
// // //       </LinearGradient>
// // //     </View>
// // //   );

// // //   if (loading) {
// // //     return (
// // //       <SafeAreaView style={styles.safeArea}>
// // //         <LinearGradient
// // //           colors={COLORS.primaryGradient}
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.loadingContainer}
// // //         >
// // //           <ActivityIndicator size="large" color={COLORS.surface} />
// // //           <Text style={styles.loadingText}>Loading Game Results...</Text>
// // //         </LinearGradient>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
// // //       {renderBackgroundPattern()}
      
// // //       {/* Animated Coins Background */}
// // //       <View style={styles.goldCoinsContainer}>
// // //         {goldCoins.map((coin) => (
// // //           <Animated.View
// // //             key={coin.id}
// // //             style={[
// // //               styles.goldCoin,
// // //               {
// // //                 top: coin.top,
// // //                 left: coin.left,
// // //                 width: coin.size,
// // //                 height: coin.size,
// // //                 borderRadius: coin.size / 2,
// // //                 transform: [
// // //                   { translateY: coin.id % 2 === 0 ? translateY1 : translateY2 },
// // //                   { rotate: rotate }
// // //                 ]
// // //               }
// // //             ]}
// // //           >
// // //             <LinearGradient
// // //               colors={COLORS.secondaryGradient}
// // //               start={{ x: 0, y: 0 }}
// // //               end={{ x: 1, y: 1 }}
// // //               style={[StyleSheet.absoluteFill, { borderRadius: coin.size / 2 }]}
// // //             />
// // //             <View style={styles.coinInner} />
// // //             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
// // //           </Animated.View>
// // //         ))}
// // //       </View>

// // //       <Header />

// // //       <ScrollView
// // //         style={styles.container}
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             tintColor={COLORS.primary}
// // //             colors={[COLORS.primary]}
// // //           />
// // //         }
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         <View style={styles.content}>
// // //           {/* Game Completion Banner */}
// // //           <LinearGradient
// // //             colors={COLORS.winnerGradient}
// // //             start={{ x: 0, y: 0 }}
// // //             end={{ x: 1, y: 1 }}
// // //             style={styles.completionBanner}
// // //           >
// // //             <View style={styles.completionBannerContent}>
// // //               <LinearGradient
// // //                 colors={COLORS.warningGradient}
// // //                 start={{ x: 0, y: 0 }}
// // //                 end={{ x: 1, y: 1 }}
// // //                 style={styles.completionIcon}
// // //               >
// // //                 <MaterialCommunityIcons name="party-popper" size={24} color={COLORS.surface} />
// // //               </LinearGradient>
// // //               <View style={styles.completionTextContainer}>
// // //                 <Text style={styles.completionTitle}>Game Completed!</Text>
// // //                 <Text style={styles.completionSubtitle}>
// // //                   All {calledNumbers.length} numbers have been called
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </LinearGradient>

// // //           {/* Tabs */}
// // //           <View style={styles.tabsContainer}>
// // //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
// // //               <Animated.View style={{ transform: [{ scale: tabButtonScales.overview }] }}>
// // //                 <TouchableOpacity
// // //                   style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
// // //                   onPress={() => setSelectedTab("overview")}
// // //                 >
// // //                   <LinearGradient
// // //                     colors={selectedTab === "overview" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.tabGradient}
// // //                   >
// // //                     <Ionicons 
// // //                       name="stats-chart" 
// // //                       size={14} 
// // //                       color={selectedTab === "overview" ? COLORS.surface : COLORS.primary} 
// // //                     />
// // //                     <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
// // //                       Overview
// // //                     </Text>
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </Animated.View>
              
// // //               <Animated.View style={{ transform: [{ scale: tabButtonScales.winners }] }}>
// // //                 <TouchableOpacity
// // //                   style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
// // //                   onPress={() => setSelectedTab("winners")}
// // //                 >
// // //                   <LinearGradient
// // //                     colors={selectedTab === "winners" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.tabGradient}
// // //                   >
// // //                     <Ionicons 
// // //                       name="trophy" 
// // //                       size={14} 
// // //                       color={selectedTab === "winners" ? COLORS.surface : COLORS.primary} 
// // //                     />
// // //                     <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
// // //                       Winners
// // //                     </Text>
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </Animated.View>
              
// // //               <Animated.View style={{ transform: [{ scale: tabButtonScales.mytickets }] }}>
// // //                 <TouchableOpacity
// // //                   style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
// // //                   onPress={() => setSelectedTab("mytickets")}
// // //                 >
// // //                   <LinearGradient
// // //                     colors={selectedTab === "mytickets" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.tabGradient}
// // //                   >
// // //                     <Ionicons 
// // //                       name="ticket" 
// // //                       size={14} 
// // //                       color={selectedTab === "mytickets" ? COLORS.surface : COLORS.primary} 
// // //                     />
// // //                     <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
// // //                       My Tickets
// // //                     </Text>
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </Animated.View>
              
// // //               <Animated.View style={{ transform: [{ scale: tabButtonScales.numbers }] }}>
// // //                 <TouchableOpacity
// // //                   style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
// // //                   onPress={() => setSelectedTab("numbers")}
// // //                 >
// // //                   <LinearGradient
// // //                     colors={selectedTab === "numbers" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// // //                     start={{ x: 0, y: 0 }}
// // //                     end={{ x: 1, y: 0 }}
// // //                     style={styles.tabGradient}
// // //                   >
// // //                     <Ionicons 
// // //                       name="grid" 
// // //                       size={14} 
// // //                       color={selectedTab === "numbers" ? COLORS.surface : COLORS.primary} 
// // //                     />
// // //                     <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
// // //                       Numbers
// // //                     </Text>
// // //                   </LinearGradient>
// // //                 </TouchableOpacity>
// // //               </Animated.View>
// // //             </ScrollView>
// // //           </View>

// // //           {/* Tab Content */}
// // //           {selectedTab === "overview" && <OverviewTab />}
// // //           {selectedTab === "winners" && <WinnersTab />}
// // //           {selectedTab === "mytickets" && <MyTicketsTab />}
// // //           {selectedTab === "numbers" && <CalledNumbersTab />}

// // //           <View style={styles.bottomSpace} />
// // //         </View>
// // //       </ScrollView>
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
// // //   },
// // //   // Background Patterns
// // //   backgroundPattern: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     zIndex: -1,
// // //     overflow: 'hidden',
// // //   },
// // //   pokerChip1: {
// // //     position: 'absolute',
// // //     top: 40,
// // //     left: width * 0.1,
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: COLORS.primary,
// // //     shadowColor: COLORS.primary,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   pokerChip2: {
// // //     position: 'absolute',
// // //     top: 80,
// // //     right: width * 0.15,
// // //     width: 30,
// // //     height: 30,
// // //     borderRadius: 15,
// // //     backgroundColor: COLORS.secondary,
// // //     shadowColor: COLORS.secondary,
// // //     shadowOffset: { width: 0, height: 3 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 6,
// // //     elevation: 5,
// // //   },
// // //   shineEffect: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     width: 100,
// // //     height: '100%',
// // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // //     transform: [{ skewX: '-20deg' }],
// // //   },
// // //   yellowGradient: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     height: 300,
// // //   },
// // //   blueGradient: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //     height: 200,
// // //   },
// // //   // Gold Coins
// // //   goldCoinsContainer: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     zIndex: 0,
// // //   },
// // //   goldCoin: {
// // //     position: 'absolute',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.5)',
// // //     shadowColor: COLORS.secondary,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 3,
// // //     elevation: 3,
// // //     overflow: 'hidden',
// // //   },
// // //   coinInner: {
// // //     position: 'absolute',
// // //     width: '70%',
// // //     height: '70%',
// // //     borderRadius: 50,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.3)',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.2)',
// // //   },
// // //   coinSymbol: {
// // //     color: COLORS.surface,
// // //     fontWeight: 'bold',
// // //     textShadowColor: 'rgba(0, 0, 0, 0.1)',
// // //     textShadowOffset: { width: 0, height: 1 },
// // //     textShadowRadius: 1,
// // //   },
// // //   // Header
// // //   header: {
// // //     paddingTop: 15,
// // //     paddingBottom: 15,
// // //     borderBottomLeftRadius: 25,
// // //     borderBottomRightRadius: 25,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     zIndex: 1,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   headerPattern: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //   },
// // //   headerShine: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     width: 100,
// // //     height: '100%',
// // //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// // //     transform: [{ skewX: '-20deg' }],
// // //   },
// // //   headerContent: {
// // //     paddingHorizontal: 16,
// // //   },
// // //   headerTop: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },
// // //   backButton: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 10,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 255, 255, 0.3)",
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //   },
// // //   cartoonTitleRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flexWrap: 'wrap',
// // //     marginBottom: 2,
// // //   },
// // //   cartoonLetter: {
// // //     fontSize: 28,
// // //     fontWeight: '900',
// // //     color: '#FDB800',
// // //     textTransform: 'uppercase',
// // //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// // //     textShadowOffset: { width: 3, height: 3 },
// // //     textShadowRadius: 8,
// // //     includeFontPadding: false,
// // //     marginHorizontal: 2,
// // //     ...Platform.select({
// // //       android: {
// // //         elevation: 5,
// // //         textShadowColor: '#FFB300',
// // //         textShadowOffset: { width: 2, height: 2 },
// // //         textShadowRadius: 6,
// // //       },
// // //     }),
// // //   },
// // //   specialCartoonLetter: {
// // //     fontSize: 32,
// // //     color: '#FFD700',
// // //     textShadowColor: '#FF8C00',
// // //     textShadowOffset: { width: 4, height: 4 },
// // //     textShadowRadius: 10,
// // //     marginHorizontal: 2,
// // //   },
// // //   gameInfoContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 5,
// // //   },
// // //   gameName: {
// // //     fontSize: 12,
// // //     color: "rgba(255,255,255,0.7)",
// // //     fontWeight: "500",
// // //     flex: 1,
// // //   },
// // //   content: {
// // //     padding: 16,
// // //   },
// // //   // Completion Banner
// // //   completionBanner: {
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   completionBannerContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 12,
// // //   },
// // //   completionIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   completionTextContainer: {
// // //     flex: 1,
// // //   },
// // //   completionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '800',
// // //     color: COLORS.textDark,
// // //     marginBottom: 4,
// // //   },
// // //   completionSubtitle: {
// // //     fontSize: 12,
// // //     color: COLORS.textLight,
// // //   },
// // //   // Tabs
// // //   tabsContainer: {
// // //     marginBottom: 16,
// // //   },
// // //   tabsScroll: {
// // //     flexGrow: 0,
// // //   },
// // //   tab: {
// // //     borderRadius: 20,
// // //     marginRight: 8,
// // //     overflow: 'hidden',
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   tabGradient: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     gap: 6,
// // //   },
// // //   activeTab: {
// // //     borderColor: COLORS.primary,
// // //   },
// // //   tabText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   activeTabText: {
// // //     color: COLORS.surface,
// // //   },
// // //   // Cards
// // //   card: {
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 2,
// // //     elevation: 2,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   cardTitleContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   cardIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   cardTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: COLORS.textDark,
// // //   },
// // //   tabContent: {
// // //     marginBottom: 16,
// // //   },
// // //   // Stats Grid
// // //   statsGrid: {
// // //     gap: 12,
// // //   },
// // //   statRow: {
// // //     flexDirection: 'row',
// // //     gap: 12,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     gap: 12,
// // //   },
// // //   statIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   statInfo: {
// // //     flex: 1,
// // //   },
// // //   statValue: {
// // //     fontSize: 16,
// // //     fontWeight: '800',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   statLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: '500',
// // //   },
// // //   // Winner Badge
// // //   winnerBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginTop: 16,
// // //     gap: 8,
// // //   },
// // //   winnerBadgeText: {
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //     color: COLORS.surface,
// // //   },
// // //   // Winners List
// // //   winnerCountBadge: {
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   winnerCount: {
// // //     fontSize: 12,
// // //     color: COLORS.textDark,
// // //     fontWeight: '600',
// // //   },
// // //   winnersList: {
// // //     gap: 10,
// // //   },
// // //   winnerItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   myWinnerItem: {
// // //     borderColor: COLORS.secondary,
// // //   },
// // //   winnerRank: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   winnerRankText: {
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //   },
// // //   winnerInfo: {
// // //     flex: 1,
// // //   },
// // //   winnerName: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   winnerPattern: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   winnerPrize: {
// // //     alignItems: 'center',
// // //   },
// // //   winnerPrizeAmount: {
// // //     fontSize: 15,
// // //     fontWeight: '700',
// // //     color: COLORS.secondary,
// // //     marginBottom: 2,
// // //   },
// // //   // Number Summary
// // //   numberSummary: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //   },
// // //   numberSummaryItem: {
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   numberSummaryValue: {
// // //     fontSize: 20,
// // //     fontWeight: '800',
// // //     color: COLORS.secondary,
// // //     marginBottom: 4,
// // //   },
// // //   numberSummaryLabel: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     fontWeight: '500',
// // //     textAlign: 'center',
// // //   },
// // //   numberSummaryDivider: {
// // //     width: 1,
// // //     height: 30,
// // //     backgroundColor: COLORS.border,
// // //   },
// // //   // All Winners List
// // //   allWinnersList: {
// // //     maxHeight: 300,
// // //   },
// // //   allWinnerItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 8,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: COLORS.border,
// // //     borderRadius: 8,
// // //   },
// // //   myAllWinnerItem: {
// // //     borderWidth: 1,
// // //     borderColor: COLORS.secondary,
// // //   },
// // //   allWinnerLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   allWinnerAvatar: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255,255,255,0.3)',
// // //   },
// // //   allWinnerAvatarText: {
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //     color: COLORS.surface,
// // //   },
// // //   allWinnerInfo: {
// // //     flex: 1,
// // //   },
// // //   allWinnerName: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   allWinnerPattern: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   allWinnerRight: {
// // //     alignItems: 'flex-end',
// // //   },
// // //   allWinnerAmount: {
// // //     fontSize: 14,
// // //     fontWeight: '700',
// // //     color: COLORS.secondary,
// // //     marginBottom: 2,
// // //   },
// // //   allWinnerTime: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //   },
// // //   // My Winnings
// // //   winningsTotal: {
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   winningsTotalText: {
// // //     fontSize: 13,
// // //     fontWeight: '700',
// // //     color: COLORS.surface,
// // //   },
// // //   myWinningsList: {
// // //     gap: 10,
// // //   },
// // //   winningItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   winningIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.primary,
// // //   },
// // //   winningInfo: {
// // //     flex: 1,
// // //   },
// // //   winningPattern: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //     marginBottom: 2,
// // //   },
// // //   winningTicket: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //     marginBottom: 2,
// // //   },
// // //   winningTime: {
// // //     fontSize: 10,
// // //     color: COLORS.textLight,
// // //   },
// // //   winningAmountContainer: {
// // //     alignItems: 'center',
// // //   },
// // //   winningAmount: {
// // //     fontSize: 15,
// // //     fontWeight: '800',
// // //     color: COLORS.secondary,
// // //   },
// // //   // My Tickets
// // //   ticketCountBadge: {
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   ticketCount: {
// // //     fontSize: 12,
// // //     color: COLORS.textDark,
// // //     fontWeight: '600',
// // //   },
// // //   myTicketsList: {
// // //     maxHeight: 500,
// // //   },
// // //   ticketItem: {
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   ticketHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   ticketNumberContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //   },
// // //   ticketNumberIcon: {
// // //     width: 24,
// // //     height: 24,
// // //     borderRadius: 6,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   ticketNumber: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   ticketStatus: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 10,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   ticketCompleted: {
// // //     borderColor: COLORS.success,
// // //   },
// // //   ticketIncomplete: {
// // //     borderColor: COLORS.primary,
// // //   },
// // //   ticketStatusText: {
// // //     fontSize: 11,
// // //     fontWeight: '700',
// // //   },
// // //   // Ticket Grid
// // //   ticketGridContainer: {
// // //     marginBottom: 10,
// // //   },
// // //   ticketRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     marginBottom: 4,
// // //   },
// // //   ticketCell: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: 6,
// // //     marginHorizontal: 2,
// // //     borderWidth: 1,
// // //   },
// // //   ticketCellEmpty: {
// // //     backgroundColor: 'rgba(0,0,0,0.03)',
// // //     borderColor: COLORS.border,
// // //   },
// // //   ticketCellFilled: {
// // //     backgroundColor: COLORS.primary + '20',
// // //     borderColor: COLORS.primary,
// // //   },
// // //   ticketCellMarked: {
// // //     backgroundColor: COLORS.red,
// // //     borderColor: '#C0392B',
// // //   },
// // //   ticketCellNumber: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   ticketCellNumberMarked: {
// // //     color: COLORS.surface,
// // //     fontWeight: '700',
// // //   },
// // //   ticketStats: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //   },
// // //   ticketStat: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //   },
// // //   ticketStatText: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   fullHouseBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 10,
// // //     gap: 4,
// // //   },
// // //   fullHouseBadgeText: {
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //     color: COLORS.surface,
// // //   },
// // //   // Called Numbers
// // //   calledCountBadge: {
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   calledCount: {
// // //     fontSize: 12,
// // //     color: COLORS.textDark,
// // //     fontWeight: '600',
// // //   },
// // //   numbersGridContainer: {
// // //     marginBottom: 16,
// // //   },
// // //   numberRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     marginBottom: 4,
// // //   },
// // //   numberCell: {
// // //     width: 28,
// // //     height: 28,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: 6,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //     marginHorizontal: 1,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //   },
// // //   calledNumberCell: {
// // //     borderColor: COLORS.success,
// // //   },
// // //   latestNumberCell: {
// // //     borderColor: COLORS.secondary,
// // //   },
// // //   numberCellText: {
// // //     fontSize: 11,
// // //     fontWeight: '600',
// // //     color: COLORS.textDark,
// // //   },
// // //   latestIndicator: {
// // //     position: 'absolute',
// // //     top: -2,
// // //     right: -2,
// // //     backgroundColor: COLORS.surface,
// // //     borderRadius: 4,
// // //     padding: 1,
// // //   },
// // //   legendContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     gap: 16,
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: COLORS.border,
// // //   },
// // //   legendItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //   },
// // //   legendColor: {
// // //     width: 12,
// // //     height: 12,
// // //     borderRadius: 3,
// // //     borderWidth: 1,
// // //     borderColor: COLORS.border,
// // //   },
// // //   legendNormal: {
// // //     backgroundColor: COLORS.surface,
// // //   },
// // //   legendCalled: {
// // //     backgroundColor: COLORS.success,
// // //   },
// // //   legendLatest: {
// // //     backgroundColor: COLORS.secondary,
// // //   },
// // //   legendText: {
// // //     fontSize: 11,
// // //     color: COLORS.textLight,
// // //   },
// // //   // Empty State
// // //   emptyState: {
// // //     alignItems: 'center',
// // //     padding: 24,
// // //   },
// // //   emptyStateText: {
// // //     fontSize: 14,
// // //     color: COLORS.textLight,
// // //     marginTop: 8,
// // //     textAlign: 'center',
// // //     fontWeight: '500',
// // //   },
// // //   // Loading
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   loadingText: {
// // //     fontSize: 16,
// // //     color: COLORS.surface,
// // //     marginTop: 12,
// // //     fontWeight: '500',
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // // });

// // // export default UserGameResult;






// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   SafeAreaView,
// //   StatusBar,
// //   Dimensions,
// //   RefreshControl,
// //   Animated,
// //   Easing,
// //   Platform,
// // } from "react-native";
// // import LinearGradient from 'react-native-linear-gradient';
// // import axios from "axios";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import FontAwesome from "react-native-vector-icons/FontAwesome";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import Feather from "react-native-vector-icons/Feather";
// // import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// // import { useNavigation } from '@react-navigation/native';

// // const { width, height } = Dimensions.get('window');

// // // Enhanced color scheme with gradients
// // const COLORS = {
// //   primary: "#4facfe",
// //   primaryGradient: ['#359df9', '#64d8f8'],
// //   secondary: "#FDB800",
// //   secondaryGradient: ['#FDB800', '#FF8C00'],
// //   background: "#f5f8ff",
// //   surface: "#FFFFFF",
// //   textDark: "#333333",
// //   textLight: "#777777",
// //   border: "#EEEEEE",
  
// //   // Status colors with gradients
// //   success: "#4CAF50",
// //   successGradient: ['#4CAF50', '#45a049'],
// //   error: "#E74C3C",
// //   errorGradient: ['#E74C3C', '#c0392b'],
// //   warning: "#ff9800",
// //   warningGradient: ['#ff9800', '#f57c00'],
  
// //   // Additional gradients
// //   prizeGradient: ['#4facfe20', '#00c6fb20'],
// //   winnerGradient: ['#4facfe10', '#9fcdff10'],
// //   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
// //   darkGlassGradient: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.02)'],
  
// //   // Individual colors with gradients
// //   purple: "#9B59B6",
// //   purpleGradient: ['#9B59B6', '#8E44AD'],
// //   orange: "#FF9800",
// //   orangeGradient: ['#FF9800', '#F57C00'],
// //   teal: "#4ECDC4",
// //   tealGradient: ['#4ECDC4', '#2AA7A0'],
// //   red: "#EF4444",
// //   redGradient: ['#EF4444', '#DC2626'],
// //   green: "#10B981",
// //   greenGradient: ['#10B981', '#059669'],
// // };

// // // Custom Loader Component with Fixed Animations
// // const CustomLoader = () => {
// //   // Animations
// //   const bounceAnim = useRef(new Animated.Value(0)).current;
// //   const dot1 = useRef(new Animated.Value(0)).current;
// //   const dot2 = useRef(new Animated.Value(0)).current;
// //   const dot3 = useRef(new Animated.Value(0)).current;
// //   const floatAnim = useRef(new Animated.Value(0)).current;
// //   const slideAnim = useRef(new Animated.Value(-width)).current;
// //   const fadeAnim = useRef(new Animated.Value(1)).current;

// //   // Dynamic messages
// //   const messages = [
// //     "Loading game results...",
// //     "Fetching winner details 🏆",
// //     "Calculating your winnings 💰",
// //     "Almost there...",
// //     "Getting results ready 📊",
// //     "Celebrating winners! 🎉"
// //   ];

// //   const [currentText, setCurrentText] = useState(0);
// //   const [animationLoop, setAnimationLoop] = useState(true);

// //   useEffect(() => {
// //     // Create animation loops with proper cleanup
// //     const animations = [];
    
// //     // Title bounce animation
// //     const bounceAnimation = Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(bounceAnim, {
// //           toValue: -8,
// //           duration: 600,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(bounceAnim, {
// //           toValue: 0,
// //           duration: 600,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     );
// //     animations.push(bounceAnimation);
// //     bounceAnimation.start();

// //     // Dots animation
// //     const animateDot = (dot, delay) => {
// //       return Animated.loop(
// //         Animated.sequence([
// //           Animated.timing(dot, {
// //             toValue: -10,
// //             duration: 300,
// //             delay,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(dot, {
// //             toValue: 0,
// //             duration: 300,
// //             useNativeDriver: true,
// //           }),
// //         ])
// //       );
// //     };

// //     const dot1Animation = animateDot(dot1, 0);
// //     const dot2Animation = animateDot(dot2, 150);
// //     const dot3Animation = animateDot(dot3, 300);
    
// //     animations.push(dot1Animation, dot2Animation, dot3Animation);
// //     dot1Animation.start();
// //     dot2Animation.start();
// //     dot3Animation.start();

// //     // Floating numbers animation
// //     const floatAnimation = Animated.loop(
// //       Animated.timing(floatAnim, {
// //         toValue: 1,
// //         duration: 4000,
// //         useNativeDriver: true,
// //       })
// //     );
// //     animations.push(floatAnimation);
// //     floatAnimation.start();

// //     // Ticket slide animation
// //     const slideAnimation = Animated.loop(
// //       Animated.timing(slideAnim, {
// //         toValue: width,
// //         duration: 4000,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     );
// //     animations.push(slideAnimation);
// //     slideAnimation.start();

// //     // Dynamic text change interval
// //     const textInterval = setInterval(() => {
// //       if (animationLoop) {
// //         Animated.timing(fadeAnim, {
// //           toValue: 0,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }).start(() => {
// //           setCurrentText((prev) => (prev + 1) % messages.length);
// //           Animated.timing(fadeAnim, {
// //             toValue: 1,
// //             duration: 300,
// //             useNativeDriver: true,
// //           }).start();
// //         });
// //       }
// //     }, 2500);

// //     // Cleanup function to stop all animations when component unmounts
// //     return () => {
// //       setAnimationLoop(false);
// //       clearInterval(textInterval);
// //       // Stop all animations
// //       animations.forEach(animation => {
// //         if (animation && typeof animation.stop === 'function') {
// //           animation.stop();
// //         }
// //       });
// //       // Reset all animated values
// //       bounceAnim.stopAnimation();
// //       dot1.stopAnimation();
// //       dot2.stopAnimation();
// //       dot3.stopAnimation();
// //       floatAnim.stopAnimation();
// //       slideAnim.stopAnimation();
// //       fadeAnim.stopAnimation();
// //     };
// //   }, []); // Empty dependency array ensures animations run once and continue

// //   const floatUp = floatAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -120],
// //   });

// //   // Reset slide animation when it reaches the end
// //   useEffect(() => {
// //     const listener = slideAnim.addListener(({ value }) => {
// //       if (value >= width) {
// //         slideAnim.setValue(-width);
// //       }
// //     });
    
// //     return () => {
// //       slideAnim.removeListener(listener);
// //     };
// //   }, [slideAnim, width]);

// //   return (
// //     <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
// //       {/* Floating Numbers */}
// //       <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>
// //         17
// //       </Animated.Text>

// //       <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>
// //         42
// //       </Animated.Text>

// //       {/* App Name */}
// //       <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>
// //         Houzie Timez
// //       </Animated.Text>

// //       {/* Loader Dots */}
// //       <View style={styles.loaderContainerDots}>
// //         <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
// //         <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
// //         <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
// //       </View>

// //       {/* Dynamic Subtitle */}
// //       <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
// //         {messages[currentText]}
// //       </Animated.Text>

// //       {/* Sliding Ticket */}
// //       <Animated.View
// //         style={[
// //           styles.ticketStrip,
// //           { transform: [{ translateX: slideAnim }] },
// //         ]}
// //       >
// //         <Text style={styles.ticketText}>🏆 Loading Results...</Text>
// //       </Animated.View>
// //     </LinearGradient>
// //   );
// // };

// // const UserGameResult = ({ route, navigation }) => {
// //   const { gameId, gameName } = route.params;
// //   const [loading, setLoading] = useState(true);
// //   const [initialLoading, setInitialLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [gameData, setGameData] = useState(null);
// //   const [myTickets, setMyTickets] = useState([]);
// //   const [myWinnings, setMyWinnings] = useState([]);
// //   const [allWinners, setAllWinners] = useState([]);
// //   const [gameStats, setGameStats] = useState(null);
// //   const [calledNumbers, setCalledNumbers] = useState([]);
// //   const [selectedTab, setSelectedTab] = useState("overview");

// //   // Animation values
// //   const floatAnim1 = useRef(new Animated.Value(0)).current;
// //   const floatAnim2 = useRef(new Animated.Value(0)).current;
// //   const pulseAnim = useRef(new Animated.Value(1)).current;
// //   const rotateAnim = useRef(new Animated.Value(0)).current;
// //   const shineAnim = useRef(new Animated.Value(0)).current;
  
// //   // Button animation refs
// //   const backButtonScale = useRef(new Animated.Value(1)).current;
// //   const tabButtonScales = useRef({
// //     overview: new Animated.Value(1),
// //     winners: new Animated.Value(1),
// //     mytickets: new Animated.Value(1),
// //     numbers: new Animated.Value(1),
// //   }).current;
  
// //   // Header letter animations
// //   const letterAnims = useRef([]);

// //   // Static coins in background (now with animation)
// //   const goldCoins = [
// //     { id: 1, top: '15%', left: '5%', size: 25 },
// //     { id: 2, top: '25%', left: '85%', size: 20 },
// //     { id: 3, top: '40%', left: '15%', size: 22 },
// //     { id: 4, top: '55%', left: '75%', size: 18 },
// //     { id: 5, top: '70%', left: '10%', size: 24 },
// //     { id: 6, top: '80%', left: '80%', size: 19 },
// //     { id: 7, top: '30%', left: '60%', size: 21 },
// //     { id: 8, top: '65%', left: '40%', size: 23 },
// //     { id: 9, top: '45%', left: '90%', size: 17 },
// //     { id: 10, top: '85%', left: '30%', size: 20 },
// //   ];

// //   useEffect(() => {
// //     // Initialize letter animations for header
// //     letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
// //     // Animate each letter with a popping effect
// //     letterAnims.current.forEach((anim, index) => {
// //       Animated.loop(
// //         Animated.sequence([
// //           Animated.delay(index * 80),
// //           Animated.timing(anim, {
// //             toValue: 1.4,
// //             duration: 300,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.timing(anim, {
// //             toValue: 1,
// //             duration: 200,
// //             useNativeDriver: true,
// //             easing: Easing.bounce,
// //           }),
// //           Animated.delay(1800),
// //         ])
// //       ).start();
// //     });

// //     startAnimations();
    
// //     // Start button animations
// //     startPulseAnimation(backButtonScale, 800);
// //     startPulseAnimation(tabButtonScales.overview, 800);
// //     startPulseAnimation(tabButtonScales.winners, 850);
// //     startPulseAnimation(tabButtonScales.mytickets, 900);
// //     startPulseAnimation(tabButtonScales.numbers, 950);

// //     fetchGameResults().finally(() => {
// //       setInitialLoading(false);
// //     });
// //   }, []);

// //   const startPulseAnimation = (anim, duration = 800) => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(anim, {
// //           toValue: 1.08,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         }),
// //         Animated.timing(anim, {
// //           toValue: 1,
// //           duration: duration,
// //           useNativeDriver: true,
// //           easing: Easing.inOut(Easing.ease)
// //         })
// //       ])
// //     ).start();
// //   };

// //   const startAnimations = () => {
// //     // Float animation 1
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim1, {
// //           toValue: 1,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim1, {
// //           toValue: 0,
// //           duration: 4000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Float animation 2
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatAnim2, {
// //           toValue: 1,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(floatAnim2, {
// //           toValue: 0,
// //           duration: 5000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Pulse animation
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(pulseAnim, {
// //           toValue: 1.02,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(pulseAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     // Rotate animation
// //     Animated.loop(
// //       Animated.timing(rotateAnim, {
// //         toValue: 1,
// //         duration: 20000,
// //         easing: Easing.linear,
// //         useNativeDriver: true,
// //       })
// //     ).start();

// //     // Shine animation
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(shineAnim, {
// //           toValue: 1,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(shineAnim, {
// //           toValue: 0,
// //           duration: 3000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   };

// //   const translateY1 = floatAnim1.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, 10]
// //   });

// //   const translateY2 = floatAnim2.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [0, -8]
// //   });

// //   const rotate = rotateAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '360deg']
// //   });

// //   const shineTranslateX = shineAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: [-100, width + 100]
// //   });

// //   const fetchGameResults = async () => {
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
// //       const response = await axios.get(
// //         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             Accept: "application/json",
// //           },
// //         }
// //       );

// //       if (response.data.status) {
// //         const data = response.data.data;
// //         setGameData(data);
        
// //         // Set tickets
// //         if (data.my_tickets_complete_data) {
// //           setMyTickets(data.my_tickets_complete_data);
// //         }
        
// //         // Set my winnings
// //         if (data.my_participation?.winning_patterns) {
// //           setMyWinnings(data.my_participation.winning_patterns);
// //         }
        
// //         // Set all winners
// //         if (data.all_game_winners?.winners_list) {
// //           setAllWinners(data.all_game_winners.winners_list);
// //         }
        
// //         // Set game stats
// //         if (data.game_statistics) {
// //           setGameStats(data.game_statistics);
// //         }
        
// //         // Set called numbers
// //         if (data.number_calling_history?.called_numbers) {
// //           setCalledNumbers(data.number_calling_history.called_numbers);
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Error fetching game results:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     setRefreshing(true);
// //     fetchGameResults().finally(() => setRefreshing(false));
// //   }, []);

// //   const renderTicketGrid = (ticketData) => {
// //     const TICKET_WIDTH = width - 64;
// //     const CELL_SIZE = Math.max(24, Math.min((TICKET_WIDTH - 40) / 9, 28));
    
// //     const processTicketData = (data) => {
// //       if (!data || !Array.isArray(data)) return Array(3).fill(Array(9).fill(null));
      
// //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// //       data.forEach((row, rowIndex) => {
// //         row.forEach((cell) => {
// //           if (cell && cell.number !== null && cell.column !== undefined) {
// //             processedGrid[rowIndex][cell.column] = cell;
// //           }
// //         });
// //       });
      
// //       return processedGrid;
// //     };

// //     const processedData = processTicketData(ticketData);

// //     return (
// //       <View style={[styles.ticketGridContainer, { height: CELL_SIZE * 3 + 8 }]}>
// //         {processedData.map((row, rowIndex) => (
// //           <View key={`row-${rowIndex}`} style={styles.ticketRow}>
// //             {row.map((cell, colIndex) => {
// //               const cellObj = cell;
// //               const cellNumber = cellObj?.number;
// //               const isMarked = cellObj?.is_marked || false;
// //               const isEmpty = cellNumber === null || cellNumber === undefined;
              
// //               return (
// //                 <View
// //                   key={`cell-${rowIndex}-${colIndex}`}
// //                   style={[
// //                     styles.ticketCell,
// //                     { 
// //                       width: CELL_SIZE,
// //                       height: CELL_SIZE,
// //                     },
// //                     isEmpty ? styles.ticketCellEmpty : styles.ticketCellFilled,
// //                     isMarked && styles.ticketCellMarked,
// //                   ]}
// //                 >
// //                   {!isEmpty && (
// //                     <Text style={[
// //                       styles.ticketCellNumber,
// //                       isMarked && styles.ticketCellNumberMarked
// //                     ]}>
// //                       {cellNumber}
// //                     </Text>
// //                   )}
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         ))}
// //       </View>
// //     );
// //   };

// //   const renderBackgroundPattern = () => (
// //     <View style={styles.backgroundPattern}>
// //       {/* Animated poker chips */}
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip1, 
// //           { 
// //             transform: [
// //               { translateY: translateY1 },
// //               { translateX: translateY2 },
// //               { rotate }
// //             ] 
// //           }
// //         ]} 
// //       />
// //       <Animated.View 
// //         style={[
// //           styles.pokerChip2, 
// //           { 
// //             transform: [
// //               { translateY: translateY2 },
// //               { translateX: translateY1 },
// //               { rotate: rotateAnim.interpolate({
// //                 inputRange: [0, 1],
// //                 outputRange: ['0deg', '-360deg']
// //               }) }
// //             ] 
// //           }
// //         ]} 
// //       />
      
// //       {/* Animated shine effect */}
// //       <Animated.View 
// //         style={[
// //           styles.shineEffect,
// //           { 
// //             transform: [{ translateX: shineTranslateX }],
// //             opacity: shineAnim
// //           }
// //         ]} 
// //       />
      
// //       {/* Gradient overlays */}
// //       <LinearGradient
// //         colors={['rgba(255,152,0,0.05)', 'transparent']}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 0, y: 1 }}
// //         style={styles.yellowGradient}
// //       />
// //       <LinearGradient
// //         colors={['transparent', 'rgba(79,172,254,0.05)']}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 0, y: 1 }}
// //         style={styles.blueGradient}
// //       />
// //     </View>
// //   );

// //   // Cartoon-style header with popping letters
// //   const Header = () => {
// //     const letters = [
// //       { char: 'R', index: 0 },
// //       { char: 'E', index: 1 },
// //       { char: 'S', index: 2 },
// //       { char: 'U', index: 3 },
// //       { char: 'L', index: 4 },
// //       { char: 'T', index: 5 },
// //       { char: 'S', index: 6, isSpecial: true },
// //     ];

// //     return (
// //       <LinearGradient
// //         colors={COLORS.primaryGradient}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 0 }}
// //         style={styles.header}
// //       >
// //         <View style={styles.headerPattern}>
// //           <Animated.View 
// //             style={[
// //               styles.headerShine,
// //               { transform: [{ translateX: shineTranslateX }] }
// //             ]} 
// //           />
// //         </View>
        
// //         <View style={styles.headerContent}>
// //           <View style={styles.headerTop}>
// //             <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
// //               <TouchableOpacity
// //                 style={styles.backButton}
// //                 onPress={() => navigation.goBack()}
// //               >
// //                 <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
// //               </TouchableOpacity>
// //             </Animated.View>
            
// //             <View style={styles.headerTextContainer}>
// //               <View style={styles.cartoonTitleRow}>
// //                 {letters.map((item) => (
// //                   <Animated.Text
// //                     key={item.index}
// //                     style={[
// //                       styles.cartoonLetter,
// //                       item.isSpecial && styles.specialCartoonLetter,
// //                       { 
// //                         transform: [{ scale: letterAnims.current[item.index] || 1 }],
// //                       }
// //                     ]}
// //                   >
// //                     {item.char}
// //                   </Animated.Text>
// //                 ))}
// //               </View>
// //               <View style={styles.gameInfoContainer}>
// //                 <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
// //                 <Text style={styles.gameName} numberOfLines={1}>
// //                   {gameName || "Tambola Game"}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>
// //       </LinearGradient>
// //     );
// //   };

// //   const OverviewTab = () => (
// //     <View style={styles.tabContent}>
// //       {/* Game Stats - 2x2 Grid */}
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="chart-line" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>Game Statistics</Text>
// //           </View>
// //         </View>
        
// //         {gameStats && (
// //           <View style={styles.statsGrid}>
// //             <View style={styles.statRow}>
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="account-group" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameStats.participant_statistics?.total_participants || 0}</Text>
// //                   <Text style={styles.statLabel}>Participants</Text>
// //                 </View>
// //               </LinearGradient>
              
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameStats.ticket_statistics?.allocated_tickets || 0}</Text>
// //                   <Text style={styles.statLabel}>Tickets Sold</Text>
// //                 </View>
// //               </LinearGradient>
// //             </View>
            
// //             <View style={styles.statRow}>
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="trophy" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameStats.winner_statistics?.total_winners || 0}</Text>
// //                   <Text style={styles.statLabel}>Winners</Text>
// //                 </View>
// //               </LinearGradient>
              
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="currency-inr" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>₹{gameStats.winner_statistics?.total_winnings_distributed || 0}</Text>
// //                   <Text style={styles.statLabel}>Total Winnings</Text>
// //                 </View>
// //               </LinearGradient>
// //             </View>
// //           </View>
// //         )}
// //       </LinearGradient>

// //       {/* My Performance - 2x2 Grid */}
// //       {gameData?.my_participation && (
// //         <LinearGradient
// //           colors={[COLORS.surface, COLORS.surface]}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.card}
// //         >
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.cardIcon}
// //               >
// //                 <MaterialCommunityIcons name="medal" size={16} color={COLORS.primary} />
// //               </LinearGradient>
// //               <Text style={styles.cardTitle}>My Performance</Text>
// //             </View>
// //           </View>
          
// //           <View style={styles.statsGrid}>
// //             <View style={styles.statRow}>
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="ticket-confirmation" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameData.my_participation.tickets_count || 0}</Text>
// //                   <Text style={styles.statLabel}>My Tickets</Text>
// //                 </View>
// //               </LinearGradient>
              
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.green} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameData.my_participation.claims_summary?.approved_claims || 0}</Text>
// //                   <Text style={styles.statLabel}>Approved</Text>
// //                 </View>
// //               </LinearGradient>
// //             </View>
            
// //             <View style={styles.statRow}>
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="currency-inr" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>₹{gameData.my_participation.total_winnings || 0}</Text>
// //                   <Text style={styles.statLabel}>My Winnings</Text>
// //                 </View>
// //               </LinearGradient>
              
// //               <LinearGradient
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.statCard}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.statIcon}
// //                 >
// //                   <MaterialCommunityIcons name="trophy" size={20} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.statInfo}>
// //                   <Text style={styles.statValue}>{gameData.my_participation.winning_patterns?.length || 0}</Text>
// //                   <Text style={styles.statLabel}>Patterns Won</Text>
// //                 </View>
// //               </LinearGradient>
// //             </View>
// //           </View>
          
// //           {gameData.my_participation.won_this_game && (
// //             <LinearGradient
// //               colors={COLORS.warningGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 0 }}
// //               style={styles.winnerBadge}
// //             >
// //               <MaterialCommunityIcons name="trophy" size={16} color={COLORS.surface} />
// //               <Text style={styles.winnerBadgeText}>YOU WON IN THIS GAME! 🎉</Text>
// //             </LinearGradient>
// //           )}
// //         </LinearGradient>
// //       )}

// //       {/* Number Calling Summary */}
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="numeric" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>Number Calling Summary</Text>
// //           </View>
// //         </View>
        
// //         <View style={styles.numberSummary}>
// //           <View style={styles.numberSummaryItem}>
// //             <Text style={styles.numberSummaryValue}>{calledNumbers.length}</Text>
// //             <Text style={styles.numberSummaryLabel}>Numbers Called</Text>
// //           </View>
          
// //           <View style={styles.numberSummaryDivider} />
          
// //           <View style={styles.numberSummaryItem}>
// //             <Text style={styles.numberSummaryValue}>{90 - calledNumbers.length}</Text>
// //             <Text style={styles.numberSummaryLabel}>Numbers Left</Text>
// //           </View>
          
// //           <View style={styles.numberSummaryDivider} />
          
// //           <View style={styles.numberSummaryItem}>
// //             <Text style={styles.numberSummaryValue}>
// //               {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : 'N/A'}
// //             </Text>
// //             <Text style={styles.numberSummaryLabel}>Last Number</Text>
// //           </View>
// //         </View>
// //       </LinearGradient>
// //     </View>
// //   );

// //   const WinnersTab = () => (
// //     <View style={styles.tabContent}>
// //       {/* Top Winners */}
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="crown" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>Top Winners</Text>
// //           </View>
// //           <LinearGradient
// //             colors={COLORS.prizeGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.winnerCountBadge}
// //           >
// //             <Text style={styles.winnerCount}>
// //               {gameData?.all_game_winners?.total_winners || 0} Winners
// //             </Text>
// //           </LinearGradient>
// //         </View>
        
// //         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
// //           <View style={styles.winnersList}>
// //             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
// //               <LinearGradient
// //                 key={index}
// //                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 0 }}
// //                 style={[
// //                   styles.winnerItem,
// //                   winner.is_me && styles.myWinnerItem
// //                 ]}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={[styles.winnerRank, { backgroundColor: COLORS.primary + '20' }]}
// //                 >
// //                   <Text style={[styles.winnerRankText, { color: COLORS.primary }]}>#{index + 1}</Text>
// //                 </LinearGradient>
                
// //                 <View style={styles.winnerInfo}>
// //                   <Text style={[
// //                     styles.winnerName,
// //                     winner.is_me && { color: COLORS.surface }
// //                   ]}>
// //                     {winner.winner_name}
// //                     {winner.is_me && " (You)"}
// //                   </Text>
// //                   <Text style={[
// //                     styles.winnerPattern,
// //                     winner.is_me && { color: COLORS.surface + 'CC' }
// //                   ]}>{winner.pattern_name}</Text>
// //                 </View>
                
// //                 <View style={styles.winnerPrize}>
// //                   <Text style={[
// //                     styles.winnerPrizeAmount,
// //                     winner.is_me && { color: COLORS.surface }
// //                   ]}>₹{winner.winning_amount}</Text>
// //                   {index === 0 && (
// //                     <MaterialCommunityIcons name="trophy" size={12} color={winner.is_me ? COLORS.surface : COLORS.secondary} />
// //                   )}
// //                 </View>
// //               </LinearGradient>
// //             ))}
// //           </View>
// //         ) : (
// //           <View style={styles.emptyState}>
// //             <MaterialCommunityIcons name="trophy-outline" size={40} color={COLORS.textLight} />
// //             <Text style={styles.emptyStateText}>No winners data available</Text>
// //           </View>
// //         )}
// //       </LinearGradient>

// //       {/* All Winners List */}
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="format-list-bulleted" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>All Winners</Text>
// //           </View>
// //         </View>
        
// //         {allWinners.length > 0 ? (
// //           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
// //             {allWinners.map((winner, index) => (
// //               <LinearGradient
// //                 key={index}
// //                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 0 }}
// //                 style={[
// //                   styles.allWinnerItem,
// //                   winner.is_me && styles.myAllWinnerItem
// //                 ]}
// //               >
// //                 <View style={styles.allWinnerLeft}>
// //                   <LinearGradient
// //                     colors={COLORS.primaryGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 1 }}
// //                     style={styles.allWinnerAvatar}
// //                   >
// //                     <Text style={styles.allWinnerAvatarText}>
// //                       {winner.winner_name?.charAt(0).toUpperCase() || 'U'}
// //                     </Text>
// //                   </LinearGradient>
// //                   <View style={styles.allWinnerInfo}>
// //                     <Text style={[
// //                       styles.allWinnerName,
// //                       winner.is_me && { color: COLORS.surface }
// //                     ]}>
// //                       {winner.winner_name}
// //                       {winner.is_me && " (You)"}
// //                     </Text>
// //                     <Text style={[
// //                       styles.allWinnerPattern,
// //                       winner.is_me && { color: COLORS.surface + 'CC' }
// //                     ]}>{winner.reward_name}</Text>
// //                   </View>
// //                 </View>
                
// //                 <View style={styles.allWinnerRight}>
// //                   <Text style={[
// //                     styles.allWinnerAmount,
// //                     winner.is_me && { color: COLORS.surface }
// //                   ]}>₹{winner.winning_amount}</Text>
// //                   <Text style={[
// //                     styles.allWinnerTime,
// //                     winner.is_me && { color: COLORS.surface + 'CC' }
// //                   ]}>
// //                     {new Date(winner.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// //                   </Text>
// //                 </View>
// //               </LinearGradient>
// //             ))}
// //           </ScrollView>
// //         ) : (
// //           <View style={styles.emptyState}>
// //             <MaterialCommunityIcons name="account-group-outline" size={40} color={COLORS.textLight} />
// //             <Text style={styles.emptyStateText}>No winners found</Text>
// //           </View>
// //         )}
// //       </LinearGradient>
// //     </View>
// //   );

// //   const MyTicketsTab = () => (
// //     <View style={styles.tabContent}>
// //       {/* My Winnings Summary */}
// //       {myWinnings.length > 0 && (
// //         <LinearGradient
// //           colors={[COLORS.surface, COLORS.surface]}
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.card}
// //         >
// //           <View style={styles.cardHeader}>
// //             <View style={styles.cardTitleContainer}>
// //               <LinearGradient
// //                 colors={COLORS.prizeGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.cardIcon}
// //               >
// //                 <MaterialCommunityIcons name="trophy" size={16} color={COLORS.primary} />
// //               </LinearGradient>
// //               <Text style={styles.cardTitle}>My Winnings</Text>
// //             </View>
// //             <LinearGradient
// //               colors={COLORS.primaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.winningsTotal}
// //             >
// //               <Text style={styles.winningsTotalText}>
// //                 ₹{gameData?.my_participation?.total_winnings || 0}
// //               </Text>
// //             </LinearGradient>
// //           </View>
          
// //           <View style={styles.myWinningsList}>
// //             {myWinnings.map((winning, index) => (
// //               <LinearGradient
// //                 key={index}
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.winningItem}
// //               >
// //                 <LinearGradient
// //                   colors={COLORS.prizeGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                   style={styles.winningIcon}
// //                 >
// //                   <MaterialCommunityIcons name="trophy" size={18} color={COLORS.primary} />
// //                 </LinearGradient>
// //                 <View style={styles.winningInfo}>
// //                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
// //                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
// //                   <Text style={styles.winningTime}>
// //                     {new Date(winning.approved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
// //                   </Text>
// //                 </View>
// //                 <View style={styles.winningAmountContainer}>
// //                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
// //                 </View>
// //               </LinearGradient>
// //             ))}
// //           </View>
// //         </LinearGradient>
// //       )}

// //       {/* My Tickets */}
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="ticket-confirmation" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>My Tickets</Text>
// //           </View>
// //           <LinearGradient
// //             colors={COLORS.prizeGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.ticketCountBadge}
// //           >
// //             <Text style={styles.ticketCount}>
// //               {myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}
// //             </Text>
// //           </LinearGradient>
// //         </View>
        
// //         {myTickets.length > 0 ? (
// //           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
// //             {myTickets.map((ticket, index) => (
// //               <LinearGradient
// //                 key={index}
// //                 colors={COLORS.winnerGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.ticketItem}
// //               >
// //                 <View style={styles.ticketHeader}>
// //                   <View style={styles.ticketNumberContainer}>
// //                     <LinearGradient
// //                       colors={COLORS.prizeGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 1 }}
// //                       style={styles.ticketNumberIcon}
// //                     >
// //                       <MaterialCommunityIcons name="ticket-confirmation" size={14} color={COLORS.primary} />
// //                     </LinearGradient>
// //                     <Text style={styles.ticketNumber}>Ticket #{ticket.ticket_number}</Text>
// //                   </View>
// //                   <LinearGradient
// //                     colors={ticket.is_completed ? COLORS.successGradient : COLORS.prizeGradient}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={[
// //                       styles.ticketStatus,
// //                       ticket.is_completed ? styles.ticketCompleted : styles.ticketIncomplete
// //                     ]}
// //                   >
// //                     <Text style={[
// //                       styles.ticketStatusText,
// //                       ticket.is_completed ? { color: COLORS.surface } : { color: COLORS.primary }
// //                     ]}>
// //                       {ticket.is_completed ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}
// //                     </Text>
// //                   </LinearGradient>
// //                 </View>
                
// //                 {/* Ticket Grid */}
// //                 {renderTicketGrid(ticket.ticket_data)}
                
// //                 <View style={styles.ticketStats}>
// //                   <View style={styles.ticketStat}>
// //                     <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />
// //                     <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
// //                   </View>
// //                   <View style={styles.ticketStat}>
// //                     <Ionicons name="close-circle" size={12} color={COLORS.red} />
// //                     <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
// //                   </View>
// //                   {ticket.marked_numbers_count === 15 && (
// //                     <LinearGradient
// //                       colors={COLORS.warningGradient}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 0 }}
// //                       style={styles.fullHouseBadge}
// //                     >
// //                       <MaterialCommunityIcons name="trophy" size={12} color={COLORS.surface} />
// //                       <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
// //                     </LinearGradient>
// //                   )}
// //                 </View>
// //               </LinearGradient>
// //             ))}
// //           </ScrollView>
// //         ) : (
// //           <View style={styles.emptyState}>
// //             <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textLight} />
// //             <Text style={styles.emptyStateText}>No tickets found</Text>
// //           </View>
// //         )}
// //       </LinearGradient>
// //     </View>
// //   );

// //   const CalledNumbersTab = () => (
// //     <View style={styles.tabContent}>
// //       <LinearGradient
// //         colors={[COLORS.surface, COLORS.surface]}
// //         start={{ x: 0, y: 0 }}
// //         end={{ x: 1, y: 1 }}
// //         style={styles.card}
// //       >
// //         <View style={styles.cardHeader}>
// //           <View style={styles.cardTitleContainer}>
// //             <LinearGradient
// //               colors={COLORS.prizeGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={styles.cardIcon}
// //             >
// //               <MaterialCommunityIcons name="grid" size={16} color={COLORS.primary} />
// //             </LinearGradient>
// //             <Text style={styles.cardTitle}>Called Numbers</Text>
// //           </View>
// //           <LinearGradient
// //             colors={COLORS.prizeGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.calledCountBadge}
// //           >
// //             <Text style={styles.calledCount}>
// //               {calledNumbers.length}/90
// //             </Text>
// //           </LinearGradient>
// //         </View>
        
// //         {calledNumbers.length > 0 ? (
// //           <View style={styles.numbersGridContainer}>
// //             {Array.from({ length: 9 }, (_, row) => (
// //               <View key={row} style={styles.numberRow}>
// //                 {Array.from({ length: 10 }, (_, col) => {
// //                   const number = row * 10 + col + 1;
// //                   const isCalled = calledNumbers.includes(number);
// //                   const isLatest = calledNumbers.length > 0 && 
// //                     number === calledNumbers[calledNumbers.length - 1];
                  
// //                   return (
// //                     <LinearGradient
// //                       key={number}
// //                       colors={isLatest ? COLORS.secondaryGradient : 
// //                              isCalled ? COLORS.successGradient : 
// //                              [COLORS.surface, COLORS.surface]}
// //                       start={{ x: 0, y: 0 }}
// //                       end={{ x: 1, y: 1 }}
// //                       style={[
// //                         styles.numberCell,
// //                         isCalled && styles.calledNumberCell,
// //                         isLatest && styles.latestNumberCell,
// //                       ]}
// //                     >
// //                       <Text style={[
// //                         styles.numberCellText,
// //                         (isCalled || isLatest) && { color: COLORS.surface }
// //                       ]}>
// //                         {number}
// //                       </Text>
// //                       {isLatest && (
// //                         <View style={styles.latestIndicator}>
// //                           <MaterialCommunityIcons name="star" size={6} color={COLORS.surface} />
// //                         </View>
// //                       )}
// //                     </LinearGradient>
// //                   );
// //                 })}
// //               </View>
// //             ))}
// //           </View>
// //         ) : (
// //           <View style={styles.emptyState}>
// //             <MaterialCommunityIcons name="numeric-off" size={40} color={COLORS.textLight} />
// //             <Text style={styles.emptyStateText}>No numbers called</Text>
// //           </View>
// //         )}
        
// //         <View style={styles.legendContainer}>
// //           <View style={styles.legendItem}>
// //             <View style={[styles.legendColor, styles.legendNormal]} />
// //             <Text style={styles.legendText}>Not Called</Text>
// //           </View>
// //           <View style={styles.legendItem}>
// //             <LinearGradient
// //               colors={COLORS.successGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={[styles.legendColor, styles.legendCalled]}
// //             />
// //             <Text style={styles.legendText}>Called</Text>
// //           </View>
// //           <View style={styles.legendItem}>
// //             <LinearGradient
// //               colors={COLORS.secondaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={[styles.legendColor, styles.legendLatest]}
// //             />
// //             <Text style={styles.legendText}>Latest</Text>
// //           </View>
// //         </View>
// //       </LinearGradient>
// //     </View>
// //   );

// //   if (initialLoading) {
// //     return (
// //       <SafeAreaView style={styles.safeArea}>
// //         <CustomLoader />
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
// //       {renderBackgroundPattern()}
      
// //       {/* Animated Coins Background */}
// //       <View style={styles.goldCoinsContainer}>
// //         {goldCoins.map((coin) => (
// //           <Animated.View
// //             key={coin.id}
// //             style={[
// //               styles.goldCoin,
// //               {
// //                 top: coin.top,
// //                 left: coin.left,
// //                 width: coin.size,
// //                 height: coin.size,
// //                 borderRadius: coin.size / 2,
// //                 transform: [
// //                   { translateY: coin.id % 2 === 0 ? translateY1 : translateY2 },
// //                   { rotate: rotate }
// //                 ]
// //               }
// //             ]}
// //           >
// //             <LinearGradient
// //               colors={COLORS.secondaryGradient}
// //               start={{ x: 0, y: 0 }}
// //               end={{ x: 1, y: 1 }}
// //               style={[StyleSheet.absoluteFill, { borderRadius: coin.size / 2 }]}
// //             />
// //             <View style={styles.coinInner} />
// //             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
// //           </Animated.View>
// //         ))}
// //       </View>

// //       <Header />

// //       <ScrollView
// //         style={styles.container}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             tintColor={COLORS.primary}
// //             colors={[COLORS.primary]}
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <View style={styles.content}>
// //           {/* Game Completion Banner */}
// //           <LinearGradient
// //             colors={COLORS.winnerGradient}
// //             start={{ x: 0, y: 0 }}
// //             end={{ x: 1, y: 1 }}
// //             style={styles.completionBanner}
// //           >
// //             <View style={styles.completionBannerContent}>
// //               <LinearGradient
// //                 colors={COLORS.warningGradient}
// //                 start={{ x: 0, y: 0 }}
// //                 end={{ x: 1, y: 1 }}
// //                 style={styles.completionIcon}
// //               >
// //                 <MaterialCommunityIcons name="party-popper" size={24} color={COLORS.surface} />
// //               </LinearGradient>
// //               <View style={styles.completionTextContainer}>
// //                 <Text style={styles.completionTitle}>Game Completed!</Text>
// //                 <Text style={styles.completionSubtitle}>
// //                   All {calledNumbers.length} numbers have been called
// //                 </Text>
// //               </View>
// //             </View>
// //           </LinearGradient>

// //           {/* Tabs */}
// //           <View style={styles.tabsContainer}>
// //             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
// //               <Animated.View style={{ transform: [{ scale: tabButtonScales.overview }] }}>
// //                 <TouchableOpacity
// //                   style={[styles.tab, selectedTab === "overview" && styles.activeTab]}
// //                   onPress={() => setSelectedTab("overview")}
// //                 >
// //                   <LinearGradient
// //                     colors={selectedTab === "overview" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.tabGradient}
// //                   >
// //                     <Ionicons 
// //                       name="stats-chart" 
// //                       size={14} 
// //                       color={selectedTab === "overview" ? COLORS.surface : COLORS.primary} 
// //                     />
// //                     <Text style={[styles.tabText, selectedTab === "overview" && styles.activeTabText]}>
// //                       Overview
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </Animated.View>
              
// //               <Animated.View style={{ transform: [{ scale: tabButtonScales.winners }] }}>
// //                 <TouchableOpacity
// //                   style={[styles.tab, selectedTab === "winners" && styles.activeTab]}
// //                   onPress={() => setSelectedTab("winners")}
// //                 >
// //                   <LinearGradient
// //                     colors={selectedTab === "winners" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.tabGradient}
// //                   >
// //                     <Ionicons 
// //                       name="trophy" 
// //                       size={14} 
// //                       color={selectedTab === "winners" ? COLORS.surface : COLORS.primary} 
// //                     />
// //                     <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>
// //                       Winners
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </Animated.View>
              
// //               <Animated.View style={{ transform: [{ scale: tabButtonScales.mytickets }] }}>
// //                 <TouchableOpacity
// //                   style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]}
// //                   onPress={() => setSelectedTab("mytickets")}
// //                 >
// //                   <LinearGradient
// //                     colors={selectedTab === "mytickets" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.tabGradient}
// //                   >
// //                     <Ionicons 
// //                       name="ticket" 
// //                       size={14} 
// //                       color={selectedTab === "mytickets" ? COLORS.surface : COLORS.primary} 
// //                     />
// //                     <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>
// //                       My Tickets
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </Animated.View>
              
// //               <Animated.View style={{ transform: [{ scale: tabButtonScales.numbers }] }}>
// //                 <TouchableOpacity
// //                   style={[styles.tab, selectedTab === "numbers" && styles.activeTab]}
// //                   onPress={() => setSelectedTab("numbers")}
// //                 >
// //                   <LinearGradient
// //                     colors={selectedTab === "numbers" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]}
// //                     start={{ x: 0, y: 0 }}
// //                     end={{ x: 1, y: 0 }}
// //                     style={styles.tabGradient}
// //                   >
// //                     <Ionicons 
// //                       name="grid" 
// //                       size={14} 
// //                       color={selectedTab === "numbers" ? COLORS.surface : COLORS.primary} 
// //                     />
// //                     <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>
// //                       Numbers
// //                     </Text>
// //                   </LinearGradient>
// //                 </TouchableOpacity>
// //               </Animated.View>
// //             </ScrollView>
// //           </View>

// //           {/* Tab Content */}
// //           {selectedTab === "overview" && <OverviewTab />}
// //           {selectedTab === "winners" && <WinnersTab />}
// //           {selectedTab === "mytickets" && <MyTicketsTab />}
// //           {selectedTab === "numbers" && <CalledNumbersTab />}

// //           <View style={styles.bottomSpace} />
// //         </View>
// //       </ScrollView>
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
// //   },
  
// //   // Loader Styles
// //   loaderContainer: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   title: {
// //     fontSize: 36,
// //     fontWeight: '900',
// //     color: '#fff',
// //     letterSpacing: 2,
// //     marginBottom: 20,
// //   },

// //   loaderContainerDots: {
// //     flexDirection: 'row',
// //     marginBottom: 15,
// //   },

// //   dot: {
// //     width: 12,
// //     height: 12,
// //     backgroundColor: '#fff',
// //     borderRadius: 6,
// //     marginHorizontal: 5,
// //   },

// //   subtitle: {
// //     fontSize: 16,
// //     color: '#fff',
// //     fontWeight: '600',
// //     marginTop: 5,
// //   },

// //   number: {
// //     position: 'absolute',
// //     left: 30,
// //     bottom: 0,
// //     fontSize: 28,
// //     color: '#fff',
// //     opacity: 0.5,
// //     fontWeight: 'bold',
// //   },

// //   number2: {
// //     position: 'absolute',
// //     right: 30,
// //     bottom: 0,
// //     fontSize: 28,
// //     color: '#fff',
// //     opacity: 0.5,
// //     fontWeight: 'bold',
// //   },

// //   ticketStrip: {
// //     position: 'absolute',
// //     bottom: 60,
// //     backgroundColor: '#ffffff90',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 20,
// //   },

// //   ticketText: {
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },

// //   // Rest of your existing styles remain the same
// //   backgroundPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: -1,
// //     overflow: 'hidden',
// //   },
// //   pokerChip1: {
// //     position: 'absolute',
// //     top: 40,
// //     left: width * 0.1,
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: COLORS.primary,
// //     shadowColor: COLORS.primary,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   pokerChip2: {
// //     position: 'absolute',
// //     top: 80,
// //     right: width * 0.15,
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     backgroundColor: COLORS.secondary,
// //     shadowColor: COLORS.secondary,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 6,
// //     elevation: 5,
// //   },
// //   shineEffect: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   yellowGradient: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     height: 300,
// //   },
// //   blueGradient: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     height: 200,
// //   },
// //   // Gold Coins
// //   goldCoinsContainer: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     zIndex: 0,
// //   },
// //   goldCoin: {
// //     position: 'absolute',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.5)',
// //     shadowColor: COLORS.secondary,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 3,
// //     elevation: 3,
// //     overflow: 'hidden',
// //   },
// //   coinInner: {
// //     position: 'absolute',
// //     width: '70%',
// //     height: '70%',
// //     borderRadius: 50,
// //     backgroundColor: 'rgba(255, 255, 255, 0.3)',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.2)',
// //   },
// //   coinSymbol: {
// //     color: COLORS.surface,
// //     fontWeight: 'bold',
// //     textShadowColor: 'rgba(0, 0, 0, 0.1)',
// //     textShadowOffset: { width: 0, height: 1 },
// //     textShadowRadius: 1,
// //   },
// //   // Header
// //   header: {
// //     paddingTop: 15,
// //     paddingBottom: 15,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     zIndex: 1,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   headerPattern: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //   },
// //   headerShine: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     width: 100,
// //     height: '100%',
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     transform: [{ skewX: '-20deg' }],
// //   },
// //   headerContent: {
// //     paddingHorizontal: 16,
// //   },
// //   headerTop: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   backButton: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 10,
// //     borderWidth: 1,
// //     borderColor: "rgba(255, 255, 255, 0.3)",
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //   },
// //   cartoonTitleRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //     marginBottom: 2,
// //   },
// //   cartoonLetter: {
// //     fontSize: 28,
// //     fontWeight: '900',
// //     color: '#FDB800',
// //     textTransform: 'uppercase',
// //     textShadowColor: 'rgba(255, 193, 7, 0.5)',
// //     textShadowOffset: { width: 3, height: 3 },
// //     textShadowRadius: 8,
// //     includeFontPadding: false,
// //     marginHorizontal: 2,
// //     ...Platform.select({
// //       android: {
// //         elevation: 5,
// //         textShadowColor: '#FFB300',
// //         textShadowOffset: { width: 2, height: 2 },
// //         textShadowRadius: 6,
// //       },
// //     }),
// //   },
// //   specialCartoonLetter: {
// //     fontSize: 32,
// //     color: '#FFD700',
// //     textShadowColor: '#FF8C00',
// //     textShadowOffset: { width: 4, height: 4 },
// //     textShadowRadius: 10,
// //     marginHorizontal: 2,
// //   },
// //   gameInfoContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 5,
// //   },
// //   gameName: {
// //     fontSize: 12,
// //     color: "rgba(255,255,255,0.7)",
// //     fontWeight: "500",
// //     flex: 1,
// //   },
// //   content: {
// //     padding: 16,
// //   },
// //   // Completion Banner
// //   completionBanner: {
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   completionBannerContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   completionIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   completionTextContainer: {
// //     flex: 1,
// //   },
// //   completionTitle: {
// //     fontSize: 16,
// //     fontWeight: '800',
// //     color: COLORS.textDark,
// //     marginBottom: 4,
// //   },
// //   completionSubtitle: {
// //     fontSize: 12,
// //     color: COLORS.textLight,
// //   },
// //   // Tabs
// //   tabsContainer: {
// //     marginBottom: 16,
// //   },
// //   tabsScroll: {
// //     flexGrow: 0,
// //   },
// //   tab: {
// //     borderRadius: 20,
// //     marginRight: 8,
// //     overflow: 'hidden',
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   tabGradient: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     gap: 6,
// //   },
// //   activeTab: {
// //     borderColor: COLORS.primary,
// //   },
// //   tabText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   activeTabText: {
// //     color: COLORS.surface,
// //   },
// //   // Cards
// //   card: {
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   cardTitleContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   cardIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   cardTitle: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: COLORS.textDark,
// //   },
// //   tabContent: {
// //     marginBottom: 16,
// //   },
// //   // Stats Grid
// //   statsGrid: {
// //     gap: 12,
// //   },
// //   statRow: {
// //     flexDirection: 'row',
// //     gap: 12,
// //   },
// //   statCard: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     gap: 12,
// //   },
// //   statIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: COLORS.primary,
// //   },
// //   statInfo: {
// //     flex: 1,
// //   },
// //   statValue: {
// //     fontSize: 16,
// //     fontWeight: '800',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: '500',
// //   },
// //   // Winner Badge
// //   winnerBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: 12,
// //     borderRadius: 10,
// //     marginTop: 16,
// //     gap: 8,
// //   },
// //   winnerBadgeText: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: COLORS.surface,
// //   },
// //   // Winners List
// //   winnerCountBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   winnerCount: {
// //     fontSize: 12,
// //     color: COLORS.textDark,
// //     fontWeight: '600',
// //   },
// //   winnersList: {
// //     gap: 10,
// //   },
// //   winnerItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   myWinnerItem: {
// //     borderColor: COLORS.secondary,
// //   },
// //   winnerRank: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.primary,
// //   },
// //   winnerRankText: {
// //     fontSize: 12,
// //     fontWeight: '700',
// //   },
// //   winnerInfo: {
// //     flex: 1,
// //   },
// //   winnerName: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   winnerPattern: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   winnerPrize: {
// //     alignItems: 'center',
// //   },
// //   winnerPrizeAmount: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //     color: COLORS.secondary,
// //     marginBottom: 2,
// //   },
// //   // Number Summary
// //   numberSummary: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   numberSummaryItem: {
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   numberSummaryValue: {
// //     fontSize: 20,
// //     fontWeight: '800',
// //     color: COLORS.secondary,
// //     marginBottom: 4,
// //   },
// //   numberSummaryLabel: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     fontWeight: '500',
// //     textAlign: 'center',
// //   },
// //   numberSummaryDivider: {
// //     width: 1,
// //     height: 30,
// //     backgroundColor: COLORS.border,
// //   },
// //   // All Winners List
// //   allWinnersList: {
// //     maxHeight: 300,
// //   },
// //   allWinnerItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     paddingHorizontal: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: COLORS.border,
// //     borderRadius: 8,
// //   },
// //   myAllWinnerItem: {
// //     borderWidth: 1,
// //     borderColor: COLORS.secondary,
// //   },
// //   allWinnerLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   allWinnerAvatar: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: 'rgba(255,255,255,0.3)',
// //   },
// //   allWinnerAvatarText: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: COLORS.surface,
// //   },
// //   allWinnerInfo: {
// //     flex: 1,
// //   },
// //   allWinnerName: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   allWinnerPattern: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   allWinnerRight: {
// //     alignItems: 'flex-end',
// //   },
// //   allWinnerAmount: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: COLORS.secondary,
// //     marginBottom: 2,
// //   },
// //   allWinnerTime: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   // My Winnings
// //   winningsTotal: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   winningsTotalText: {
// //     fontSize: 13,
// //     fontWeight: '700',
// //     color: COLORS.surface,
// //   },
// //   myWinningsList: {
// //     gap: 10,
// //   },
// //   winningItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   winningIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.primary,
// //   },
// //   winningInfo: {
// //     flex: 1,
// //   },
// //   winningPattern: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //     marginBottom: 2,
// //   },
// //   winningTicket: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //     marginBottom: 2,
// //   },
// //   winningTime: {
// //     fontSize: 10,
// //     color: COLORS.textLight,
// //   },
// //   winningAmountContainer: {
// //     alignItems: 'center',
// //   },
// //   winningAmount: {
// //     fontSize: 15,
// //     fontWeight: '800',
// //     color: COLORS.secondary,
// //   },
// //   // My Tickets
// //   ticketCountBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   ticketCount: {
// //     fontSize: 12,
// //     color: COLORS.textDark,
// //     fontWeight: '600',
// //   },
// //   myTicketsList: {
// //     maxHeight: 500,
// //   },
// //   ticketItem: {
// //     padding: 12,
// //     borderRadius: 12,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   ticketHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   ticketNumberContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   ticketNumberIcon: {
// //     width: 24,
// //     height: 24,
// //     borderRadius: 6,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   ticketNumber: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   ticketStatus: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   ticketCompleted: {
// //     borderColor: COLORS.success,
// //   },
// //   ticketIncomplete: {
// //     borderColor: COLORS.primary,
// //   },
// //   ticketStatusText: {
// //     fontSize: 11,
// //     fontWeight: '700',
// //   },
// //   // Ticket Grid
// //   ticketGridContainer: {
// //     marginBottom: 10,
// //   },
// //   ticketRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 4,
// //   },
// //   ticketCell: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 6,
// //     marginHorizontal: 2,
// //     borderWidth: 1,
// //   },
// //   ticketCellEmpty: {
// //     backgroundColor: 'rgba(0,0,0,0.03)',
// //     borderColor: COLORS.border,
// //   },
// //   ticketCellFilled: {
// //     backgroundColor: COLORS.primary + '20',
// //     borderColor: COLORS.primary,
// //   },
// //   ticketCellMarked: {
// //     backgroundColor: COLORS.red,
// //     borderColor: '#C0392B',
// //   },
// //   ticketCellNumber: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   ticketCellNumberMarked: {
// //     color: COLORS.surface,
// //     fontWeight: '700',
// //   },
// //   ticketStats: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   ticketStat: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //   },
// //   ticketStatText: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   fullHouseBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 10,
// //     gap: 4,
// //   },
// //   fullHouseBadgeText: {
// //     fontSize: 10,
// //     fontWeight: '700',
// //     color: COLORS.surface,
// //   },
// //   // Called Numbers
// //   calledCountBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   calledCount: {
// //     fontSize: 12,
// //     color: COLORS.textDark,
// //     fontWeight: '600',
// //   },
// //   numbersGridContainer: {
// //     marginBottom: 16,
// //   },
// //   numberRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginBottom: 4,
// //   },
// //   numberCell: {
// //     width: 28,
// //     height: 28,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 6,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //     marginHorizontal: 1,
// //     position: 'relative',
// //     overflow: 'hidden',
// //   },
// //   calledNumberCell: {
// //     borderColor: COLORS.success,
// //   },
// //   latestNumberCell: {
// //     borderColor: COLORS.secondary,
// //   },
// //   numberCellText: {
// //     fontSize: 11,
// //     fontWeight: '600',
// //     color: COLORS.textDark,
// //   },
// //   latestIndicator: {
// //     position: 'absolute',
// //     top: -2,
// //     right: -2,
// //     backgroundColor: COLORS.surface,
// //     borderRadius: 4,
// //     padding: 1,
// //   },
// //   legendContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     gap: 16,
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: COLORS.border,
// //   },
// //   legendItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   legendColor: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 3,
// //     borderWidth: 1,
// //     borderColor: COLORS.border,
// //   },
// //   legendNormal: {
// //     backgroundColor: COLORS.surface,
// //   },
// //   legendCalled: {
// //     backgroundColor: COLORS.success,
// //   },
// //   legendLatest: {
// //     backgroundColor: COLORS.secondary,
// //   },
// //   legendText: {
// //     fontSize: 11,
// //     color: COLORS.textLight,
// //   },
// //   // Empty State
// //   emptyState: {
// //     alignItems: 'center',
// //     padding: 24,
// //   },
// //   emptyStateText: {
// //     fontSize: 14,
// //     color: COLORS.textLight,
// //     marginTop: 8,
// //     textAlign: 'center',
// //     fontWeight: '500',
// //   },
// //   // Loading
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     color: COLORS.surface,
// //     marginTop: 12,
// //     fontWeight: '500',
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// // });

// // export default UserGameResult;













// import React, { useState, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   RefreshControl,
//   Animated,
//   Easing,
//   Platform,
//   Modal,
// } from "react-native";
// import LinearGradient from 'react-native-linear-gradient';
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// const { width: SCREEN_WIDTH, height } = Dimensions.get('window');

// // Optimized ticket dimensions - reduced internal cell size
// const TICKET_PADDING = 8;
// const CELL_MARGIN = 1.5;
// const NUM_COLUMNS = 9;

// // Enhanced color scheme
// const COLORS = {
//   primary: "#4facfe",
//   primaryGradient: ['#359df9', '#64d8f8'],
//   secondary: "#FDB800",
//   secondaryGradient: ['#FDB800', '#FF8C00'],
//   ticketBorder: "#fcca26",
//   background: "#f5f8ff",
//   surface: "#FFFFFF",
//   textDark: "#333333",
//   textLight: "#777777",
//   border: "#EEEEEE",
//   success: "#4CAF50",
//   successGradient: ['#4CAF50', '#45a049'],
//   error: "#E74C3C",
//   warning: "#ff9800",
//   warningGradient: ['#ff9800', '#f57c00'],
//   prizeGradient: ['#4facfe20', '#00c6fb20'],
//   winnerGradient: ['#4facfe10', '#9fcdff10'],
//   glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
//   red: "#EF4444",
//   green: "#10B981",
// };

// // Row colors
// const ROW_COLOR_1 = "#f0f8ff";
// const ROW_COLOR_2 = "#e6f3ff";
// const FILLED_CELL_BG = "#62cff4";
// const NUMBER_COLOR = COLORS.surface;

// // Custom Loader
// const CustomLoader = () => {
//   const bounceAnim = useRef(new Animated.Value(0)).current;
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;
//   const floatAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
//   const fadeAnim = useRef(new Animated.Value(1)).current;

//   const messages = [
//     "Loading game results...",
//     "Fetching winner details 🏆",
//     "Calculating your winnings 💰",
//     "Almost there...",
//     "Getting results ready 📊",
//     "Celebrating winners! 🎉"
//   ];

//   const [currentText, setCurrentText] = useState(0);
//   const [animationLoop, setAnimationLoop] = useState(true);

//   useEffect(() => {
//     const animations = [];
    
//     const bounceAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(bounceAnim, { toValue: -8, duration: 600, useNativeDriver: true }),
//         Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
//       ])
//     );
//     animations.push(bounceAnimation);
//     bounceAnimation.start();

//     const animateDot = (dot, delay) => {
//       return Animated.loop(
//         Animated.sequence([
//           Animated.timing(dot, { toValue: -10, duration: 300, delay, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
//         ])
//       );
//     };

//     const dot1Animation = animateDot(dot1, 0);
//     const dot2Animation = animateDot(dot2, 150);
//     const dot3Animation = animateDot(dot3, 300);
    
//     animations.push(dot1Animation, dot2Animation, dot3Animation);
//     dot1Animation.start();
//     dot2Animation.start();
//     dot3Animation.start();

//     const floatAnimation = Animated.loop(
//       Animated.timing(floatAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
//     );
//     animations.push(floatAnimation);
//     floatAnimation.start();

//     const slideAnimation = Animated.loop(
//       Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 4000, easing: Easing.linear, useNativeDriver: true })
//     );
//     animations.push(slideAnimation);
//     slideAnimation.start();

//     const textInterval = setInterval(() => {
//       if (animationLoop) {
//         Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
//           setCurrentText((prev) => (prev + 1) % messages.length);
//           Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
//         });
//       }
//     }, 2500);

//     return () => {
//       setAnimationLoop(false);
//       clearInterval(textInterval);
//       animations.forEach(animation => {
//         if (animation && typeof animation.stop === 'function') animation.stop();
//       });
//       bounceAnim.stopAnimation();
//       dot1.stopAnimation();
//       dot2.stopAnimation();
//       dot3.stopAnimation();
//       floatAnim.stopAnimation();
//       slideAnim.stopAnimation();
//       fadeAnim.stopAnimation();
//     };
//   }, []);

//   const floatUp = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });

//   useEffect(() => {
//     const listener = slideAnim.addListener(({ value }) => {
//       if (value >= SCREEN_WIDTH) slideAnim.setValue(-SCREEN_WIDTH);
//     });
//     return () => slideAnim.removeListener(listener);
//   }, [slideAnim]);

//   return (
//     <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
//       <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>17</Animated.Text>
//       <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>42</Animated.Text>
//       <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>Houzie Timez</Animated.Text>
//       <View style={styles.loaderContainerDots}>
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
//         <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
//       </View>
//       <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>{messages[currentText]}</Animated.Text>
//       <Animated.View style={[styles.ticketStrip, { transform: [{ translateX: slideAnim }] }]}>
//         <Text style={styles.ticketText}>🏆 Loading Results...</Text>
//       </Animated.View>
//     </LinearGradient>
//   );
// };

// const UserGameResult = ({ route, navigation }) => {
//   const { gameId, gameName } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [gameData, setGameData] = useState(null);
//   const [myTickets, setMyTickets] = useState([]);
//   const [myWinnings, setMyWinnings] = useState([]);
//   const [allWinners, setAllWinners] = useState([]);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [selectedTab, setSelectedTab] = useState("winners");
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
  
//   // Store cell width for consistent sizing
//   const [cellWidth, setCellWidth] = useState(0);
//   const [ticketContainerWidth, setTicketContainerWidth] = useState(SCREEN_WIDTH - 24);

//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const shineAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
  
//   const backButtonScale = useRef(new Animated.Value(1)).current;
//   const tabButtonScales = useRef({
//     winners: new Animated.Value(1),
//     mytickets: new Animated.Value(1),
//     numbers: new Animated.Value(1),
//   }).current;
//   const closeButtonScale = useRef(new Animated.Value(1)).current;
//   const letterAnims = useRef([]);

//   const goldCoins = [
//     { id: 1, top: '15%', left: '5%', size: 25 },
//     { id: 2, top: '25%', left: '85%', size: 20 },
//     { id: 3, top: '40%', left: '15%', size: 22 },
//     { id: 4, top: '55%', left: '75%', size: 18 },
//     { id: 5, top: '70%', left: '10%', size: 24 },
//     { id: 6, top: '80%', left: '80%', size: 19 },
//     { id: 7, top: '30%', left: '60%', size: 21 },
//     { id: 8, top: '65%', left: '40%', size: 23 },
//     { id: 9, top: '45%', left: '90%', size: 17 },
//     { id: 10, top: '85%', left: '30%', size: 20 },
//   ];

//   // Calculate cell width based on container width
//   const calculateCellWidth = (containerWidth) => {
//     const availableWidth = containerWidth - (TICKET_PADDING * 2);
//     const totalMarginWidth = (CELL_MARGIN * 2) * NUM_COLUMNS;
//     const calculatedWidth = (availableWidth - totalMarginWidth) / NUM_COLUMNS;
//     return Math.max(28, Math.min(calculatedWidth, 35)); // Limit cell size between 28-35
//   };

//   useEffect(() => {
//     if (ticketContainerWidth > 0) {
//       const newCellWidth = calculateCellWidth(ticketContainerWidth);
//       setCellWidth(newCellWidth);
//     }
//   }, [ticketContainerWidth]);

//   useEffect(() => {
//     letterAnims.current = Array(18).fill().map(() => new Animated.Value(1));
    
//     letterAnims.current.forEach((anim, index) => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(index * 80),
//           Animated.timing(anim, { toValue: 1.4, duration: 300, useNativeDriver: true, easing: Easing.bounce }),
//           Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true, easing: Easing.bounce }),
//           Animated.delay(1800),
//         ])
//       ).start();
//     });

//     startAnimations();
    
//     startPulseAnimation(backButtonScale, 800);
//     startPulseAnimation(tabButtonScales.winners, 850);
//     startPulseAnimation(tabButtonScales.mytickets, 900);
//     startPulseAnimation(tabButtonScales.numbers, 950);
//     startPulseAnimation(closeButtonScale, 800);

//     fetchGameResults().finally(() => {
//       setInitialLoading(false);
//       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
//     });
//   }, []);

//   const startPulseAnimation = (anim, duration = 800) => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(anim, { toValue: 1.08, duration: duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
//         Animated.timing(anim, { toValue: 1, duration: duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
//       ])
//     ).start();
//   };

//   const startAnimations = () => {
//     Animated.loop(Animated.sequence([
//       Animated.timing(floatAnim1, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//       Animated.timing(floatAnim1, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//     ])).start();

//     Animated.loop(Animated.sequence([
//       Animated.timing(floatAnim2, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//       Animated.timing(floatAnim2, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//     ])).start();

//     Animated.loop(Animated.sequence([
//       Animated.timing(pulseAnim, { toValue: 1.02, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//       Animated.timing(pulseAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//     ])).start();

//     Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();

//     Animated.loop(Animated.sequence([
//       Animated.timing(shineAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//       Animated.timing(shineAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//     ])).start();
//   };

//   const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
//   const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
//   const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
//   const shineTranslateX = shineAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, SCREEN_WIDTH + 100] });

//   const fetchGameResults = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
//         { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
//       );

//       if (response.data.status) {
//         const data = response.data.data;
//         setGameData(data);
        
//         if (data.my_tickets_complete_data) setMyTickets(data.my_tickets_complete_data);
//         if (data.my_participation?.winning_patterns) setMyWinnings(data.my_participation.winning_patterns);
//         if (data.all_game_winners?.winners_list) setAllWinners(data.all_game_winners.winners_list);
//         if (data.number_calling_history?.called_numbers) setCalledNumbers(data.number_calling_history.called_numbers);
//       }
//     } catch (error) {
//       console.log("Error fetching game results:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchGameResults().finally(() => setRefreshing(false));
//   }, []);

//   const processTicketData = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill().map(() => Array(9).fill(null));
    
//     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
//       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
//       ticketData.forEach((row) => {
//         row.forEach((cell) => {
//           if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
//             processedGrid[cell.row][cell.column] = cell.number;
//           }
//         });
//       });
//       return processedGrid;
//     } else if (ticketData[0] && Array.isArray(ticketData[0])) {
//       return ticketData.map(row => row.map(cell => cell));
//     }
//     return Array(3).fill().map(() => Array(9).fill(null));
//   };

//   const renderTicketGrid = (ticketData, isModal = false) => {
//     const processedData = processTicketData(ticketData);
//     const currentCellWidth = cellWidth > 0 ? cellWidth : 32;
    
//     return (
//       <View 
//         style={[styles.ticketCard, { width: '100%' }]}
//         onLayout={(event) => {
//           if (!isModal) {
//             const { width } = event.nativeEvent.layout;
//             if (width !== ticketContainerWidth) {
//               setTicketContainerWidth(width);
//             }
//           }
//         }}
//       >
//         <LinearGradient
//           colors={COLORS.prizeGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.ticketPattern}
//         />
        
//         {processedData.map((row, rowIndex) => (
//           <View 
//             key={`row-${rowIndex}`} 
//             style={[
//               styles.ticketRow,
//               { backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2 }
//             ]}
//           >
//             {row.map((cell, colIndex) => {
//               const isEmpty = cell === null;
//               return (
//                 <View
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.ticketCell,
//                     { 
//                       width: currentCellWidth,
//                       height: currentCellWidth,
//                       marginHorizontal: CELL_MARGIN,
//                       marginVertical: CELL_MARGIN,
//                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
//                     },
//                   ]}
//                 >
//                   {!isEmpty && (
//                     <Text style={[styles.ticketCellNumber, { fontSize: Math.min(currentCellWidth * 0.4, 12) }]}>
//                       {cell}
//                     </Text>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderBackgroundPattern = () => (
//     <View style={styles.backgroundPattern}>
//       <Animated.View style={[styles.pokerChip1, { transform: [{ translateY: translateY1 }, { translateX: translateY2 }, { rotate }] }]} />
//       <Animated.View style={[styles.pokerChip2, { transform: [{ translateY: translateY2 }, { translateX: translateY1 }, { rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) }] }]} />
//       <Animated.View style={[styles.shineEffect, { transform: [{ translateX: shineTranslateX }], opacity: shineAnim }]} />
//       <LinearGradient colors={['rgba(255,152,0,0.05)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.yellowGradient} />
//       <LinearGradient colors={['transparent', 'rgba(79,172,254,0.05)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.blueGradient} />
//     </View>
//   );

//   const Header = () => {
//     const letters = [
//       { char: 'R', index: 0 }, { char: 'E', index: 1 }, { char: 'S', index: 2 },
//       { char: 'U', index: 3 }, { char: 'L', index: 4 }, { char: 'T', index: 5 },
//       { char: 'S', index: 6, isSpecial: true },
//     ];

//     return (
//       <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
//         <View style={styles.headerPattern}>
//           <Animated.View style={[styles.headerShine, { transform: [{ translateX: shineTranslateX }] }]} />
//         </View>
//         <View style={styles.headerContent}>
//           <View style={styles.headerTop}>
//             <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
//               <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                 <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
//               </TouchableOpacity>
//             </Animated.View>
//             <View style={styles.headerTextContainer}>
//               <View style={styles.cartoonTitleRow}>
//                 {letters.map((item) => (
//                   <Animated.Text
//                     key={item.index}
//                     style={[styles.cartoonLetter, item.isSpecial && styles.specialCartoonLetter, { transform: [{ scale: letterAnims.current[item.index] || 1 }] }]}
//                   >
//                     {item.char}
//                   </Animated.Text>
//                 ))}
//               </View>
//               <View style={styles.gameInfoContainer}>
//                 <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
//                 <Text style={styles.gameName} numberOfLines={1}>{gameName || "Tambola Game"}</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </LinearGradient>
//     );
//   };

//   const WinnersTab = () => (
//     <View style={styles.tabContent}>
//       <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
//               <MaterialCommunityIcons name="crown" size={16} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.cardTitle}>Top Winners</Text>
//           </View>
//           <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winnerCountBadge}>
//             <Text style={styles.winnerCount}>{gameData?.all_game_winners?.total_winners || 0} Winners</Text>
//           </LinearGradient>
//         </View>
        
//         {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
//           <View style={styles.winnersList}>
//             {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
//               <LinearGradient
//                 key={index}
//                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={[styles.winnerItem, winner.is_me && styles.myWinnerItem]}
//               >
//                 <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.winnerRank, { backgroundColor: COLORS.primary + '20' }]}>
//                   <Text style={[styles.winnerRankText, { color: COLORS.primary }]}>#{index + 1}</Text>
//                 </LinearGradient>
//                 <View style={styles.winnerInfo}>
//                   <Text style={[styles.winnerName, winner.is_me && { color: COLORS.surface }]}>
//                     {winner.winner_name}{winner.is_me && " (You)"}
//                   </Text>
//                   <Text style={[styles.winnerPattern, winner.is_me && { color: COLORS.surface + 'CC' }]}>{winner.pattern_name}</Text>
//                 </View>
//                 <View style={styles.winnerPrize}>
//                   <Text style={[styles.winnerPrizeAmount, winner.is_me && { color: COLORS.surface }]}>₹{winner.winning_amount}</Text>
//                   {index === 0 && <MaterialCommunityIcons name="trophy" size={12} color={winner.is_me ? COLORS.surface : COLORS.secondary} />}
//                 </View>
//               </LinearGradient>
//             ))}
//           </View>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="trophy-outline" size={40} color={COLORS.textLight} />
//             <Text style={styles.emptyStateText}>No winners data available</Text>
//           </View>
//         )}
//       </LinearGradient>

//       <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
//               <MaterialCommunityIcons name="format-list-bulleted" size={16} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.cardTitle}>All Winners</Text>
//           </View>
//         </View>
        
//         {allWinners.length > 0 ? (
//           <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
//             {allWinners.map((winner, index) => (
//               <LinearGradient
//                 key={index}
//                 colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={[styles.allWinnerItem, winner.is_me && styles.myAllWinnerItem]}
//               >
//                 <View style={styles.allWinnerLeft}>
//                   <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.allWinnerAvatar}>
//                     <Text style={styles.allWinnerAvatarText}>{winner.winner_name?.charAt(0).toUpperCase() || 'U'}</Text>
//                   </LinearGradient>
//                   <View style={styles.allWinnerInfo}>
//                     <Text style={[styles.allWinnerName, winner.is_me && { color: COLORS.surface }]}>
//                       {winner.winner_name}{winner.is_me && " (You)"}
//                     </Text>
//                     <Text style={[styles.allWinnerPattern, winner.is_me && { color: COLORS.surface + 'CC' }]}>{winner.reward_name}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.allWinnerRight}>
//                   <Text style={[styles.allWinnerAmount, winner.is_me && { color: COLORS.surface }]}>₹{winner.winning_amount}</Text>
//                   <Text style={[styles.allWinnerTime, winner.is_me && { color: COLORS.surface + 'CC' }]}>
//                     {new Date(winner.approved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                 </View>
//               </LinearGradient>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="account-group-outline" size={40} color={COLORS.textLight} />
//             <Text style={styles.emptyStateText}>No winners found</Text>
//           </View>
//         )}
//       </LinearGradient>
//     </View>
//   );

//   const MyTicketsTab = () => (
//     <View style={styles.tabContent}>
//       {myWinnings.length > 0 && (
//         <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardTitleContainer}>
//               <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
//                 <MaterialCommunityIcons name="trophy" size={16} color={COLORS.primary} />
//               </LinearGradient>
//               <Text style={styles.cardTitle}>My Winnings</Text>
//             </View>
//             <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningsTotal}>
//               <Text style={styles.winningsTotalText}>₹{gameData?.my_participation?.total_winnings || 0}</Text>
//             </LinearGradient>
//           </View>
          
//           <View style={styles.myWinningsList}>
//             {myWinnings.map((winning, index) => (
//               <LinearGradient key={index} colors={COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningItem}>
//                 <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningIcon}>
//                   <MaterialCommunityIcons name="trophy" size={18} color={COLORS.primary} />
//                 </LinearGradient>
//                 <View style={styles.winningInfo}>
//                   <Text style={styles.winningPattern}>{winning.reward_name}</Text>
//                   <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
//                   <Text style={styles.winningTime}>
//                     {new Date(winning.approved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </Text>
//                 </View>
//                 <View style={styles.winningAmountContainer}>
//                   <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
//                 </View>
//               </LinearGradient>
//             ))}
//           </View>
//         </LinearGradient>
//       )}

//       <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
//               <MaterialCommunityIcons name="ticket-confirmation" size={16} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.cardTitle}>My Tickets</Text>
//           </View>
//           <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketCountBadge}>
//             <Text style={styles.ticketCount}>{myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}</Text>
//           </LinearGradient>
//         </View>
        
//         {myTickets.length > 0 ? (
//           <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
//             {myTickets.map((ticket, index) => {
//               const isCompleted = ticket.marked_numbers_count === 15;
              
//               return (
//                 <View key={index} style={styles.ticketItemContainer}>
//                   <View style={styles.ticketHeaderOutside}>
//                     <Text style={styles.ticketNo}>Ticket No: #{ticket.ticket_number}</Text>
//                     <LinearGradient
//                       colors={isCompleted ? COLORS.successGradient : COLORS.prizeGradient}
//                       start={{ x: 0, y: 0 }}
//                       end={{ x: 1, y: 0 }}
//                       style={styles.statusBadge}
//                     >
//                       <Ionicons name={isCompleted ? "checkmark-circle" : "time-outline"} size={12} color={COLORS.surface} />
//                       <Text style={styles.statusText}>{isCompleted ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}</Text>
//                     </LinearGradient>
//                   </View>
                  
//                   <TouchableOpacity 
//                     onPress={() => { setSelectedTicket(ticket); setModalVisible(true); }} 
//                     activeOpacity={0.9}
//                     style={styles.ticketTouchable}
//                   >
//                     {renderTicketGrid(ticket.ticket_data)}
//                   </TouchableOpacity>
                  
//                   <View style={styles.ticketStatsFooter}>
//                     <View style={styles.ticketStat}>
//                       <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />
//                       <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
//                     </View>
//                     <View style={styles.ticketStat}>
//                       <Ionicons name="close-circle" size={12} color={COLORS.red} />
//                       <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
//                     </View>
//                     {isCompleted && (
//                       <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.fullHouseBadge}>
//                         <MaterialCommunityIcons name="trophy" size={12} color={COLORS.surface} />
//                         <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
//                       </LinearGradient>
//                     )}
//                   </View>
//                 </View>
//               );
//             })}
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textLight} />
//             <Text style={styles.emptyStateText}>No tickets found</Text>
//           </View>
//         )}
//       </LinearGradient>
//     </View>
//   );

//   const CalledNumbersTab = () => (
//     <View style={styles.tabContent}>
//       <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.cardTitleContainer}>
//             <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
//               <MaterialCommunityIcons name="grid" size={16} color={COLORS.primary} />
//             </LinearGradient>
//             <Text style={styles.cardTitle}>Called Numbers</Text>
//           </View>
//           <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.calledCountBadge}>
//             <Text style={styles.calledCount}>{calledNumbers.length}/90</Text>
//           </LinearGradient>
//         </View>
        
//         {calledNumbers.length > 0 ? (
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View>
//               {Array.from({ length: 9 }, (_, row) => (
//                 <View key={row} style={styles.numberRow}>
//                   {Array.from({ length: 10 }, (_, col) => {
//                     const number = row * 10 + col + 1;
//                     const isCalled = calledNumbers.includes(number);
//                     const isLatest = calledNumbers.length > 0 && number === calledNumbers[calledNumbers.length - 1];
                    
//                     return (
//                       <LinearGradient
//                         key={number}
//                         colors={isLatest ? COLORS.secondaryGradient : isCalled ? COLORS.successGradient : [COLORS.surface, COLORS.surface]}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={[styles.numberCell, isCalled && styles.calledNumberCell, isLatest && styles.latestNumberCell]}
//                       >
//                         <Text style={[styles.numberCellText, (isCalled || isLatest) && { color: COLORS.surface }]}>{number}</Text>
//                         {isLatest && (
//                           <View style={styles.latestIndicator}>
//                             <MaterialCommunityIcons name="star" size={6} color={COLORS.surface} />
//                           </View>
//                         )}
//                       </LinearGradient>
//                     );
//                   })}
//                 </View>
//               ))}
//             </View>
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <MaterialCommunityIcons name="numeric-off" size={40} color={COLORS.textLight} />
//             <Text style={styles.emptyStateText}>No numbers called</Text>
//           </View>
//         )}
        
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendColor, styles.legendNormal]} />
//             <Text style={styles.legendText}>Not Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <LinearGradient colors={COLORS.successGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendCalled]} />
//             <Text style={styles.legendText}>Called</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <LinearGradient colors={COLORS.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendLatest]} />
//             <Text style={styles.legendText}>Latest</Text>
//           </View>
//         </View>
//       </LinearGradient>
//     </View>
//   );

//   if (initialLoading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <CustomLoader />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
//       {renderBackgroundPattern()}
      
//       <View style={styles.goldCoinsContainer}>
//         {goldCoins.map((coin) => (
//           <Animated.View
//             key={coin.id}
//             style={[styles.goldCoin, { top: coin.top, left: coin.left, width: coin.size, height: coin.size, borderRadius: coin.size / 2, transform: [{ translateY: coin.id % 2 === 0 ? translateY1 : translateY2 }, { rotate }] }]}
//           >
//             <LinearGradient colors={COLORS.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: coin.size / 2 }]} />
//             <View style={styles.coinInner} />
//             <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
//           </Animated.View>
//         ))}
//       </View>

//       <Header />

//       <ScrollView
//         style={styles.container}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
//           {/* Game Completion Banner - No border */}
//           <View style={styles.completionBanner}>
//             <LinearGradient
//               colors={COLORS.winnerGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.completionBannerGradient}
//             >
//               <View style={styles.completionBannerContent}>
//                 <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.completionIcon}>
//                   <MaterialCommunityIcons name="party-popper" size={24} color={COLORS.surface} />
//                 </LinearGradient>
//                 <View style={styles.completionTextContainer}>
//                   <Text style={styles.completionTitle}>Game Completed!</Text>
//                   <Text style={styles.completionSubtitle}>All {calledNumbers.length} numbers have been called</Text>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabsContainer}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
//               <Animated.View style={{ transform: [{ scale: tabButtonScales.winners }] }}>
//                 <TouchableOpacity style={[styles.tab, selectedTab === "winners" && styles.activeTab]} onPress={() => setSelectedTab("winners")}>
//                   <LinearGradient colors={selectedTab === "winners" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
//                     <Ionicons name="trophy" size={14} color={selectedTab === "winners" ? COLORS.surface : COLORS.primary} />
//                     <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>Winners</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </Animated.View>
              
//               <Animated.View style={{ transform: [{ scale: tabButtonScales.mytickets }] }}>
//                 <TouchableOpacity style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]} onPress={() => setSelectedTab("mytickets")}>
//                   <LinearGradient colors={selectedTab === "mytickets" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
//                     <Ionicons name="ticket" size={14} color={selectedTab === "mytickets" ? COLORS.surface : COLORS.primary} />
//                     <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>My Tickets</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </Animated.View>
              
//               <Animated.View style={{ transform: [{ scale: tabButtonScales.numbers }] }}>
//                 <TouchableOpacity style={[styles.tab, selectedTab === "numbers" && styles.activeTab]} onPress={() => setSelectedTab("numbers")}>
//                   <LinearGradient colors={selectedTab === "numbers" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
//                     <Ionicons name="grid" size={14} color={selectedTab === "numbers" ? COLORS.surface : COLORS.primary} />
//                     <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>Numbers</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </Animated.View>
//             </ScrollView>
//           </View>

//           {/* Tab Content */}
//           {selectedTab === "winners" && <WinnersTab />}
//           {selectedTab === "mytickets" && <MyTicketsTab />}
//           {selectedTab === "numbers" && <CalledNumbersTab />}

//           <View style={styles.bottomSpace} />
//         </Animated.View>
//       </ScrollView>

//       {/* Ticket Detail Modal */}
//       <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalContainer}>
//             {selectedTicket && (
//               <>
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalTitleContainer}>
//                     <LinearGradient colors={[COLORS.ticketBorder + '20', COLORS.ticketBorder + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketNumberBadge}>
//                       <Ionicons name="ticket-outline" size={16} color={COLORS.ticketBorder} />
//                       <Text style={styles.ticketNumberBadgeText}>#{selectedTicket.ticket_number}</Text>
//                     </LinearGradient>
//                     <LinearGradient colors={selectedTicket.marked_numbers_count === 15 ? COLORS.successGradient : COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalStatusBadge}>
//                       <Ionicons name={selectedTicket.marked_numbers_count === 15 ? "checkmark-circle" : "time-outline"} size={12} color={COLORS.surface} />
//                       <Text style={styles.modalStatusText}>{selectedTicket.marked_numbers_count === 15 ? "Full House" : `${selectedTicket.progress_percentage}%`}</Text>
//                     </LinearGradient>
//                   </View>
//                   <Animated.View style={{ transform: [{ scale: closeButtonScale }] }}>
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                       <LinearGradient colors={[COLORS.ticketBorder + '20', COLORS.ticketBorder + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.closeButtonGradient}>
//                         <Ionicons name="close" size={22} color={COLORS.ticketBorder} />
//                       </LinearGradient>
//                     </TouchableOpacity>
//                   </Animated.View>
//                 </View>

//                 <View style={styles.modalContent}>
//                   <View style={styles.fullTicketContainerModal}>
//                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
//                     <View 
//                       style={styles.modalTicketGrid}
//                       onLayout={(event) => {
//                         const { width } = event.nativeEvent.layout;
//                         setTicketContainerWidth(width);
//                       }}
//                     >
//                       {renderTicketGrid(selectedTicket.ticket_data, true)}
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.modalActions}>
//                   <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.8}>
//                     <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.closeModalButton}>
//                       <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
//                       <Text style={styles.closeModalButtonText}>Close</Text>
//                     </LinearGradient>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </LinearGradient>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   container: {
//     flex: 1,
//   },
  
//   // Loader Styles
//   loaderContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '900',
//     color: '#fff',
//     letterSpacing: 2,
//     marginBottom: 20,
//   },
//   loaderContainerDots: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     backgroundColor: '#fff',
//     borderRadius: 6,
//     marginHorizontal: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginTop: 5,
//   },
//   number: {
//     position: 'absolute',
//     left: 30,
//     bottom: 0,
//     fontSize: 28,
//     color: '#fff',
//     opacity: 0.5,
//     fontWeight: 'bold',
//   },
//   number2: {
//     position: 'absolute',
//     right: 30,
//     bottom: 0,
//     fontSize: 28,
//     color: '#fff',
//     opacity: 0.5,
//     fontWeight: 'bold',
//   },
//   ticketStrip: {
//     position: 'absolute',
//     bottom: 60,
//     backgroundColor: '#ffffff90',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//   },
//   ticketText: {
//     fontWeight: 'bold',
//     color: '#333',
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
//     top: 40,
//     left: SCREEN_WIDTH * 0.1,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLORS.primary,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   pokerChip2: {
//     position: 'absolute',
//     top: 80,
//     right: SCREEN_WIDTH * 0.15,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: COLORS.secondary,
//     shadowColor: COLORS.secondary,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
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
//   yellowGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 300,
//   },
//   blueGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 200,
//   },
//   goldCoinsContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 0,
//   },
//   goldCoin: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.5)',
//     shadowColor: COLORS.secondary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   coinInner: {
//     position: 'absolute',
//     width: '70%',
//     height: '70%',
//     borderRadius: 50,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   coinSymbol: {
//     color: COLORS.surface,
//     fontWeight: 'bold',
//     textShadowColor: 'rgba(0, 0, 0, 0.1)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1,
//   },
//   header: {
//     paddingTop: 15,
//     paddingBottom: 15,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     position: 'relative',
//     overflow: 'hidden',
//     zIndex: 1,
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
//     paddingHorizontal: 16,
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.3)",
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   cartoonTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: 2,
//   },
//   cartoonLetter: {
//     fontSize: 28,
//     fontWeight: '900',
//     color: '#FDB800',
//     textTransform: 'uppercase',
//     textShadowColor: 'rgba(255, 193, 7, 0.5)',
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 8,
//     includeFontPadding: false,
//     marginHorizontal: 2,
//     ...Platform.select({
//       android: {
//         elevation: 5,
//         textShadowColor: '#FFB300',
//         textShadowOffset: { width: 2, height: 2 },
//         textShadowRadius: 6,
//       },
//     }),
//   },
//   specialCartoonLetter: {
//     fontSize: 32,
//     color: '#FFD700',
//     textShadowColor: '#FF8C00',
//     textShadowOffset: { width: 4, height: 4 },
//     textShadowRadius: 10,
//     marginHorizontal: 2,
//   },
//   gameInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   gameName: {
//     fontSize: 12,
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: "500",
//     flex: 1,
//   },
//   content: {
//     padding: 12,
//     paddingTop: 16,
//   },
//   completionBanner: {
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   completionBannerGradient: {
//     borderRadius: 12,
//     padding: 16,
//   },
//   completionBannerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   completionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   completionTextContainer: {
//     flex: 1,
//   },
//   completionTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: COLORS.textDark,
//     marginBottom: 4,
//   },
//   completionSubtitle: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   tabsContainer: {
//     marginBottom: 16,
//   },
//   tabsScroll: {
//     flexGrow: 0,
//   },
//   tab: {
//     borderRadius: 20,
//     marginRight: 8,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   tabGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     gap: 6,
//   },
//   activeTab: {
//     borderColor: COLORS.primary,
//   },
//   tabText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   activeTabText: {
//     color: COLORS.surface,
//   },
//   card: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   cardTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   cardIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.textDark,
//   },
//   tabContent: {
//     marginBottom: 16,
//   },
//   winnerCountBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   winnerCount: {
//     fontSize: 12,
//     color: COLORS.textDark,
//     fontWeight: '600',
//   },
//   winnersList: {
//     gap: 10,
//   },
//   winnerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   myWinnerItem: {
//     borderColor: COLORS.secondary,
//   },
//   winnerRank: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   winnerRankText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   winnerInfo: {
//     flex: 1,
//   },
//   winnerName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   winnerPattern: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   winnerPrize: {
//     alignItems: 'center',
//   },
//   winnerPrizeAmount: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.secondary,
//     marginBottom: 2,
//   },
//   allWinnersList: {
//     maxHeight: 300,
//   },
//   allWinnerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     borderRadius: 8,
//   },
//   myAllWinnerItem: {
//     borderWidth: 1,
//     borderColor: COLORS.secondary,
//   },
//   allWinnerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   allWinnerAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
//   allWinnerAvatarText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: COLORS.surface,
//   },
//   allWinnerInfo: {
//     flex: 1,
//   },
//   allWinnerName: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   allWinnerPattern: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   allWinnerRight: {
//     alignItems: 'flex-end',
//   },
//   allWinnerAmount: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: COLORS.secondary,
//     marginBottom: 2,
//   },
//   allWinnerTime: {
//     fontSize: 10,
//     color: COLORS.textLight,
//   },
//   winningsTotal: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   winningsTotalText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: COLORS.surface,
//   },
//   myWinningsList: {
//     gap: 10,
//   },
//   winningItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   winningIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   winningInfo: {
//     flex: 1,
//   },
//   winningPattern: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//     marginBottom: 2,
//   },
//   winningTicket: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginBottom: 2,
//   },
//   winningTime: {
//     fontSize: 10,
//     color: COLORS.textLight,
//   },
//   winningAmountContainer: {
//     alignItems: 'center',
//   },
//   winningAmount: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: COLORS.secondary,
//   },
//   ticketCountBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   ticketCount: {
//     fontSize: 12,
//     color: COLORS.textDark,
//     fontWeight: '600',
//   },
//   myTicketsList: {
//     maxHeight: 500,
//   },
//   ticketItemContainer: {
//     marginBottom: 20,
//   },
//   ticketTouchable: {
//     width: '100%',
//   },
//   ticketHeaderOutside: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   ticketNo: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: COLORS.surface,
//   },
//   ticketCard: {
//     padding: TICKET_PADDING,
//     borderWidth: 2,
//     borderColor: COLORS.ticketBorder,
//     borderRadius: 12,
//     overflow: 'hidden',
//     backgroundColor: COLORS.surface,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     position: 'relative',
//   },
//   ticketPattern: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 50,
//     height: 50,
//     borderBottomLeftRadius: 12,
//     borderTopRightRadius: 20,
//   },
//   ticketRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ticketCell: {
//     borderWidth: 1,
//     borderColor: COLORS.ticketBorder,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 4,
//   },
//   ticketCellNumber: {
//     fontWeight: 'bold',
//     color: NUMBER_COLOR,
//   },
//   ticketStatsFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//     paddingHorizontal: 4,
//   },
//   ticketStat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ticketStatText: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   fullHouseBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//     gap: 4,
//   },
//   fullHouseBadgeText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: COLORS.surface,
//   },
//   calledCountBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   calledCount: {
//     fontSize: 12,
//     color: COLORS.textDark,
//     fontWeight: '600',
//   },
//   numberRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   numberCell: {
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginHorizontal: 1,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   calledNumberCell: {
//     borderColor: COLORS.success,
//   },
//   latestNumberCell: {
//     borderColor: COLORS.secondary,
//   },
//   numberCellText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: COLORS.textDark,
//   },
//   latestIndicator: {
//     position: 'absolute',
//     top: -2,
//     right: -2,
//     backgroundColor: COLORS.surface,
//     borderRadius: 4,
//     padding: 1,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 3,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   legendNormal: {
//     backgroundColor: COLORS.surface,
//   },
//   legendCalled: {
//     backgroundColor: COLORS.success,
//   },
//   legendLatest: {
//     backgroundColor: COLORS.secondary,
//   },
//   legendText: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginTop: 8,
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   bottomSpace: {
//     height: 20,
//   },
  
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   modalContainer: {
//     borderRadius: 20,
//     width: "100%",
//     maxWidth: 400,
//     maxHeight: "85%",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 16,
//     backgroundColor: COLORS.background,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   modalTitleContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     flexWrap: 'wrap',
//   },
//   ticketNumberBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: COLORS.ticketBorder,
//   },
//   ticketNumberBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.textDark,
//   },
//   modalStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   modalStatusText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: COLORS.surface,
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.ticketBorder,
//   },
//   closeButtonGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     padding: 20,
//   },
//   fullTicketContainerModal: {
//     marginBottom: 20,
//   },
//   ticketGridTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.textDark,
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   modalTicketGrid: {
//     marginBottom: 16,
//   },
//   modalActions: {
//     padding: 20,
//     paddingTop: 0,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//   },
//   closeModalButton: {
//     paddingHorizontal: 30,
//     paddingVertical: 14,
//     borderRadius: 10,
//     width: "100%",
//     alignItems: "center",
//     overflow: 'hidden',
//     position: 'relative',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   closeModalButtonText: {
//     color: COLORS.surface,
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   glassEffectOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.3)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//     borderRadius: 10,
//   },
// });

// export default UserGameResult;






import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Animated,
  Easing,
  Platform,
  Modal,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH, height } = Dimensions.get('window');

// Optimized ticket dimensions - reduced internal cell size
const TICKET_PADDING = 8;
const CELL_MARGIN = 1.5;
const NUM_COLUMNS = 9;

// Enhanced color scheme
const COLORS = {
  primary: "#4facfe",
  primaryGradient: ['#359df9', '#64d8f8'],
  secondary: "#FDB800",
  secondaryGradient: ['#FDB800', '#FF8C00'],
  ticketBorder: "#fcca26",
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  success: "#4CAF50",
  successGradient: ['#4CAF50', '#45a049'],
  error: "#E74C3C",
  warning: "#ff9800",
  warningGradient: ['#ff9800', '#f57c00'],
  prizeGradient: ['#4facfe20', '#00c6fb20'],
  winnerGradient: ['#4facfe10', '#9fcdff10'],
  glassGradient: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)'],
  red: "#EF4444",
  green: "#10B981",
};

// Row colors
const ROW_COLOR_1 = "#f0f8ff";
const ROW_COLOR_2 = "#e6f3ff";
const FILLED_CELL_BG = "#62cff4";
const NUMBER_COLOR = COLORS.surface;

// Custom Loader
const CustomLoader = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const messages = [
    "Loading game results...",
    "Fetching winner details 🏆",
    "Calculating your winnings 💰",
    "Almost there...",
    "Getting results ready 📊",
    "Celebrating winners! 🎉"
  ];

  const [currentText, setCurrentText] = useState(0);
  const [animationLoop, setAnimationLoop] = useState(true);

  useEffect(() => {
    const animations = [];
    
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    );
    animations.push(bounceAnimation);
    bounceAnimation.start();

    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: -10, duration: 300, delay, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
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
      Animated.timing(floatAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    );
    animations.push(floatAnimation);
    floatAnimation.start();

    const slideAnimation = Animated.loop(
      Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    );
    animations.push(slideAnimation);
    slideAnimation.start();

    const textInterval = setInterval(() => {
      if (animationLoop) {
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
          setCurrentText((prev) => (prev + 1) % messages.length);
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        });
      }
    }, 2500);

    return () => {
      setAnimationLoop(false);
      clearInterval(textInterval);
      animations.forEach(animation => {
        if (animation && typeof animation.stop === 'function') animation.stop();
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

  const floatUp = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });

  useEffect(() => {
    const listener = slideAnim.addListener(({ value }) => {
      if (value >= SCREEN_WIDTH) slideAnim.setValue(-SCREEN_WIDTH);
    });
    return () => slideAnim.removeListener(listener);
  }, [slideAnim]);

  return (
    <LinearGradient colors={['#4facfe', '#FDB800']} style={styles.loaderContainer}>
      <Animated.Text style={[styles.number, { transform: [{ translateY: floatUp }] }]}>17</Animated.Text>
      <Animated.Text style={[styles.number2, { transform: [{ translateY: floatUp }] }]}>42</Animated.Text>
      <Animated.Text style={[styles.title, { transform: [{ translateY: bounceAnim }] }]}>Houzie Timez</Animated.Text>
      <View style={styles.loaderContainerDots}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
      </View>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>{messages[currentText]}</Animated.Text>
      <Animated.View style={[styles.ticketStrip, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.ticketText}>🏆 Loading Results...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const UserGameResult = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [myWinnings, setMyWinnings] = useState([]);
  const [allWinners, setAllWinners] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("winners");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Store cell width for consistent sizing
  const [cellWidth, setCellWidth] = useState(0);
  const [ticketContainerWidth, setTicketContainerWidth] = useState(SCREEN_WIDTH - 24);

  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const tabButtonScales = useRef({
    winners: new Animated.Value(1),
    mytickets: new Animated.Value(1),
    numbers: new Animated.Value(1),
  }).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  
  // Header letter animations - store individual animated values
  const letterAnims = useRef([]);
  const [headerLetters] = useState([
    { char: 'R', index: 0 },
    { char: 'E', index: 1 },
    { char: 'S', index: 2 },
    { char: 'U', index: 3 },
    { char: 'L', index: 4 },
    { char: 'T', index: 5 },
    { char: 'S', index: 6, isSpecial: true },
  ]);

  const goldCoins = [
    { id: 1, top: '15%', left: '5%', size: 25 },
    { id: 2, top: '25%', left: '85%', size: 20 },
    { id: 3, top: '40%', left: '15%', size: 22 },
    { id: 4, top: '55%', left: '75%', size: 18 },
    { id: 5, top: '70%', left: '10%', size: 24 },
    { id: 6, top: '80%', left: '80%', size: 19 },
    { id: 7, top: '30%', left: '60%', size: 21 },
    { id: 8, top: '65%', left: '40%', size: 23 },
    { id: 9, top: '45%', left: '90%', size: 17 },
    { id: 10, top: '85%', left: '30%', size: 20 },
  ];

  // Calculate cell width based on container width
  const calculateCellWidth = (containerWidth) => {
    const availableWidth = containerWidth - (TICKET_PADDING * 2);
    const totalMarginWidth = (CELL_MARGIN * 2) * NUM_COLUMNS;
    const calculatedWidth = (availableWidth - totalMarginWidth) / NUM_COLUMNS;
    return Math.max(28, Math.min(calculatedWidth, 35));
  };

  useEffect(() => {
    if (ticketContainerWidth > 0) {
      const newCellWidth = calculateCellWidth(ticketContainerWidth);
      setCellWidth(newCellWidth);
    }
  }, [ticketContainerWidth]);

  // Initialize sequential letter animation
  useEffect(() => {
    // Create animated values for each letter
    letterAnims.current = headerLetters.map(() => new Animated.Value(1));
    
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextLetter = () => {
      if (!isAnimating) return;
      
      // Reset all letters to normal size
      letterAnims.current.forEach(anim => {
        anim.setValue(1);
      });
      
      // Animate current letter only
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.delay(400), // Pause before next letter
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          // Move to next letter
          currentIndex = (currentIndex + 1) % headerLetters.length;
          animateNextLetter();
        }
      });
    };
    
    // Start the animation sequence
    animateNextLetter();

    startAnimations();
    
    startPulseAnimation(backButtonScale, 800);
    startPulseAnimation(tabButtonScales.winners, 850);
    startPulseAnimation(tabButtonScales.mytickets, 900);
    startPulseAnimation(tabButtonScales.numbers, 950);
    startPulseAnimation(closeButtonScale, 800);

    fetchGameResults().finally(() => {
      setInitialLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    });

    // Cleanup
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
        Animated.timing(anim, { toValue: 1.08, duration: duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(anim, { toValue: 1, duration: duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
      ])
    ).start();
  };

  const startAnimations = () => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim1, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(floatAnim1, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim2, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(floatAnim2, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.02, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();

    Animated.loop(Animated.sequence([
      Animated.timing(shineAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(shineAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();
  };

  const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 10] });
  const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const shineTranslateX = shineAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, SCREEN_WIDTH + 100] });

  const fetchGameResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token") || await AsyncStorage.getItem("userToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/user/games/history/${gameId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );

      if (response.data.status) {
        const data = response.data.data;
        setGameData(data);
        
        if (data.my_tickets_complete_data) setMyTickets(data.my_tickets_complete_data);
        if (data.my_participation?.winning_patterns) setMyWinnings(data.my_participation.winning_patterns);
        if (data.all_game_winners?.winners_list) setAllWinners(data.all_game_winners.winners_list);
        if (data.number_calling_history?.called_numbers) setCalledNumbers(data.number_calling_history.called_numbers);
      }
    } catch (error) {
      console.log("Error fetching game results:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGameResults().finally(() => setRefreshing(false));
  }, []);

  const processTicketData = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill().map(() => Array(9).fill(null));
    
    if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
      const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      ticketData.forEach((row) => {
        row.forEach((cell) => {
          if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
            processedGrid[cell.row][cell.column] = cell.number;
          }
        });
      });
      return processedGrid;
    } else if (ticketData[0] && Array.isArray(ticketData[0])) {
      return ticketData.map(row => row.map(cell => cell));
    }
    return Array(3).fill().map(() => Array(9).fill(null));
  };

  const renderTicketGrid = (ticketData, isModal = false) => {
    const processedData = processTicketData(ticketData);
    const currentCellWidth = cellWidth > 0 ? cellWidth : 32;
    
    return (
      <View 
        style={[styles.ticketCard, { width: '100%' }]}
        onLayout={(event) => {
          if (!isModal) {
            const { width } = event.nativeEvent.layout;
            if (width !== ticketContainerWidth) {
              setTicketContainerWidth(width);
            }
          }
        }}
      >
        <LinearGradient
          colors={COLORS.prizeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ticketPattern}
        />
        
        {processedData.map((row, rowIndex) => (
          <View 
            key={`row-${rowIndex}`} 
            style={[
              styles.ticketRow,
              { backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2 }
            ]}
          >
            {row.map((cell, colIndex) => {
              const isEmpty = cell === null;
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.ticketCell,
                    { 
                      width: currentCellWidth,
                      height: currentCellWidth,
                      marginHorizontal: CELL_MARGIN,
                      marginVertical: CELL_MARGIN,
                      backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
                    },
                  ]}
                >
                  {!isEmpty && (
                    <Text style={[styles.ticketCellNumber, { fontSize: Math.min(currentCellWidth * 0.4, 12) }]}>
                      {cell}
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

  const renderBackgroundPattern = () => (
    <View style={styles.backgroundPattern}>
      <Animated.View style={[styles.pokerChip1, { transform: [{ translateY: translateY1 }, { translateX: translateY2 }, { rotate }] }]} />
      <Animated.View style={[styles.pokerChip2, { transform: [{ translateY: translateY2 }, { translateX: translateY1 }, { rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) }] }]} />
      <Animated.View style={[styles.shineEffect, { transform: [{ translateX: shineTranslateX }], opacity: shineAnim }]} />
      <LinearGradient colors={['rgba(255,152,0,0.05)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.yellowGradient} />
      <LinearGradient colors={['transparent', 'rgba(79,172,254,0.05)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.blueGradient} />
    </View>
  );

  const Header = () => {
    return (
      <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerPattern}>
          <Animated.View style={[styles.headerShine, { transform: [{ translateX: shineTranslateX }] }]} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.headerTextContainer}>
              <View style={styles.cartoonTitleRow}>
                {headerLetters.map((item) => (
                  <Animated.Text
                    key={item.index}
                    style={[
                      styles.cartoonLetter,
                      item.isSpecial && styles.specialCartoonLetter,
                      { 
                        transform: [{ scale: letterAnims.current[item.index] || 1 }],
                      }
                    ]}
                  >
                    {item.char}
                  </Animated.Text>
                ))}
              </View>
              <View style={styles.gameInfoContainer}>
                <Ionicons name="game-controller" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.gameName} numberOfLines={1}>{gameName || "Tambola Game"}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const WinnersTab = () => (
    <View style={styles.tabContent}>
      <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
              <MaterialCommunityIcons name="crown" size={16} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Top Winners</Text>
          </View>
          <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winnerCountBadge}>
            <Text style={styles.winnerCount}>{gameData?.all_game_winners?.total_winners || 0} Winners</Text>
          </LinearGradient>
        </View>
        
        {gameData?.all_game_winners?.top_winners && gameData.all_game_winners.top_winners.length > 0 ? (
          <View style={styles.winnersList}>
            {gameData.all_game_winners.top_winners.slice(0, 5).map((winner, index) => (
              <LinearGradient
                key={index}
                colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.winnerItem, winner.is_me && styles.myWinnerItem]}
              >
                <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.winnerRank, { backgroundColor: COLORS.primary + '20' }]}>
                  <Text style={[styles.winnerRankText, { color: COLORS.primary }]}>#{index + 1}</Text>
                </LinearGradient>
                <View style={styles.winnerInfo}>
                  <Text style={[styles.winnerName, winner.is_me && { color: COLORS.surface }]}>
                    {winner.winner_name}{winner.is_me && " (You)"}
                  </Text>
                  <Text style={[styles.winnerPattern, winner.is_me && { color: COLORS.surface + 'CC' }]}>{winner.pattern_name}</Text>
                </View>
                <View style={styles.winnerPrize}>
                  <Text style={[styles.winnerPrizeAmount, winner.is_me && { color: COLORS.surface }]}>₹{winner.winning_amount}</Text>
                  {index === 0 && <MaterialCommunityIcons name="trophy" size={12} color={winner.is_me ? COLORS.surface : COLORS.secondary} />}
                </View>
              </LinearGradient>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="trophy-outline" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No winners data available</Text>
          </View>
        )}
      </LinearGradient>

      <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
              <MaterialCommunityIcons name="format-list-bulleted" size={16} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.cardTitle}>All Winners</Text>
          </View>
        </View>
        
        {allWinners.length > 0 ? (
          <ScrollView style={styles.allWinnersList} showsVerticalScrollIndicator={false}>
            {allWinners.map((winner, index) => (
              <LinearGradient
                key={index}
                colors={winner.is_me ? COLORS.warningGradient : [COLORS.surface, COLORS.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.allWinnerItem, winner.is_me && styles.myAllWinnerItem]}
              >
                <View style={styles.allWinnerLeft}>
                  <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.allWinnerAvatar}>
                    <Text style={styles.allWinnerAvatarText}>{winner.winner_name?.charAt(0).toUpperCase() || 'U'}</Text>
                  </LinearGradient>
                  <View style={styles.allWinnerInfo}>
                    <Text style={[styles.allWinnerName, winner.is_me && { color: COLORS.surface }]}>
                      {winner.winner_name}{winner.is_me && " (You)"}
                    </Text>
                    <Text style={[styles.allWinnerPattern, winner.is_me && { color: COLORS.surface + 'CC' }]}>{winner.reward_name}</Text>
                  </View>
                </View>
                <View style={styles.allWinnerRight}>
                  <Text style={[styles.allWinnerAmount, winner.is_me && { color: COLORS.surface }]}>₹{winner.winning_amount}</Text>
                  <Text style={[styles.allWinnerTime, winner.is_me && { color: COLORS.surface + 'CC' }]}>
                    {new Date(winner.approved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-group-outline" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No winners found</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const MyTicketsTab = () => (
    <View style={styles.tabContent}>
      {myWinnings.length > 0 && (
        <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
                <MaterialCommunityIcons name="trophy" size={16} color={COLORS.primary} />
              </LinearGradient>
              <Text style={styles.cardTitle}>My Winnings</Text>
            </View>
            <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningsTotal}>
              <Text style={styles.winningsTotalText}>₹{gameData?.my_participation?.total_winnings || 0}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.myWinningsList}>
            {myWinnings.map((winning, index) => (
              <LinearGradient key={index} colors={COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningItem}>
                <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.winningIcon}>
                  <MaterialCommunityIcons name="trophy" size={18} color={COLORS.primary} />
                </LinearGradient>
                <View style={styles.winningInfo}>
                  <Text style={styles.winningPattern}>{winning.reward_name}</Text>
                  <Text style={styles.winningTicket}>{winning.pattern_name}</Text>
                  <Text style={styles.winningTime}>
                    {new Date(winning.approved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.winningAmountContainer}>
                  <Text style={styles.winningAmount}>₹{winning.winning_amount}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </LinearGradient>
      )}

      <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
              <MaterialCommunityIcons name="ticket-confirmation" size={16} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.cardTitle}>My Tickets</Text>
          </View>
          <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketCountBadge}>
            <Text style={styles.ticketCount}>{myTickets.length} Ticket{myTickets.length !== 1 ? 's' : ''}</Text>
          </LinearGradient>
        </View>
        
        {myTickets.length > 0 ? (
          <ScrollView style={styles.myTicketsList} showsVerticalScrollIndicator={false}>
            {myTickets.map((ticket, index) => {
              const isCompleted = ticket.marked_numbers_count === 15;
              
              return (
                <View key={index} style={styles.ticketItemContainer}>
                  <View style={styles.ticketHeaderOutside}>
                    <Text style={styles.ticketNo}>Ticket No: #{ticket.ticket_number}</Text>
                    <LinearGradient
                      colors={isCompleted ? COLORS.successGradient : COLORS.prizeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.statusBadge}
                    >
                      <Ionicons name={isCompleted ? "checkmark-circle" : "time-outline"} size={12} color={COLORS.surface} />
                      <Text style={styles.statusText}>{isCompleted ? 'FULL HOUSE' : `${ticket.progress_percentage}%`}</Text>
                    </LinearGradient>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => { setSelectedTicket(ticket); setModalVisible(true); }} 
                    activeOpacity={0.9}
                    style={styles.ticketTouchable}
                  >
                    {renderTicketGrid(ticket.ticket_data)}
                  </TouchableOpacity>
                  
                  <View style={styles.ticketStatsFooter}>
                    <View style={styles.ticketStat}>
                      <Ionicons name="checkmark-circle" size={12} color={COLORS.green} />
                      <Text style={styles.ticketStatText}>{ticket.marked_numbers_count} Marked</Text>
                    </View>
                    <View style={styles.ticketStat}>
                      <Ionicons name="close-circle" size={12} color={COLORS.red} />
                      <Text style={styles.ticketStatText}>{ticket.unmarked_numbers?.length || 0} Left</Text>
                    </View>
                    {isCompleted && (
                      <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.fullHouseBadge}>
                        <MaterialCommunityIcons name="trophy" size={12} color={COLORS.surface} />
                        <Text style={styles.fullHouseBadgeText}>FULL HOUSE</Text>
                      </LinearGradient>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="ticket-outline" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No tickets found</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const CalledNumbersTab = () => (
    <View style={styles.tabContent}>
      <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardIcon}>
              <MaterialCommunityIcons name="grid" size={16} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Called Numbers</Text>
          </View>
          <LinearGradient colors={COLORS.prizeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.calledCountBadge}>
            <Text style={styles.calledCount}>{calledNumbers.length}/90</Text>
          </LinearGradient>
        </View>
        
        {calledNumbers.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {Array.from({ length: 9 }, (_, row) => (
                <View key={row} style={styles.numberRow}>
                  {Array.from({ length: 10 }, (_, col) => {
                    const number = row * 10 + col + 1;
                    const isCalled = calledNumbers.includes(number);
                    const isLatest = calledNumbers.length > 0 && number === calledNumbers[calledNumbers.length - 1];
                    
                    return (
                      <LinearGradient
                        key={number}
                        colors={isLatest ? COLORS.secondaryGradient : isCalled ? COLORS.successGradient : [COLORS.surface, COLORS.surface]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.numberCell, isCalled && styles.calledNumberCell, isLatest && styles.latestNumberCell]}
                      >
                        <Text style={[styles.numberCellText, (isCalled || isLatest) && { color: COLORS.surface }]}>{number}</Text>
                        {isLatest && (
                          <View style={styles.latestIndicator}>
                            <MaterialCommunityIcons name="star" size={6} color={COLORS.surface} />
                          </View>
                        )}
                      </LinearGradient>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="numeric-off" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No numbers called</Text>
          </View>
        )}
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendNormal]} />
            <Text style={styles.legendText}>Not Called</Text>
          </View>
          <View style={styles.legendItem}>
            <LinearGradient colors={COLORS.successGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendCalled]} />
            <Text style={styles.legendText}>Called</Text>
          </View>
          <View style={styles.legendItem}>
            <LinearGradient colors={COLORS.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.legendColor, styles.legendLatest]} />
            <Text style={styles.legendText}>Latest</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

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
      
      {renderBackgroundPattern()}
      
      <View style={styles.goldCoinsContainer}>
        {goldCoins.map((coin) => (
          <Animated.View
            key={coin.id}
            style={[styles.goldCoin, { top: coin.top, left: coin.left, width: coin.size, height: coin.size, borderRadius: coin.size / 2, transform: [{ translateY: coin.id % 2 === 0 ? translateY1 : translateY2 }, { rotate }] }]}
          >
            <LinearGradient colors={COLORS.secondaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: coin.size / 2 }]} />
            <View style={styles.coinInner} />
            <Text style={[styles.coinSymbol, { fontSize: coin.size * 0.45 }]}>₹</Text>
          </Animated.View>
        ))}
      </View>

      <Header />

      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Game Completion Banner - No border */}
          <View style={styles.completionBanner}>
            <LinearGradient
              colors={COLORS.winnerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completionBannerGradient}
            >
              <View style={styles.completionBannerContent}>
                <LinearGradient colors={COLORS.warningGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.completionIcon}>
                  <MaterialCommunityIcons name="party-popper" size={24} color={COLORS.surface} />
                </LinearGradient>
                <View style={styles.completionTextContainer}>
                  <Text style={styles.completionTitle}>Game Completed!</Text>
                  <Text style={styles.completionSubtitle}>All {calledNumbers.length} numbers have been called</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
              <Animated.View style={{ transform: [{ scale: tabButtonScales.winners }] }}>
                <TouchableOpacity style={[styles.tab, selectedTab === "winners" && styles.activeTab]} onPress={() => setSelectedTab("winners")}>
                  <LinearGradient colors={selectedTab === "winners" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
                    <Ionicons name="trophy" size={14} color={selectedTab === "winners" ? COLORS.surface : COLORS.primary} />
                    <Text style={[styles.tabText, selectedTab === "winners" && styles.activeTabText]}>Winners</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View style={{ transform: [{ scale: tabButtonScales.mytickets }] }}>
                <TouchableOpacity style={[styles.tab, selectedTab === "mytickets" && styles.activeTab]} onPress={() => setSelectedTab("mytickets")}>
                  <LinearGradient colors={selectedTab === "mytickets" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
                    <Ionicons name="ticket" size={14} color={selectedTab === "mytickets" ? COLORS.surface : COLORS.primary} />
                    <Text style={[styles.tabText, selectedTab === "mytickets" && styles.activeTabText]}>My Tickets</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <Animated.View style={{ transform: [{ scale: tabButtonScales.numbers }] }}>
                <TouchableOpacity style={[styles.tab, selectedTab === "numbers" && styles.activeTab]} onPress={() => setSelectedTab("numbers")}>
                  <LinearGradient colors={selectedTab === "numbers" ? COLORS.primaryGradient : [COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabGradient}>
                    <Ionicons name="grid" size={14} color={selectedTab === "numbers" ? COLORS.surface : COLORS.primary} />
                    <Text style={[styles.tabText, selectedTab === "numbers" && styles.activeTabText]}>Numbers</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </View>

          {/* Tab Content */}
          {selectedTab === "winners" && <WinnersTab />}
          {selectedTab === "mytickets" && <MyTicketsTab />}
          {selectedTab === "numbers" && <CalledNumbersTab />}

          <View style={styles.bottomSpace} />
        </Animated.View>
      </ScrollView>

      {/* Ticket Detail Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient colors={[COLORS.surface, COLORS.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalContainer}>
            {selectedTicket && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <LinearGradient colors={[COLORS.ticketBorder + '20', COLORS.ticketBorder + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ticketNumberBadge}>
                      <Ionicons name="ticket-outline" size={16} color={COLORS.ticketBorder} />
                      <Text style={styles.ticketNumberBadgeText}>#{selectedTicket.ticket_number}</Text>
                    </LinearGradient>
                    <LinearGradient colors={selectedTicket.marked_numbers_count === 15 ? COLORS.successGradient : COLORS.winnerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalStatusBadge}>
                      <Ionicons name={selectedTicket.marked_numbers_count === 15 ? "checkmark-circle" : "time-outline"} size={12} color={COLORS.surface} />
                      <Text style={styles.modalStatusText}>{selectedTicket.marked_numbers_count === 15 ? "Full House" : `${selectedTicket.progress_percentage}%`}</Text>
                    </LinearGradient>
                  </View>
                  <Animated.View style={{ transform: [{ scale: closeButtonScale }] }}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                      <LinearGradient colors={[COLORS.ticketBorder + '20', COLORS.ticketBorder + '10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.closeButtonGradient}>
                        <Ionicons name="close" size={22} color={COLORS.ticketBorder} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                <View style={styles.modalContent}>
                  <View style={styles.fullTicketContainerModal}>
                    <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
                    <View 
                      style={styles.modalTicketGrid}
                      onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setTicketContainerWidth(width);
                      }}
                    >
                      {renderTicketGrid(selectedTicket.ticket_data, true)}
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                    <LinearGradient colors={COLORS.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.closeModalButton}>
                      <LinearGradient colors={COLORS.glassGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.glassEffectOverlay} />
                      <Text style={styles.closeModalButtonText}>Close</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  },
  
  // Loader Styles
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
    left: SCREEN_WIDTH * 0.1,
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
    right: SCREEN_WIDTH * 0.15,
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
  goldCoinsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  goldCoin: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  coinInner: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coinSymbol: {
    color: COLORS.surface,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
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
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerTextContainer: {
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
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
    gap: 5,
  },
  gameName: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    flex: 1,
  },
  content: {
    padding: 12,
    paddingTop: 16,
  },
  completionBanner: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completionBannerGradient: {
    borderRadius: 12,
    padding: 16,
  },
  completionBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTextContainer: {
    flex: 1,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tab: {
    borderRadius: 20,
    marginRight: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  activeTab: {
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  activeTabText: {
    color: COLORS.surface,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  tabContent: {
    marginBottom: 16,
  },
  winnerCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winnerCount: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  winnersList: {
    gap: 10,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  myWinnerItem: {
    borderColor: COLORS.secondary,
  },
  winnerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  winnerRankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  winnerInfo: {
    flex: 1,
  },
  winnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  winnerPattern: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  winnerPrize: {
    alignItems: 'center',
  },
  winnerPrizeAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  allWinnersList: {
    maxHeight: 300,
  },
  allWinnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRadius: 8,
  },
  myAllWinnerItem: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  allWinnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  allWinnerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  allWinnerAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.surface,
  },
  allWinnerInfo: {
    flex: 1,
  },
  allWinnerName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  allWinnerPattern: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  allWinnerRight: {
    alignItems: 'flex-end',
  },
  allWinnerAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  allWinnerTime: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  winningsTotal: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winningsTotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.surface,
  },
  myWinningsList: {
    gap: 10,
  },
  winningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  winningIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  winningInfo: {
    flex: 1,
  },
  winningPattern: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  winningTicket: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  winningTime: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  winningAmountContainer: {
    alignItems: 'center',
  },
  winningAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  ticketCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketCount: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  myTicketsList: {
     flex: 1,
  },
  ticketItemContainer: {
    marginBottom: 20,
  },
  ticketTouchable: {
    width: '100%',
  },
  ticketHeaderOutside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ticketNo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.surface,
  },
  ticketCard: {
    padding: TICKET_PADDING,
    borderWidth: 2,
    borderColor: COLORS.ticketBorder,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  ticketPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 20,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketCell: {
    borderWidth: 1,
    borderColor: COLORS.ticketBorder,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  ticketCellNumber: {
    fontWeight: 'bold',
    color: NUMBER_COLOR,
  },
  ticketStatsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  ticketStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketStatText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  fullHouseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  fullHouseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.surface,
  },
  calledCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  calledCount: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  numberCell: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  calledNumberCell: {
    borderColor: COLORS.success,
  },
  latestNumberCell: {
    borderColor: COLORS.secondary,
  },
  numberCellText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  latestIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    padding: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendNormal: {
    backgroundColor: COLORS.surface,
  },
  legendCalled: {
    backgroundColor: COLORS.success,
  },
  legendLatest: {
    backgroundColor: COLORS.secondary,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 20,
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
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: 'wrap',
  },
  ticketNumberBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.ticketBorder,
  },
  ticketNumberBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.surface,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.ticketBorder,
  },
  closeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
  },
  fullTicketContainerModal: {
    marginBottom: 20,
  },
  ticketGridTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTicketGrid: {
    marginBottom: 16,
  },
  modalActions: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeModalButton: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeModalButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: "600",
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
});

export default UserGameResult;
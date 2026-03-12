// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   RefreshControl,
//   SafeAreaView,
//   Dimensions,
//   Linking,
//   Platform,
//   Animated,
//   Easing,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import Feather from "react-native-vector-icons/Feather";

// const { width } = Dimensions.get("window");

// // Updated color scheme matching Home component
// const PRIMARY_COLOR = "#4facfe"; // Main blue color
// const ACCENT_COLOR = "#ff9800"; // Orange accent
// const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// const WHITE = "#FFFFFF";
// const TEXT_DARK = "#333333";
// const TEXT_LIGHT = "#777777";
// const BORDER_COLOR = "#EEEEEE";
// const CARD_BACKGROUND = "#FFFFFF";
// const SUCCESS_COLOR = "#4CAF50"; // Green for success states
// const ERROR_COLOR = "#E74C3C"; // Red for errors

// const GameDetails = ({ route, navigation }) => {
//   const { game } = route.params;
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [ticketModalVisible, setTicketModalVisible] = useState(false);
//   const [ticketQuantity, setTicketQuantity] = useState(1);
//   const [ticketMessage, setTicketMessage] = useState("");
//   const [requestLoading, setRequestLoading] = useState(false);
//   const [myTicketCount, setMyTicketCount] = useState(0);
//   const [myRequestCount, setMyRequestCount] = useState(0);
//   const [gameStatus, setGameStatus] = useState(null);
//   const [callingStatus, setCallingStatus] = useState(null);
//   const [calledNumbers, setCalledNumbers] = useState([]);
//   const [timer, setTimer] = useState(0);
//   const [joiningRoom, setJoiningRoom] = useState(false);
//   const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
//   const [totalTicketsInGame, setTotalTicketsInGame] = useState(0);

//   // Animation values
//   const floatAnim1 = useRef(new Animated.Value(0)).current;
//   const floatAnim2 = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const shineAnim = useRef(new Animated.Value(0)).current;

//   // Toast state
//   const [toast, setToast] = useState({ visible: false, message: "", type: "" });

//   const MAX_TICKETS_PER_USER = 4;

//   const getWhatsAppNumber = () => {
//     if (game.host_mobile) {
//       return game.host_mobile;
//     }
//     if (game.user?.mobile) {
//       return game.user.mobile;
//     }
//     return "8007395749";
//   };

//   const createWhatsAppMessage = () => {
//     const gameDate = new Date(game.game_date).toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
    
//     const gameType = game.ticket_type === "paid" ? "Paid Game" : "Free Game";
//     const ticketCost = game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE";
//     const totalAmount = game.ticket_type === "paid" ? `₹${game.ticket_cost * ticketQuantity}` : "FREE";
//     const hostName = game.user?.name || "Game Host";
    
//     return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

// 🎮 *Game Details:*
// • Game Name: ${game.game_name}
// • Game ID: ${game.game_code}
// • Date: ${gameDate} ${game.game_start_time}
// • Type: ${gameType} ${ticketCost !== "FREE" ? `(${ticketCost} per ticket)` : ""}
// • Host: ${hostName}

// 🎫 *Ticket Request:*
// • Quantity: ${ticketQuantity} ticket${ticketQuantity > 1 ? "s" : ""}
// • Total Amount: ${totalAmount}

// 📝 *Additional Message:*
// ${ticketMessage || "Please approve my ticket request. Looking forward to the game!"}

// 💰 *Payment Information:*
// • UPI ID: ${getWhatsAppNumber()}@ybl
// • PhonePe/Paytm: ${getWhatsAppNumber()}
// • Please send payment screenshot with your name

// ✅ *Confirmation Required:*
// Please confirm my ticket allocation and share payment details if needed.

// Thank you! 🙏
// Looking forward to playing Tambola! 🎲🎉`;
//   };

//   const redirectToWhatsApp = () => {
//     const whatsappNumber = getWhatsAppNumber();
//     const message = createWhatsAppMessage();
//     const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
//     Linking.canOpenURL(whatsappUrl)
//       .then((supported) => {
//         if (supported) {
//           return Linking.openURL(whatsappUrl);
//         } else {
//           const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
//           return Linking.openURL(webWhatsappUrl);
//         }
//       })
//       .catch((error) => {
//         console.log("Error opening WhatsApp:", error);
//         Alert.alert(
//           "Error",
//           "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
//           [{ text: "OK" }]
//         );
//       });
//   };

//   useEffect(() => {
//     startAnimations();
//     fetchAllData();

//     const unsubscribe = navigation.addListener('focus', () => {
//       fetchAllData();
//       setJoiningRoom(false);
//       setHasJoinedRoom(false);
//     });

//     return () => {
//       unsubscribe();
//     };
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

//     // Slow rotation animation
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 20000,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();

//     // Shine animation
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

//   // Interpolations for animations
//   const translateY1 = floatAnim1.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15]
//   });

//   const translateY2 = floatAnim2.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, -10]
//   });

//   const rotate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   const shineTranslateX = shineAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-100, width + 100]
//   });

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         fetchGameStatus(),
//         fetchMyTicketCount(),
//         fetchMyRequestCount(),
//         fetchTotalTicketsInGame()
//       ]);
//     } catch (error) {
//       console.log("Error fetching all data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showToast = (message, type = "success") => {
//     setToast({ visible: true, message, type });
//   };

//   const hideToast = () => {
//     setToast({ ...toast, visible: false });
//   };

//   const Toast = () => {
//     if (!toast.visible) return null;
    
//     const backgroundColor = toast.type === "success" ? SUCCESS_COLOR : ERROR_COLOR;
    
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         hideToast();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }, []);

//     return (
//       <View style={[styles.toast, { backgroundColor }]}>
//         <Ionicons 
//           name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
//           size={20} 
//           color={WHITE} 
//         />
//         <Text style={styles.toastText}>{toast.message}</Text>
//       </View>
//     );
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     Promise.all([
//       fetchGameStatus(), 
//       fetchMyTicketCount(), 
//       fetchMyRequestCount(),
//       fetchTotalTicketsInGame()
//     ]).finally(() =>
//       setRefreshing(false)
//     );
//   }, []);

//   const fetchGameStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.get(
//         `https://tambolatime.co.in/public/api/user/games/${game.id}/calling-status`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         const data = response.data.data;
//         setGameStatus(data.game);
//         setCallingStatus(data.calling);
//         setCalledNumbers(data.numbers?.called_numbers || []);
        
//         if (data.calling?.is_running && !data.calling?.is_paused) {
//           setTimer(data.calling?.interval_seconds || 60);
//         }
//       }
//     } catch (error) {
//       console.log("Error fetching game status:", error);
//     }
//   };

//   const fetchMyTicketCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         const gameTickets = res.data.tickets.data.filter(
//           (ticket) => ticket.game_id == game.id
//         );
//         setMyTicketCount(gameTickets.length);
//       }
//     } catch (error) {
//       console.log("Error fetching ticket count:", error);
//     }
//   };

//   const fetchMyRequestCount = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         const gameRequests = res.data.ticket_requests.data.filter(
//           (request) => request.game_id === game.id
//         );
//         setMyRequestCount(gameRequests.length);
//       }
//     } catch (error) {
//       console.log("Error fetching request count:", error);
//     }
//   };

//   const fetchTotalTicketsInGame = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
      
//       const ticketsRes = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       const requestsRes = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (ticketsRes.data.success && requestsRes.data.success) {
//         const allocatedTickets = ticketsRes.data.tickets.data.filter(
//           (ticket) => ticket.game_id == game.id
//         ).length;
        
//         const pendingRequests = requestsRes.data.ticket_requests.data.filter(
//           (request) => 
//             request.game_id == game.id && 
//             request.status === 'pending'
//         ).length;
        
//         const total = allocatedTickets + pendingRequests;
//         setTotalTicketsInGame(total);
//       }
//     } catch (error) {
//       console.log("Error fetching total tickets:", error);
//     }
//   };

//   const updateGameRoomStatus = async () => {
//     try {
//       setJoiningRoom(true);
//       const token = await AsyncStorage.getItem("token");
      
//       const response = await axios.post(
//         `https://tambolatime.co.in/public/api/user/game-room/${game.id}/update-status`,
//         {
//           is_active: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setHasJoinedRoom(true);
//         showToast("Joined game room successfully!", "success");
//         navigation.navigate("UserGameRoom", { 
//           gameId: game.id,
//           gameName: game.game_name,
//           gameStatus: gameStatus?.status
//         });
//         setJoiningRoom(false);
//       } else {
//         showToast(response.data.message || "Failed to join game room", "error");
//         setJoiningRoom(false);
//       }
//     } catch (error) {
//       console.log("Error updating game room status:", error.response?.data || error.message);
//       showToast(
//         error.response?.data?.message || "Failed to join game room. Please try again.",
//         "error"
//       );
//       setJoiningRoom(false);
//     }
//   };

//   const handleRequestTickets = async () => {
//     if (hasReachedTicketLimit()) {
//       showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
//       return;
//     }

//     const remaining = getRemainingTickets();
//     if (ticketQuantity > remaining) {
//       showToast(`You can only request up to ${remaining} more ticket(s)`, "error");
//       return;
//     }

//     if (ticketQuantity < 1 || ticketQuantity > 4) {
//       showToast("Ticket quantity must be between 1 and 4", "error");
//       return;
//     }

//     setRequestLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const response = await axios.post(
//         "https://tambolatime.co.in/public/api/user/ticket-requests/send",
//         {
//           game_id: game.id,
//           ticket_quantity: ticketQuantity,
//           message:
//             ticketMessage || `Request for ${ticketQuantity} ticket(s)`,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const isSuccess = 
//         response.data.success === true || 
//         response.data.status === true || 
//         response.data.message?.toLowerCase().includes("success");

//       if (isSuccess) {
//         const whatsappNumber = getWhatsAppNumber();
//         showToast(`Ticket request submitted! Opening WhatsApp to ${whatsappNumber}...`, "success");
        
//         setTicketModalVisible(false);
//         setTicketQuantity(1);
//         setTicketMessage("");
        
//         fetchMyRequestCount();
//         fetchMyTicketCount();
//         fetchTotalTicketsInGame();
        
//         setTimeout(() => {
//           redirectToWhatsApp();
//         }, 1000);
        
//         setTimeout(() => {
//           navigation.navigate("TicketRequestsScreen", { 
//             gameId: game.id,
//             gameName: game.game_name 
//           });
//         }, 4000);
//       } else {
//         const errorMessage = response.data.message || 
//                             response.data.error || 
//                             "Failed to submit request";
//         showToast(errorMessage, "error");
//       }
//     } catch (error) {
//       console.log("Request error:", error.response?.data || error.message);
      
//       let errorMessage = "Failed to submit ticket request. Please try again.";
      
//       if (error.response) {
//         errorMessage = error.response.data?.message || 
//                       error.response.data?.error || 
//                       `Server error: ${error.response.status}`;
//       } else if (error.request) {
//         errorMessage = "No response from server. Please check your connection.";
//       }
      
//       showToast(errorMessage, "error");
//     } finally {
//       setRequestLoading(false);
//     }
//   };

//   const navigateToTickets = () => {
//     navigation.navigate("TicketsScreen", { game });
//   };

//   const navigateToMyRequests = () => {
//     navigation.navigate("TicketRequestsScreen", { 
//       gameId: game.id,
//       gameName: game.game_name 
//     });
//   };

//   const handleJoinGameRoom = () => {
//     if (gameStatus?.status === 'scheduled') {
//       showToast("Game has not started yet!", "info");
//       return;
//     }
    
//     if (hasJoinedRoom) {
//       navigation.navigate("UserGameRoom", { 
//         gameId: game.id,
//         gameName: game.game_name,
//         gameStatus: gameStatus?.status
//       });
//     } else {
//       updateGameRoomStatus();
//     }
//   };

//   const renderTicketLimitInfo = () => {
//     const remaining = getRemainingTickets();
//     const hasLimit = hasReachedTicketLimit();
    
//     return (
//       <View style={[
//         styles.ticketLimitContainer,
//         hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
//       ]}>
//         <View style={styles.ticketLimitIcon}>
//           <Ionicons 
//             name={hasLimit ? "alert-circle" : "ticket"} 
//             size={16} 
//             color={hasLimit ? ERROR_COLOR : ACCENT_COLOR} 
//           />
//         </View>
//         <View style={styles.ticketLimitInfo}>
//           <Text style={[
//             styles.ticketLimitTitle,
//             hasLimit && styles.ticketLimitTitleReached
//           ]}>
//             {hasLimit ? "Ticket Limit Reached" : "Ticket Limit"}
//           </Text>
//           <Text style={styles.ticketLimitText}>
//             {hasLimit 
//               ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
//               : `You have ${myTicketCount} allocated + ${myRequestCount} pending = ${totalTicketsInGame}/4 tickets`
//             }
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const getRemainingTickets = () => {
//     return MAX_TICKETS_PER_USER - totalTicketsInGame;
//   };

//   const hasReachedTicketLimit = () => {
//     return totalTicketsInGame >= MAX_TICKETS_PER_USER;
//   };

//   const canRequestTickets = () => {
//     const remaining = getRemainingTickets();
//     return ticketQuantity <= remaining && remaining > 0;
//   };

//   const renderBackgroundPatterns = () => (
//     <View style={styles.backgroundPattern}>
//       {/* Poker chip animations */}
//       <Animated.View 
//         style={[
//           styles.pokerChip1, 
//           { 
//             transform: [
//               { translateY: translateY1 },
//               { translateX: translateY2 }
//             ] 
//           }
//         ]} 
//       />
//       <Animated.View 
//         style={[
//           styles.pokerChip2, 
//           { 
//             transform: [
//               { translateY: translateY2 },
//               { translateX: translateY1 }
//             ] 
//           }
//         ]} 
//       />
      
//       {/* Animated shine effect */}
//       <Animated.View 
//         style={[
//           styles.shineEffect,
//           { 
//             transform: [{ translateX: shineTranslateX }],
//             opacity: shineAnim
//           }
//         ]} 
//       />
      
//       {/* Yellow gradient overlay */}
//       <View style={styles.yellowGradient} />
      
//       {/* Blue gradient overlay */}
//       <View style={styles.blueGradient} />
//     </View>
//   );

//   const renderHeaderPatterns = () => (
//     <View style={styles.headerPattern}>
//       <Animated.View 
//         style={[
//           styles.headerShine,
//           { transform: [{ translateX: shineTranslateX }] }
//         ]} 
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Toast />
//       {renderBackgroundPatterns()}
      
//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={PRIMARY_COLOR}
//             colors={[PRIMARY_COLOR]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* HEADER - Clean design with white text */}
//         <Animated.View 
//           style={[
//             styles.header,
//             { transform: [{ scale: pulseAnim }] }
//           ]}
//         >
//           {renderHeaderPatterns()}
          
//           <View style={styles.headerContent}>
//             <View style={styles.headerTop}>
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Ionicons name="arrow-back" size={24} color={WHITE} />
//               </TouchableOpacity>
              
//               <View style={styles.headerTextContainer}>
//                 <Text style={styles.gameName} numberOfLines={2} ellipsizeMode="tail">
//                   {game.game_name}
//                 </Text>
//                 <View style={styles.gameCodeContainer}>
//                   <MaterialIcons
//                     name="fingerprint"
//                     size={14}
//                     color={WHITE}
//                   />
//                   <Text style={styles.gameCode}>{game.game_code}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Animated.View>

//         <View style={styles.content}>
//           {/* STATUS CARD */}
//           <View style={styles.card}>
//             <View style={styles.cardPattern} />
            
//             <View style={styles.cardHeader}>
//               <View style={styles.gameIconContainer}>
//                 <View style={styles.gameIconWrapper}>
//                   <MaterialIcons name="confirmation-number" size={32} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.cardTitleContainer}>
//                   <Text style={styles.cardTitle}>
//                     {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
//                       ? 'Game Status' 
//                       : 'Game Schedule'
//                     }
//                   </Text>
//                   <View style={[
//                     styles.statusBadge,
//                     { 
//                       backgroundColor: gameStatus?.status === 'live' 
//                         ? SUCCESS_COLOR 
//                         : gameStatus?.status === 'completed'
//                         ? '#9E9E9E'
//                         : ACCENT_COLOR
//                     }
//                   ]}>
//                     <Ionicons 
//                       name={
//                         gameStatus?.status === 'live' 
//                           ? 'radio-button-on' 
//                           : gameStatus?.status === 'completed'
//                           ? 'trophy'
//                           : 'time'
//                       } 
//                       size={12} 
//                       color={WHITE} 
//                     />
//                     <Text style={styles.statusBadgeText}>
//                       {gameStatus?.status?.toUpperCase() || 'LOADING'}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
            
//             {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
//               <View>
//                 <Text style={styles.cardDescription}>
//                   {gameStatus?.status === 'live'
//                     ? "The game is now live! Number calling has started."
//                     : "Game has been completed. You can still view the game room."
//                   }
//                 </Text>
//                 {callingStatus?.is_running ? (
//                   <View style={styles.statsContainer}>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="megaphone" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         {calledNumbers.length}
//                       </Text>
//                       <Text style={styles.statLabel}>Called</Text>
//                     </View>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         {timer}s
//                       </Text>
//                       <Text style={styles.statLabel}>Next Call</Text>
//                     </View>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="grid" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         {90 - calledNumbers.length}
//                       </Text>
//                       <Text style={styles.statLabel}>Remaining</Text>
//                     </View>
//                   </View>
//                 ) : gameStatus?.status === 'completed' ? (
//                   <View style={styles.statsContainer}>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="checkmark-done" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         {calledNumbers.length}
//                       </Text>
//                       <Text style={styles.statLabel}>Total Called</Text>
//                     </View>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="trophy" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         Completed
//                       </Text>
//                       <Text style={styles.statLabel}>Status</Text>
//                     </View>
//                     <View style={styles.statCard}>
//                       <View style={styles.statIcon}>
//                         <Ionicons name="time" size={20} color={ACCENT_COLOR} />
//                       </View>
//                       <Text style={styles.statValue}>
//                         {game.game_start_time}
//                       </Text>
//                       <Text style={styles.statLabel}>Started At</Text>
//                     </View>
//                   </View>
//                 ) : (
//                   <Text style={styles.waitingText}>
//                     Number calling will start soon...
//                   </Text>
//                 )}
                
//                 {gameStatus?.status === 'completed' ? (
//                   <View>
//                     {/* View Game Room Button */}
//                     <TouchableOpacity
//                       style={[styles.primaryButton, styles.viewRoomButton, joiningRoom && styles.buttonDisabled]}
//                       onPress={handleJoinGameRoom}
//                       disabled={joiningRoom}
//                     >
//                       {joiningRoom ? (
//                         <ActivityIndicator size="small" color={WHITE} />
//                       ) : (
//                         <>
//                           <Ionicons name="eye" size={20} color={WHITE} />
//                           <Text style={styles.primaryButtonText}>
//                             {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
//                           </Text>
//                         </>
//                       )}
//                     </TouchableOpacity>
                    
//                     {/* Game Results Button */}
//                     <TouchableOpacity
//                       style={[styles.secondaryButton, styles.resultsButton]}
//                       onPress={() => navigation.navigate("UserGameResult", { 
//                         gameId: game.id,
//                         gameName: game.game_name 
//                       })}
//                     >
//                       <Ionicons name="stats-chart" size={20} color={PRIMARY_COLOR} />
//                       <Text style={styles.secondaryButtonText}>Game Results</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <TouchableOpacity
//                     style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
//                     onPress={handleJoinGameRoom}
//                     disabled={joiningRoom}
//                   >
//                     {joiningRoom ? (
//                       <ActivityIndicator size="small" color={WHITE} />
//                     ) : (
//                       <>
//                         <Ionicons 
//                           name={hasJoinedRoom ? "enter" : "enter"} 
//                           size={20} 
//                           color={WHITE} 
//                         />
//                         <Text style={styles.primaryButtonText}>
//                           {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
//                         </Text>
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ) : (
//               <View>
//                 <Text style={styles.cardDescription}>
//                   Game is scheduled to start on {new Date(game.game_date).toLocaleDateString("en-US", {
//                     weekday: "long",
//                     month: "long",
//                     day: "numeric",
//                     year: "numeric"
//                   })} at {game.game_start_time}
//                 </Text>
//                 <View style={styles.scheduledBadgeContainer}>
//                   <Ionicons name="calendar" size={20} color={ACCENT_COLOR} />
//                   <Text style={styles.scheduledBadgeText}>
//                     Game is Scheduled
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* GAME DETAILS CARD */}
//           <View style={styles.card}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Game Details</Text>
//               <Ionicons name="game-controller" size={24} color={ACCENT_COLOR} />
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <Ionicons name="calendar" size={16} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Date</Text>
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {new Date(game.game_date).toLocaleDateString("en-US", {
//                       weekday: "short",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <Ionicons name="time" size={16} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Time</Text>
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {game.game_start_time}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <MaterialIcons name="account-balance-wallet" size={16} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Prize Pool</Text>
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {game.ticket_type === "paid"
//                       ? `₹${(game.ticket_cost * game.max_players).toLocaleString()}`
//                       : "Exciting Prizes"}
//                   </Text>
//                 </View>
//               </View>
              
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <Ionicons name="person" size={16} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Host</Text>
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {game.user?.name || 'Tambola Timez'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.detailItem}>
//                 <View style={styles.detailIcon}>
//                   <Ionicons name="call" size={16} color={ACCENT_COLOR} />
//                 </View>
//                 <View>
//                   <Text style={styles.detailLabel}>Host Contact</Text>
//                   <Text style={styles.detailText} numberOfLines={1}>
//                     {getWhatsAppNumber()}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {renderTicketLimitInfo()}

//             <View style={styles.myCountContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.countButton,
//                   myTicketCount > 0 ? styles.hasCountButton : styles.noCountButton,
//                 ]}
//                 onPress={navigateToTickets}
//               >
//                 <View style={styles.countIcon}>
//                   <Ionicons name="ticket" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.countInfo}>
//                   <Text style={styles.countLabel}>My Tickets</Text>
//                   <Text style={[
//                     styles.countValue,
//                     myTicketCount > 0 ? styles.hasCountValue : styles.noCountValue,
//                   ]}>
//                     {myTicketCount > 0
//                       ? `${myTicketCount} Ticket${myTicketCount > 1 ? "s" : ""}`
//                       : "No Tickets"}
//                   </Text>
//                 </View>
//                 {myTicketCount > 0 && (
//                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.countButton,
//                   myRequestCount > 0 ? styles.hasCountButton : styles.noCountButton,
//                 ]}
//                 onPress={navigateToMyRequests}
//               >
//                 <View style={styles.countIcon}>
//                   <Ionicons name="list-circle" size={20} color={ACCENT_COLOR} />
//                 </View>
//                 <View style={styles.countInfo}>
//                   <Text style={styles.countLabel}>My Requests</Text>
//                   <Text style={[
//                     styles.countValue,
//                     myRequestCount > 0 ? styles.hasCountValue : styles.noCountValue,
//                   ]}>
//                     {myRequestCount > 0
//                       ? `${myRequestCount} Request${myRequestCount > 1 ? "s" : ""}`
//                       : "No Requests"}
//                   </Text>
//                 </View>
//                 {myRequestCount > 0 && (
//                   <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
//                 )}
//               </TouchableOpacity>
//             </View>

//             {game.message && (
//               <View style={styles.messageCard}>
//                 <View style={styles.messageHeader}>
//                   <MaterialIcons name="message" size={18} color={ACCENT_COLOR} />
//                   <Text style={styles.messageTitle}>Host Message</Text>
//                 </View>
//                 <Text style={styles.messageContent}>{game.message}</Text>
//               </View>
//             )}
//           </View>

//           {/* ACTIONS CARD */}
//           <View style={styles.card}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Actions</Text>
//               <Ionicons name="flash" size={24} color={ACCENT_COLOR} />
//             </View>

//             <View style={styles.actionsContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   styles.primaryActionButton,
//                   (hasReachedTicketLimit() || loading) && styles.disabledButton,
//                 ]}
//                 onPress={() => {
//                   if (!hasReachedTicketLimit()) {
//                     setTicketModalVisible(true);
//                   } else {
//                     showToast(`You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`, "error");
//                   }
//                 }}
//                 disabled={hasReachedTicketLimit() || loading}
//               >
//                 <View style={styles.actionButtonIcon}>
//                   <Ionicons name="add-circle" size={24} color={WHITE} />
//                 </View>
//                 <Text style={styles.actionButtonText}>
//                   {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   styles.secondaryActionButton,
//                   myTicketCount === 0 && styles.disabledButton,
//                 ]}
//                 onPress={navigateToTickets}
//                 disabled={myTicketCount === 0}
//               >
//                 <View style={styles.actionButtonIcon}>
//                   <Ionicons name="ticket" size={24} color={PRIMARY_COLOR} />
//                 </View>
//                 <Text style={styles.secondaryActionButtonText}>
//                   My Tickets
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   styles.secondaryActionButton,
//                   myRequestCount === 0 && styles.disabledButton,
//                 ]}
//                 onPress={navigateToMyRequests}
//                 disabled={myRequestCount === 0}
//               >
//                 <View style={styles.actionButtonIcon}>
//                   <Ionicons name="list-circle" size={24} color={PRIMARY_COLOR} />
//                 </View>
//                 <Text style={styles.secondaryActionButtonText}>
//                   My Requests
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* REWARDS CARD */}
//           {game.pattern_rewards && game.pattern_rewards.length > 0 && (
//             <View style={styles.card}>
//               <View style={styles.sectionHeader}>
//                 <Text style={styles.sectionTitle}>Game Rewards</Text>
//                 <Ionicons name="trophy" size={24} color={ACCENT_COLOR} />
//               </View>
              
//               {game.pattern_rewards.map((reward, index) => (
//                 <View key={reward.pattern_id} style={styles.rewardCard}>
//                   <View style={styles.rewardPattern} />
                  
//                   <View style={styles.rewardHeader}>
//                     <View style={styles.rewardIcon}>
//                       <MaterialIcons name="emoji-events" size={24} color={ACCENT_COLOR} />
//                     </View>
//                     <View style={styles.rewardInfo}>
//                       <Text style={styles.rewardName} numberOfLines={1}>
//                         {reward.reward_name}
//                       </Text>
//                       <Text style={styles.rewardDescription} numberOfLines={2}>
//                         {reward.description}
//                       </Text>
//                     </View>
//                     <View style={styles.rewardAmountContainer}>
//                       <Text style={styles.rewardAmount} numberOfLines={1}>
//                         ₹{reward.amount}
//                       </Text>
//                     </View>
//                   </View>
                  
//                   <View style={styles.rewardFooter}>
//                     <View style={styles.rewardDetail}>
//                       <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
//                       <Text style={styles.rewardDetailText} numberOfLines={1}>
//                         Count: {reward.reward_count}
//                       </Text>
//                     </View>
//                     <View style={styles.patternBadge}>
//                       <Text style={styles.patternBadgeText} numberOfLines={1}>
//                         Pattern {reward.pattern_id}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//         <View style={styles.bottomSpace} />
//       </ScrollView>

//       {/* TICKET MODAL */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={ticketModalVisible}
//         onRequestClose={() => setTicketModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Request Tickets</Text>
//               <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
//                 <Ionicons name="close" size={24} color={PRIMARY_COLOR} />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalGameInfo}>
//               <Text style={styles.modalGameName} numberOfLines={2}>
//                 {game.game_name}
//               </Text>
//               <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
//               <View style={styles.modalTicketCost}>
//                 <Text style={[
//                   styles.modalTicketCostText,
//                   { color: game.ticket_type === "paid" ? ACCENT_COLOR : ACCENT_COLOR }
//                 ]}>
//                   Ticket Price: {game.ticket_type === "paid" ? `₹${game.ticket_cost}` : "FREE"}
//                 </Text>
//               </View>
//               <View style={styles.modalHostInfo}>
//                 <Text style={styles.modalHostText}>
//                   Host: {game.user?.name || "Game Host"} ({getWhatsAppNumber()})
//                 </Text>
//               </View>
//             </View>

//             <View style={[
//               styles.modalLimitInfo,
//               hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
//             ]}>
//               <Ionicons 
//                 name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
//                 size={18} 
//                 color={hasReachedTicketLimit() ? ERROR_COLOR : ACCENT_COLOR} 
//               />
//               <Text style={styles.modalLimitText}>
//                 {hasReachedTicketLimit() 
//                   ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
//                   : `You can request up to ${getRemainingTickets()} more ticket(s)`
//                 }
//               </Text>
//             </View>

//             <View style={styles.quantitySection}>
//               <Text style={styles.quantityLabel}>Select Quantity (1-4)</Text>
//               <View style={styles.quantitySelector}>
//                 {[1, 2, 3, 4].map((num) => {
//                   const canSelect = num <= getRemainingTickets() && !hasReachedTicketLimit();
//                   return (
//                     <TouchableOpacity
//                       key={num}
//                       style={[
//                         styles.quantityButton,
//                         ticketQuantity === num && styles.quantityButtonActive,
//                         !canSelect && styles.quantityButtonDisabled,
//                       ]}
//                       onPress={() => canSelect && setTicketQuantity(num)}
//                       disabled={!canSelect}
//                     >
//                       <Text
//                         style={[
//                           styles.quantityButtonText,
//                           ticketQuantity === num && styles.quantityButtonTextActive,
//                           !canSelect && styles.quantityButtonTextDisabled,
//                         ]}
//                       >
//                         {num}
//                       </Text>
//                       {!canSelect && (
//                         <Ionicons 
//                           name="close-circle" 
//                           size={12} 
//                           color={ERROR_COLOR} 
//                           style={styles.quantityDisabledIcon}
//                         />
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>

//             {game.ticket_type === "paid" && (
//               <View style={styles.totalSection}>
//                 <View style={styles.totalLabelContainer}>
//                   <Ionicons name="wallet" size={20} color={ACCENT_COLOR} />
//                   <Text style={styles.totalLabel}>Total Amount:</Text>
//                 </View>
//                 <Text style={styles.totalAmount} numberOfLines={1}>
//                   ₹{game.ticket_cost * ticketQuantity}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.messageSection}>
//               <Text style={styles.messageLabel}>Message (Optional)</Text>
//               <TextInput
//                 style={styles.messageInput}
//                 value={ticketMessage}
//                 onChangeText={setTicketMessage}
//                 placeholder="Add a message for the host..."
//                 multiline
//                 numberOfLines={3}
//                 maxLength={200}
//                 placeholderTextColor={TEXT_LIGHT}
//               />
//               <Text style={styles.charCount}>
//                 {ticketMessage.length}/200 characters
//               </Text>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setTicketModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.submitButtonDisabled,
//                 ]}
//                 onPress={handleRequestTickets}
//                 disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
//               >
//                 {requestLoading ? (
//                   <ActivityIndicator size="small" color={WHITE} />
//                 ) : (
//                   <>
//                     <Ionicons name="send" size={18} color={WHITE} />
//                     <Text style={styles.submitButtonText}>
//                       {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
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
//     top: 80,
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
//     backgroundColor: 'rgba(255, 152, 0, 0.05)',
//   },
//   blueGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 200,
//     backgroundColor: 'rgba(79, 172, 254, 0.05)',
//   },
//   toast: {
//     position: 'absolute',
//     top: 60,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//     zIndex: 999,
//   },
//   toastText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 10,
//     flex: 1,
//   },
//   header: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingTop: 20,
//     paddingBottom: 20,
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
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   gameName: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: WHITE,
//     letterSpacing: -0.5,
//   },
//   gameCodeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 2,
//   },
//   gameCode: {
//     fontSize: 14,
//     color: WHITE,
//     fontWeight: "600",
//   },
//   content: {
//     padding: 20,
//     zIndex: 1,
//     marginTop: 0,
//   },
//   card: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
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
//   cardPattern: {
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
//     marginBottom: 16,
//   },
//   gameIconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
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
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cardTitleContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 4,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//     alignSelf: 'flex-start',
//   },
//   statusBadgeText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: WHITE,
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: TEXT_LIGHT,
//     lineHeight: 20,
//     marginBottom: 16,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   statCard: {
//     alignItems: "center",
//     flex: 1,
//   },
//   statIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: BACKGROUND_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 6,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   waitingText: {
//     fontSize: 14,
//     color: ACCENT_COLOR,
//     fontStyle: "italic",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   primaryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: PRIMARY_COLOR,
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   primaryButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   scheduledBadgeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: BACKGROUND_COLOR,
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   scheduledBadgeText: {
//     color: PRIMARY_COLOR,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   viewRoomButton: {
//     marginBottom: 8,
//   },
//   secondaryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: BACKGROUND_COLOR,
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   resultsButton: {
//     marginTop: 0,
//   },
//   secondaryButtonText: {
//     color: PRIMARY_COLOR,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   ticketLimitContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//     borderWidth: 1,
//     gap: 12,
//   },
//   ticketLimitReached: {
//     backgroundColor: "rgba(231, 76, 60, 0.05)",
//     borderColor: "rgba(231, 76, 60, 0.2)",
//   },
//   ticketLimitAvailable: {
//     backgroundColor: "rgba(79, 172, 254, 0.05)",
//     borderColor: "rgba(79, 172, 254, 0.2)",
//   },
//   ticketLimitIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: BACKGROUND_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   ticketLimitInfo: {
//     flex: 1,
//   },
//   ticketLimitTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 2,
//   },
//   ticketLimitTitleReached: {
//     color: ERROR_COLOR,
//   },
//   ticketLimitText: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     lineHeight: 16,
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
//   myCountContainer: {
//     gap: 8,
//     marginBottom: 16,
//   },
//   countButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     gap: 12,
//   },
//   hasCountButton: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderColor: PRIMARY_COLOR,
//   },
//   noCountButton: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderColor: BORDER_COLOR,
//     opacity: 0.7,
//   },
//   countIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   countInfo: {
//     flex: 1,
//   },
//   countLabel: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   countValue: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   hasCountValue: {
//     color: TEXT_DARK,
//   },
//   noCountValue: {
//     color: TEXT_LIGHT,
//   },
//   messageCard: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 10,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   messageHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 8,
//   },
//   messageTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   messageContent: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     lineHeight: 18,
//   },
//   actionsContainer: {
//     gap: 12,
//   },
//   actionButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//   },
//   actionButtonIcon: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   primaryActionButton: {
//     backgroundColor: PRIMARY_COLOR,
//   },
//   actionButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   secondaryActionButton: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   secondaryActionButtonText: {
//     color: PRIMARY_COLOR,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   rewardCard: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   rewardPattern: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 40,
//     height: 40,
//     borderBottomLeftRadius: 10,
//     borderTopRightRadius: 15,
//     backgroundColor: 'rgba(79, 172, 254, 0.05)',
//   },
//   rewardHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     marginBottom: 8,
//   },
//   rewardIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 8,
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   rewardInfo: {
//     flex: 1,
//   },
//   rewardName: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 2,
//   },
//   rewardDescription: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     lineHeight: 16,
//   },
//   rewardAmountContainer: {
//     minWidth: 60,
//   },
//   rewardAmount: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//     textAlign: 'right',
//   },
//   rewardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   rewardDetail: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   rewardDetailText: {
//     fontSize: 11,
//     color: TEXT_LIGHT,
//   },
//   patternBadge: {
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   patternBadgeText: {
//     fontSize: 10,
//     color: PRIMARY_COLOR,
//     fontWeight: "600",
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   modalContainer: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 20,
//     width: "100%",
//     maxWidth: 400,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   modalGameInfo: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   modalGameName: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: TEXT_DARK,
//     marginBottom: 4,
//   },
//   modalGameId: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     marginBottom: 8,
//   },
//   modalTicketCost: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   modalTicketCostText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: ACCENT_COLOR,
//   },
//   modalHostInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   modalHostText: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//   },
//   modalLimitInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     gap: 10,
//     borderWidth: 1,
//   },
//   modalLimitReached: {
//     backgroundColor: "rgba(231, 76, 60, 0.05)",
//     borderColor: "rgba(231, 76, 60, 0.2)",
//   },
//   modalLimitAvailable: {
//     backgroundColor: "rgba(79, 172, 254, 0.05)",
//     borderColor: "rgba(79, 172, 254, 0.2)",
//   },
//   modalLimitText: {
//     flex: 1,
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     lineHeight: 18,
//   },
//   quantitySection: {
//     marginBottom: 20,
//   },
//   quantityLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: TEXT_DARK,
//     marginBottom: 12,
//   },
//   quantitySelector: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   quantityButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     backgroundColor: BACKGROUND_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     position: 'relative',
//   },
//   quantityButtonActive: {
//     backgroundColor: PRIMARY_COLOR,
//     borderColor: PRIMARY_COLOR,
//   },
//   quantityButtonDisabled: {
//     backgroundColor: BACKGROUND_COLOR,
//     opacity: 0.5,
//   },
//   quantityButtonText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   quantityButtonTextActive: {
//     color: WHITE,
//   },
//   quantityButtonTextDisabled: {
//     color: TEXT_LIGHT,
//     textDecorationLine: 'line-through',
//   },
//   quantityDisabledIcon: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: WHITE,
//     borderRadius: 6,
//   },
//   totalSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: BACKGROUND_COLOR,
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   totalLabelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: TEXT_DARK,
//   },
//   totalAmount: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: ACCENT_COLOR,
//   },
//   messageSection: {
//     marginBottom: 20,
//   },
//   messageLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: TEXT_DARK,
//     marginBottom: 8,
//   },
//   messageInput: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 10,
//     padding: 15,
//     fontSize: 14,
//     minHeight: 80,
//     textAlignVertical: "top",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     color: TEXT_DARK,
//   },
//   charCount: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     textAlign: "right",
//     marginTop: 4,
//   },
//   modalActions: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   cancelButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: TEXT_LIGHT,
//   },
//   submitButton: {
//     flex: 2,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderRadius: 10,
//     gap: 8,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   submitButtonDisabled: {
//     opacity: 0.5,
//   },
//   submitButtonText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: WHITE,
//   },
// });

// export default GameDetails;






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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

// Updated color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SUCCESS_COLOR = "#4CAF50"; // Green for success states
const ERROR_COLOR = "#E74C3C"; // Red for errors

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

  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const MAX_TICKETS_PER_USER = 4;

  // Calculate total prize pool from pattern rewards
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
    
    return `🎯 *TAMBOOLA TICKET REQUEST* 🎯

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
Looking forward to playing Tambola! 🎲🎉`;
  };

  const redirectToWhatsApp = () => {
    const whatsappNumber = getWhatsAppNumber();
    const message = createWhatsAppMessage();
    const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          const webWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((error) => {
        console.log("Error opening WhatsApp:", error);
        Alert.alert(
          "Error",
          "Could not open WhatsApp. Please make sure WhatsApp is installed on your device.",
          [{ text: "OK" }]
        );
      });
  };

  useEffect(() => {
    startAnimations();
    fetchAllData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllData();
      setJoiningRoom(false);
      setHasJoinedRoom(false);
    });

    return () => {
      unsubscribe();
    };
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

    // Slow rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Shine animation
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

  // Interpolations for animations
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
      console.log("Error fetching all data:", error);
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

  const Toast = () => {
    if (!toast.visible) return null;
    
    const backgroundColor = toast.type === "success" ? SUCCESS_COLOR : ERROR_COLOR;
    
    useEffect(() => {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={[styles.toast, { backgroundColor }]}>
        <Ionicons 
          name={toast.type === "success" ? "checkmark-circle" : "alert-circle"} 
          size={20} 
          color={WHITE} 
        />
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
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
      console.log("Error fetching game status:", error);
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
      console.log("Error fetching ticket count:", error);
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
      console.log("Error fetching request count:", error);
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
      console.log("Error fetching total tickets:", error);
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
      console.log("Error updating game room status:", error.response?.data || error.message);
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
      console.log("Request error:", error.response?.data || error.message);
      
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
      <View style={[
        styles.ticketLimitContainer,
        hasLimit ? styles.ticketLimitReached : styles.ticketLimitAvailable
      ]}>
        <View style={styles.ticketLimitIcon}>
          <Ionicons 
            name={hasLimit ? "alert-circle" : "ticket"} 
            size={16} 
            color={hasLimit ? ERROR_COLOR : ACCENT_COLOR} 
          />
        </View>
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
      </View>
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
      {/* Poker chip animations */}
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
      
      {/* Animated shine effect */}
      <Animated.View 
        style={[
          styles.shineEffect,
          { 
            transform: [{ translateX: shineTranslateX }],
            opacity: shineAnim
          }
        ]} 
      />
      
      {/* Yellow gradient overlay */}
      <View style={styles.yellowGradient} />
      
      {/* Blue gradient overlay */}
      <View style={styles.blueGradient} />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Toast />
      {renderBackgroundPatterns()}
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER - Clean design with white text */}
        <Animated.View 
          style={[
            styles.header,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          {renderHeaderPatterns()}
          
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={WHITE} />
              </TouchableOpacity>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.gameName} numberOfLines={2} ellipsizeMode="tail">
                  {game.game_name}
                </Text>
                <View style={styles.gameCodeContainer}>
                  <MaterialIcons
                    name="fingerprint"
                    size={14}
                    color={WHITE}
                  />
                  <Text style={styles.gameCode}>{game.game_code}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* STATUS CARD */}
          <View style={styles.card}>
            <View style={styles.cardPattern} />
            
            <View style={styles.cardHeader}>
              <View style={styles.gameIconContainer}>
                <View style={styles.gameIconWrapper}>
                  <MaterialIcons name="confirmation-number" size={32} color={ACCENT_COLOR} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>
                    {gameStatus?.status === 'live' || gameStatus?.status === 'completed' 
                      ? 'Game Status' 
                      : 'Game Schedule'
                    }
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    { 
                      backgroundColor: gameStatus?.status === 'live' 
                        ? SUCCESS_COLOR 
                        : gameStatus?.status === 'completed'
                        ? '#9E9E9E'
                        : ACCENT_COLOR
                    }
                  ]}>
                    <Ionicons 
                      name={
                        gameStatus?.status === 'live' 
                          ? 'radio-button-on' 
                          : gameStatus?.status === 'completed'
                          ? 'trophy'
                          : 'time'
                      } 
                      size={12} 
                      color={WHITE} 
                    />
                    <Text style={styles.statusBadgeText}>
                      {gameStatus?.status?.toUpperCase() || 'LOADING'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {gameStatus?.status === 'live' || gameStatus?.status === 'completed' ? (
              <View>
                <Text style={styles.cardDescription}>
                  {gameStatus?.status === 'live'
                    ? "The game is now live! Number calling has started."
                    : "Game has been completed. You can still view the game room."
                  }
                </Text>
                {callingStatus?.is_running ? (
                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="megaphone" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        {calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Called</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="time" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        {timer}s
                      </Text>
                      <Text style={styles.statLabel}>Next Call</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="grid" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        {90 - calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                  </View>
                ) : gameStatus?.status === 'completed' ? (
                  <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="checkmark-done" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        {calledNumbers.length}
                      </Text>
                      <Text style={styles.statLabel}>Total Called</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="trophy" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        Completed
                      </Text>
                      <Text style={styles.statLabel}>Status</Text>
                    </View>
                    <View style={styles.statCard}>
                      <View style={styles.statIcon}>
                        <Ionicons name="time" size={20} color={ACCENT_COLOR} />
                      </View>
                      <Text style={styles.statValue}>
                        {game.game_start_time}
                      </Text>
                      <Text style={styles.statLabel}>Started At</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.waitingText}>
                    Number calling will start soon...
                  </Text>
                )}
                
                {gameStatus?.status === 'completed' ? (
                  <View>
                    {/* View Game Room Button */}
                    <TouchableOpacity
                      style={[styles.primaryButton, styles.viewRoomButton, joiningRoom && styles.buttonDisabled]}
                      onPress={handleJoinGameRoom}
                      disabled={joiningRoom}
                    >
                      {joiningRoom ? (
                        <ActivityIndicator size="small" color={WHITE} />
                      ) : (
                        <>
                          <Ionicons name="eye" size={20} color={WHITE} />
                          <Text style={styles.primaryButtonText}>
                            {hasJoinedRoom ? "View Game Room" : "View Completed Game"}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    {/* Game Results Button */}
                    <TouchableOpacity
                      style={[styles.secondaryButton, styles.resultsButton]}
                      onPress={() => navigation.navigate("UserGameResult", { 
                        gameId: game.id,
                        gameName: game.game_name 
                      })}
                    >
                      <Ionicons name="stats-chart" size={20} color={PRIMARY_COLOR} />
                      <Text style={styles.secondaryButtonText}>Game Results</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.primaryButton, joiningRoom && styles.buttonDisabled]}
                    onPress={handleJoinGameRoom}
                    disabled={joiningRoom}
                  >
                    {joiningRoom ? (
                      <ActivityIndicator size="small" color={WHITE} />
                    ) : (
                      <>
                        <Ionicons 
                          name={hasJoinedRoom ? "enter" : "enter"} 
                          size={20} 
                          color={WHITE} 
                        />
                        <Text style={styles.primaryButtonText}>
                          {hasJoinedRoom ? "Re-enter Game Room" : "Join Game Room"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
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
                <View style={styles.scheduledBadgeContainer}>
                  <Ionicons name="calendar" size={20} color={ACCENT_COLOR} />
                  <Text style={styles.scheduledBadgeText}>
                    Game is Scheduled
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* GAME DETAILS CARD */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Game Details</Text>
              <Ionicons name="game-controller" size={24} color={ACCENT_COLOR} />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar" size={16} color={ACCENT_COLOR} />
                </View>
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
                <View style={styles.detailIcon}>
                  <Ionicons name="time" size={16} color={ACCENT_COLOR} />
                </View>
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
                <View style={styles.detailIcon}>
                  <MaterialIcons name="account-balance-wallet" size={16} color={ACCENT_COLOR} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Total Prize Pool</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {totalPrizePool ? `₹${totalPrizePool.toLocaleString()}` : "Exciting Prizes"}
                  </Text>
                  {/* {game.pattern_rewards && game.pattern_rewards.length > 0 && (
                    <Text style={styles.detailSubtext}>
                      {game.pattern_rewards.length} Pattern{game.pattern_rewards.length > 1 ? 's' : ''}
                    </Text>
                  )} */}
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="person" size={16} color={ACCENT_COLOR} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Host</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {game.user?.name || 'Tambola Timez'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="call" size={16} color={ACCENT_COLOR} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Host Contact</Text>
                  <Text style={styles.detailText} numberOfLines={1}>
                    {getWhatsAppNumber()}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <MaterialIcons name="confirmation-number" size={16} color={ACCENT_COLOR} />
                </View>
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
              <TouchableOpacity
                style={[
                  styles.countButton,
                  myTicketCount > 0 ? styles.hasCountButton : styles.noCountButton,
                ]}
                onPress={navigateToTickets}
              >
                <View style={styles.countIcon}>
                  <Ionicons name="ticket" size={20} color={ACCENT_COLOR} />
                </View>
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
                  <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.countButton,
                  myRequestCount > 0 ? styles.hasCountButton : styles.noCountButton,
                ]}
                onPress={navigateToMyRequests}
              >
                <View style={styles.countIcon}>
                  <Ionicons name="list-circle" size={20} color={ACCENT_COLOR} />
                </View>
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
                  <Ionicons name="arrow-forward" size={16} color={ACCENT_COLOR} />
                )}
              </TouchableOpacity>
            </View>

            {game.message && (
              <View style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <MaterialIcons name="message" size={18} color={ACCENT_COLOR} />
                  <Text style={styles.messageTitle}>Host Message</Text>
                </View>
                <Text style={styles.messageContent}>{game.message}</Text>
              </View>
            )}
          </View>

          {/* ACTIONS CARD */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actions</Text>
              <Ionicons name="flash" size={24} color={ACCENT_COLOR} />
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.primaryActionButton,
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
              >
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="add-circle" size={24} color={WHITE} />
                </View>
                <Text style={styles.actionButtonText}>
                  {hasReachedTicketLimit() ? "Limit Reached" : "Request Tickets"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryActionButton,
                  myTicketCount === 0 && styles.disabledButton,
                ]}
                onPress={navigateToTickets}
                disabled={myTicketCount === 0}
              >
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="ticket" size={24} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.secondaryActionButtonText}>
                  My Tickets
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.secondaryActionButton,
                  myRequestCount === 0 && styles.disabledButton,
                ]}
                onPress={navigateToMyRequests}
                disabled={myRequestCount === 0}
              >
                <View style={styles.actionButtonIcon}>
                  <Ionicons name="list-circle" size={24} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.secondaryActionButtonText}>
                  My Requests
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* REWARDS CARD */}
          {game.pattern_rewards && game.pattern_rewards.length > 0 && (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Game Rewards</Text>
                <View style={styles.totalRewardsBadge}>
                  <Text style={styles.totalRewardsText}>
                    Total: ₹{totalPrizePool?.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              {game.pattern_rewards.map((reward, index) => (
                <View key={reward.pattern_id} style={styles.rewardCard}>
                  <View style={styles.rewardPattern} />
                  
                  <View style={styles.rewardHeader}>
                    <View style={styles.rewardIcon}>
                      <MaterialIcons name="emoji-events" size={24} color={ACCENT_COLOR} />
                    </View>
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
                      <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
                      <Text style={styles.rewardDetailText} numberOfLines={1}>
                        {reward.reward_count} Winner{reward.reward_count > 1 ? 's' : ''} × ₹{reward.amount}
                      </Text>
                    </View>
                    <View style={styles.patternBadge}>
                      <Text style={styles.patternBadgeText} numberOfLines={1}>
                        Pattern {reward.pattern_id}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* TICKET MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ticketModalVisible}
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Tickets</Text>
              <TouchableOpacity onPress={() => setTicketModalVisible(false)}>
                <Ionicons name="close" size={24} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalGameInfo}>
              <Text style={styles.modalGameName} numberOfLines={2}>
                {game.game_name}
              </Text>
              <Text style={styles.modalGameId}>ID: {game.game_code}</Text>
              <View style={styles.modalTicketCost}>
                <Text style={[
                  styles.modalTicketCostText,
                  { color: game.ticket_type === "paid" ? ACCENT_COLOR : ACCENT_COLOR }
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
            </View>

            <View style={[
              styles.modalLimitInfo,
              hasReachedTicketLimit() ? styles.modalLimitReached : styles.modalLimitAvailable
            ]}>
              <Ionicons 
                name={hasReachedTicketLimit() ? "alert-circle" : "information-circle"} 
                size={18} 
                color={hasReachedTicketLimit() ? ERROR_COLOR : ACCENT_COLOR} 
              />
              <Text style={styles.modalLimitText}>
                {hasReachedTicketLimit() 
                  ? `You have reached the maximum limit of ${MAX_TICKETS_PER_USER} tickets`
                  : `You can request up to ${getRemainingTickets()} more ticket(s)`
                }
              </Text>
            </View>

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
                          color={ERROR_COLOR} 
                          style={styles.quantityDisabledIcon}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {game.ticket_type === "paid" && (
              <View style={styles.totalSection}>
                <View style={styles.totalLabelContainer}>
                  <Ionicons name="wallet" size={20} color={ACCENT_COLOR} />
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                </View>
                <Text style={styles.totalAmount} numberOfLines={1}>
                  ₹{(game.ticket_cost * ticketQuantity).toLocaleString()}
                </Text>
              </View>
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
                placeholderTextColor={TEXT_LIGHT}
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

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (requestLoading || hasReachedTicketLimit() || !canRequestTickets()) && styles.submitButtonDisabled,
                ]}
                onPress={handleRequestTickets}
                disabled={requestLoading || hasReachedTicketLimit() || !canRequestTickets()}
              >
                {requestLoading ? (
                  <ActivityIndicator size="small" color={WHITE} />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color={WHITE} />
                    <Text style={styles.submitButtonText}>
                      {hasReachedTicketLimit() ? "Limit Reached" : "Submit Request"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: BACKGROUND_COLOR,
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
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
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
  yellowGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  blueGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
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
    color: WHITE,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
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
  gameName: {
    fontSize: 20,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.5,
  },
  gameCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  gameCode: {
    fontSize: 14,
    color: WHITE,
    fontWeight: "600",
  },
  content: {
    padding: 20,
    zIndex: 1,
    marginTop: 0,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  cardPattern: {
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
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
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
    color: TEXT_DARK,
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
    color: WHITE,
  },
  cardDescription: {
    fontSize: 14,
    color: TEXT_LIGHT,
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
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  waitingText: {
    fontSize: 14,
    color: ACCENT_COLOR,
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  scheduledBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  scheduledBadgeText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "600",
  },
  viewRoomButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  resultsButton: {
    marginTop: 0,
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
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
    color: TEXT_DARK,
  },
  totalRewardsBadge: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  totalRewardsText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
  },
  detailSubtext: {
    fontSize: 10,
    color: TEXT_LIGHT,
    marginTop: 2,
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
    backgroundColor: "rgba(231, 76, 60, 0.05)",
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  ticketLimitAvailable: {
    backgroundColor: "rgba(79, 172, 254, 0.05)",
    borderColor: "rgba(79, 172, 254, 0.2)",
  },
  ticketLimitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  ticketLimitInfo: {
    flex: 1,
  },
  ticketLimitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  ticketLimitTitleReached: {
    color: ERROR_COLOR,
  },
  ticketLimitText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
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
  myCountContainer: {
    gap: 8,
    marginBottom: 16,
  },
  countButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  hasCountButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  noCountButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderColor: BORDER_COLOR,
    opacity: 0.7,
  },
  countIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  countInfo: {
    flex: 1,
  },
  countLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginBottom: 2,
  },
  countValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  hasCountValue: {
    color: TEXT_DARK,
  },
  noCountValue: {
    color: TEXT_LIGHT,
  },
  messageCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    color: TEXT_DARK,
  },
  messageContent: {
    fontSize: 13,
    color: TEXT_LIGHT,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  actionButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryActionButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  secondaryActionButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
  rewardCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
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
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
  },
  rewardAmountContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: ACCENT_COLOR,
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
    color: TEXT_LIGHT,
  },
  patternBadge: {
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  patternBadgeText: {
    fontSize: 10,
    color: PRIMARY_COLOR,
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
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    color: TEXT_DARK,
  },
  modalGameInfo: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  modalGameName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  modalGameId: {
    fontSize: 13,
    color: TEXT_LIGHT,
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
    color: ACCENT_COLOR,
  },
  modalPrizePool: {
    marginBottom: 8,
  },
  modalPrizePoolText: {
    fontSize: 14,
    fontWeight: "600",
    color: SUCCESS_COLOR,
  },
  modalHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHostText: {
    fontSize: 12,
    color: TEXT_LIGHT,
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
    backgroundColor: "rgba(231, 76, 60, 0.05)",
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  modalLimitAvailable: {
    backgroundColor: "rgba(79, 172, 254, 0.05)",
    borderColor: "rgba(79, 172, 254, 0.2)",
  },
  modalLimitText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_LIGHT,
    lineHeight: 18,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
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
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
  },
  quantityButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  quantityButtonDisabled: {
    backgroundColor: BACKGROUND_COLOR,
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  quantityButtonTextActive: {
    color: WHITE,
  },
  quantityButtonTextDisabled: {
    color: TEXT_LIGHT,
    textDecorationLine: 'line-through',
  },
  quantityDisabledIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: WHITE,
    borderRadius: 6,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  totalLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: ACCENT_COLOR,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    color: TEXT_DARK,
  },
  charCount: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: "right",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_LIGHT,
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    backgroundColor: PRIMARY_COLOR,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: WHITE,
  },
});

export default GameDetails;
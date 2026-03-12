// // // import React, { useEffect, useState, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // //   Image,
// // //   RefreshControl,
// // //   SafeAreaView,
// // //   Dimensions,
// // //   AppState,
// // //   StatusBar,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";

// // // // For React Native CLI, use react-native-vector-icons
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";

// // // const { width } = Dimensions.get("window");

// // // // Updated Color scheme matching FAQ and Home
// // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
// // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// // // const WHITE = "#FFFFFF";

// // // const TicketRequestsScreen = ({ route, navigation }) => {
// // //   const { gameId, gameName } = route.params;
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [requests, setRequests] = useState([]);
// // //   const [stats, setStats] = useState({
// // //     total: 0,
// // //     pending: 0,
// // //     approved: 0,
// // //     rejected: 0,
// // //     cancelled: 0,
// // //   });
  
// // //   // Polling state
// // //   const [isPolling, setIsPolling] = useState(false);
// // //   const pollingIntervalRef = useRef(null);
// // //   const appState = useRef(AppState.currentState);
  
// // //   // Polling configuration
// // //   const POLLING_INTERVAL = 3000; // 10 seconds
// // //   const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
// // //   const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

// // //   useEffect(() => {
// // //     console.log("Screen mounted, fetching requests for game:", gameId);
// // //     fetchTicketRequests();
    
// // //     // Start polling when component mounts
// // //     startPolling();
    
// // //     // Setup app state listener for background/foreground
// // //     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
// // //     // Cleanup on unmount
// // //     return () => {
// // //       console.log("Component unmounting, cleaning up...");
// // //       stopPolling();
// // //       subscription.remove();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     // Auto-stop polling after MAX_POLLING_DURATION to save battery
// // //     const autoStopTimer = setTimeout(() => {
// // //       if (isPolling) {
// // //         console.log("Auto-stopping polling after maximum duration");
// // //         stopPolling();
// // //       }
// // //     }, MAX_POLLING_DURATION);

// // //     return () => clearTimeout(autoStopTimer);
// // //   }, [isPolling]);

// // //   const handleAppStateChange = (nextAppState) => {
// // //     console.log("App state changed:", nextAppState);
    
// // //     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
// // //       // App going to background
// // //       console.log("App going to background, adjusting polling interval");
// // //       adjustPollingForBackground();
// // //     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
// // //       // App coming to foreground
// // //       console.log("App coming to foreground, resuming normal polling");
// // //       adjustPollingForForeground();
// // //     }
    
// // //     appState.current = nextAppState;
// // //   };

// // //   const startPolling = () => {
// // //     console.log("Starting polling...");
    
// // //     if (pollingIntervalRef.current) {
// // //       clearInterval(pollingIntervalRef.current);
// // //     }
    
// // //     setIsPolling(true);
    
// // //     // Initial fetch
// // //     fetchTicketRequestsSilently();
    
// // //     // Set up interval for polling
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL);
// // //   };

// // //   const stopPolling = () => {
// // //     console.log("Stopping polling...");
// // //     setIsPolling(false);
    
// // //     if (pollingIntervalRef.current) {
// // //       clearInterval(pollingIntervalRef.current);
// // //       pollingIntervalRef.current = null;
// // //     }
// // //   };

// // //   const adjustPollingForBackground = () => {
// // //     if (!pollingIntervalRef.current) return;
    
// // //     console.log("Adjusting to background polling interval");
// // //     clearInterval(pollingIntervalRef.current);
    
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Background polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL_BACKGROUND);
// // //   };

// // //   const adjustPollingForForeground = () => {
// // //     if (!pollingIntervalRef.current) return;
    
// // //     console.log("Adjusting to foreground polling interval");
// // //     clearInterval(pollingIntervalRef.current);
    
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Foreground polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL);
// // //   };

// // //   const fetchTicketRequestsSilently = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
      
// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );
      
// // //       if (response.data.success) {
// // //         const allRequests = response.data.ticket_requests?.data || [];
// // //         const gameRequests = allRequests.filter(
// // //           (request) => request.game_id == gameId || request.game_id === gameId
// // //         );
        
// // //         // Check if there are any status changes
// // //         const hasChanges = checkForStatusChanges(gameRequests);
        
// // //         if (hasChanges) {
// // //           console.log("Status changes detected, updating UI");
// // //           updateRequestsAndStats(gameRequests);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Silent fetch error:", error.message);
// // //       // Don't show alerts for silent fetches
// // //     }
// // //   };

// // //   const checkForStatusChanges = (newRequests) => {
// // //     if (requests.length !== newRequests.length) {
// // //       return true;
// // //     }
    
// // //     for (let i = 0; i < newRequests.length; i++) {
// // //       const newRequest = newRequests[i];
// // //       const oldRequest = requests.find(r => r.id === newRequest.id);
      
// // //       if (!oldRequest) return true;
      
// // //       if (oldRequest.status !== newRequest.status ||
// // //           oldRequest.payment_status !== newRequest.payment_status ||
// // //           oldRequest.rejection_reason !== newRequest.rejection_reason) {
// // //         return true;
// // //       }
// // //     }
    
// // //     return false;
// // //   };

// // //   const updateRequestsAndStats = (gameRequests) => {
// // //     setRequests(gameRequests);
    
// // //     const pendingCount = gameRequests.filter(r => r.status === "pending").length;
// // //     const approvedCount = gameRequests.filter(r => r.status === "approved").length;
// // //     const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
// // //     const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
// // //     setStats({
// // //       total: gameRequests.length,
// // //       pending: pendingCount,
// // //       approved: approvedCount,
// // //       rejected: rejectedCount,
// // //       cancelled: cancelledCount,
// // //     });
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     console.log("Manual refresh triggered");
// // //     setRefreshing(true);
// // //     fetchTicketRequests().finally(() => {
// // //       setRefreshing(false);
// // //       console.log("Manual refresh complete");
// // //     });
// // //   }, []);

// // //   const fetchTicketRequests = async () => {
// // //     console.log("fetchTicketRequests called");
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       console.log("Token found:", token ? "Yes" : "No");
      
// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );

// // //       console.log("API Response:", response.data);
      
// // //       if (response.data.success) {
// // //         console.log("Data success, processing...");
// // //         const allRequests = response.data.ticket_requests?.data || [];
// // //         console.log("Total requests:", allRequests.length);
        
// // //         const gameRequests = allRequests.filter(
// // //           (request) => request.game_id == gameId || request.game_id === gameId
// // //         );
// // //         console.log("Filtered requests for game:", gameRequests.length);
        
// // //         updateRequestsAndStats(gameRequests);
// // //       } else {
// // //         console.log("API returned success: false", response.data);
// // //         Alert.alert("Error", response.data.message || "Failed to fetch requests");
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching ticket requests:", error);
// // //       console.log("Error response:", error.response?.data);
// // //       Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
// // //     } finally {
// // //       console.log("Setting loading to false");
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const cancelTicketRequest = async (requestId) => {
// // //     Alert.alert(
// // //       "Cancel Request",
// // //       "Are you sure you want to cancel this ticket request?",
// // //       [
// // //         {
// // //           text: "No",
// // //           style: "cancel"
// // //         },
// // //         {
// // //           text: "Yes, Cancel",
// // //           style: "destructive",
// // //           onPress: async () => {
// // //             try {
// // //               const token = await AsyncStorage.getItem("token");
// // //               const response = await axios.post(
// // //                 `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
// // //                 {},
// // //                 { 
// // //                   headers: { 
// // //                     Authorization: `Bearer ${token}`,
// // //                     'Content-Type': 'application/json'
// // //                   } 
// // //                 }
// // //               );

// // //               if (response.data.success) {
// // //                 Alert.alert("Success", "Ticket request cancelled successfully!");
// // //                 fetchTicketRequests();
// // //               } else {
// // //                 Alert.alert("Error", response.data.message || "Failed to cancel request");
// // //               }
// // //             } catch (error) {
// // //               console.log("Cancel error:", error);
// // //               Alert.alert(
// // //                 "Error",
// // //                 error.response?.data?.message || "Failed to cancel ticket request"
// // //               );
// // //             }
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const togglePolling = () => {
// // //     if (isPolling) {
// // //       stopPolling();
// // //     } else {
// // //       startPolling();
// // //     }
// // //   };

// // //   const getStatusColor = (status) => {
// // //     switch (status) {
// // //       case "approved": return ACCENT_COLOR;
// // //       case "pending": return "#F39C12";
// // //       case "rejected": return "#E74C3C";
// // //       case "cancelled": return LIGHT_ACCENT;
// // //       default: return LIGHT_ACCENT;
// // //     }
// // //   };

// // //   const getStatusBgColor = (status) => {
// // //     switch (status) {
// // //       case "approved": return "rgba(255, 213, 79, 0.1)";
// // //       case "pending": return "rgba(243, 156, 18, 0.1)";
// // //       case "rejected": return "rgba(231, 76, 60, 0.1)";
// // //       case "cancelled": return "rgba(255, 236, 179, 0.1)";
// // //       default: return "rgba(255, 236, 179, 0.1)";
// // //     }
// // //   };

// // //   const getStatusIcon = (status) => {
// // //     switch (status) {
// // //       case "approved": return "checkmark-circle";
// // //       case "pending": return "time";
// // //       case "rejected": return "close-circle";
// // //       case "cancelled": return "close-circle-outline";
// // //       default: return "help-circle";
// // //     }
// // //   };

// // //   const formatDateTime = (dateString) => {
// // //     try {
// // //       const date = new Date(dateString);
// // //       if (isNaN(date.getTime())) {
// // //         return "Invalid date";
// // //       }
// // //       return date.toLocaleString("en-US", {
// // //         month: "short",
// // //         day: "numeric",
// // //         hour: "2-digit",
// // //         minute: "2-digit",
// // //       });
// // //     } catch (error) {
// // //       console.log("Date formatting error:", error);
// // //       return dateString || "N/A";
// // //     }
// // //   };

// // //   if (loading) {
// // //     console.log("Showing loading screen");
// // //     return (
// // //       <SafeAreaView style={styles.loadingContainer}>
// // //         <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
// // //         <View style={styles.loadingContent}>
// // //           <View style={styles.loadingIconWrapper}>
// // //             <MaterialIcons name="confirmation-number" size={40} color={ACCENT_COLOR} />
// // //           </View>
// // //           <ActivityIndicator size="large" color={ACCENT_COLOR} style={styles.loadingSpinner} />
// // //           <Text style={styles.loadingText}>Loading ticket requests...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   console.log("Rendering main screen with", requests.length, "requests");

// // //   const StatCard = ({ icon, value, label, color }) => (
// // //     <View style={styles.statCard}>
// // //       <View style={[styles.statIconContainer, { backgroundColor: color }]}>
// // //         <Ionicons name={icon} size={18} color={SECONDARY_COLOR} />
// // //       </View>
// // //       <Text style={styles.statValue}>{value}</Text>
// // //       <Text style={styles.statLabel}>{label}</Text>
// // //     </View>
// // //   );

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
// // //       <ScrollView
// // //         style={styles.container}
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             tintColor={ACCENT_COLOR}
// // //             colors={[ACCENT_COLOR]}
// // //           />
// // //         }
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerContent}>
// // //             <TouchableOpacity
// // //               style={styles.backButton}
// // //               onPress={() => navigation.goBack()}
// // //             >
// // //               <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
// // //             </TouchableOpacity>

// // //             <View style={styles.headerTextContainer}>
// // //               <Text style={styles.headerTitle}>My Ticket Requests</Text>
// // //               <View style={styles.gameInfoContainer}>
// // //                 <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
// // //                 <Text style={styles.gameName} numberOfLines={1}>
// // //                   {gameName || "Game"}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             <TouchableOpacity 
// // //               style={styles.refreshButton}
// // //               onPress={fetchTicketRequests}
// // //             >
// // //               <Ionicons name="refresh" size={22} color={SECONDARY_COLOR} />
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* Content */}
// // //         <View style={styles.content}>
// // //           {/* Stats Overview */}
// // //           <View style={styles.statsOverview}>
// // //             <StatCard 
// // //               icon="receipt" 
// // //               value={stats.total} 
// // //               label="Total" 
// // //               color={ACCENT_COLOR} 
// // //             />
// // //             <StatCard 
// // //               icon="time" 
// // //               value={stats.pending} 
// // //               label="Pending" 
// // //               color="#F39C12" 
// // //             />
// // //             <StatCard 
// // //               icon="checkmark-circle" 
// // //               value={stats.approved} 
// // //               label="Approved" 
// // //               color={ACCENT_COLOR} 
// // //             />
// // //           </View>

// // //           {/* Requests Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <Text style={styles.sectionTitle}>📋 Ticket Requests</Text>
// // //               <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
// // //             </View>

// // //             {requests.length === 0 ? (
// // //               <View style={styles.emptyState}>
// // //                 <View style={styles.emptyIconWrapper}>
// // //                   <MaterialIcons name="confirmation-number" size={50} color={ACCENT_COLOR} />
// // //                 </View>
// // //                 <Text style={styles.emptyTitle}>No Requests Found</Text>
// // //                 <Text style={styles.emptySubtitle}>
// // //                   You haven't made any ticket requests for this game yet
// // //                 </Text>
// // //                 <TouchableOpacity
// // //                   style={styles.newRequestButton}
// // //                   onPress={() => navigation.goBack()}
// // //                 >
// // //                   <Ionicons name="arrow-back" size={18} color={SECONDARY_COLOR} />
// // //                   <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.requestsList}>
// // //                 {requests.map((request) => (
// // //                   <View key={request.id} style={styles.requestCard}>
// // //                     {/* Status Badge */}
// // //                     <View style={[styles.statusBadge, 
// // //                       { backgroundColor: getStatusBgColor(request.status) }
// // //                     ]}>
// // //                       <Ionicons 
// // //                         name={getStatusIcon(request.status)} 
// // //                         size={12} 
// // //                         color={getStatusColor(request.status)} 
// // //                       />
// // //                       <Text style={[
// // //                         styles.statusText,
// // //                         { color: getStatusColor(request.status) }
// // //                       ]}>
// // //                         {request.status?.toUpperCase() || "UNKNOWN"}
// // //                       </Text>
// // //                     </View>

// // //                     <View style={styles.cardHeader}>
// // //                       <View>
// // //                         <Text style={styles.requestId}>Request #{request.id}</Text>
// // //                         <Text style={styles.requestDateTime}>
// // //                           {formatDateTime(request.requested_at || request.created_at)}
// // //                         </Text>
// // //                       </View>
                      
// // //                       <View style={[
// // //                         styles.paymentStatusBadge,
// // //                         request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
// // //                       ]}>
// // //                         <Text style={styles.paymentStatusText}>
// // //                           {(request.payment_status || "pending").toUpperCase()}
// // //                         </Text>
// // //                       </View>
// // //                     </View>

// // //                     <View style={styles.requestDetails}>
// // //                       <View style={styles.detailRow}>
// // //                         <View style={styles.detailItem}>
// // //                           <View style={styles.detailIcon}>
// // //                             <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// // //                           </View>
// // //                           <View>
// // //                             <Text style={styles.detailLabel}>Quantity</Text>
// // //                             <Text style={styles.detailText}>
// // //                               {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
// // //                             </Text>
// // //                           </View>
// // //                         </View>
                        
// // //                         <View style={styles.detailItem}>
// // //                           <View style={styles.detailIcon}>
// // //                             <MaterialIcons name="account-balance-wallet" size={14} color={ACCENT_COLOR} />
// // //                           </View>
// // //                           <View>
// // //                             <Text style={styles.detailLabel}>Amount</Text>
// // //                             <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
// // //                           </View>
// // //                         </View>
// // //                       </View>
// // //                     </View>

// // //                     {request.notes && (
// // //                       <View style={styles.notesContainer}>
// // //                         <View style={styles.notesIcon}>
// // //                           <Feather name="message-square" size={14} color={ACCENT_COLOR} />
// // //                         </View>
// // //                         <View style={styles.notesContent}>
// // //                           <Text style={styles.notesLabel}>Your Note</Text>
// // //                           <Text style={styles.notesText}>{request.notes}</Text>
// // //                         </View>
// // //                       </View>
// // //                     )}

// // //                     {request.rejection_reason && (
// // //                       <View style={styles.rejectionContainer}>
// // //                         <View style={styles.rejectionIcon}>
// // //                           <Ionicons name="alert-circle" size={14} color="#E74C3C" />
// // //                         </View>
// // //                         <View style={styles.rejectionContent}>
// // //                           <Text style={styles.rejectionLabel}>Rejection Reason</Text>
// // //                           <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
// // //                         </View>
// // //                       </View>
// // //                     )}

// // //                     <View style={styles.actionContainer}>
// // //                       {request.status === "pending" ? (
// // //                         <TouchableOpacity
// // //                           style={styles.cancelButton}
// // //                           onPress={() => cancelTicketRequest(request.id)}
// // //                         >
// // //                           <Ionicons name="close-circle" size={16} color={SECONDARY_COLOR} />
// // //                           <Text style={styles.cancelButtonText}>Cancel Request</Text>
// // //                         </TouchableOpacity>
// // //                       ) : (
// // //                         <TouchableOpacity
// // //                           style={[styles.cancelButton, styles.disabledButton]}
// // //                           disabled={true}
// // //                         >
// // //                           <Ionicons 
// // //                             name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
// // //                             size={16} 
// // //                             color="rgba(2, 85, 122, 0.7)" 
// // //                           />
// // //                           <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
// // //                             {request.status === "approved" ? "Request Approved" : 
// // //                              request.status === "rejected" ? "Request Rejected" : 
// // //                              request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
// // //                           </Text>
// // //                         </TouchableOpacity>
// // //                       )}
// // //                     </View>
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   loadingContent: {
// // //     alignItems: 'center',
// // //   },
// // //   loadingIconWrapper: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(255, 213, 79, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   loadingSpinner: {
// // //     marginTop: 10,
// // //   },
// // //   loadingText: {
// // //     fontSize: 16,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //     marginTop: 20,
// // //   },
// // //   header: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     paddingTop: 20,
// // //     paddingBottom: 5,
// // //     paddingHorizontal: 20,
// // //     borderBottomLeftRadius: 25,
// // //     borderBottomRightRadius: 25,
// // //     borderBottomWidth: 2,
// // //     borderBottomColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   headerContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 15,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: DARK_BLUE,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   refreshButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: ACCENT_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //     marginHorizontal: 12,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   gameInfoContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //   },
// // //   gameName: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   content: {
// // //     padding: 20,
// // //     paddingTop: 0,
// // //   },
// // //   statsOverview: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 20,
// // //     marginTop: 20,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     backgroundColor: DARK_BLUE,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 10,
// // //     borderRadius: 12,
// // //     marginHorizontal: 4,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   statIconContainer: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   statValue: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   statLabel: {
// // //     fontSize: 11,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "600",
// // //     opacity: 0.9,
// // //   },
// // //   section: {
// // //     marginBottom: 20,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 15,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   sectionCount: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   requestsList: {
// // //     gap: 12,
// // //   },
// // //   requestCard: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   statusBadge: {
// // //     position: 'absolute',
// // //     top: 12,
// // //     left: 12,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 8,
// // //     gap: 4,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   statusText: {
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //   },
// // //   cardHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "flex-start",
// // //     marginTop: 25,
// // //     marginBottom: 16,
// // //   },
// // //   requestId: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   requestDateTime: {
// // //     fontSize: 12,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   paymentStatusBadge: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //     marginLeft: 8,
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   paidStatus: {
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //   },
// // //   pendingStatus: {
// // //     backgroundColor: "rgba(243, 156, 18, 0.1)",
// // //   },
// // //   paymentStatusText: {
// // //     fontSize: 10,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   requestDetails: {
// // //     marginBottom: 16,
// // //   },
// // //   detailRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 12,
// // //   },
// // //   detailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     gap: 8,
// // //     flex: 1,
// // //   },
// // //   detailIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: SECONDARY_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   detailLabel: {
// // //     fontSize: 10,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //     opacity: 0.9,
// // //   },
// // //   detailText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "600",
// // //   },
// // //   notesContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: "rgba(255, 213, 79, 0.05)",
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 12,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.1)",
// // //   },
// // //   notesIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   notesContent: {
// // //     flex: 1,
// // //   },
// // //   notesLabel: {
// // //     fontSize: 11,
// // //     color: ACCENT_COLOR,
// // //     fontWeight: "600",
// // //     marginBottom: 2,
// // //   },
// // //   notesText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 16,
// // //   },
// // //   rejectionContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 12,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(231, 76, 60, 0.1)",
// // //   },
// // //   rejectionIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: "rgba(231, 76, 60, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(231, 76, 60, 0.2)",
// // //   },
// // //   rejectionContent: {
// // //     flex: 1,
// // //   },
// // //   rejectionLabel: {
// // //     fontSize: 11,
// // //     color: "#E74C3C",
// // //     fontWeight: "600",
// // //     marginBottom: 2,
// // //   },
// // //   rejectionText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 16,
// // //     fontStyle: "italic",
// // //   },
// // //   actionContainer: {
// // //     marginTop: 8,
// // //   },
// // //   cancelButton: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 6,
// // //     backgroundColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   cancelButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   disabledButton: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   disabledButtonText: {
// // //     color: LIGHT_ACCENT,
// // //     opacity: 0.9,
// // //   },
// // //   emptyState: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     overflow: 'hidden',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   emptyIconWrapper: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(255, 213, 79, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     textAlign: "center",
// // //     lineHeight: 20,
// // //     marginBottom: 20,
// // //     opacity: 0.9,
// // //   },
// // //   newRequestButton: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 8,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   newRequestButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // // });

// // // export default TicketRequestsScreen;








// // // import React, { useEffect, useState, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // //   Image,
// // //   RefreshControl,
// // //   SafeAreaView,
// // //   Dimensions,
// // //   AppState,
// // //   StatusBar,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";

// // // // For React Native CLI, use react-native-vector-icons
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";

// // // const { width } = Dimensions.get("window");

// // // // Updated Color scheme matching FAQ and Home
// // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// // // const WHITE = "#FFFFFF";

// // // const TicketRequestsScreen = ({ route, navigation }) => {
// // //   const { gameId, gameName } = route.params;
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [requests, setRequests] = useState([]);
// // //   const [stats, setStats] = useState({
// // //     total: 0,
// // //     pending: 0,
// // //     approved: 0,
// // //     rejected: 0,
// // //     cancelled: 0,
// // //   });
  
// // //   // Polling state
// // //   const [isPolling, setIsPolling] = useState(false);
// // //   const pollingIntervalRef = useRef(null);
// // //   const appState = useRef(AppState.currentState);
  
// // //   // Polling configuration
// // //   const POLLING_INTERVAL = 3000; // 10 seconds
// // //   const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
// // //   const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

// // //   useEffect(() => {
// // //     console.log("Screen mounted, fetching requests for game:", gameId);
// // //     fetchTicketRequests();
    
// // //     // Start polling when component mounts
// // //     startPolling();
    
// // //     // Setup app state listener for background/foreground
// // //     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
// // //     // Cleanup on unmount
// // //     return () => {
// // //       console.log("Component unmounting, cleaning up...");
// // //       stopPolling();
// // //       subscription.remove();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     // Auto-stop polling after MAX_POLLING_DURATION to save battery
// // //     const autoStopTimer = setTimeout(() => {
// // //       if (isPolling) {
// // //         console.log("Auto-stopping polling after maximum duration");
// // //         stopPolling();
// // //       }
// // //     }, MAX_POLLING_DURATION);

// // //     return () => clearTimeout(autoStopTimer);
// // //   }, [isPolling]);

// // //   const handleAppStateChange = (nextAppState) => {
// // //     console.log("App state changed:", nextAppState);
    
// // //     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
// // //       // App going to background
// // //       console.log("App going to background, adjusting polling interval");
// // //       adjustPollingForBackground();
// // //     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
// // //       // App coming to foreground
// // //       console.log("App coming to foreground, resuming normal polling");
// // //       adjustPollingForForeground();
// // //     }
    
// // //     appState.current = nextAppState;
// // //   };

// // //   const startPolling = () => {
// // //     console.log("Starting polling...");
    
// // //     if (pollingIntervalRef.current) {
// // //       clearInterval(pollingIntervalRef.current);
// // //     }
    
// // //     setIsPolling(true);
    
// // //     // Initial fetch
// // //     fetchTicketRequestsSilently();
    
// // //     // Set up interval for polling
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL);
// // //   };

// // //   const stopPolling = () => {
// // //     console.log("Stopping polling...");
// // //     setIsPolling(false);
    
// // //     if (pollingIntervalRef.current) {
// // //       clearInterval(pollingIntervalRef.current);
// // //       pollingIntervalRef.current = null;
// // //     }
// // //   };

// // //   const adjustPollingForBackground = () => {
// // //     if (!pollingIntervalRef.current) return;
    
// // //     console.log("Adjusting to background polling interval");
// // //     clearInterval(pollingIntervalRef.current);
    
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Background polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL_BACKGROUND);
// // //   };

// // //   const adjustPollingForForeground = () => {
// // //     if (!pollingIntervalRef.current) return;
    
// // //     console.log("Adjusting to foreground polling interval");
// // //     clearInterval(pollingIntervalRef.current);
    
// // //     pollingIntervalRef.current = setInterval(() => {
// // //       console.log("Foreground polling interval triggered");
// // //       fetchTicketRequestsSilently();
// // //     }, POLLING_INTERVAL);
// // //   };

// // //   const fetchTicketRequestsSilently = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (!token) return;
      
// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );
      
// // //       if (response.data.success) {
// // //         const allRequests = response.data.ticket_requests?.data || [];
// // //         const gameRequests = allRequests.filter(
// // //           (request) => request.game_id == gameId || request.game_id === gameId
// // //         );
        
// // //         // Check if there are any status changes
// // //         const hasChanges = checkForStatusChanges(gameRequests);
        
// // //         if (hasChanges) {
// // //           console.log("Status changes detected, updating UI");
// // //           updateRequestsAndStats(gameRequests);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.log("Silent fetch error:", error.message);
// // //       // Don't show alerts for silent fetches
// // //     }
// // //   };

// // //   const checkForStatusChanges = (newRequests) => {
// // //     if (requests.length !== newRequests.length) {
// // //       return true;
// // //     }
    
// // //     for (let i = 0; i < newRequests.length; i++) {
// // //       const newRequest = newRequests[i];
// // //       const oldRequest = requests.find(r => r.id === newRequest.id);
      
// // //       if (!oldRequest) return true;
      
// // //       if (oldRequest.status !== newRequest.status ||
// // //           oldRequest.payment_status !== newRequest.payment_status ||
// // //           oldRequest.rejection_reason !== newRequest.rejection_reason) {
// // //         return true;
// // //       }
// // //     }
    
// // //     return false;
// // //   };

// // //   const updateRequestsAndStats = (gameRequests) => {
// // //     setRequests(gameRequests);
    
// // //     const pendingCount = gameRequests.filter(r => r.status === "pending").length;
// // //     const approvedCount = gameRequests.filter(r => r.status === "approved").length;
// // //     const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
// // //     const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
// // //     setStats({
// // //       total: gameRequests.length,
// // //       pending: pendingCount,
// // //       approved: approvedCount,
// // //       rejected: rejectedCount,
// // //       cancelled: cancelledCount,
// // //     });
// // //   };

// // //   const onRefresh = React.useCallback(() => {
// // //     console.log("Manual refresh triggered");
// // //     setRefreshing(true);
// // //     fetchTicketRequests().finally(() => {
// // //       setRefreshing(false);
// // //       console.log("Manual refresh complete");
// // //     });
// // //   }, []);

// // //   const fetchTicketRequests = async () => {
// // //     console.log("fetchTicketRequests called");
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       console.log("Token found:", token ? "Yes" : "No");
      
// // //       const response = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );

// // //       console.log("API Response:", response.data);
      
// // //       if (response.data.success) {
// // //         console.log("Data success, processing...");
// // //         const allRequests = response.data.ticket_requests?.data || [];
// // //         console.log("Total requests:", allRequests.length);
        
// // //         const gameRequests = allRequests.filter(
// // //           (request) => request.game_id == gameId || request.game_id === gameId
// // //         );
// // //         console.log("Filtered requests for game:", gameRequests.length);
        
// // //         updateRequestsAndStats(gameRequests);
// // //       } else {
// // //         console.log("API returned success: false", response.data);
// // //         Alert.alert("Error", response.data.message || "Failed to fetch requests");
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching ticket requests:", error);
// // //       console.log("Error response:", error.response?.data);
// // //       Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
// // //     } finally {
// // //       console.log("Setting loading to false");
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const cancelTicketRequest = async (requestId) => {
// // //     Alert.alert(
// // //       "Cancel Request",
// // //       "Are you sure you want to cancel this ticket request?",
// // //       [
// // //         {
// // //           text: "No",
// // //           style: "cancel"
// // //         },
// // //         {
// // //           text: "Yes, Cancel",
// // //           style: "destructive",
// // //           onPress: async () => {
// // //             try {
// // //               const token = await AsyncStorage.getItem("token");
// // //               const response = await axios.post(
// // //                 `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
// // //                 {},
// // //                 { 
// // //                   headers: { 
// // //                     Authorization: `Bearer ${token}`,
// // //                     'Content-Type': 'application/json'
// // //                   } 
// // //                 }
// // //               );

// // //               if (response.data.success) {
// // //                 Alert.alert("Success", "Ticket request cancelled successfully!");
// // //                 fetchTicketRequests();
// // //               } else {
// // //                 Alert.alert("Error", response.data.message || "Failed to cancel request");
// // //               }
// // //             } catch (error) {
// // //               console.log("Cancel error:", error);
// // //               Alert.alert(
// // //                 "Error",
// // //                 error.response?.data?.message || "Failed to cancel ticket request"
// // //               );
// // //             }
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   const togglePolling = () => {
// // //     if (isPolling) {
// // //       stopPolling();
// // //     } else {
// // //       startPolling();
// // //     }
// // //   };

// // //   const getStatusColor = (status) => {
// // //     switch (status) {
// // //       case "approved": return ACCENT_COLOR;
// // //       case "pending": return "#F39C12";
// // //       case "rejected": return "#E74C3C";
// // //       case "cancelled": return LIGHT_ACCENT;
// // //       default: return LIGHT_ACCENT;
// // //     }
// // //   };

// // //   const getStatusBgColor = (status) => {
// // //     switch (status) {
// // //       case "approved": return "rgba(255, 213, 79, 0.1)";
// // //       case "pending": return "rgba(243, 156, 18, 0.1)";
// // //       case "rejected": return "rgba(231, 76, 60, 0.1)";
// // //       case "cancelled": return "rgba(255, 236, 179, 0.1)";
// // //       default: return "rgba(255, 236, 179, 0.1)";
// // //     }
// // //   };

// // //   const getStatusIcon = (status) => {
// // //     switch (status) {
// // //       case "approved": return "checkmark-circle";
// // //       case "pending": return "time";
// // //       case "rejected": return "close-circle";
// // //       case "cancelled": return "close-circle-outline";
// // //       default: return "help-circle";
// // //     }
// // //   };

// // //   const formatDateTime = (dateString) => {
// // //     try {
// // //       const date = new Date(dateString);
// // //       if (isNaN(date.getTime())) {
// // //         return "Invalid date";
// // //       }
// // //       return date.toLocaleString("en-US", {
// // //         month: "short",
// // //         day: "numeric",
// // //         hour: "2-digit",
// // //         minute: "2-digit",
// // //       });
// // //     } catch (error) {
// // //       console.log("Date formatting error:", error);
// // //       return dateString || "N/A";
// // //     }
// // //   };

// // //   if (loading) {
// // //     console.log("Showing loading screen");
// // //     return (
// // //       <SafeAreaView style={styles.loadingContainer}>
// // //         <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
// // //         <View style={styles.loadingContent}>
// // //           <View style={styles.loadingIconWrapper}>
// // //             <MaterialIcons name="confirmation-number" size={40} color={ACCENT_COLOR} />
// // //           </View>
// // //           <ActivityIndicator size="large" color={ACCENT_COLOR} style={styles.loadingSpinner} />
// // //           <Text style={styles.loadingText}>Loading ticket requests...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   console.log("Rendering main screen with", requests.length, "requests");

// // //   const StatCard = ({ icon, value, label, color }) => (
// // //     <View style={styles.statCard}>
// // //       <View style={[styles.statIconContainer, { backgroundColor: color }]}>
// // //         <Ionicons name={icon} size={18} color={SECONDARY_COLOR} />
// // //       </View>
// // //       <Text style={styles.statValue}>{value}</Text>
// // //       <Text style={styles.statLabel}>{label}</Text>
// // //     </View>
// // //   );

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
// // //       <ScrollView
// // //         style={styles.container}
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             tintColor={ACCENT_COLOR}
// // //             colors={[ACCENT_COLOR]}
// // //           />
// // //         }
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerContent}>
// // //             <TouchableOpacity
// // //               style={styles.backButton}
// // //               onPress={() => navigation.goBack()}
// // //             >
// // //               <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
// // //             </TouchableOpacity>

// // //             <View style={styles.headerTextContainer}>
// // //               <Text style={styles.headerTitle}>My Ticket Requests</Text>
// // //               <View style={styles.gameInfoContainer}>
// // //                 <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
// // //                 <Text style={styles.gameName} numberOfLines={1}>
// // //                   {gameName || "Game"}
// // //                 </Text>
// // //               </View>
// // //             </View>
            
// // //             <TouchableOpacity 
// // //               style={styles.refreshButton}
// // //               onPress={fetchTicketRequests}
// // //             >
// // //               <Ionicons name="refresh" size={22} color={SECONDARY_COLOR} />
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* Content */}
// // //         <View style={styles.content}>
// // //           {/* Stats Overview */}
// // //           <View style={styles.statsOverview}>
// // //             <StatCard 
// // //               icon="receipt" 
// // //               value={stats.total} 
// // //               label="Total" 
// // //               color={ACCENT_COLOR} 
// // //             />
// // //             <StatCard 
// // //               icon="time" 
// // //               value={stats.pending} 
// // //               label="Pending" 
// // //               color="#F39C12" 
// // //             />
// // //             <StatCard 
// // //               icon="checkmark-circle" 
// // //               value={stats.approved} 
// // //               label="Approved" 
// // //               color={ACCENT_COLOR} 
// // //             />
// // //           </View>

// // //           {/* Requests Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <Text style={styles.sectionTitle}>📋 Ticket Requests</Text>
// // //               <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
// // //             </View>

// // //             {requests.length === 0 ? (
// // //               <View style={styles.emptyState}>
// // //                 <View style={styles.emptyIconWrapper}>
// // //                   <MaterialIcons name="confirmation-number" size={50} color={ACCENT_COLOR} />
// // //                 </View>
// // //                 <Text style={styles.emptyTitle}>No Requests Found</Text>
// // //                 <Text style={styles.emptySubtitle}>
// // //                   You haven't made any ticket requests for this game yet
// // //                 </Text>
// // //                 <TouchableOpacity
// // //                   style={styles.newRequestButton}
// // //                   onPress={() => navigation.goBack()}
// // //                 >
// // //                   <Ionicons name="arrow-back" size={18} color={SECONDARY_COLOR} />
// // //                   <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.requestsList}>
// // //                 {requests.map((request) => (
// // //                   <View key={request.id} style={styles.requestCard}>
// // //                     {/* Status Badge */}
// // //                     <View style={[styles.statusBadge, 
// // //                       { backgroundColor: getStatusBgColor(request.status) }
// // //                     ]}>
// // //                       <Ionicons 
// // //                         name={getStatusIcon(request.status)} 
// // //                         size={12} 
// // //                         color={getStatusColor(request.status)} 
// // //                       />
// // //                       <Text style={[
// // //                         styles.statusText,
// // //                         { color: getStatusColor(request.status) }
// // //                       ]}>
// // //                         {request.status?.toUpperCase() || "UNKNOWN"}
// // //                       </Text>
// // //                     </View>

// // //                     <View style={styles.cardHeader}>
// // //                       <View>
// // //                         <Text style={styles.requestId}>Request #{request.id}</Text>
// // //                         <Text style={styles.requestDateTime}>
// // //                           {formatDateTime(request.requested_at || request.created_at)}
// // //                         </Text>
// // //                       </View>
                      
// // //                       <View style={[
// // //                         styles.paymentStatusBadge,
// // //                         request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
// // //                       ]}>
// // //                         <Text style={styles.paymentStatusText}>
// // //                           {(request.payment_status || "pending").toUpperCase()}
// // //                         </Text>
// // //                       </View>
// // //                     </View>

// // //                     <View style={styles.requestDetails}>
// // //                       <View style={styles.detailRow}>
// // //                         <View style={styles.detailItem}>
// // //                           <View style={styles.detailIcon}>
// // //                             <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
// // //                           </View>
// // //                           <View>
// // //                             <Text style={styles.detailLabel}>Quantity</Text>
// // //                             <Text style={styles.detailText}>
// // //                               {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
// // //                             </Text>
// // //                           </View>
// // //                         </View>
                        
// // //                         <View style={styles.detailItem}>
// // //                           <View style={styles.detailIcon}>
// // //                             <MaterialIcons name="account-balance-wallet" size={14} color={ACCENT_COLOR} />
// // //                           </View>
// // //                           <View>
// // //                             <Text style={styles.detailLabel}>Amount</Text>
// // //                             <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
// // //                           </View>
// // //                         </View>
// // //                       </View>
// // //                     </View>

// // //                     {request.notes && (
// // //                       <View style={styles.notesContainer}>
// // //                         <View style={styles.notesIcon}>
// // //                           <Feather name="message-square" size={14} color={ACCENT_COLOR} />
// // //                         </View>
// // //                         <View style={styles.notesContent}>
// // //                           <Text style={styles.notesLabel}>Your Note</Text>
// // //                           <Text style={styles.notesText}>{request.notes}</Text>
// // //                         </View>
// // //                       </View>
// // //                     )}

// // //                     {request.rejection_reason && (
// // //                       <View style={styles.rejectionContainer}>
// // //                         <View style={styles.rejectionIcon}>
// // //                           <Ionicons name="alert-circle" size={14} color="#E74C3C" />
// // //                         </View>
// // //                         <View style={styles.rejectionContent}>
// // //                           <Text style={styles.rejectionLabel}>Rejection Reason</Text>
// // //                           <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
// // //                         </View>
// // //                       </View>
// // //                     )}

// // //                     <View style={styles.actionContainer}>
// // //                       {request.status === "pending" ? (
// // //                         <TouchableOpacity
// // //                           style={styles.cancelButton}
// // //                           onPress={() => cancelTicketRequest(request.id)}
// // //                         >
// // //                           <Ionicons name="close-circle" size={16} color={SECONDARY_COLOR} />
// // //                           <Text style={styles.cancelButtonText}>Cancel Request</Text>
// // //                         </TouchableOpacity>
// // //                       ) : (
// // //                         <TouchableOpacity
// // //                           style={[styles.cancelButton, styles.disabledButton]}
// // //                           disabled={true}
// // //                         >
// // //                           <Ionicons 
// // //                             name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
// // //                             size={16} 
// // //                             color="rgba(2, 85, 122, 0.7)" 
// // //                           />
// // //                           <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
// // //                             {request.status === "approved" ? "Request Approved" : 
// // //                              request.status === "rejected" ? "Request Rejected" : 
// // //                              request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
// // //                           </Text>
// // //                         </TouchableOpacity>
// // //                       )}
// // //                     </View>
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </View>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   loadingContent: {
// // //     alignItems: 'center',
// // //   },
// // //   loadingIconWrapper: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(255, 213, 79, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   loadingSpinner: {
// // //     marginTop: 10,
// // //   },
// // //   loadingText: {
// // //     fontSize: 16,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "500",
// // //     marginTop: 20,
// // //   },
// // //   header: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     paddingTop: 20,
// // //     paddingBottom: 5,
// // //     paddingHorizontal: 20,
// // //     borderBottomLeftRadius: 25,
// // //     borderBottomRightRadius: 25,
// // //     borderBottomWidth: 2,
// // //     borderBottomColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   headerContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 15,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: DARK_BLUE,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   refreshButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: ACCENT_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //     marginHorizontal: 12,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   gameInfoContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //   },
// // //   gameName: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   content: {
// // //     padding: 20,
// // //     paddingTop: 0,
// // //   },
// // //   statsOverview: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 20,
// // //     marginTop: 20,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     backgroundColor: DARK_BLUE,
// // //     paddingVertical: 15,
// // //     paddingHorizontal: 10,
// // //     borderRadius: 12,
// // //     marginHorizontal: 4,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   statIconContainer: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   statValue: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   statLabel: {
// // //     fontSize: 11,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "600",
// // //     opacity: 0.9,
// // //   },
// // //   section: {
// // //     marginBottom: 20,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 15,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   sectionCount: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   requestsList: {
// // //     gap: 12,
// // //   },
// // //   requestCard: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     position: 'relative',
// // //     overflow: 'hidden',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   statusBadge: {
// // //     position: 'absolute',
// // //     top: 12,
// // //     left: 12,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 8,
// // //     gap: 4,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   statusText: {
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //   },
// // //   cardHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "flex-start",
// // //     marginTop: 25,
// // //     marginBottom: 16,
// // //   },
// // //   requestId: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //   },
// // //   requestDateTime: {
// // //     fontSize: 12,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   paymentStatusBadge: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 6,
// // //     marginLeft: 8,
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   paidStatus: {
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //   },
// // //   pendingStatus: {
// // //     backgroundColor: "rgba(243, 156, 18, 0.1)",
// // //   },
// // //   paymentStatusText: {
// // //     fontSize: 10,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   requestDetails: {
// // //     marginBottom: 16,
// // //   },
// // //   detailRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 12,
// // //   },
// // //   detailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     gap: 8,
// // //     flex: 1,
// // //   },
// // //   detailIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: SECONDARY_COLOR,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   detailLabel: {
// // //     fontSize: 10,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     marginBottom: 2,
// // //     opacity: 0.9,
// // //   },
// // //   detailText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     fontWeight: "600",
// // //   },
// // //   notesContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: "rgba(255, 213, 79, 0.05)",
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 12,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.1)",
// // //   },
// // //   notesIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   notesContent: {
// // //     flex: 1,
// // //   },
// // //   notesLabel: {
// // //     fontSize: 11,
// // //     color: ACCENT_COLOR,
// // //     fontWeight: "600",
// // //     marginBottom: 2,
// // //   },
// // //   notesText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 16,
// // //   },
// // //   rejectionContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     marginBottom: 12,
// // //     gap: 10,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(231, 76, 60, 0.1)",
// // //   },
// // //   rejectionIcon: {
// // //     width: 28,
// // //     height: 28,
// // //     borderRadius: 8,
// // //     backgroundColor: "rgba(231, 76, 60, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(231, 76, 60, 0.2)",
// // //   },
// // //   rejectionContent: {
// // //     flex: 1,
// // //   },
// // //   rejectionLabel: {
// // //     fontSize: 11,
// // //     color: "#E74C3C",
// // //     fontWeight: "600",
// // //     marginBottom: 2,
// // //   },
// // //   rejectionText: {
// // //     fontSize: 12,
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 16,
// // //     fontStyle: "italic",
// // //   },
// // //   actionContainer: {
// // //     marginTop: 8,
// // //   },
// // //   cancelButton: {
// // //     flexDirection: "row",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 6,
// // //     backgroundColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   cancelButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   disabledButton: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //   },
// // //   disabledButtonText: {
// // //     color: LIGHT_ACCENT,
// // //     opacity: 0.9,
// // //   },
// // //   emptyState: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     overflow: 'hidden',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   emptyIconWrapper: {
// // //     width: 70,
// // //     height: 70,
// // //     borderRadius: 35,
// // //     backgroundColor: 'rgba(255, 213, 79, 0.1)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     borderWidth: 2,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     textAlign: "center",
// // //     lineHeight: 20,
// // //     marginBottom: 20,
// // //     opacity: 0.9,
// // //   },
// // //   newRequestButton: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 8,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   newRequestButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // // });

// // // export default TicketRequestsScreen;




// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   Image,
// //   RefreshControl,
// //   SafeAreaView,
// //   Dimensions,
// //   AppState,
// //   StatusBar,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";

// // // For React Native CLI, use react-native-vector-icons
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import Feather from "react-native-vector-icons/Feather";

// // const { width } = Dimensions.get("window");

// // // Updated Color scheme matching Home component
// // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // const WHITE = "#FFFFFF";
// // const TEXT_DARK = "#333333";
// // const TEXT_LIGHT = "#777777";
// // const BORDER_COLOR = "#EEEEEE";
// // const CARD_BACKGROUND = "#FFFFFF";
// // const SUCCESS_COLOR = "#4CAF50"; // Green for success states
// // const ERROR_COLOR = "#E74C3C"; // Red for errors

// // const TicketRequestsScreen = ({ route, navigation }) => {
// //   const { gameId, gameName } = route.params;
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [requests, setRequests] = useState([]);
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     pending: 0,
// //     approved: 0,
// //     rejected: 0,
// //     cancelled: 0,
// //   });
  
// //   // Polling state
// //   const [isPolling, setIsPolling] = useState(false);
// //   const pollingIntervalRef = useRef(null);
// //   const appState = useRef(AppState.currentState);
  
// //   // Polling configuration
// //   const POLLING_INTERVAL = 3000; // 3 seconds
// //   const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
// //   const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

// //   useEffect(() => {
// //     console.log("Screen mounted, fetching requests for game:", gameId);
// //     fetchTicketRequests();
    
// //     // Start polling when component mounts
// //     startPolling();
    
// //     // Setup app state listener for background/foreground
// //     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
// //     // Cleanup on unmount
// //     return () => {
// //       console.log("Component unmounting, cleaning up...");
// //       stopPolling();
// //       subscription.remove();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     // Auto-stop polling after MAX_POLLING_DURATION to save battery
// //     const autoStopTimer = setTimeout(() => {
// //       if (isPolling) {
// //         console.log("Auto-stopping polling after maximum duration");
// //         stopPolling();
// //       }
// //     }, MAX_POLLING_DURATION);

// //     return () => clearTimeout(autoStopTimer);
// //   }, [isPolling]);

// //   const handleAppStateChange = (nextAppState) => {
// //     console.log("App state changed:", nextAppState);
    
// //     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
// //       // App going to background
// //       console.log("App going to background, adjusting polling interval");
// //       adjustPollingForBackground();
// //     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
// //       // App coming to foreground
// //       console.log("App coming to foreground, resuming normal polling");
// //       adjustPollingForForeground();
// //     }
    
// //     appState.current = nextAppState;
// //   };

// //   const startPolling = () => {
// //     console.log("Starting polling...");
    
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //     }
    
// //     setIsPolling(true);
    
// //     // Initial fetch
// //     fetchTicketRequestsSilently();
    
// //     // Set up interval for polling
// //     pollingIntervalRef.current = setInterval(() => {
// //       console.log("Polling interval triggered");
// //       fetchTicketRequestsSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const stopPolling = () => {
// //     console.log("Stopping polling...");
// //     setIsPolling(false);
    
// //     if (pollingIntervalRef.current) {
// //       clearInterval(pollingIntervalRef.current);
// //       pollingIntervalRef.current = null;
// //     }
// //   };

// //   const adjustPollingForBackground = () => {
// //     if (!pollingIntervalRef.current) return;
    
// //     console.log("Adjusting to background polling interval");
// //     clearInterval(pollingIntervalRef.current);
    
// //     pollingIntervalRef.current = setInterval(() => {
// //       console.log("Background polling interval triggered");
// //       fetchTicketRequestsSilently();
// //     }, POLLING_INTERVAL_BACKGROUND);
// //   };

// //   const adjustPollingForForeground = () => {
// //     if (!pollingIntervalRef.current) return;
    
// //     console.log("Adjusting to foreground polling interval");
// //     clearInterval(pollingIntervalRef.current);
    
// //     pollingIntervalRef.current = setInterval(() => {
// //       console.log("Foreground polling interval triggered");
// //       fetchTicketRequestsSilently();
// //     }, POLLING_INTERVAL);
// //   };

// //   const fetchTicketRequestsSilently = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       if (!token) return;
      
// //       const response = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { 
// //           headers: { 
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           } 
// //         }
// //       );
      
// //       if (response.data.success) {
// //         const allRequests = response.data.ticket_requests?.data || [];
// //         const gameRequests = allRequests.filter(
// //           (request) => request.game_id == gameId || request.game_id === gameId
// //         );
        
// //         // Check if there are any status changes
// //         const hasChanges = checkForStatusChanges(gameRequests);
        
// //         if (hasChanges) {
// //           console.log("Status changes detected, updating UI");
// //           updateRequestsAndStats(gameRequests);
// //         }
// //       }
// //     } catch (error) {
// //       console.log("Silent fetch error:", error.message);
// //       // Don't show alerts for silent fetches
// //     }
// //   };

// //   const checkForStatusChanges = (newRequests) => {
// //     if (requests.length !== newRequests.length) {
// //       return true;
// //     }
    
// //     for (let i = 0; i < newRequests.length; i++) {
// //       const newRequest = newRequests[i];
// //       const oldRequest = requests.find(r => r.id === newRequest.id);
      
// //       if (!oldRequest) return true;
      
// //       if (oldRequest.status !== newRequest.status ||
// //           oldRequest.payment_status !== newRequest.payment_status ||
// //           oldRequest.rejection_reason !== newRequest.rejection_reason) {
// //         return true;
// //       }
// //     }
    
// //     return false;
// //   };

// //   const updateRequestsAndStats = (gameRequests) => {
// //     setRequests(gameRequests);
    
// //     const pendingCount = gameRequests.filter(r => r.status === "pending").length;
// //     const approvedCount = gameRequests.filter(r => r.status === "approved").length;
// //     const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
// //     const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
// //     setStats({
// //       total: gameRequests.length,
// //       pending: pendingCount,
// //       approved: approvedCount,
// //       rejected: rejectedCount,
// //       cancelled: cancelledCount,
// //     });
// //   };

// //   const onRefresh = React.useCallback(() => {
// //     console.log("Manual refresh triggered");
// //     setRefreshing(true);
// //     fetchTicketRequests().finally(() => {
// //       setRefreshing(false);
// //       console.log("Manual refresh complete");
// //     });
// //   }, []);

// //   const fetchTicketRequests = async () => {
// //     console.log("fetchTicketRequests called");
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       console.log("Token found:", token ? "Yes" : "No");
      
// //       const response = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
// //         { 
// //           headers: { 
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           } 
// //         }
// //       );

// //       console.log("API Response:", response.data);
      
// //       if (response.data.success) {
// //         console.log("Data success, processing...");
// //         const allRequests = response.data.ticket_requests?.data || [];
// //         console.log("Total requests:", allRequests.length);
        
// //         const gameRequests = allRequests.filter(
// //           (request) => request.game_id == gameId || request.game_id === gameId
// //         );
// //         console.log("Filtered requests for game:", gameRequests.length);
        
// //         updateRequestsAndStats(gameRequests);
// //       } else {
// //         console.log("API returned success: false", response.data);
// //         Alert.alert("Error", response.data.message || "Failed to fetch requests");
// //       }
// //     } catch (error) {
// //       console.log("Error fetching ticket requests:", error);
// //       console.log("Error response:", error.response?.data);
// //       Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
// //     } finally {
// //       console.log("Setting loading to false");
// //       setLoading(false);
// //     }
// //   };

// //   const cancelTicketRequest = async (requestId) => {
// //     Alert.alert(
// //       "Cancel Request",
// //       "Are you sure you want to cancel this ticket request?",
// //       [
// //         {
// //           text: "No",
// //           style: "cancel"
// //         },
// //         {
// //           text: "Yes, Cancel",
// //           style: "destructive",
// //           onPress: async () => {
// //             try {
// //               const token = await AsyncStorage.getItem("token");
// //               const response = await axios.post(
// //                 `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
// //                 {},
// //                 { 
// //                   headers: { 
// //                     Authorization: `Bearer ${token}`,
// //                     'Content-Type': 'application/json'
// //                   } 
// //                 }
// //               );

// //               if (response.data.success) {
// //                 Alert.alert("Success", "Ticket request cancelled successfully!");
// //                 fetchTicketRequests();
// //               } else {
// //                 Alert.alert("Error", response.data.message || "Failed to cancel request");
// //               }
// //             } catch (error) {
// //               console.log("Cancel error:", error);
// //               Alert.alert(
// //                 "Error",
// //                 error.response?.data?.message || "Failed to cancel ticket request"
// //               );
// //             }
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   const togglePolling = () => {
// //     if (isPolling) {
// //       stopPolling();
// //     } else {
// //       startPolling();
// //     }
// //   };

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "approved": return SUCCESS_COLOR;
// //       case "pending": return ACCENT_COLOR;
// //       case "rejected": return ERROR_COLOR;
// //       case "cancelled": return TEXT_LIGHT;
// //       default: return TEXT_LIGHT;
// //     }
// //   };

// //   const getStatusBgColor = (status) => {
// //     switch (status) {
// //       case "approved": return "rgba(76, 175, 80, 0.1)";
// //       case "pending": return "rgba(255, 152, 0, 0.1)";
// //       case "rejected": return "rgba(231, 76, 60, 0.1)";
// //       case "cancelled": return "rgba(119, 119, 119, 0.1)";
// //       default: return "rgba(119, 119, 119, 0.1)";
// //     }
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case "approved": return "checkmark-circle";
// //       case "pending": return "time";
// //       case "rejected": return "close-circle";
// //       case "cancelled": return "close-circle-outline";
// //       default: return "help-circle";
// //     }
// //   };

// //   const formatDateTime = (dateString) => {
// //     try {
// //       const date = new Date(dateString);
// //       if (isNaN(date.getTime())) {
// //         return "Invalid date";
// //       }
// //       return date.toLocaleString("en-US", {
// //         month: "short",
// //         day: "numeric",
// //         hour: "2-digit",
// //         minute: "2-digit",
// //       });
// //     } catch (error) {
// //       console.log("Date formatting error:", error);
// //       return dateString || "N/A";
// //     }
// //   };

// //   if (loading) {
// //     console.log("Showing loading screen");
// //     return (
// //       <SafeAreaView style={styles.loadingContainer}>
// //         <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
// //         <View style={styles.loadingContent}>
// //           <View style={styles.loadingIconWrapper}>
// //             <MaterialIcons name="confirmation-number" size={40} color={PRIMARY_COLOR} />
// //           </View>
// //           <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
// //           <Text style={styles.loadingText}>Loading ticket requests...</Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   console.log("Rendering main screen with", requests.length, "requests");

// //   const StatCard = ({ icon, value, label, color }) => (
// //     <View style={styles.statCard}>
// //       <View style={[styles.statIconContainer, { backgroundColor: color }]}>
// //         <Ionicons name={icon} size={18} color={WHITE} />
// //       </View>
// //       <Text style={styles.statValue}>{value}</Text>
// //       <Text style={styles.statLabel}>{label}</Text>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
// //       <ScrollView
// //         style={styles.container}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             tintColor={PRIMARY_COLOR}
// //             colors={[PRIMARY_COLOR]}
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <View style={styles.headerContent}>
// //             <TouchableOpacity
// //               style={styles.backButton}
// //               onPress={() => navigation.goBack()}
// //             >
// //               <Ionicons name="arrow-back" size={24} color={WHITE} />
// //             </TouchableOpacity>

// //             <View style={styles.headerTextContainer}>
// //               <Text style={styles.headerTitle}>My Ticket Requests</Text>
// //               <View style={styles.gameInfoContainer}>
// //                 <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
// //                 <Text style={styles.gameName} numberOfLines={1}>
// //                   {gameName || "Game"}
// //                 </Text>
// //               </View>
// //             </View>
            
            
// //           </View>
// //         </View>

// //         {/* Content */}
// //         <View style={styles.content}>
// //           {/* Stats Overview */}
// //           <View style={styles.statsOverview}>
// //             <StatCard 
// //               icon="receipt" 
// //               value={stats.total} 
// //               label="Total" 
// //               color={PRIMARY_COLOR} 
// //             />
// //             <StatCard 
// //               icon="time" 
// //               value={stats.pending} 
// //               label="Pending" 
// //               color={ACCENT_COLOR} 
// //             />
// //             <StatCard 
// //               icon="checkmark-circle" 
// //               value={stats.approved} 
// //               label="Approved" 
// //               color={SUCCESS_COLOR} 
// //             />
// //           </View>

// //           {/* Requests Section */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Ticket Requests</Text>
// //               <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
// //             </View>

// //             {requests.length === 0 ? (
// //               <View style={styles.emptyState}>
// //                 <View style={styles.emptyIconWrapper}>
// //                   <MaterialIcons name="confirmation-number" size={50} color={PRIMARY_COLOR} />
// //                 </View>
// //                 <Text style={styles.emptyTitle}>No Requests Found</Text>
// //                 <Text style={styles.emptySubtitle}>
// //                   You haven't made any ticket requests for this game yet
// //                 </Text>
// //                 <TouchableOpacity
// //                   style={styles.newRequestButton}
// //                   onPress={() => navigation.goBack()}
// //                 >
// //                   <Ionicons name="arrow-back" size={18} color={WHITE} />
// //                   <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             ) : (
// //               <View style={styles.requestsList}>
// //                 {requests.map((request) => (
// //                   <View key={request.id} style={styles.requestCard}>
// //                     {/* Status Badge */}
// //                     <View style={[styles.statusBadge, 
// //                       { backgroundColor: getStatusBgColor(request.status) }
// //                     ]}>
// //                       <Ionicons 
// //                         name={getStatusIcon(request.status)} 
// //                         size={12} 
// //                         color={getStatusColor(request.status)} 
// //                       />
// //                       <Text style={[
// //                         styles.statusText,
// //                         { color: getStatusColor(request.status) }
// //                       ]}>
// //                         {request.status?.toUpperCase() || "UNKNOWN"}
// //                       </Text>
// //                     </View>

// //                     <View style={styles.cardHeader}>
// //                       <View>
// //                         <Text style={styles.requestId}>Request #{request.id}</Text>
// //                         <Text style={styles.requestDateTime}>
// //                           {formatDateTime(request.requested_at || request.created_at)}
// //                         </Text>
// //                       </View>
                      
// //                       <View style={[
// //                         styles.paymentStatusBadge,
// //                         request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
// //                       ]}>
// //                         <Text style={styles.paymentStatusText}>
// //                           {(request.payment_status || "pending").toUpperCase()}
// //                         </Text>
// //                       </View>
// //                     </View>

// //                     <View style={styles.requestDetails}>
// //                       <View style={styles.detailRow}>
// //                         <View style={styles.detailItem}>
// //                           <View style={styles.detailIcon}>
// //                             <MaterialIcons name="confirmation-number" size={14} color={PRIMARY_COLOR} />
// //                           </View>
// //                           <View>
// //                             <Text style={styles.detailLabel}>Quantity</Text>
// //                             <Text style={styles.detailText}>
// //                               {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
// //                             </Text>
// //                           </View>
// //                         </View>
                        
// //                         <View style={styles.detailItem}>
// //                           <View style={styles.detailIcon}>
// //                             <MaterialIcons name="account-balance-wallet" size={14} color={PRIMARY_COLOR} />
// //                           </View>
// //                           <View>
// //                             <Text style={styles.detailLabel}>Amount</Text>
// //                             <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
// //                           </View>
// //                         </View>
// //                       </View>
// //                     </View>

// //                     {request.notes && (
// //                       <View style={styles.notesContainer}>
// //                         <View style={styles.notesIcon}>
// //                           <Feather name="message-square" size={14} color={PRIMARY_COLOR} />
// //                         </View>
// //                         <View style={styles.notesContent}>
// //                           <Text style={styles.notesLabel}>Your Note</Text>
// //                           <Text style={styles.notesText}>{request.notes}</Text>
// //                         </View>
// //                       </View>
// //                     )}

// //                     {request.rejection_reason && (
// //                       <View style={styles.rejectionContainer}>
// //                         <View style={styles.rejectionIcon}>
// //                           <Ionicons name="alert-circle" size={14} color={ERROR_COLOR} />
// //                         </View>
// //                         <View style={styles.rejectionContent}>
// //                           <Text style={styles.rejectionLabel}>Rejection Reason</Text>
// //                           <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
// //                         </View>
// //                       </View>
// //                     )}

// //                     <View style={styles.actionContainer}>
// //                       {request.status === "pending" ? (
// //                         <TouchableOpacity
// //                           style={styles.cancelButton}
// //                           onPress={() => cancelTicketRequest(request.id)}
// //                         >
// //                           <Ionicons name="close-circle" size={16} color={WHITE} />
// //                           <Text style={styles.cancelButtonText}>Cancel Request</Text>
// //                         </TouchableOpacity>
// //                       ) : (
// //                         <TouchableOpacity
// //                           style={[styles.cancelButton, styles.disabledButton]}
// //                           disabled={true}
// //                         >
// //                           <Ionicons 
// //                             name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
// //                             size={16} 
// //                             color={WHITE} 
// //                           />
// //                           <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
// //                             {request.status === "approved" ? "Request Approved" : 
// //                              request.status === "rejected" ? "Request Rejected" : 
// //                              request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
// //                           </Text>
// //                         </TouchableOpacity>
// //                       )}
// //                     </View>
// //                   </View>
// //                 ))}
// //               </View>
// //             )}
// //           </View>

// //           <View style={styles.bottomSpace} />
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   loadingContent: {
// //     alignItems: 'center',
// //   },
// //   loadingIconWrapper: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderWidth: 2,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   loadingSpinner: {
// //     marginTop: 10,
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //     marginTop: 20,
// //   },
// //   header: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingTop: 20,
// //     paddingBottom: 5,
// //     paddingHorizontal: 20,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   headerContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 15,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   refreshButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //     marginHorizontal: 12,
// //   },
// //   headerTitle: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: WHITE,
// //     marginBottom: 4,
// //   },
// //   gameInfoContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //   },
// //   gameName: {
// //     fontSize: 14,
// //     color: 'rgba(255,255,255,0.7)',
// //     fontWeight: "500",
// //   },
// //   content: {
// //     padding: 20,
// //     paddingTop: 0,
// //   },
// //   statsOverview: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 20,
// //     marginTop: 20,
// //   },
// //   statCard: {
// //     flex: 1,
// //     alignItems: "center",
// //     backgroundColor: WHITE,
// //     paddingVertical: 15,
// //     paddingHorizontal: 10,
// //     borderRadius: 12,
// //     marginHorizontal: 4,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   statIconContainer: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   statValue: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 4,
// //   },
// //   statLabel: {
// //     fontSize: 11,
// //     color: TEXT_LIGHT,
// //     fontWeight: "600",
// //   },
// //   section: {
// //     marginBottom: 20,
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 15,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   sectionCount: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   requestsList: {
// //     gap: 12,
// //   },
// //   requestCard: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 16,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     position: 'relative',
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   statusBadge: {
// //     position: 'absolute',
// //     top: 12,
// //     left: 12,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     gap: 4,
// //     borderWidth: 1,
// //     borderColor: 'rgba(0,0,0,0.05)',
// //   },
// //   statusText: {
// //     fontSize: 10,
// //     fontWeight: '700',
// //   },
// //   cardHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginTop: 25,
// //     marginBottom: 16,
// //   },
// //   requestId: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 4,
// //   },
// //   requestDateTime: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   paymentStatusBadge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 6,
// //     marginLeft: 8,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   paidStatus: {
// //     backgroundColor: "rgba(76, 175, 80, 0.1)",
// //     borderColor: SUCCESS_COLOR,
// //   },
// //   pendingStatus: {
// //     backgroundColor: "rgba(255, 152, 0, 0.1)",
// //     borderColor: ACCENT_COLOR,
// //   },
// //   paymentStatusText: {
// //     fontSize: 10,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   requestDetails: {
// //     marginBottom: 16,
// //   },
// //   detailRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },
// //   detailItem: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 8,
// //     flex: 1,
// //   },
// //   detailIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     backgroundColor: BACKGROUND_COLOR,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   detailLabel: {
// //     fontSize: 10,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //     marginBottom: 2,
// //   },
// //   detailText: {
// //     fontSize: 12,
// //     color: TEXT_DARK,
// //     fontWeight: "600",
// //   },
// //   notesContainer: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     backgroundColor: BACKGROUND_COLOR,
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     gap: 10,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   notesIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   notesContent: {
// //     flex: 1,
// //   },
// //   notesLabel: {
// //     fontSize: 11,
// //     color: TEXT_DARK,
// //     fontWeight: "600",
// //     marginBottom: 2,
// //   },
// //   notesText: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     lineHeight: 16,
// //   },
// //   rejectionContainer: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     backgroundColor: "rgba(231, 76, 60, 0.05)",
// //     padding: 12,
// //     borderRadius: 10,
// //     marginBottom: 12,
// //     gap: 10,
// //     borderWidth: 1,
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   rejectionIcon: {
// //     width: 28,
// //     height: 28,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(231, 76, 60, 0.1)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "rgba(231, 76, 60, 0.2)",
// //   },
// //   rejectionContent: {
// //     flex: 1,
// //   },
// //   rejectionLabel: {
// //     fontSize: 11,
// //     color: ERROR_COLOR,
// //     fontWeight: "600",
// //     marginBottom: 2,
// //   },
// //   rejectionText: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     lineHeight: 16,
// //     fontStyle: "italic",
// //   },
// //   actionContainer: {
// //     marginTop: 8,
// //   },
// //   cancelButton: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     gap: 6,
// //     backgroundColor: PRIMARY_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   cancelButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   disabledButton: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   disabledButtonText: {
// //     color: TEXT_LIGHT,
// //   },
// //   emptyState: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     overflow: 'hidden',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   emptyIconWrapper: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: 'rgba(79, 172, 254, 0.1)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     borderWidth: 2,
// //     borderColor: 'rgba(79, 172, 254, 0.2)',
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   emptySubtitle: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     textAlign: "center",
// //     lineHeight: 20,
// //     marginBottom: 20,
// //   },
// //   newRequestButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     gap: 8,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   newRequestButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// // });

// // export default TicketRequestsScreen;







// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   Dimensions,
//   AppState,
//   StatusBar,
//   Animated,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width } = Dimensions.get("window");

// // Color palette matching Game component
// const COLORS = {
//   background: '#F0F7FF',
//   surface: '#FFFFFF',
//   primary: '#2E5BFF', // Vibrant blue
//   primaryLight: '#E1EBFF',
//   primaryDark: '#1A3A9E',
//   accent: '#3B82F6', // Medium blue for accents
//   secondary: '#60A5FA', // Light blue
//   tertiary: '#2563EB', // Darker blue for contrast
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
  
//   // Card background variants
//   cardBlue1: '#E8F0FE',
//   cardBlue2: '#D4E4FF',
//   cardBlue3: '#C2D6FF',
//   cardBlue4: '#E3F2FD',
//   cardBlue5: '#E6F0FA',
  
//   // Accent colors
//   purple: '#8B5CF6',
//   purpleLight: '#EDE9FE',
//   orange: '#F97316',
//   orangeLight: '#FFF3E6',
//   pink: '#EC4899',
//   pinkLight: '#FCE8F0',
//   teal: '#14B8A6',
//   tealLight: '#D5F5F0',
//   green: '#10B981',
//   greenLight: '#D1FAE5',
//   red: '#EF4444',
//   redLight: '#FEE2E2',
  
//   // Block colors - Blue shades
//   blockLightBlue: '#E1EBFF',
//   blockMediumBlue: '#C2D6FF',
//   blockDarkBlue: '#A3C1FF',
// };

// const TicketRequestsScreen = ({ route, navigation }) => {
//   const { gameId, gameName } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [requests, setRequests] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     cancelled: 0,
//   });
  
//   // Animation values
//   const scrollY = useRef(new Animated.Value(0)).current;
  
//   // Polling state
//   const [isPolling, setIsPolling] = useState(false);
//   const pollingIntervalRef = useRef(null);
//   const appState = useRef(AppState.currentState);
  
//   // Polling configuration
//   const POLLING_INTERVAL = 3000; // 3 seconds
//   const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
//   const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

//   useEffect(() => {
//     console.log("Screen mounted, fetching requests for game:", gameId);
//     fetchTicketRequests();
    
//     // Start polling when component mounts
//     startPolling();
    
//     // Setup app state listener for background/foreground
//     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
//     // Cleanup on unmount
//     return () => {
//       console.log("Component unmounting, cleaning up...");
//       stopPolling();
//       subscription.remove();
//     };
//   }, []);

//   // Animated background that moves with scroll
//   const AnimatedBackground = () => {
//     const block1TranslateY = scrollY.interpolate({
//       inputRange: [0, 300],
//       outputRange: [0, -50],
//       extrapolate: 'clamp'
//     });

//     const block2TranslateY = scrollY.interpolate({
//       inputRange: [0, 400],
//       outputRange: [0, -30],
//       extrapolate: 'clamp'
//     });

//     const block3TranslateY = scrollY.interpolate({
//       inputRange: [0, 500],
//       outputRange: [0, -20],
//       extrapolate: 'clamp'
//     });

//     const opacity = scrollY.interpolate({
//       inputRange: [0, 200, 400],
//       outputRange: [1, 0.8, 0.6],
//       extrapolate: 'clamp'
//     });

//     return (
//       <>
//         <Animated.View 
//           style={[
//             styles.blueBlock1,
//             {
//               transform: [{ translateY: block1TranslateY }],
//               opacity
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock2,
//             {
//               transform: [{ translateY: block2TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.4, 0.8]
//               })
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock3,
//             {
//               transform: [{ translateY: block3TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.2, 0.5]
//               })
//             }
//           ]} 
//         />
//       </>
//     );
//   };

//   // Card Background with only circles
//   const CardBackground = ({ accentColor = COLORS.primary }) => (
//     <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
//       {/* Decorative circles */}
//       <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
//       {/* Floating particles */}
//       <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
//       <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
//       <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
//     </View>
//   );

//   // Enhanced Header with UK pattern
//   const Header = () => (
//     <View style={styles.headerWrapper}>
//       {/* Semicircle Background */}
//       <View style={styles.semicircleBackground}>
//         <View style={styles.semicircle} />
//       </View>
      
//       {/* UK-style Rounded Lines Pattern */}
//       <View style={styles.ukPatternContainer}>
//         <View style={styles.curvedLine1} />
//         <View style={styles.curvedLine2} />
//         <View style={styles.curvedLine3} />
        
//         <View style={styles.parallelLines}>
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//         </View>
        
//         <View style={styles.dottedCircle1}>
//           {[...Array(8)].map((_, i) => (
//             <View 
//               key={i} 
//               style={[
//                 styles.dottedCircleDot,
//                 {
//                   transform: [
//                     { rotate: `${i * 45}deg` },
//                     { translateX: 30 }
//                   ]
//                 }
//               ]} 
//             />
//           ))}
//         </View>
        
//         <View style={styles.decorativeDot1} />
//         <View style={styles.decorativeDot2} />
//         <View style={styles.decorativeLine1} />
//         <View style={styles.decorativeLine2} />
//       </View>

//       {/* Header Content */}
//       <View style={styles.headerContent}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
//           </TouchableOpacity>

//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>My Requests</Text>
//             <View style={styles.gameInfoContainer}>
//               <Ionicons name="game-controller" size={14} color={COLORS.textLight} />
//               <Text style={styles.gameName} numberOfLines={1}>
//                 {gameName || "Game"}
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.refreshButton, isPolling && styles.pollingActive]}
//             onPress={togglePolling}
//           >
//             <Ionicons 
//               name={isPolling ? "radio-button-on" : "refresh"} 
//               size={18} 
//               color={isPolling ? COLORS.green : COLORS.primary} 
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   useEffect(() => {
//     // Auto-stop polling after MAX_POLLING_DURATION to save battery
//     const autoStopTimer = setTimeout(() => {
//       if (isPolling) {
//         console.log("Auto-stopping polling after maximum duration");
//         stopPolling();
//       }
//     }, MAX_POLLING_DURATION);

//     return () => clearTimeout(autoStopTimer);
//   }, [isPolling]);

//   const handleAppStateChange = (nextAppState) => {
//     console.log("App state changed:", nextAppState);
    
//     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
//       // App going to background
//       console.log("App going to background, adjusting polling interval");
//       adjustPollingForBackground();
//     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//       // App coming to foreground
//       console.log("App coming to foreground, resuming normal polling");
//       adjustPollingForForeground();
//     }
    
//     appState.current = nextAppState;
//   };

//   const startPolling = () => {
//     console.log("Starting polling...");
    
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
    
//     setIsPolling(true);
    
//     // Initial fetch
//     fetchTicketRequestsSilently();
    
//     // Set up interval for polling
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL);
//   };

//   const stopPolling = () => {
//     console.log("Stopping polling...");
//     setIsPolling(false);
    
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   };

//   const adjustPollingForBackground = () => {
//     if (!pollingIntervalRef.current) return;
    
//     console.log("Adjusting to background polling interval");
//     clearInterval(pollingIntervalRef.current);
    
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Background polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL_BACKGROUND);
//   };

//   const adjustPollingForForeground = () => {
//     if (!pollingIntervalRef.current) return;
    
//     console.log("Adjusting to foreground polling interval");
//     clearInterval(pollingIntervalRef.current);
    
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Foreground polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL);
//   };

//   const fetchTicketRequestsSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
      
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );
      
//       if (response.data.success) {
//         const allRequests = response.data.ticket_requests?.data || [];
//         const gameRequests = allRequests.filter(
//           (request) => request.game_id == gameId || request.game_id === gameId
//         );
        
//         // Check if there are any status changes
//         const hasChanges = checkForStatusChanges(gameRequests);
        
//         if (hasChanges) {
//           console.log("Status changes detected, updating UI");
//           updateRequestsAndStats(gameRequests);
//         }
//       }
//     } catch (error) {
//       console.log("Silent fetch error:", error.message);
//       // Don't show alerts for silent fetches
//     }
//   };

//   const checkForStatusChanges = (newRequests) => {
//     if (requests.length !== newRequests.length) {
//       return true;
//     }
    
//     for (let i = 0; i < newRequests.length; i++) {
//       const newRequest = newRequests[i];
//       const oldRequest = requests.find(r => r.id === newRequest.id);
      
//       if (!oldRequest) return true;
      
//       if (oldRequest.status !== newRequest.status ||
//           oldRequest.payment_status !== newRequest.payment_status ||
//           oldRequest.rejection_reason !== newRequest.rejection_reason) {
//         return true;
//       }
//     }
    
//     return false;
//   };

//   const updateRequestsAndStats = (gameRequests) => {
//     setRequests(gameRequests);
    
//     const pendingCount = gameRequests.filter(r => r.status === "pending").length;
//     const approvedCount = gameRequests.filter(r => r.status === "approved").length;
//     const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
//     const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
//     setStats({
//       total: gameRequests.length,
//       pending: pendingCount,
//       approved: approvedCount,
//       rejected: rejectedCount,
//       cancelled: cancelledCount,
//     });
//   };

//   const onRefresh = React.useCallback(() => {
//     console.log("Manual refresh triggered");
//     setRefreshing(true);
//     fetchTicketRequests().finally(() => {
//       setRefreshing(false);
//       console.log("Manual refresh complete");
//     });
//   }, []);

//   const fetchTicketRequests = async () => {
//     console.log("fetchTicketRequests called");
//     try {
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token found:", token ? "Yes" : "No");
      
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );

//       console.log("API Response:", response.data);
      
//       if (response.data.success) {
//         console.log("Data success, processing...");
//         const allRequests = response.data.ticket_requests?.data || [];
//         console.log("Total requests:", allRequests.length);
        
//         const gameRequests = allRequests.filter(
//           (request) => request.game_id == gameId || request.game_id === gameId
//         );
//         console.log("Filtered requests for game:", gameRequests.length);
        
//         updateRequestsAndStats(gameRequests);
//       } else {
//         console.log("API returned success: false", response.data);
//         Alert.alert("Error", response.data.message || "Failed to fetch requests");
//       }
//     } catch (error) {
//       console.log("Error fetching ticket requests:", error);
//       console.log("Error response:", error.response?.data);
//       Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
//     } finally {
//       console.log("Setting loading to false");
//       setLoading(false);
//     }
//   };

//   const cancelTicketRequest = async (requestId) => {
//     Alert.alert(
//       "Cancel Request",
//       "Are you sure you want to cancel this ticket request?",
//       [
//         {
//           text: "No",
//           style: "cancel"
//         },
//         {
//           text: "Yes, Cancel",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem("token");
//               const response = await axios.post(
//                 `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
//                 {},
//                 { 
//                   headers: { 
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                   } 
//                 }
//               );

//               if (response.data.success) {
//                 Alert.alert("Success", "Ticket request cancelled successfully!");
//                 fetchTicketRequests();
//               } else {
//                 Alert.alert("Error", response.data.message || "Failed to cancel request");
//               }
//             } catch (error) {
//               console.log("Cancel error:", error);
//               Alert.alert(
//                 "Error",
//                 error.response?.data?.message || "Failed to cancel ticket request"
//               );
//             }
//           }
//         }
//       ]
//     );
//   };

//   const togglePolling = () => {
//     if (isPolling) {
//       stopPolling();
//     } else {
//       startPolling();
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved": return COLORS.green;
//       case "pending": return COLORS.orange;
//       case "rejected": return COLORS.red;
//       case "cancelled": return COLORS.textLight;
//       default: return COLORS.textLight;
//     }
//   };

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "approved": return COLORS.greenLight;
//       case "pending": return COLORS.orangeLight;
//       case "rejected": return COLORS.redLight;
//       case "cancelled": return COLORS.background;
//       default: return COLORS.background;
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved": return "checkmark-circle";
//       case "pending": return "time";
//       case "rejected": return "close-circle";
//       case "cancelled": return "close-circle-outline";
//       default: return "help-circle";
//     }
//   };

//   const formatDateTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return "Invalid date";
//       }
//       return date.toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       console.log("Date formatting error:", error);
//       return dateString || "N/A";
//     }
//   };

//   const handleScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//     { useNativeDriver: false }
//   );

//   if (loading) {
//     console.log("Showing loading screen");
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
//         <AnimatedBackground />
//         <View style={styles.loadingContainer}>
//           <View style={[styles.loadingIconWrapper, { backgroundColor: `${COLORS.primary}15` }]}>
//             <MaterialIcons name="confirmation-number" size={40} color={COLORS.primary} />
//           </View>
//           <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingSpinner} />
//           <Text style={styles.loadingText}>Loading ticket requests...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   console.log("Rendering main screen with", requests.length, "requests");

//   const StatCard = ({ icon, value, label, color }) => (
//     <View style={styles.statCard}>
//       <CardBackground accentColor={color} />
//       <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
//         <Ionicons name={icon} size={16} color={color} />
//       </View>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       {/* Animated Color Blocks */}
//       <AnimatedBackground />

//       <Animated.ScrollView
//         style={styles.container}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={COLORS.primary}
//             colors={[COLORS.primary]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Enhanced Header */}
//         <Header />

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Stats Overview */}
//           <View style={styles.statsOverview}>
//             <StatCard 
//               icon="receipt" 
//               value={stats.total} 
//               label="Total" 
//               color={COLORS.primary} 
//             />
//             <StatCard 
//               icon="time" 
//               value={stats.pending} 
//               label="Pending" 
//               color={COLORS.orange} 
//             />
//             <StatCard 
//               icon="checkmark-circle" 
//               value={stats.approved} 
//               label="Approved" 
//               color={COLORS.green} 
//             />
//           </View>

//           {/* Requests Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                 <MaterialIcons name="list-alt" size={18} color={COLORS.primary} />
//               </View>
//               <Text style={styles.sectionTitle}>Ticket Requests</Text>
//               <View style={[styles.countBadge, { backgroundColor: COLORS.primary }]}>
//                 <Text style={styles.countBadgeText}>{requests.length}</Text>
//               </View>
//             </View>

//             {requests.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <CardBackground accentColor={COLORS.primary} />
//                 <View style={[styles.emptyIconWrapper, { backgroundColor: `${COLORS.primary}15` }]}>
//                   <MaterialIcons name="confirmation-number" size={40} color={COLORS.primary} />
//                 </View>
//                 <Text style={styles.emptyTitle}>No Requests Found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   You haven't made any ticket requests for this game yet
//                 </Text>
//                 <TouchableOpacity
//                   style={[styles.newRequestButton, { backgroundColor: COLORS.primary }]}
//                   onPress={() => navigation.goBack()}
//                 >
//                   <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
//                   <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.requestsList}>
//                 {requests.map((request) => (
//                   <View key={request.id} style={styles.requestCard}>
//                     <CardBackground accentColor={
//                       request.status === "approved" ? COLORS.green :
//                       request.status === "pending" ? COLORS.orange :
//                       request.status === "rejected" ? COLORS.red :
//                       COLORS.primary
//                     } />
                    
//                     {/* Status Badge */}
//                     <View style={[
//                       styles.statusBadge, 
//                       { backgroundColor: getStatusBgColor(request.status) }
//                     ]}>
//                       <Ionicons 
//                         name={getStatusIcon(request.status)} 
//                         size={12} 
//                         color={getStatusColor(request.status)} 
//                       />
//                       <Text style={[
//                         styles.statusText,
//                         { color: getStatusColor(request.status) }
//                       ]}>
//                         {request.status?.toUpperCase() || "UNKNOWN"}
//                       </Text>
//                     </View>

//                     <View style={styles.cardHeader}>
//                       <View>
//                         <Text style={styles.requestId}>Request #{request.id}</Text>
//                         <Text style={styles.requestDateTime}>
//                           {formatDateTime(request.requested_at || request.created_at)}
//                         </Text>
//                       </View>
                      
//                       <View style={[
//                         styles.paymentStatusBadge,
//                         { 
//                           backgroundColor: request.payment_status === "paid" ? COLORS.greenLight : COLORS.orangeLight,
//                           borderColor: request.payment_status === "paid" ? COLORS.green : COLORS.orange,
//                         }
//                       ]}>
//                         <Text style={[
//                           styles.paymentStatusText,
//                           { color: request.payment_status === "paid" ? COLORS.green : COLORS.orange }
//                         ]}>
//                           {(request.payment_status || "pending").toUpperCase()}
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.requestDetails}>
//                       <View style={styles.detailRow}>
//                         <View style={styles.detailItem}>
//                           <View style={[styles.detailIcon, { backgroundColor: `${COLORS.primary}10` }]}>
//                             <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
//                           </View>
//                           <View style={styles.detailContent}>
//                             <Text style={styles.detailLabel}>Quantity</Text>
//                             <Text style={styles.detailValue}>
//                               {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
//                             </Text>
//                           </View>
//                         </View>
                        
//                         <View style={styles.detailItem}>
//                           <View style={[styles.detailIcon, { backgroundColor: `${COLORS.orange}10` }]}>
//                             <MaterialIcons name="account-balance-wallet" size={14} color={COLORS.orange} />
//                           </View>
//                           <View style={styles.detailContent}>
//                             <Text style={styles.detailLabel}>Amount</Text>
//                             <Text style={styles.detailValue}>₹{request.total_amount || "0"}</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>

//                     {request.notes && (
//                       <View style={styles.notesContainer}>
//                         <View style={[styles.notesIcon, { backgroundColor: `${COLORS.teal}10` }]}>
//                           <Feather name="message-square" size={14} color={COLORS.teal} />
//                         </View>
//                         <View style={styles.notesContent}>
//                           <Text style={styles.notesLabel}>Your Note</Text>
//                           <Text style={styles.notesText}>{request.notes}</Text>
//                         </View>
//                       </View>
//                     )}

//                     {request.rejection_reason && (
//                       <View style={styles.rejectionContainer}>
//                         <View style={[styles.rejectionIcon, { backgroundColor: `${COLORS.red}10` }]}>
//                           <Ionicons name="alert-circle" size={14} color={COLORS.red} />
//                         </View>
//                         <View style={styles.rejectionContent}>
//                           <Text style={styles.rejectionLabel}>Rejection Reason</Text>
//                           <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
//                         </View>
//                       </View>
//                     )}

//                     <View style={styles.actionContainer}>
//                       {request.status === "pending" ? (
//                         <TouchableOpacity
//                           style={[styles.cancelButton, { backgroundColor: COLORS.red }]}
//                           onPress={() => cancelTicketRequest(request.id)}
//                         >
//                           <Ionicons name="close-circle" size={16} color="#FFFFFF" />
//                           <Text style={styles.cancelButtonText}>Cancel Request</Text>
//                         </TouchableOpacity>
//                       ) : (
//                         <View style={[
//                           styles.statusContainer,
//                           { backgroundColor: getStatusBgColor(request.status) }
//                         ]}>
//                           <Ionicons 
//                             name={getStatusIcon(request.status)} 
//                             size={16} 
//                             color={getStatusColor(request.status)} 
//                           />
//                           <Text style={[
//                             styles.statusContainerText,
//                             { color: getStatusColor(request.status) }
//                           ]}>
//                             {request.status === "approved" ? "Request Approved" : 
//                              request.status === "rejected" ? "Request Rejected" : 
//                              request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
//                           </Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           <View style={styles.bottomSpace} />
//         </View>
//       </Animated.ScrollView>
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
  
//   /* COLOR BLOCKS - Animated */
//   blueBlock1: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 280,
//     backgroundColor: COLORS.blockLightBlue,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   blueBlock2: {
//     position: 'absolute',
//     top: 200,
//     left: 0,
//     right: 0,
//     height: 160,
//     backgroundColor: COLORS.blockMediumBlue,
//   },
//   blueBlock3: {
//     position: 'absolute',
//     top: 300,
//     left: 0,
//     right: 0,
//     height: 100,
//     backgroundColor: COLORS.blockDarkBlue,
//     opacity: 0.3,
//   },
  
//   /* Card Background */
//   cardBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: 20,
//   },
  
//   /* Decorative circles */
//   cardDecorativeCircle: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     opacity: 0.08,
//   },
//   circle1: {
//     top: -30,
//     right: -30,
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   circle2: {
//     bottom: -20,
//     left: -20,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     opacity: 0.06,
//   },
//   circle3: {
//     top: '40%',
//     left: '30%',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     opacity: 0.05,
//   },
  
//   /* Floating particles */
//   floatingParticle: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     opacity: 0.12,
//   },
//   particle1: {
//     top: 20,
//     right: 40,
//     width: 6,
//     height: 6,
//   },
//   particle2: {
//     bottom: 30,
//     left: 50,
//     width: 5,
//     height: 5,
//   },
//   particle3: {
//     top: '60%',
//     right: 60,
//     width: 7,
//     height: 7,
//   },
//   particle4: {
//     bottom: '20%',
//     left: 80,
//     width: 4,
//     height: 4,
//   },
  
//   /* Loading */
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//   },
//   loadingIconWrapper: {
//     width: 70,
//     height: 70,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   loadingSpinner: {
//     marginTop: 10,
//   },
//   loadingText: {
//     fontSize: 15,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginTop: 16,
//   },
  
//   /* Enhanced Header */
//   headerWrapper: {
//     position: 'relative',
//     marginTop: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//     paddingHorizontal: 16,
//   },
  
//   semicircleBackground: {
//     position: 'absolute',
//     top: -40,
//     right: -30,
//     width: 200,
//     height: 200,
//     overflow: 'hidden',
//   },
//   semicircle: {
//     position: 'absolute',
//     width: 400,
//     height: 200,
//     backgroundColor: COLORS.primaryLight,
//     borderTopLeftRadius: 200,
//     borderTopRightRadius: 200,
//     transform: [{ rotate: '-15deg' }],
//     opacity: 0.3,
//   },
  
//   ukPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
  
//   curvedLine1: {
//     position: 'absolute',
//     top: 20,
//     right: 50,
//     width: 80,
//     height: 40,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderRightWidth: 0,
//     borderRadius: 40,
//     opacity: 0.15,
//     transform: [{ rotate: '-10deg' }],
//   },
//   curvedLine2: {
//     position: 'absolute',
//     bottom: 10,
//     left: 30,
//     width: 60,
//     height: 30,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderBottomWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 30,
//     opacity: 0.15,
//     transform: [{ rotate: '15deg' }],
//   },
//   curvedLine3: {
//     position: 'absolute',
//     top: 40,
//     left: 100,
//     width: 100,
//     height: 50,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 50,
//     opacity: 0.1,
//     transform: [{ rotate: '20deg' }],
//   },
  
//   parallelLines: {
//     position: 'absolute',
//     top: 30,
//     left: 20,
//   },
//   parallelLine: {
//     width: 80,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     marginVertical: 4,
//     borderRadius: 1,
//   },
  
//   dottedCircle1: {
//     position: 'absolute',
//     bottom: 20,
//     right: 30,
//     width: 60,
//     height: 60,
//   },
//   dottedCircleDot: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//     top: 28,
//     left: 28,
//   },
  
//   decorativeDot1: {
//     position: 'absolute',
//     top: 60,
//     right: 80,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//   },
//   decorativeDot2: {
//     position: 'absolute',
//     bottom: 40,
//     left: 150,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     opacity: 0.15,
//   },
//   decorativeLine1: {
//     position: 'absolute',
//     top: 10,
//     left: 150,
//     width: 40,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '30deg' }],
//   },
//   decorativeLine2: {
//     position: 'absolute',
//     bottom: 30,
//     right: 100,
//     width: 50,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '-20deg' }],
//   },
  
//   /* Header Content */
//   headerContent: {
//     position: 'relative',
//     zIndex: 2,
//     marginTop:9
//   },
//   headerTopRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   refreshButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   pollingActive: {
//     borderColor: COLORS.green,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   gameInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   gameName: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
  
//   /* Content */
//   content: {
//     paddingHorizontal: 16,
//     paddingTop: 0,
//   },
//   statsOverview: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     gap: 8,
//   },
//   statCard: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: COLORS.surface,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRadius: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   statIconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 6,
//     zIndex: 2,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//     zIndex: 2,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     zIndex: 2,
//   },
  
//   /* Section */
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   sectionTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   countBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     minWidth: 24,
//     alignItems: 'center',
//   },
//   countBadgeText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: '#FFFFFF',
//   },
  
//   /* Requests List */
//   requestsList: {
//     gap: 12,
//   },
//   requestCard: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     padding: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.05)',
//     zIndex: 2,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginTop: 24,
//     marginBottom: 12,
//     zIndex: 2,
//   },
//   requestId: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   requestDateTime: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   paymentStatusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginLeft: 8,
//     borderWidth: 1,
//   },
//   paymentStatusText: {
//     fontSize: 9,
//     fontWeight: "700",
//   },
  
//   /* Details */
//   requestDetails: {
//     marginBottom: 12,
//     zIndex: 2,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 8,
//   },
//   detailItem: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//   },
//   detailIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   detailContent: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 12,
//     color: COLORS.text,
//     fontWeight: "600",
//   },
  
//   /* Notes */
//   notesContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: COLORS.background,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     zIndex: 2,
//   },
//   notesIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notesContent: {
//     flex: 1,
//   },
//   notesLabel: {
//     fontSize: 11,
//     color: COLORS.text,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   notesText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     lineHeight: 16,
//   },
  
//   /* Rejection */
//   rejectionContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: COLORS.redLight,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: COLORS.red,
//     zIndex: 2,
//   },
//   rejectionIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   rejectionContent: {
//     flex: 1,
//   },
//   rejectionLabel: {
//     fontSize: 11,
//     color: COLORS.red,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   rejectionText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     lineHeight: 16,
//     fontStyle: "italic",
//   },
  
//   /* Actions */
//   actionContainer: {
//     marginTop: 8,
//     zIndex: 2,
//   },
//   cancelButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 6,
//     shadowColor: COLORS.red,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cancelButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   statusContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 6,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statusContainerText: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
  
//   /* Empty State */
//   emptyState: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emptyIconWrapper: {
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     zIndex: 2,
//   },
//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//     textAlign: "center",
//     zIndex: 2,
//   },
//   emptySubtitle: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     textAlign: "center",
//     lineHeight: 18,
//     marginBottom: 20,
//     paddingHorizontal: 16,
//     zIndex: 2,
//   },
//   newRequestButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//     gap: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//     zIndex: 2,
//   },
//   newRequestButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   bottomSpace: {
//     height: 20,
//   },
// });

// export default TicketRequestsScreen;








// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Image,
//   RefreshControl,
//   SafeAreaView,
//   Dimensions,
//   AppState,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width } = Dimensions.get("window");

// // Updated Color scheme matching FAQ and Home
// const PRIMARY_COLOR = "#02658D"; // Main background color
// const SECONDARY_COLOR = "#02557A"; // Darker blue
// const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// const WHITE = "#FFFFFF";

// const TicketRequestsScreen = ({ route, navigation }) => {
//   const { gameId, gameName } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [requests, setRequests] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     cancelled: 0,
//   });
  
//   // Polling state
//   const [isPolling, setIsPolling] = useState(false);
//   const pollingIntervalRef = useRef(null);
//   const appState = useRef(AppState.currentState);
  
//   // Polling configuration
//   const POLLING_INTERVAL = 3000; // 10 seconds
//   const POLLING_INTERVAL_BACKGROUND = 30000; // 30 seconds when app is in background
//   const MAX_POLLING_DURATION = 300000; // Stop after 5 minutes to save battery

//   useEffect(() => {
//     console.log("Screen mounted, fetching requests for game:", gameId);
//     fetchTicketRequests();
    
//     // Start polling when component mounts
//     startPolling();
    
//     // Setup app state listener for background/foreground
//     const subscription = AppState.addEventListener("change", handleAppStateChange);
    
//     // Cleanup on unmount
//     return () => {
//       console.log("Component unmounting, cleaning up...");
//       stopPolling();
//       subscription.remove();
//     };
//   }, []);

//   useEffect(() => {
//     // Auto-stop polling after MAX_POLLING_DURATION to save battery
//     const autoStopTimer = setTimeout(() => {
//       if (isPolling) {
//         console.log("Auto-stopping polling after maximum duration");
//         stopPolling();
//       }
//     }, MAX_POLLING_DURATION);

//     return () => clearTimeout(autoStopTimer);
//   }, [isPolling]);

//   const handleAppStateChange = (nextAppState) => {
//     console.log("App state changed:", nextAppState);
    
//     if (nextAppState.match(/inactive|background/) && appState.current === "active") {
//       // App going to background
//       console.log("App going to background, adjusting polling interval");
//       adjustPollingForBackground();
//     } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//       // App coming to foreground
//       console.log("App coming to foreground, resuming normal polling");
//       adjustPollingForForeground();
//     }
    
//     appState.current = nextAppState;
//   };

//   const startPolling = () => {
//     console.log("Starting polling...");
    
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//     }
    
//     setIsPolling(true);
    
//     // Initial fetch
//     fetchTicketRequestsSilently();
    
//     // Set up interval for polling
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL);
//   };

//   const stopPolling = () => {
//     console.log("Stopping polling...");
//     setIsPolling(false);
    
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   };

//   const adjustPollingForBackground = () => {
//     if (!pollingIntervalRef.current) return;
    
//     console.log("Adjusting to background polling interval");
//     clearInterval(pollingIntervalRef.current);
    
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Background polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL_BACKGROUND);
//   };

//   const adjustPollingForForeground = () => {
//     if (!pollingIntervalRef.current) return;
    
//     console.log("Adjusting to foreground polling interval");
//     clearInterval(pollingIntervalRef.current);
    
//     pollingIntervalRef.current = setInterval(() => {
//       console.log("Foreground polling interval triggered");
//       fetchTicketRequestsSilently();
//     }, POLLING_INTERVAL);
//   };

//   const fetchTicketRequestsSilently = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
      
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );
      
//       if (response.data.success) {
//         const allRequests = response.data.ticket_requests?.data || [];
//         const gameRequests = allRequests.filter(
//           (request) => request.game_id == gameId || request.game_id === gameId
//         );
        
//         // Check if there are any status changes
//         const hasChanges = checkForStatusChanges(gameRequests);
        
//         if (hasChanges) {
//           console.log("Status changes detected, updating UI");
//           updateRequestsAndStats(gameRequests);
//         }
//       }
//     } catch (error) {
//       console.log("Silent fetch error:", error.message);
//       // Don't show alerts for silent fetches
//     }
//   };

//   const checkForStatusChanges = (newRequests) => {
//     if (requests.length !== newRequests.length) {
//       return true;
//     }
    
//     for (let i = 0; i < newRequests.length; i++) {
//       const newRequest = newRequests[i];
//       const oldRequest = requests.find(r => r.id === newRequest.id);
      
//       if (!oldRequest) return true;
      
//       if (oldRequest.status !== newRequest.status ||
//           oldRequest.payment_status !== newRequest.payment_status ||
//           oldRequest.rejection_reason !== newRequest.rejection_reason) {
//         return true;
//       }
//     }
    
//     return false;
//   };

//   const updateRequestsAndStats = (gameRequests) => {
//     setRequests(gameRequests);
    
//     const pendingCount = gameRequests.filter(r => r.status === "pending").length;
//     const approvedCount = gameRequests.filter(r => r.status === "approved").length;
//     const rejectedCount = gameRequests.filter(r => r.status === "rejected").length;
//     const cancelledCount = gameRequests.filter(r => r.status === "cancelled").length;
    
//     setStats({
//       total: gameRequests.length,
//       pending: pendingCount,
//       approved: approvedCount,
//       rejected: rejectedCount,
//       cancelled: cancelledCount,
//     });
//   };

//   const onRefresh = React.useCallback(() => {
//     console.log("Manual refresh triggered");
//     setRefreshing(true);
//     fetchTicketRequests().finally(() => {
//       setRefreshing(false);
//       console.log("Manual refresh complete");
//     });
//   }, []);

//   const fetchTicketRequests = async () => {
//     console.log("fetchTicketRequests called");
//     try {
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token found:", token ? "Yes" : "No");
      
//       const response = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-ticket-requests",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );

//       console.log("API Response:", response.data);
      
//       if (response.data.success) {
//         console.log("Data success, processing...");
//         const allRequests = response.data.ticket_requests?.data || [];
//         console.log("Total requests:", allRequests.length);
        
//         const gameRequests = allRequests.filter(
//           (request) => request.game_id == gameId || request.game_id === gameId
//         );
//         console.log("Filtered requests for game:", gameRequests.length);
        
//         updateRequestsAndStats(gameRequests);
//       } else {
//         console.log("API returned success: false", response.data);
//         Alert.alert("Error", response.data.message || "Failed to fetch requests");
//       }
//     } catch (error) {
//       console.log("Error fetching ticket requests:", error);
//       console.log("Error response:", error.response?.data);
//       Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
//     } finally {
//       console.log("Setting loading to false");
//       setLoading(false);
//     }
//   };

//   const cancelTicketRequest = async (requestId) => {
//     Alert.alert(
//       "Cancel Request",
//       "Are you sure you want to cancel this ticket request?",
//       [
//         {
//           text: "No",
//           style: "cancel"
//         },
//         {
//           text: "Yes, Cancel",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem("token");
//               const response = await axios.post(
//                 `https://tambolatime.co.in/public/api/user/my-ticket-requests/${requestId}/cancel`,
//                 {},
//                 { 
//                   headers: { 
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                   } 
//                 }
//               );

//               if (response.data.success) {
//                 Alert.alert("Success", "Ticket request cancelled successfully!");
//                 fetchTicketRequests();
//               } else {
//                 Alert.alert("Error", response.data.message || "Failed to cancel request");
//               }
//             } catch (error) {
//               console.log("Cancel error:", error);
//               Alert.alert(
//                 "Error",
//                 error.response?.data?.message || "Failed to cancel ticket request"
//               );
//             }
//           }
//         }
//       ]
//     );
//   };

//   const togglePolling = () => {
//     if (isPolling) {
//       stopPolling();
//     } else {
//       startPolling();
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "approved": return ACCENT_COLOR;
//       case "pending": return "#F39C12";
//       case "rejected": return "#E74C3C";
//       case "cancelled": return LIGHT_ACCENT;
//       default: return LIGHT_ACCENT;
//     }
//   };

//   const getStatusBgColor = (status) => {
//     switch (status) {
//       case "approved": return "rgba(255, 213, 79, 0.1)";
//       case "pending": return "rgba(243, 156, 18, 0.1)";
//       case "rejected": return "rgba(231, 76, 60, 0.1)";
//       case "cancelled": return "rgba(255, 236, 179, 0.1)";
//       default: return "rgba(255, 236, 179, 0.1)";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved": return "checkmark-circle";
//       case "pending": return "time";
//       case "rejected": return "close-circle";
//       case "cancelled": return "close-circle-outline";
//       default: return "help-circle";
//     }
//   };

//   const formatDateTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return "Invalid date";
//       }
//       return date.toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       console.log("Date formatting error:", error);
//       return dateString || "N/A";
//     }
//   };

//   if (loading) {
//     console.log("Showing loading screen");
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
//         <View style={styles.loadingContent}>
//           <View style={styles.loadingIconWrapper}>
//             <MaterialIcons name="confirmation-number" size={40} color={ACCENT_COLOR} />
//           </View>
//           <ActivityIndicator size="large" color={ACCENT_COLOR} style={styles.loadingSpinner} />
//           <Text style={styles.loadingText}>Loading ticket requests...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   console.log("Rendering main screen with", requests.length, "requests");

//   const StatCard = ({ icon, value, label, color }) => (
//     <View style={styles.statCard}>
//       <View style={[styles.statIconContainer, { backgroundColor: color }]}>
//         <Ionicons name={icon} size={18} color={SECONDARY_COLOR} />
//       </View>
//       <Text style={styles.statValue}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={SECONDARY_COLOR} barStyle="light-content" />
//       <ScrollView
//         style={styles.container}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={ACCENT_COLOR}
//             colors={[ACCENT_COLOR]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Ionicons name="arrow-back" size={24} color={TEXT_LIGHT} />
//             </TouchableOpacity>

//             <View style={styles.headerTextContainer}>
//               <Text style={styles.headerTitle}>My Ticket Requests</Text>
//               <View style={styles.gameInfoContainer}>
//                 <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
//                 <Text style={styles.gameName} numberOfLines={1}>
//                   {gameName || "Game"}
//                 </Text>
//               </View>
//             </View>
            
//             <TouchableOpacity 
//               style={styles.refreshButton}
//               onPress={fetchTicketRequests}
//             >
//               <Ionicons name="refresh" size={22} color={SECONDARY_COLOR} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Stats Overview */}
//           <View style={styles.statsOverview}>
//             <StatCard 
//               icon="receipt" 
//               value={stats.total} 
//               label="Total" 
//               color={ACCENT_COLOR} 
//             />
//             <StatCard 
//               icon="time" 
//               value={stats.pending} 
//               label="Pending" 
//               color="#F39C12" 
//             />
//             <StatCard 
//               icon="checkmark-circle" 
//               value={stats.approved} 
//               label="Approved" 
//               color={ACCENT_COLOR} 
//             />
//           </View>

//           {/* Requests Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>📋 Ticket Requests</Text>
//               <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
//             </View>

//             {requests.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <View style={styles.emptyIconWrapper}>
//                   <MaterialIcons name="confirmation-number" size={50} color={ACCENT_COLOR} />
//                 </View>
//                 <Text style={styles.emptyTitle}>No Requests Found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   You haven't made any ticket requests for this game yet
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.newRequestButton}
//                   onPress={() => navigation.goBack()}
//                 >
//                   <Ionicons name="arrow-back" size={18} color={SECONDARY_COLOR} />
//                   <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.requestsList}>
//                 {requests.map((request) => (
//                   <View key={request.id} style={styles.requestCard}>
//                     {/* Status Badge */}
//                     <View style={[styles.statusBadge, 
//                       { backgroundColor: getStatusBgColor(request.status) }
//                     ]}>
//                       <Ionicons 
//                         name={getStatusIcon(request.status)} 
//                         size={12} 
//                         color={getStatusColor(request.status)} 
//                       />
//                       <Text style={[
//                         styles.statusText,
//                         { color: getStatusColor(request.status) }
//                       ]}>
//                         {request.status?.toUpperCase() || "UNKNOWN"}
//                       </Text>
//                     </View>

//                     <View style={styles.cardHeader}>
//                       <View>
//                         <Text style={styles.requestId}>Request #{request.id}</Text>
//                         <Text style={styles.requestDateTime}>
//                           {formatDateTime(request.requested_at || request.created_at)}
//                         </Text>
//                       </View>
                      
//                       <View style={[
//                         styles.paymentStatusBadge,
//                         request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
//                       ]}>
//                         <Text style={styles.paymentStatusText}>
//                           {(request.payment_status || "pending").toUpperCase()}
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.requestDetails}>
//                       <View style={styles.detailRow}>
//                         <View style={styles.detailItem}>
//                           <View style={styles.detailIcon}>
//                             <MaterialIcons name="confirmation-number" size={14} color={ACCENT_COLOR} />
//                           </View>
//                           <View>
//                             <Text style={styles.detailLabel}>Quantity</Text>
//                             <Text style={styles.detailText}>
//                               {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
//                             </Text>
//                           </View>
//                         </View>
                        
//                         <View style={styles.detailItem}>
//                           <View style={styles.detailIcon}>
//                             <MaterialIcons name="account-balance-wallet" size={14} color={ACCENT_COLOR} />
//                           </View>
//                           <View>
//                             <Text style={styles.detailLabel}>Amount</Text>
//                             <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>

//                     {request.notes && (
//                       <View style={styles.notesContainer}>
//                         <View style={styles.notesIcon}>
//                           <Feather name="message-square" size={14} color={ACCENT_COLOR} />
//                         </View>
//                         <View style={styles.notesContent}>
//                           <Text style={styles.notesLabel}>Your Note</Text>
//                           <Text style={styles.notesText}>{request.notes}</Text>
//                         </View>
//                       </View>
//                     )}

//                     {request.rejection_reason && (
//                       <View style={styles.rejectionContainer}>
//                         <View style={styles.rejectionIcon}>
//                           <Ionicons name="alert-circle" size={14} color="#E74C3C" />
//                         </View>
//                         <View style={styles.rejectionContent}>
//                           <Text style={styles.rejectionLabel}>Rejection Reason</Text>
//                           <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
//                         </View>
//                       </View>
//                     )}

//                     <View style={styles.actionContainer}>
//                       {request.status === "pending" ? (
//                         <TouchableOpacity
//                           style={styles.cancelButton}
//                           onPress={() => cancelTicketRequest(request.id)}
//                         >
//                           <Ionicons name="close-circle" size={16} color={SECONDARY_COLOR} />
//                           <Text style={styles.cancelButtonText}>Cancel Request</Text>
//                         </TouchableOpacity>
//                       ) : (
//                         <TouchableOpacity
//                           style={[styles.cancelButton, styles.disabledButton]}
//                           disabled={true}
//                         >
//                           <Ionicons 
//                             name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
//                             size={16} 
//                             color="rgba(2, 85, 122, 0.7)" 
//                           />
//                           <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
//                             {request.status === "approved" ? "Request Approved" : 
//                              request.status === "rejected" ? "Request Rejected" : 
//                              request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
//                           </Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           <View style={styles.bottomSpace} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: PRIMARY_COLOR,
//   },
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: PRIMARY_COLOR,
//   },
//   loadingContent: {
//     alignItems: 'center',
//   },
//   loadingIconWrapper: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255, 213, 79, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 213, 79, 0.2)',
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
//   header: {
//     backgroundColor: SECONDARY_COLOR,
//     paddingTop: 20,
//     paddingBottom: 5,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     borderBottomWidth: 2,
//     borderBottomColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: DARK_BLUE,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: ACCENT_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: TEXT_LIGHT,
//     marginBottom: 4,
//   },
//   gameInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gameName: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   content: {
//     padding: 20,
//     paddingTop: 0,
//   },
//   statsOverview: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     marginTop: 20,
//   },
//   statCard: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: DARK_BLUE,
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     marginHorizontal: 4,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   statIconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: LIGHT_ACCENT,
//     fontWeight: "600",
//     opacity: 0.9,
//   },
//   section: {
//     marginBottom: 20,
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
//     color: TEXT_LIGHT,
//   },
//   sectionCount: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   requestsList: {
//     gap: 12,
//   },
//   requestCard: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     position: 'relative',
//     overflow: 'hidden',
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 213, 79, 0.3)',
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginTop: 25,
//     marginBottom: 16,
//   },
//   requestId: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//     marginBottom: 4,
//   },
//   requestDateTime: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   paymentStatusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginLeft: 8,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   paidStatus: {
//     backgroundColor: "rgba(255, 213, 79, 0.1)",
//   },
//   pendingStatus: {
//     backgroundColor: "rgba(243, 156, 18, 0.1)",
//   },
//   paymentStatusText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//   },
//   requestDetails: {
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
//     backgroundColor: SECONDARY_COLOR,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   detailLabel: {
//     fontSize: 10,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     marginBottom: 2,
//     opacity: 0.9,
//   },
//   detailText: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     fontWeight: "600",
//   },
//   notesContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: "rgba(255, 213, 79, 0.05)",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.1)",
//   },
//   notesIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: "rgba(255, 213, 79, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.2)",
//   },
//   notesContent: {
//     flex: 1,
//   },
//   notesLabel: {
//     fontSize: 11,
//     color: ACCENT_COLOR,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   notesText: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     lineHeight: 16,
//   },
//   rejectionContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: "rgba(231, 76, 60, 0.05)",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: "rgba(231, 76, 60, 0.1)",
//   },
//   rejectionIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: "rgba(231, 76, 60, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(231, 76, 60, 0.2)",
//   },
//   rejectionContent: {
//     flex: 1,
//   },
//   rejectionLabel: {
//     fontSize: 11,
//     color: "#E74C3C",
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   rejectionText: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     lineHeight: 16,
//     fontStyle: "italic",
//   },
//   actionContainer: {
//     marginTop: 8,
//   },
//   cancelButton: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 6,
//     backgroundColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   cancelButtonText: {
//     color: SECONDARY_COLOR,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   disabledButton: {
//     backgroundColor: DARK_BLUE,
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//   },
//   disabledButtonText: {
//     color: LIGHT_ACCENT,
//     opacity: 0.9,
//   },
//   emptyState: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     overflow: 'hidden',
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   emptyIconWrapper: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255, 213, 79, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 213, 79, 0.2)',
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//     opacity: 0.9,
//   },
//   newRequestButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   newRequestButtonText: {
//     color: SECONDARY_COLOR,
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   bottomSpace: {
//     height: 20,
//   },
// });

// export default TicketRequestsScreen;




import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  AppState,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

// Updated Color scheme matching Home component
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

const TicketRequestsScreen = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  });

  useEffect(() => {
    console.log("Screen mounted, fetching requests for game:", gameId);
    fetchTicketRequests();
    
    // Optional: Add focus listener to refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("Screen focused, refreshing data");
      fetchTicketRequests();
    });

    return () => {
      console.log("Component unmounting, cleaning up...");
      unsubscribe();
    };
  }, [navigation, gameId]);

  const onRefresh = React.useCallback(() => {
    console.log("Manual refresh triggered");
    setRefreshing(true);
    fetchTicketRequests().finally(() => {
      setRefreshing(false);
      console.log("Manual refresh complete");
    });
  }, []);

  const fetchTicketRequests = async () => {
    console.log("fetchTicketRequests called");
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
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

      console.log("API Response:", response.data);
      
      if (response.data.success) {
        console.log("Data success, processing...");
        const allRequests = response.data.ticket_requests?.data || [];
        console.log("Total requests:", allRequests.length);
        
        const gameRequests = allRequests.filter(
          (request) => request.game_id == gameId || request.game_id === gameId
        );
        console.log("Filtered requests for game:", gameRequests.length);
        
        updateRequestsAndStats(gameRequests);
      } else {
        console.log("API returned success: false", response.data);
        Alert.alert("Error", response.data.message || "Failed to fetch requests");
      }
    } catch (error) {
      console.log("Error fetching ticket requests:", error);
      console.log("Error response:", error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to fetch ticket requests");
    } finally {
      console.log("Setting loading to false");
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

  const cancelTicketRequest = async (requestId) => {
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
              console.log("Cancel error:", error);
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
      case "approved": return SUCCESS_COLOR;
      case "pending": return ACCENT_COLOR;
      case "rejected": return ERROR_COLOR;
      case "cancelled": return TEXT_LIGHT;
      default: return TEXT_LIGHT;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "approved": return "rgba(76, 175, 80, 0.1)";
      case "pending": return "rgba(255, 152, 0, 0.1)";
      case "rejected": return "rgba(231, 76, 60, 0.1)";
      case "cancelled": return "rgba(119, 119, 119, 0.1)";
      default: return "rgba(119, 119, 119, 0.1)";
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
      console.log("Date formatting error:", error);
      return dateString || "N/A";
    }
  };

  if (loading) {
    console.log("Showing loading screen");
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconWrapper}>
            <MaterialIcons name="confirmation-number" size={40} color={PRIMARY_COLOR} />
          </View>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading ticket requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log("Rendering main screen with", requests.length, "requests");

  const StatCard = ({ icon, value, label, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={WHITE} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>My Ticket Requests</Text>
              <View style={styles.gameInfoContainer}>
                <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.gameName} numberOfLines={1}>
                  {gameName || "Game"}
                </Text>
              </View>
            </View>
            
            {/* Optional: Add manual refresh button in header */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchTicketRequests}
            >
              <Ionicons name="refresh" size={20} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <StatCard 
              icon="receipt" 
              value={stats.total} 
              label="Total" 
              color={PRIMARY_COLOR} 
            />
            <StatCard 
              icon="time" 
              value={stats.pending} 
              label="Pending" 
              color={ACCENT_COLOR} 
            />
            <StatCard 
              icon="checkmark-circle" 
              value={stats.approved} 
              label="Approved" 
              color={SUCCESS_COLOR} 
            />
          </View>

          {/* Requests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ticket Requests</Text>
              <Text style={styles.sectionCount}>{requests.length} Request{requests.length !== 1 ? 's' : ''}</Text>
            </View>

            {requests.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrapper}>
                  <MaterialIcons name="confirmation-number" size={50} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.emptyTitle}>No Requests Found</Text>
                <Text style={styles.emptySubtitle}>
                  You haven't made any ticket requests for this game yet
                </Text>
                <TouchableOpacity
                  style={styles.newRequestButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={18} color={WHITE} />
                  <Text style={styles.newRequestButtonText}>Go Back to Game</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.requestsList}>
                {requests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, 
                      { backgroundColor: getStatusBgColor(request.status) }
                    ]}>
                      <Ionicons 
                        name={getStatusIcon(request.status)} 
                        size={12} 
                        color={getStatusColor(request.status)} 
                      />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(request.status) }
                      ]}>
                        {request.status?.toUpperCase() || "UNKNOWN"}
                      </Text>
                    </View>

                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.requestId}>Request #{request.id}</Text>
                        <Text style={styles.requestDateTime}>
                          {formatDateTime(request.requested_at || request.created_at)}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles.paymentStatusBadge,
                        request.payment_status === "paid" ? styles.paidStatus : styles.pendingStatus
                      ]}>
                        <Text style={styles.paymentStatusText}>
                          {(request.payment_status || "pending").toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <MaterialIcons name="confirmation-number" size={14} color={PRIMARY_COLOR} />
                          </View>
                          <View>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <Text style={styles.detailText}>
                              {request.ticket_quantity || 1} Ticket{request.ticket_quantity > 1 ? 's' : ''}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <View style={styles.detailIcon}>
                            <MaterialIcons name="account-balance-wallet" size={14} color={PRIMARY_COLOR} />
                          </View>
                          <View>
                            <Text style={styles.detailLabel}>Amount</Text>
                            <Text style={styles.detailText}>₹{request.total_amount || "0"}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {request.notes && (
                      <View style={styles.notesContainer}>
                        <View style={styles.notesIcon}>
                          <Feather name="message-square" size={14} color={PRIMARY_COLOR} />
                        </View>
                        <View style={styles.notesContent}>
                          <Text style={styles.notesLabel}>Your Note</Text>
                          <Text style={styles.notesText}>{request.notes}</Text>
                        </View>
                      </View>
                    )}

                    {request.rejection_reason && (
                      <View style={styles.rejectionContainer}>
                        <View style={styles.rejectionIcon}>
                          <Ionicons name="alert-circle" size={14} color={ERROR_COLOR} />
                        </View>
                        <View style={styles.rejectionContent}>
                          <Text style={styles.rejectionLabel}>Rejection Reason</Text>
                          <Text style={styles.rejectionText}>{request.rejection_reason}</Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.actionContainer}>
                      {request.status === "pending" ? (
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => cancelTicketRequest(request.id)}
                        >
                          <Ionicons name="close-circle" size={16} color={WHITE} />
                          <Text style={styles.cancelButtonText}>Cancel Request</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.cancelButton, styles.disabledButton]}
                          disabled={true}
                        >
                          <Ionicons 
                            name={request.status === "approved" ? "checkmark-circle" : "close-circle"} 
                            size={16} 
                            color={WHITE} 
                          />
                          <Text style={[styles.cancelButtonText, styles.disabledButtonText]}>
                            {request.status === "approved" ? "Request Approved" : 
                             request.status === "rejected" ? "Request Rejected" : 
                             request.status === "cancelled" ? "Request Cancelled" : "Request Processed"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.2)',
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
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: WHITE,
    marginBottom: 4,
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
    paddingTop: 0,
  },
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: WHITE,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    color: TEXT_DARK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  sectionCount: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
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
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
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
    color: TEXT_DARK,
    marginBottom: 4,
  },
  requestDateTime: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  paidStatus: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: SUCCESS_COLOR,
  },
  pendingStatus: {
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderColor: ACCENT_COLOR,
  },
  paymentStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_DARK,
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
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: BACKGROUND_COLOR,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  notesIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  notesContent: {
    flex: 1,
  },
  notesLabel: {
    fontSize: 11,
    color: TEXT_DARK,
    fontWeight: "600",
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
  },
  rejectionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(231, 76, 60, 0.05)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  rejectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.2)",
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 11,
    color: ERROR_COLOR,
    fontWeight: "600",
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
    fontStyle: "italic",
  },
  actionContainer: {
    marginTop: 8,
  },
  cancelButton: {
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
  },
  cancelButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  disabledButtonText: {
    color: TEXT_LIGHT,
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
  newRequestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newRequestButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpace: {
    height: 20,
  },
});

export default TicketRequestsScreen;
// // // import React, { useEffect, useState, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   Image,
// // //   ActivityIndicator,
// // //   Alert,
// // //   RefreshControl,
// // //   Dimensions,
// // //   Modal,
// // //   StatusBar,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";

// // // // For React Native CLI, use react-native-vector-icons
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";

// // // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // // EXACT SAME parameters from your example
// // // const NUM_COLUMNS = 9;
// // // const CELL_MARGIN = 2;
// // // const TICKET_PADDING = 8;
// // // const HORIZONTAL_MARGIN = 10;

// // // // EXACT SAME calculation from your example
// // // const CELL_WIDTH = 
// // //   (SCREEN_WIDTH - 
// // //    HORIZONTAL_MARGIN * 2 - 
// // //    TICKET_PADDING * 2 - 
// // //    CELL_MARGIN * 2 * NUM_COLUMNS) / 
// // //   NUM_COLUMNS;

// // // // Updated colors to match new blue/gold scheme
// // // const ROW_COLOR_1 = "#02557A"; // Darker blue for even rows
// // // const ROW_COLOR_2 = "#014560"; // Dark blue for odd rows
// // // const FILLED_CELL_BG = "#FFD54F"; // Amber/Gold for filled cells
// // // const CELL_BORDER_COLOR = "#FFD54F"; // Amber/Gold border
// // // const NUMBER_COLOR = "#014560"; // Dark blue for numbers

// // // // Updated Color scheme matching FAQ and Home
// // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
// // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds

// // // const TicketsScreen = ({ route, navigation }) => {
// // //   const { game } = route.params || {};
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [myTickets, setMyTickets] = useState([]);
// // //   const [selectedTicket, setSelectedTicket] = useState(null);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [stats, setStats] = useState({
// // //     total: 0,
// // //     active: 0,
// // //     sets: 0,
// // //   });

// // //   const GAME_IMAGES = {
// // //     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
// // //     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
// // //     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
// // //     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
// // //     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
// // //     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
// // //     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
// // //     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
// // //   };

// // //   useEffect(() => {
// // //     fetchMyTickets();
// // //   }, []);

// // //   const onRefresh = React.useCallback(() => {
// // //     console.log("Refreshing tickets...");
// // //     setRefreshing(true);
// // //     fetchMyTickets().finally(() => {
// // //       setRefreshing(false);
// // //       console.log("Refresh complete");
// // //     });
// // //   }, []);

// // //   const fetchMyTickets = async () => {
// // //     console.log("fetchMyTickets called");
// // //     try {
// // //       setLoading(true);
// // //       const token = await AsyncStorage.getItem("token");
// // //       console.log("Token found:", token ? "Yes" : "No");
      
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );

// // //       console.log("Tickets API Response:", res.data);
      
// // //       if (res.data.success) {
// // //         // Filter tickets for the current game if game prop exists
// // //         const tickets = game
// // //           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
// // //           : res.data.tickets.data;
        
// // //         console.log("Filtered tickets:", tickets.length);
// // //         setMyTickets(tickets);
        
// // //         // Calculate stats (keeping for potential future use)
// // //         const activeCount = tickets.filter(t => t.is_active).length;
// // //         const setsCount = getTicketSetCount(tickets);
        
// // //         setStats({
// // //           total: tickets.length,
// // //           active: activeCount,
// // //           sets: setsCount,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching tickets:", error);
// // //       console.log("Error response:", error.response?.data);
// // //       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Helper function to convert ticket_data to the format needed for rendering
// // //   const processTicketData = (ticketData) => {
// // //     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
// // //     // Check if the data is in the new format (array of objects)
// // //     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
// // //       // New format: array of objects with number property
// // //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// // //       ticketData.forEach((row) => {
// // //         row.forEach((cell) => {
// // //           if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
// // //             processedGrid[cell.row][cell.column] = cell.number;
// // //           }
// // //         });
// // //       });
      
// // //       return processedGrid;
// // //     } else if (ticketData[0] && Array.isArray(ticketData[0])) {
// // //       // Old format: simple 2D array
// // //       return ticketData.map(row => row.map(cell => cell));
// // //     }
    
// // //     return Array(3).fill(Array(9).fill(null));
// // //   };

// // //   const renderTicketGrid = (ticketData, isModal = false) => {
// // //     const processedData = processTicketData(ticketData);
    
// // //     return (
// // //       <View style={[
// // //         styles.ticket,
// // //         { 
// // //           width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
// // //           backgroundColor: DARK_BLUE,
// // //           borderColor: ACCENT_COLOR,
// // //         }
// // //       ]}>
// // //         {/* Ticket rows without column headers */}
// // //         {processedData.map((row, rowIndex) => (
// // //           <View 
// // //             key={`row-${rowIndex}`} 
// // //             style={[
// // //               styles.row,
// // //               { 
// // //                 backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
// // //               }
// // //             ]}
// // //           >
// // //             {row.map((cell, colIndex) => {
// // //               const isEmpty = cell === null;
              
// // //               return (
// // //                 <View
// // //                   key={`cell-${rowIndex}-${colIndex}`}
// // //                   style={[
// // //                     styles.cell,
// // //                     { 
// // //                       width: CELL_WIDTH,
// // //                       height: CELL_WIDTH,
// // //                       margin: CELL_MARGIN,
// // //                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
// // //                       borderColor: ACCENT_COLOR,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   {!isEmpty && (
// // //                     <Text style={styles.number}>
// // //                       {cell}
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

// // //   const renderTicketItem = ({ item }) => (
// // //     <View style={styles.ticketItemContainer}>
// // //       {/* Ticket number and status outside the card */}
// // //       <View style={styles.ticketHeader}>
// // //         <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
// // //         <View style={[
// // //           styles.statusBadge,
// // //           { backgroundColor: item.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
// // //         ]}>
// // //           <Ionicons
// // //             name={item.is_active ? "checkmark-circle" : "close-circle"}
// // //             size={12}
// // //             color={item.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
// // //           />
// // //           <Text style={[styles.statusText, { color: item.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
// // //             {item.is_active ? "Active" : "Inactive"}
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Ticket Card with grid */}
// // //       <TouchableOpacity
// // //         onPress={() => {
// // //           setSelectedTicket(item);
// // //           setModalVisible(true);
// // //         }}
// // //         activeOpacity={0.9}
// // //       >
// // //         {/* Ticket grid directly on the white card */}
// // //         {renderTicketGrid(item.ticket_data)}
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   // Calculate ticket set count
// // //   const getTicketSetCount = (tickets) => {
// // //     const sets = new Set(tickets.map(t => t.ticket_set_id));
// // //     return sets.size;
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
// // //           <Text style={styles.loadingText}>Loading your tickets...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

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
// // //         {/* Header with blue background */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerContent}>
// // //             <View style={styles.headerTopRow}>
// // //               <TouchableOpacity
// // //                 style={styles.backButton}
// // //                 onPress={() => navigation.goBack()}
// // //               >
// // //                 <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
// // //               </TouchableOpacity>

// // //               <View style={styles.headerTextContainer}>
// // //                 <Text style={styles.headerTitle}>My Tickets</Text>
// // //                 {game && (
// // //                   <View style={styles.gameInfoContainer}>
// // //                     <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
// // //                     <Text style={styles.gameName} numberOfLines={1}>
// // //                       {game.game_name || "Game"}
// // //                     </Text>
// // //                   </View>
// // //                 )}
// // //               </View>

// // //               <TouchableOpacity 
// // //                 style={styles.refreshButton}
// // //                 onPress={fetchMyTickets}
// // //               >
// // //                 <Ionicons name="refresh" size={22} color={ACCENT_COLOR} />
// // //               </TouchableOpacity>
// // //             </View>

// // //             {/* Stats Cards */}
// // //             <View style={styles.statsContainer}>
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="ticket-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>{myTickets.length}</Text>
// // //                 <Text style={styles.statLabel}>Total Tickets</Text>
// // //               </View>
              
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="checkmark-circle-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>
// // //                   {myTickets.filter(t => t.is_active).length}
// // //                 </Text>
// // //                 <Text style={styles.statLabel}>Active</Text>
// // //               </View>
              
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="grid-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>
// // //                   {getTicketSetCount(myTickets)}
// // //                 </Text>
// // //                 <Text style={styles.statLabel}>Sets</Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Content */}
// // //         <View style={styles.content}>
// // //           {/* Tickets Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <Text style={styles.sectionTitle}>🎟 My Tickets Collection</Text>
// // //               <View style={styles.countBadge}>
// // //                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
// // //               </View>
// // //             </View>

// // //             {myTickets.length === 0 ? (
// // //               <View style={styles.emptyState}>
// // //                 <Image
// // //                   source={{ uri: GAME_IMAGES.empty }}
// // //                   style={styles.emptyIcon}
// // //                   tintColor={ACCENT_COLOR}
// // //                 />
// // //                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
// // //                 <Text style={styles.emptySubtitle}>
// // //                   {game
// // //                     ? "You don't have any tickets for this game yet"
// // //                     : "You haven't been allocated any tickets yet"}
// // //                 </Text>
// // //                 <TouchableOpacity
// // //                   style={styles.refreshButtonLarge}
// // //                   onPress={fetchMyTickets}
// // //                 >
// // //                   <View style={styles.glassEffectOverlay} />
// // //                   <Ionicons name="refresh" size={18} color={SECONDARY_COLOR} />
// // //                   <Text style={styles.refreshButtonText}>Refresh</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.ticketsList}>
// // //                 {myTickets.map((ticket) => (
// // //                   <View key={ticket.id} style={styles.ticketWrapper}>
// // //                     {renderTicketItem({ item: ticket })}
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* Bottom Info */}
// // //           <View style={styles.infoCard}>
// // //             <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
// // //             <Text style={styles.infoCardText}>
// // //               • Active tickets are eligible for game participation{'\n'}
// // //               • Each ticket has a unique number and belongs to a set{'\n'}
// // //               • Tickets are automatically allocated for approved requests
// // //             </Text>
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </View>
// // //       </ScrollView>

// // //       {/* Ticket Detail Modal */}
// // //       <Modal
// // //         animationType="fade"
// // //         transparent={true}
// // //         visible={modalVisible}
// // //         onRequestClose={() => setModalVisible(false)}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.modalContainer}>
// // //             {selectedTicket && (
// // //               <>
// // //                 <View style={styles.modalHeader}>
// // //                   <View style={styles.modalTitleContainer}>
// // //                     <View style={styles.ticketNumberBadge}>
// // //                       <Ionicons name="ticket-outline" size={16} color={SECONDARY_COLOR} />
// // //                       <Text style={styles.ticketNumberBadgeText}>
// // //                         Ticket No: #{selectedTicket.ticket_number}
// // //                       </Text>
// // //                     </View>
// // //                     <View style={[
// // //                       styles.modalStatusBadge,
// // //                       { backgroundColor: selectedTicket.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
// // //                     ]}>
// // //                       <Ionicons
// // //                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
// // //                         size={12}
// // //                         color={selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
// // //                       />
// // //                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
// // //                         {selectedTicket.is_active ? "Active" : "Inactive"}
// // //                       </Text>
// // //                     </View>
// // //                   </View>
// // //                   <TouchableOpacity 
// // //                     style={styles.closeButton}
// // //                     onPress={() => setModalVisible(false)}
// // //                   >
// // //                     <Ionicons name="close" size={22} color={ACCENT_COLOR} />
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 <View style={styles.modalContent}>
// // //                   {selectedTicket.game && (
// // //                     <View style={styles.gameCard}>
// // //                       <View style={styles.gameCardHeader}>
// // //                         <Ionicons name="game-controller" size={16} color={ACCENT_COLOR} />
// // //                         <Text style={styles.gameCardTitle}>Game Details</Text>
// // //                       </View>
// // //                       <View style={styles.gameCardContent}>
// // //                         <Text style={styles.gameNameText} numberOfLines={2}>
// // //                           {selectedTicket.game.game_name}
// // //                         </Text>
// // //                         <View style={styles.gameDetailsRow}>
// // //                           <View style={styles.gameDetailItem}>
// // //                             <Feather name="hash" size={12} color={LIGHT_ACCENT} />
// // //                             <Text style={styles.gameCodeText}>
// // //                               {selectedTicket.game.game_code}
// // //                             </Text>
// // //                           </View>
// // //                           <View style={styles.gameDetailItem}>
// // //                             <Feather name="calendar" size={12} color={LIGHT_ACCENT} />
// // //                             <Text style={styles.gameTimeText}>
// // //                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
// // //                             </Text>
// // //                           </View>
// // //                         </View>
// // //                       </View>
// // //                     </View>
// // //                   )}

// // //                   <View style={styles.fullTicketContainerModal}>
// // //                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
// // //                     <View style={styles.modalTicketGrid}>
// // //                       {renderTicketGrid(selectedTicket.ticket_data, true)}
// // //                     </View>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.modalActions}>
// // //                   <TouchableOpacity
// // //                     style={styles.closeModalButton}
// // //                     onPress={() => setModalVisible(false)}
// // //                   >
// // //                     <View style={styles.glassEffectOverlay} />
// // //                     <Text style={styles.closeModalButtonText}>Close</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </Modal>
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
// // //     paddingTop: 40,
// // //     paddingBottom: 20,
// // //     backgroundColor: SECONDARY_COLOR,
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
// // //     paddingHorizontal: 20,
// // //   },
// // //   headerTopRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 20,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: TEXT_LIGHT,
// // //     letterSpacing: -0.5,
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
// // //   refreshButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   statsContainer: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     gap: 12,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   statValue: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: ACCENT_COLOR,
// // //     marginVertical: 6,
// // //   },
// // //   statLabel: {
// // //     fontSize: 12,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "600",
// // //     textAlign: 'center',
// // //     opacity: 0.9,
// // //   },
// // //   content: {
// // //     padding: HORIZONTAL_MARGIN,
// // //     paddingTop: 20,
// // //     zIndex: 1,
// // //     marginTop: 0,
// // //   },
// // //   section: {
// // //     marginBottom: 20,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 16,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //     color: ACCENT_COLOR,
// // //   },
// // //   countBadge: {
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //     minWidth: 30,
// // //     alignItems: 'center',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   countBadgeText: {
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //     color: SECONDARY_COLOR,
// // //   },
// // //   ticketsList: {
// // //     gap: 20,
// // //   },
// // //   ticketWrapper: {

// // //   },
// // //   ticketItemContainer: {
// // //     // No margin needed since wrapper handles it
// // //   },
// // //   ticketHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 8,
// // //     paddingHorizontal: 4,
// // //   },
// // //   ticketNo: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   statusBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 5,
// // //     borderRadius: 6,
// // //     gap: 4,
// // //   },
// // //   statusText: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //   },
// // //   // Ticket grid styles
// // //   ticket: {
// // //     backgroundColor: DARK_BLUE,
// // //     padding: TICKET_PADDING,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     borderRadius: 12,
// // //     overflow: "hidden",
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 6,
// // //     elevation: 8,
// // //   },
// // //   row: {
// // //     flexDirection: "row",
// // //   },
// // //   cell: {
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderRadius: 2,
// // //   },
// // //   number: {
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //     color: DARK_BLUE,
// // //   },
// // //   emptyState: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //     marginTop: 20,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   emptyIcon: {
// // //     width: 80,
// // //     height: 80,
// // //     marginBottom: 20,
// // //     opacity: 0.7,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     textAlign: "center",
// // //     lineHeight: 20,
// // //     marginBottom: 24,
// // //     paddingHorizontal: 20,
// // //     opacity: 0.9,
// // //   },
// // //   refreshButtonLarge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 8,
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 6,
// // //     elevation: 6,
// // //   },
// // //   glassEffectOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(255, 255, 255, 0.4)',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(0, 0, 0, 0.2)',
// // //     borderRadius: 10,
// // //   },
// // //   refreshButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   infoCard: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 12,
// // //     padding: 18,
// // //     marginBottom: 20,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //     gap: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   infoCardText: {
// // //     flex: 1,
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     lineHeight: 20,
// // //     opacity: 0.9,
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: "rgba(0,0,0,0.85)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingHorizontal: 20,
// // //   },
// // //   modalContainer: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 20,
// // //     padding: 0,
// // //     width: "100%",
// // //     maxWidth: 400,
// // //     maxHeight: "85%",
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: 0.5,
// // //     shadowRadius: 20,
// // //     elevation: 10,
// // //     overflow: 'hidden',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     padding: 20,
// // //     paddingBottom: 16,
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   modalTitleContainer: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     flexWrap: 'wrap',
// // //   },
// // //   ticketNumberBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(255, 213, 79, 0.15)",
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     gap: 8,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   ticketNumberBadgeText: {
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   modalStatusBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //     borderRadius: 6,
// // //     gap: 4,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   modalStatusText: {
// // //     fontSize: 12,
// // //     fontWeight: "600",
// // //   },
// // //   closeButton: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   modalContent: {
// // //     padding: 20,
// // //   },
// // //   gameCard: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 20,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   gameCardHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     marginBottom: 12,
// // //   },
// // //   gameCardTitle: {
// // //     fontSize: 15,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //   },
// // //   gameCardContent: {
// // //     gap: 8,
// // //   },
// // //   gameNameText: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 20,
// // //   },
// // //   gameDetailsRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 16,
// // //     flexWrap: 'wrap',
// // //   },
// // //   gameDetailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //   },
// // //   gameCodeText: {
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   gameTimeText: {
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   fullTicketContainerModal: {
// // //     marginBottom: 20,
// // //   },
// // //   ticketGridTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 12,
// // //     textAlign: 'center',
// // //   },
// // //   modalTicketGrid: {
// // //     marginBottom: 16,
// // //   },
// // //   modalActions: {
// // //     padding: 20,
// // //     paddingTop: 0,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   closeModalButton: {
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 30,
// // //     paddingVertical: 14,
// // //     borderRadius: 10,
// // //     width: "100%",
// // //     alignItems: "center",
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 6 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 8,
// // //   },
// // //   closeModalButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // // });

// // // export default TicketsScreen;





// // // import React, { useEffect, useState, useRef } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   Image,
// // //   ActivityIndicator,
// // //   Alert,
// // //   RefreshControl,
// // //   Dimensions,
// // //   Modal,
// // //   StatusBar,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";

// // // // For React Native CLI, use react-native-vector-icons
// // // import Ionicons from "react-native-vector-icons/Ionicons";
// // // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // // import Feather from "react-native-vector-icons/Feather";

// // // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // // EXACT SAME parameters from your example
// // // const NUM_COLUMNS = 9;
// // // const CELL_MARGIN = 2;
// // // const TICKET_PADDING = 8;
// // // const HORIZONTAL_MARGIN = 10;

// // // // EXACT SAME calculation from your example
// // // const CELL_WIDTH = 
// // //   (SCREEN_WIDTH - 
// // //    HORIZONTAL_MARGIN * 2 - 
// // //    TICKET_PADDING * 2 - 
// // //    CELL_MARGIN * 2 * NUM_COLUMNS) / 
// // //   NUM_COLUMNS;

// // // // Updated colors to match new blue/gold scheme
// // // const ROW_COLOR_1 = "#02557A"; // Darker blue for even rows
// // // const ROW_COLOR_2 = "#014560"; // Dark blue for odd rows
// // // const FILLED_CELL_BG = "#f0ae13"; // Amber/Gold for filled cells
// // // const CELL_BORDER_COLOR = "#f0ae13"; // Amber/Gold border
// // // const NUMBER_COLOR = "#014560"; // Dark blue for numbers

// // // // Updated Color scheme matching FAQ and Home
// // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds

// // // const TicketsScreen = ({ route, navigation }) => {
// // //   const { game } = route.params || {};
// // //   const [loading, setLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [myTickets, setMyTickets] = useState([]);
// // //   const [selectedTicket, setSelectedTicket] = useState(null);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [stats, setStats] = useState({
// // //     total: 0,
// // //     active: 0,
// // //     sets: 0,
// // //   });

// // //   const GAME_IMAGES = {
// // //     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
// // //     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
// // //     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
// // //     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
// // //     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
// // //     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
// // //     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
// // //     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
// // //   };

// // //   useEffect(() => {
// // //     fetchMyTickets();
// // //   }, []);

// // //   const onRefresh = React.useCallback(() => {
// // //     console.log("Refreshing tickets...");
// // //     setRefreshing(true);
// // //     fetchMyTickets().finally(() => {
// // //       setRefreshing(false);
// // //       console.log("Refresh complete");
// // //     });
// // //   }, []);

// // //   const fetchMyTickets = async () => {
// // //     console.log("fetchMyTickets called");
// // //     try {
// // //       setLoading(true);
// // //       const token = await AsyncStorage.getItem("token");
// // //       console.log("Token found:", token ? "Yes" : "No");
      
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/my-tickets",
// // //         { 
// // //           headers: { 
// // //             Authorization: `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //             'Accept': 'application/json'
// // //           } 
// // //         }
// // //       );

// // //       console.log("Tickets API Response:", res.data);
      
// // //       if (res.data.success) {
// // //         // Filter tickets for the current game if game prop exists
// // //         const tickets = game
// // //           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
// // //           : res.data.tickets.data;
        
// // //         console.log("Filtered tickets:", tickets.length);
// // //         setMyTickets(tickets);
        
// // //         // Calculate stats (keeping for potential future use)
// // //         const activeCount = tickets.filter(t => t.is_active).length;
// // //         const setsCount = getTicketSetCount(tickets);
        
// // //         setStats({
// // //           total: tickets.length,
// // //           active: activeCount,
// // //           sets: setsCount,
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.log("Error fetching tickets:", error);
// // //       console.log("Error response:", error.response?.data);
// // //       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Helper function to convert ticket_data to the format needed for rendering
// // //   const processTicketData = (ticketData) => {
// // //     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
// // //     // Check if the data is in the new format (array of objects)
// // //     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
// // //       // New format: array of objects with number property
// // //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// // //       ticketData.forEach((row) => {
// // //         row.forEach((cell) => {
// // //           if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
// // //             processedGrid[cell.row][cell.column] = cell.number;
// // //           }
// // //         });
// // //       });
      
// // //       return processedGrid;
// // //     } else if (ticketData[0] && Array.isArray(ticketData[0])) {
// // //       // Old format: simple 2D array
// // //       return ticketData.map(row => row.map(cell => cell));
// // //     }
    
// // //     return Array(3).fill(Array(9).fill(null));
// // //   };

// // //   const renderTicketGrid = (ticketData, isModal = false) => {
// // //     const processedData = processTicketData(ticketData);
    
// // //     return (
// // //       <View style={[
// // //         styles.ticket,
// // //         { 
// // //           width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
// // //           backgroundColor: DARK_BLUE,
// // //           borderColor: ACCENT_COLOR,
// // //         }
// // //       ]}>
// // //         {/* Ticket rows without column headers */}
// // //         {processedData.map((row, rowIndex) => (
// // //           <View 
// // //             key={`row-${rowIndex}`} 
// // //             style={[
// // //               styles.row,
// // //               { 
// // //                 backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
// // //               }
// // //             ]}
// // //           >
// // //             {row.map((cell, colIndex) => {
// // //               const isEmpty = cell === null;
              
// // //               return (
// // //                 <View
// // //                   key={`cell-${rowIndex}-${colIndex}`}
// // //                   style={[
// // //                     styles.cell,
// // //                     { 
// // //                       width: CELL_WIDTH,
// // //                       height: CELL_WIDTH,
// // //                       margin: CELL_MARGIN,
// // //                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
// // //                       borderColor: ACCENT_COLOR,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   {!isEmpty && (
// // //                     <Text style={styles.number}>
// // //                       {cell}
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

// // //   const renderTicketItem = ({ item }) => (
// // //     <View style={styles.ticketItemContainer}>
// // //       {/* Ticket number and status outside the card */}
// // //       <View style={styles.ticketHeader}>
// // //         <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
// // //         <View style={[
// // //           styles.statusBadge,
// // //           { backgroundColor: item.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
// // //         ]}>
// // //           <Ionicons
// // //             name={item.is_active ? "checkmark-circle" : "close-circle"}
// // //             size={12}
// // //             color={item.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
// // //           />
// // //           <Text style={[styles.statusText, { color: item.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
// // //             {item.is_active ? "Active" : "Inactive"}
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Ticket Card with grid */}
// // //       <TouchableOpacity
// // //         onPress={() => {
// // //           setSelectedTicket(item);
// // //           setModalVisible(true);
// // //         }}
// // //         activeOpacity={0.9}
// // //       >
// // //         {/* Ticket grid directly on the white card */}
// // //         {renderTicketGrid(item.ticket_data)}
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   // Calculate ticket set count
// // //   const getTicketSetCount = (tickets) => {
// // //     const sets = new Set(tickets.map(t => t.ticket_set_id));
// // //     return sets.size;
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
// // //           <Text style={styles.loadingText}>Loading your tickets...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

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
// // //         {/* Header with blue background */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerContent}>
// // //             <View style={styles.headerTopRow}>
// // //               <TouchableOpacity
// // //                 style={styles.backButton}
// // //                 onPress={() => navigation.goBack()}
// // //               >
// // //                 <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
// // //               </TouchableOpacity>

// // //               <View style={styles.headerTextContainer}>
// // //                 <Text style={styles.headerTitle}>My Tickets</Text>
// // //                 {game && (
// // //                   <View style={styles.gameInfoContainer}>
// // //                     <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
// // //                     <Text style={styles.gameName} numberOfLines={1}>
// // //                       {game.game_name || "Game"}
// // //                     </Text>
// // //                   </View>
// // //                 )}
// // //               </View>

// // //               <TouchableOpacity 
// // //                 style={styles.refreshButton}
// // //                 onPress={fetchMyTickets}
// // //               >
// // //                 <Ionicons name="refresh" size={22} color={ACCENT_COLOR} />
// // //               </TouchableOpacity>
// // //             </View>

// // //             {/* Stats Cards */}
// // //             <View style={styles.statsContainer}>
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="ticket-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>{myTickets.length}</Text>
// // //                 <Text style={styles.statLabel}>Total Tickets</Text>
// // //               </View>
              
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="checkmark-circle-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>
// // //                   {myTickets.filter(t => t.is_active).length}
// // //                 </Text>
// // //                 <Text style={styles.statLabel}>Active</Text>
// // //               </View>
              
// // //               <View style={styles.statCard}>
// // //                 <Ionicons name="grid-outline" size={20} color={ACCENT_COLOR} />
// // //                 <Text style={styles.statValue}>
// // //                   {getTicketSetCount(myTickets)}
// // //                 </Text>
// // //                 <Text style={styles.statLabel}>Sets</Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Content */}
// // //         <View style={styles.content}>
// // //           {/* Tickets Section */}
// // //           <View style={styles.section}>
// // //             <View style={styles.sectionHeader}>
// // //               <Text style={styles.sectionTitle}>🎟 My Tickets Collection</Text>
// // //               <View style={styles.countBadge}>
// // //                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
// // //               </View>
// // //             </View>

// // //             {myTickets.length === 0 ? (
// // //               <View style={styles.emptyState}>
// // //                 <Image
// // //                   source={{ uri: GAME_IMAGES.empty }}
// // //                   style={styles.emptyIcon}
// // //                   tintColor={ACCENT_COLOR}
// // //                 />
// // //                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
// // //                 <Text style={styles.emptySubtitle}>
// // //                   {game
// // //                     ? "You don't have any tickets for this game yet"
// // //                     : "You haven't been allocated any tickets yet"}
// // //                 </Text>
// // //                 <TouchableOpacity
// // //                   style={styles.refreshButtonLarge}
// // //                   onPress={fetchMyTickets}
// // //                 >
// // //                   <View style={styles.glassEffectOverlay} />
// // //                   <Ionicons name="refresh" size={18} color={SECONDARY_COLOR} />
// // //                   <Text style={styles.refreshButtonText}>Refresh</Text>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             ) : (
// // //               <View style={styles.ticketsList}>
// // //                 {myTickets.map((ticket) => (
// // //                   <View key={ticket.id} style={styles.ticketWrapper}>
// // //                     {renderTicketItem({ item: ticket })}
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}
// // //           </View>

// // //           {/* Bottom Info */}
// // //           <View style={styles.infoCard}>
// // //             <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
// // //             <Text style={styles.infoCardText}>
// // //               • Active tickets are eligible for game participation{'\n'}
// // //               • Each ticket has a unique number and belongs to a set{'\n'}
// // //               • Tickets are automatically allocated for approved requests
// // //             </Text>
// // //           </View>

// // //           <View style={styles.bottomSpace} />
// // //         </View>
// // //       </ScrollView>

// // //       {/* Ticket Detail Modal */}
// // //       <Modal
// // //         animationType="fade"
// // //         transparent={true}
// // //         visible={modalVisible}
// // //         onRequestClose={() => setModalVisible(false)}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.modalContainer}>
// // //             {selectedTicket && (
// // //               <>
// // //                 <View style={styles.modalHeader}>
// // //                   <View style={styles.modalTitleContainer}>
// // //                     <View style={styles.ticketNumberBadge}>
// // //                       <Ionicons name="ticket-outline" size={16} color={SECONDARY_COLOR} />
// // //                       <Text style={styles.ticketNumberBadgeText}>
// // //                         Ticket No: #{selectedTicket.ticket_number}
// // //                       </Text>
// // //                     </View>
// // //                     <View style={[
// // //                       styles.modalStatusBadge,
// // //                       { backgroundColor: selectedTicket.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
// // //                     ]}>
// // //                       <Ionicons
// // //                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
// // //                         size={12}
// // //                         color={selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
// // //                       />
// // //                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
// // //                         {selectedTicket.is_active ? "Active" : "Inactive"}
// // //                       </Text>
// // //                     </View>
// // //                   </View>
// // //                   <TouchableOpacity 
// // //                     style={styles.closeButton}
// // //                     onPress={() => setModalVisible(false)}
// // //                   >
// // //                     <Ionicons name="close" size={22} color={ACCENT_COLOR} />
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 <View style={styles.modalContent}>
// // //                   {selectedTicket.game && (
// // //                     <View style={styles.gameCard}>
// // //                       <View style={styles.gameCardHeader}>
// // //                         <Ionicons name="game-controller" size={16} color={ACCENT_COLOR} />
// // //                         <Text style={styles.gameCardTitle}>Game Details</Text>
// // //                       </View>
// // //                       <View style={styles.gameCardContent}>
// // //                         <Text style={styles.gameNameText} numberOfLines={2}>
// // //                           {selectedTicket.game.game_name}
// // //                         </Text>
// // //                         <View style={styles.gameDetailsRow}>
// // //                           <View style={styles.gameDetailItem}>
// // //                             <Feather name="hash" size={12} color={LIGHT_ACCENT} />
// // //                             <Text style={styles.gameCodeText}>
// // //                               {selectedTicket.game.game_code}
// // //                             </Text>
// // //                           </View>
// // //                           <View style={styles.gameDetailItem}>
// // //                             <Feather name="calendar" size={12} color={LIGHT_ACCENT} />
// // //                             <Text style={styles.gameTimeText}>
// // //                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
// // //                             </Text>
// // //                           </View>
// // //                         </View>
// // //                       </View>
// // //                     </View>
// // //                   )}

// // //                   <View style={styles.fullTicketContainerModal}>
// // //                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
// // //                     <View style={styles.modalTicketGrid}>
// // //                       {renderTicketGrid(selectedTicket.ticket_data, true)}
// // //                     </View>
// // //                   </View>
// // //                 </View>

// // //                 <View style={styles.modalActions}>
// // //                   <TouchableOpacity
// // //                     style={styles.closeModalButton}
// // //                     onPress={() => setModalVisible(false)}
// // //                   >
// // //                     <View style={styles.glassEffectOverlay} />
// // //                     <Text style={styles.closeModalButtonText}>Close</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </Modal>
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
// // //     paddingTop: 40,
// // //     paddingBottom: 20,
// // //     backgroundColor: SECONDARY_COLOR,
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
// // //     paddingHorizontal: 20,
// // //   },
// // //   headerTopRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 20,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: TEXT_LIGHT,
// // //     letterSpacing: -0.5,
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
// // //   refreshButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   statsContainer: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     gap: 12,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   statValue: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: ACCENT_COLOR,
// // //     marginVertical: 6,
// // //   },
// // //   statLabel: {
// // //     fontSize: 12,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "600",
// // //     textAlign: 'center',
// // //     opacity: 0.9,
// // //   },
// // //   content: {
// // //     padding: HORIZONTAL_MARGIN,
// // //     paddingTop: 20,
// // //     zIndex: 1,
// // //     marginTop: 0,
// // //   },
// // //   section: {
// // //     marginBottom: 20,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 16,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: "bold",
// // //     color: ACCENT_COLOR,
// // //   },
// // //   countBadge: {
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //     minWidth: 30,
// // //     alignItems: 'center',
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   countBadgeText: {
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //     color: SECONDARY_COLOR,
// // //   },
// // //   ticketsList: {
// // //     gap: 20,
// // //   },
// // //   ticketWrapper: {

// // //   },
// // //   ticketItemContainer: {
// // //     // No margin needed since wrapper handles it
// // //   },
// // //   ticketHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 8,
// // //     paddingHorizontal: 4,
// // //   },
// // //   ticketNo: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   statusBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 5,
// // //     borderRadius: 6,
// // //     gap: 4,
// // //   },
// // //   statusText: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //   },
// // //   // Ticket grid styles
// // //   ticket: {
// // //     backgroundColor: DARK_BLUE,
// // //     padding: TICKET_PADDING,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     borderRadius: 12,
// // //     overflow: "hidden",
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 6,
// // //     elevation: 8,
// // //   },
// // //   row: {
// // //     flexDirection: "row",
// // //   },
// // //   cell: {
// // //     borderWidth: 1,
// // //     borderColor: ACCENT_COLOR,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderRadius: 2,
// // //   },
// // //   number: {
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //     color: DARK_BLUE,
// // //   },
// // //   emptyState: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 16,
// // //     padding: 32,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //     marginTop: 20,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   emptyIcon: {
// // //     width: 80,
// // //     height: 80,
// // //     marginBottom: 20,
// // //     opacity: 0.7,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   emptySubtitle: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     textAlign: "center",
// // //     lineHeight: 20,
// // //     marginBottom: 24,
// // //     paddingHorizontal: 20,
// // //     opacity: 0.9,
// // //   },
// // //   refreshButtonLarge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     gap: 8,
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 6,
// // //     elevation: 6,
// // //   },
// // //   glassEffectOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(255, 255, 255, 0.2)',
// // //     borderTopWidth: 1,
// // //     borderTopColor: 'rgba(255, 255, 255, 0.4)',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(0, 0, 0, 0.2)',
// // //     borderRadius: 10,
// // //   },
// // //   refreshButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // //   infoCard: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 12,
// // //     padding: 18,
// // //     marginBottom: 20,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //     gap: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //   },
// // //   infoCardText: {
// // //     flex: 1,
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     lineHeight: 20,
// // //     opacity: 0.9,
// // //   },
// // //   bottomSpace: {
// // //     height: 20,
// // //   },
// // //   // Modal Styles
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: "rgba(0,0,0,0.85)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingHorizontal: 20,
// // //   },
// // //   modalContainer: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 20,
// // //     padding: 0,
// // //     width: "100%",
// // //     maxWidth: 400,
// // //     maxHeight: "85%",
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: 0.5,
// // //     shadowRadius: 20,
// // //     elevation: 10,
// // //     overflow: 'hidden',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     padding: 20,
// // //     paddingBottom: 16,
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   modalTitleContainer: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //     flexWrap: 'wrap',
// // //   },
// // //   ticketNumberBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(255, 213, 79, 0.15)",
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     gap: 8,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.3)',
// // //   },
// // //   ticketNumberBadgeText: {
// // //     fontSize: 14,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //   },
// // //   modalStatusBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //     borderRadius: 6,
// // //     gap: 4,
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 213, 79, 0.2)',
// // //   },
// // //   modalStatusText: {
// // //     fontSize: 12,
// // //     fontWeight: "600",
// // //   },
// // //   closeButton: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   modalContent: {
// // //     padding: 20,
// // //   },
// // //   gameCard: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 20,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   gameCardHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     marginBottom: 12,
// // //   },
// // //   gameCardTitle: {
// // //     fontSize: 15,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //   },
// // //   gameCardContent: {
// // //     gap: 8,
// // //   },
// // //   gameNameText: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 20,
// // //   },
// // //   gameDetailsRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 16,
// // //     flexWrap: 'wrap',
// // //   },
// // //   gameDetailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //   },
// // //   gameCodeText: {
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   gameTimeText: {
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     fontWeight: "500",
// // //     opacity: 0.9,
// // //   },
// // //   fullTicketContainerModal: {
// // //     marginBottom: 20,
// // //   },
// // //   ticketGridTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: ACCENT_COLOR,
// // //     marginBottom: 12,
// // //     textAlign: 'center',
// // //   },
// // //   modalTicketGrid: {
// // //     marginBottom: 16,
// // //   },
// // //   modalActions: {
// // //     padding: 20,
// // //     paddingTop: 0,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   closeModalButton: {
// // //     backgroundColor: ACCENT_COLOR,
// // //     paddingHorizontal: 30,
// // //     paddingVertical: 14,
// // //     borderRadius: 10,
// // //     width: "100%",
// // //     alignItems: "center",
// // //     overflow: 'hidden',
// // //     position: 'relative',
// // //     borderWidth: 1,
// // //     borderColor: 'rgba(255, 255, 255, 0.3)',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 6 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 8,
// // //   },
// // //   closeModalButtonText: {
// // //     color: SECONDARY_COLOR,
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     textShadowColor: 'rgba(0, 0, 0, 0.3)',
// // //     textShadowOffset: { width: 1, height: 1 },
// // //     textShadowRadius: 2,
// // //   },
// // // });

// // // export default TicketsScreen;











// // import React, { useEffect, useState, useRef } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   Image,
// //   ActivityIndicator,
// //   Alert,
// //   RefreshControl,
// //   Dimensions,
// //   Modal,
// //   StatusBar,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";

// // // For React Native CLI, use react-native-vector-icons
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// // import Feather from "react-native-vector-icons/Feather";

// // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // EXACT SAME parameters from your example
// // const NUM_COLUMNS = 9;
// // const CELL_MARGIN = 2;
// // const TICKET_PADDING = 8;
// // const HORIZONTAL_MARGIN = 10;

// // // EXACT SAME calculation from your example
// // const CELL_WIDTH = 
// //   (SCREEN_WIDTH - 
// //    HORIZONTAL_MARGIN * 2 - 
// //    TICKET_PADDING * 2 - 
// //    CELL_MARGIN * 2 * NUM_COLUMNS) / 
// //   NUM_COLUMNS;

// // // Updated colors to match Home component
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

// // // Row colors for ticket grid
// // const ROW_COLOR_1 = "#f0f8ff"; // Very light blue for even rows
// // const ROW_COLOR_2 = "#e6f3ff"; // Slightly darker light blue for odd rows
// // const FILLED_CELL_BG = ACCENT_COLOR; // Orange for filled cells
// // const CELL_BORDER_COLOR = PRIMARY_COLOR; // Blue border
// // const NUMBER_COLOR = WHITE; // White numbers on orange background

// // const TicketsScreen = ({ route, navigation }) => {
// //   const { game } = route.params || {};
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [myTickets, setMyTickets] = useState([]);
// //   const [selectedTicket, setSelectedTicket] = useState(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [stats, setStats] = useState({
// //     total: 0,
// //     active: 0,
// //     sets: 0,
// //   });

// //   const GAME_IMAGES = {
// //     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
// //     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
// //     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
// //     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
// //     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
// //     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
// //     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
// //     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
// //   };

// //   useEffect(() => {
// //     fetchMyTickets();
// //   }, []);

// //   const onRefresh = React.useCallback(() => {
// //     console.log("Refreshing tickets...");
// //     setRefreshing(true);
// //     fetchMyTickets().finally(() => {
// //       setRefreshing(false);
// //       console.log("Refresh complete");
// //     });
// //   }, []);

// //   const fetchMyTickets = async () => {
// //     console.log("fetchMyTickets called");
// //     try {
// //       setLoading(true);
// //       const token = await AsyncStorage.getItem("token");
// //       console.log("Token found:", token ? "Yes" : "No");
      
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/my-tickets",
// //         { 
// //           headers: { 
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json'
// //           } 
// //         }
// //       );

// //       console.log("Tickets API Response:", res.data);
      
// //       if (res.data.success) {
// //         // Filter tickets for the current game if game prop exists
// //         const tickets = game
// //           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
// //           : res.data.tickets.data;
        
// //         console.log("Filtered tickets:", tickets.length);
// //         setMyTickets(tickets);
        
// //         // Calculate stats (keeping for potential future use)
// //         const activeCount = tickets.filter(t => t.is_active).length;
// //         const setsCount = getTicketSetCount(tickets);
        
// //         setStats({
// //           total: tickets.length,
// //           active: activeCount,
// //           sets: setsCount,
// //         });
// //       }
// //     } catch (error) {
// //       console.log("Error fetching tickets:", error);
// //       console.log("Error response:", error.response?.data);
// //       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Helper function to convert ticket_data to the format needed for rendering
// //   const processTicketData = (ticketData) => {
// //     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
// //     // Check if the data is in the new format (array of objects)
// //     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
// //       // New format: array of objects with number property
// //       const processedGrid = Array(3).fill().map(() => Array(9).fill(null));
      
// //       ticketData.forEach((row) => {
// //         row.forEach((cell) => {
// //           if (cell && cell.number !== null && cell.row !== undefined && cell.column !== undefined) {
// //             processedGrid[cell.row][cell.column] = cell.number;
// //           }
// //         });
// //       });
      
// //       return processedGrid;
// //     } else if (ticketData[0] && Array.isArray(ticketData[0])) {
// //       // Old format: simple 2D array
// //       return ticketData.map(row => row.map(cell => cell));
// //     }
    
// //     return Array(3).fill(Array(9).fill(null));
// //   };

// //   const renderTicketGrid = (ticketData, isModal = false) => {
// //     const processedData = processTicketData(ticketData);
    
// //     return (
// //       <View style={[
// //         styles.ticket,
// //         { 
// //           width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
// //           backgroundColor: WHITE,
// //           borderColor: PRIMARY_COLOR,
// //         }
// //       ]}>
// //         {/* Ticket rows without column headers */}
// //         {processedData.map((row, rowIndex) => (
// //           <View 
// //             key={`row-${rowIndex}`} 
// //             style={[
// //               styles.row,
// //               { 
// //                 backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
// //               }
// //             ]}
// //           >
// //             {row.map((cell, colIndex) => {
// //               const isEmpty = cell === null;
              
// //               return (
// //                 <View
// //                   key={`cell-${rowIndex}-${colIndex}`}
// //                   style={[
// //                     styles.cell,
// //                     { 
// //                       width: CELL_WIDTH,
// //                       height: CELL_WIDTH,
// //                       margin: CELL_MARGIN,
// //                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
// //                       borderColor: PRIMARY_COLOR,
// //                     },
// //                   ]}
// //                 >
// //                   {!isEmpty && (
// //                     <Text style={styles.number}>
// //                       {cell}
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

// //   const renderTicketItem = ({ item }) => (
// //     <View style={styles.ticketItemContainer}>
// //       {/* Ticket number and status outside the card */}
// //       <View style={styles.ticketHeader}>
// //         <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
// //         <View style={[
// //           styles.statusBadge,
// //           { backgroundColor: item.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
// //         ]}>
// //           <Ionicons
// //             name={item.is_active ? "checkmark-circle" : "close-circle"}
// //             size={12}
// //             color={item.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
// //           />
// //           <Text style={[styles.statusText, { color: item.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
// //             {item.is_active ? "Active" : "Inactive"}
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Ticket Card with grid */}
// //       <TouchableOpacity
// //         onPress={() => {
// //           setSelectedTicket(item);
// //           setModalVisible(true);
// //         }}
// //         activeOpacity={0.9}
// //       >
// //         {/* Ticket grid directly on the white card */}
// //         {renderTicketGrid(item.ticket_data)}
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Calculate ticket set count
// //   const getTicketSetCount = (tickets) => {
// //     const sets = new Set(tickets.map(t => t.ticket_set_id));
// //     return sets.size;
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
// //           <Text style={styles.loadingText}>Loading your tickets...</Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

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
// //         {/* Header with blue background */}
// //         <View style={styles.header}>
// //           <View style={styles.headerContent}>
// //             <View style={styles.headerTopRow}>
// //               <TouchableOpacity
// //                 style={styles.backButton}
// //                 onPress={() => navigation.goBack()}
// //               >
// //                 <Ionicons name="arrow-back" size={24} color={WHITE} />
// //               </TouchableOpacity>

// //               <View style={styles.headerTextContainer}>
// //                 <Text style={styles.headerTitle}>My Tickets</Text>
// //                 {game && (
// //                   <View style={styles.gameInfoContainer}>
// //                     <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
// //                     <Text style={styles.gameName} numberOfLines={1}>
// //                       {game.game_name || "Game"}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>

              
// //             </View>

// //             {/* Stats Cards */}
// //             <View style={styles.statsContainer}>
// //               <View style={styles.statCard}>
// //                 <Ionicons name="ticket-outline" size={20} color={PRIMARY_COLOR} />
// //                 <Text style={styles.statValue}>{myTickets.length}</Text>
// //                 <Text style={styles.statLabel}>Total Tickets</Text>
// //               </View>
              
// //               <View style={styles.statCard}>
// //                 <Ionicons name="checkmark-circle-outline" size={20} color={PRIMARY_COLOR} />
// //                 <Text style={styles.statValue}>
// //                   {myTickets.filter(t => t.is_active).length}
// //                 </Text>
// //                 <Text style={styles.statLabel}>Active</Text>
// //               </View>
              
// //               <View style={styles.statCard}>
// //                 <Ionicons name="grid-outline" size={20} color={PRIMARY_COLOR} />
// //                 <Text style={styles.statValue}>
// //                   {getTicketSetCount(myTickets)}
// //                 </Text>
// //                 <Text style={styles.statLabel}>Sets</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Content */}
// //         <View style={styles.content}>
// //           {/* Tickets Section */}
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>My Tickets Collection</Text>
// //               <View style={styles.countBadge}>
// //                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
// //               </View>
// //             </View>

// //             {myTickets.length === 0 ? (
// //               <View style={styles.emptyState}>
// //                 <Image
// //                   source={{ uri: GAME_IMAGES.empty }}
// //                   style={styles.emptyIcon}
// //                   tintColor={PRIMARY_COLOR}
// //                 />
// //                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
// //                 <Text style={styles.emptySubtitle}>
// //                   {game
// //                     ? "You don't have any tickets for this game yet"
// //                     : "You haven't been allocated any tickets yet"}
// //                 </Text>
               
// //               </View>
// //             ) : (
// //               <View style={styles.ticketsList}>
// //                 {myTickets.map((ticket) => (
// //                   <View key={ticket.id} style={styles.ticketWrapper}>
// //                     {renderTicketItem({ item: ticket })}
// //                   </View>
// //                 ))}
// //               </View>
// //             )}
// //           </View>

// //           {/* Bottom Info */}
// //           <View style={styles.infoCard}>
// //             <Ionicons name="information-circle" size={18} color={PRIMARY_COLOR} />
// //             <Text style={styles.infoCardText}>
// //               • Active tickets are eligible for game participation{'\n'}
// //               • Each ticket has a unique number and belongs to a set{'\n'}
// //               • Tickets are automatically allocated for approved requests
// //             </Text>
// //           </View>

// //           <View style={styles.bottomSpace} />
// //         </View>
// //       </ScrollView>

// //       {/* Ticket Detail Modal */}
// //       <Modal
// //         animationType="fade"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             {selectedTicket && (
// //               <>
// //                 <View style={styles.modalHeader}>
// //                   <View style={styles.modalTitleContainer}>
// //                     <View style={styles.ticketNumberBadge}>
// //                       <Ionicons name="ticket-outline" size={16} color={PRIMARY_COLOR} />
// //                       <Text style={styles.ticketNumberBadgeText}>
// //                         Ticket No: #{selectedTicket.ticket_number}
// //                       </Text>
// //                     </View>
// //                     <View style={[
// //                       styles.modalStatusBadge,
// //                       { backgroundColor: selectedTicket.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
// //                     ]}>
// //                       <Ionicons
// //                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
// //                         size={12}
// //                         color={selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
// //                       />
// //                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
// //                         {selectedTicket.is_active ? "Active" : "Inactive"}
// //                       </Text>
// //                     </View>
// //                   </View>
// //                   <TouchableOpacity 
// //                     style={styles.closeButton}
// //                     onPress={() => setModalVisible(false)}
// //                   >
// //                     <Ionicons name="close" size={22} color={PRIMARY_COLOR} />
// //                   </TouchableOpacity>
// //                 </View>

// //                 <View style={styles.modalContent}>
// //                   {selectedTicket.game && (
// //                     <View style={styles.gameCard}>
// //                       <View style={styles.gameCardHeader}>
// //                         <Ionicons name="game-controller" size={16} color={PRIMARY_COLOR} />
// //                         <Text style={styles.gameCardTitle}>Game Details</Text>
// //                       </View>
// //                       <View style={styles.gameCardContent}>
// //                         <Text style={styles.gameNameText} numberOfLines={2}>
// //                           {selectedTicket.game.game_name}
// //                         </Text>
// //                         <View style={styles.gameDetailsRow}>
// //                           <View style={styles.gameDetailItem}>
// //                             <Feather name="hash" size={12} color={TEXT_LIGHT} />
// //                             <Text style={styles.gameCodeText}>
// //                               {selectedTicket.game.game_code}
// //                             </Text>
// //                           </View>
// //                           <View style={styles.gameDetailItem}>
// //                             <Feather name="calendar" size={12} color={TEXT_LIGHT} />
// //                             <Text style={styles.gameTimeText}>
// //                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
// //                             </Text>
// //                           </View>
// //                         </View>
// //                       </View>
// //                     </View>
// //                   )}

// //                   <View style={styles.fullTicketContainerModal}>
// //                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
// //                     <View style={styles.modalTicketGrid}>
// //                       {renderTicketGrid(selectedTicket.ticket_data, true)}
// //                     </View>
// //                   </View>
// //                 </View>

// //                 <View style={styles.modalActions}>
// //                   <TouchableOpacity
// //                     style={styles.closeModalButton}
// //                     onPress={() => setModalVisible(false)}
// //                   >
// //                     <View style={styles.glassEffectOverlay} />
// //                     <Text style={styles.closeModalButtonText}>Close</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Modal>
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
// //     paddingTop: 20,
// //     paddingBottom: 20,
// //     backgroundColor: PRIMARY_COLOR,
// //     borderBottomLeftRadius: 25,
// //     borderBottomRightRadius: 25,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   headerContent: {
// //     paddingHorizontal: 20,
// //   },
// //   headerTopRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   headerTitle: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: WHITE,
// //     letterSpacing: -0.5,
// //     marginBottom: 4,
// //   },
// //   gameInfoContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //   },
// //   gameName: {
// //     fontSize: 14,
// //     color: "rgba(255,255,255,0.7)",
// //     fontWeight: "500",
// //   },
// //   refreshButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   statsContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     gap: 12,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 16,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   statValue: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: TEXT_DARK,
// //     marginVertical: 6,
// //   },
// //   statLabel: {
// //     fontSize: 12,
// //     color: TEXT_LIGHT,
// //     fontWeight: "600",
// //     textAlign: 'center',
// //   },
// //   content: {
// //     padding: HORIZONTAL_MARGIN,
// //     paddingTop: 20,
// //     zIndex: 1,
// //     marginTop: 0,
// //   },
// //   section: {
// //     marginBottom: 20,
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     color: TEXT_DARK,
// //   },
// //   countBadge: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     minWidth: 30,
// //     alignItems: 'center',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   countBadgeText: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: WHITE,
// //   },
// //   ticketsList: {
// //     gap: 20,
// //   },
// //   ticketWrapper: {

// //   },
// //   ticketItemContainer: {
// //     // No margin needed since wrapper handles it
// //   },
// //   ticketHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 8,
// //     paddingHorizontal: 4,
// //   },
// //   ticketNo: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //   },
// //   statusBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 6,
// //     gap: 4,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   statusText: {
// //     fontSize: 11,
// //     fontWeight: "700",
// //   },
// //   // Ticket grid styles
// //   ticket: {
// //     backgroundColor: WHITE,
// //     padding: TICKET_PADDING,
// //     borderWidth: 2,
// //     borderColor: PRIMARY_COLOR,
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   row: {
// //     flexDirection: "row",
// //   },
// //   cell: {
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderRadius: 4,
// //   },
// //   number: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: WHITE,
// //   },
// //   emptyState: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     marginTop: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   emptyIcon: {
// //     width: 80,
// //     height: 80,
// //     marginBottom: 20,
// //     opacity: 0.7,
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: "800",
// //     color: TEXT_DARK,
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   emptySubtitle: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     textAlign: "center",
// //     lineHeight: 20,
// //     marginBottom: 24,
// //     paddingHorizontal: 20,
// //   },
// //   refreshButtonLarge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     gap: 8,
// //     overflow: 'hidden',
// //     position: 'relative',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   glassEffectOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
// //     borderTopWidth: 1,
// //     borderTopColor: 'rgba(255, 255, 255, 0.3)',
// //     borderBottomWidth: 1,
// //     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
// //     borderRadius: 10,
// //   },
// //   refreshButtonText: {
// //     color: WHITE,
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },
// //   infoCard: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     backgroundColor: WHITE,
// //     borderRadius: 12,
// //     padding: 18,
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     gap: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 2,
// //   },
// //   infoCardText: {
// //     flex: 1,
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     lineHeight: 20,
// //   },
// //   bottomSpace: {
// //     height: 20,
// //   },
// //   // Modal Styles
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   modalContainer: {
// //     backgroundColor: WHITE,
// //     borderRadius: 20,
// //     padding: 0,
// //     width: "100%",
// //     maxWidth: 400,
// //     maxHeight: "85%",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     overflow: 'hidden',
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: 20,
// //     paddingBottom: 16,
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderBottomWidth: 1,
// //     borderBottomColor: BORDER_COLOR,
// //   },
// //   modalTitleContainer: {
// //     flex: 1,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //     flexWrap: 'wrap',
// //   },
// //   ticketNumberBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     gap: 8,
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   ticketNumberBadgeText: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   modalStatusBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 6,
// //     gap: 4,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   modalStatusText: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //   },
// //   closeButton: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     backgroundColor: "rgba(79, 172, 254, 0.1)",
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: PRIMARY_COLOR,
// //   },
// //   modalContent: {
// //     padding: 20,
// //   },
// //   gameCard: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   gameCardHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 12,
// //   },
// //   gameCardTitle: {
// //     fontSize: 15,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //   },
// //   gameCardContent: {
// //     gap: 8,
// //   },
// //   gameNameText: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //     lineHeight: 20,
// //   },
// //   gameDetailsRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 16,
// //     flexWrap: 'wrap',
// //   },
// //   gameDetailItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //   },
// //   gameCodeText: {
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   gameTimeText: {
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     fontWeight: "500",
// //   },
// //   fullTicketContainerModal: {
// //     marginBottom: 20,
// //   },
// //   ticketGridTitle: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginBottom: 12,
// //     textAlign: 'center',
// //   },
// //   modalTicketGrid: {
// //     marginBottom: 16,
// //   },
// //   modalActions: {
// //     padding: 20,
// //     paddingTop: 0,
// //     borderTopWidth: 1,
// //     borderTopColor: BORDER_COLOR,
// //   },
// //   closeModalButton: {
// //     backgroundColor: PRIMARY_COLOR,
// //     paddingHorizontal: 30,
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     width: "100%",
// //     alignItems: "center",
// //     overflow: 'hidden',
// //     position: 'relative',
// //     borderWidth: 1,
// //     borderColor: 'rgba(255, 255, 255, 0.3)',
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   closeModalButtonText: {
// //     color: WHITE,
// //     fontSize: 15,
// //     fontWeight: "600",
// //   },
// // });

// // export default TicketsScreen;








// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Dimensions,
//   Modal,
//   StatusBar,
//   Animated,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // EXACT SAME parameters from your example
// const NUM_COLUMNS = 9;
// const CELL_MARGIN = 2;
// const TICKET_PADDING = 8;
// const HORIZONTAL_MARGIN = 10;

// // EXACT SAME calculation from your example
// const CELL_WIDTH = 
//   (SCREEN_WIDTH - 
//    HORIZONTAL_MARGIN * 2 - 
//    TICKET_PADDING * 2 - 
//    CELL_MARGIN * 2 * (NUM_COLUMNS) - 
//    8) /  // Added 8px extra buffer
//   NUM_COLUMNS;

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

// // Row colors for ticket grid
// const ROW_COLOR_1 = '#F0F7FF'; // Very light blue for even rows
// const ROW_COLOR_2 = '#E6F0FF'; // Slightly darker light blue for odd rows
// const FILLED_CELL_BG = COLORS.primary; // Blue for filled cells
// const CELL_BORDER_COLOR = COLORS.primary; // Blue border
// const NUMBER_COLOR = '#FFFFFF'; // White numbers on blue background

// const TicketsScreen = ({ route, navigation }) => {
//   const { game } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [myTickets, setMyTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     sets: 0,
//   });

//   // Animation values
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const GAME_IMAGES = {
//     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
//     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
//     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
//     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
//     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
//     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
//   };

//   useEffect(() => {
//     fetchMyTickets();
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
//             <Text style={styles.headerTitle}>My Tickets</Text>
//             {game && (
//               <View style={styles.gameInfoContainer}>
//                 <Ionicons name="game-controller" size={14} color={COLORS.textLight} />
//                 <Text style={styles.gameName} numberOfLines={1}>
//                   {game.game_name || "Game"}
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.headerBadge}>
//             <MaterialIcons name="confirmation-number" size={18} color={COLORS.primary} />
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const onRefresh = React.useCallback(() => {
//     console.log("Refreshing tickets...");
//     setRefreshing(true);
//     fetchMyTickets().finally(() => {
//       setRefreshing(false);
//       console.log("Refresh complete");
//     });
//   }, []);

//   const fetchMyTickets = async () => {
//     console.log("fetchMyTickets called");
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token found:", token ? "Yes" : "No");
      
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );

//       console.log("Tickets API Response:", res.data);
      
//       if (res.data.success) {
//         // Filter tickets for the current game if game prop exists
//         const tickets = game
//           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
//           : res.data.tickets.data;
        
//         console.log("Filtered tickets:", tickets.length);
//         setMyTickets(tickets);
        
//         // Calculate stats
//         const activeCount = tickets.filter(t => t.is_active).length;
//         const setsCount = getTicketSetCount(tickets);
        
//         setStats({
//           total: tickets.length,
//           active: activeCount,
//           sets: setsCount,
//         });
//       }
//     } catch (error) {
//       console.log("Error fetching tickets:", error);
//       console.log("Error response:", error.response?.data);
//       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to convert ticket_data to the format needed for rendering
//   const processTicketData = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
//     // Check if the data is in the new format (array of objects)
//     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
//       // New format: array of objects with number property
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
//       // Old format: simple 2D array
//       return ticketData.map(row => row.map(cell => cell));
//     }
    
//     return Array(3).fill(Array(9).fill(null));
//   };

//   const renderTicketGrid = (ticketData, isModal = false) => {
//   const processedData = processTicketData(ticketData);
  
//   // Recalculate cell width for modal to ensure it fits
//   const modalCellWidth = isModal 
//     ? (SCREEN_WIDTH - 80 - TICKET_PADDING * 2 - CELL_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS
//     : CELL_WIDTH;
  
//   return (
//     <View style={[
//       styles.ticket,
//       { 
//         width: isModal ? SCREEN_WIDTH - 56 : SCREEN_WIDTH - 32,
//         padding: TICKET_PADDING,
//       }
//     ]}>
//       {/* Ticket rows without column headers */}
//       {processedData.map((row, rowIndex) => (
//         <View 
//           key={`row-${rowIndex}`} 
//           style={[
//             styles.row,
//             { 
//               backgroundColor: rowIndex % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2,
//             }
//           ]}
//         >
//           {row.map((cell, colIndex) => {
//             const isEmpty = cell === null;
            
//             return (
//               <View
//                 key={`cell-${rowIndex}-${colIndex}`}
//                 style={[
//                   styles.cell,
//                   { 
//                     width: modalCellWidth,
//                     height: modalCellWidth,
//                     margin: CELL_MARGIN,
//                     backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
//                     borderColor: COLORS.primary,
//                   },
//                 ]}
//               >
//                 {!isEmpty && (
//                   <Text style={[styles.number, { fontSize: modalCellWidth > 25 ? 14 : 12 }]}>
//                     {cell}
//                   </Text>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       ))}
//     </View>
//   );
// };

//   const renderTicketItem = ({ item }) => (
//     <View style={styles.ticketItemContainer}>
//       {/* Ticket number and status */}
//       <View style={styles.ticketHeader}>
//         <View style={styles.ticketNoContainer}>
//           <MaterialIcons name="confirmation-number" size={14} color={COLORS.primary} />
//           <Text style={styles.ticketNo}>Ticket #{item.ticket_number}</Text>
//         </View>
        
//         <View style={[
//           styles.statusBadge,
//           { backgroundColor: item.is_active ? COLORS.greenLight : COLORS.redLight }
//         ]}>
//           <Ionicons
//             name={item.is_active ? "checkmark-circle" : "close-circle"}
//             size={12}
//             color={item.is_active ? COLORS.green : COLORS.red}
//           />
//           <Text style={[styles.statusText, { color: item.is_active ? COLORS.green : COLORS.red }]}>
//             {item.is_active ? "Active" : "Inactive"}
//           </Text>
//         </View>
//       </View>

//       {/* Ticket Card with grid */}
//       <TouchableOpacity
//         onPress={() => {
//           setSelectedTicket(item);
//           setModalVisible(true);
//         }}
//         activeOpacity={0.9}
//         style={styles.ticketCard}
//       >
//         <CardBackground accentColor={COLORS.primary} />
//         {/* Ticket grid */}
//         {renderTicketGrid(item.ticket_data)}
//       </TouchableOpacity>
//     </View>
//   );

//   // Calculate ticket set count
//   const getTicketSetCount = (tickets) => {
//     const sets = new Set(tickets.map(t => t.ticket_set_id));
//     return sets.size;
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
//           <Text style={styles.loadingText}>Loading your tickets...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

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

//         {/* Stats Cards */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <CardBackground accentColor={COLORS.primary} />
//             <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//               <Ionicons name="ticket-outline" size={18} color={COLORS.primary} />
//             </View>
//             <Text style={styles.statValue}>{myTickets.length}</Text>
//             <Text style={styles.statLabel}>Total Tickets</Text>
//           </View>
          
//           <View style={styles.statCard}>
//             <CardBackground accentColor={COLORS.green} />
//             <View style={[styles.statIcon, { backgroundColor: `${COLORS.green}15` }]}>
//               <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.green} />
//             </View>
//             <Text style={styles.statValue}>
//               {myTickets.filter(t => t.is_active).length}
//             </Text>
//             <Text style={styles.statLabel}>Active</Text>
//           </View>
          
//           <View style={styles.statCard}>
//             <CardBackground accentColor={COLORS.purple} />
//             <View style={[styles.statIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//               <Ionicons name="grid-outline" size={18} color={COLORS.purple} />
//             </View>
//             <Text style={styles.statValue}>
//               {getTicketSetCount(myTickets)}
//             </Text>
//             <Text style={styles.statLabel}>Sets</Text>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Tickets Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                 <Ionicons name="ticket" size={18} color={COLORS.primary} />
//               </View>
//               <Text style={styles.sectionTitle}>My Tickets Collection</Text>
//               <View style={[styles.countBadge, { backgroundColor: COLORS.primary }]}>
//                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
//               </View>
//             </View>

//             {myTickets.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <CardBackground accentColor={COLORS.primary} />
//                 <Image
//                   source={{ uri: GAME_IMAGES.empty }}
//                   style={styles.emptyIcon}
//                 />
//                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   {game
//                     ? "You don't have any tickets for this game yet"
//                     : "You haven't been allocated any tickets yet"}
//                 </Text>
//                 <TouchableOpacity
//                   style={[styles.refreshButtonLarge, { backgroundColor: COLORS.primary }]}
//                   onPress={onRefresh}
//                 >
//                   <Ionicons name="refresh" size={18} color="#FFFFFF" />
//                   <Text style={styles.refreshButtonText}>Refresh</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.ticketsList}>
//                 {myTickets.map((ticket) => (
//                   <View key={ticket.id} style={styles.ticketWrapper}>
//                     {renderTicketItem({ item: ticket })}
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Bottom Info */}
//           <View style={styles.infoCard}>
//             <CardBackground accentColor={COLORS.teal} />
//             <View style={[styles.infoIcon, { backgroundColor: `${COLORS.teal}15` }]}>
//               <Ionicons name="information-circle" size={18} color={COLORS.teal} />
//             </View>
//             <View style={styles.infoContent}>
//               <Text style={styles.infoTitle}>Ticket Information</Text>
//               <Text style={styles.infoCardText}>
//                 • Active tickets are eligible for game participation{'\n'}
//                 • Each ticket has a unique number and belongs to a set{'\n'}
//                 • Tickets are automatically allocated for approved requests
//               </Text>
//             </View>
//           </View>

//           <View style={styles.bottomSpace} />
//         </View>
//       </Animated.ScrollView>

//       {/* Ticket Detail Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <CardBackground accentColor={COLORS.primary} />
            
//             {selectedTicket && (
//               <>
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalTitleContainer}>
//                     <View style={[styles.ticketNumberBadge, { backgroundColor: `${COLORS.primary}15` }]}>
//                       <Ionicons name="ticket-outline" size={14} color={COLORS.primary} />
//                       <Text style={styles.ticketNumberBadgeText}>
//                         Ticket #{selectedTicket.ticket_number}
//                       </Text>
//                     </View>
//                     <View style={[
//                       styles.modalStatusBadge,
//                       { backgroundColor: selectedTicket.is_active ? COLORS.greenLight : COLORS.redLight }
//                     ]}>
//                       <Ionicons
//                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
//                         size={12}
//                         color={selectedTicket.is_active ? COLORS.green : COLORS.red}
//                       />
//                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? COLORS.green : COLORS.red }]}>
//                         {selectedTicket.is_active ? "Active" : "Inactive"}
//                       </Text>
//                     </View>
//                   </View>
//                   <TouchableOpacity 
//                     style={[styles.closeButton, { backgroundColor: `${COLORS.primary}15` }]}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Ionicons name="close" size={20} color={COLORS.primary} />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalContent}>
//                   {selectedTicket.game && (
//                     <View style={styles.gameCard}>
//                       <CardBackground accentColor={COLORS.purple} />
//                       <View style={styles.gameCardHeader}>
//                         <View style={[styles.gameCardIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                           <Ionicons name="game-controller" size={14} color={COLORS.purple} />
//                         </View>
//                         <Text style={styles.gameCardTitle}>Game Details</Text>
//                       </View>
//                       <View style={styles.gameCardContent}>
//                         <Text style={styles.gameNameText} numberOfLines={2}>
//                           {selectedTicket.game.game_name}
//                         </Text>
//                         <View style={styles.gameDetailsRow}>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="hash" size={11} color={COLORS.textLight} />
//                             <Text style={styles.gameCodeText}>
//                               {selectedTicket.game.game_code}
//                             </Text>
//                           </View>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="calendar" size={11} color={COLORS.textLight} />
//                             <Text style={styles.gameTimeText}>
//                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                   )}

//                   <View style={styles.fullTicketContainerModal}>
//                     <View style={styles.ticketGridHeader}>
//                       <View style={[styles.ticketGridIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                         <MaterialIcons name="grid-on" size={14} color={COLORS.primary} />
//                       </View>
//                       <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
//                     </View>
//                     <View style={styles.modalTicketGrid}>
//                       {renderTicketGrid(selectedTicket.ticket_data, true)}
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.modalActions}>
//                   <TouchableOpacity
//                     style={[styles.closeModalButton, { backgroundColor: COLORS.primary }]}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Ionicons name="close" size={16} color="#FFFFFF" />
//                     <Text style={styles.closeModalButtonText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
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
//     borderRadius: 16,
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
//   headerBadge: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
  
//   /* Stats Cards */
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginBottom: 20,
//     gap: 8,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 12,
//     alignItems: 'center',
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statIcon: {
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
//     marginVertical: 2,
//     zIndex: 2,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: COLORS.textLight,
//     fontWeight: "500",
//     textAlign: 'center',
//     zIndex: 2,
//   },
  
//   /* Content */
//   content: {
//     paddingHorizontal: 16,
//   },
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
  
//   /* Ticket List */
//   ticketsList: {
//     gap: 20,
//   },
//   ticketWrapper: {
//     marginBottom: 4,
//   },
//   ticketItemContainer: {
//     // No margin needed since wrapper handles it
//   },
//   ticketHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   ticketNoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   ticketNo: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     gap: 4,
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: "600",
//   },
//  // Update these styles in the StyleSheet

// ticketCard: {
//   position: 'relative',
//   overflow: 'hidden',
//   borderRadius: 16,
//   backgroundColor: COLORS.surface,
//   borderWidth: 1,
//   borderColor: COLORS.border,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.1,
//   shadowRadius: 8,
//   elevation: 4,
//   width: '100%', // Ensure full width
//   alignSelf: 'center', // Center the card
// },

// ticket: {
//   borderRadius: 12,
//   zIndex: 2,
//   alignSelf: 'center', // Center the ticket
// },

// row: {
//   flexDirection: "row",
//   justifyContent: 'center', // Center the row content
// },

// cell: {
//   borderWidth: 1,
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: 4,
// },
//   number: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: '#FFFFFF',
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
//     marginTop: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   emptyIcon: {
//     width: 70,
//     height: 70,
//     marginBottom: 16,
//     opacity: 0.7,
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
//     paddingHorizontal: 20,
//     zIndex: 2,
//   },
//   refreshButtonLarge: {
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
//   refreshButtonText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },
  
//   /* Info Card */
//   infoCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     gap: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   infoIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 2,
//   },
//   infoContent: {
//     flex: 1,
//     zIndex: 2,
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 6,
//   },
//   infoCardText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     lineHeight: 18,
//   },
//   bottomSpace: {
//     height: 20,
//   },
  
//   /* Modal Styles */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   modalContainer: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     width: "100%",
//     maxWidth: 400,
//     maxHeight: "85%",
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     zIndex: 2,
//   },
//   modalTitleContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     flexWrap: 'wrap',
//   },
//   ticketNumberBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 6,
//   },
//   ticketNumberBadgeText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   modalStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     gap: 4,
//   },
//   modalStatusText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   closeButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     padding: 16,
//   },
//   gameCard: {
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   gameCardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 8,
//     zIndex: 2,
//   },
//   gameCardIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   gameCardTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   gameCardContent: {
//     gap: 6,
//     zIndex: 2,
//   },
//   gameNameText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//     lineHeight: 18,
//   },
//   gameDetailsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     flexWrap: 'wrap',
//   },
//   gameDetailItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   gameCodeText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   gameTimeText: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   fullTicketContainerModal: {
//     marginBottom: 16,
//   },
//   ticketGridHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     gap: 6,
//   },
//   ticketGridIcon: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ticketGridTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   modalTicketGrid: {
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   modalActions: {
//     padding: 16,
//     paddingTop: 0,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     zIndex: 2,
//   },
//   closeModalButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   closeModalButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

// export default TicketsScreen;



// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Dimensions,
//   Modal,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // EXACT SAME parameters from your example
// const NUM_COLUMNS = 9;
// const CELL_MARGIN = 2;
// const TICKET_PADDING = 8;
// const HORIZONTAL_MARGIN = 10;

// // EXACT SAME calculation from your example
// const CELL_WIDTH = 
//   (SCREEN_WIDTH - 
//    HORIZONTAL_MARGIN * 2 - 
//    TICKET_PADDING * 2 - 
//    CELL_MARGIN * 2 * NUM_COLUMNS) / 
//   NUM_COLUMNS;

// // Updated colors to match new blue/gold scheme
// const ROW_COLOR_1 = "#02557A"; // Darker blue for even rows
// const ROW_COLOR_2 = "#014560"; // Dark blue for odd rows
// const FILLED_CELL_BG = "#f0ae13"; // Amber/Gold for filled cells
// const CELL_BORDER_COLOR = "#f0ae13"; // Amber/Gold border
// const NUMBER_COLOR = "#014560"; // Dark blue for numbers

// // Updated Color scheme matching FAQ and Home
// const PRIMARY_COLOR = "#02658D"; // Main background color
// const SECONDARY_COLOR = "#02557A"; // Darker blue
// const ACCENT_COLOR = "#f0ae13"; // Light amber/Accent color
// const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// const DARK_BLUE = "#014560"; // Darker blue for backgrounds

// const TicketsScreen = ({ route, navigation }) => {
//   const { game } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [myTickets, setMyTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     sets: 0,
//   });

//   const GAME_IMAGES = {
//     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
//     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
//     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
//     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
//     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
//     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
//   };

//   useEffect(() => {
//     fetchMyTickets();
//   }, []);

//   const onRefresh = React.useCallback(() => {
//     console.log("Refreshing tickets...");
//     setRefreshing(true);
//     fetchMyTickets().finally(() => {
//       setRefreshing(false);
//       console.log("Refresh complete");
//     });
//   }, []);

//   const fetchMyTickets = async () => {
//     console.log("fetchMyTickets called");
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token found:", token ? "Yes" : "No");
      
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );

//       console.log("Tickets API Response:", res.data);
      
//       if (res.data.success) {
//         // Filter tickets for the current game if game prop exists
//         const tickets = game
//           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
//           : res.data.tickets.data;
        
//         console.log("Filtered tickets:", tickets.length);
//         setMyTickets(tickets);
        
//         // Calculate stats (keeping for potential future use)
//         const activeCount = tickets.filter(t => t.is_active).length;
//         const setsCount = getTicketSetCount(tickets);
        
//         setStats({
//           total: tickets.length,
//           active: activeCount,
//           sets: setsCount,
//         });
//       }
//     } catch (error) {
//       console.log("Error fetching tickets:", error);
//       console.log("Error response:", error.response?.data);
//       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to convert ticket_data to the format needed for rendering
//   const processTicketData = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
//     // Check if the data is in the new format (array of objects)
//     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
//       // New format: array of objects with number property
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
//       // Old format: simple 2D array
//       return ticketData.map(row => row.map(cell => cell));
//     }
    
//     return Array(3).fill(Array(9).fill(null));
//   };

//   const renderTicketGrid = (ticketData, isModal = false) => {
//     const processedData = processTicketData(ticketData);
    
//     return (
//       <View style={[
//         styles.ticket,
//         { 
//           width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
//           backgroundColor: DARK_BLUE,
//           borderColor: ACCENT_COLOR,
//         }
//       ]}>
//         {/* Ticket rows without column headers */}
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
//               const isEmpty = cell === null;
              
//               return (
//                 <View
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.cell,
//                     { 
//                       width: CELL_WIDTH,
//                       height: CELL_WIDTH,
//                       margin: CELL_MARGIN,
//                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
//                       borderColor: ACCENT_COLOR,
//                     },
//                   ]}
//                 >
//                   {!isEmpty && (
//                     <Text style={styles.number}>
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

//   const renderTicketItem = ({ item }) => (
//     <View style={styles.ticketItemContainer}>
//       {/* Ticket number and status outside the card */}
//       <View style={styles.ticketHeader}>
//         <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
//         <View style={[
//           styles.statusBadge,
//           { backgroundColor: item.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
//         ]}>
//           <Ionicons
//             name={item.is_active ? "checkmark-circle" : "close-circle"}
//             size={12}
//             color={item.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
//           />
//           <Text style={[styles.statusText, { color: item.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
//             {item.is_active ? "Active" : "Inactive"}
//           </Text>
//         </View>
//       </View>

//       {/* Ticket Card with grid */}
//       <TouchableOpacity
//         onPress={() => {
//           setSelectedTicket(item);
//           setModalVisible(true);
//         }}
//         activeOpacity={0.9}
//       >
//         {/* Ticket grid directly on the white card */}
//         {renderTicketGrid(item.ticket_data)}
//       </TouchableOpacity>
//     </View>
//   );

//   // Calculate ticket set count
//   const getTicketSetCount = (tickets) => {
//     const sets = new Set(tickets.map(t => t.ticket_set_id));
//     return sets.size;
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
//           <Text style={styles.loadingText}>Loading your tickets...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

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
//         {/* Header with blue background */}
//         <View style={styles.header}>
//           <View style={styles.headerContent}>
//             <View style={styles.headerTopRow}>
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
//               </TouchableOpacity>

//               <View style={styles.headerTextContainer}>
//                 <Text style={styles.headerTitle}>My Tickets</Text>
//                 {game && (
//                   <View style={styles.gameInfoContainer}>
//                     <Ionicons name="game-controller" size={16} color={LIGHT_ACCENT} />
//                     <Text style={styles.gameName} numberOfLines={1}>
//                       {game.game_name || "Game"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               <TouchableOpacity 
//                 style={styles.refreshButton}
//                 onPress={fetchMyTickets}
//               >
//                 <Ionicons name="refresh" size={22} color={ACCENT_COLOR} />
//               </TouchableOpacity>
//             </View>

//             {/* Stats Cards */}
//             <View style={styles.statsContainer}>
//               <View style={styles.statCard}>
//                 <Ionicons name="ticket-outline" size={20} color={ACCENT_COLOR} />
//                 <Text style={styles.statValue}>{myTickets.length}</Text>
//                 <Text style={styles.statLabel}>Total Tickets</Text>
//               </View>
              
//               <View style={styles.statCard}>
//                 <Ionicons name="checkmark-circle-outline" size={20} color={ACCENT_COLOR} />
//                 <Text style={styles.statValue}>
//                   {myTickets.filter(t => t.is_active).length}
//                 </Text>
//                 <Text style={styles.statLabel}>Active</Text>
//               </View>
              
//               <View style={styles.statCard}>
//                 <Ionicons name="grid-outline" size={20} color={ACCENT_COLOR} />
//                 <Text style={styles.statValue}>
//                   {getTicketSetCount(myTickets)}
//                 </Text>
//                 <Text style={styles.statLabel}>Sets</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Tickets Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>🎟 My Tickets Collection</Text>
//               <View style={styles.countBadge}>
//                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
//               </View>
//             </View>

//             {myTickets.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <Image
//                   source={{ uri: GAME_IMAGES.empty }}
//                   style={styles.emptyIcon}
//                   tintColor={ACCENT_COLOR}
//                 />
//                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   {game
//                     ? "You don't have any tickets for this game yet"
//                     : "You haven't been allocated any tickets yet"}
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.refreshButtonLarge}
//                   onPress={fetchMyTickets}
//                 >
//                   <View style={styles.glassEffectOverlay} />
//                   <Ionicons name="refresh" size={18} color={SECONDARY_COLOR} />
//                   <Text style={styles.refreshButtonText}>Refresh</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.ticketsList}>
//                 {myTickets.map((ticket) => (
//                   <View key={ticket.id} style={styles.ticketWrapper}>
//                     {renderTicketItem({ item: ticket })}
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Bottom Info */}
//           <View style={styles.infoCard}>
//             <Ionicons name="information-circle" size={18} color={ACCENT_COLOR} />
//             <Text style={styles.infoCardText}>
//               • Active tickets are eligible for game participation{'\n'}
//               • Each ticket has a unique number and belongs to a set{'\n'}
//               • Tickets are automatically allocated for approved requests
//             </Text>
//           </View>

//           <View style={styles.bottomSpace} />
//         </View>
//       </ScrollView>

//       {/* Ticket Detail Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {selectedTicket && (
//               <>
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalTitleContainer}>
//                     <View style={styles.ticketNumberBadge}>
//                       <Ionicons name="ticket-outline" size={16} color={SECONDARY_COLOR} />
//                       <Text style={styles.ticketNumberBadgeText}>
//                         Ticket No: #{selectedTicket.ticket_number}
//                       </Text>
//                     </View>
//                     <View style={[
//                       styles.modalStatusBadge,
//                       { backgroundColor: selectedTicket.is_active ? 'rgba(255, 213, 79, 0.2)' : 'rgba(255, 236, 179, 0.1)' }
//                     ]}>
//                       <Ionicons
//                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
//                         size={12}
//                         color={selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT}
//                       />
//                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? ACCENT_COLOR : LIGHT_ACCENT }]}>
//                         {selectedTicket.is_active ? "Active" : "Inactive"}
//                       </Text>
//                     </View>
//                   </View>
//                   <TouchableOpacity 
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Ionicons name="close" size={22} color={ACCENT_COLOR} />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalContent}>
//                   {selectedTicket.game && (
//                     <View style={styles.gameCard}>
//                       <View style={styles.gameCardHeader}>
//                         <Ionicons name="game-controller" size={16} color={ACCENT_COLOR} />
//                         <Text style={styles.gameCardTitle}>Game Details</Text>
//                       </View>
//                       <View style={styles.gameCardContent}>
//                         <Text style={styles.gameNameText} numberOfLines={2}>
//                           {selectedTicket.game.game_name}
//                         </Text>
//                         <View style={styles.gameDetailsRow}>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="hash" size={12} color={LIGHT_ACCENT} />
//                             <Text style={styles.gameCodeText}>
//                               {selectedTicket.game.game_code}
//                             </Text>
//                           </View>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="calendar" size={12} color={LIGHT_ACCENT} />
//                             <Text style={styles.gameTimeText}>
//                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                   )}

//                   <View style={styles.fullTicketContainerModal}>
//                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
//                     <View style={styles.modalTicketGrid}>
//                       {renderTicketGrid(selectedTicket.ticket_data, true)}
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.modalActions}>
//                   <TouchableOpacity
//                     style={styles.closeModalButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <View style={styles.glassEffectOverlay} />
//                     <Text style={styles.closeModalButtonText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
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
//     paddingTop: 40,
//     paddingBottom: 20,
//     backgroundColor: SECONDARY_COLOR,
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
//     backgroundColor: "rgba(255, 213, 79, 0.1)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.3)",
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: TEXT_LIGHT,
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
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255, 213, 79, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.3)",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 213, 79, 0.2)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: ACCENT_COLOR,
//     marginVertical: 6,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: LIGHT_ACCENT,
//     fontWeight: "600",
//     textAlign: 'center',
//     opacity: 0.9,
//   },
//   content: {
//     padding: HORIZONTAL_MARGIN,
//     paddingTop: 20,
//     zIndex: 1,
//     marginTop: 0,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: ACCENT_COLOR,
//   },
//   countBadge: {
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     minWidth: 30,
//     alignItems: 'center',
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   countBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: SECONDARY_COLOR,
//   },
//   ticketsList: {
//     gap: 20,
//   },
//   ticketWrapper: {

//   },
//   ticketItemContainer: {
//     // No margin needed since wrapper handles it
//   },
//   ticketHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   ticketNo: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: TEXT_LIGHT,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//     gap: 4,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   // Ticket grid styles
//   ticket: {
//     backgroundColor: DARK_BLUE,
//     padding: TICKET_PADDING,
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     borderRadius: 12,
//     overflow: "hidden",
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   cell: {
//     borderWidth: 1,
//     borderColor: ACCENT_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 2,
//   },
//   number: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: DARK_BLUE,
//   },
//   emptyState: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 16,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "rgba(255, 213, 79, 0.2)",
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   emptyIcon: {
//     width: 80,
//     height: 80,
//     marginBottom: 20,
//     opacity: 0.7,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: ACCENT_COLOR,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: LIGHT_ACCENT,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 24,
//     paddingHorizontal: 20,
//     opacity: 0.9,
//   },
//   refreshButtonLarge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//     overflow: 'hidden',
//     position: 'relative',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   glassEffectOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.4)',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.2)',
//     borderRadius: 10,
//   },
//   refreshButtonText: {
//     color: SECONDARY_COLOR,
//     fontSize: 14,
//     fontWeight: "600",
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   infoCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: DARK_BLUE,
//     borderRadius: 12,
//     padding: 18,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.2)",
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   infoCardText: {
//     flex: 1,
//     fontSize: 13,
//     color: LIGHT_ACCENT,
//     lineHeight: 20,
//     opacity: 0.9,
//   },
//   bottomSpace: {
//     height: 20,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.85)",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   modalContainer: {
//     backgroundColor: DARK_BLUE,
//     borderRadius: 20,
//     padding: 0,
//     width: "100%",
//     maxWidth: 400,
//     maxHeight: "85%",
//     borderWidth: 2,
//     borderColor: ACCENT_COLOR,
//     shadowColor: ACCENT_COLOR,
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//     overflow: 'hidden',
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     paddingBottom: 16,
//     backgroundColor: SECONDARY_COLOR,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 213, 79, 0.3)',
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
//     backgroundColor: "rgba(255, 213, 79, 0.15)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 213, 79, 0.3)',
//   },
//   ticketNumberBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_LIGHT,
//   },
//   modalStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 213, 79, 0.2)',
//   },
//   modalStatusText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "rgba(255, 213, 79, 0.1)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.3)",
//   },
//   modalContent: {
//     padding: 20,
//   },
//   gameCard: {
//     backgroundColor: SECONDARY_COLOR,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255, 213, 79, 0.2)",
//   },
//   gameCardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   gameCardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
//   },
//   gameCardContent: {
//     gap: 8,
//   },
//   gameNameText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: TEXT_LIGHT,
//     lineHeight: 20,
//   },
//   gameDetailsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//     flexWrap: 'wrap',
//   },
//   gameDetailItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gameCodeText: {
//     fontSize: 13,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   gameTimeText: {
//     fontSize: 13,
//     color: LIGHT_ACCENT,
//     fontWeight: "500",
//     opacity: 0.9,
//   },
//   fullTicketContainerModal: {
//     marginBottom: 20,
//   },
//   ticketGridTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: ACCENT_COLOR,
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
//     borderTopColor: "rgba(255, 213, 79, 0.2)",
//   },
//   closeModalButton: {
//     backgroundColor: ACCENT_COLOR,
//     paddingHorizontal: 30,
//     paddingVertical: 14,
//     borderRadius: 10,
//     width: "100%",
//     alignItems: "center",
//     overflow: 'hidden',
//     position: 'relative',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   closeModalButtonText: {
//     color: SECONDARY_COLOR,
//     fontSize: 15,
//     fontWeight: "600",
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
// });

// export default TicketsScreen;











// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Dimensions,
//   Modal,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // For React Native CLI, use react-native-vector-icons
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Feather from "react-native-vector-icons/Feather";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // EXACT SAME parameters from your example
// const NUM_COLUMNS = 9;
// const CELL_MARGIN = 2;
// const TICKET_PADDING = 8;
// const HORIZONTAL_MARGIN = 10;

// // EXACT SAME calculation from your example
// const CELL_WIDTH = 
//   (SCREEN_WIDTH - 
//    HORIZONTAL_MARGIN * 2 - 
//    TICKET_PADDING * 2 - 
//    CELL_MARGIN * 2 * NUM_COLUMNS) / 
//   NUM_COLUMNS;

// // Updated colors to match Home component
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

// // Row colors for ticket grid
// const ROW_COLOR_1 = "#f0f8ff"; // Very light blue for even rows
// const ROW_COLOR_2 = "#e6f3ff"; // Slightly darker light blue for odd rows
// const FILLED_CELL_BG = "#62cff4"; // Light blue for filled cells
// const CELL_BORDER_COLOR = PRIMARY_COLOR; // Blue border
// const NUMBER_COLOR = WHITE; // White numbers on orange background

// const TicketsScreen = ({ route, navigation }) => {
//   const { game } = route.params || {};
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [myTickets, setMyTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     sets: 0,
//   });

//   const GAME_IMAGES = {
//     ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
//     diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//     celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
//     empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
//     pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
//     users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//     megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
//     trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
//   };

//   useEffect(() => {
//     fetchMyTickets();
//   }, []);

//   const onRefresh = React.useCallback(() => {
//     console.log("Refreshing tickets...");
//     setRefreshing(true);
//     fetchMyTickets().finally(() => {
//       setRefreshing(false);
//       console.log("Refresh complete");
//     });
//   }, []);

//   const fetchMyTickets = async () => {
//     console.log("fetchMyTickets called");
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token found:", token ? "Yes" : "No");
      
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/my-tickets",
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           } 
//         }
//       );

//       console.log("Tickets API Response:", res.data);
      
//       if (res.data.success) {
//         // Filter tickets for the current game if game prop exists
//         const tickets = game
//           ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
//           : res.data.tickets.data;
        
//         console.log("Filtered tickets:", tickets.length);
//         setMyTickets(tickets);
        
//         // Calculate stats (keeping for potential future use)
//         const activeCount = tickets.filter(t => t.is_active).length;
//         const setsCount = getTicketSetCount(tickets);
        
//         setStats({
//           total: tickets.length,
//           active: activeCount,
//           sets: setsCount,
//         });
//       }
//     } catch (error) {
//       console.log("Error fetching tickets:", error);
//       console.log("Error response:", error.response?.data);
//       Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to convert ticket_data to the format needed for rendering
//   const processTicketData = (ticketData) => {
//     if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
//     // Check if the data is in the new format (array of objects)
//     if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
//       // New format: array of objects with number property
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
//       // Old format: simple 2D array
//       return ticketData.map(row => row.map(cell => cell));
//     }
    
//     return Array(3).fill(Array(9).fill(null));
//   };

//   const renderTicketGrid = (ticketData, isModal = false) => {
//     const processedData = processTicketData(ticketData);
    
//     return (
//       <View style={[
//         styles.ticket,
//         { 
//           width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
//           backgroundColor: WHITE,
//           borderColor: PRIMARY_COLOR,
//         }
//       ]}>
//         {/* Ticket rows without column headers */}
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
//               const isEmpty = cell === null;
              
//               return (
//                 <View
//                   key={`cell-${rowIndex}-${colIndex}`}
//                   style={[
//                     styles.cell,
//                     { 
//                       width: CELL_WIDTH,
//                       height: CELL_WIDTH,
//                       margin: CELL_MARGIN,
//                       backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
//                       borderColor: PRIMARY_COLOR,
//                     },
//                   ]}
//                 >
//                   {!isEmpty && (
//                     <Text style={styles.number}>
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

//   const renderTicketItem = ({ item }) => (
//     <View style={styles.ticketItemContainer}>
//       {/* Ticket number and status outside the card */}
//       <View style={styles.ticketHeader}>
//         <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
//         <View style={[
//           styles.statusBadge,
//           { backgroundColor: item.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
//         ]}>
//           <Ionicons
//             name={item.is_active ? "checkmark-circle" : "close-circle"}
//             size={12}
//             color={item.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
//           />
//           <Text style={[styles.statusText, { color: item.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
//             {item.is_active ? "Active" : "Inactive"}
//           </Text>
//         </View>
//       </View>

//       {/* Ticket Card with grid */}
//       <TouchableOpacity
//         onPress={() => {
//           setSelectedTicket(item);
//           setModalVisible(true);
//         }}
//         activeOpacity={0.9}
//       >
//         {/* Ticket grid directly on the white card */}
//         {renderTicketGrid(item.ticket_data)}
//       </TouchableOpacity>
//     </View>
//   );

//   // Calculate ticket set count
//   const getTicketSetCount = (tickets) => {
//     const sets = new Set(tickets.map(t => t.ticket_set_id));
//     return sets.size;
//   };

//   if (loading) {
//     console.log("Showing loading screen");
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
//         <View style={styles.loadingContent}>
//           <View style={styles.loadingIconWrapper}>
//             <MaterialIcons name="confirmation-number" size={40} color={PRIMARY_COLOR} />
//           </View>
//           <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
//           <Text style={styles.loadingText}>Loading your tickets...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      
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
//         {/* Header with blue background */}
//         <View style={styles.header}>
//           <View style={styles.headerContent}>
//             <View style={styles.headerTopRow}>
//               <TouchableOpacity
//                 style={styles.backButton}
//                 onPress={() => navigation.goBack()}
//               >
//                 <Ionicons name="arrow-back" size={24} color={WHITE} />
//               </TouchableOpacity>

//               <View style={styles.headerTextContainer}>
//                 <Text style={styles.headerTitle}>My Tickets</Text>
//                 {game && (
//                   <View style={styles.gameInfoContainer}>
//                     <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
//                     <Text style={styles.gameName} numberOfLines={1}>
//                       {game.game_name || "Game"}
//                     </Text>
//                   </View>
//                 )}
//               </View>

              
//             </View>

//             {/* Stats Cards */}
//             {/* <View style={styles.statsContainer}>
//               <View style={styles.statCard}>
//                 <Ionicons name="ticket-outline" size={20} color={PRIMARY_COLOR} />
//                 <Text style={styles.statValue}>{myTickets.length}</Text>
//                 <Text style={styles.statLabel}>Total Tickets</Text>
//               </View>
              
//               <View style={styles.statCard}>
//                 <Ionicons name="checkmark-circle-outline" size={20} color={PRIMARY_COLOR} />
//                 <Text style={styles.statValue}>
//                   {myTickets.filter(t => t.is_active).length}
//                 </Text>
//                 <Text style={styles.statLabel}>Active</Text>
//               </View>
              
//               <View style={styles.statCard}>
//                 <Ionicons name="grid-outline" size={20} color={PRIMARY_COLOR} />
//                 <Text style={styles.statValue}>
//                   {getTicketSetCount(myTickets)}
//                 </Text>
//                 <Text style={styles.statLabel}>Sets</Text>
//               </View>
//             </View> */}
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.content}>
//           {/* Tickets Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>My Tickets Collection</Text>
//               <View style={styles.countBadge}>
//                 <Text style={styles.countBadgeText}>{myTickets.length}</Text>
//               </View>
//             </View>

//             {myTickets.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <Image
//                   source={{ uri: GAME_IMAGES.empty }}
//                   style={styles.emptyIcon}
//                   tintColor={PRIMARY_COLOR}
//                 />
//                 <Text style={styles.emptyTitle}>No Tickets Found</Text>
//                 <Text style={styles.emptySubtitle}>
//                   {game
//                     ? "You don't have any tickets for this game yet"
//                     : "You haven't been allocated any tickets yet"}
//                 </Text>
               
//               </View>
//             ) : (
//               <View style={styles.ticketsList}>
//                 {myTickets.map((ticket) => (
//                   <View key={ticket.id} style={styles.ticketWrapper}>
//                     {renderTicketItem({ item: ticket })}
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Bottom Info */}
//           {/* <View style={styles.infoCard}>
//             <Ionicons name="information-circle" size={18} color={PRIMARY_COLOR} />
//             <Text style={styles.infoCardText}>
//               • Active tickets are eligible for game participation{'\n'}
//               • Each ticket has a unique number and belongs to a set{'\n'}
//               • Tickets are automatically allocated for approved requests
//             </Text>
//           </View> */}

//           <View style={styles.bottomSpace} />
//         </View>
//       </ScrollView>

//       {/* Ticket Detail Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {selectedTicket && (
//               <>
//                 <View style={styles.modalHeader}>
//                   <View style={styles.modalTitleContainer}>
//                     <View style={styles.ticketNumberBadge}>
//                       <Ionicons name="ticket-outline" size={16} color={PRIMARY_COLOR} />
//                       <Text style={styles.ticketNumberBadgeText}>
//                         Ticket No: #{selectedTicket.ticket_number}
//                       </Text>
//                     </View>
//                     <View style={[
//                       styles.modalStatusBadge,
//                       { backgroundColor: selectedTicket.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
//                     ]}>
//                       <Ionicons
//                         name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
//                         size={12}
//                         color={selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
//                       />
//                       <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
//                         {selectedTicket.is_active ? "Active" : "Inactive"}
//                       </Text>
//                     </View>
//                   </View>
//                   <TouchableOpacity 
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Ionicons name="close" size={22} color={PRIMARY_COLOR} />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.modalContent}>
//                   {selectedTicket.game && (
//                     <View style={styles.gameCard}>
//                       <View style={styles.gameCardHeader}>
//                         <Ionicons name="game-controller" size={16} color={PRIMARY_COLOR} />
//                         <Text style={styles.gameCardTitle}>Game Details</Text>
//                       </View>
//                       <View style={styles.gameCardContent}>
//                         <Text style={styles.gameNameText} numberOfLines={2}>
//                           {selectedTicket.game.game_name}
//                         </Text>
//                         <View style={styles.gameDetailsRow}>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="hash" size={12} color={TEXT_LIGHT} />
//                             <Text style={styles.gameCodeText}>
//                               {selectedTicket.game.game_code}
//                             </Text>
//                           </View>
//                           <View style={styles.gameDetailItem}>
//                             <Feather name="calendar" size={12} color={TEXT_LIGHT} />
//                             <Text style={styles.gameTimeText}>
//                               {new Date(selectedTicket.game.game_date).toLocaleDateString()}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                   )}

//                   <View style={styles.fullTicketContainerModal}>
//                     <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
//                     <View style={styles.modalTicketGrid}>
//                       {renderTicketGrid(selectedTicket.ticket_data, true)}
//                     </View>
//                   </View>
//                 </View>

//                 <View style={styles.modalActions}>
//                   <TouchableOpacity
//                     style={styles.closeModalButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <View style={styles.glassEffectOverlay} />
//                     <Text style={styles.closeModalButtonText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
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
//     backgroundColor: 'rgba(79, 172, 254, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: 'rgba(79, 172, 254, 0.2)',
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
//     paddingTop: 20,
    
//     backgroundColor: PRIMARY_COLOR,
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
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: TEXT_DARK,
//     marginVertical: 6,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: TEXT_LIGHT,
//     fontWeight: "600",
//     textAlign: 'center',
//   },
//   content: {
//     padding: HORIZONTAL_MARGIN,
//     paddingTop: 20,
//     zIndex: 1,
//     marginTop: 0,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: TEXT_DARK,
//   },
//   countBadge: {
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     minWidth: 30,
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   countBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: WHITE,
//   },
//   ticketsList: {
//     gap: 20,
//   },
//   ticketWrapper: {

//   },
//   ticketItemContainer: {
//     // No margin needed since wrapper handles it
//   },
//   ticketHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   ticketNo: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: TEXT_DARK,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 6,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "700",
//   },
//   // Ticket grid styles
//   ticket: {
//     backgroundColor: WHITE,
//     padding: TICKET_PADDING,
//     borderWidth: 2,
//     borderColor: PRIMARY_COLOR,
//     borderRadius: 12,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   cell: {
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 4,
//   },
//   number: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: WHITE,
//   },
//   emptyState: {
//     backgroundColor: WHITE,
//     borderRadius: 16,
//     padding: 32,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   emptyIcon: {
//     width: 80,
//     height: 80,
//     marginBottom: 20,
//     opacity: 0.7,
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
//     marginBottom: 24,
//     paddingHorizontal: 20,
//   },
//   refreshButtonLarge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: PRIMARY_COLOR,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
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
//   refreshButtonText: {
//     color: WHITE,
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   infoCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: WHITE,
//     borderRadius: 12,
//     padding: 18,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//     gap: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   infoCardText: {
//     flex: 1,
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     lineHeight: 20,
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
//     backgroundColor: WHITE,
//     borderRadius: 20,
//     padding: 0,
//     width: "100%",
//     maxWidth: 400,
//     maxHeight: "85%",
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
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
//     backgroundColor: BACKGROUND_COLOR,
//     borderBottomWidth: 1,
//     borderBottomColor: BORDER_COLOR,
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
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 8,
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   ticketNumberBadgeText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   modalStatusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//     gap: 4,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   modalStatusText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   closeButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "rgba(79, 172, 254, 0.1)",
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: PRIMARY_COLOR,
//   },
//   modalContent: {
//     padding: 20,
//   },
//   gameCard: {
//     backgroundColor: BACKGROUND_COLOR,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: BORDER_COLOR,
//   },
//   gameCardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   gameCardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: TEXT_DARK,
//   },
//   gameCardContent: {
//     gap: 8,
//   },
//   gameNameText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: TEXT_DARK,
//     lineHeight: 20,
//   },
//   gameDetailsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//     flexWrap: 'wrap',
//   },
//   gameDetailItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   gameCodeText: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   gameTimeText: {
//     fontSize: 13,
//     color: TEXT_LIGHT,
//     fontWeight: "500",
//   },
//   fullTicketContainerModal: {
//     marginBottom: 20,
//   },
//   ticketGridTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: TEXT_DARK,
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
//     borderTopColor: BORDER_COLOR,
//   },
//   closeModalButton: {
//     backgroundColor: PRIMARY_COLOR,
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
//     color: WHITE,
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });

// export default TicketsScreen;



import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// For React Native CLI, use react-native-vector-icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// EXACT SAME parameters from your example
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 8;
const HORIZONTAL_MARGIN = 10;

// EXACT SAME calculation from your example
const CELL_WIDTH = 
  (SCREEN_WIDTH - 
   HORIZONTAL_MARGIN * 2 - 
   TICKET_PADDING * 2 - 
   CELL_MARGIN * 2 * NUM_COLUMNS) / 
  NUM_COLUMNS;

// Updated colors - Changed PRIMARY_COLOR to #4facfe (keeping for header)
// New TICKET_BORDER_COLOR added for ticket borders
const PRIMARY_COLOR = "#4facfe"; // Main blue color for header and accents
const TICKET_BORDER_COLOR = "#fcca26"; // Orange/red color for ticket borders
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SUCCESS_COLOR = "#4CAF50"; // Green for success states
const ERROR_COLOR = "#E74C3C"; // Red for errors

// Row colors for ticket grid
const ROW_COLOR_1 = "#f0f8ff"; // Very light blue for even rows
const ROW_COLOR_2 = "#e6f3ff"; // Slightly darker light blue for odd rows
const FILLED_CELL_BG = "#62cff4"; // Light blue for filled cells
const CELL_BORDER_COLOR = TICKET_BORDER_COLOR; // Use new ticket border color for cell borders
const NUMBER_COLOR = WHITE; // White numbers on orange background

const TicketsScreen = ({ route, navigation }) => {
  const { game } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sets: 0,
  });

  const GAME_IMAGES = {
    ticket: "https://cdn-icons-png.flaticon.com/512/2589/2589909.png",
    diamond: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    celebrate: "https://cdn-icons-png.flaticon.com/512/3126/3126640.png",
    empty: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png",
    pattern: "https://cdn-icons-png.flaticon.com/512/2097/2097069.png",
    users: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
    megaphone: "https://cdn-icons-png.flaticon.com/512/2599/2599562.png",
    trophy: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const onRefresh = React.useCallback(() => {
    console.log("Refreshing tickets...");
    setRefreshing(true);
    fetchMyTickets().finally(() => {
      setRefreshing(false);
      console.log("Refresh complete");
    });
  }, []);

  const fetchMyTickets = async () => {
    console.log("fetchMyTickets called");
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Token found:", token ? "Yes" : "No");
      
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/my-tickets",
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          } 
        }
      );

      console.log("Tickets API Response:", res.data);
      
      if (res.data.success) {
        // Filter tickets for the current game if game prop exists
        const tickets = game
          ? res.data.tickets.data.filter((ticket) => ticket.game_id == game.id)
          : res.data.tickets.data;
        
        console.log("Filtered tickets:", tickets.length);
        setMyTickets(tickets);
        
        // Calculate stats (keeping for potential future use)
        const activeCount = tickets.filter(t => t.is_active).length;
        const setsCount = getTicketSetCount(tickets);
        
        setStats({
          total: tickets.length,
          active: activeCount,
          sets: setsCount,
        });
      }
    } catch (error) {
      console.log("Error fetching tickets:", error);
      console.log("Error response:", error.response?.data);
      Alert.alert("Error", error.response?.data?.message || "Failed to load your tickets");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert ticket_data to the format needed for rendering
  const processTicketData = (ticketData) => {
    if (!ticketData || !Array.isArray(ticketData)) return Array(3).fill(Array(9).fill(null));
    
    // Check if the data is in the new format (array of objects)
    if (ticketData[0] && Array.isArray(ticketData[0]) && ticketData[0][0] && typeof ticketData[0][0] === 'object') {
      // New format: array of objects with number property
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
      // Old format: simple 2D array
      return ticketData.map(row => row.map(cell => cell));
    }
    
    return Array(3).fill(Array(9).fill(null));
  };

  const renderTicketGrid = (ticketData, isModal = false) => {
    const processedData = processTicketData(ticketData);
    
    return (
      <View style={[
        styles.ticket,
        { 
          width: isModal ? SCREEN_WIDTH - 40 : SCREEN_WIDTH - 20,
          backgroundColor: WHITE,
          borderColor: TICKET_BORDER_COLOR, // Using new ticket border color
          borderWidth: 2, // Explicitly set border width
        }
      ]}>
        {/* Ticket rows without column headers */}
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
              const isEmpty = cell === null;
              
              return (
                <View
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    { 
                      width: CELL_WIDTH,
                      height: CELL_WIDTH,
                      margin: CELL_MARGIN,
                      backgroundColor: isEmpty ? 'transparent' : FILLED_CELL_BG,
                      borderColor: TICKET_BORDER_COLOR, // Using new ticket border color for cells
                    },
                  ]}
                >
                  {!isEmpty && (
                    <Text style={styles.number}>
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

  const renderTicketItem = ({ item }) => (
    <View style={styles.ticketItemContainer}>
      {/* Ticket number and status outside the card */}
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketNo}>Ticket No: #{item.ticket_number}</Text>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
        ]}>
          <Ionicons
            name={item.is_active ? "checkmark-circle" : "close-circle"}
            size={12}
            color={item.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
          />
          <Text style={[styles.statusText, { color: item.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
            {item.is_active ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Ticket Card with grid */}
      <TouchableOpacity
        onPress={() => {
          setSelectedTicket(item);
          setModalVisible(true);
        }}
        activeOpacity={0.9}
      >
        {/* Ticket grid directly on the white card */}
        {renderTicketGrid(item.ticket_data)}
      </TouchableOpacity>
    </View>
  );

  // Calculate ticket set count
  const getTicketSetCount = (tickets) => {
    const sets = new Set(tickets.map(t => t.ticket_set_id));
    return sets.size;
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
          <Text style={styles.loadingText}>Loading your tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* Header with blue background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={WHITE} />
              </TouchableOpacity>

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>My Tickets</Text>
                {game && (
                  <View style={styles.gameInfoContainer}>
                    <Ionicons name="game-controller" size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.gameName} numberOfLines={1}>
                      {game.game_name || "Game"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Tickets Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Tickets Collection</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{myTickets.length}</Text>
              </View>
            </View>

            {myTickets.length === 0 ? (
              <View style={styles.emptyState}>
                <Image
                  source={{ uri: GAME_IMAGES.empty }}
                  style={styles.emptyIcon}
                  tintColor={PRIMARY_COLOR}
                />
                <Text style={styles.emptyTitle}>No Tickets Found</Text>
                <Text style={styles.emptySubtitle}>
                  {game
                    ? "You don't have any tickets for this game yet"
                    : "You haven't been allocated any tickets yet"}
                </Text>
              </View>
            ) : (
              <View style={styles.ticketsList}>
                {myTickets.map((ticket) => (
                  <View key={ticket.id} style={styles.ticketWrapper}>
                    {renderTicketItem({ item: ticket })}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>

      {/* Ticket Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTicket && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={[
                      styles.ticketNumberBadge,
                      { borderColor: TICKET_BORDER_COLOR } // Using new ticket border color
                    ]}>
                      <Ionicons name="ticket-outline" size={16} color={TICKET_BORDER_COLOR} />
                      <Text style={styles.ticketNumberBadgeText}>
                        Ticket No: #{selectedTicket.ticket_number}
                      </Text>
                    </View>
                    <View style={[
                      styles.modalStatusBadge,
                      { backgroundColor: selectedTicket.is_active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(119, 119, 119, 0.1)' }
                    ]}>
                      <Ionicons
                        name={selectedTicket.is_active ? "checkmark-circle" : "close-circle"}
                        size={12}
                        color={selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT}
                      />
                      <Text style={[styles.modalStatusText, { color: selectedTicket.is_active ? SUCCESS_COLOR : TEXT_LIGHT }]}>
                        {selectedTicket.is_active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.closeButton,
                      { borderColor: TICKET_BORDER_COLOR } // Using new ticket border color
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={22} color={TICKET_BORDER_COLOR} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>
                  {selectedTicket.game && (
                    <View style={styles.gameCard}>
                      <View style={styles.gameCardHeader}>
                        <Ionicons name="game-controller" size={16} color={PRIMARY_COLOR} />
                        <Text style={styles.gameCardTitle}>Game Details</Text>
                      </View>
                      <View style={styles.gameCardContent}>
                        <Text style={styles.gameNameText} numberOfLines={2}>
                          {selectedTicket.game.game_name}
                        </Text>
                        <View style={styles.gameDetailsRow}>
                          <View style={styles.gameDetailItem}>
                            <Feather name="hash" size={12} color={TEXT_LIGHT} />
                            <Text style={styles.gameCodeText}>
                              {selectedTicket.game.game_code}
                            </Text>
                          </View>
                          <View style={styles.gameDetailItem}>
                            <Feather name="calendar" size={12} color={TEXT_LIGHT} />
                            <Text style={styles.gameTimeText}>
                              {new Date(selectedTicket.game.game_date).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.fullTicketContainerModal}>
                    <Text style={styles.ticketGridTitle}>Ticket Grid</Text>
                    <View style={styles.modalTicketGrid}>
                      {renderTicketGrid(selectedTicket.ticket_data, true)}
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <View style={styles.glassEffectOverlay} />
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    paddingTop: 20,
    backgroundColor: PRIMARY_COLOR,
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: HORIZONTAL_MARGIN,
    paddingTop: 20,
    zIndex: 1,
    marginTop: 0,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT_DARK,
  },
  countBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: WHITE,
  },
  ticketsList: {
    gap: 20,
  },
  ticketWrapper: {},
  ticketItemContainer: {},
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ticketNo: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  // Ticket grid styles
  ticket: {
    backgroundColor: WHITE,
    padding: TICKET_PADDING,
    borderWidth: 2,
    borderColor: TICKET_BORDER_COLOR, // Using new ticket border color
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: TICKET_BORDER_COLOR, // Using new ticket border color for cells
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    color: NUMBER_COLOR,
  },
  emptyState: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.7,
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
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  refreshButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
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
  refreshButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_LIGHT,
    lineHeight: 20,
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
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 0,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
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
    backgroundColor: BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
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
    backgroundColor: "rgba(213, 62, 15, 0.1)", // Light orange based on new color
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: TICKET_BORDER_COLOR, // Using new ticket border color
  },
  ticketNumberBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(213, 62, 15, 0.1)", // Light orange based on new color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TICKET_BORDER_COLOR, // Using new ticket border color
  },
  modalContent: {
    padding: 20,
  },
  gameCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  gameCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  gameCardContent: {
    gap: 8,
  },
  gameNameText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    lineHeight: 20,
  },
  gameDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: 'wrap',
  },
  gameDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gameCodeText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  gameTimeText: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  fullTicketContainerModal: {
    marginBottom: 20,
  },
  ticketGridTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
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
    borderTopColor: BORDER_COLOR,
  },
  closeModalButton: {
    backgroundColor: PRIMARY_COLOR,
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
    color: WHITE,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default TicketsScreen;
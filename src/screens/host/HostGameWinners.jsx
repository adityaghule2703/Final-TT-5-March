// HostGameWinners.js
import React, { useState, useEffect } from "react";
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
  Image,
  Modal,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Updated colors to match TicketsScreen
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
const WARNING_COLOR = "#FF9800"; // Orange for warnings
const SECTION_BG = "#F8F9FA"; // Light background for sections
const PRIZE_BG = "#F0F2F5"; // Background for prize items

// Row colors for ticket grid
const ROW_COLOR_1 = "#f0f8ff"; // Very light blue for even rows
const ROW_COLOR_2 = "#e6f3ff"; // Slightly darker light blue for odd rows
const FILLED_CELL_BG = "#62cff4"; // Light blue for filled cells
const MARKED_CELL_BG = "#FF5252"; // Red for marked cells
const EMPTY_CELL_BG = "transparent"; // Transparent for empty cells
const CELL_BORDER_COLOR = PRIMARY_COLOR; // Blue border
const NUMBER_COLOR = WHITE; // White numbers

// Ticket parameters - REDUCED TICKET SIZE
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 4; // Keep padding minimal

// Calculate ticket width to be 85% of screen width to ensure it fits
const TICKET_CONTAINER_WIDTH = SCREEN_WIDTH * 0.85; // Use 85% of screen width

// Calculate cell width based on ticket container width
const CELL_WIDTH = Math.floor(
  (TICKET_CONTAINER_WIDTH - (TICKET_PADDING * 2) - (CELL_MARGIN * 2 * NUM_COLUMNS)) / NUM_COLUMNS
);

const HostGameWinners = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [winnersData, setWinnersData] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/claims/game/${gameId}/winners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setWinnersData(response.data.data);
      } else {
        throw new Error("Failed to fetch winners");
      }
    } catch (error) {
      console.log("Error fetching winners:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Failed to fetch winners"
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWinners();
    setRefreshing(false);
  };

  const renderTicketGrid = (ticketData) => {
    // Process ticket data to ensure it's in the right format
    const processedData = Array.isArray(ticketData) ? ticketData : [];
    
    return (
      <View style={styles.ticket}>
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
              const cellNumber = cell?.number;
              const isMarked = cell?.is_marked;
              const isEmpty = cellNumber === null || cellNumber === undefined;
              
              // Determine cell background color
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

  const renderWinnerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.winnerCard}
      onPress={() => {
        setSelectedWinner(item);
        setModalVisible(true);
      }}
      activeOpacity={0.9}
    >
      {/* Ticket number and status */}
      <View style={styles.ticketHeader}>
        <View style={styles.ticketNumberContainer}>
          <Ionicons name="ticket-outline" size={14} color={PRIMARY_COLOR} />
          <Text style={styles.ticketNo}>Ticket #{item.ticket_number}</Text>
        </View>
        
        <View style={styles.winnerBadge}>
          <Ionicons name="trophy" size={12} color="#FFD700" />
          <Text style={styles.winnerBadgeText}>Winner</Text>
        </View>
      </View>

      {/* Winner Info Row */}
      <View style={styles.winnerInfoRow}>
        <View style={styles.winnerProfile}>
          {item.profile_image ? (
            <Image
              source={{ uri: item.profile_image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={20} color={TEXT_LIGHT} />
            </View>
          )}
          <View style={styles.winnerNameContainer}>
            <Text style={styles.winnerName}>{item.user_name}</Text>
            <Text style={styles.winnerUsername}>@{item.username}</Text>
          </View>
        </View>

        <View style={styles.winnerAmountContainer}>
          <Text style={styles.winnerAmountLabel}>Won</Text>
          <Text style={styles.winnerAmount}>₹{item.winning_amount}</Text>
        </View>
      </View>

      {/* Prize Details Row */}
      <View style={styles.prizeDetailsRow}>
        <View style={styles.prizeDetailItem}>
          <MaterialCommunityIcons name="gift-outline" size={14} color={PRIMARY_COLOR} />
          <Text style={styles.prizeDetailText} numberOfLines={1}>{item.reward_name}</Text>
        </View>
        
        <View style={styles.prizeDetailItem}>
          <Ionicons name="sparkles" size={14} color={WARNING_COLOR} />
          <Text style={styles.prizeDetailText} numberOfLines={1}>
            {item.pattern_name?.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Winning Ticket Grid */}
      <View style={styles.ticketPreviewContainer}>
        {/* <View style={styles.ticketPreviewHeader}>
          <Ionicons name="checkmark-circle" size={14} color={SUCCESS_COLOR} />
          <Text style={styles.ticketPreviewTitle}>Winning Ticket</Text>
        </View> */}
        <View style={styles.ticketWrapper}>
          {renderTicketGrid(item.ticket_data)}
        </View>
      </View>

      {/* Time Ago */}
      <View style={styles.timeAgoContainer}>
        <Ionicons name="time-outline" size={12} color={TEXT_LIGHT} />
        <Text style={styles.timeAgoText}>
          Approved {item.time_since_approval}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // const PatternWinnersCard = () => {
  //   if (!winnersData?.pattern_winners?.length) return null;

  //   return (
  //     <View style={styles.patternCard}>
  //       <View style={styles.sectionHeader}>
  //         <Ionicons name="stats-chart" size={18} color={PRIMARY_COLOR} />
  //         <Text style={styles.sectionTitle}>Winning Patterns</Text>
  //       </View>
        
  //       <View style={styles.patternsContainer}>
  //         {winnersData.pattern_winners.map((pattern, index) => (
  //           <View key={index} style={styles.patternItem}>
  //             <View style={styles.patternHeader}>
  //               <View style={styles.patternNameContainer}>
  //                 <Ionicons name="sparkles" size={14} color={WARNING_COLOR} />
  //                 <Text style={styles.patternName} numberOfLines={1}>
  //                   {pattern.pattern_name.replace(/_/g, ' ').toUpperCase()}
  //                 </Text>
  //               </View>
  //               <View style={styles.patternBadge}>
  //                 <Text style={styles.patternBadgeText}>
  //                   {pattern.winner_count}
  //                 </Text>
  //               </View>
  //             </View>
  //             <View style={styles.patternStats}>
  //               <View style={styles.patternStat}>
  //                 <Text style={styles.patternStatLabel}>Total Amount</Text>
  //                 <Text style={styles.patternStatValue}>₹{pattern.total_amount}</Text>
  //               </View>
  //             </View>
  //           </View>
  //         ))}
  //       </View>
  //     </View>
  //   );
  // };

  const SummaryCard = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Ionicons name="trophy" size={18} color={PRIMARY_COLOR} />
        <Text style={styles.summaryTitle}>Winners Summary</Text>
      </View>
      
      <View style={styles.summaryStats}>
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatValue}>{winnersData?.total_winners || 0}</Text>
          <Text style={styles.summaryStatLabel}>Total Winners</Text>
        </View>
        
        <View style={styles.summaryStatDivider} />
        
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatValue}>₹{winnersData?.total_winnings || 0}</Text>
          <Text style={styles.summaryStatLabel}>Total Winnings</Text>
        </View>
        
        <View style={styles.summaryStatDivider} />
        
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatValue}>{winnersData?.pattern_winners?.length || 0}</Text>
          <Text style={styles.summaryStatLabel}>Patterns</Text>
        </View>
      </View>
    </View>
  );

  const WinnerModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {selectedWinner && (
            <>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <View style={styles.ticketNumberBadge}>
                    <Ionicons name="ticket-outline" size={14} color={PRIMARY_COLOR} />
                    <Text style={styles.ticketNumberBadgeText}>
                      Ticket #{selectedWinner.ticket_number}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color={PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.modalWinnerInfo}>
                  <View style={styles.modalProfile}>
                    {selectedWinner.profile_image ? (
                      <Image
                        source={{ uri: selectedWinner.profile_image }}
                        style={styles.modalProfileImage}
                      />
                    ) : (
                      <View style={styles.modalProfileImagePlaceholder}>
                        <Ionicons name="person" size={24} color={TEXT_LIGHT} />
                      </View>
                    )}
                    <View style={styles.modalUserInfo}>
                      <Text style={styles.modalUserName}>{selectedWinner.user_name}</Text>
                      <Text style={styles.modalUserUsername}>@{selectedWinner.username}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalPrizeInfo}>
                    <View style={styles.modalPrizeBadge}>
                      <Ionicons name="trophy" size={16} color="#FFD700" />
                      <Text style={styles.modalPrizeText}>{selectedWinner.reward_name}</Text>
                    </View>
                    <Text style={styles.modalPrizeAmount}>₹{selectedWinner.winning_amount}</Text>
                  </View>
                </View>
                
                <View style={styles.modalPatternInfo}>
                  <View style={styles.modalPatternItem}>
                    <Ionicons name="sparkles" size={14} color={WARNING_COLOR} />
                    <Text style={styles.modalPatternText}>
                      {selectedWinner.pattern_name?.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.modalPatternItem}>
                    <Ionicons name="time-outline" size={14} color={TEXT_LIGHT} />
                    <Text style={styles.modalPatternText}>
                      Approved {selectedWinner.time_since_approval}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.modalTicketSection}>
                  <Text style={styles.modalTicketTitle}>Winning Ticket</Text>
                  <View style={styles.modalTicketContainer}>
                    <View style={styles.ticketWrapper}>
                      {renderTicketGrid(selectedWinner.ticket_data)}
                    </View>
                    
                    <View style={styles.ticketLegend}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: FILLED_CELL_BG }]} />
                        <Text style={styles.legendText}>Unmarked</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: MARKED_CELL_BG }]} />
                        <Text style={styles.legendText}>Marked (Winning)</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <View style={styles.glassEffectOverlay} />
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconWrapper}>
          <Ionicons name="trophy" size={40} color={PRIMARY_COLOR} />
        </View>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading Winners...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

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
              <Text style={styles.headerTitle} numberOfLines={1}>{gameName}</Text>
              <Text style={styles.headerSubtitle}>Game Winners</Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchWinners}
            >
              <Ionicons name="refresh" size={20} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>
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
        {(!winnersData?.winners || winnersData.winners.length === 0) ? (
          <View style={styles.emptyState}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4076/4076478.png" }}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyStateTitle}>No Winners Yet</Text>
            <Text style={styles.emptyStateText}>
              There are no winners for this game yet. 
              Winners will appear here once claims are approved.
            </Text>
          </View>
        ) : (
          <>
            <SummaryCard />
            
            {/* <PatternWinnersCard /> */}
            
            <View style={styles.winnersSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={18} color={PRIMARY_COLOR} />
                <Text style={styles.sectionTitle}>All Winners</Text>
                <View style={styles.winnersCountBadge}>
                  <Text style={styles.winnersCountText}>
                    {winnersData.total_winners}
                  </Text>
                </View>
              </View>
              
              <View style={styles.winnersList}>
                {winnersData.winners.map((item) => (
                  <View key={item.id} style={styles.winnerWrapper}>
                    {renderWinnerItem({ item })}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
        
        <View style={styles.refreshHint}>
          <Ionicons name="arrow-down" size={12} color={TEXT_LIGHT} />
          <Text style={styles.refreshHintText}>Pull down to refresh</Text>
        </View>
      </ScrollView>

      <WinnerModal />
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
    paddingBottom: 20,
  },
  header: {
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
    paddingHorizontal: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: WHITE,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
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
    marginTop: 16,
    fontSize: 15,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  emptyState: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    marginBottom: 16,
    opacity: 0.7,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryStat: {
    alignItems: "center",
    flex: 1,
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "500",
    textAlign: "center",
  },
  summaryStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: BORDER_COLOR,
  },
  patternCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  patternsContainer: {
    gap: 8,
  },
  patternItem: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  patternHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  patternNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  patternName: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
    flex: 1,
  },
  patternBadge: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    minWidth: 24,
    alignItems: 'center',
  },
  patternBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  patternStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  patternStat: {
    alignItems: "flex-end",
  },
  patternStatLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  patternStatValue: {
    fontSize: 15,
    fontWeight: "700",
    color: SUCCESS_COLOR,
  },
  winnersSection: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  winnersCountBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  winnersCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: WHITE,
  },
  winnersList: {
    gap: 12,
  },
  winnerWrapper: {
    marginBottom: 0,
  },
  winnerCard: {
    backgroundColor: WHITE,
    padding: 12,
    // No border, shadow, or elevation - clean card
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  ticketNo: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  winnerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  winnerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: '#B8860B',
  },
  winnerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: SECTION_BG,
    padding: 10,
    borderRadius: 8,
  },
  winnerProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: WHITE,
    marginRight: 8,
  },
  profileImagePlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 8,
  },
  winnerNameContainer: {
    flex: 1,
  },
  winnerName: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  winnerUsername: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  winnerAmountContainer: {
    alignItems: "flex-end",
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: SUCCESS_COLOR,
  },
  winnerAmountLabel: {
    fontSize: 9,
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  winnerAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: SUCCESS_COLOR,
  },
  prizeDetailsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  prizeDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIZE_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    flex: 1,
  },
  prizeDetailText: {
    fontSize: 11,
    color: TEXT_DARK,
    fontWeight: "500",
    flex: 1,
  },
  ticketPreviewContainer: {
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: SECTION_BG,
    padding: 10,
    borderRadius: 8,
  },
  ticketPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  ticketPreviewTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  ticketWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // Ticket grid styles - Now properly sized
  ticket: {
    backgroundColor: WHITE,
    padding: TICKET_PADDING,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'center',
    width: TICKET_CONTAINER_WIDTH, // Fixed width based on screen percentage
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
    color: WHITE,
  },
  timeAgoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
    paddingTop: 4,
  },
  timeAgoText: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: WHITE,
    borderRadius: 16,
    width: "100%",
    maxWidth: 380,
    maxHeight: "80%",
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
    padding: 12,
    backgroundColor: BACKGROUND_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  modalTitleContainer: {
    flex: 1,
  },
  ticketNumberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    alignSelf: 'flex-start',
  },
  ticketNumberBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  modalContent: {
    padding: 12,
    maxHeight: 450,
  },
  modalWinnerInfo: {
    marginBottom: 12,
  },
  modalProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: WHITE,
    marginRight: 10,
  },
  modalProfileImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginRight: 10,
  },
  modalUserInfo: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  modalUserUsername: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  modalPrizeInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  modalPrizeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  modalPrizeText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_DARK,
    flex: 1,
  },
  modalPrizeAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: SUCCESS_COLOR,
    textAlign: "center",
  },
  modalPatternInfo: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    padding: 10,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    flexWrap: 'wrap',
  },
  modalPatternItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modalPatternText: {
    fontSize: 11,
    color: TEXT_DARK,
    fontWeight: "500",
  },
  modalTicketSection: {
    marginBottom: 12,
    alignItems: 'center',
  },
  modalTicketTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 8,
    textAlign: "center",
  },
  modalTicketContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
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
  modalCloseButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "600",
  },
  refreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    gap: 4,
  },
  refreshHintText: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontStyle: "italic",
  },
});

export default HostGameWinners;
// HostCalledNumbers.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
// Calculate size based on 10 items per row with proper spacing
const CELL_SIZE = Math.min((width - 40) / 10 - 4, 36); // Reduced padding and size

// Color scheme matching UserCalledNumbers
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
const ACTIVE_ORANGE = "#ff9800"; // Orange for active state

const HostCalledNumbers = ({ navigation, route }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);

  useEffect(() => {
    fetchGameStatus();
  }, []);

  const fetchGameStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("hostToken");
      
      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}/number-calling/status`,
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
        setCalledNumbers(data.numbers.called_numbers || []);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching game status:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch called numbers");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGameStatus();
    setRefreshing(false);
  };

  const showNumberDetails = (number) => {
    setSelectedNumber(number);
    setModalVisible(true);
  };

  const getNumberPosition = (number) => {
    const index = calledNumbers.indexOf(number);
    return index !== -1 ? index + 1 : null;
  };

  const renderNumberGrid = () => {
    const rows = [];
    
    // Create rows of 10 numbers each (1-90)
    for (let row = 0; row < 9; row++) {
      const rowNumbers = [];
      for (let col = 1; col <= 10; col++) {
        const number = row * 10 + col;
        const isCalled = calledNumbers.includes(number);
        const position = getNumberPosition(number);
        
        rowNumbers.push(
          <TouchableOpacity
            key={number}
            style={[
              styles.numberCell,
              isCalled && styles.calledNumberCell,
            ]}
            onPress={() => showNumberDetails(number)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.numberText,
              isCalled && styles.calledNumberText,
            ]}>
              {number}
            </Text>
            {isCalled && (
              <View style={styles.calledBadge}>
                <Text style={styles.calledBadgeText}>#{position}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      }
      
      rows.push(
        <View key={row} style={styles.numberRow}>
          {rowNumbers}
        </View>
      );
    }

    return (
      <View style={styles.numberGrid}>
        {rows}
      </View>
    );
  };

  const NumberModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={TEXT_LIGHT} />
              </TouchableOpacity>

              <View style={styles.modalNumberContainer}>
                <View style={[
                  styles.modalNumberCircle,
                  calledNumbers.includes(selectedNumber) 
                    ? styles.modalNumberCalled
                    : styles.modalNumberNotCalled
                ]}>
                  <Text style={styles.modalNumber}>
                    {selectedNumber}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.modalTitle}>
                {calledNumbers.includes(selectedNumber) 
                  ? 'Number Called!' 
                  : 'Not Called Yet'}
              </Text>
              
              <View style={styles.modalStats}>
                {calledNumbers.includes(selectedNumber) ? (
                  <>
                    <View style={styles.modalStat}>
                      <Ionicons name="list" size={20} color={PRIMARY_COLOR} />
                      <Text style={styles.modalStatLabel}>Position</Text>
                      <Text style={styles.modalStatValue}>
                        #{calledNumbers.indexOf(selectedNumber) + 1}
                      </Text>
                    </View>
                    
                    <View style={styles.modalStatDivider} />
                    
                    <View style={styles.modalStat}>
                      <Ionicons name="stats-chart" size={20} color={SUCCESS_COLOR} />
                      <Text style={styles.modalStatLabel}>Progress</Text>
                      <Text style={styles.modalStatValue}>
                        {calledNumbers.length}/90
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.modalStat}>
                    <Ionicons name="alert-circle" size={20} color={ERROR_COLOR} />
                    <Text style={styles.modalStatLabel}>Status</Text>
                    <Text style={styles.modalStatValue}>Not Called</Text>
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalActionButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading called numbers...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={WHITE} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{gameName}</Text>
              <Text style={styles.gameCode}>
                {calledNumbers.length}/90 Numbers Called
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchGameStatus}
            >
              <Ionicons name="refresh" size={20} color={WHITE} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY_COLOR}
              colors={[PRIMARY_COLOR]}
            />
          }
        >
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={20} color={SUCCESS_COLOR} />
              <Text style={styles.statValue}>{calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Called</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="timer-outline" size={20} color={ACCENT_COLOR} />
              <Text style={styles.statValue}>{90 - calledNumbers.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="pie-chart" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.statValue}>
                {((calledNumbers.length / 90) * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(calledNumbers.length / 90) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Game Status Badge */}
          {gameStatus && (
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: gameStatus.status === 'live' ? '#4CAF5015' : '#FF980015' }
              ]}>
                <Ionicons 
                  name={gameStatus.status === 'live' ? 'radio' : 'pause-circle'} 
                  size={14} 
                  color={gameStatus.status === 'live' ? SUCCESS_COLOR : ACCENT_COLOR} 
                />
                <Text style={[
                  styles.statusText,
                  { color: gameStatus.status === 'live' ? SUCCESS_COLOR : ACCENT_COLOR }
                ]}>
                  {gameStatus.status?.toUpperCase() || 'LOADING'}
                </Text>
              </View>
            </View>
          )}

          {/* All Numbers Grid Section */}
          <View style={styles.numbersSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="grid" size={18} color={ACCENT_COLOR} />
                <Text style={styles.sectionTitle}>All Numbers (1-90)</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>
                  {calledNumbers.length}/90
                </Text>
              </View>
            </View>
            
            <Text style={styles.sectionDescription}>
              Tap on any number to view details. Green cells show called numbers with position.
            </Text>
            
            {renderNumberGrid()}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color={WHITE} />
              <Text style={styles.actionButtonText}>Back to Game</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                if (calledNumbers.length > 0) {
                  showNumberDetails(calledNumbers[calledNumbers.length - 1]);
                }
              }}
            >
              <Ionicons name="megaphone" size={18} color={WHITE} />
              <Text style={styles.actionButtonText}>Last Called</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Space */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>

      <NumberModal />
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
  scrollContent: {
    padding: 10,
  },
  // Header Styles
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: -0.5,
  },
  gameCode: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    marginTop: 2,
  },
  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 5,
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  // Progress Bar
  progressContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: BORDER_COLOR,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  // Status Badge
  statusContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },
  // Numbers Section
  numbersSection: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  sectionDescription: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginBottom: 12,
    lineHeight: 16,
  },
  sectionBadge: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: WHITE,
  },
  // Number Grid
  numberGrid: {
    gap: 4,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 4,
  },
  numberCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    position: 'relative',
  },
  calledNumberCell: {
    backgroundColor: SUCCESS_COLOR,
    borderColor: SUCCESS_COLOR,
  },
  numberText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_DARK,
  },
  calledNumberText: {
    color: WHITE,
    fontWeight: "700",
  },
  calledBadge: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  calledBadgeText: {
    fontSize: 6,
    color: WHITE,
    fontWeight: '700',
  },
  // Actions Container
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: ACCENT_COLOR,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: WHITE,
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
    width: "100%",
    maxWidth: 300,
  },
  modalCloseArea: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalNumberContainer: {
    marginBottom: 15,
    marginTop: 10,
  },
  modalNumberCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalNumberCalled: {
    backgroundColor: SUCCESS_COLOR,
  },
  modalNumberNotCalled: {
    backgroundColor: ERROR_COLOR,
  },
  modalNumber: {
    fontSize: 42,
    fontWeight: "900",
    color: WHITE,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 15,
  },
  modalStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 15,
    padding: 12,
    width: "100%",
  },
  modalStat: {
    flex: 1,
    alignItems: "center",
  },
  modalStatDivider: {
    width: 1,
    height: 25,
    backgroundColor: BORDER_COLOR,
    marginHorizontal: 10,
  },
  modalStatLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    marginTop: 2,
    marginBottom: 1,
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  modalActionButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    width: "100%",
  },
  modalActionButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: TEXT_LIGHT,
  },
});

export default HostCalledNumbers;
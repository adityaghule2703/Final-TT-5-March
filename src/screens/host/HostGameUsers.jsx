import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

// Updated color palette to match other components
const PRIMARY_COLOR = "#4facfe";
const ACCENT_COLOR = "#ff9800";
const BACKGROUND_COLOR = "#f5f8ff";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const SUCCESS_COLOR = "#4CAF50";
const ERROR_COLOR = "#E74C3C";
const WARNING_COLOR = "#FF9800";
const INFO_COLOR = "#4facfe";
const SECTION_BG = "#F8F9FA";

// Payment status colors
const PAYMENT_STATUS = {
  paid: { bg: "rgba(76, 175, 80, 0.1)", text: SUCCESS_COLOR, icon: "checkmark-circle" },
  pending: { bg: "rgba(255, 152, 0, 0.1)", text: WARNING_COLOR, icon: "time-outline" },
  failed: { bg: "rgba(231, 76, 60, 0.1)", text: ERROR_COLOR, icon: "close-circle" },
  default: { bg: "rgba(96, 125, 139, 0.1)", text: "#607D8B", icon: "help-circle-outline" },
};

const HostGameUsers = ({ route, navigation }) => {
  const { gameId, gameName } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);

  // Animation values
  const [spinAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    fetchGameUsers();
    startAnimations();
  }, [gameId]);

  const startAnimations = () => {
    // Rotating animation for decorative elements
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for summary cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGameUsers();
    setRefreshing(false);
  };

  const fetchGameUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("hostToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/game/${gameId}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setSummary(response.data.summary);
        setUsers(response.data.users || []);
        setError(null);
      } else {
        throw new Error("Failed to fetch game users");
      }
    } catch (error) {
      console.log("Error fetching game users:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusStyle = (status) => {
    return PAYMENT_STATUS[status] || PAYMENT_STATUS.default;
  };

  const renderUserCard = (user) => {
    const statusStyle = getPaymentStatusStyle(user.payment_status);
    
    return (
      <View key={user.user_id} style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={[styles.userAvatar, { backgroundColor: PRIMARY_COLOR }]}>
            <Text style={styles.avatarText}>
              {user.user_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.user_name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <View style={styles.userContactRow}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={12} color={TEXT_LIGHT} />
                <Text style={styles.contactText}>{user.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={12} color={TEXT_LIGHT} />
                <Text style={styles.contactText}>{user.mobile}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.paymentBadge, { backgroundColor: statusStyle.bg }]}>
            <Ionicons name={statusStyle.icon} size={12} color={statusStyle.text} />
            <Text style={[styles.paymentText, { color: statusStyle.text }]}>
              {user.payment_status.charAt(0).toUpperCase() + user.payment_status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Stats Grid - 2x2 Layout */}
        <View style={styles.statsGrid}>
          {/* Row 1 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
                <Ionicons name="receipt-outline" size={18} color={ERROR_COLOR} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{user.total_requests}</Text>
                <Text style={styles.statLabel}>Requests</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <Ionicons name="ticket-outline" size={18} color="#9C27B0" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{user.total_tickets_requested}</Text>
                <Text style={styles.statLabel}>Requested</Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="checkmark-circle-outline" size={18} color={SUCCESS_COLOR} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{user.approved_tickets}</Text>
                <Text style={styles.statLabel}>Approved</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <Ionicons name="cash-outline" size={18} color={WARNING_COLOR} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>₹{user.paid_amount}</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Amount Summary */}
        <View style={styles.amountRow}>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Approved Amount</Text>
            <View style={styles.amountValueContainer}>
              <Ionicons name="cash-outline" size={14} color={TEXT_DARK} />
              <Text style={styles.amountValue}>₹{user.total_amount_approved}</Text>
            </View>
          </View>
          
          <View style={styles.amountDivider} />
          
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Paid Amount</Text>
            <View style={styles.amountValueContainer}>
              <Ionicons name="checkmark-circle" size={14} color={statusStyle.text} />
              <Text style={[styles.amountValue, { color: statusStyle.text }]}>
                ₹{user.paid_amount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconWrapper}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialIcons name="people" size={40} color={PRIMARY_COLOR} />
          </Animated.View>
        </View>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading players list...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIconWrapper}>
            <Ionicons name="alert-circle" size={60} color={ERROR_COLOR} />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Players</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchGameUsers}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      {/* Decorative background elements */}
      <View style={styles.backgroundPattern}>
        <Animated.View style={[styles.decorCircle1, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.decorCircle2, { transform: [{ rotate: spin }] }]} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerPattern}>
          <Animated.View style={[styles.headerShine]} />
        </View>

        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {gameName}
            </Text>
            <Text style={styles.headerSubtitle}>Players List</Text>
          </View>
          
          <TouchableOpacity style={styles.refreshButton} onPress={fetchGameUsers}>
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
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
        {summary && (
          <Animated.View style={[styles.summaryContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.summaryHeader}>
              <Ionicons name="stats-chart" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.summaryTitle}>Game Summary</Text>
            </View>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(79, 172, 254, 0.1)' }]}>
                  <Ionicons name="people-outline" size={24} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.summaryCount}>{summary.total_users}</Text>
                <Text style={styles.summaryLabel}>Total Players</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                  <Ionicons name="ticket-outline" size={24} color="#9C27B0" />
                </View>
                <Text style={styles.summaryCount}>{summary.total_approved_tickets}</Text>
                <Text style={styles.summaryLabel}>Approved Tickets</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                  <Ionicons name="cash-outline" size={24} color={SUCCESS_COLOR} />
                </View>
                <Text style={styles.summaryCount}>₹{summary.total_paid_amount}</Text>
                <Text style={styles.summaryLabel}>Total Revenue</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                  <Ionicons name="stats-chart-outline" size={24} color={WARNING_COLOR} />
                </View>
                <Text style={styles.summaryCount}>{summary.average_tickets_per_user}</Text>
                <Text style={styles.summaryLabel}>Avg/Player</Text>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={styles.listHeader}>
          <View style={styles.listHeaderLeft}>
            <View style={styles.listIconContainer}>
              <Ionicons name="list-outline" size={18} color={PRIMARY_COLOR} />
            </View>
            <Text style={styles.listTitle}>Players ({users.length})</Text>
          </View>
          
          {/* <TouchableOpacity
            style={styles.exportButton}
            onPress={() => {
              // TODO: Implement export functionality
              alert("Export feature coming soon!");
            }}
          >
            <Ionicons name="download-outline" size={16} color={PRIMARY_COLOR} />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.usersContainer}>
          {users.length > 0 ? (
            <>
              {users.map(renderUserCard)}
              <View style={styles.listFooter}>
                <Ionicons name="checkmark-circle" size={16} color={SUCCESS_COLOR} />
                <Text style={styles.listFooterText}>
                  {users.length} player{users.length !== 1 ? "s" : ""} found
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <Ionicons name="people-outline" size={70} color={BORDER_COLOR} />
              </View>
              <Text style={styles.emptyStateTitle}>No Players Yet</Text>
              <Text style={styles.emptyStateText}>
                No players have joined this game yet. Share the game code with players to get started.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={fetchGameUsers}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#FFF" />
                <Text style={styles.emptyStateButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
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
  },
  scrollContent: {
    paddingBottom: 40,
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
  decorCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 152, 0, 0.1)',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
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
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(79, 172, 254, 0.2)",
  },
  loadingSpinner: {
    marginTop: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    padding: 40,
  },
  errorContent: {
    alignItems: "center",
  },
  errorIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 300,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: (width - 40 - 12) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_DARK,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    fontWeight: "500",
    textAlign: "center",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  listHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79, 172, 254, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  exportButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY_COLOR,
  },
  usersContainer: {
    marginBottom: 40,
  },
  userCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "500",
    marginBottom: 4,
  },
  userContactRow: {
    flexDirection: "row",
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contactText: {
    fontSize: 11,
    color: TEXT_LIGHT,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  paymentText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsGrid: {
    gap: 8,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SECTION_BG,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: TEXT_LIGHT,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  amountItem: {
    flex: 1,
    alignItems: "center",
  },
  amountDivider: {
    width: 1,
    height: 30,
    backgroundColor: BORDER_COLOR,
    marginHorizontal: 12,
  },
  amountLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  amountValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SECTION_BG,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 300,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  listFooterText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  bottomSpace: {
    height: 20,
  },
});

export default HostGameUsers;
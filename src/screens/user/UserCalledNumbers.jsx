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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const CELL_SIZE = Math.min((width - 40) / 10 - 4, 36);

const PRIMARY_COLOR = "#4facfe";
const ACCENT_COLOR = "#ff9800";
const BACKGROUND_COLOR = "#f5f8ff";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";

const UserCalledNumbers = ({ navigation, route }) => {
  const { calledNumbers } = route.params;

  const renderNumberGrid = () => {
    const rows = [];
    
    for (let row = 0; row < 9; row++) {
      const rowNumbers = [];
      for (let col = 1; col <= 10; col++) {
        const number = row * 10 + col;
        const isCalled = calledNumbers.includes(number);
        
        rowNumbers.push(
          <TouchableOpacity
            key={number}
            style={[
              styles.numberCell,
              isCalled && styles.calledNumberCell,
            ]}
            disabled={true}
            activeOpacity={1}
          >
            <Text style={[
              styles.numberText,
              isCalled && styles.calledNumberText,
            ]}>
              {number}
            </Text>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

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
              <Text style={styles.headerTitle}>Called Numbers</Text>
              <Text style={styles.gameCode}>
                {calledNumbers.length}/90 Numbers Called
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
            
            {renderNumberGrid()}
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
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
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
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
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    overflow: 'hidden',
  },
  calledNumberCell: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
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
  bottomSpace: {
    height: 20,
  },
});

export default UserCalledNumbers;
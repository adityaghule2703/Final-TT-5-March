import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const TICKET_WIDTH = Math.min(width, height) - 100;
const CELL_SIZE = (TICKET_WIDTH - 60) / 9;

const HostGamePatterns = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [patterns, setPatterns] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredPatterns, setFilteredPatterns] = useState([]);
  const [ticketCache, setTicketCache] = useState({});

  const filters = [
    { id: 'all', label: 'All Patterns' },
    { id: 'position_based', label: 'Position Based' },
    { id: 'count_based', label: 'Count Based' },
    { id: 'all_numbers', label: 'All Numbers' },
    { id: 'row_complete', label: 'Row Complete' },
    { id: 'number_based', label: 'Number Based' },
    { id: 'number_range', label: 'Number Range' },
  ];

  useEffect(() => {
    fetchPatterns();
  }, []);

  useEffect(() => {
    filterPatterns();
  }, [patterns, selectedFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatterns();
    setRefreshing(false);
  };

  // Sort patterns by specific sequence (same as UserGamePatterns)
  const sortPatternsBySequence = (patternsData) => {
    const patternSequence = [
      { keywords: ['top line', 'top_line', 'topline', 'top-line'] },
      { keywords: ['middle line', 'middle_line', 'middleline', 'middle-line'] },
      { keywords: ['bottom line', 'bottom_line', 'bottomline', 'bottom-line'] },
      { keywords: ['breakfast'] },
      { keywords: ['lunch'] },
      { keywords: ['dinner'] },
      { keywords: ['four corners', 'four_corners', '4 corners', '4_corners', 'fourcorners'] },
      { keywords: ['bamboo'] },
      { keywords: ['early five', 'early_five', 'early 5', 'early_5', 'earlyfive'] },
      { keywords: ['non claimers', 'non_claimers', 'nonclaimers', 'non-claimers'] },
      { keywords: ['full house', 'full_house', 'fullhouse'] },
    ];

    const getPatternIndex = (pattern) => {
      // Normalize: lowercase and replace underscores/hyphens with spaces for matching
      const rawName = (pattern.display_name || pattern.pattern_name || '').toLowerCase();
      const normalizedName = rawName.replace(/[-_]/g, ' ');

      for (let i = 0; i < patternSequence.length; i++) {
        if (patternSequence[i].keywords.some(keyword => {
          const normalizedKeyword = keyword.replace(/[-_]/g, ' ');
          return normalizedName.includes(normalizedKeyword);
        })) {
          return i;
        }
      }
      return patternSequence.length; // Put unknown patterns at the end
    };

    return [...patternsData].sort((a, b) => {
      const aIndex = getPatternIndex(a);
      const bIndex = getPatternIndex(b);
      return aIndex - bIndex;
    });
  };

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        'https://tambolatime.co.in/public/api/host/patterns/available',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data.status) {
        const patternsData = response.data.data || [];
        // Sort patterns by sequence before setting state
        const sortedPatterns = sortPatternsBySequence(patternsData);
        setPatterns(sortedPatterns);
        setError(null);
      } else {
        throw new Error('Failed to fetch patterns');
      }
    } catch (error) {
      console.log('Error fetching patterns:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load patterns');
    } finally {
      setLoading(false);
    }
  };

  const filterPatterns = () => {
    let filtered = [...patterns];
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(pattern => pattern.logic_type === selectedFilter);
    }
    
    setFilteredPatterns(filtered);
  };

  // Updated function with all 11 specific Tambola patterns (matching UserGamePatterns)
 // Updated function with exact pattern names from API
const getPatternIcon = (pattern) => {
  const patternName = pattern.pattern_name.toLowerCase();
  
  switch (patternName) {
    case 'top_line':
      return 'arrow-up'; // ↑ (Ionicons)
    
    case 'middle_line':
      return 'arrow-left-right'; // ↔ (MaterialCommunityIcons)
    
    case 'bottom_line':
      return 'arrow-down'; // ↓ (Ionicons)
    
    case 'breakfast':
      return 'cafe'; // ☕ (Ionicons)
    
    case 'lunch':
      return 'food'; // 🍔 (MaterialCommunityIcons)
    
    case 'dinner':
      return 'restaurant'; // 🍽️ (Ionicons)
    
    case 'four_corners':
      return 'apps'; // ▦ (MaterialCommunityIcons)
    
    case 'bamboo':
      return 'leaf'; // 🍃 (MaterialCommunityIcons)
    
    case 'early_five':
      return 'numeric-5-circle'; // ⑤ (MaterialCommunityIcons)
    
    case 'non_claimers':
      return 'close-circle'; // ⭕ (Ionicons)
    
    case 'full_house':
      return 'home'; // 🏠 (Ionicons)
    
    default:
      // Default based on logic type
      switch (pattern.logic_type) {
        case 'position_based':
          return 'grid';
        case 'count_based':
          return 'counter';
        case 'all_numbers':
          return 'check-all';
        case 'row_complete':
          return 'format-line-weight';
        case 'number_based':
          return 'calculator';
        case 'number_range':
          return 'filter';
        default:
          return 'ticket-confirmation';
      }
  }
};

  // Helper function to render the appropriate icon
  const renderIcon = (iconName, size, color) => {
    // Icons that should use Ionicons
    const ioniconsIcons = [
      'arrow-down', 'arrow-up', 'cafe', 'restaurant', 'home', 
      'close-circle', 'calculator', 'grid'
    ];
    
    if (ioniconsIcons.includes(iconName)) {
      return <Ionicons name={iconName} size={size} color={color} />;
    } else {
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    }
  };

  // Generate valid tambola ticket with exactly 5 numbers per row
  const generateValidTicketNumbers = () => {
    const ticket = Array(3).fill().map(() => Array(9).fill(null));
    const numbersUsed = new Set();
    const numbersByColumn = Array(9).fill().map(() => []);
    
    // Generate numbers for each column (1-3 numbers per column)
    for (let col = 0; col < 9; col++) {
      const min = col === 0 ? 1 : col * 10 + 1;
      const max = col === 8 ? 90 : (col + 1) * 10;
      const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 numbers per column
      
      while (numbersByColumn[col].length < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbersUsed.has(num)) {
          numbersByColumn[col].push(num);
          numbersUsed.add(num);
        }
      }
      numbersByColumn[col].sort((a, b) => a - b);
    }
    
    // Adjust to ensure exactly 15 numbers total
    let totalNumbers = numbersByColumn.reduce((sum, col) => sum + col.length, 0);
    
    // Add numbers if less than 15
    while (totalNumbers < 15) {
      const col = Math.floor(Math.random() * 9);
      if (numbersByColumn[col].length < 3) {
        const min = col === 0 ? 1 : col * 10 + 1;
        const max = col === 8 ? 90 : (col + 1) * 10;
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbersUsed.has(num)) {
          numbersByColumn[col].push(num);
          numbersUsed.add(num);
          numbersByColumn[col].sort((a, b) => a - b);
          totalNumbers++;
        }
      }
    }
    
    // Remove numbers if more than 15
    while (totalNumbers > 15) {
      const col = Math.floor(Math.random() * 9);
      if (numbersByColumn[col].length > 1) {
        const removed = numbersByColumn[col].pop();
        numbersUsed.delete(removed);
        totalNumbers--;
      }
    }
    
    // Place numbers in rows ensuring exactly 5 numbers per row
    const rowCounts = [0, 0, 0];
    
    // First, distribute numbers randomly
    for (let col = 0; col < 9; col++) {
      for (let num of numbersByColumn[col]) {
        // Find available rows for this column
        const availableRows = [];
        for (let row = 0; row < 3; row++) {
          if (ticket[row][col] === null && rowCounts[row] < 5) {
            availableRows.push(row);
          }
        }
        
        if (availableRows.length > 0) {
          const randomRow = availableRows[Math.floor(Math.random() * availableRows.length)];
          ticket[randomRow][col] = num;
          rowCounts[randomRow]++;
        }
      }
    }
    
    // Adjust to ensure exactly 5 numbers per row
    for (let row = 0; row < 3; row++) {
      while (rowCounts[row] < 5) {
        // Find a column with less than 3 numbers and this row is empty
        for (let col = 0; col < 9; col++) {
          if (ticket[row][col] === null) {
            const columnCount = ticket.reduce((sum, r) => sum + (r[col] !== null ? 1 : 0), 0);
            if (columnCount < 3) {
              // Add a new number
              const min = col === 0 ? 1 : col * 10 + 1;
              const max = col === 8 ? 90 : (col + 1) * 10;
              let newNum;
              do {
                newNum = Math.floor(Math.random() * (max - min + 1)) + min;
              } while (numbersUsed.has(newNum));
              
              ticket[row][col] = newNum;
              numbersUsed.add(newNum);
              rowCounts[row]++;
              break;
            }
          }
        }
      }
      
      while (rowCounts[row] > 5) {
        // Move a number to another row
        for (let col = 0; col < 9; col++) {
          if (ticket[row][col] !== null) {
            // Find another row that needs this number
            for (let otherRow = 0; otherRow < 3; otherRow++) {
              if (otherRow !== row && rowCounts[otherRow] < 5 && ticket[otherRow][col] === null) {
                ticket[otherRow][col] = ticket[row][col];
                ticket[row][col] = null;
                rowCounts[row]--;
                rowCounts[otherRow]++;
                break;
              }
            }
            if (rowCounts[row] <= 5) break;
          }
        }
      }
    }
    
    return ticket;
  };

  // Generate ticket for a specific pattern
  const generateTicketForPattern = (pattern) => {
    const cacheKey = pattern.id;
    
    if (ticketCache[cacheKey]) {
      return ticketCache[cacheKey];
    }
    
    const ticket = generateValidTicketNumbers();
    
    // Cache the ticket
    setTicketCache(prev => ({
      ...prev,
      [cacheKey]: ticket
    }));
    
    return ticket;
  };

  // Get pattern positions relative to actual numbers in each row
  const getPatternPositionsForTicket = (ticket, pattern) => {
    if (pattern.logic_type !== 'position_based' || !pattern.positions) {
      return null;
    }
    
    const patternGrid = Array(3).fill().map(() => Array(9).fill(false));
    
    pattern.positions.forEach(pos => {
      const row = pos.row - 1;
      const patternPosition = pos.position; // This is position among actual numbers (1-5)
      
      if (row >= 0 && row < 3) {
        // Find the column that has the patternPosition-th number in this row
        let numberCount = 0;
        for (let col = 0; col < 9; col++) {
          if (ticket[row][col] !== null) {
            numberCount++;
            if (numberCount === patternPosition) {
              patternGrid[row][col] = true;
              break;
            }
          }
        }
      }
    });
    
    return patternGrid;
  };

  const getPatternColor = (logicType) => {
    switch (logicType) {
      case 'position_based':
        return '#3498db';
      case 'count_based':
        return '#FF9800';
      case 'all_numbers':
        return '#4CAF50';
      case 'row_complete':
        return '#9C27B0';
      case 'number_based':
        return '#F44336';
      case 'number_range':
        return '#607D8B';
      default:
        return '#666';
    }
  };

  const formatPatternName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatLogicType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderPatternCard = (pattern) => {
    const isPositionBased = pattern.logic_type === 'position_based';
    const ticketNumbers = generateTicketForPattern(pattern);
    const patternGrid = isPositionBased ? getPatternPositionsForTicket(ticketNumbers, pattern) : null;
    const iconName = getPatternIcon(pattern);
    const color = getPatternColor(pattern.logic_type);
    
    return (
      <TouchableOpacity
        key={pattern.id}
        style={styles.patternCard}
        onPress={() => {
          setSelectedPattern(pattern);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.patternHeader}>
          <View style={[styles.patternIcon, { backgroundColor: color + '20' }]}>
            {renderIcon(iconName, 24, color)}
          </View>
          <View style={styles.patternInfo}>
            <Text style={styles.patternName} numberOfLines={1}>
              {formatPatternName(pattern.pattern_name)}
            </Text>
            <View style={styles.patternMeta}>
              <View style={[
                styles.typeBadge,
                { backgroundColor: color + '20' }
              ]}>
                <Text style={[
                  styles.typeText,
                  { color: color }
                ]}>
                  {formatLogicType(pattern.logic_type)}
                </Text>
              </View>
              {isPositionBased && pattern.positions?.length > 0 && (
                <View style={styles.positionsBadge}>
                  <MaterialCommunityIcons name="grid" size={12} color="#666" />
                  <Text style={styles.positionsText}>
                    {pattern.positions.length} positions
                  </Text>
                </View>
              )}
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
        </View>
        
        <Text style={styles.patternDescription} numberOfLines={2}>
          {pattern.description}
        </Text>
        
        {isPositionBased && pattern.positions?.length > 0 && (
          <View style={styles.miniTicketContainer}>
            <MiniTicketGrid 
              numbers={ticketNumbers} 
              patternGrid={patternGrid} 
            />
            <View style={styles.positionExplanation}>
              <Text style={styles.positionExplanationText}>
                Positions are relative to actual numbers in each row
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const MiniTicketGrid = ({ numbers, patternGrid }) => {
    return (
      <View style={styles.miniTicket}>
        {numbers.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.miniRow}>
            {row.map((cell, colIndex) => (
              <View 
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.miniCell,
                  cell !== null && styles.miniCellWithNumber,
                  patternGrid && patternGrid[rowIndex][colIndex] && styles.miniCellPattern
                ]}
              >
                {cell !== null && (
                  <Text style={[
                    styles.miniCellNumber,
                    patternGrid && patternGrid[rowIndex][colIndex] && styles.miniCellNumberPattern
                  ]}>
                    {cell}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const FullTicketGrid = ({ pattern }) => {
    const ticketNumbers = generateTicketForPattern(pattern);
    const patternGrid = pattern.positions ? getPatternPositionsForTicket(ticketNumbers, pattern) : null;
    
    return (
      <View style={styles.fullTicketContainer}>
        <Text style={styles.ticketTitle}>Pattern Visualization</Text>
        <Text style={styles.ticketSubtitle}>
          Positions are highlighted relative to actual numbers in each row
        </Text>
        
        <View style={styles.fullTicket}>
          {ticketNumbers.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.fullRow}>
              {row.map((cell, colIndex) => (
                <View 
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.fullCell,
                    cell !== null && styles.fullCellWithNumber,
                    patternGrid && patternGrid[rowIndex][colIndex] && styles.fullCellPattern
                  ]}
                >
                  {cell !== null && (
                    <>
                      <Text style={[
                        styles.fullCellNumber,
                        patternGrid && patternGrid[rowIndex][colIndex] && styles.fullCellNumberPattern
                      ]}>
                        {cell}
                      </Text>
                      {patternGrid && patternGrid[rowIndex][colIndex] && (
                        <View style={styles.positionIndicator}>
                          <Text style={styles.positionIndicatorText}>
                            {getPositionNumber(ticketNumbers[rowIndex], colIndex)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.positionExplanation}>
          <Text style={styles.positionExplanationText}>
            Example: "Position 3" in Row 2 means the 3rd actual number from left in that row
          </Text>
        </View>
        
        <View style={styles.ticketLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorPattern]} />
            <Text style={styles.legendText}>Pattern Position</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorNormal]} />
            <Text style={styles.legendText}>Normal Number</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendColorEmpty]} />
            <Text style={styles.legendText}>Empty Cell</Text>
          </View>
        </View>
      </View>
    );
  };

  // Helper to get position number (1-5) for a column in a row
  const getPositionNumber = (row, column) => {
    let position = 0;
    for (let col = 0; col <= column; col++) {
      if (row[col] !== null) {
        position++;
      }
    }
    return position;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7675" />
        <Text style={styles.loadingText}>Loading patterns...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={60} color="#F44336" />
          <Text style={styles.errorTitle}>Patterns Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPatterns}>
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FF7675" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tambola Patterns</Text>
        <Text style={styles.headerSubtitle}>Explore available patterns for your games</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF7675" />
        }
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredPatterns.length} {filteredPatterns.length === 1 ? 'pattern' : 'patterns'} found
          </Text>
          {selectedFilter !== 'all' && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSelectedFilter('all')}
            >
              <Ionicons name="close-circle" size={16} color="#FF7675" />
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.patternsContainer}>
          {filteredPatterns.length > 0 ? (
            filteredPatterns.map(renderPatternCard)
          ) : patterns.length > 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="search-outline" size={60} color="#CCC" />
              <Text style={styles.emptyStateTitle}>No Patterns Found</Text>
              <Text style={styles.emptyStateText}>
                Try changing the filter
              </Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="grid-outline" size={60} color="#CCC" />
              <Text style={styles.emptyStateTitle}>No Patterns Available</Text>
              <Text style={styles.emptyStateText}>
                Patterns will be available soon
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            {selectedPattern && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={styles.modalTitleRow}>
                      <View style={[
                        styles.modalIcon,
                        { backgroundColor: getPatternColor(selectedPattern.logic_type) + '20' }
                      ]}>
                        {renderIcon(
                          getPatternIcon(selectedPattern), 
                          24, 
                          getPatternColor(selectedPattern.logic_type)
                        )}
                      </View>
                      <Text style={styles.modalTitle} numberOfLines={2}>
                        {formatPatternName(selectedPattern.pattern_name)}
                      </Text>
                    </View>
                    <View style={[
                      styles.modalTypeBadge,
                      { backgroundColor: getPatternColor(selectedPattern.logic_type) + '20' }
                    ]}>
                      <Text style={[
                        styles.modalTypeText,
                        { color: getPatternColor(selectedPattern.logic_type) }
                      ]}>
                        {formatLogicType(selectedPattern.logic_type)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalBody}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <View style={styles.descriptionSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                      {selectedPattern.description}
                    </Text>
                  </View>

                  {selectedPattern.logic_type === 'position_based' && selectedPattern.positions?.length > 0 && (
                    <>
                      <View style={styles.positionsSection}>
                        <FullTicketGrid pattern={selectedPattern} />
                      </View>
                      
                      <View style={styles.positionsList}>
                        <Text style={styles.sectionTitle}>Pattern Positions</Text>
                        {selectedPattern.positions.map((pos, index) => (
                          <View key={index} style={styles.positionItem}>
                            <View style={[styles.positionBadge, { backgroundColor: '#FF7675' }]}>
                              <Text style={styles.positionBadgeText}>
                                {pos.row}-{pos.position}
                              </Text>
                            </View>
                            <Text style={styles.positionText}>
                              Row {pos.row}, Position {pos.position} (from left)
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {selectedPattern.logic_type !== 'position_based' && (
                    <View style={styles.infoCard}>
                      <View style={styles.infoHeader}>
                        <Ionicons name="information-circle" size={20} color="#FF7675" />
                        <Text style={styles.infoTitle}>How it works</Text>
                      </View>
                      <Text style={styles.infoText}>
                        This pattern is based on {selectedPattern.logic_type.replace('_', ' ')} logic.
                        Players win when they match the specified criteria.
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.modalBottomSpace} />
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.usePatternButton}
                    onPress={() => {
                      setModalVisible(false);
                      // Add your pattern selection logic here
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={styles.usePatternButtonText}>Use This Pattern</Text>
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
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 30,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7675',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FF7675',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  filtersContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF7675',
    borderColor: '#FF7675',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF7675',
  },
  patternsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  patternCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patternIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF7675',
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  patternMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF7675',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  positionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  positionsText: {
    fontSize: 10,
    color: '#666',
  },
  patternDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  miniTicketContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  miniTicket: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  miniRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'center',
  },
  miniCell: {
    width: 28,
    height: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  miniCellWithNumber: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF7675',
  },
  miniCellPattern: {
    backgroundColor: '#FFEDED',
    borderWidth: 2,
    borderColor: '#FF7675',
  },
  miniCellNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  miniCellNumberPattern: {
    color: '#FF5252',
    fontWeight: '800',
  },
  positionExplanation: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  positionExplanationText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    minHeight: '50%',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF7675',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    flex: 1,
  },
  modalTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF7675',
  },
  modalTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  positionsSection: {
    marginBottom: 20,
  },
  fullTicketContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  ticketSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  fullTicket: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: TICKET_WIDTH,
    alignSelf: 'center',
  },
  fullRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  fullCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fullCellWithNumber: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF7675',
  },
  fullCellPattern: {
    backgroundColor: '#FFEDED',
    borderWidth: 2,
    borderColor: '#FF7675',
  },
  fullCellNumber: {
    fontSize: CELL_SIZE * 0.3,
    fontWeight: '600',
    color: '#2C3E50',
  },
  fullCellNumberPattern: {
    color: '#FF5252',
    fontWeight: '800',
  },
  positionIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF7675',
    borderRadius: 6,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionIndicatorText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
  positionsList: {
    marginBottom: 20,
  },
  positionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  positionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  positionBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  positionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  ticketLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  legendColorPattern: {
    backgroundColor: '#FFEDED',
    borderWidth: 2,
    borderColor: '#FF7675',
  },
  legendColorNormal: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF7675',
  },
  legendColorEmpty: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  usePatternButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7675',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  usePatternButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBottomSpace: {
    height: 20,
  },
});

export default HostGamePatterns;
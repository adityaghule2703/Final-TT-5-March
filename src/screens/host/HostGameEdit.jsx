import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const HostGameEdit = ({ navigation, route }) => {
  const { gameId } = route.params;
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  
  // Game Data
  const [gameData, setGameData] = useState(null);
  const [existingPatterns, setExistingPatterns] = useState([]);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  
  // Form States
  const [gameName, setGameName] = useState('');
  const [gameDate, setGameDate] = useState(new Date());
  const [gameStartTime, setGameStartTime] = useState(new Date());
  const [ticketRequestEndDate, setTicketRequestEndDate] = useState(new Date());
  const [ticketRequestEndTime, setTicketRequestEndTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [ticketType, setTicketType] = useState('paid');
  const [ticketCost, setTicketCost] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [maxTickets, setMaxTickets] = useState('');
  const [maxWinners, setMaxWinners] = useState('');
  
  // Pattern Management
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [patternRewards, setPatternRewards] = useState([]);
  
  // Reward Edit Modal States
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(null);
  const [rewardFormData, setRewardFormData] = useState({
    reward_name: '',
    description: '',
    amount: '',
    reward_count: '',
    min_tickets_required: '',
  });
  const [rewardErrors, setRewardErrors] = useState({});
  
  // New Pattern Modal States
  const [newPatternModal, setNewPatternModal] = useState(false);
  const [selectedNewPattern, setSelectedNewPattern] = useState(null);
  const [newPatternReward, setNewPatternReward] = useState({
    reward_name: '',
    description: '',
    amount: '',
    reward_count: '',
    min_tickets_required: '',
  });
  
  // Date/Time Pickers
  const [showGameDatePicker, setShowGameDatePicker] = useState(false);
  const [showGameTimePicker, setShowGameTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  useEffect(() => {
    fetchGameDetails();
    fetchGamePatterns();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/games/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('Game details response:', response.data);

      if (response.data.game || response.data.success) {
        const data = response.data.game || response.data.data || {};
        setGameData(data);
        
        setGameName(data.game_name || '');
        setMessage(data.message || '');
        setTicketType(data.ticket_type || 'paid');
        setTicketCost(data.ticket_cost?.toString() || '0');
        setMaxPlayers(data.max_players?.toString() || '100');
        setMaxTickets(data.max_tickets?.toString() || '200');
        setMaxWinners(data.max_winners?.toString() || '10');
        
        const addOneDay = (dateStr) => {
          if (!dateStr) return new Date();
          try {
            const [year, month, day] = dateStr.split('T')[0].split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            date.setDate(date.getDate() + 1);
            return date;
          } catch (error) {
            console.log('Error adding one day to date:', error);
            return new Date();
          }
        };
        
        try {
          if (data.game_date) {
            const date = addOneDay(data.game_date);
            setGameDate(date);
          }
          
          if (data.game_start_time) {
            const [hours, minutes] = data.game_start_time.split(':');
            const date = new Date(gameDate || new Date());
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            setGameStartTime(date);
          }
          
          if (data.ticket_request_end_date) {
            const date = addOneDay(data.ticket_request_end_date);
            setTicketRequestEndDate(date);
          }
          
          if (data.ticket_request_end_time) {
            const [hours, minutes] = data.ticket_request_end_time.split(':');
            const date = new Date(ticketRequestEndDate || new Date());
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            setTicketRequestEndTime(date);
          }
        } catch (dateError) {
          console.log('Error parsing dates:', dateError);
        }
        
        showToast('Game details loaded', 'success');
      } else {
        throw new Error(response.data.message || 'Failed to fetch game details');
      }
    } catch (error) {
      console.log('Error fetching game details:', error);
      showToast(error.message || 'Failed to load game details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGamePatterns = async () => {
    try {
      setLoadingPatterns(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `https://tambolatime.co.in/public/api/host/patterns/game/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      console.log('Full game patterns response:', JSON.stringify(response.data, null, 2));

      if (response.data.status || response.data.success) {
        const responseData = response.data.data || response.data;
        
        let patterns = [];
        if (responseData.patterns && Array.isArray(responseData.patterns)) {
          patterns = responseData.patterns;
          console.log('Found patterns array:', patterns.length);
        }
        
        setExistingPatterns(patterns);
        
        const rewards = patterns.map(pattern => {
          let rewardData = null;
          
          if (responseData.pattern_rewards && Array.isArray(responseData.pattern_rewards)) {
            rewardData = responseData.pattern_rewards.find(r => r.pattern_id === pattern.id);
          }
          
          if (!rewardData && pattern.pivot) {
            rewardData = {
              pattern_id: pattern.id,
              reward_name: pattern.pivot.reward_name,
              description: pattern.pivot.description,
              amount: pattern.pivot.amount,
              reward_count: pattern.pivot.reward_count,
              min_tickets_required: pattern.pivot.min_tickets_required
            };
          }
          
          return {
            pattern_id: pattern.id,
            pattern_name: pattern.pattern_name || pattern.name,
            pattern_description: pattern.description,
            reward_name: rewardData?.reward_name || (pattern.pattern_name || pattern.name || '').replace(/_/g, ' ') + ' Prize',
            description: rewardData?.description || pattern.description || '',
            amount: rewardData?.amount?.toString() || '100',
            reward_count: rewardData?.reward_count?.toString() || '1',
            min_tickets_required: rewardData?.min_tickets_required?.toString() || '1',
          };
        });
        
        console.log('Created rewards array:', JSON.stringify(rewards, null, 2));
        setPatternRewards(rewards);
      } else {
        throw new Error(response.data.message || 'Failed to fetch game patterns');
      }
    } catch (error) {
      console.log('Error fetching game patterns:', error);
      showToast(error.message || 'Failed to load game patterns', 'error');
    } finally {
      setLoadingPatterns(false);
    }
  };

  const fetchAvailablePatterns = async () => {
    try {
      setLoadingPatterns(true);
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

      console.log('Available patterns response:', JSON.stringify(response.data, null, 2));

      if (response.data.status || response.data.success) {
        const patternsData = response.data.data || [];
        const patterns = Array.isArray(patternsData) ? patternsData : [];
        
        const existingPatternIds = existingPatterns.map(p => p.id);
        const available = patterns.filter(
          pattern => !existingPatternIds.includes(pattern.id)
        );
        setAvailablePatterns(available);
      } else {
        throw new Error(response.data.message || 'Failed to fetch available patterns');
      }
    } catch (error) {
      console.log('Error fetching available patterns:', error);
      showToast(error.message || 'Failed to load available patterns', 'error');
    } finally {
      setLoadingPatterns(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-IN', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const validateForm = () => {
    if (!gameName.trim()) {
      showToast('Please enter a game name', 'error');
      return false;
    }
    
    if (ticketType === 'paid' && (!ticketCost || parseFloat(ticketCost) <= 0)) {
      showToast('Please enter a valid ticket cost', 'error');
      return false;
    }
    
    if (!maxPlayers || parseInt(maxPlayers) <= 0) {
      showToast('Please enter a valid max players count', 'error');
      return false;
    }
    
    if (!maxTickets || parseInt(maxTickets) <= 0) {
      showToast('Please enter a valid max tickets count', 'error');
      return false;
    }
    
    if (!maxWinners || parseInt(maxWinners) <= 0) {
      showToast('Please enter a valid max winners count', 'error');
      return false;
    }
    
    return true;
  };

  const updateGame = async () => {
    if (!validateForm()) return;

    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formatDateForAPI = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const gameUpdateData = {
        game_name: gameName.trim(),
        game_date: formatDateForAPI(gameDate),
        game_start_time: gameStartTime.toTimeString().split(' ')[0].substring(0, 5),
        ticket_request_end_date: formatDateForAPI(ticketRequestEndDate),
        ticket_request_end_time: ticketRequestEndTime.toTimeString().split(' ')[0].substring(0, 5),
        message: message.trim(),
        ticket_type: ticketType,
        ticket_cost: ticketType === 'paid' ? parseFloat(ticketCost) : 0,
        max_players: parseInt(maxPlayers),
        max_tickets: parseInt(maxTickets),
        max_winners: parseInt(maxWinners),
      };

      const response = await axios.put(
        `https://tambolatime.co.in/public/api/host/games/${gameId}`,
        gameUpdateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status || response.data.success) {
        showToast('Game updated successfully!', 'success');
        setTimeout(() => {
          navigation.navigate('HostTabs');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to update game');
      }
    } catch (error) {
      console.log('Error updating game:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to update game', 'error');
      setTimeout(() => {
        navigation.navigate('HostTabs');
      }, 1500);
    } finally {
      setUpdating(false);
    }
  };

  const updatePatternRewards = async () => {
    if (patternRewards.length === 0) {
      showToast('No pattern rewards to update', 'error');
      return;
    }

    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const rewardsToUpdate = patternRewards.map(reward => {
        const amount = parseFloat(reward.amount);
        const rewardCount = parseInt(reward.reward_count);
        const minTickets = parseInt(reward.min_tickets_required);
        
        if (isNaN(amount) || amount <= 0) {
          throw new Error(`Invalid amount for pattern ${reward.pattern_id}: ${reward.amount}`);
        }
        
        if (isNaN(rewardCount) || rewardCount <= 0) {
          throw new Error(`Invalid reward count for pattern ${reward.pattern_id}: ${reward.reward_count}`);
        }
        
        if (isNaN(minTickets) || minTickets <= 0) {
          throw new Error(`Invalid min tickets for pattern ${reward.pattern_id}: ${reward.min_tickets_required}`);
        }
        
        return {
          pattern_id: reward.pattern_id,
          reward_name: reward.reward_name.trim(),
          description: reward.description || reward.pattern_description || '',
          amount: amount,
          reward_count: rewardCount,
          min_tickets_required: minTickets
        };
      });

      const response = await axios.put(
        `https://tambolatime.co.in/public/api/host/patterns/game/${gameId}/update-rewards`,
        { pattern_rewards: rewardsToUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      if (response.data.status || response.data.success) {
        showToast('Pattern rewards updated successfully!', 'success');
        await fetchGamePatterns();
        setTimeout(() => {
          navigation.navigate('HostTabs');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to update pattern rewards');
      }
    } catch (error) {
      console.log('Error updating pattern rewards:', error);
      
      let errorMessage = 'Failed to update pattern rewards';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
        
        if (error.response.data?.errors) {
          const validationErrors = Object.values(error.response.data.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showToast(errorMessage, 'error');
      setTimeout(() => {
        navigation.navigate('HostTabs');
      }, 1500);
    } finally {
      setUpdating(false);
    }
  };

  // Open reward edit modal
  const openRewardEditModal = (pattern) => {
    const reward = patternRewards.find(r => r.pattern_id === pattern.id);
    
    if (reward) {
      setRewardFormData({
        reward_name: reward.reward_name,
        description: reward.description || '',
        amount: reward.amount,
        reward_count: reward.reward_count,
        min_tickets_required: reward.min_tickets_required
      });
    }
    
    setCurrentPattern(pattern);
    setRewardModalVisible(true);
    setRewardErrors({});
  };

  // Save reward from modal
  const saveRewardFromModal = () => {
    // Validate
    const errors = {};
    
    if (!rewardFormData.reward_name || !rewardFormData.reward_name.trim()) {
      errors.reward_name = 'Reward name is required';
    }
    
    if (!rewardFormData.amount || parseFloat(rewardFormData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!rewardFormData.reward_count || parseInt(rewardFormData.reward_count) <= 0) {
      errors.reward_count = 'Reward count must be greater than 0';
    }
    
    if (!rewardFormData.min_tickets_required || parseInt(rewardFormData.min_tickets_required) <= 0) {
      errors.min_tickets_required = 'Minimum tickets required must be greater than 0';
    }
    
    if (Object.keys(errors).length > 0) {
      setRewardErrors(errors);
      return;
    }
    
    // Update pattern rewards
    setPatternRewards(prev => 
      prev.map(reward => 
        reward.pattern_id === currentPattern.id 
          ? {
              ...reward,
              reward_name: rewardFormData.reward_name.trim(),
              description: rewardFormData.description.trim(),
              amount: rewardFormData.amount,
              reward_count: rewardFormData.reward_count,
              min_tickets_required: rewardFormData.min_tickets_required
            }
          : reward
      )
    );
    
    setRewardModalVisible(false);
    showToast('Reward updated successfully!', 'success');
  };

  const addNewPattern = async () => {
    if (!selectedNewPattern) {
      showToast('Please select a pattern', 'error');
      return;
    }

    if (!newPatternReward.reward_name.trim() || 
        !newPatternReward.amount || 
        !newPatternReward.reward_count || 
        !newPatternReward.min_tickets_required) {
      showToast('Please fill all reward details', 'error');
      return;
    }

    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem('hostToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const patternData = {
        pattern_id: selectedNewPattern.id,
        reward_name: newPatternReward.reward_name.trim(),
        description: newPatternReward.description || selectedNewPattern.description,
        amount: parseFloat(newPatternReward.amount),
        reward_count: parseInt(newPatternReward.reward_count),
        min_tickets_required: parseInt(newPatternReward.min_tickets_required)
      };

      const response = await axios.post(
        `https://tambolatime.co.in/public/api/host/patterns/game/${gameId}/add-single`,
        patternData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status || response.data.success) {
        showToast('Pattern added successfully!', 'success');
        setNewPatternModal(false);
        resetNewPatternForm();
        fetchGamePatterns();
        fetchAvailablePatterns();
      } else {
        throw new Error(response.data.message || 'Failed to add pattern');
      }
    } catch (error) {
      console.log('Error adding pattern:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to add pattern', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const removePattern = async (patternId) => {
    Alert.alert(
      'Remove Pattern',
      'Are you sure you want to remove this pattern from the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              const token = await AsyncStorage.getItem('hostToken');
              
              if (!token) {
                throw new Error('No authentication token found');
              }

              const response = await axios.delete(
                `https://tambolatime.co.in/public/api/host/patterns/game/${gameId}/remove`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  data: { pattern_id: patternId }
                }
              );

              if (response.data.status || response.data.success) {
                showToast('Pattern removed successfully!', 'success');
                fetchGamePatterns();
                fetchAvailablePatterns();
              } else {
                throw new Error(response.data.message || 'Failed to remove pattern');
              }
            } catch (error) {
              console.log('Error removing pattern:', error);
              showToast(error.response?.data?.message || error.message || 'Failed to remove pattern', 'error');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const resetNewPatternForm = () => {
    setSelectedNewPattern(null);
    setNewPatternReward({
      reward_name: '',
      description: '',
      amount: '',
      reward_count: '',
      min_tickets_required: '',
    });
  };

  const openNewPatternModal = () => {
    fetchAvailablePatterns();
    setNewPatternModal(true);
  };

  const handlePatternSelect = (pattern) => {
    setSelectedNewPattern(pattern);
    setNewPatternReward(prev => ({
      ...prev,
      reward_name: (pattern.pattern_name || pattern.name || '').replace(/_/g, ' ') + ' Prize',
      description: pattern.description || '',
      amount: '100',
      reward_count: '1',
      min_tickets_required: '1'
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const Toast = () => {
    if (!toast.visible) return null;
    
    const backgroundColor = toast.type === 'success' ? '#4CAF50' : '#FF6B6B';
    
    useEffect(() => {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <View style={[styles.toast, { backgroundColor }]}>
        <Ionicons 
          name={toast.type === 'success' ? 'checkmark-circle' : 'alert-circle'} 
          size={20} 
          color="#FFF" 
        />
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
    );
  };

  const getPatternIcon = useCallback((pattern) => {
    if (!pattern) return 'ticket-confirmation';
    
    const patternName = (pattern.pattern_name || pattern.name || '').toLowerCase();
    
    switch (patternName) {
      case 'top_line':
        return 'arrow-up';
      case 'middle_line':
        return 'arrow-left-right';
      case 'bottom_line':
        return 'arrow-down';
      case 'breakfast':
        return 'cafe';
      case 'lunch':
        return 'food';
      case 'dinner':
        return 'restaurant';
      case 'four_corners':
        return 'apps';
      case 'bamboo':
        return 'leaf';
      case 'early_five':
        return 'numeric-5-circle';
      case 'non_claimers':
        return 'close-circle';
      case 'full_house':
        return 'home';
      default:
        const logicType = (pattern.logic_type || '').toLowerCase();
        switch (logicType) {
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
  }, []);

  const renderPatternIcon = useCallback((iconName, size, color) => {
    const ioniconsIcons = [
      'arrow-down', 'arrow-up', 'cafe', 'restaurant', 'home', 
      'close-circle', 'calculator', 'grid'
    ];
    
    if (ioniconsIcons.includes(iconName)) {
      return <Ionicons name={iconName} size={size} color={color} />;
    } else {
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    }
  }, []);

  const getPatternColor = (logicType) => {
    if (!logicType) return '#666';
    
    switch (logicType.toLowerCase()) {
      case 'position_based':
        return '#FF6B6B';
      case 'count_based':
        return '#FF9800';
      case 'all_numbers':
        return '#4CAF50';
      case 'row_complete':
        return '#9C27B0';
      case 'number_based':
        return '#2196F3';
      case 'number_range':
        return '#607D8B';
      default:
        return '#666';
    }
  };

  const renderPatternItem = ({ item }) => {
    const patternId = item.id;
    const reward = patternRewards.find(r => r.pattern_id === patternId);
    const iconName = getPatternIcon(item);
    const color = getPatternColor(item.logic_type);
    
    return (
      <View style={styles.patternItem}>
        <View style={styles.patternHeader}>
          <View style={styles.patternInfo}>
            <View style={[
              styles.patternIcon,
              { backgroundColor: color + '20' }
            ]}>
              {renderPatternIcon(iconName, 16, color)}
            </View>
            <View style={styles.patternText}>
              <Text style={styles.patternName} numberOfLines={1}>
                {(item.pattern_name || item.name || '').replace(/_/g, ' ')}
              </Text>
              <Text style={styles.patternType} numberOfLines={1}>
                {item.logic_type ? item.logic_type.replace(/_/g, ' ') : 'Unknown'}
              </Text>
            </View>
          </View>
          
          <View style={styles.patternActions}>
            <TouchableOpacity
              style={styles.editRewardButton}
              onPress={() => openRewardEditModal(item)}
            >
              <Ionicons name="pencil" size={14} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removePatternButton}
              onPress={() => removePattern(patternId)}
            >
              <Ionicons name="trash-outline" size={14} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </View>
        
        {reward && (
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{reward.reward_name}</Text>
            {reward.description && reward.description.trim() && (
              <Text style={styles.rewardDescription}>{reward.description}</Text>
            )}
            <View style={styles.rewardDetails}>
              <View style={styles.rewardDetail}>
                <MaterialIcons name="currency-rupee" size={12} color="#4CAF50" />
                <Text style={styles.rewardAmount}>₹{reward.amount}</Text>
              </View>
              <View style={styles.rewardDetail}>
                <Ionicons name="trophy" size={12} color="#FF9800" />
                <Text style={styles.rewardCount}>×{reward.reward_count}</Text>
              </View>
              <View style={styles.rewardDetail}>
                <Ionicons name="ticket" size={12} color="#2196F3" />
                <Text style={styles.rewardMinTickets}>
                  Min: {reward.min_tickets_required}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAvailablePatternItem = ({ item }) => {
    const isSelected = selectedNewPattern?.id === item.id;
    const iconName = getPatternIcon(item);
    const color = getPatternColor(item.logic_type);
    
    return (
      <TouchableOpacity
        style={[styles.availablePatternItem, isSelected && styles.availablePatternItemSelected]}
        onPress={() => handlePatternSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.availablePatternContent}>
          <View style={styles.availablePatternHeader}>
            <View style={[
              styles.availablePatternIcon,
              { backgroundColor: color + '20' }
            ]}>
              {renderPatternIcon(iconName, 14, color)}
            </View>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            ) : (
              <View style={styles.radioCircle} />
            )}
          </View>
          
          <Text style={styles.availablePatternName} numberOfLines={2}>
            {(item.pattern_name || item.name || '').replace(/_/g, ' ')}
          </Text>
          <Text style={styles.availablePatternDescription} numberOfLines={3}>
            {item.description || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#FF7675" barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7675" />
          <Text style={styles.loadingText}>Loading game details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FF7675" barStyle="light-content" />
      
      <Toast />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Edit Game</Text>
            <Text style={styles.headerSubtitle}>
              {gameName || 'Loading...'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#FFE6E6' }]}>
              <Ionicons name="information-circle" size={18} color="#FF7675" />
            </View>
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Game Name *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="game-controller" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={gameName}
                onChangeText={setGameName}
                placeholder="Enter game name"
                placeholderTextColor="#999"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Game Message (Optional)</Text>
            <View style={[styles.inputContainer, styles.messageInputContainer]}>
              <Ionicons 
                name="chatbubble" 
                size={18} 
                color="#666" 
                style={styles.messageInputIcon} 
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter a message for players..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#E6F0FF' }]}>
              <Ionicons name="time" size={18} color="#2196F3" />
            </View>
            <Text style={styles.sectionTitle}>Schedule</Text>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Game Date *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowGameDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.dateButtonText} numberOfLines={1}>
                  {formatDate(gameDate)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Start Time *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowGameTimePicker(true)}
              >
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.dateButtonText} numberOfLines={1}>
                  {formatTime(gameStartTime)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Ticket Request End *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.dateButtonText} numberOfLines={1}>
                  {formatDate(ticketRequestEndDate)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>End Time *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.dateButtonText} numberOfLines={1}>
                  {formatTime(ticketRequestEndTime)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Game Configuration */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#E6F7E9' }]}>
              <Ionicons name="settings" size={18} color="#4CAF50" />
            </View>
            <Text style={styles.sectionTitle}>Game Configuration</Text>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Ticket Type *</Text>
              <View style={styles.optionButtons}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    ticketType === 'free' && styles.optionButtonActive
                  ]}
                  onPress={() => setTicketType('free')}
                >
                  <Ionicons 
                    name="gift" 
                    size={14} 
                    color={ticketType === 'free' ? '#FFF' : '#666'} 
                  />
                  <Text style={[
                    styles.optionButtonText,
                    ticketType === 'free' && styles.optionButtonTextActive
                  ]}>
                    Free
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    ticketType === 'paid' && styles.optionButtonActive
                  ]}
                  onPress={() => setTicketType('paid')}
                >
                  <Ionicons 
                    name="cash" 
                    size={14} 
                    color={ticketType === 'paid' ? '#FFF' : '#666'} 
                  />
                  <Text style={[
                    styles.optionButtonText,
                    ticketType === 'paid' && styles.optionButtonTextActive
                  ]}>
                    Paid
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {ticketType === 'paid' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ticket Cost (₹) *</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="currency-rupee" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={ticketCost}
                  onChangeText={setTicketCost}
                  keyboardType="numeric"
                  placeholder="Enter ticket price"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          )}
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Max Players *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="people" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={maxPlayers}
                  onChangeText={setMaxPlayers}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Max Tickets *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="ticket" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={maxTickets}
                  onChangeText={setMaxTickets}
                  keyboardType="numeric"
                  placeholder="200"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Max Winners *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="trophy" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={maxWinners}
                onChangeText={setMaxWinners}
                keyboardType="numeric"
                placeholder="10"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Existing Patterns */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="grid" size={18} color="#9C27B0" />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Game Patterns</Text>
              <TouchableOpacity
                style={styles.addPatternButton}
                onPress={openNewPatternModal}
              >
                <Ionicons name="add-circle" size={16} color="#4CAF50" />
                <Text style={styles.addPatternText}>Add Pattern</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {loadingPatterns ? (
            <View style={styles.loadingPatterns}>
              <ActivityIndicator size="small" color="#FF7675" />
              <Text style={styles.loadingPatternsText}>Loading patterns...</Text>
            </View>
          ) : existingPatterns.length > 0 ? (
            <View style={styles.patternsList}>
              {existingPatterns.map((pattern, index) => (
                <React.Fragment key={pattern.id || `pattern-${index}`}>
                  {renderPatternItem({ item: pattern })}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={styles.noPatterns}>
              <MaterialCommunityIcons name="grid-outline" size={40} color="#CCC" />
              <Text style={styles.noPatternsText}>No patterns configured</Text>
              <Text style={styles.noPatternsSubtext}>
                Add patterns to create winning conditions
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.updateButtonDisabled]}
            onPress={updateGame}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="save" size={16} color="#FFF" />
                <Text style={styles.updateButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
          
          {existingPatterns.length > 0 && (
            <TouchableOpacity
              style={[styles.updateRewardsButton, updating && styles.updateRewardsButtonDisabled]}
              onPress={updatePatternRewards}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="refresh" size={16} color="#FFF" />
                  <Text style={styles.updateRewardsButtonText}>Update Rewards</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Reward Edit Modal */}
      <Modal
        visible={rewardModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRewardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Configure Reward for {currentPattern?.pattern_name?.replace(/_/g, ' ')}
              </Text>
              <TouchableOpacity 
                onPress={() => setRewardModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Reward Name *</Text>
                  <TextInput
                    style={[styles.modalInput, rewardErrors.reward_name && styles.modalInputError]}
                    value={rewardFormData.reward_name}
                    onChangeText={(text) => {
                      setRewardFormData({...rewardFormData, reward_name: text});
                      if (rewardErrors.reward_name) {
                        setRewardErrors({...rewardErrors, reward_name: null});
                      }
                    }}
                    placeholder="Enter reward name"
                    placeholderTextColor="#999"
                  />
                  {rewardErrors.reward_name && (
                    <Text style={styles.modalErrorText}>{rewardErrors.reward_name}</Text>
                  )}
                </View>
                
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Description (Optional)</Text>
                  <TextInput
                    style={[styles.modalInput, styles.modalTextArea]}
                    value={rewardFormData.description}
                    onChangeText={(text) => setRewardFormData({...rewardFormData, description: text})}
                    placeholder="Enter reward description"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                
                <View style={styles.modalRow}>
                  <View style={styles.modalHalfInput}>
                    <Text style={styles.modalInputLabel}>Amount (₹) *</Text>
                    <TextInput
                      style={[styles.modalInput, rewardErrors.amount && styles.modalInputError]}
                      value={rewardFormData.amount}
                      onChangeText={(text) => {
                        setRewardFormData({...rewardFormData, amount: text});
                        if (rewardErrors.amount) {
                          setRewardErrors({...rewardErrors, amount: null});
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#999"
                    />
                    {rewardErrors.amount && (
                      <Text style={styles.modalErrorText}>{rewardErrors.amount}</Text>
                    )}
                  </View>
                  
                  <View style={styles.modalHalfInput}>
                    <Text style={styles.modalInputLabel}>Reward Count *</Text>
                    <TextInput
                      style={[styles.modalInput, rewardErrors.reward_count && styles.modalInputError]}
                      value={rewardFormData.reward_count}
                      onChangeText={(text) => {
                        setRewardFormData({...rewardFormData, reward_count: text});
                        if (rewardErrors.reward_count) {
                          setRewardErrors({...rewardErrors, reward_count: null});
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor="#999"
                    />
                    {rewardErrors.reward_count && (
                      <Text style={styles.modalErrorText}>{rewardErrors.reward_count}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalInputLabel}>Minimum Tickets Required *</Text>
                  <TextInput
                    style={[styles.modalInput, rewardErrors.min_tickets_required && styles.modalInputError]}
                    value={rewardFormData.min_tickets_required}
                    onChangeText={(text) => {
                      setRewardFormData({...rewardFormData, min_tickets_required: text});
                      if (rewardErrors.min_tickets_required) {
                        setRewardErrors({...rewardErrors, min_tickets_required: null});
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#999"
                  />
                  {rewardErrors.min_tickets_required && (
                    <Text style={styles.modalErrorText}>{rewardErrors.min_tickets_required}</Text>
                  )}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setRewardModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={saveRewardFromModal}
              >
                <Text style={styles.modalSaveButtonText}>Save Reward</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Pattern Modal */}
      <Modal
        visible={newPatternModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setNewPatternModal(false);
          resetNewPatternForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pattern</Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => {
                  setNewPatternModal(false);
                  resetNewPatternForm();
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>Select Pattern</Text>
              
              {loadingPatterns ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#FF7675" />
                  <Text style={styles.modalLoadingText}>Loading patterns...</Text>
                </View>
              ) : availablePatterns.length > 0 ? (
                <FlatList
                  data={availablePatterns}
                  renderItem={renderAvailablePatternItem}
                  keyExtractor={item => item.id?.toString() || `pattern-${Math.random()}`}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.modalPatternsGrid}
                  contentContainerStyle={styles.modalPatternsContainer}
                />
              ) : (
                <View style={styles.noAvailablePatterns}>
                  <MaterialCommunityIcons name="grid-outline" size={40} color="#CCC" />
                  <Text style={styles.noAvailablePatternsText}>No available patterns</Text>
                  <Text style={styles.noAvailablePatternsSubtext}>
                    All patterns are already added to this game
                  </Text>
                </View>
              )}
              
              {selectedNewPattern && (
                <View style={styles.newPatternRewardForm}>
                  <Text style={styles.modalSectionTitle}>Configure Reward</Text>
                  
                  <View style={styles.modalInputGroup}>
                    <Text style={styles.modalInputLabel}>Reward Name *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={newPatternReward.reward_name}
                      onChangeText={(value) => setNewPatternReward(prev => ({ ...prev, reward_name: value }))}
                      placeholder="Enter reward name"
                    />
                  </View>
                  
                  <View style={styles.modalInputGroup}>
                    <Text style={styles.modalInputLabel}>Description</Text>
                    <TextInput
                      style={[styles.modalInput, styles.modalTextArea]}
                      value={newPatternReward.description}
                      onChangeText={(value) => setNewPatternReward(prev => ({ ...prev, description: value }))}
                      placeholder="Enter description"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  
                  <View style={styles.modalRow}>
                    <View style={styles.modalHalfInput}>
                      <Text style={styles.modalInputLabel}>Amount (₹) *</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={newPatternReward.amount}
                        onChangeText={(value) => setNewPatternReward(prev => ({ ...prev, amount: value }))}
                        keyboardType="numeric"
                        placeholder="100"
                      />
                    </View>
                    
                    <View style={styles.modalHalfInput}>
                      <Text style={styles.modalInputLabel}>Reward Count *</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={newPatternReward.reward_count}
                        onChangeText={(value) => setNewPatternReward(prev => ({ ...prev, reward_count: value }))}
                        keyboardType="numeric"
                        placeholder="1"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.modalInputGroup}>
                    <Text style={styles.modalInputLabel}>Min Tickets Required *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={newPatternReward.min_tickets_required}
                      onChangeText={(value) => setNewPatternReward(prev => ({ ...prev, min_tickets_required: value }))}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelModalButton, (!selectedNewPattern || updating) && styles.cancelModalButtonDisabled]}
                onPress={() => {
                  setNewPatternModal(false);
                  resetNewPatternForm();
                }}
                disabled={updating}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.addModalButton, (!selectedNewPattern || updating) && styles.addModalButtonDisabled]}
                onPress={addNewPattern}
                disabled={!selectedNewPattern || updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="add" size={16} color="#FFF" />
                    <Text style={styles.addModalButtonText}>Add Pattern</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date/Time Pickers */}
      {showGameDatePicker && (
        <DateTimePicker
          value={gameDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowGameDatePicker(false);
            if (date) {
              setGameDate(date);
            }
          }}
          minimumDate={new Date()}
        />
      )}
      
      {showGameTimePicker && (
        <DateTimePicker
          value={gameStartTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowGameTimePicker(false);
            if (date) setGameStartTime(date);
          }}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={ticketRequestEndDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) {
              setTicketRequestEndDate(date);
            }
          }}
          minimumDate={new Date()}
        />
      )}
      
      {showEndTimePicker && (
        <DateTimePicker
          value={ticketRequestEndTime}
          mode="time"
          display="default"
          onChange={(event, date) => {
            setShowEndTimePicker(false);
            if (date) setTicketRequestEndTime(date);
          }}
        />
      )}
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
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FF7675',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  addPatternButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  addPatternText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  messageInputContainer: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  messageInputIcon: {
    marginLeft: 12,
    marginTop: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  halfInput: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    minHeight: 46,
  },
  dateButtonText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    marginHorizontal: 6,
    textAlign: 'center',
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8FAFC',
  },
  optionButtonActive: {
    backgroundColor: '#FF7675',
    borderColor: '#FF7675',
  },
  optionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  optionButtonTextActive: {
    color: '#FFF',
  },
  patternsList: {
    marginTop: 8,
  },
  patternItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patternInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patternIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  patternText: {
    flex: 1,
  },
  patternName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  patternType: {
    fontSize: 10,
    color: '#666',
  },
  patternActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editRewardButton: {
    backgroundColor: '#F0F9F0',
    padding: 6,
    borderRadius: 8,
  },
  removePatternButton: {
    backgroundColor: '#FFE6E6',
    padding: 6,
    borderRadius: 8,
  },
  rewardInfo: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  rewardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    lineHeight: 14,
  },
  rewardDetails: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  rewardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardAmount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  rewardCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
  },
  rewardMinTickets: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2196F3',
  },
  loadingPatterns: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPatternsText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  noPatterns: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noPatternsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 4,
  },
  noPatternsSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  actionButtons: {
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7675',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#FF7675',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  updateRewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  updateRewardsButtonDisabled: {
    opacity: 0.7,
  },
  updateRewardsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpace: {
    height: 10,
  },
  // Reward Edit Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F8FAFC',
  },
  modalInputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  modalTextArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  modalHalfInput: {
    flex: 1,
  },
  modalErrorText: {
    fontSize: 10,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF7675',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#FF7675',
    fontSize: 14,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // New Pattern Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  closeModalButton: {
    padding: 4,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  modalPatternsContainer: {
    paddingBottom: 12,
  },
  modalPatternsGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  availablePatternItem: {
    width: (width - 80) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 110,
  },
  availablePatternItemSelected: {
    backgroundColor: '#F0F9F0',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  availablePatternContent: {
    flex: 1,
  },
  availablePatternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  availablePatternIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#999',
  },
  availablePatternName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
    lineHeight: 13,
    minHeight: 26,
  },
  availablePatternDescription: {
    fontSize: 9,
    color: '#666',
    lineHeight: 11,
    minHeight: 33,
  },
  modalLoadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  noAvailablePatterns: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noAvailablePatternsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 4,
  },
  noAvailablePatternsSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  newPatternRewardForm: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  cancelModalButtonDisabled: {
    opacity: 0.6,
  },
  cancelModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  addModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  addModalButtonDisabled: {
    opacity: 0.6,
  },
  addModalButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  toast: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
});

export default HostGameEdit;
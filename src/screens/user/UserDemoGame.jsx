import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Platform,
  FlatList,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Tts from "react-native-tts";
import Sound from "react-native-sound";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ── Single demo ticket (15 numbers, 5 per row, proper column ranges) ─────────
const DEMO_TICKET = {
  id: 1,
  ticket_number: "DEMO-001",
  ticket_data: [
    // Row 1 (Top row) - 5 numbers
    [
      { number: 5, is_marked: false, column: 0 },   // Column 1 (1-10)
      null,
      { number: 14, is_marked: false, column: 2 },  // Column 3 (21-30)
      { number: 27, is_marked: false, column: 3 },  // Column 4 (31-40)
      null,
      { number: 48, is_marked: false, column: 5 },  // Column 6 (51-60)
      null,
      null,
      { number: 82, is_marked: false, column: 8 },  // Column 9 (81-90)
    ],
    // Row 2 (Middle row) - 5 numbers
    [
      null,
      { number: 12, is_marked: false, column: 1 },  // Column 2 (11-20)
      null,
      { number: 32, is_marked: false, column: 3 },  // Column 4 (31-40)
      { number: 45, is_marked: false, column: 4 },  // Column 5 (41-50)
      null,
      { number: 65, is_marked: false, column: 6 },  // Column 7 (61-70)
      { number: 78, is_marked: false, column: 7 },  // Column 8 (71-80)
      null,
    ],
    // Row 3 (Bottom row) - 5 numbers
    [
      { number: 7, is_marked: false, column: 0 },   // Column 1 (1-10)
      null,
      { number: 23, is_marked: false, column: 2 },  // Column 3 (21-30)
      null,
      null,
      { number: 55, is_marked: false, column: 5 },  // Column 6 (51-60)
      null,
      { number: 74, is_marked: false, column: 7 },  // Column 8 (71-80)
      { number: 88, is_marked: false, column: 8 },  // Column 9 (81-90)
    ],
  ],
};

// ── All patterns ─────────────────────────────────────────────────────────
const DEMO_PATTERNS = [
  {
    id: 18,
    pattern_name: "bamboo",
    display_name: "Bamboo",
    description: "Bamboo - Center column positions",
    logic_type: "position_based",
    positions: [{ row: 1, position: 3 }, { row: 2, position: 3 }, { row: 3, position: 3 }],
    example: "Mark all numbers in the center column of your ticket.",
    how_to_win: "Mark specific positions on your ticket grid.",
    popular_rank: "Common",
    category: "position"
  },
  {
    id: 5,
    pattern_name: "bottom_line",
    display_name: "Bottom Line",
    description: "All numbers in the bottom row",
    logic_type: "row_complete",
    row_number: 3,
    positions: [],
    example: "Mark all 5 numbers in the bottom row of your ticket.",
    how_to_win: "Complete the entire bottom row on your ticket.",
    popular_rank: "Very Popular",
    category: "row"
  },
  {
    id: 19,
    pattern_name: "breakfast",
    display_name: "Breakfast",
    description: "Breakfast - Numbers 1-30",
    logic_type: "number_range",
    number_range: { min: 1, max: 30 },
    positions: [],
    example: "Mark any 5 numbers between 1-30.",
    how_to_win: "Mark numbers from a specific range on your ticket.",
    popular_rank: "Regular",
    category: "other"
  },
  {
    id: 42,
    pattern_name: "bullseye",
    display_name: "Bullseye",
    description: "Bullseye - Center position",
    logic_type: "position_based",
    positions: [{ row: 2, position: 3 }],
    example: "Mark the center number of your ticket.",
    how_to_win: "Mark the center number on your ticket.",
    popular_rank: "Regular",
    category: "bullseye"
  },
  {
    id: 21,
    pattern_name: "dinner",
    display_name: "Dinner",
    description: "Dinner - Numbers 61-90",
    logic_type: "number_range",
    number_range: { min: 61, max: 90 },
    positions: [],
    example: "Mark any 5 numbers between 61-90.",
    how_to_win: "Mark numbers from a specific range on your ticket.",
    popular_rank: "Regular",
    category: "other"
  },
  {
    id: 2,
    pattern_name: "early_five",
    display_name: "Early Five",
    description: "First five numbers claimed on your ticket",
    logic_type: "count_based",
    count: 5,
    positions: [],
    example: "Be the first to mark 5 numbers on your ticket.",
    how_to_win: "Mark the required count of numbers first.",
    popular_rank: "Very Popular",
    category: "other"
  },
  {
    id: 6,
    pattern_name: "four_corners",
    display_name: "Four Corners",
    description: "Four corners of the ticket",
    logic_type: "position_based",
    positions: [{ row: 1, position: 1 }, { row: 1, position: 5 }, { row: 3, position: 1 }, { row: 3, position: 5 }],
    example: "Mark the four corner numbers of your ticket.",
    how_to_win: "Mark specific positions on your ticket grid.",
    popular_rank: "Very Popular",
    category: "position"
  },
  {
    id: 1,
    pattern_name: "full_house",
    display_name: "Full House",
    description: "All 15 numbers in the ticket",
    logic_type: "all_numbers",
    positions: [],
    example: "Mark all 15 numbers on your ticket to win.",
    how_to_win: "Mark all required numbers on a single ticket.",
    popular_rank: "Very Popular",
    category: "full_house"
  },
  {
    id: 20,
    pattern_name: "lunch",
    display_name: "Lunch",
    description: "Lunch - Numbers 31-60",
    logic_type: "number_range",
    number_range: { min: 31, max: 60 },
    positions: [],
    example: "Mark any 5 numbers between 31-60.",
    how_to_win: "Mark numbers from a specific range on your ticket.",
    popular_rank: "Regular",
    category: "other"
  },
  {
    id: 4,
    pattern_name: "middle_line",
    display_name: "Middle Line",
    description: "All numbers in the middle row",
    logic_type: "row_complete",
    row_number: 2,
    positions: [],
    example: "Mark all 5 numbers in the middle row of your ticket.",
    how_to_win: "Complete the entire middle row on your ticket.",
    popular_rank: "Very Popular",
    category: "row"
  },
  {
    id: 40,
    pattern_name: "new_age",
    display_name: "New Age (1-45)",
    description: "New Age - All numbers from 1 to 45",
    logic_type: "number_range",
    number_range: { min: 1, max: 45 },
    positions: [],
    example: "Mark all numbers between 1-45 on your ticket.",
    how_to_win: "Mark numbers from a specific range on your ticket.",
    popular_rank: "Regular",
    category: "new_age"
  },
  // {
  //   id: 28,
  //   pattern_name: "non_claimers",
  //   display_name: "Non Claimers",
  //   description: "Non claimers get a chance to apply for full house",
  //   logic_type: "all_numbers",
  //   positions: [],
  //   example: "Complete the pattern on your ticket to win.",
  //   how_to_win: "Mark all required numbers on a single ticket.",
  //   popular_rank: "Regular",
  //   category: "other"
  // },
  {
    id: 41,
    pattern_name: "old_age",
    display_name: "Old Age (46-90)",
    description: "Old Age - All numbers from 46 to 90",
    logic_type: "number_range",
    number_range: { min: 46, max: 90 },
    positions: [],
    example: "Mark all numbers between 46-90 on your ticket.",
    how_to_win: "Mark numbers from a specific range on your ticket.",
    popular_rank: "Regular",
    category: "old_age"
  },
  {
    id: 3,
    pattern_name: "top_line",
    display_name: "Top Line",
    description: "All numbers in the top row",
    logic_type: "row_complete",
    row_number: 1,
    positions: [],
    example: "Mark all 5 numbers in the top row of your ticket.",
    how_to_win: "Complete the entire top row on your ticket.",
    popular_rank: "Very Popular",
    category: "row"
  },
];

// ── Layout ──────────────────────────────────────────────────────────────────
const NUM_COLUMNS = 9;
const CELL_MARGIN = 2;
const TICKET_PADDING = 8;
const HORIZONTAL_MARGIN = 10;
const CELL_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_MARGIN * 2 - TICKET_PADDING * 2 - CELL_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

// ── Colors ──────────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#4facfe",
  primaryGS: "#359df9",
  primaryGE: "#64d8f8",
  secondary: "#FDB800",
  secondaryGS: "#FDB800",
  secondaryGE: "#FF8C00",
  ticketBorder: "#fcca26",
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  warning: "#ff9800",
  warningGS: "#ff9800",
  warningGE: "#f57c00",
  red: "#EF4444",
  redGS: "#EF4444",
  redGE: "#DC2626",
  green: "#10B981",
  greenGS: "#10B981",
  greenGE: "#059669",
  orange: "#FF9800",
};

const ROW_COLOR_1 = "#f0f8ff";
const ROW_COLOR_2 = "#e6f3ff";
const FILLED_CELL_BG = "#62cff4";
const MARKED_CELL_BG = COLORS.red;
const MARKED_CELL_BORDER = "#C0392B";

// ── Pattern icon ─────────────────────────────────────────────────────────────
const getPatternIconName = (pattern) => {
  const n = (pattern.display_name || pattern.pattern_name || "").toLowerCase();
  if (n.includes("bamboo"))       return "leaf";
  if (n.includes("bottom"))       return "arrow-down-bold-box";
  if (n.includes("breakfast"))    return "coffee";
  if (n.includes("bullseye"))     return "bullseye";
  if (n.includes("dinner"))       return "silverware-fork-knife";
  if (n.includes("early"))        return "numeric-5-circle";
  if (n.includes("four") || n.includes("corner")) return "card-outline";
  if (n.includes("full"))         return "home";
  if (n.includes("lunch"))        return "food";
  if (n.includes("middle"))       return "minus-box";
  if (n.includes("new age"))      return "baby-face-outline";
  if (n.includes("non"))          return "close-circle-outline";
  if (n.includes("old age"))      return "human-cane";
  if (n.includes("top"))          return "arrow-up-bold-box";
  return "ticket-confirmation";
};

// ── TTS: speak number (same as UserGameRoom) ─────────────────────────────────
const getSingleDigitWord = (num) => {
  switch(num) {
    case 1: return 'one';
    case 2: return 'two';
    case 3: return 'three';
    case 4: return 'four';
    case 5: return 'five';
    case 6: return 'six';
    case 7: return 'seven';
    case 8: return 'eight';
    case 9: return 'nine';
    default: return 'zero';
  }
};

const getNumberName = (num) => {
  const numberNames = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
    16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
    21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
    26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
    31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
    36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
    41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
    46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
    51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
    56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
    61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
    66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
    71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
    76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
    81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
    86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety'
  };
  return numberNames[num] || num.toString();
};

const getNumberSpeechText = (number) => {
  const numStr = number.toString();
  let speechText = '';
  
  if (numStr.length === 1) {
    const digitWord = getSingleDigitWord(number);
    speechText = `Single digit ${digitWord}`;
  } else {
    const singleDigits = numStr.split('').map(digit => {
      switch(digit) {
        case '0': return 'zero';
        case '1': return 'one';
        case '2': return 'two';
        case '3': return 'three';
        case '4': return 'four';
        case '5': return 'five';
        case '6': return 'six';
        case '7': return 'seven';
        case '8': return 'eight';
        case '9': return 'nine';
        default: return digit;
      }
    }).join(' ');
    
    const fullNumberName = getNumberName(number);
    speechText = `Number ${singleDigits}. ${fullNumberName}`;
  }
  
  return speechText;
};

// ── Snackbar ─────────────────────────────────────────────────────────────────
const CustomSnackbar = ({ visible, message, type = "info" }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: visible ? 1 : 0, duration: 300, useNativeDriver: true }).start();
  }, [visible]);
  if (!visible) return null;
  const colors = {
    success: [COLORS.greenGS, COLORS.greenGE],
    error:   [COLORS.redGS,   COLORS.redGE],
    warning: [COLORS.warningGS, COLORS.warningGE],
    info:    [COLORS.primaryGS, COLORS.primaryGE],
  }[type] || [COLORS.primaryGS, COLORS.primaryGE];
  const iconName = { success:"checkmark-circle", error:"close-circle", warning:"warning", info:"information-circle" }[type] || "information-circle";
  return (
    <View style={s.snackbarWrap} pointerEvents="none">
      <Animated.View style={[s.snackbarBox, { transform: [{ translateY: anim.interpolate({ inputRange:[0,1], outputRange:[100,0] }) }] }]}>
        <LinearGradient colors={colors} start={{x:0,y:0}} end={{x:1,y:0}} style={s.snackbarGrad}>
          <Ionicons name={iconName} size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={s.snackbarText}>{message}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════════════
const UserDemoGame = ({ navigation }) => {
  const [calledNumbers, setCalledNumbers]         = useState([]);
  const [remainingNumbers, setRemainingNumbers]   = useState([]);
  const [ticket, setTicket]                       = useState(DEMO_TICKET);
  const [showPatternsModal, setShowPatternsModal] = useState(false);
  const [showClaimMenu, setShowClaimMenu]         = useState(false);
  const [showClaimsHistory, setShowClaimsHistory] = useState(false);
  const [snackbar, setSnackbar]                   = useState({ visible:false, message:"", type:"info" });
  const [claims, setClaims]                       = useState([]);
  const [wonPatterns, setWonPatterns]             = useState(new Set());
  const [showCelebration, setShowCelebration]     = useState(false);
  const [celebrationPattern, setCelebrationPattern] = useState(null);
  const [clickSound, setClickSound]               = useState(null);
  const [autoCallingActive, setAutoCallingActive] = useState(true);

  // Blinking
  const [blinkingCells, setBlinkingCells]         = useState([]);
  const blinkAnim                                 = useRef(new Animated.Value(0)).current;
  const blinkLoop                                 = useRef(null);
  const blinkTimeout                              = useRef(null);

  // Refs
  const calledNumbersRef = useRef([]);
  const claimsRef        = useRef([]);
  const ticketRef        = useRef(ticket);
  const wonPatternsRef   = useRef(wonPatterns);
  const autoCallRef      = useRef(null);
  const snackbarTimer    = useRef(null);

  // Celebration anims
  const celebOpacity    = useRef(new Animated.Value(0)).current;
  const celebScale      = useRef(new Animated.Value(0.5)).current;
  const celebTranslateY = useRef(new Animated.Value(50)).current;

  // Sync refs
  useEffect(() => { calledNumbersRef.current = calledNumbers; }, [calledNumbers]);
  useEffect(() => { claimsRef.current        = claims; },        [claims]);
  useEffect(() => { ticketRef.current        = ticket; },        [ticket]);
  useEffect(() => { wonPatternsRef.current   = wonPatterns; },   [wonPatterns]);

  // Initialize remaining numbers (1-90)
  useEffect(() => {
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    setRemainingNumbers(allNumbers);
  }, []);

  // Load click sound
  useEffect(() => {
    try {
      Sound.setCategory('Playback');
      const sound = new Sound(
        'https://www.orangefreesounds.com/wp-content/uploads/2017/01/Button-click-sound.mp3',
        null,
        (error) => {
          if (error) {
            console.log('Error loading sound:', error);
            return;
          }
          setClickSound(sound);
        }
      );
    } catch (error) {
      console.log('Error in loadSounds:', error);
    }
  }, []);

  // Play click sound
  const playClickSound = useCallback(() => {
    try {
      if (clickSound) {
        clickSound.play((success) => {
          if (!success) console.log('Sound playback failed');
        });
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }, [clickSound]);

  // Snackbar
  const showSnackbar = useCallback((message, type = "info") => {
    if (snackbarTimer.current) clearTimeout(snackbarTimer.current);
    setSnackbar({ visible:true, message, type });
    snackbarTimer.current = setTimeout(() => setSnackbar({ visible:false, message:"", type:"info" }), 3000);
  }, []);

  // Ticket helpers
  const processTicketData = (ticketData) => {
    const grid = Array(3).fill(null).map(() => Array(9).fill(null));
    ticketData.forEach((row, ri) => {
      if (Array.isArray(row)) {
        row.forEach(cell => {
          if (cell?.number != null) {
            const col = cell.column !== undefined ? cell.column : 0;
            grid[ri][col] = cell;
          }
        });
      }
    });
    return grid;
  };

  const getTicketNumbers = (td) => {
    const nums = [];
    processTicketData(td).forEach(row => row.forEach(cell => { if (cell?.number != null) nums.push(cell.number); }));
    return nums;
  };

  const getMarkedNumbers = (td) => {
    const nums = [];
    processTicketData(td).forEach(row => row.forEach(cell => { if (cell?.number != null && cell.is_marked) nums.push(cell.number); }));
    return nums;
  };

  // Pattern win checking
  const isPatternCompleted = useCallback((pattern, ticketData) => {
    const grid    = processTicketData(ticketData);
    const marked  = getMarkedNumbers(ticketData);
    const allNums = getTicketNumbers(ticketData);

    switch (pattern.logic_type) {
      case "row_complete": {
        const rowIdx = (pattern.row_number || 1) - 1;
        const rowNums = [];
        for (let c = 0; c < 9; c++) { if (grid[rowIdx][c]?.number != null) rowNums.push(grid[rowIdx][c].number); }
        return rowNums.length > 0 && rowNums.every(n => marked.includes(n));
      }
      case "count_based": {
        return marked.length >= (pattern.count || 5);
      }
      case "all_numbers": {
        return allNums.length > 0 && allNums.every(n => marked.includes(n));
      }
      case "position_based": {
        const positions = pattern.positions || [];
        if (positions.length === 0) return false;
        return positions.every(pos => {
          const rowIdx = pos.row - 1;
          let count = 0;
          for (let c = 0; c < 9; c++) {
            if (grid[rowIdx][c]?.number != null) {
              count++;
              if (count === pos.position) return marked.includes(grid[rowIdx][c].number);
            }
          }
          return false;
        });
      }
      case "number_range": {
        const { min, max } = pattern.number_range || {};
        if (min == null || max == null) return false;
        const inRange = allNums.filter(n => n >= min && n <= max);
        return inRange.length > 0 && inRange.every(n => marked.includes(n));
      }
      default: return false;
    }
  }, []);

  // Pattern cells for blinking
  const getPatternCells = useCallback((pattern, ticketData) => {
    const grid  = processTicketData(ticketData);
    const cells = [];
    switch (pattern.logic_type) {
      case "row_complete": {
        const ri = (pattern.row_number || 1) - 1;
        for (let c = 0; c < 9; c++) { if (grid[ri][c]?.number != null) cells.push({ row: ri, col: c }); }
        break;
      }
      case "count_based": {
        const allNums = [];
        for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
          const cell = grid[r][c];
          if (cell?.number != null) allNums.push({ number: cell.number, row: r, col: c });
        }
        allNums.sort((a, b) => {
          const ai = calledNumbersRef.current.indexOf(a.number);
          const bi = calledNumbersRef.current.indexOf(b.number);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
        allNums.slice(0, pattern.count || 5).forEach(n => cells.push({ row: n.row, col: n.col }));
        break;
      }
      case "all_numbers": {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { if (grid[r][c]?.number != null) cells.push({ row: r, col: c }); }
        break;
      }
      case "position_based": {
        (pattern.positions || []).forEach(pos => {
          const ri = pos.row - 1;
          let count = 0;
          for (let c = 0; c < 9; c++) {
            if (grid[ri][c]?.number != null) {
              count++;
              if (count === pos.position) { cells.push({ row: ri, col: c }); break; }
            }
          }
        });
        break;
      }
      case "number_range": {
        const { min, max } = pattern.number_range || {};
        if (min != null && max != null) {
          for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
            const cell = grid[r][c];
            if (cell?.number != null && cell.number >= min && cell.number <= max) cells.push({ row: r, col: c });
          }
        }
        break;
      }
      default: break;
    }
    return cells;
  }, []);

  // Blinking - FIXED: Properly stops after 6 seconds and cleans up
  const startBlinking = useCallback((pattern) => {
    // Stop any existing blinking first
    if (blinkLoop.current) {
      blinkLoop.current.stop();
      blinkLoop.current = null;
    }
    if (blinkTimeout.current) {
      clearTimeout(blinkTimeout.current);
      blinkTimeout.current = null;
    }
    
    // Reset animation value
    blinkAnim.setValue(0);

    // Get cells for this pattern
    const cells = getPatternCells(pattern, ticketRef.current.ticket_data);
    setBlinkingCells(cells);

    if (cells.length === 0) {
      showSnackbar(`No cells on your ticket match "${pattern.display_name}"`, "info");
      return;
    }

    // Create new blinking animation
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ])
    );
    
    blinkLoop.current = loop;
    loop.start();

    // Set timeout to stop blinking after 6 seconds
    blinkTimeout.current = setTimeout(() => {
      if (blinkLoop.current) {
        blinkLoop.current.stop();
        blinkLoop.current = null;
      }
      setBlinkingCells([]);
      blinkAnim.setValue(0);
      blinkTimeout.current = null;
    }, 6000);
  }, [blinkAnim, getPatternCells, showSnackbar]);

  // Celebration
  const stopCelebration = useCallback(() => {
    Animated.parallel([
      Animated.timing(celebOpacity,    { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(celebScale,      { toValue: 0.5, duration: 300, useNativeDriver: true }),
      Animated.timing(celebTranslateY, { toValue: 50, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowCelebration(false));
  }, [celebOpacity, celebScale, celebTranslateY]);

  const triggerCelebration = useCallback((pattern) => {
    setCelebrationPattern(pattern);
    celebOpacity.setValue(0); celebScale.setValue(0.5); celebTranslateY.setValue(50);
    setShowCelebration(true);
    Animated.parallel([
      Animated.timing(celebOpacity,    { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(celebScale,      { toValue: 1, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(celebTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
    setTimeout(() => stopCelebration(), 5000);
  }, [celebOpacity, celebScale, celebTranslateY, stopCelebration]);

  // After mark check
  const checkAfterMark = useCallback((updatedTicket) => {
    DEMO_PATTERNS.forEach(pattern => {
      if (wonPatternsRef.current.has(pattern.id)) return;
      if (isPatternCompleted(pattern, updatedTicket.ticket_data)) {
        setWonPatterns(prev => new Set([...prev, pattern.id]));
        showSnackbar(`🎉 "${pattern.display_name}" complete! Tap Claim to submit.`, "success");
      }
    });
    
    // Check if full house completed and stop auto calling
    const allMarked = getMarkedNumbers(updatedTicket.ticket_data).length === getTicketNumbers(updatedTicket.ticket_data).length;
    if (allMarked && autoCallingActive) {
      setAutoCallingActive(false);
      if (autoCallRef.current) {
        clearInterval(autoCallRef.current);
        autoCallRef.current = null;
      }
      showSnackbar("🎉 CONGRATULATIONS! You've marked all numbers! 🎉", "success");
      triggerCelebration({ display_name: "FULL HOUSE", description: "You marked all numbers on your ticket!" });
    }
  }, [isPatternCompleted, showSnackbar, autoCallingActive, triggerCelebration]);

  // Number click with sound
  const handleNumberClick = useCallback((cellNumber, isCurrentlyMarked) => {
    if (cellNumber == null) return;
    playClickSound();
    
    if (!calledNumbersRef.current.includes(cellNumber)) {
      showSnackbar(`⚠️ Number ${cellNumber} hasn't been called yet!`, "warning");
      return;
    }
    setTicket(prev => {
      const updated = {
        ...prev,
        ticket_data: prev.ticket_data.map(row =>
          row.map(cell => cell?.number === cellNumber ? { ...cell, is_marked: !isCurrentlyMarked } : cell)
        ),
      };
      setTimeout(() => checkAfterMark(updated), 0);
      return updated;
    });
  }, [playClickSound, showSnackbar, checkAfterMark]);

  // Claim
  const submitClaim = useCallback((pattern) => {
    if (!wonPatterns.has(pattern.id)) {
      showSnackbar(`⚠️ "${pattern.display_name}" not completed yet!`, "warning");
      return;
    }
    if (claimsRef.current.some(c => c.pattern_id === pattern.id)) {
      showSnackbar(`"${pattern.display_name}" already claimed!`, "info");
      return;
    }
    setClaims(prev => [...prev, {
      id: Date.now(),
      pattern_id: pattern.id,
      display_name: pattern.display_name,
      pattern_name: pattern.pattern_name,
      status: "approved",
      claimed_at: new Date().toLocaleString(),
    }]);
    showSnackbar(`🏆 "${pattern.display_name}" claim submitted!`, "success");
    setShowClaimMenu(false);
    triggerCelebration(pattern);
  }, [wonPatterns, showSnackbar, triggerCelebration]);

  // TTS
  const speakNumber = useCallback(async (n) => {
    try {
      try {
        await Tts.getInitStatus();
      } catch (e) {
        await Tts.setDefaultLanguage('en-US');
        await Tts.setDefaultRate(0.5);
      }
      
      const speechText = getNumberSpeechText(n);
      await Tts.speak(speechText);
    } catch (e) {
      console.log('TTS error:', e);
    }
  }, []);

  // Auto-calling with random numbers
  const startAutoCalling = useCallback(() => {
    if (autoCallRef.current) clearInterval(autoCallRef.current);
    
    autoCallRef.current = setInterval(() => {
      if (!autoCallingActive) {
        if (autoCallRef.current) {
          clearInterval(autoCallRef.current);
          autoCallRef.current = null;
        }
        return;
      }
      
      if (remainingNumbers.length === 0) {
        clearInterval(autoCallRef.current);
        autoCallRef.current = null;
        showSnackbar("All 90 numbers have been called!", "success");
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
      const randomNum = remainingNumbers[randomIndex];
      
      if (randomNum && !calledNumbersRef.current.includes(randomNum)) {
        setCalledNumbers(prev => [...prev, randomNum]);
        setRemainingNumbers(prev => prev.filter(n => n !== randomNum));
        speakNumber(randomNum);
        showSnackbar(`🎲 Number ${randomNum} called! Tap it on your ticket.`, "info");
      }
    }, 8000);
  }, [showSnackbar, speakNumber, autoCallingActive, remainingNumbers]);

  // Lifecycle - with proper cleanup for blinking
  useEffect(() => {
    if (remainingNumbers.length > 0) {
      startAutoCalling();
    }
    return () => {
      if (autoCallRef.current) clearInterval(autoCallRef.current);
      if (snackbarTimer.current) clearTimeout(snackbarTimer.current);
      // Clean up blinking
      if (blinkLoop.current) {
        blinkLoop.current.stop();
        blinkLoop.current = null;
      }
      if (blinkTimeout.current) {
        clearTimeout(blinkTimeout.current);
        blinkTimeout.current = null;
      }
      if (clickSound) clickSound.release();
    };
  }, [remainingNumbers.length]);

  // Render helpers
  const renderAllNumbers = () => {
    const rows = Array.from({ length: 9 }, (_, i) =>
      Array.from({ length: 10 }, (__, j) => i * 10 + j + 1).filter(n => n <= 90)
    );
    return (
      <View style={s.card}>
        <View style={{ flexDirection:"row", alignItems:"center", marginBottom:10, gap:6 }}>
          <View style={s.sectionIcon}><MaterialIcons name="format-list-numbered" size={16} color={COLORS.primary} /></View>
          <Text style={s.sectionTitle}>All Numbers (1–90)</Text>
          <View style={s.badge}><Text style={s.badgeText}>{calledNumbers.length}/90</Text></View>
          <View style={s.autoTag}>
            <Ionicons name="time" size={11} color={COLORS.primary} />
            <Text style={s.autoTagText}>8s</Text>
          </View>
        </View>
        {rows.map((row, ri) => (
          <View key={ri} style={s.numRow}>
            {row.map(number => {
              const isCalled = calledNumbers.includes(number);
              const isLatest = calledNumbers.length > 0 && number === calledNumbers[calledNumbers.length - 1];
              return (
                <View key={number} style={[s.numCell, isCalled && s.numCalled, isLatest && s.numLatest]}>
                  <Text style={[s.numText, isCalled && s.numTextCalled, isLatest && s.numTextLatest]}>{number}</Text>
                  {isLatest && <View style={s.starDot}><Ionicons name="star" size={7} color="#fff" /></View>}
                </View>
              );
            })}
          </View>
        ))}
        <View style={s.legend}>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:COLORS.surface,borderColor:COLORS.border,borderWidth:1}]}/><Text style={s.legendText}>Not Called</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:COLORS.green}]}/><Text style={s.legendText}>Called</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:COLORS.primary}]}/><Text style={s.legendText}>Latest</Text></View>
        </View>
      </View>
    );
  };

  const renderLastCalled = () => {
    const lastFive = [...calledNumbers].slice(-5).reverse();
    return (
      <View style={s.card}>
        {calledNumbers.length > 0 ? (
          <>
            <View style={{ flexDirection:"row", alignItems:"center", marginBottom:14, gap:6 }}>
              <View style={s.sectionIcon}><Ionicons name="megaphone" size={16} color={COLORS.primary} /></View>
              <Text style={s.sectionTitle}>Last Called Numbers</Text>
            </View>
            <View style={{ flexDirection:"row", justifyContent:"space-around" }}>
              {lastFive.map((num, i) => (
                <TouchableOpacity key={`lc-${num}-${i}`} onPress={() => speakNumber(num)}
                  style={[s.calledCircle, i===0 && s.calledCircleLatest]}>
                  <Text style={[s.calledCircleText, i===0 && s.calledCircleTextLatest]}>{num}</Text>
                  {i===0 && <View style={s.starBadge}><Ionicons name="star" size={8} color="#fff" /></View>}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.hintText}>Tap any number to hear it again</Text>
          </>
        ) : (
          <View style={{ alignItems:"center", paddingVertical:20 }}>
            <Ionicons name="hourglass-outline" size={32} color={COLORS.warning} />
            <Text style={{ fontSize:14, color:COLORS.warning, marginTop:10, fontStyle:"italic" }}>Waiting for first number...</Text>
            <Text style={s.hintText}>Numbers appear automatically every 8 seconds</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTicketGrid = () => {
    const grid = processTicketData(ticket.ticket_data);
    const blinkMap = {};
    blinkingCells.forEach(c => { blinkMap[`${c.row}-${c.col}`] = true; });

    return (
      <View style={{ alignSelf:"center", width: CELL_WIDTH*NUM_COLUMNS + CELL_MARGIN*2*NUM_COLUMNS }}>
        {grid.map((row, ri) => (
          <View key={ri} style={[{ flexDirection:"row" }, { backgroundColor: ri%2===0 ? ROW_COLOR_1 : ROW_COLOR_2 }]}>
            {row.map((cell, ci) => {
              const num    = cell?.number;
              const marked = cell?.is_marked || false;
              const empty  = num == null;
              const shouldBlink = blinkMap[`${ri}-${ci}`];
              const calledNotMarked = !empty && !marked && calledNumbers.includes(num);
              const bg     = empty ? "transparent" : marked ? MARKED_CELL_BG : FILLED_CELL_BG;
              const border = marked ? MARKED_CELL_BORDER : COLORS.primary;
              return (
                <TouchableOpacity key={`${ri}-${ci}`}
                  style={[s.cell,
                    { width:CELL_WIDTH, height:CELL_WIDTH, margin:CELL_MARGIN, backgroundColor:bg, borderColor:border },
                    shouldBlink && s.blinkBorder,
                    calledNotMarked && s.calledNotMarked,
                  ]}
                  onPress={() => handleNumberClick(num, marked)}
                  disabled={empty}
                >
                  {!empty && (
                    shouldBlink ? (
                      <Animated.View style={{
                        flex:1, justifyContent:"center", alignItems:"center", width:"100%", height:"100%",
                        backgroundColor: COLORS.warning,
                        opacity: blinkAnim,
                        transform: [{ scale: blinkAnim.interpolate({ inputRange:[0,1], outputRange:[0.8,1.2] }) }],
                      }}>
                        <Text style={[s.cellNumber, { color:"#fff" }]}>{num}</Text>
                      </Animated.View>
                    ) : (
                      <Text style={[s.cellNumber, { color:"#fff" }]}>{num}</Text>
                    )
                  )}
                  {calledNotMarked && !shouldBlink && <View style={s.pulseDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderTicketSection = () => {
    const markedCount = getMarkedNumbers(ticket.ticket_data).length;
    const totalCount  = getTicketNumbers(ticket.ticket_data).length;
    const claimedIds  = new Set(claims.map(c => c.pattern_id));

    return (
      <View style={{ marginBottom: 12 }}>
        <View style={s.ticketHeaderRow}>
          <View style={{ flexDirection:"row", alignItems:"center", gap:8, flex:1 }}>
            <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} style={s.ticketIconBox}>
              <MaterialIcons name="confirmation-number" size={16} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={s.ticketLabel}>Ticket #{ticket.ticket_number}</Text>
              <Text style={s.ticketStats}>Marked: {markedCount}/{totalCount}</Text>
            </View>
          </View>
          <View style={{ flexDirection:"row", gap:8 }}>
            
            <TouchableOpacity onPress={() => setShowClaimMenu(true)} style={{ borderRadius:12, overflow:"hidden" }}>
              <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.claimBtn}>
                <Ionicons name="trophy" size={14} color="#fff" />
                <Text style={s.claimBtnText}>Claim</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {wonPatterns.size > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:8, paddingLeft:4 }}>
            {[...wonPatterns].map(pid => {
              const p = DEMO_PATTERNS.find(x => x.id === pid);
              if (!p) return null;
              const claimed = claimedIds.has(pid);
              return (
                <View key={pid} style={[s.wonChip, claimed && s.wonChipClaimed]}>
                  <MaterialCommunityIcons name={getPatternIconName(p)} size={12} color={claimed ? "#fff" : COLORS.primary} />
                  <Text style={[s.wonChipText, claimed && { color:"#fff" }]}>{p.display_name}{claimed ? " ✓" : " 🎉"}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}

        <View style={s.ticketCard}>
          {renderTicketGrid()}
        </View>

        <View style={s.ticketLegendRow}>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:FILLED_CELL_BG}]}/><Text style={s.legendText}>Unmark</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:MARKED_CELL_BG}]}/><Text style={s.legendText}>Marked</Text></View>
          <View style={s.legendItem}><View style={[s.legendDot,{backgroundColor:COLORS.orange+"50",borderColor:COLORS.orange,borderWidth:1}]}/><Text style={s.legendText}>Called (tap to mark)</Text></View>
        </View>
      </View>
    );
  };

  // ── Patterns Modal ─────────────────────────────────────────────────────
  const renderPatternsModal = () => {
    const claimedIds = new Set(claims.map(c => c.pattern_id));
    return (
      <Modal transparent visible={showPatternsModal} animationType="slide" onRequestClose={() => {
        // Stop blinking when closing modal
        if (blinkLoop.current) {
          blinkLoop.current.stop();
          blinkLoop.current = null;
        }
        if (blinkTimeout.current) {
          clearTimeout(blinkTimeout.current);
          blinkTimeout.current = null;
        }
        setBlinkingCells([]);
        blinkAnim.setValue(0);
        setShowPatternsModal(false);
      }}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { maxHeight:"90%" }]}>
            <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.modalHeaderGrad}>
              <Text style={s.modalHeaderTitle}>All Patterns ({DEMO_PATTERNS.length})</Text>
              <TouchableOpacity 
                onPress={() => {
                  // Stop blinking when closing modal
                  if (blinkLoop.current) {
                    blinkLoop.current.stop();
                    blinkLoop.current = null;
                  }
                  if (blinkTimeout.current) {
                    clearTimeout(blinkTimeout.current);
                    blinkTimeout.current = null;
                  }
                  setBlinkingCells([]);
                  blinkAnim.setValue(0);
                  setShowPatternsModal(false);
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={s.modalSubtitle}>Tap a pattern to highlight those cells on your ticket (6 seconds)</Text>
            <FlatList
              data={DEMO_PATTERNS}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal:16, paddingBottom:20 }}
              renderItem={({ item: pattern }) => {
                const isWon     = wonPatterns.has(pattern.id);
                const isClaimed = claimedIds.has(pattern.id);
                return (
                  <TouchableOpacity
                    style={[s.patternRow, isWon && s.patternRowWon]}
                    activeOpacity={0.7}
                    onPress={() => {
                      // Stop any existing blinking
                      if (blinkLoop.current) {
                        blinkLoop.current.stop();
                        blinkLoop.current = null;
                      }
                      if (blinkTimeout.current) {
                        clearTimeout(blinkTimeout.current);
                        blinkTimeout.current = null;
                      }
                      // Start new blinking
                      startBlinking(pattern);
                      setShowPatternsModal(false);
                      showSnackbar(`Highlighting "${pattern.display_name}" — look at your ticket!`, "info");
                    }}
                  >
                    <View style={[s.patternIconBox, isWon && { backgroundColor: COLORS.green+"20" }]}>
                      <MaterialCommunityIcons name={getPatternIconName(pattern)} size={22} color={isWon ? COLORS.green : COLORS.secondary} />
                    </View>
                    <View style={{ flex:1, marginLeft:12 }}>
                      <View style={{ flexDirection:"row", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                        <Text style={s.patternRowName}>{pattern.display_name}</Text>
                        {isWon && (
                          <View style={[s.statusPill, { backgroundColor: isClaimed ? COLORS.green+"20" : COLORS.primaryGS+"20" }]}>
                            <Text style={[s.statusPillText, { color: isClaimed ? COLORS.green : COLORS.primary }]}>
                              {isClaimed ? "Claimed ✓" : "Won! 🎉"}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.patternRowDesc} numberOfLines={2}>{pattern.description}</Text>
                      <Text style={s.patternRowMeta}>{pattern.popular_rank} · {pattern.logic_type.replace(/_/g," ")}</Text>
                    </View>
                    <Ionicons name="eye-outline" size={18} color={COLORS.textLight} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // ── Claim Menu - Shows all patterns exactly like Patterns Modal ─────────
  const renderClaimMenu = () => {
    const claimedIds = new Set(claims.map(c => c.pattern_id));
    return (
      <Modal transparent={true} visible={showClaimMenu} animationType="slide" onRequestClose={() => {
        // Stop blinking when closing claim menu
        if (blinkLoop.current) {
          blinkLoop.current.stop();
          blinkLoop.current = null;
        }
        if (blinkTimeout.current) {
          clearTimeout(blinkTimeout.current);
          blinkTimeout.current = null;
        }
        setBlinkingCells([]);
        blinkAnim.setValue(0);
        setShowClaimMenu(false);
      }}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { maxHeight:"90%" }]}>
            <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.modalHeaderGrad}>
              <Text style={s.modalHeaderTitle}>Claim a Pattern</Text>
              <TouchableOpacity 
                onPress={() => {
                  // Stop blinking when closing claim menu
                  if (blinkLoop.current) {
                    blinkLoop.current.stop();
                    blinkLoop.current = null;
                  }
                  if (blinkTimeout.current) {
                    clearTimeout(blinkTimeout.current);
                    blinkTimeout.current = null;
                  }
                  setBlinkingCells([]);
                  blinkAnim.setValue(0);
                  setShowClaimMenu(false);
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={s.modalSubtitle}>Select a completed pattern to claim your prize</Text>
            <FlatList
              data={DEMO_PATTERNS}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal:16, paddingBottom:20 }}
              renderItem={({ item: pattern }) => {
                const isWon = wonPatterns.has(pattern.id);
                const isClaimed = claimedIds.has(pattern.id);
                const canClaim = isWon && !isClaimed;
                return (
                  <TouchableOpacity
                    style={[s.patternRow, isWon && s.patternRowWon, !isWon && { opacity: 0.6 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (canClaim) {
                        submitClaim(pattern);
                      } else if (!isWon) {
                        showSnackbar(`⚠️ "${pattern.display_name}" not completed yet! Complete it first.`, "warning");
                      } else if (isClaimed) {
                        showSnackbar(`"${pattern.display_name}" already claimed!`, "info");
                      }
                    }}
                    disabled={!canClaim}
                  >
                    <View style={[s.patternIconBox, isWon && { backgroundColor: COLORS.green+"20" }]}>
                      <MaterialCommunityIcons 
                        name={getPatternIconName(pattern)} 
                        size={22} 
                        color={isWon ? COLORS.green : COLORS.textLight} 
                      />
                    </View>
                    <View style={{ flex:1, marginLeft:12 }}>
                      <View style={{ flexDirection:"row", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                        <Text style={[s.patternRowName, !isWon && { color: COLORS.textLight }]}>
                          {pattern.display_name}
                        </Text>
                        {isWon && (
                          <View style={[s.statusPill, { backgroundColor: isClaimed ? COLORS.green+"20" : COLORS.primaryGS+"20" }]}>
                            <Text style={[s.statusPillText, { color: isClaimed ? COLORS.green : COLORS.primary }]}>
                              {isClaimed ? "Claimed ✓" : "Ready to Claim! 🎉"}
                            </Text>
                          </View>
                        )}
                        {!isWon && (
                          <View style={[s.statusPill, { backgroundColor: COLORS.red+"20" }]}>
                            <Text style={[s.statusPillText, { color: COLORS.red }]}>
                              Not Completed
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[s.patternRowDesc, !isWon && { color: COLORS.textLight }]} numberOfLines={2}>
                        {pattern.description}
                      </Text>
                      <Text style={[s.patternRowMeta, !isWon && { color: COLORS.textLight }]}>
                        {pattern.popular_rank} · {pattern.logic_type.replace(/_/g," ")}
                      </Text>
                    </View>
                    {canClaim && (
                      <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} style={s.claimPatternButton}>
                        <Text style={s.claimPatternButtonText}>Claim</Text>
                      </LinearGradient>
                    )}
                    {isClaimed && (
                      <View style={s.claimedBadgeContainer}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.green} />
                      </View>
                    )}
                    {!isWon && !isClaimed && (
                      <Ionicons name="lock-closed" size={20} color={COLORS.textLight} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  // ── Claims History ─────────────────────────────────────────────────────
  const renderClaimsHistory = () => (
    <Modal transparent visible={showClaimsHistory} animationType="slide" onRequestClose={() => setShowClaimsHistory(false)}>
      <View style={s.modalOverlay}>
        <View style={[s.modalBox, { maxHeight:"80%" }]}>
          <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.modalHeaderGrad}>
            <Text style={s.modalHeaderTitle}>My Claims ({claims.length})</Text>
            <TouchableOpacity onPress={() => setShowClaimsHistory(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          {claims.length === 0 ? (
            <View style={{ alignItems:"center", padding:40 }}>
              <Ionicons name="trophy-outline" size={60} color={COLORS.textLight} />
              <Text style={{ fontSize:18, fontWeight:"600", color:COLORS.textDark, marginTop:16 }}>No claims yet!</Text>
              <Text style={{ fontSize:14, color:COLORS.textLight, marginTop:8 }}>Complete patterns to claim them</Text>
            </View>
          ) : (
            <FlatList
              data={claims}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding:16 }}
              renderItem={({ item }) => (
                <View style={s.claimHistoryItem}>
                  <View style={s.claimHistoryIcon}>
                    <MaterialCommunityIcons name={getPatternIconName(item)} size={20} color={COLORS.primary} />
                  </View>
                  <View style={{ flex:1, marginLeft:12 }}>
                    <Text style={s.claimHistoryName}>{item.display_name}</Text>
                    <Text style={{ fontSize:11, color:COLORS.textLight, marginTop:2 }}>{item.claimed_at}</Text>
                  </View>
                  <View style={s.approvedPill}>
                    <Text style={s.approvedText}>Approved</Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  // ── Celebration ─────────────────────────────────────────────────────
  const renderCelebration = () => {
    if (!showCelebration || !celebrationPattern) return null;
    return (
      <Modal transparent visible={showCelebration} animationType="none" onRequestClose={stopCelebration}>
        <View style={{ flex:1, backgroundColor:"rgba(0,0,0,0.7)", justifyContent:"center", alignItems:"center" }}>
          <Animated.View style={{ width:"80%", maxWidth:300, alignItems:"center", opacity:celebOpacity, transform:[{ scale:celebScale },{ translateY:celebTranslateY }] }}>
            <View style={{ borderRadius:20, padding:24, alignItems:"center", backgroundColor:COLORS.surface, borderWidth:2, borderColor:COLORS.primary, width:"100%" }}>
              <LinearGradient colors={[COLORS.secondaryGS, COLORS.secondaryGE]} style={{ width:68, height:68, borderRadius:34, justifyContent:"center", alignItems:"center", marginBottom:14 }}>
                <Ionicons name="trophy" size={36} color="#fff" />
              </LinearGradient>
              <Text style={{ fontSize:20, fontWeight:"900", color:COLORS.red, textAlign:"center", marginBottom:6 }}>
                🎉 {celebrationPattern.display_name === "FULL HOUSE" ? "FULL HOUSE!" : "Claim Submitted!"}
              </Text>
              <View style={{ flexDirection:"row", alignItems:"center", gap:8, marginBottom:6 }}>
                <MaterialCommunityIcons name={getPatternIconName(celebrationPattern)} size={20} color={COLORS.secondary} />
                <Text style={{ fontSize:18, fontWeight:"800", color:COLORS.textDark }}>{celebrationPattern.display_name}</Text>
              </View>
              <Text style={{ fontSize:13, color:COLORS.textLight, textAlign:"center", marginBottom:16 }}>
                {celebrationPattern.description}
              </Text>
              <Text style={{ fontSize:13, fontWeight:"700", color:COLORS.green, textAlign:"center", marginBottom:16 }}>
                ✅ Your claim has been approved!
              </Text>
              <TouchableOpacity style={{ borderRadius:20, overflow:"hidden", width:"100%" }} onPress={stopCelebration}>
                <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={{ paddingVertical:12, alignItems:"center" }}>
                  <Text style={{ color:"#fff", fontSize:14, fontWeight:"bold" }}>Continue Playing</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  // ── Header ─────────────────────────────────────────────────────────────
  const Header = () => (
    <LinearGradient colors={[COLORS.primaryGS, COLORS.primaryGE]} start={{x:0,y:0}} end={{x:1,y:0}} style={s.header}>
      <View style={{ flexDirection:"row", alignItems:"center", paddingHorizontal:20 }}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex:1, marginLeft:12 }}>
          <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
            {"DEMO Game".split("").map((ch, i) => (
              <Text key={i} style={ch===" " ? { width:10 } : s.cartoonLetter}>{ch}</Text>
            ))}
          </View>
          <Text style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontWeight:"500" }}>
            Practice — {DEMO_PATTERNS.length} patterns to discover
          </Text>
        </View>
      </View>
    </LinearGradient>
  );

  // ── Main return ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <CustomSnackbar visible={snackbar.visible} message={snackbar.message} type={snackbar.type} />
      {renderPatternsModal()}
      {renderClaimMenu()}
      {renderCelebration()}
      {renderClaimsHistory()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:100 }}>
        <Header />
        <View style={{ padding: HORIZONTAL_MARGIN, paddingTop:16 }}>
          {renderAllNumbers()}
          {renderLastCalled()}
          {renderTicketSection()}

          {/* How to play */}
          <View style={[s.card, { marginTop:4 }]}>
            <View style={{ flexDirection:"row", alignItems:"center", marginBottom:12, gap:8 }}>
              <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
              <Text style={s.sectionTitle}>How to Play</Text>
            </View>
            {[
              "Numbers are called randomly every 8 seconds (all 90 numbers)",
              "Tap a called number on your ticket to mark it (turns red)",
              "Tap 'Patterns' to see all 14 patterns — tap one to highlight those cells on your ticket (blinks for 6 seconds)",
              "When you complete a pattern, tap 'Claim' then select the pattern to claim it",
              "Mark all 15 numbers to win FULL HOUSE and stop auto-calling",
              "A celebration pops up once your claim is submitted — tap 'Claims' to see history",
            ].map((step, i) => (
              <View key={i} style={{ flexDirection:"row", alignItems:"flex-start", marginBottom:10, gap:10 }}>
                <View style={{ width:24, height:24, borderRadius:12, backgroundColor:COLORS.primary, justifyContent:"center", alignItems:"center" }}>
                  <Text style={{ color:"#fff", fontSize:12, fontWeight:"bold" }}>{i+1}</Text>
                </View>
                <Text style={{ flex:1, fontSize:13, color:COLORS.textDark, lineHeight:18 }}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
     
    </SafeAreaView>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
//  Styles
// ═══════════════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  safeArea: { flex:1, backgroundColor:COLORS.background },
  header: { paddingTop:14, paddingBottom:16, borderBottomLeftRadius:24, borderBottomRightRadius:24, overflow:"hidden" },
  backBtn: { width:40, height:40, borderRadius:20, backgroundColor:"rgba(255,255,255,0.2)", justifyContent:"center", alignItems:"center" },
  cartoonLetter: {
    fontSize:24, fontWeight:"900", color:"#FDB800",
    textShadowColor:"rgba(255,193,7,0.5)", textShadowOffset:{width:2,height:2}, textShadowRadius:5,
    marginHorizontal:1,
    ...Platform.select({ android:{ elevation:4 } }),
  },

  // Cards
  card: { borderRadius:14, padding:14, marginBottom:12, borderWidth:1, borderColor:COLORS.border, backgroundColor:COLORS.surface, shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:2, elevation:2 },
  sectionIcon: { width:28, height:28, borderRadius:8, backgroundColor:COLORS.primaryGS+"20", justifyContent:"center", alignItems:"center" },
  sectionTitle: { fontSize:15, fontWeight:"700", color:COLORS.textDark, flex:1 },
  badge: { backgroundColor:COLORS.primaryGS, borderRadius:10, paddingHorizontal:8, paddingVertical:2 },
  badgeText: { fontSize:11, fontWeight:"700", color:"#fff" },
  autoTag: { flexDirection:"row", alignItems:"center", backgroundColor:COLORS.background, paddingHorizontal:7, paddingVertical:3, borderRadius:10, gap:3 },
  autoTagText: { fontSize:10, color:COLORS.primary, fontWeight:"600" },
  hintText: { fontSize:11, color:COLORS.textLight, textAlign:"center", marginTop:10 },

  // All numbers
  numRow: { flexDirection:"row", justifyContent:"center", marginBottom:4 },
  numCell: { width:26, height:26, justifyContent:"center", alignItems:"center", borderRadius:6, borderWidth:1, borderColor:COLORS.border, backgroundColor:COLORS.surface, marginHorizontal:2, position:"relative" },
  numCalled: { backgroundColor:COLORS.green, borderColor:COLORS.green },
  numLatest: { backgroundColor:COLORS.primary, borderColor:COLORS.primary, borderWidth:2 },
  numText: { fontSize:11, fontWeight:"600", color:COLORS.textDark },
  numTextCalled: { color:"#fff", fontWeight:"700" },
  numTextLatest: { color:"#fff", fontWeight:"900" },
  starDot: { position:"absolute", top:-2, right:-2, backgroundColor:COLORS.surface, borderRadius:5, padding:1 },
  legend: { flexDirection:"row", justifyContent:"center", gap:14, marginTop:10, paddingTop:10, borderTopWidth:1, borderTopColor:COLORS.border },
  legendItem: { flexDirection:"row", alignItems:"center", gap:4 },
  legendDot: { width:12, height:12, borderRadius:3 },
  legendText: { fontSize:10, color:COLORS.textLight },

  // Last called
  calledCircle: { width:46, height:46, borderRadius:23, backgroundColor:COLORS.background, alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:COLORS.border, position:"relative" },
  calledCircleLatest: { backgroundColor:COLORS.primary, borderColor:COLORS.primary, borderWidth:2 },
  calledCircleText: { fontSize:16, fontWeight:"600", color:COLORS.textDark },
  calledCircleTextLatest: { color:"#fff", fontWeight:"700" },
  starBadge: { position:"absolute", top:-2, right:-2, backgroundColor:COLORS.surface, borderRadius:5, padding:1 },

  // Ticket
  ticketHeaderRow: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:8, paddingHorizontal:2 },
  ticketIconBox: { width:28, height:28, borderRadius:8, justifyContent:"center", alignItems:"center" },
  ticketLabel: { fontSize:13, color:COLORS.textDark, fontWeight:"600" },
  ticketStats: { fontSize:10, color:COLORS.textLight, marginTop:1 },
  outlineBtn: { flexDirection:"row", alignItems:"center", gap:4, paddingHorizontal:8, paddingVertical:4, borderRadius:12, borderWidth:1, borderColor:COLORS.primary },
  outlineBtnText: { fontSize:11, color:COLORS.primary, fontWeight:"600" },
  claimBtn: { flexDirection:"row", alignItems:"center", paddingHorizontal:8, paddingVertical:4, gap:4 },
  claimBtnText: { fontSize:11, color:"#fff", fontWeight:"600" },
  wonChip: { flexDirection:"row", alignItems:"center", gap:4, paddingHorizontal:8, paddingVertical:3, borderRadius:10, borderWidth:1, borderColor:COLORS.primary, backgroundColor:COLORS.primaryGS+"15", marginRight:6 },
  wonChipClaimed: { backgroundColor:COLORS.green, borderColor:COLORS.green },
  wonChipText: { fontSize:11, fontWeight:"600", color:COLORS.primary },
  ticketCard: { borderRadius:12, padding:TICKET_PADDING, borderWidth:1.5, borderColor:COLORS.ticketBorder, backgroundColor:COLORS.surface, overflow:"hidden" },
  ticketLegendRow: { flexDirection:"row", justifyContent:"center", gap:12, marginTop:8, paddingHorizontal:4 },
  cell: { borderWidth:1, alignItems:"center", justifyContent:"center", borderRadius:2, position:"relative" },
  cellNumber: { fontSize:15, fontWeight:"bold" },
  blinkBorder: { borderWidth:3, borderColor:COLORS.warning, shadowColor:COLORS.warning, shadowOffset:{width:0,height:0}, shadowOpacity:0.8, shadowRadius:5, elevation:5 },
  calledNotMarked: { borderWidth:2, borderColor:COLORS.orange, backgroundColor:COLORS.orange+"25" },
  pulseDot: { position:"absolute", top:2, right:2, width:7, height:7, borderRadius:3.5, backgroundColor:COLORS.orange, opacity:0.8 },

  // Modals
  modalOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"flex-end" },
  modalBox: { backgroundColor:COLORS.surface, borderTopLeftRadius:20, borderTopRightRadius:20, overflow:"hidden" },
  modalHeaderGrad: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:16 },
  modalHeaderTitle: { fontSize:18, fontWeight:"700", color:"#fff" },
  modalHeaderPlain: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:16, borderBottomWidth:1, borderBottomColor:COLORS.border, backgroundColor:COLORS.background },
  modalHeaderTitleDark: { fontSize:18, fontWeight:"700", color:COLORS.textDark },
  modalSubtitle: { fontSize:13, color:COLORS.textLight, textAlign:"center", paddingVertical:10, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:COLORS.border },

  // Pattern list
  patternRow: { flexDirection:"row", alignItems:"center", padding:12, marginBottom:8, borderRadius:12, borderWidth:1, borderColor:COLORS.border, backgroundColor:COLORS.surface },
  patternRowWon: { borderColor:COLORS.green, backgroundColor:COLORS.green+"08" },
  patternIconBox: { width:44, height:44, borderRadius:10, backgroundColor:COLORS.secondary+"18", justifyContent:"center", alignItems:"center" },
  patternRowName: { fontSize:14, fontWeight:"700", color:COLORS.textDark },
  patternRowDesc: { fontSize:12, color:COLORS.textLight, marginTop:2 },
  patternRowMeta: { fontSize:11, color:COLORS.primary, marginTop:3, fontWeight:"600" },
  statusPill: { paddingHorizontal:8, paddingVertical:2, borderRadius:10 },
  statusPillText: { fontSize:10, fontWeight:"700" },
  claimPatternButton: { paddingHorizontal:12, paddingVertical:6, borderRadius:20, marginLeft:8 },
  claimPatternButtonText: { color: "#fff", fontSize:12, fontWeight:"bold" },
  claimedBadgeContainer: { marginLeft:8 },

  // Claims history
  claimHistoryItem: { flexDirection:"row", alignItems:"center", padding:12, marginBottom:10, backgroundColor:COLORS.surface, borderRadius:12, borderWidth:1, borderColor:COLORS.border },
  claimHistoryIcon: { width:40, height:40, borderRadius:8, backgroundColor:COLORS.primaryGS+"20", justifyContent:"center", alignItems:"center" },
  claimHistoryName: { fontSize:15, fontWeight:"600", color:COLORS.textDark },
  approvedPill: { backgroundColor:COLORS.green+"20", paddingHorizontal:8, paddingVertical:3, borderRadius:10 },
  approvedText: { fontSize:10, fontWeight:"600", color:COLORS.green },

  // Bottom bar
  bottomBar: { position:"absolute", bottom:16, left:16, right:16, flexDirection:"row" },
  bottomBarBtn: { flexDirection:"row", alignItems:"center", justifyContent:"center", paddingVertical:12, gap:8 },
  bottomBarBtnText: { color:"#fff", fontSize:13, fontWeight:"bold" },

  // Snackbar
  snackbarWrap: { position:"absolute", bottom:0, left:0, right:0, zIndex:9999, pointerEvents:"none" },
  snackbarBox: { marginHorizontal:16, marginBottom:16, borderRadius:8, overflow:"hidden", shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  snackbarGrad: { flexDirection:"row", alignItems:"center", padding:14 },
  snackbarText: { color:"#fff", fontSize:13, fontWeight:"600", flex:1 },
});

export default UserDemoGame;
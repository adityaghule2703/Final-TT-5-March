import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Platform,
  Linking,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: "#4facfe",
  accent: "#ff9800",
  background: "#f5f8ff",
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  live: "#4CAF50",
  scheduled: "#ff9800",
  completed: "#9E9E9E",
  
  deposit: "#4facfe",
  withdraw: "#FF6B6B",
  refer: "#4ECDC4",
  support: "#9B59B6",
  
  purple: "#9B59B6",
  purpleLight: "#F3E5F5",
  orange: "#FF9800",
  orangeLight: "#FFF3E0",
  teal: "#4ECDC4",
  tealLight: "#E0F2F1",
  pink: "#FF6B6B",
  pinkLight: "#FFE5E5",
};

const About = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const letterAnims = useRef([]);

  useEffect(() => {
    const newLetterAnims = Array(12).fill().map(() => new Animated.Value(1));
    letterAnims.current = newLetterAnims;
    
    letterAnims.current.forEach(anim => {
      anim.stopAnimation();
      anim.setValue(1);
    });
    
    let currentIndex = 0;
    let isAnimating = true;
    
    const animateNextLetter = () => {
      if (!isAnimating) return;
      
      if (currentIndex === 6) {
        currentIndex = 7;
      }
      
      letterAnims.current.forEach(anim => {
        anim.setValue(1);
      });
      
      Animated.sequence([
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.timing(letterAnims.current[currentIndex], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.bounce,
        }),
        Animated.delay(200),
      ]).start(({ finished }) => {
        if (finished && isAnimating) {
          currentIndex = (currentIndex + 1) % letterAnims.current.length;
          if (currentIndex === 6) {
            currentIndex = 7;
          }
          animateNextLetter();
        }
      });
    };
    
    animateNextLetter();
    startAnimations();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      isAnimating = false;
      if (letterAnims.current) {
        letterAnims.current.forEach(anim => {
          anim.stopAnimation();
        });
      }
    };
  }, []);

  const startAnimations = () => {
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSupportPress = () => {
    Linking.openURL('mailto:support@houzietimez.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://tambolatime.co.in/houzietimez/');
  };

  const Header = () => {
    const letters = [
      { char: 'H', index: 0 },
      { char: 'O', index: 1, isSpecial: true },
      { char: 'U', index: 2 },
      { char: 'Z', index: 3 },
      { char: 'I', index: 4 },
      { char: 'E', index: 5 },
      { char: ' ', index: 6, isSpace: true, width: 20 },
      { char: 'T', index: 7 },
      { char: 'I', index: 8 },
      { char: 'M', index: 9 },
      { char: 'E', index: 10 },
      { char: 'Z', index: 11, isSpecial: true },
    ];

    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.cartoonTitleRow}>
            {letters.map((item) => {
              const animValue = letterAnims.current && letterAnims.current[item.index] 
                ? letterAnims.current[item.index] 
                : new Animated.Value(1);
              
              return (
                <Animated.Text
                  key={`letter-${item.index}`}
                  style={[
                    styles.cartoonLetter,
                    item.isSpecial && styles.specialCartoonLetter,
                    item.isSpace && { width: item.width || 20 },
                    { 
                      transform: [{ scale: animValue }],
                      marginHorizontal: item.isSpace ? 0 : 2,
                    }
                  ]}
                >
                  {item.char}
                </Animated.Text>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const StatCard = ({ number, label, icon, color }) => {
    const floatValue = floatAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10]
    });

    return (
      <Animated.View 
        style={[
          styles.statCard,
          {
            transform: [{ translateY: floatValue }]
          }
        ]}
      >
        <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    );
  };

  const FeatureCard = ({ icon, title, description, color, index }) => {
    const scaleValue = floatAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02 + (index * 0.01)]
    });

    return (
      <Animated.View 
        style={[
          styles.featureCard,
          {
            transform: [{ scale: scaleValue }]
          }
        ]}
      >
        <View style={[styles.featureIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </Animated.View>
    );
  };

  const ValueCard = ({ icon, title, description, color }) => (
    <View style={styles.valueCard}>
      <View style={[styles.valueIconContainer, { backgroundColor: color + '15' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.valueContent}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDescription}>{description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.container}>
        <Header />

        <Animated.View 
          style={[
            styles.backgroundCircle1,
            {
              transform: [
                { translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, 30] }) },
                { scale: pulseAnim }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle2,
            {
              transform: [
                { translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle3,
            {
              transform: [
                { scale: pulseAnim.interpolate({ inputRange: [1, 1.05], outputRange: [1, 1.1] }) }
              ]
            }
          ]} 
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          <Animated.View 
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.heroContent}>
              {/* <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Since 2020</Text>
              </View> */}
              <Text style={styles.heroTitle}>Houzie Timez</Text>
              <Text style={styles.heroSubtitle}>India's Most Trusted Houzie Platform</Text>
              <Text style={styles.heroDescription}>
                We're on a mission to revolutionize online Houzie gaming with transparency, 
                fairness, and exciting rewards for our players.
              </Text>
            </View>
          </Animated.View>

          <View style={styles.statsSection}>
            <StatCard number="24/7" label="Support Available" icon="headset" color={COLORS.primary} />
            <StatCard number="100%" label="Secure Platform" icon="shield-checkmark" color={COLORS.refer} />
            <StatCard number="10+" label="Game Patterns" icon="game-controller" color={COLORS.purple} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="flag" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR MISSION</Text>
              </View>
            </View>

            <View style={styles.missionCard}>
              <View style={styles.missionPattern} />
              <Text style={styles.missionText}>
                To create a fair, transparent, and exciting Houzie gaming environment where 
                players can enjoy authentic gaming experience with real-time number calling and 
                responsive support.
              </Text>
              
              <View style={styles.missionPoints}>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>Fair Play Guaranteed</Text>
                </View>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>Real-Time Number Calling</Text>
                </View>
                <View style={styles.missionPoint}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.missionPointText}>24x7 Customer Support</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="star" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>KEY FEATURES</Text>
              </View>
            </View>

            <View style={styles.featuresGrid}>
              <FeatureCard 
                icon="flash"
                title="Instant Matchmaking"
                description="Join games instantly with players across India"
                color={COLORS.primary}
                index={0}
              />
              <FeatureCard 
                icon="people"
                title="Live Community"
                description="Chat and celebrate wins with fellow players"
                color={COLORS.purple}
                index={1}
              />
              <FeatureCard 
                icon="lock-closed"
                title="Secure Rooms"
                description="Private rooms with end-to-end encryption"
                color={COLORS.orange}
                index={2}
              />
              <FeatureCard 
                icon="trophy"
                title="Daily Rewards"
                description="Win exciting prizes and bonuses daily"
                color={COLORS.teal}
                index={3}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>WHY CHOOSE US</Text>
              </View>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyPattern} />
              
              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Licensed & Regulated Platform</Text>
                  <Text style={styles.whyText}>Fully compliant with gaming regulations</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.purple + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.purple} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Exciting Prize Pools</Text>
                  <Text style={styles.whyText}>Compete for great rewards every game</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.orange + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.orange} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>24/7 Customer Support</Text>
                  <Text style={styles.whyText}>Always here to help you</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.teal + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.teal} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Certified RNG (Fair Play)</Text>
                  <Text style={styles.whyText}>100% unbiased game outcomes</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.pink + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.pink} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Easy to Play</Text>
                  <Text style={styles.whyText}>Simple interface for all age groups</Text>
                </View>
              </View>

              <View style={styles.whyItem}>
                <View style={[styles.whyIcon, { backgroundColor: COLORS.refer + '15' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.refer} />
                </View>
                <View style={styles.whyContent}>
                  <Text style={styles.whyTitle}>Regular Tournaments</Text>
                  <Text style={styles.whyText}>Win big in special events</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="heart" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>OUR VALUES</Text>
              </View>
            </View>

            <View style={styles.valuesContainer}>
              <ValueCard 
                icon="security"
                title="Security First"
                description="Your data and game sessions are protected with high-level encryption"
                color={COLORS.primary}
              />
              <ValueCard 
                icon="balance"
                title="Fair Play"
                description="Certified random number generator ensures equal chance for all players"
                color={COLORS.purple}
              />
              <ValueCard 
                icon="support-agent"
                title="Player Support"
                description="Dedicated 24/7 support team to assist with any queries"
                color={COLORS.orange}
              />
              <ValueCard 
                icon="visibility"
                title="Transparency"
                description="Clear rules, open communication, and honest dealings"
                color={COLORS.teal}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="mail" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>GET IN TOUCH</Text>
              </View>
            </View>

            <View style={styles.contactCard}>
              <TouchableOpacity style={styles.contactItem} onPress={handleSupportPress}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="mail" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>support@houzietimez.com</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('tel:+917507331103')}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.purple + '15' }]}>
                  <Ionicons name="call" size={20} color={COLORS.purple} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>+91 75073 31103</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.orange + '15' }]}>
                  <Ionicons name="globe" size={20} color={COLORS.orange} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Website</Text>
                  <Text style={styles.contactValue}>https://houzietimez.com</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <View style={styles.contactDivider} />

              <View style={styles.contactItem}>
                <View style={[styles.contactIcon, { backgroundColor: COLORS.teal + '15' }]}>
                  <Ionicons name="time" size={20} color={COLORS.teal} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactLabel}>Support Hours</Text>
                  <Text style={styles.contactValue}>24/7</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity 
                style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}
                onPress={() => Linking.openURL('https://www.facebook.com/houzietimez')}
              >
                <Ionicons name="logo-facebook" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialIcon, { backgroundColor: '#E4405F' }]}
                onPress={() => Linking.openURL('https://www.instagram.com/houzietimez')}
              >
                <Ionicons name="logo-instagram" size={24} color={COLORS.surface} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}
                onPress={() => Linking.openURL('https://www.youtube.com/@houzietimez')}
              >
                <Ionicons name="logo-youtube" size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Houzie Timez. All rights reserved.
            </Text>
           
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerLinkDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Responsible Play</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartoonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cartoonLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FBC10B',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    includeFontPadding: false,
    marginHorizontal: 2,
    ...Platform.select({
      android: {
        elevation: 5,
        textShadowColor: '#FFB300',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
      },
    }),
  },
  specialCartoonLetter: {
    fontSize: 40,
    color: '#FFD700',
    textShadowColor: '#FF8C00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 10,
    marginHorizontal: 2,
  },
  
  backgroundCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary + '10',
    zIndex: 0,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.purple + '08',
    zIndex: 0,
  },
  backgroundCircle3: {
    position: 'absolute',
    top: '50%',
    right: 20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.orange + '05',
    zIndex: 0,
  },

  heroSection: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
    zIndex: 2,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
    zIndex: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },

  missionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  missionPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderBottomLeftRadius: 50,
  },
  missionText: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  missionPoints: {
    gap: 10,
  },
  missionPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  missionPointText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 44) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 15,
  },

  whyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  whyPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderTopRightRadius: 50,
  },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  whyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whyContent: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  whyText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  valuesContainer: {
    gap: 12,
  },
  valueCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  valueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  valueDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },

  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  contactDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  socialTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 10,
    textAlign: 'center',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: COLORS.primary,
  },
  footerLinkDivider: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomSpace: {
    height: 20,
  },
});

export default About;
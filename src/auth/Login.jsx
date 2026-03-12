import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  AppState
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import messaging from "@react-native-firebase/messaging";
import NotifeeService from '../services/NotifeeService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Updated color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";

const Login = ({ navigation, onLoginSuccess }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Animation references
  const fadeIn = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Request notification permission and get FCM token
  const initializeFCM = async () => {
    try {
      console.log("📱 Initializing FCM...");
      
      // Initialize Notifee
      await NotifeeService.initialize();
      
      // Check if we already have a token
      let token = await AsyncStorage.getItem("deviceFcmToken");
      
      if (token) {
        console.log("✅ Found existing FCM token");
        setFcmToken(token);
        return token;
      }
      
      // Request permission for Android 13+
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("❌ Notification permission denied");
        }
      }
      
      // Get token
      await messaging().registerDeviceForRemoteMessages();
      token = await messaging().getToken();
      
      if (token) {
        console.log("✅ New FCM token generated");
        await AsyncStorage.setItem("deviceFcmToken", token);
        setFcmToken(token);
        return token;
      }
      
      return null;
    } catch (error) {
      console.log("❌ FCM initialization error:", error);
      return null;
    }
  };

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize FCM and Notifee
    initializeFCM();

    // Handle token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      console.log("🔄 FCM token refreshed");
      await AsyncStorage.setItem("deviceFcmToken", newToken);
      setFcmToken(newToken);
      
      // If user is logged in, update token on server
      const userRole = await AsyncStorage.getItem("userRole");
      const authToken = await AsyncStorage.getItem("token");
      
      if (userRole && authToken) {
        console.log(`📤 Updating refreshed token for role ${userRole} on server...`);
        updateTokenOnServer(newToken, userRole, authToken);
      }
    });

    // Handle notification when app is in background/killed and opened
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log("App opened from quit state");
        handleNotificationOpen(remoteMessage);
      }
    });

    

    // Handle notification when app is in background and brought to foreground
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("App opened from background");
      handleNotificationOpen(remoteMessage);
    });

    // Track app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeNotificationOpened();
      subscription.remove();
    };
  }, []);

  const handleNotificationOpen = (remoteMessage) => {
    // Navigate based on notification data
    const { data } = remoteMessage;
    if (data?.screen) {
      navigation.navigate(data.screen, data);
    } else if (data?.game_id) {
      navigation.navigate("GameDetails", { gameId: data.game_id });
    } else if (data?.ticket_request_id) {
      navigation.navigate("HostTicketRequests", { ticketId: data.ticket_request_id });
    }
  };

  // Update token on server when refreshed
  const updateTokenOnServer = async (token, role, authToken) => {
    try {
      const endpoint = role === "user" 
        ? "https://tambolatime.co.in/public/api/user/update-fcm-token"
        : "https://tambolatime.co.in/public/api/host/update-fcm-token";
      
      await axios.post(endpoint, 
        { fcm_token: token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      console.log("✅ Token updated on server for role:", role);
    } catch (error) {
      console.log("❌ Failed to update token on server:", error.message);
    }
  };

  const handleLogin = async () => {
    if (!mobile || !password) {
      Alert.alert("Required", "Please enter mobile number and password");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Button press animation
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();

    try {
      // Use existing FCM token
      const tokenToSend = fcmToken || "";

      const endpoint = selectedRole === "user"
        ? "https://tambolatime.co.in/public/api/user/login"
        : "https://tambolatime.co.in/public/api/host/login";

      console.log("🌐 Logging in with role:", selectedRole);

      const response = await axios.post(endpoint, {
        mobile,
        password,
        fcm_token: tokenToSend
      });

      console.log("✅ Login successful");

      const { token, user, host } = response.data;
      const userData = user || host;

      // Clear previous storage
      await AsyncStorage.multiRemove([
        "userToken", "hostToken", "user", "host", 
        "token", "userData", "userRole"
      ]);

      // Store new data
      await AsyncStorage.setItem("userRole", selectedRole);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify({ ...userData, role: selectedRole }));
      
      if (selectedRole === "user") {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      } else {
        await AsyncStorage.setItem("hostToken", token);
        await AsyncStorage.setItem("host", JSON.stringify(userData));
      }

      // Keep device token
      if (fcmToken) {
        await AsyncStorage.setItem("deviceFcmToken", fcmToken);
      }

      // Navigate to home
      setTimeout(() => onLoginSuccess(), 400);

    } catch (error) {
      console.log("❌ Login error:", error.response?.data || error.message);
      
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid mobile number or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simple token info for debugging (only shows status, no test functions)
  const showTokenInfo = async () => {
    const deviceToken = await AsyncStorage.getItem("deviceFcmToken");
    
    Alert.alert(
      "Notification Status",
      `Notifications: ${deviceToken ? "✅ Enabled" : "❌ Disabled"}\n\n` +
      "You will receive notifications for:\n" +
      "• Ticket requests\n" +
      "• Game updates\n" +
      "• Important alerts",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={[
                  styles.mainContent,
                  {
                    opacity: fadeIn,
                    transform: [{ translateY: cardSlide }]
                  }
                ]}
              >
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.appName}>Tambola Timez</Text>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                  </View>
                  
                  {/* Simple notification status indicator - no debug menu */}
                  <View style={styles.fcmStatusContainer}>
                    <Ionicons 
                      name={fcmToken ? "notifications" : "notifications-off"} 
                      size={16} 
                      color={ACCENT_COLOR} 
                    />
                    <Text style={styles.fcmStatusText}>
                      {fcmToken ? "Notifications Active" : "Notifications Disabled"}
                    </Text>
                  </View>
                  
                  {/* Optional: Add small info button for users to check status */}
                
                </View>

                <View style={styles.card}>
                  {/* Role Selection */}
                  <View style={styles.roleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "user" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("user")}
                    >
                      <View style={styles.roleButtonContent}>
                        <Ionicons 
                          name="person" 
                          size={20} 
                          color={selectedRole === "user" ? WHITE : TEXT_LIGHT} 
                        />
                        <Text style={[
                          styles.roleButtonText,
                          selectedRole === "user" && styles.roleButtonTextActive
                        ]}>
                          Player
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        selectedRole === "host" && styles.roleButtonActive,
                      ]}
                      onPress={() => setSelectedRole("host")}
                    >
                      <View style={styles.roleButtonContent}>
                        <Ionicons 
                          name="mic" 
                          size={20} 
                          color={selectedRole === "host" ? WHITE : TEXT_LIGHT} 
                        />
                        <Text style={[
                          styles.roleButtonText,
                          selectedRole === "host" && styles.roleButtonTextActive
                        ]}>
                          Host
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Form */}
                  <View style={styles.form}>
                    <View style={styles.inputContainer}>
                      <Ionicons name="call-outline" size={20} color={ACCENT_COLOR} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Mobile Number"
                        placeholderTextColor={TEXT_LIGHT}
                        style={styles.input}
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color={ACCENT_COLOR} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor={TEXT_LIGHT}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        onSubmitEditing={handleLogin}
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={ACCENT_COLOR} 
                        />
                      </TouchableOpacity>
                    </View>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                      <TouchableOpacity
                        style={[
                          styles.loginButton,
                          isLoading && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Ionicons name="reload-circle" size={24} color={WHITE} />
                        ) : (
                          <>
                            <Text style={styles.loginButtonText}>SIGN IN</Text>
                            <Ionicons name="arrow-forward" size={20} color={WHITE} />
                          </>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  </View>

                  {/* Quick Links */}
                  <View style={styles.linksRow}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword", { role: selectedRole })}
                    >
                      <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity 
                      onPress={() => navigation.navigate("ChooseRole")}
                    >
                      <Text style={styles.linkText}>Create Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.bottomInfo}>
                  <Text style={styles.infoText}>
                    By signing in, you agree to our Terms & Privacy
                  </Text>
                  <Text style={styles.versionText}>Tambola Timez v1.0</Text>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    marginBottom: 8,
    textShadowColor: 'rgba(79, 172, 254, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    fontSize: 18,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },
  fcmStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  fcmStatusText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoButton: {
    position: 'absolute',
    right: 0,
    top: 10,
    padding: 5,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 25,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 15,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  roleButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_LIGHT,
  },
  roleButtonTextActive: {
    color: WHITE,
    fontWeight: '700',
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
    height: '100%',
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 6,
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 15,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  linkText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: BORDER_COLOR,
  },
  bottomInfo: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: TEXT_LIGHT,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  versionText: {
    color: TEXT_LIGHT,
    fontSize: 11,
    opacity: 0.6,
  },
});

export default Login;
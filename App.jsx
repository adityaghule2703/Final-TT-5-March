import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';

// Import Notification Handler
import NotificationHandler from './src/services/NotificationHandler';

// Import splash screen
import SplashScreen from './src/screens/SplashScreen';

// Auth Screens
import Login from './src/auth/Login';
import ChooseRole from './src/auth/ChooseRole';
import MobileVerify from './src/auth/MobileVerify';
import MobileVerifyOtp from './src/auth/MobileVerifyOtp';
import Register from './src/auth/Register';
import ForgotPassword from './src/auth/ForgotPassword';
import ForgotPasswordVerify from './src/auth/ForgotPasswordVerify';
import ResetPassword from './src/auth/ResetPassword';

// User Screens
import Home from './src/screens/user/Home';
import About from './src/screens/user/About';
import Game from './src/screens/user/Game';
import Profile from './src/screens/user/Profile';
import Faqs from './src/screens/user/Faqs';
import GameDetails from './src/screens/user/GameDetails';
import TicketsScreen from './src/screens/user/TicketsScreen';
import TicketRequestsScreen from './src/screens/user/TicketRequestsScreen';
import UserGameRoom from './src/screens/user/UserGameRoom';
import UserGameClaim from './src/screens/user/UserGameClaim';
import UserGameWinners from './src/screens/user/UserGameWinners';
import UserGamePatterns from './src/screens/user/UserGamePatterns';
import UserCalledNumbers from './src/screens/user/UserCalledNumbers';
import UserGameResult from './src/screens/user/UserGameResult';
import UserLiveChat from './src/screens/user/UserLiveChat';

// Host Screens
import HostProfile from './src/screens/host/HostProfile';
import HostDashboard from './src/screens/host/HostDashboard';
import HostFaqs from './src/screens/host/HostFaqs';
import HostGame from './src/screens/host/HostGame';
import HostSubscription from './src/screens/host/HostSubscription';
import HostGamePatterns from './src/screens/host/HostGamePatterns';
import HostGameCreation from './src/screens/host/HostGameCreation';
import HostGameEdit from './src/screens/host/HostGameEdit';
import HostTicketRequests from './src/screens/host/HostTicketRequests';
import HostGameUsers from './src/screens/host/HostGameUsers';
import HostGameRoom from './src/screens/host/HostGameRoom';
import HostClaimRequests from './src/screens/host/HostClaimRequests';
import HostGameWinners from './src/screens/host/HostGameWinners';
import HostCalledNumbers from './src/screens/host/HostCalledNumbers';
import HostGameOptions from './src/screens/host/HostGameOptions';
import HostGameReward from './src/screens/host/HostGameReward';
import HostLiveChat from './src/screens/host/HostLiveChat';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User Tabs Component
function UserTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'About') {
            iconName = 'info-circle';
          } else if (route.name === 'Game') {
            iconName = 'gamepad';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Faqs') {
            iconName = 'question-circle';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4facfe',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 2,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Game" component={Game} />
      <Tab.Screen name="Profile">
        {(props) => <Profile {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Faqs" component={Faqs} />
    </Tab.Navigator>
  );
}

// Host Tabs Component
function HostTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'HostDashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'HostGame') {
            iconName = 'gamepad';
          } else if (route.name === 'HostSubscription') {
            iconName = 'credit-card';
          } else if (route.name === 'HostFaqs') {
            iconName = 'question-circle';
          } else if (route.name === 'HostProfile') {
            iconName = 'user';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 2,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen 
        name="HostDashboard" 
        options={{ tabBarLabel: 'Dashboard' }}
      >
        {(props) => <HostDashboard {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="HostGame" 
        options={{ tabBarLabel: 'Games' }}
      >
        {(props) => <HostGame {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="HostSubscription" 
        options={{ tabBarLabel: 'Subscription' }}
      >
        {(props) => <HostSubscription {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="HostFaqs" 
        options={{ tabBarLabel: 'FAQs' }}
      >
        {(props) => <HostFaqs {...props} onLogout={onLogout} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="HostProfile" 
        options={{ tabBarLabel: 'Profile' }}
      >
        {(props) => <HostProfile {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize global notification handler when app starts
    // This will run once and persist throughout the app lifecycle
    const unsubscribe = NotificationHandler.initialize();
    
    checkLogin();
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("userRole");
      
      if (token && role) {
        if (role === "user") {
          const userToken = await AsyncStorage.getItem("userToken");
          setLoggedIn(!!userToken);
        } else if (role === "host") {
          const hostToken = await AsyncStorage.getItem("hostToken");
          setLoggedIn(!!hostToken);
        } else {
          setLoggedIn(!!token);
        }
      } else {
        setLoggedIn(false);
      }
      
      setUserRole(role);
    } catch (error) {
      console.log("Check login error:", error);
      setLoggedIn(false);
      setUserRole(null);
    } finally {
      // Hide custom splash after 3 seconds (reduced from 5)
      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "userToken",
        "hostToken",
        "user",
        "host",
        "userData",
        "userRole"
      ]);
      setLoggedIn(false);
      setUserRole(null);
      
      // Show logout message
      Alert.alert("Logged Out", "You have been successfully logged out.");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleLoginSuccess = async () => {
    const role = await AsyncStorage.getItem("userRole");
    setLoggedIn(true);
    setUserRole(role);
    
    // Show welcome message
    Alert.alert(
      "Welcome Back!",
      role === "user" ? "Ready to play some Tambola?" : "Ready to host some games?",
      [{ text: "Let's Go!" }]
    );
  };

  // Show splash screen immediately
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f8ff' }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {loggedIn ? (
              <>
                {/* MAIN APP WITH ROLE-BASED TABS */}
                {userRole === "user" ? (
                  <Stack.Screen name="UserTabs">
                    {(props) => (
                      <UserTabs {...props} onLogout={handleLogout} />
                    )}
                  </Stack.Screen>
                ) : userRole === "host" ? (
                  <Stack.Screen name="HostTabs">
                    {(props) => (
                      <HostTabs {...props} onLogout={handleLogout} />
                    )}
                  </Stack.Screen>
                ) : null}

                {/* USER-ONLY SCREENS */}
                {userRole === "user" && (
                  <>
                    <Stack.Screen name="GameDetails" component={GameDetails} />
                    <Stack.Screen name="TicketsScreen" component={TicketsScreen} />
                    <Stack.Screen name="TicketRequestsScreen" component={TicketRequestsScreen} />
                    <Stack.Screen name="UserGameRoom" component={UserGameRoom} />
                    <Stack.Screen name="UserGameClaim" component={UserGameClaim} />
                    <Stack.Screen name="UserGameWinners" component={UserGameWinners} />
                    <Stack.Screen name="UserGamePatterns" component={UserGamePatterns} />
                    <Stack.Screen name="UserCalledNumbers" component={UserCalledNumbers} />
                    <Stack.Screen name="UserGameResult" component={UserGameResult} />
                    <Stack.Screen name="UserLiveChat" component={UserLiveChat} />
                  </>
                )}

                {/* HOST-ONLY SCREENS */}
                {userRole === "host" && (
                  <>
                    <Stack.Screen name="HostGamePatterns" component={HostGamePatterns} />
                    <Stack.Screen name="HostGameCreation" component={HostGameCreation} />
                    <Stack.Screen name="HostGameEdit" component={HostGameEdit} />
                    <Stack.Screen name="HostTicketRequests" component={HostTicketRequests} />
                    <Stack.Screen name="HostGameUsers" component={HostGameUsers} />
                    <Stack.Screen name="HostGameRoom" component={HostGameRoom} />
                    <Stack.Screen name="HostClaimRequests" component={HostClaimRequests} />
                    <Stack.Screen name="HostGameWinners" component={HostGameWinners} />
                    <Stack.Screen name="HostCalledNumbers" component={HostCalledNumbers} />
                    <Stack.Screen name="HostGameOptions" component={HostGameOptions} />
                    <Stack.Screen name="HostGameReward" component={HostGameReward} />
                    <Stack.Screen name="HostLiveChat" component={HostLiveChat} />
                  </>
                )}
              </>
            ) : (
              <>
                {/* AUTH SCREENS */}
                <Stack.Screen name="Login">
                  {(props) => (
                    <Login {...props} onLoginSuccess={handleLoginSuccess} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="ChooseRole" component={ChooseRole} />
                <Stack.Screen name="MobileVerify" component={MobileVerify} />
                <Stack.Screen name="MobileVerifyOtp" component={MobileVerifyOtp} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerify} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
              </>
            )}
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
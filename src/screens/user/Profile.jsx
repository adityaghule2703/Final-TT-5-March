// import React, { useEffect, useState, useRef } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   Modal,
//   SafeAreaView,
//   Animated,
//   RefreshControl,
//   Dimensions,
//   FlatList,
//   PermissionsAndroid,
//   Platform,
//   Linking,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import {
//   launchCamera,
//   launchImageLibrary,
// } from 'react-native-image-picker';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');
// const BASE_URL = "https://tambolatime.co.in/public/";

// // Color palette matching Game component
// const COLORS = {
//   background: '#F0F7FF',
//   surface: '#FFFFFF',
//   primary: '#2E5BFF', // Vibrant blue
//   primaryLight: '#E1EBFF',
//   primaryDark: '#1A3A9E',
//   accent: '#3B82F6', // Medium blue for accents
//   secondary: '#60A5FA', // Light blue
//   tertiary: '#2563EB', // Darker blue for contrast
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
  
//   // Card background variants
//   cardBlue1: '#E8F0FE',
//   cardBlue2: '#D4E4FF',
//   cardBlue3: '#C2D6FF',
//   cardBlue4: '#E3F2FD',
//   cardBlue5: '#E6F0FA',
  
//   // Accent colors
//   purple: '#8B5CF6',
//   purpleLight: '#EDE9FE',
//   orange: '#F97316',
//   orangeLight: '#FFF3E6',
//   pink: '#EC4899',
//   pinkLight: '#FCE8F0',
//   teal: '#14B8A6',
//   tealLight: '#D5F5F0',
//   red: '#EF4444',
//   redLight: '#FEE2E2',
//   green: '#10B981',
//   greenLight: '#D1FAE5',
  
//   // Block colors - Blue shades
//   blockLightBlue: '#E1EBFF',
//   blockMediumBlue: '#C2D6FF',
//   blockDarkBlue: '#A3C1FF',
// };

// const Profile = ({ onLogout, navigation }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//   });
//   const [imageUri, setImageUri] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [notificationModalVisible, setNotificationModalVisible] = useState(false);
//   const [loadingNotifications, setLoadingNotifications] = useState(false);
  
//   // Animation values
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   // Helper function to get full image URL
//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
    
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//     return BASE_URL + cleanPath;
//   };

//   useEffect(() => {
//     fetchProfile();
//     requestPermissions();
//     fetchNotifications();
    
//     // Start fade animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   // Animated background that moves with scroll
//   const AnimatedBackground = () => {
//     const block1TranslateY = scrollY.interpolate({
//       inputRange: [0, 300],
//       outputRange: [0, -50],
//       extrapolate: 'clamp'
//     });

//     const block2TranslateY = scrollY.interpolate({
//       inputRange: [0, 400],
//       outputRange: [0, -30],
//       extrapolate: 'clamp'
//     });

//     const block3TranslateY = scrollY.interpolate({
//       inputRange: [0, 500],
//       outputRange: [0, -20],
//       extrapolate: 'clamp'
//     });

//     const opacity = scrollY.interpolate({
//       inputRange: [0, 200, 400],
//       outputRange: [1, 0.8, 0.6],
//       extrapolate: 'clamp'
//     });

//     return (
//       <>
//         <Animated.View 
//           style={[
//             styles.blueBlock1,
//             {
//               transform: [{ translateY: block1TranslateY }],
//               opacity
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock2,
//             {
//               transform: [{ translateY: block2TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.4, 0.8]
//               })
//             }
//           ]} 
//         />
//         <Animated.View 
//           style={[
//             styles.blueBlock3,
//             {
//               transform: [{ translateY: block3TranslateY }],
//               opacity: opacity.interpolate({
//                 inputRange: [0.6, 1],
//                 outputRange: [0.2, 0.5]
//               })
//             }
//           ]} 
//         />
//       </>
//     );
//   };

//   // Card Background with only circles (removed all patterns)
//   const CardBackground = ({ accentColor = COLORS.primary }) => (
//     <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
//       {/* Decorative circles only */}
//       <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
//       {/* Floating particles - subtle dots */}
//       <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
//       <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
//       <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
//     </View>
//   );

//   // Enhanced Header with UK pattern (keeping header pattern as it's not on cards)
//   const Header = () => (
//     <View style={styles.headerWrapper}>
//       {/* Semicircle Background */}
//       <View style={styles.semicircleBackground}>
//         <View style={styles.semicircle} />
//       </View>
      
//       {/* UK-style Rounded Lines Pattern (only in header) */}
//       <View style={styles.ukPatternContainer}>
//         <View style={styles.curvedLine1} />
//         <View style={styles.curvedLine2} />
//         <View style={styles.curvedLine3} />
        
//         <View style={styles.parallelLines}>
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//           <View style={styles.parallelLine} />
//         </View>
        
//         <View style={styles.dottedCircle1}>
//           {[...Array(8)].map((_, i) => (
//             <View 
//               key={i} 
//               style={[
//                 styles.dottedCircleDot,
//                 {
//                   transform: [
//                     { rotate: `${i * 45}deg` },
//                     { translateX: 30 }
//                   ]
//                 }
//               ]} 
//             />
//           ))}
//         </View>
        
//         <View style={styles.decorativeDot1} />
//         <View style={styles.decorativeDot2} />
//         <View style={styles.decorativeLine1} />
//         <View style={styles.decorativeLine2} />
//       </View>

//       {/* Header Content */}
//       <View style={styles.headerContent}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={22} color={COLORS.primary} />
//           </TouchableOpacity>
          
//           <Text style={styles.headerTitle}>My Profile</Text>
          
//           <TouchableOpacity
//             style={styles.notificationButton}
//             onPress={openNotificationModal}
//           >
//             <Icon name="notifications-outline" size={22} color={COLORS.primary} />
//             {notifications.length > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>
//                   {notifications.length > 99 ? '99+' : notifications.length}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.headerSubtitle}>Manage your account settings</Text>
//       </View>
//     </View>
//   );

//   const animateButton = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, {
//         toValue: 0.95,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const androidVersion = Platform.Version;
        
//         let permissions = [];
        
//         if (androidVersion >= 33) {
//           permissions = [
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           ];
//         } else {
//           permissions = [
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           ];
//         }
        
//         const checks = await Promise.all(
//           permissions.map(permission => PermissionsAndroid.check(permission))
//         );
        
//         const allGranted = checks.every(check => check === true);
        
//         if (allGranted) {
//           return;
//         }
        
//         const permissionsToRequest = permissions.filter((_, index) => !checks[index]);
        
//         if (permissionsToRequest.length === 0) {
//           return;
//         }
        
//         const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);
        
//         const requestedGranted = Object.values(results).every(
//           result => result === PermissionsAndroid.RESULTS.GRANTED
//         );
        
//         if (!requestedGranted) {
//           const cameraRationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
//             PermissionsAndroid.PERMISSIONS.CAMERA
//           );
          
//           if (!cameraRationale) {
//             Alert.alert(
//               "Permission Required",
//               "This app needs camera and photo library access to update your profile picture. Please enable permissions in app settings.",
//               [
//                 {
//                   text: "Cancel",
//                   style: "cancel"
//                 },
//                 {
//                   text: "Open Settings",
//                   onPress: () => {
//                     if (Platform.OS === 'android') {
//                       Linking.openSettings();
//                     }
//                   }
//                 }
//               ]
//             );
//           }
//         }
//       } catch (err) {
//         console.warn("Permission error:", err);
//       }
//     }
//   };

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     fetchProfile();
//     fetchNotifications();
//     setTimeout(() => setRefreshing(false), 1000);
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         `${BASE_URL}api/user/profile`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       if (res.data.user) {
//         setUser(res.data.user);
//         setFormData({
//           name: res.data.user.name || "",
//         });
        
//         if (res.data.user.profile_image_url) {
//           setImageUri(res.data.user.profile_image_url);
//         } else if (res.data.user.profile_image) {
//           setImageUri(getFullImageUrl(res.data.user.profile_image));
//         }
//       }
//     } catch (error) {
//       console.log("Fetch profile error:", error);
//       Alert.alert("Error", "Failed to fetch profile information");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       setLoadingNotifications(true);
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get(
//         `${BASE_URL}api/user/notifications`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status) {
//         setNotifications(res.data.data || []);
//       }
//     } catch (error) {
//       console.log("Error fetching notifications:", error);
//     } finally {
//       setLoadingNotifications(false);
//     }
//   };

//   const openNotificationModal = () => {
//     setNotificationModalVisible(true);
//   };

//   const handleImagePick = async (source) => {
//     setImageModalVisible(false);
    
//     const options = {
//       mediaType: 'photo',
//       maxWidth: 500,
//       maxHeight: 500,
//       quality: 0.8,
//       includeBase64: false,
//       saveToPhotos: false,
//       selectionLimit: 1,
//     };
    
//     try {
//       let result;
      
//       if (source === "camera") {
//         result = await launchCamera(options);
//       } else {
//         result = await launchImageLibrary(options);
//       }

//       if (result.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (result.errorCode) {
//         console.log('ImagePicker Error: ', result.errorMessage);
//         Alert.alert("Error", result.errorMessage || "Failed to pick image");
//       } else if (result.assets && result.assets.length > 0) {
//         const selectedImage = result.assets[0];
//         setImageUri(selectedImage.uri);
//       }
//     } catch (error) {
//       console.log("Image picker error:", error);
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };

//   const updateProfile = async () => {
//     if (!formData.name.trim()) {
//       Alert.alert("Error", "Name is required", [{ text: "OK" }]);
//       return;
//     }

//     setSaving(true);
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const formDataToSend = new FormData();

//       formDataToSend.append("name", formData.name);

//       if (imageUri && 
//           !imageUri.startsWith(BASE_URL) && 
//           !imageUri.startsWith('http') &&
//           (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
//         const localUri = imageUri;
//         const filename = localUri.split('/').pop();
        
//         let type = 'image/jpeg';
//         if (filename) {
//           const match = /\.(\w+)$/.exec(filename);
//           if (match) {
//             type = `image/${match[1]}`;
//           }
//         }

//         formDataToSend.append('profile_image', {
//           uri: localUri,
//           name: filename || `profile_${Date.now()}.jpg`,
//           type,
//         });
//       }

//       const response = await axios.post(
//         `${BASE_URL}api/user/profile`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data.user) {
//         setUser(response.data.user);
//         Alert.alert("Success", "Profile updated successfully!");
//         setEditMode(false);
        
//         if (response.data.user.profile_image_url) {
//           setImageUri(response.data.user.profile_image_url);
//         } else if (response.data.user.profile_image) {
//           setImageUri(getFullImageUrl(response.data.user.profile_image));
//         }
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       console.log("Update error:", error.response?.data || error.message);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to update profile"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const logoutUser = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Logout", style: "destructive", onPress: performLogout }
//       ]
//     );
//   };

//   const performLogout = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       await axios.post(
//         `${BASE_URL}api/user/logout`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await AsyncStorage.removeItem("token");
//       await AsyncStorage.removeItem("user");

//       Alert.alert("Success", "You have been logged out successfully.");
//       onLogout();
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Something went wrong. Please try again.");
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleNavigation = (screenName) => {
//     if (navigation && navigation.navigate) {
//       navigation.navigate(screenName);
//     } else {
//       console.warn(`Navigation not available. Attempted to navigate to: ${screenName}`);
//       Alert.alert("Info", `${screenName} page will open here`);
//     }
//   };

//   const renderNotificationItem = ({ item }) => (
//     <View style={styles.notificationItem}>
//       <View style={[styles.notificationIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//         <Icon name="notifications" size={18} color={COLORS.primary} />
//       </View>
//       <View style={styles.notificationContent}>
//         <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
//         <Text style={styles.notificationMessage}>
//           {item.message || "Check out the new features!"}
//         </Text>
//         <Text style={styles.notificationDate}>
//           {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
//         </Text>
//       </View>
//     </View>
//   );

//   const handleScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//     { useNativeDriver: false }
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text style={styles.loadingText}>Loading Profile...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       {/* Animated Color Blocks */}
//       <AnimatedBackground />

//       <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
//         <Animated.ScrollView
//           showsVerticalScrollIndicator={false}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor={COLORS.primary}
//               colors={[COLORS.primary]}
//             />
//           }
//         >
//           {/* Enhanced Header */}
//           <Header />

//           {/* PROFILE CARD */}
//           <View style={styles.profileCard}>
//             <CardBackground accentColor={COLORS.primary} />
            
//             <View style={styles.profileHeader}>
//               <TouchableOpacity
//                 onPress={() => editMode && setImageModalVisible(true)}
//                 disabled={!editMode}
//                 style={styles.imageContainer}
//               >
//                 <Image
//                   source={{
//                     uri: imageUri
//                       ? imageUri
//                       : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
//                   }}
//                   style={[
//                     styles.profileImage,
//                     editMode && styles.profileImageEdit,
//                   ]}
//                   onError={() => setImageUri(null)}
//                 />
//                 {editMode && (
//                   <View style={[styles.editImageBadge, { backgroundColor: COLORS.primary }]}>
//                     <Icon name="camera" size={14} color="#FFFFFF" />
//                   </View>
//                 )}
//               </TouchableOpacity>

//               {editMode ? (
//                 <View style={styles.nameInputContainer}>
//                   <TextInput
//                     style={styles.nameInput}
//                     value={formData.name}
//                     onChangeText={(text) => handleInputChange("name", text)}
//                     placeholder="Enter your name"
//                     placeholderTextColor={COLORS.textLight}
//                   />
//                 </View>
//               ) : (
//                 <View style={styles.nameContainer}>
//                   <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
//                   <View style={[styles.userRoleBadge, { backgroundColor: `${COLORS.primary}15` }]}>
//                     <Icon name="star" size={12} color={COLORS.primary} />
//                     <Text style={[styles.userRole, { color: COLORS.primary }]}>Premium Member</Text>
//                   </View>
//                 </View>
//               )}

//               <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//                 <TouchableOpacity
//                   style={[styles.editButton, editMode && { backgroundColor: COLORS.green }]}
//                   onPress={() => {
//                     animateButton();
//                     if (editMode) {
//                       updateProfile();
//                     } else {
//                       setEditMode(true);
//                     }
//                   }}
//                   disabled={saving}
//                 >
//                   <Icon 
//                     name={editMode ? "checkmark" : "pencil"} 
//                     size={16} 
//                     color="#FFFFFF" 
//                   />
//                   <Text style={styles.editButtonText}>
//                     {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
//                   </Text>
//                 </TouchableOpacity>
//               </Animated.View>

//               {editMode && (
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => {
//                     setEditMode(false);
//                     setFormData({
//                       name: user?.name || "",
//                     });
//                     if (user?.profile_image_url) {
//                       setImageUri(user.profile_image_url);
//                     } else if (user?.profile_image) {
//                       setImageUri(getFullImageUrl(user.profile_image));
//                     } else {
//                       setImageUri(null);
//                     }
//                   }}
//                 >
//                   <Icon name="close" size={16} color={COLORS.textLight} />
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           {/* ACCOUNT INFORMATION */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Icon name="person-circle" size={20} color={COLORS.primary} />
//               <Text style={styles.sectionTitle}>Account Information</Text>
//             </View>
            
//             <View style={styles.infoCard}>
//               <CardBackground accentColor={COLORS.purple} />
              
//               <View style={styles.infoRow}>
//                 <View style={[styles.infoIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                   <Icon name="mail" size={16} color={COLORS.primary} />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Email Address</Text>
//                   <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
//                 </View>
//               </View>
              
//               <View style={styles.infoDivider} />
              
//               <View style={styles.infoRow}>
//                 <View style={[styles.infoIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                   <Icon name="phone-portrait" size={16} color={COLORS.purple} />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Mobile Number</Text>
//                   <Text style={styles.infoValue}>{user?.mobile || "N/A"}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* REFERRAL & STATS */}
//           {!editMode && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Icon name="stats-chart" size={20} color={COLORS.primary} />
//                 <Text style={styles.sectionTitle}>Stats & Referral</Text>
//               </View>
              
//               <View style={styles.statsCard}>
//                 <CardBackground accentColor={COLORS.teal} />
                
//                 <View style={styles.statsGrid}>
//                   <View style={styles.statItem}>
//                     <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
//                       <Icon name="gift" size={20} color={COLORS.primary} />
//                     </View>
//                     <Text style={styles.statLabel}>Referral Code</Text>
//                     <View style={styles.statValueContainer}>
//                       <Text style={styles.statValue}>{user?.referral_code || "N/A"}</Text>
//                       <TouchableOpacity style={styles.copyButton}>
//                         <Icon name="copy-outline" size={14} color={COLORS.primary} />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
                  
//                   <View style={styles.statItem}>
//                     <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.purple}15` }]}>
//                       <Icon name="star" size={20} color={COLORS.purple} />
//                     </View>
//                     <Text style={styles.statLabel}>Referral Points</Text>
//                     <Text style={styles.statValue}>{user?.referral_points || "0"}</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.infoDivider} />
                
//                 <View style={styles.infoRow}>
//                   <View style={[styles.infoIcon, { backgroundColor: `${COLORS.green}15` }]}>
//                     <Icon name="shield-checkmark" size={16} color={COLORS.green} />
//                   </View>
//                   <View style={styles.infoContent}>
//                     <Text style={styles.infoLabel}>Account Status</Text>
//                     <View style={[styles.statusBadge, { backgroundColor: `${COLORS.green}15` }]}>
//                       <Text style={[styles.statusText, { color: COLORS.green }]}>Active</Text>
//                     </View>
//                   </View>
//                 </View>
                
//                 <View style={styles.infoRow}>
//                   <View style={[styles.infoIcon, { backgroundColor: `${COLORS.orange}15` }]}>
//                     <Icon name="people" size={16} color={COLORS.orange} />
//                   </View>
//                   <View style={styles.infoContent}>
//                     <Text style={styles.infoLabel}>Under Referral</Text>
//                     <Text style={styles.infoValue}>{user?.under_referral || "N/A"}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           )}

//           {/* SETTINGS OPTIONS */}
//           {!editMode && (
//             <View style={styles.section}>
//               <View style={styles.sectionHeader}>
//                 <Icon name="settings" size={20} color={COLORS.primary} />
//                 <Text style={styles.sectionTitle}>Settings</Text>
//               </View>
              
//               <View style={styles.optionsCard}>
//                 <CardBackground accentColor={COLORS.orange} />
                
//                 {[
//                   { 
//                     icon: "ticket", 
//                     title: "My Tickets", 
//                     description: "View your game tickets",
//                     color: COLORS.primary,
//                     onPress: () => handleNavigation('TicketsScreen')
//                   },
//                   { 
//                     icon: "notifications", 
//                     title: "Notifications", 
//                     description: "View all notifications",
//                     color: COLORS.purple,
//                     onPress: openNotificationModal
//                   },
//                   { 
//                     icon: "lock-closed", 
//                     title: "Privacy & Security", 
//                     description: "Security settings",
//                     color: COLORS.teal,
//                     onPress: () => Alert.alert("Coming Soon", "Privacy & Security settings will be available soon!")
//                   },
//                   { 
//                     icon: "help-circle", 
//                     title: "Help & Support", 
//                     description: "Get help & support",
//                     color: COLORS.orange,
//                     onPress: () => Alert.alert("Help & Support", "Contact support@example.com for assistance")
//                   },
//                 ].map((item, index) => (
//                   <TouchableOpacity 
//                     key={index} 
//                     style={styles.optionItem}
//                     onPress={item.onPress}
//                   >
//                     <View style={[styles.optionIcon, { backgroundColor: `${item.color}15` }]}>
//                       <Icon name={item.icon} size={20} color={item.color} />
//                     </View>
//                     <View style={styles.optionContent}>
//                       <Text style={styles.optionTitle}>{item.title}</Text>
//                       <Text style={styles.optionDescription}>{item.description}</Text>
//                     </View>
//                     <Icon name="chevron-forward" size={18} color={COLORS.textLight} />
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity 
//             style={styles.logoutButton}
//             onPress={logoutUser}
//           >
//             <View style={[styles.logoutIcon, { backgroundColor: `${COLORS.red}20` }]}>
//               <Icon name="log-out" size={20} color={COLORS.red} />
//             </View>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           {/* BOTTOM SPACE */}
//           <View style={styles.bottomSpace} />
//         </Animated.ScrollView>
//       </Animated.View>

//       {/* IMAGE SELECTION MODAL */}
//       <Modal
//         visible={imageModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setImageModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <CardBackground accentColor={COLORS.primary} />
            
//             <Text style={styles.modalTitle}>Update Profile Picture</Text>
//             <Text style={styles.modalSubtitle}>Choose how you want to update your profile picture</Text>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => handleImagePick("camera")}
//             >
//               <View style={[styles.modalOptionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//                 <Icon name="camera" size={22} color={COLORS.primary} />
//               </View>
//               <View style={styles.modalOptionContent}>
//                 <Text style={styles.modalOptionTitle}>Take Photo</Text>
//                 <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
//               </View>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.modalOption}
//               onPress={() => handleImagePick("gallery")}
//             >
//               <View style={[styles.modalOptionIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//                 <Icon name="images" size={22} color={COLORS.purple} />
//               </View>
//               <View style={styles.modalOptionContent}>
//                 <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
//                 <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
//               </View>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={styles.modalCancelButton}
//               onPress={() => setImageModalVisible(false)}
//             >
//               <Text style={styles.modalCancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* NOTIFICATION MODAL */}
//       <Modal
//         visible={notificationModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setNotificationModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, styles.notificationModalContent]}>
//             <CardBackground accentColor={COLORS.primary} />
            
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Notifications</Text>
//               <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
//                 <Icon name="close" size={22} color={COLORS.text} />
//               </TouchableOpacity>
//             </View>

//             {loadingNotifications ? (
//               <View style={styles.loadingContainerModal}>
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//                 <Text style={styles.loadingTextModal}>Loading notifications...</Text>
//               </View>
//             ) : notifications.length > 0 ? (
//               <FlatList
//                 data={notifications}
//                 renderItem={renderNotificationItem}
//                 keyExtractor={(item, index) => index.toString()}
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.notificationList}
//               />
//             ) : (
//               <View style={styles.emptyNotifications}>
//                 <Icon name="notifications-off" size={40} color={COLORS.textLight} />
//                 <Text style={styles.emptyText}>No notifications yet</Text>
//               </View>
//             )}

//             <TouchableOpacity
//               style={[styles.closeBtn, { backgroundColor: COLORS.primary }]}
//               onPress={() => setNotificationModalVisible(false)}
//             >
//               <Text style={styles.closeBtnText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 14,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   content: {
//     flex: 1,
//   },
  
//   /* COLOR BLOCKS - Animated */
//   blueBlock1: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 280,
//     backgroundColor: COLORS.blockLightBlue,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//   },
//   blueBlock2: {
//     position: 'absolute',
//     top: 200,
//     left: 0,
//     right: 0,
//     height: 160,
//     backgroundColor: COLORS.blockMediumBlue,
//   },
//   blueBlock3: {
//     position: 'absolute',
//     top: 300,
//     left: 0,
//     right: 0,
//     height: 100,
//     backgroundColor: COLORS.blockDarkBlue,
//     opacity: 0.3,
//   },
  
//   /* Card Background */
//   cardBackground: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: 20,
//   },
  
//   /* Decorative circles */
//   cardDecorativeCircle: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     opacity: 0.08,
//   },
//   circle1: {
//     top: -30,
//     right: -30,
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   circle2: {
//     bottom: -20,
//     left: -20,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     opacity: 0.06,
//   },
//   circle3: {
//     top: '40%',
//     left: '30%',
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     opacity: 0.05,
//   },
  
//   /* Floating particles */
//   floatingParticle: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     opacity: 0.12,
//   },
//   particle1: {
//     top: 20,
//     right: 40,
//     width: 6,
//     height: 6,
//   },
//   particle2: {
//     bottom: 30,
//     left: 50,
//     width: 5,
//     height: 5,
//   },
//   particle3: {
//     top: '60%',
//     right: 60,
//     width: 7,
//     height: 7,
//   },
//   particle4: {
//     bottom: '20%',
//     left: 80,
//     width: 4,
//     height: 4,
//   },
  
//   /* Enhanced Header */
//   headerWrapper: {
//     position: 'relative',
//     marginTop: 8,
//     marginBottom: 16,
//     overflow: 'hidden',
//     paddingHorizontal: 16,
//   },
  
//   semicircleBackground: {
//     position: 'absolute',
//     top: -40,
//     right: -30,
//     width: 200,
//     height: 200,
//     overflow: 'hidden',
//   },
//   semicircle: {
//     position: 'absolute',
//     width: 400,
//     height: 200,
//     backgroundColor: COLORS.primaryLight,
//     borderTopLeftRadius: 200,
//     borderTopRightRadius: 200,
//     transform: [{ rotate: '-15deg' }],
//     opacity: 0.3,
//   },
  
//   ukPatternContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
  
//   curvedLine1: {
//     position: 'absolute',
//     top: 20,
//     right: 50,
//     width: 80,
//     height: 40,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderRightWidth: 0,
//     borderRadius: 40,
//     opacity: 0.15,
//     transform: [{ rotate: '-10deg' }],
//   },
//   curvedLine2: {
//     position: 'absolute',
//     bottom: 10,
//     left: 30,
//     width: 60,
//     height: 30,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderBottomWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 30,
//     opacity: 0.15,
//     transform: [{ rotate: '15deg' }],
//   },
//   curvedLine3: {
//     position: 'absolute',
//     top: 40,
//     left: 100,
//     width: 100,
//     height: 50,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     borderTopWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 50,
//     opacity: 0.1,
//     transform: [{ rotate: '20deg' }],
//   },
  
//   parallelLines: {
//     position: 'absolute',
//     top: 30,
//     left: 20,
//   },
//   parallelLine: {
//     width: 80,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     marginVertical: 4,
//     borderRadius: 1,
//   },
  
//   dottedCircle1: {
//     position: 'absolute',
//     bottom: 20,
//     right: 30,
//     width: 60,
//     height: 60,
//   },
//   dottedCircleDot: {
//     position: 'absolute',
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//     top: 28,
//     left: 28,
//   },
  
//   decorativeDot1: {
//     position: 'absolute',
//     top: 60,
//     right: 80,
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.primary,
//     opacity: 0.2,
//   },
//   decorativeDot2: {
//     position: 'absolute',
//     bottom: 40,
//     left: 150,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.primary,
//     opacity: 0.15,
//   },
//   decorativeLine1: {
//     position: 'absolute',
//     top: 10,
//     left: 150,
//     width: 40,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '30deg' }],
//   },
//   decorativeLine2: {
//     position: 'absolute',
//     bottom: 30,
//     right: 100,
//     width: 50,
//     height: 2,
//     backgroundColor: COLORS.primary,
//     opacity: 0.1,
//     borderRadius: 1,
//     transform: [{ rotate: '-20deg' }],
//   },
  
//   headerContent: {
//     position: 'relative',
//     zIndex: 2,
//     marginTop: 7
//   },
//   headerTopRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     fontWeight: "500",
//     marginLeft: 4,
//   },
//   notificationButton: {
//     position: "relative",
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: COLORS.surface,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   badge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     backgroundColor: COLORS.red,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: COLORS.surface,
//     paddingHorizontal: 3,
//   },
//   badgeText: {
//     color: "#FFFFFF",
//     fontSize: 9,
//     fontWeight: "700",
//   },
  
//   /* Profile Card */
//   profileCard: {
//     borderRadius: 20,
//     marginHorizontal: 16,
//     marginBottom: 24,
//     padding: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   profileHeader: {
//     alignItems: "center",
//     zIndex: 2,
//   },
//   imageContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   profileImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     borderWidth: 3,
//     borderColor: COLORS.surface,
//     backgroundColor: COLORS.background,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   profileImageEdit: {
//     borderColor: COLORS.primary,
//   },
//   editImageBadge: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   nameContainer: {
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginBottom: 6,
//   },
//   userRoleBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 20,
//     gap: 4,
//   },
//   userRole: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   nameInputContainer: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   nameInput: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: COLORS.text,
//     textAlign: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//   },
//   editButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   editButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   cancelButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//     marginTop: 12,
//   },
//   cancelButtonText: {
//     color: COLORS.textLight,
//     fontWeight: "500",
//     fontSize: 13,
//   },
  
//   /* Section */
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
  
//   /* Info Card */
//   infoCard: {
//     borderRadius: 16,
//     padding: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     zIndex: 2,
//   },
//   infoIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   infoContent: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
//   },
//   infoValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//   },
//   infoDivider: {
//     height: 1,
//     backgroundColor: COLORS.border,
//     marginVertical: 4,
//   },
  
//   /* Status Badge */
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
  
//   /* Stats Card */
//   statsCard: {
//     borderRadius: 16,
//     padding: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   statsGrid: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 12,
//     zIndex: 2,
//   },
//   statItem: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 12,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   statLabel: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginBottom: 4,
//     fontWeight: "500",
//   },
//   statValueContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   statValue: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: COLORS.text,
//   },
//   copyButton: {
//     padding: 2,
//   },
  
//   /* Options Card */
//   optionsCard: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     position: 'relative',
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     zIndex: 2,
//     backgroundColor: COLORS.surface,
//   },
//   optionIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   optionContent: {
//     flex: 1,
//   },
//   optionTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   optionDescription: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
  
//   /* Logout Button */
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.surface,
//     marginHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//     marginTop: 8,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: COLORS.red,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   logoutIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoutText: {
//     color: COLORS.red,
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   bottomSpace: {
//     height: 20,
//   },
  
//   /* Modal Styles */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   modalContent: {
//     width: "100%",
//     maxWidth: 380,
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     padding: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   notificationModalContent: {
//     width: "90%",
//     maxHeight: "80%",
//     maxWidth: "none",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     zIndex: 2,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: COLORS.text,
//     zIndex: 2,
//   },
//   modalSubtitle: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     textAlign: "center",
//     marginBottom: 20,
//     zIndex: 2,
//   },
//   modalOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.background,
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     zIndex: 2,
//   },
//   modalOptionIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   modalOptionContent: {
//     flex: 1,
//   },
//   modalOptionTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   modalOptionDescription: {
//     fontSize: 11,
//     color: COLORS.textLight,
//   },
//   modalCancelButton: {
//     backgroundColor: "transparent",
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     marginTop: 8,
//     zIndex: 2,
//   },
//   modalCancelText: {
//     color: COLORS.textLight,
//     fontWeight: "600",
//     fontSize: 14,
//   },
  
//   /* Notification Modal */
//   notificationItem: {
//     flexDirection: "row",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//     zIndex: 2,
//   },
//   notificationIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   notificationMessage: {
//     fontSize: 11,
//     color: COLORS.textLight,
//     marginBottom: 4,
//   },
//   notificationDate: {
//     fontSize: 9,
//     color: COLORS.textLight,
//   },
//   notificationList: {
//     paddingBottom: 8,
//   },
//   emptyNotifications: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 40,
//     zIndex: 2,
//   },
//   emptyText: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     marginTop: 8,
//   },
//   loadingContainerModal: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 40,
//     zIndex: 2,
//   },
//   loadingTextModal: {
//     marginTop: 10,
//     fontSize: 13,
//     color: COLORS.textLight,
//   },
//   closeBtn: {
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 16,
//     zIndex: 2,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   closeBtnText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });








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
  TextInput,
  Alert,
  Linking,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

// Color scheme matching the Home component
const COLORS = {
  primary: "#4facfe", // Main blue color
  accent: "#ff9800", // Orange accent
  background: "#f5f8ff", // Light background
  surface: "#FFFFFF",
  textDark: "#333333",
  textLight: "#777777",
  border: "#EEEEEE",
  
  // Status colors
  live: "#4CAF50",
  scheduled: "#ff9800",
  completed: "#9E9E9E",
  
  // Quick action colors
  deposit: "#4facfe",
  withdraw: "#FF6B6B",
  refer: "#4ECDC4",
  support: "#9B59B6",
  
  // Additional colors
  purple: "#9B59B6",
  purpleLight: "#F3E5F5",
  orange: "#FF9800",
  orangeLight: "#FFF3E0",
  teal: "#4ECDC4",
  tealLight: "#E0F2F1",
  pink: "#FF6B6B",
  pinkLight: "#FFE5E5",
  red: "#EF4444",
  redLight: "#FEE2E2",
  green: "#10B981",
  greenLight: "#D1FAE5",
};

const BASE_URL = "https://tambolatime.co.in/public/";

const Profile = ({ onLogout }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return BASE_URL + cleanPath;
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    startAnimations();
    
    // Entrance animation
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
  }, []);

  const startAnimations = () => {
    // Floating animations
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

    // Pulse animation
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

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.user) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
        });
        
        if (res.data.user.profile_image_url) {
          setImageUri(res.data.user.profile_image_url);
        } else if (res.data.user.profile_image) {
          setImageUri(getFullImageUrl(res.data.user.profile_image));
        }
      }
    } catch (error) {
      console.log("Fetch profile error:", error);
      Alert.alert("Error", "Failed to fetch profile information");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(
        `${BASE_URL}api/user/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        setNotifications(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchProfile(), fetchNotifications()]).finally(() => setRefreshing(false));
  }, []);

  const handleImagePick = async (source) => {
    setImageModalVisible(false);
    
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: false,
      selectionLimit: 1,
    };
    
    try {
      let result;
      
      if (source === "camera") {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
      } else if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const updateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);

      if (imageUri && 
          !imageUri.startsWith(BASE_URL) && 
          !imageUri.startsWith('http') &&
          (imageUri.startsWith('file://') || imageUri.startsWith('content://'))) {
        const localUri = imageUri;
        const filename = localUri.split('/').pop();
        
        let type = 'image/jpeg';
        if (filename) {
          const match = /\.(\w+)$/.exec(filename);
          if (match) {
            type = `image/${match[1]}`;
          }
        }

        formDataToSend.append('profile_image', {
          uri: localUri,
          name: filename || `profile_${Date.now()}.jpg`,
          type,
        });
      }

      const response = await axios.post(
        `${BASE_URL}api/user/profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.user) {
        setUser(response.data.user);
        Alert.alert("Success", "Profile updated successfully!");
        setEditMode(false);
        
        if (response.data.user.profile_image_url) {
          setImageUri(response.data.user.profile_image_url);
        } else if (response.data.user.profile_image) {
          setImageUri(getFullImageUrl(response.data.user.profile_image));
        }
      }
    } catch (error) {
      console.log("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const logoutUser = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.post(
                `${BASE_URL}api/user/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              onLogout();
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          }
        }
      ]
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account settings</Text>
      </View>

      <TouchableOpacity 
        style={styles.notification}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

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

  const InfoCard = ({ icon, label, value, color }) => (
    <View style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "N/A"}</Text>
      </View>
    </View>
  );

  const SettingItem = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
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
        {/* Header */}
        <Header />

        {/* Animated Background Elements */}
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
          {/* Profile Hero Section */}
          <Animated.View 
            style={[
              styles.profileHeroSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.profileHeroContent}>
              <TouchableOpacity
                onPress={() => editMode && setImageModalVisible(true)}
                disabled={!editMode}
                style={styles.profileImageContainer}
              >
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
                  }}
                  style={styles.profileImage}
                />
                {editMode && (
                  <View style={[styles.editImageBadge, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="camera" size={16} color={COLORS.surface} />
                  </View>
                )}
              </TouchableOpacity>

              {editMode ? (
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
                  <View style={styles.profileBadge}>
                    <Ionicons name="star" size={14} color={COLORS.accent} />
                    <Text style={styles.profileBadgeText}>Premium Member</Text>
                  </View>
                </>
              )}

              <View style={styles.profileActions}>
                <TouchableOpacity
                  style={[styles.profileActionButton, editMode && { backgroundColor: COLORS.green }]}
                  onPress={() => {
                    if (editMode) {
                      updateProfile();
                    } else {
                      setEditMode(true);
                    }
                  }}
                  disabled={saving}
                >
                  <Ionicons 
                    name={editMode ? "checkmark" : "pencil"} 
                    size={16} 
                    color={COLORS.surface} 
                  />
                  <Text style={styles.profileActionText}>
                    {saving ? "Saving..." : editMode ? "Save Changes" : "Edit Profile"}
                  </Text>
                </TouchableOpacity>

                {editMode && (
                  <TouchableOpacity
                    style={styles.profileCancelButton}
                    onPress={() => {
                      setEditMode(false);
                      setFormData({ name: user?.name || "" });
                      if (user?.profile_image_url) {
                        setImageUri(user.profile_image_url);
                      } else if (user?.profile_image) {
                        setImageUri(getFullImageUrl(user.profile_image));
                      } else {
                        setImageUri(null);
                      }
                    }}
                  >
                    <Ionicons name="close" size={16} color={COLORS.textLight} />
                    <Text style={styles.profileCancelText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <StatCard number={user?.referral_points || "0"} label="Referral Points" icon="star" color={COLORS.primary} />
            <StatCard number="24/7" label="Support" icon="headset" color={COLORS.purple} />
            <StatCard number="10+" label="Games Played" icon="game-controller" color={COLORS.teal} />
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="person-circle" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <InfoCard 
                icon="mail" 
                label="Email Address" 
                value={user?.email} 
                color={COLORS.primary}
              />
              <InfoCard 
                icon="call" 
                label="Mobile Number" 
                value={user?.mobile} 
                color={COLORS.purple}
              />
              <InfoCard 
                icon="gift" 
                label="Referral Code" 
                value={user?.referral_code} 
                color={COLORS.teal}
              />
              <InfoCard 
                icon="people" 
                label="Under Referral" 
                value={user?.under_referral || "None"} 
                color={COLORS.orange}
              />
            </View>
          </View>

          {/* Account Status */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>ACCOUNT STATUS</Text>
              </View>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusPattern} />
              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: COLORS.green }]} />
                <View>
                  <Text style={styles.statusLabel}>Account Status</Text>
                  <Text style={styles.statusValue}>Active</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Verified</Text>
                </View>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: COLORS.primary }]} />
                <View>
                  <Text style={styles.statusLabel}>Member Since</Text>
                  <Text style={styles.statusValue}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="settings" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
              </View>
            </View>

            <View style={styles.settingsCard}>
              <SettingItem 
                icon="ticket"
                title="My Tickets"
                description="View your purchased tickets"
                color={COLORS.primary}
                onPress={() => Alert.alert("Coming Soon", "My Tickets feature coming soon!")}
              />
              <SettingItem 
                icon="wallet"
                title="Wallet"
                description="Manage your balance"
                color={COLORS.purple}
                onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
              />
              <SettingItem 
                icon="lock-closed"
                title="Privacy & Security"
                description="Manage your security settings"
                color={COLORS.teal}
                onPress={() => Alert.alert("Coming Soon", "Privacy settings coming soon!")}
              />
              <SettingItem 
                icon="help-circle"
                title="Help & Support"
                description="Get help with your account"
                color={COLORS.orange}
                onPress={() => Linking.openURL('mailto:support@tambolatimez.com')}
              />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="time" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityPattern} />
              
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="game-controller" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Joined Game</Text>
                  <Text style={styles.activitySubtitle}>Tambola Classic #123</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>

              <View style={styles.activityDivider} />

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: COLORS.orange + '15' }]}>
                  <Ionicons name="trophy" size={20} color={COLORS.orange} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Won Prize</Text>
                  <Text style={styles.activitySubtitle}>₹500 in Speed Tambola</Text>
                  <Text style={styles.activityTime}>1 day ago</Text>
                </View>
              </View>

              <View style={styles.activityDivider} />

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: COLORS.green + '15' }]}>
                  <Ionicons name="wallet" size={20} color={COLORS.green} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Deposit</Text>
                  <Text style={styles.activitySubtitle}>₹1000 added to wallet</Text>
                  <Text style={styles.activityTime}>3 days ago</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
            <View style={[styles.logoutIcon, { backgroundColor: COLORS.red + '20' }]}>
              <Ionicons name="log-out" size={22} color={COLORS.red} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Version 1.0.0
            </Text>
            <Text style={styles.footerSubtext}>
              © {new Date().getFullYear()} Houzie Timez
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Image Selection Modal */}
        <Modal visible={imageModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Profile Picture</Text>
                <TouchableOpacity onPress={() => setImageModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick("camera")}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="camera" size={24} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.modalOptionTitle}>Take Photo</Text>
                  <Text style={styles.modalOptionDescription}>Use your camera to take a new photo</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImagePick("gallery")}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.purple + '15' }]}>
                  <Ionicons name="images" size={24} color={COLORS.purple} />
                </View>
                <View>
                  <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                  <Text style={styles.modalOptionDescription}>Select a photo from your gallery</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Notifications Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              {loadingNotifications ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <View style={styles.notificationIcon}>
                        <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{item.title || "New Update"}</Text>
                        <Text style={styles.notificationMessage}>
                          {item.message || "Check out the latest updates!"}
                        </Text>
                        <Text style={styles.notificationDate}>
                          {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                        </Text>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyNotifications}>
                      <Ionicons name="notifications-off-outline" size={50} color={COLORS.textLight} />
                      <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                  }
                />
              )}

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: COLORS.surface,
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  notification: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: "700",
  },
  
  // Background Elements
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

  // Profile Hero Section
  profileHeroSection: {
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
  profileHeroContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginBottom: 16,
  },
  profileBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  nameInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    width: '100%',
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  profileActionText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '600',
  },
  profileCancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  profileCancelText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '500',
  },

  // Stats Section
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

  // Section
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

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoCard: {
    width: (width - 40) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Status Card
  statusCard: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  statusPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderBottomLeftRadius: 50,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statusBadge: {
    marginLeft: 'auto',
    backgroundColor: COLORS.green + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    color: COLORS.green,
    fontWeight: '600',
  },
  statusDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  // Settings Card
  settingsCard: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Activity Card
  activityCard: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  activityPattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary + '05',
    borderTopRightRadius: 50,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.red,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: '600',
    fontSize: 15,
  },

  // Footer
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
  },
  bottomSpace: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  modalOptionDescription: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  modalCancelText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.surface,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Profile;
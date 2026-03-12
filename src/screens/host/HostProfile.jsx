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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const { width } = Dimensions.get('window');

// Color scheme matching the host profile
const COLORS = {
  primary: "#FF7675", // Main host color (kept original)
  accent: "#ff9800", // Orange accent
  background: "#F6F8FA", // Light background
  surface: "#FFFFFF",
  textDark: "#2c3e50",
  textLight: "#7f8c8d",
  border: "#ecf0f1",
  
  // Status colors
  verified: "#2ecc71",
  pending: "#FF9800",
  rejected: "#e74c3c",
  
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
  red: "#e74c3c",
  redLight: "#FEE2E2",
  green: "#2ecc71",
  greenLight: "#D1FAE5",
};

const BASE_URL = "https://tambolatime.co.in/public/";

const HostProfile = ({ navigation, onLogout }) => {
  const [hostData, setHostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [kycModalVisible, setKycModalVisible] = useState(false);
  
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
    fetchHostProfile();
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

  const fetchHostProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("hostToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "https://tambolatime.co.in/public/api/host/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.host) {
        const host = response.data.host;
        setHostData(host);
        
        setFormData({
          name: host.name || "",
        });
        
        if (host.profile_image_url) {
          setImageUri(host.profile_image_url);
        } else if (host.profile_image) {
          setImageUri(getFullImageUrl(host.profile_image));
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Error fetching host profile:", error);
      setError(error.response?.data?.message || error.message || "Failed to load profile");
      
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again");
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchHostProfile().finally(() => setRefreshing(false));
  }, []);

  const requestImagePermissions = async (source) => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        let permissions = [];
        
        if (source === "camera") {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        
        if (androidVersion >= 33) {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        } else {
          permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        
        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = permissions.every(
          permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED
        );
        
        if (!allGranted) {
          const cameraRationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          
          if (!cameraRationale) {
            Alert.alert(
              "Permission Required",
              "Please grant camera and storage permissions to use this feature.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => {
                    if (Platform.OS === 'android') {
                      Linking.openSettings();
                    }
                  }
                }
              ]
            );
          }
          return false;
        }
        
        return true;
      } catch (error) {
        console.warn("Permission request error:", error);
        return true;
      }
    }
    return true;
  };

  const handleImagePick = async (source) => {
    setImageModalVisible(false);
    
    const hasPermission = await requestImagePermissions(source);
    if (!hasPermission) return;
    
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

  const handleKYCDocumentPick = async (source) => {
    const hasPermission = await requestImagePermissions(source);
    if (!hasPermission) return;
    
    setUploading(true);
    
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.9,
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
        console.log('User cancelled KYC document picker');
        setUploading(false);
        return;
      }

      if (result.errorCode) {
        console.log('KYC Document Picker Error: ', result.errorMessage);
        Alert.alert("Error", result.errorMessage || "Failed to pick document");
        setUploading(false);
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        setUploading(false);
        return;
      }

      const token = await AsyncStorage.getItem("hostToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formDataToSend = new FormData();
      const selectedImage = result.assets[0];
      
      let type = 'image/jpeg';
      const filename = selectedImage.fileName || `kyc_document_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      if (match) {
        type = `image/${match[1]}`;
      }

      formDataToSend.append('kyc_document', {
        uri: selectedImage.uri,
        name: filename,
        type,
      });

      const response = await axios.post(
        "https://tambolatime.co.in/public/api/host/upload-kyc",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "KYC document uploaded successfully");
        fetchHostProfile();
      } else {
        throw new Error(response.data.message || "Failed to upload KYC document");
      }

    } catch (error) {
      console.log("Error uploading KYC document:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || error.message || "Failed to upload KYC document"
      );
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("hostToken");
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
        "https://tambolatime.co.in/public/api/host/profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.host) {
        const updatedHost = response.data.host;
        setHostData(updatedHost);
        Alert.alert("Success", "Profile updated successfully!");
        setEditMode(false);
        
        if (updatedHost.profile_image_url) {
          setImageUri(updatedHost.profile_image_url);
        } else if (updatedHost.profile_image) {
          setImageUri(getFullImageUrl(updatedHost.profile_image));
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.log("Update error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadKYCDocument = () => {
    Alert.alert(
      "Upload KYC Document",
      "Please upload your KYC document. Ensure it's clear and readable.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: () => handleKYCDocumentPick("camera")
        },
        {
          text: "Choose from Gallery",
          onPress: () => handleKYCDocumentPick("gallery")
        }
      ]
    );
  };

  const viewKYCDocument = async () => {
    if (!hostData?.kyc_document_url) {
      Alert.alert("Info", "No KYC document available");
      return;
    }

    const url = hostData.kyc_document_url;
    const isImage = /\.(jpg|jpeg|png)$/i.test(url);
    const isPDF = /\.pdf$/i.test(url);

    if (isImage) {
      setKycModalVisible(true);
    } else if (isPDF) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert("Error", "Cannot open PDF document. Please install a PDF viewer app.");
        }
      } catch (error) {
        console.log("Error opening PDF:", error);
        Alert.alert("Error", "Failed to open PDF document");
      }
    } else {
      Alert.alert("Info", "Document format not supported for preview");
    }
  };

  const handleLogout = async () => {
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
              await AsyncStorage.multiRemove([
                "token",
                "hostToken",
                "host",
                "userData",
                "userRole"
              ]);
              onLogout();
            } catch (error) {
              console.log("Logout error:", error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getKYCStatusColor = (status) => {
    switch (status) {
      case "verified":
        return COLORS.verified;
      case "pending":
        return COLORS.pending;
      case "rejected":
        return COLORS.rejected;
      default:
        return COLORS.textLight;
    }
  };

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Host Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your host account</Text>
      </View>

      <TouchableOpacity style={styles.notification}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.surface} />
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
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.rejected} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHostProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!hostData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={60} color={COLORS.textLight} />
          <Text style={styles.errorTitle}>No profile data found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHostProfile}>
            <Text style={styles.retryButtonText}>Load Profile</Text>
          </TouchableOpacity>
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
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
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
                  <Text style={styles.profileName}>{hostData?.name || "Host"}</Text>
                  <View style={styles.profileBadge}>
                    <Ionicons name="star" size={14} color={COLORS.accent} />
                    <Text style={styles.profileBadgeText}>@{hostData?.username}</Text>
                  </View>
                  <View style={styles.idBadge}>
                    <Ionicons name="id-card" size={12} color={COLORS.textLight} />
                    <Text style={styles.idBadgeText}>ID: {hostData?.id}</Text>
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
                      setFormData({ name: hostData?.name || "" });
                      if (hostData?.profile_image_url) {
                        setImageUri(hostData.profile_image_url);
                      } else if (hostData?.profile_image) {
                        setImageUri(getFullImageUrl(hostData.profile_image));
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
            <StatCard 
              number={hostData?.ratings || 0} 
              label="Rating" 
              icon="star" 
              color={COLORS.accent} 
            />
            <StatCard 
              number={hostData?.referral_points || 0} 
              label="Referrals" 
              icon="people" 
              color={COLORS.purple} 
            />
            <StatCard 
              number={hostData?.subscription?.days_remaining || hostData?.subscription_days_remaining || 0} 
              label="Days Left" 
              icon="calendar" 
              color={COLORS.teal} 
            />
          </View>

          {/* Personal Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="person-circle" size={22} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <InfoCard 
                icon="mail" 
                label="Email" 
                value={hostData?.email} 
                color={COLORS.primary}
              />
              <InfoCard 
                icon="call" 
                label="Mobile" 
                value={hostData?.mobile} 
                color={COLORS.purple}
              />
              <InfoCard 
                icon="gift" 
                label="Referral Code" 
                value={hostData?.referral_code} 
                color={COLORS.teal}
              />
              <InfoCard 
                icon="map" 
                label="Address" 
                value={hostData?.address || "Not set"} 
                color={COLORS.orange}
              />
              <InfoCard 
                icon="cake" 
                label="Date of Birth" 
                value={formatDate(hostData?.dob)} 
                color={COLORS.pink}
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
                <View style={[styles.statusIndicator, { backgroundColor: hostData?.status === 'active' ? COLORS.green : COLORS.textLight }]} />
                <View>
                  <Text style={styles.statusLabel}>Account Status</Text>
                  <Text style={styles.statusValue}>
                    {hostData?.status === 'active' ? 'Active' : hostData?.status || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: COLORS.green + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: COLORS.green }]}>Verified</Text>
                </View>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: COLORS.primary }]} />
                <View>
                  <Text style={styles.statusLabel}>Account Created</Text>
                  <Text style={styles.statusValue}>
                    {formatDate(hostData?.created_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: getKYCStatusColor(hostData?.kyc_status) }]} />
                <View>
                  <Text style={styles.statusLabel}>KYC Status</Text>
                  <Text style={[styles.statusValue, { color: getKYCStatusColor(hostData?.kyc_status) }]}>
                    {hostData?.kyc_status?.toUpperCase() || "N/A"}
                  </Text>
                </View>
                {(hostData?.kyc_status === "pending" || hostData?.kyc_status === "rejected") && (
                  <TouchableOpacity 
                    style={[styles.kycButton, { backgroundColor: COLORS.primary }]}
                    onPress={uploadKYCDocument}
                    disabled={uploading}
                  >
                    <Text style={styles.kycButtonText}>
                      {uploading ? "Uploading..." : "Upload KYC"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {hostData?.kyc_document_url && (
                <TouchableOpacity style={styles.kycDocumentRow} onPress={viewKYCDocument}>
                  <Ionicons name="document-text" size={18} color={COLORS.primary} />
                  <Text style={styles.kycDocumentText}>View KYC Document</Text>
                  <Ionicons name="eye-outline" size={16} color={COLORS.primary} style={styles.kycDocumentIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Subscription Info */}
          {hostData?.subscription_status === "active" && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="crown" size={22} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
                </View>
              </View>

              <View style={[styles.subscriptionCard, { borderLeftColor: COLORS.primary }]}>
                <View style={styles.subscriptionHeader}>
                  <Ionicons name="crown" size={20} color={COLORS.primary} />
                  <Text style={styles.subscriptionTitle}>Active Subscription</Text>
                </View>
                <Text style={styles.subscriptionDetails}>
                  Plan ID: {hostData.subscription_plan_id}
                </Text>
                <Text style={styles.subscriptionDays}>
                  Days Remaining: {hostData.subscription_days_remaining || 
                    Math.ceil((new Date(hostData.subscription_end_date) - new Date()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text style={styles.subscriptionDates}>
                  {formatDate(hostData.subscription_start_date)} - {formatDate(hostData.subscription_end_date)}
                </Text>
              </View>
            </View>
          )}

          {/* Quick Settings */}
          {!editMode && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="settings" size={22} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>QUICK SETTINGS</Text>
                </View>
              </View>

              <View style={styles.settingsCard}>
                <SettingItem 
                  icon="lock-closed"
                  title="Change Password"
                  description="Update your password"
                  color={COLORS.primary}
                  onPress={() => Alert.alert("Coming Soon", "Change password feature coming soon!")}
                />
                <SettingItem 
                  icon="wallet"
                  title="Wallet"
                  description="Manage your earnings"
                  color={COLORS.purple}
                  onPress={() => Alert.alert("Coming Soon", "Wallet feature coming soon!")}
                />
                <SettingItem 
                  icon="help-circle"
                  title="Help & Support"
                  description="Get help with your account"
                  color={COLORS.teal}
                  onPress={() => Linking.openURL('mailto:support@tambolatime.co.in')}
                />
              </View>
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
              © {new Date().getFullYear()} Tambola Time
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

        {/* KYC Document View Modal */}
        <Modal
          visible={kycModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setKycModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '90%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>KYC Document</Text>
                <TouchableOpacity onPress={() => setKycModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
              
              {hostData?.kyc_document_url && (
                <View style={styles.kycImageContainer}>
                  <Image
                    source={{ uri: hostData.kyc_document_url }}
                    style={styles.kycImage}
                    resizeMode="contain"
                    onError={() => {
                      Alert.alert("Error", "Failed to load image. The document might be a PDF or corrupted.");
                      setKycModalVisible(false);
                    }}
                  />
                </View>
              )}
              
              <TouchableOpacity
                style={[styles.kycModalButton, { backgroundColor: COLORS.primary }]}
                onPress={() => setKycModalVisible(false)}
              >
                <Text style={styles.kycModalButtonText}>Close</Text>
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
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginBottom: 4,
  },
  profileBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  idBadgeText: {
    fontSize: 11,
    color: COLORS.textLight,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  kycButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  kycButtonText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '600',
  },
  kycDocumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  kycDocumentText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  kycDocumentIcon: {
    marginLeft: 'auto',
  },

  // Subscription Card
  subscriptionCard: {
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
    borderLeftWidth: 4,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subscriptionDetails: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  subscriptionDays: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subscriptionDates: {
    fontSize: 11,
    color: COLORS.textLight,
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

  // KYC Image Modal
  kycImageContainer: {
    width: '100%',
    height: 400,
    padding: 10,
  },
  kycImage: {
    width: '100%',
    height: '100%',
  },
  kycModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  kycModalButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HostProfile;
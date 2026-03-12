// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   StyleSheet,
// // //   Text,
// // //   View,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   TextInput,
// // //   ActivityIndicator,
// // //   LayoutAnimation,
// // //   Platform,
// // //   UIManager,
// // //   Image,
// // //   Linking,
// // //   RefreshControl,
// // //   SafeAreaView,
// // //   StatusBar,
// // // } from "react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import axios from "axios";
// // // import Icon from "react-native-vector-icons/Ionicons";

// // // if (Platform.OS === "android") {
// // //   UIManager.setLayoutAnimationEnabledExperimental &&
// // //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // // }

// // // // Updated Color scheme with #02658D as primary
// // // const PRIMARY_COLOR = "#02658D"; // Main background color
// // // const SECONDARY_COLOR = "#02557A"; // Darker blue
// // // const ACCENT_COLOR = "#FFD54F"; // Light amber/Accent color
// // // const LIGHT_ACCENT = "#FFECB3"; // Very light amber
// // // const TEXT_LIGHT = "#E3F2FD"; // Light blue text
// // // const DARK_BLUE = "#014560"; // Darker blue for backgrounds
// // // const WHITE = "#FFFFFF";

// // // const Faqs = () => {
// // //   const [faqs, setFaqs] = useState([]);
// // //   const [helpLinks, setHelpLinks] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [linksLoading, setLinksLoading] = useState(false);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [expanded, setExpanded] = useState({});
// // //   const [search, setSearch] = useState("");

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   const fetchData = async () => {
// // //     await Promise.all([fetchFaqs(), fetchHelpLinks()]);
// // //   };

// // //   const fetchFaqs = async () => {
// // //     try {
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/faqs",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.status && res.data.data) setFaqs(res.data.data);
// // //     } catch (err) {
// // //       console.log(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const fetchHelpLinks = async () => {
// // //     try {
// // //       setLinksLoading(true);
// // //       const token = await AsyncStorage.getItem("token");
// // //       const res = await axios.get(
// // //         "https://tambolatime.co.in/public/api/user/help-links",
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       if (res.data.status && res.data.data) setHelpLinks(res.data.data);
// // //     } catch (err) {
// // //       console.log("Error fetching help links:", err);
// // //     } finally {
// // //       setLinksLoading(false);
// // //     }
// // //   };

// // //   const onRefresh = async () => {
// // //     setRefreshing(true);
// // //     await fetchData();
// // //     setRefreshing(false);
// // //   };

// // //   const toggleFaq = (id) => {
// // //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
// // //   };

// // //   const openYouTubeLink = async (url) => {
// // //     try {
// // //       const supported = await Linking.canOpenURL(url);
// // //       if (supported) {
// // //         await Linking.openURL(url);
// // //       } else {
// // //         await Linking.openURL(url);
// // //       }
// // //     } catch (error) {
// // //       console.log('Error opening link:', error);
// // //     }
// // //   };

// // //   const filteredFaqs = faqs.filter((f) =>
// // //     f.question.toLowerCase().includes(search.toLowerCase())
// // //   );

// // //   const renderHelpLinks = () => {
// // //     if (linksLoading) {
// // //       return (
// // //         <View style={styles.helpLinksContainer}>
// // //           <ActivityIndicator size="small" color={ACCENT_COLOR} />
// // //         </View>
// // //       );
// // //     }

// // //     if (helpLinks.length === 0) return null;

// // //     return (
// // //       <View style={styles.helpLinksContainer}>
// // //         <View style={styles.helpLinksHeader}>
// // //           <Icon name="videocam" size={22} color={ACCENT_COLOR} />
// // //           <Text style={styles.helpLinksTitle}>
// // //             Helpful Videos
// // //           </Text>
// // //         </View>
// // //         <Text style={styles.helpLinksSubtitle}>
// // //           Watch tutorials to learn how to play Tambola games
// // //         </Text>
        
// // //         <View style={styles.linksList}>
// // //           {helpLinks.map((link, index) => (
// // //             <TouchableOpacity
// // //               key={link.key || index}
// // //               style={styles.linkItem}
// // //               onPress={() => openYouTubeLink(link.url)}
// // //               activeOpacity={0.7}
// // //             >
// // //               <View style={styles.linkIconContainer}>
// // //                 <Icon name="play-circle" size={20} color={ACCENT_COLOR} />
// // //               </View>
// // //               <View style={styles.linkContent}>
// // //                 <Text style={styles.linkTitle} numberOfLines={2}>
// // //                   {link.title}
// // //                 </Text>
// // //                 <Text style={styles.linkDescription} numberOfLines={1}>
// // //                   {link.description}
// // //                 </Text>
// // //               </View>
// // //               <Icon name="chevron-forward" size={18} color={LIGHT_ACCENT} />
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
// // //       <ScrollView 
// // //         style={styles.container}
// // //         contentContainerStyle={styles.scrollContent}
// // //         refreshControl={
// // //           <RefreshControl 
// // //             refreshing={refreshing} 
// // //             onRefresh={onRefresh} 
// // //             tintColor={ACCENT_COLOR}
// // //             colors={[ACCENT_COLOR]}
// // //           />
// // //         }
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {/* HEADER */}
// // //         <View style={styles.header}>
// // //           <Text style={styles.headerTitle}>
// // //             Help Desk
// // //           </Text>
// // //           <TouchableOpacity>
// // //             <Icon name="settings-outline" size={24} color={ACCENT_COLOR} />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* TOP ILLUSTRATION */}
// // //         <View style={styles.topImageWrapper}>
// // //           <Image
// // //             source={{
// // //               uri: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
// // //             }}
// // //             style={{
// // //               width: 120,
// // //               height: 120,
// // //               opacity: 0.9,
// // //             }}
// // //           />
// // //         </View>

// // //         {/* INTRO */}
// // //         <Text style={styles.introText}>
// // //           We're here to help you with anything and everything on Tambola Timez. Use the search below or check our frequently asked questions.
// // //         </Text>

// // //         {/* SEARCH */}
// // //         <View style={styles.searchBox}>
// // //           <TextInput
// // //             placeholder="Search Help"
// // //             value={search}
// // //             onChangeText={setSearch}
// // //             style={styles.searchInput}
// // //             placeholderTextColor={LIGHT_ACCENT}
// // //           />
// // //           <Icon name="search" size={20} color={LIGHT_ACCENT} style={styles.searchIcon} />
// // //         </View>

// // //         {/* HELP LINKS SECTION */}
// // //         {renderHelpLinks()}

// // //         {/* FAQ LIST */}
// // //         <Text style={styles.sectionTitle}>
// // //           Frequently Asked Questions
// // //         </Text>

// // //         {loading && <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginTop: 20 }} />}

// // //         {!loading &&
// // //           filteredFaqs.map((faq) => (
// // //             <View key={faq.id} style={styles.faqCard}>
// // //               <TouchableOpacity
// // //                 style={styles.faqHeader}
// // //                 onPress={() => toggleFaq(faq.id)}
// // //               >
// // //                 <View style={styles.faqTitleWrapper}>
// // //                   <Image
// // //                     source={{
// // //                       uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
// // //                     }}
// // //                     style={styles.faqIcon}
// // //                   />
// // //                   <Text style={styles.faqQuestion}>
// // //                     {faq.question}
// // //                   </Text>
// // //                 </View>
// // //                 <Icon 
// // //                   name={expanded[faq.id] ? "chevron-up" : "chevron-down"} 
// // //                   size={20} 
// // //                   color={ACCENT_COLOR} 
// // //                 />
// // //               </TouchableOpacity>
// // //               {expanded[faq.id] && (
// // //                 <View style={styles.faqAnswerWrapper}>
// // //                   <Text style={styles.faqAnswer}>
// // //                     {faq.answer}
// // //                   </Text>
// // //                 </View>
// // //               )}
// // //             </View>
// // //           ))}

// // //         {filteredFaqs.length === 0 && !loading && (
// // //           <Text style={styles.noFaqs}>No FAQs found.</Text>
// // //         )}

// // //         {/* CTA BUTTON */}
// // //         <TouchableOpacity style={styles.ctaButton}>
// // //           <Text style={styles.ctaText}>Still stuck? Help us a mail away</Text>
// // //           <Text style={styles.ctaBtnText}>Send a message</Text>
// // //         </TouchableOpacity>

// // //         {/* Bottom spacing */}
// // //         <View style={styles.bottomSpace} />
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // export default Faqs;

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: PRIMARY_COLOR,
// // //   },
// // //   scrollContent: {
// // //     paddingHorizontal: 20,
// // //     paddingBottom: 30,
// // //   },
// // //   header: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginTop: 25,
// // //     marginBottom: 15,
// // //   },
// // //   headerTitle: { 
// // //     fontSize: 28,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     letterSpacing: -0.5,
// // //   },
// // //   topImageWrapper: { 
// // //     alignItems: "center", 
// // //     marginBottom: 15
// // //   },
// // //   introText: {
// // //     fontSize: 15,
// // //     color: TEXT_LIGHT,
// // //     lineHeight: 22,
// // //     textAlign: "center",
// // //     marginBottom: 20,
// // //     opacity: 0.9
// // //   },
// // //   searchBox: {
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 12,
// // //     paddingHorizontal: 16,
// // //     marginBottom: 24,
// // //     height: 50,
// // //     justifyContent: "center",
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //     elevation: 4,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   searchInput: { 
// // //     fontSize: 15, 
// // //     height: "100%",
// // //     color: TEXT_LIGHT,
// // //     flex: 1,
// // //   },
// // //   searchIcon: {
// // //     marginLeft: 10,
// // //   },
// // //   // Help Links Styles
// // //   helpLinksContainer: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderRadius: 16,
// // //     marginBottom: 24,
// // //     padding: 20,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOpacity: 0.3,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   helpLinksHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 8,
// // //   },
// // //   helpLinksTitle: {
// // //     fontSize: 20,
// // //     fontWeight: "700",
// // //     color: TEXT_LIGHT,
// // //     marginLeft: 10,
// // //   },
// // //   helpLinksSubtitle: {
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT,
// // //     marginBottom: 20,
// // //     lineHeight: 20,
// // //     opacity: 0.8,
// // //   },
// // //   linksList: {
// // //     gap: 12,
// // //   },
// // //   linkItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: DARK_BLUE,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   linkIconContainer: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 10,
// // //     backgroundColor: "rgba(255, 213, 79, 0.1)",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     marginRight: 12,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.2)",
// // //   },
// // //   linkContent: {
// // //     flex: 1,
// // //   },
// // //   linkTitle: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     color: TEXT_LIGHT,
// // //     marginBottom: 4,
// // //     lineHeight: 20,
// // //   },
// // //   linkDescription: {
// // //     fontSize: 13,
// // //     color: LIGHT_ACCENT,
// // //     lineHeight: 18,
// // //     opacity: 0.8,
// // //   },
// // //   // FAQ Section
// // //   sectionTitle: { 
// // //     fontSize: 18,
// // //     fontWeight: "700", 
// // //     marginBottom: 16,
// // //     color: ACCENT_COLOR,
// // //   },
// // //   faqCard: {
// // //     backgroundColor: SECONDARY_COLOR,
// // //     borderRadius: 12,
// // //     overflow: "hidden",
// // //     marginBottom: 12,
// // //     borderWidth: 2,
// // //     borderColor: ACCENT_COLOR,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOpacity: 0.3,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   faqHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     padding: 18,
// // //   },
// // //   faqTitleWrapper: { 
// // //     flexDirection: "row", 
// // //     alignItems: "center", 
// // //     flex: 1,
// // //     gap: 12,
// // //   },
// // //   faqIcon: { 
// // //     width: 24, 
// // //     height: 24,
// // //   },
// // //   faqQuestion: { 
// // //     fontSize: 15,
// // //     fontWeight: "600", 
// // //     color: TEXT_LIGHT, 
// // //     flex: 1,
// // //     lineHeight: 20,
// // //   },
// // //   faqAnswerWrapper: {
// // //     backgroundColor: DARK_BLUE,
// // //     paddingHorizontal: 18,
// // //     paddingTop: 2,
// // //     paddingBottom: 18,
// // //     borderTopWidth: 1,
// // //     borderTopColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   faqAnswer: { 
// // //     fontSize: 14,
// // //     color: LIGHT_ACCENT, 
// // //     lineHeight: 22,
// // //     opacity: 0.9,
// // //   },
// // //   noFaqs: { 
// // //     textAlign: "center", 
// // //     marginTop: 20, 
// // //     color: LIGHT_ACCENT,
// // //     fontSize: 15,
// // //     fontStyle: "italic",
// // //     opacity: 0.8,
// // //   },
// // //   ctaButton: {
// // //     backgroundColor: ACCENT_COLOR,
// // //     borderRadius: 12,
// // //     paddingVertical: 18,
// // //     paddingHorizontal: 24,
// // //     alignItems: "center",
// // //     marginTop: 30,
// // //     shadowColor: ACCENT_COLOR,
// // //     shadowOpacity: 0.4,
// // //     shadowOffset: { width: 0, height: 6 },
// // //     shadowRadius: 12,
// // //     elevation: 8,
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255, 213, 79, 0.3)",
// // //   },
// // //   ctaText: { 
// // //     color: DARK_BLUE, 
// // //     fontWeight: "500", 
// // //     marginBottom: 6,
// // //     fontSize: 14,
// // //     opacity: 0.9,
// // //   },
// // //   ctaBtnText: { 
// // //     color: DARK_BLUE, 
// // //     fontWeight: "700", 
// // //     fontSize: 16 
// // //   },
// // //   bottomSpace: {
// // //     height: 30,
// // //   },
// // // });






// // import React, { useEffect, useState } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// //   TextInput,
// //   ActivityIndicator,
// //   LayoutAnimation,
// //   Platform,
// //   UIManager,
// //   Image,
// //   Linking,
// //   RefreshControl,
// //   SafeAreaView,
// //   StatusBar,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import Icon from "react-native-vector-icons/Ionicons";

// // if (Platform.OS === "android") {
// //   UIManager.setLayoutAnimationEnabledExperimental &&
// //     UIManager.setLayoutAnimationEnabledExperimental(true);
// // }

// // // Updated Color scheme matching Home component
// // const PRIMARY_COLOR = "#4facfe"; // Main blue color
// // const ACCENT_COLOR = "#ff9800"; // Orange accent
// // const BACKGROUND_COLOR = "#f5f8ff"; // Light background
// // const WHITE = "#FFFFFF";
// // const TEXT_DARK = "#333333";
// // const TEXT_LIGHT = "#777777";
// // const BORDER_COLOR = "#EEEEEE";
// // const CARD_BACKGROUND = "#FFFFFF";
// // const SECONDARY_COLOR = "#4facfe"; // Using same blue for consistency
// // const LIGHT_ACCENT = "#ffb74d"; // Lighter orange
// // const DARK_BLUE = "#4facfe"; // Using same blue

// // const Faqs = () => {
// //   const [faqs, setFaqs] = useState([]);
// //   const [helpLinks, setHelpLinks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [linksLoading, setLinksLoading] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [expanded, setExpanded] = useState({});
// //   const [search, setSearch] = useState("");

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     await Promise.all([fetchFaqs(), fetchHelpLinks()]);
// //   };

// //   const fetchFaqs = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/faqs",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.status && res.data.data) setFaqs(res.data.data);
// //     } catch (err) {
// //       console.log(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchHelpLinks = async () => {
// //     try {
// //       setLinksLoading(true);
// //       const token = await AsyncStorage.getItem("token");
// //       const res = await axios.get(
// //         "https://tambolatime.co.in/public/api/user/help-links",
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       if (res.data.status && res.data.data) setHelpLinks(res.data.data);
// //     } catch (err) {
// //       console.log("Error fetching help links:", err);
// //     } finally {
// //       setLinksLoading(false);
// //     }
// //   };

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await fetchData();
// //     setRefreshing(false);
// //   };

// //   const toggleFaq = (id) => {
// //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
// //   };

// //   const openYouTubeLink = async (url) => {
// //     try {
// //       const supported = await Linking.canOpenURL(url);
// //       if (supported) {
// //         await Linking.openURL(url);
// //       } else {
// //         await Linking.openURL(url);
// //       }
// //     } catch (error) {
// //       console.log('Error opening link:', error);
// //     }
// //   };

// //   const filteredFaqs = faqs.filter((f) =>
// //     f.question.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const renderHelpLinks = () => {
// //     if (linksLoading) {
// //       return (
// //         <View style={styles.helpLinksContainer}>
// //           <ActivityIndicator size="small" color={PRIMARY_COLOR} />
// //         </View>
// //       );
// //     }

// //     if (helpLinks.length === 0) return null;

// //     return (
// //       <View style={styles.helpLinksContainer}>
// //         <View style={styles.helpLinksHeader}>
// //           <Icon name="videocam" size={22} color={PRIMARY_COLOR} />
// //           <Text style={styles.helpLinksTitle}>
// //             Helpful Videos
// //           </Text>
// //         </View>
// //         <Text style={styles.helpLinksSubtitle}>
// //           Watch tutorials to learn how to play Tambola games
// //         </Text>
        
// //         <View style={styles.linksList}>
// //           {helpLinks.map((link, index) => (
// //             <TouchableOpacity
// //               key={link.key || index}
// //               style={styles.linkItem}
// //               onPress={() => openYouTubeLink(link.url)}
// //               activeOpacity={0.7}
// //             >
// //               <View style={styles.linkIconContainer}>
// //                 <Icon name="play-circle" size={20} color={PRIMARY_COLOR} />
// //               </View>
// //               <View style={styles.linkContent}>
// //                 <Text style={styles.linkTitle} numberOfLines={2}>
// //                   {link.title}
// //                 </Text>
// //                 <Text style={styles.linkDescription} numberOfLines={1}>
// //                   {link.description}
// //                 </Text>
// //               </View>
// //               <Icon name="chevron-forward" size={18} color={TEXT_LIGHT} />
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
// //       <ScrollView 
// //         style={styles.container}
// //         contentContainerStyle={styles.scrollContent}
// //         refreshControl={
// //           <RefreshControl 
// //             refreshing={refreshing} 
// //             onRefresh={onRefresh} 
// //             tintColor={PRIMARY_COLOR}
// //             colors={[PRIMARY_COLOR]}
// //           />
// //         }
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* HEADER */}
// //         <View style={styles.header}>
// //           <Text style={styles.headerTitle}>
// //             Help Desk
// //           </Text>
// //           <TouchableOpacity>
// //             <Icon name="settings-outline" size={24} color={WHITE} />
// //           </TouchableOpacity>
// //         </View>

// //         {/* TOP ILLUSTRATION */}
// //         <View style={styles.topImageWrapper}>
// //           <Image
// //             source={{
// //               uri: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
// //             }}
// //             style={{
// //               width: 120,
// //               height: 120,
// //               opacity: 0.9,
// //             }}
// //           />
// //         </View>

// //         {/* INTRO */}
// //         <Text style={styles.introText}>
// //           We're here to help you with anything and everything on Tambola Timez. Use the search below or check our frequently asked questions.
// //         </Text>

// //         {/* SEARCH */}
// //         <View style={styles.searchBox}>
// //           <TextInput
// //             placeholder="Search Help"
// //             value={search}
// //             onChangeText={setSearch}
// //             style={styles.searchInput}
// //             placeholderTextColor={TEXT_LIGHT}
// //           />
// //           <Icon name="search" size={20} color={TEXT_LIGHT} style={styles.searchIcon} />
// //         </View>

// //         {/* HELP LINKS SECTION */}
// //         {renderHelpLinks()}

// //         {/* FAQ LIST */}
// //         <Text style={styles.sectionTitle}>
// //           Frequently Asked Questions
// //         </Text>

// //         {loading && <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 20 }} />}

// //         {!loading &&
// //           filteredFaqs.map((faq) => (
// //             <View key={faq.id} style={styles.faqCard}>
// //               <TouchableOpacity
// //                 style={styles.faqHeader}
// //                 onPress={() => toggleFaq(faq.id)}
// //               >
// //                 <View style={styles.faqTitleWrapper}>
// //                   <Image
// //                     source={{
// //                       uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
// //                     }}
// //                     style={styles.faqIcon}
// //                   />
// //                   <Text style={styles.faqQuestion}>
// //                     {faq.question}
// //                   </Text>
// //                 </View>
// //                 <Icon 
// //                   name={expanded[faq.id] ? "chevron-up" : "chevron-down"} 
// //                   size={20} 
// //                   color={PRIMARY_COLOR} 
// //                 />
// //               </TouchableOpacity>
// //               {expanded[faq.id] && (
// //                 <View style={styles.faqAnswerWrapper}>
// //                   <Text style={styles.faqAnswer}>
// //                     {faq.answer}
// //                   </Text>
// //                 </View>
// //               )}
// //             </View>
// //           ))}

// //         {filteredFaqs.length === 0 && !loading && (
// //           <Text style={styles.noFaqs}>No FAQs found.</Text>
// //         )}

// //         {/* CTA BUTTON */}
// //         <TouchableOpacity style={styles.ctaButton}>
// //           <Text style={styles.ctaText}>Still stuck? Help us a mail away</Text>
// //           <Text style={styles.ctaBtnText}>Send a message</Text>
// //         </TouchableOpacity>

// //         {/* Bottom spacing */}
// //         <View style={styles.bottomSpace} />
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default Faqs;

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   container: {
// //     flex: 1,
// //     backgroundColor: BACKGROUND_COLOR,
// //   },
// //   scrollContent: {
// //     paddingHorizontal: 20,
// //     paddingBottom: 30,
// //   },
// //   header: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginTop: 25,
// //     marginBottom: 15,
// //   },
// //   headerTitle: { 
// //     fontSize: 28,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     letterSpacing: -0.5,
// //   },
// //   topImageWrapper: { 
// //     alignItems: "center", 
// //     marginBottom: 15
// //   },
// //   introText: {
// //     fontSize: 15,
// //     color: TEXT_LIGHT,
// //     lineHeight: 22,
// //     textAlign: "center",
// //     marginBottom: 20,
// //   },
// //   searchBox: {
// //     backgroundColor: WHITE,
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     marginBottom: 24,
// //     height: 50,
// //     justifyContent: "center",
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   searchInput: { 
// //     fontSize: 15, 
// //     height: "100%",
// //     color: TEXT_DARK,
// //     flex: 1,
// //   },
// //   searchIcon: {
// //     marginLeft: 10,
// //   },
// //   // Help Links Styles
// //   helpLinksContainer: {
// //     backgroundColor: WHITE,
// //     borderRadius: 16,
// //     marginBottom: 24,
// //     padding: 20,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //   },
// //   helpLinksHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 8,
// //   },
// //   helpLinksTitle: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     color: TEXT_DARK,
// //     marginLeft: 10,
// //   },
// //   helpLinksSubtitle: {
// //     fontSize: 14,
// //     color: TEXT_LIGHT,
// //     marginBottom: 20,
// //     lineHeight: 20,
// //   },
// //   linksList: {
// //     gap: 12,
// //   },
// //   linkItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: BACKGROUND_COLOR,
// //     borderRadius: 12,
// //     padding: 16,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   linkIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 10,
// //     backgroundColor: '#F0F8FF',
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 12,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //   },
// //   linkContent: {
// //     flex: 1,
// //   },
// //   linkTitle: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     color: TEXT_DARK,
// //     marginBottom: 4,
// //     lineHeight: 20,
// //   },
// //   linkDescription: {
// //     fontSize: 13,
// //     color: TEXT_LIGHT,
// //     lineHeight: 18,
// //   },
// //   // FAQ Section
// //   sectionTitle: { 
// //     fontSize: 18,
// //     fontWeight: "700", 
// //     marginBottom: 16,
// //     color: TEXT_DARK,
// //   },
// //   faqCard: {
// //     backgroundColor: WHITE,
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: BORDER_COLOR,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 2,
// //     elevation: 1,
// //   },
// //   faqHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     padding: 18,
// //   },
// //   faqTitleWrapper: { 
// //     flexDirection: "row", 
// //     alignItems: "center", 
// //     flex: 1,
// //     gap: 12,
// //   },
// //   faqIcon: { 
// //     width: 24, 
// //     height: 24,
// //   },
// //   faqQuestion: { 
// //     fontSize: 15,
// //     fontWeight: "600", 
// //     color: TEXT_DARK, 
// //     flex: 1,
// //     lineHeight: 20,
// //   },
// //   faqAnswerWrapper: {
// //     backgroundColor: BACKGROUND_COLOR,
// //     paddingHorizontal: 18,
// //     paddingTop: 2,
// //     paddingBottom: 18,
// //     borderTopWidth: 1,
// //     borderTopColor: BORDER_COLOR,
// //   },
// //   faqAnswer: { 
// //     fontSize: 14,
// //     color: TEXT_LIGHT, 
// //     lineHeight: 22,
// //   },
// //   noFaqs: { 
// //     textAlign: "center", 
// //     marginTop: 20, 
// //     color: TEXT_LIGHT,
// //     fontSize: 15,
// //     fontStyle: "italic",
// //   },
// //   ctaButton: {
// //     backgroundColor: PRIMARY_COLOR,
// //     borderRadius: 12,
// //     paddingVertical: 18,
// //     paddingHorizontal: 24,
// //     alignItems: "center",
// //     marginTop: 30,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 2,
// //   },
// //   ctaText: { 
// //     color: WHITE, 
// //     fontWeight: "500", 
// //     marginBottom: 6,
// //     fontSize: 14,
// //   },
// //   ctaBtnText: { 
// //     color: WHITE, 
// //     fontWeight: "700", 
// //     fontSize: 16 
// //   },
// //   bottomSpace: {
// //     height: 30,
// //   },
// // });



// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   LayoutAnimation,
//   Platform,
//   UIManager,
//   Image,
//   Linking,
//   RefreshControl,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Animated,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Icon from "react-native-vector-icons/Ionicons";

// const { width } = Dimensions.get('window');

// if (Platform.OS === "android") {
//   UIManager.setLayoutAnimationEnabledExperimental &&
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

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
//   green: '#10B981',
//   greenLight: '#D1FAE5',
  
//   // Block colors - Blue shades
//   blockLightBlue: '#E1EBFF',
//   blockMediumBlue: '#C2D6FF',
//   blockDarkBlue: '#A3C1FF',
// };

// const Faqs = () => {
//   const [faqs, setFaqs] = useState([]);
//   const [helpLinks, setHelpLinks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [linksLoading, setLinksLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [expanded, setExpanded] = useState({});
//   const [search, setSearch] = useState("");

//   // Animation values
//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     fetchData();
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

//   // Card Background with only circles
//   const CardBackground = ({ accentColor = COLORS.primary }) => (
//     <View style={[styles.cardBackground, { backgroundColor: COLORS.cardBlue1 }]}>
//       {/* Decorative circles */}
//       <View style={[styles.cardDecorativeCircle, styles.circle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle2, { backgroundColor: COLORS.secondary }]} />
//       <View style={[styles.cardDecorativeCircle, styles.circle3, { backgroundColor: COLORS.primaryLight }]} />
      
//       {/* Floating particles */}
//       <View style={[styles.floatingParticle, styles.particle1, { backgroundColor: accentColor }]} />
//       <View style={[styles.floatingParticle, styles.particle2, { backgroundColor: COLORS.primary }]} />
//       <View style={[styles.floatingParticle, styles.particle3, { backgroundColor: COLORS.purple }]} />
//       <View style={[styles.floatingParticle, styles.particle4, { backgroundColor: COLORS.teal }]} />
//     </View>
//   );

//   // Enhanced Header with UK pattern
//   const Header = () => (
//     <View style={styles.headerWrapper}>
//       {/* Semicircle Background */}
//       <View style={styles.semicircleBackground}>
//         <View style={styles.semicircle} />
//       </View>
      
//       {/* UK-style Rounded Lines Pattern */}
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
//         <View>
//           <Text style={styles.greeting}>Need Assistance?</Text>
//           <Text style={styles.title}>
//             Help <Text style={styles.titleBold}>Desk</Text>
//           </Text>
//         </View>
//         <View style={styles.headerRight}>
//           <View style={[styles.headerBadge, { backgroundColor: COLORS.primary }]}>
//             <Icon name="headset" size={16} color="#FFFFFF" />
//             <Text style={styles.headerBadgeText}>24/7 Support</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const fetchData = async () => {
//     await Promise.all([fetchFaqs(), fetchHelpLinks()]);
//   };

//   const fetchFaqs = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/faqs",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status && res.data.data) setFaqs(res.data.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHelpLinks = async () => {
//     try {
//       setLinksLoading(true);
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get(
//         "https://tambolatime.co.in/public/api/user/help-links",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status && res.data.data) setHelpLinks(res.data.data);
//     } catch (err) {
//       console.log("Error fetching help links:", err);
//     } finally {
//       setLinksLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   };

//   const toggleFaq = (id) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const openYouTubeLink = async (url) => {
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         await Linking.openURL(url);
//       }
//     } catch (error) {
//       console.log('Error opening link:', error);
//     }
//   };

//   const filteredFaqs = faqs.filter((f) =>
//     f.question.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleScroll = Animated.event(
//     [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//     { useNativeDriver: false }
//   );

//   const renderHelpLinks = () => {
//     if (linksLoading) {
//       return (
//         <View style={styles.helpLinksCard}>
//           <CardBackground accentColor={COLORS.primary} />
//           <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
//         </View>
//       );
//     }

//     if (helpLinks.length === 0) return null;

//     return (
//       <View style={styles.helpLinksCard}>
//         <CardBackground accentColor={COLORS.primary} />
        
//         <View style={styles.helpLinksHeader}>
//           <View style={[styles.helpLinksIcon, { backgroundColor: `${COLORS.primary}15` }]}>
//             <Icon name="videocam" size={22} color={COLORS.primary} />
//           </View>
//           <Text style={styles.helpLinksTitle}>Helpful Videos</Text>
//         </View>
        
//         <Text style={styles.helpLinksSubtitle}>
//           Watch tutorials to learn how to play Tambola games
//         </Text>
        
//         <View style={styles.linksList}>
//           {helpLinks.map((link, index) => (
//             <TouchableOpacity
//               key={link.key || index}
//               style={styles.linkItem}
//               onPress={() => openYouTubeLink(link.url)}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.linkIconContainer, { backgroundColor: `${COLORS.primary}10` }]}>
//                 <Icon name="play-circle" size={20} color={COLORS.primary} />
//               </View>
//               <View style={styles.linkContent}>
//                 <Text style={styles.linkTitle} numberOfLines={2}>
//                   {link.title}
//                 </Text>
//                 <Text style={styles.linkDescription} numberOfLines={1}>
//                   {link.description}
//                 </Text>
//               </View>
//               <Icon name="chevron-forward" size={18} color={COLORS.textLight} />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       {/* Animated Color Blocks */}
//       <AnimatedBackground />

//       <Animated.ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh} 
//             tintColor={COLORS.primary}
//             colors={[COLORS.primary]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Enhanced Header */}
//         <Header />

//         {/* SEARCH */}
//         <View style={styles.searchCard}>
//           <CardBackground accentColor={COLORS.teal} />
          
//           <View style={styles.searchBox}>
//             <Icon name="search" size={20} color={COLORS.textLight} />
//             <TextInput
//               placeholder="Search Help"
//               placeholderTextColor={COLORS.textLight}
//               value={search}
//               onChangeText={setSearch}
//               style={styles.searchInput}
//             />
//             {search.length > 0 && (
//               <TouchableOpacity onPress={() => setSearch('')}>
//                 <Icon name="close-circle" size={18} color={COLORS.textLight} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* HELP LINKS SECTION */}
//         {renderHelpLinks()}

//         {/* FAQ LIST */}
//         <View style={styles.sectionHeader}>
//           <View style={[styles.sectionIcon, { backgroundColor: `${COLORS.purple}15` }]}>
//             <Icon name="help-circle" size={20} color={COLORS.purple} />
//           </View>
//           <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
//         </View>

//         {loading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={COLORS.primary} />
//           </View>
//         )}

//         {!loading &&
//           filteredFaqs.map((faq, index) => (
//             <View key={faq.id} style={styles.faqCard}>
//               <CardBackground accentColor={accentColors[index % accentColors.length]} />
              
//               <TouchableOpacity
//                 style={styles.faqHeader}
//                 onPress={() => toggleFaq(faq.id)}
//               >
//                 <View style={styles.faqTitleWrapper}>
//                   <View style={[styles.faqIconContainer, { backgroundColor: `${COLORS.primary}10` }]}>
//                     <Icon 
//                       name={expanded[faq.id] ? "remove-circle" : "add-circle"} 
//                       size={20} 
//                       color={COLORS.primary} 
//                     />
//                   </View>
//                   <Text style={styles.faqQuestion} numberOfLines={2}>
//                     {faq.question}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
              
//               {expanded[faq.id] && (
//                 <View style={styles.faqAnswerWrapper}>
//                   <Text style={styles.faqAnswer}>
//                     {faq.answer}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ))}

//         {filteredFaqs.length === 0 && !loading && (
//           <View style={styles.emptyState}>
//             <Icon name="document-text-outline" size={48} color={COLORS.textLight} />
//             <Text style={styles.emptyText}>No FAQs found matching "{search}"</Text>
//             <TouchableOpacity 
//               style={[styles.clearButton, { backgroundColor: COLORS.primary }]}
//               onPress={() => setSearch('')}
//             >
//               <Text style={styles.clearButtonText}>Clear Search</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* CTA CARD */}
//         <View style={styles.ctaCard}>
//           <CardBackground accentColor={COLORS.orange} />
          
//           <View style={styles.ctaContent}>
//             <View style={styles.ctaIconContainer}>
//               <Icon name="mail" size={32} color={COLORS.orange} />
//             </View>
//             <Text style={styles.ctaTitle}>Still stuck?</Text>
//             <Text style={styles.ctaText}>
//               We're just a message away! Send us your query and we'll help you out.
//             </Text>
//             <TouchableOpacity style={[styles.ctaButton, { backgroundColor: COLORS.orange }]}>
//               <Icon name="send" size={18} color="#FFFFFF" />
//               <Text style={styles.ctaButtonText}>Send a message</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Bottom spacing */}
//         <View style={styles.bottomSpace} />
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// const accentColors = [COLORS.primary, COLORS.purple, COLORS.orange, COLORS.teal, COLORS.pink];

// export default Faqs;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 30,
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
//     marginBottom: 24,
//     overflow: 'hidden',
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
  
//   /* UK Pattern */
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
  
//   /* Header Content */
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     position: 'relative',
//     zIndex: 2,
//     paddingVertical: 10,
//   },
//   greeting: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 2,
//   },
//   title: {
//     fontSize: 28,
//     color: COLORS.text,
//     lineHeight: 36,
//   },
//   titleBold: {
//     fontWeight: '700',
//     color: COLORS.primary,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 4,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
  
//   /* Search Card */
//   searchCard: {
//     borderRadius: 20,
//     marginBottom: 24,
//     padding: 16,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     zIndex: 2,
//   },
//   searchInput: {
//     flex: 1,
//     marginHorizontal: 8,
//     fontSize: 14,
//     color: COLORS.text,
//     padding: 0,
//   },
  
//   /* Help Links Card */
//   helpLinksCard: {
//     borderRadius: 20,
//     marginBottom: 24,
//     padding: 20,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   helpLinksHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     zIndex: 2,
//   },
//   helpLinksIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   helpLinksTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
//   helpLinksSubtitle: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     marginBottom: 16,
//     lineHeight: 18,
//     zIndex: 2,
//   },
//   linksList: {
//     gap: 10,
//     zIndex: 2,
//   },
//   linkItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.background,
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   linkIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   linkContent: {
//     flex: 1,
//   },
//   linkTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   linkDescription: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
  
//   /* Section Header */
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//   },
  
//   /* FAQ Card */
//   faqCard: {
//     borderRadius: 16,
//     marginBottom: 12,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   faqHeader: {
//     padding: 16,
//     zIndex: 2,
//   },
//   faqTitleWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   faqIconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   faqQuestion: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.text,
//     lineHeight: 20,
//   },
//   faqAnswerWrapper: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     paddingTop: 4,
//     zIndex: 2,
//   },
//   faqAnswer: {
//     fontSize: 13,
//     color: COLORS.textLight,
//     lineHeight: 20,
//   },
  
//   /* Loading and Empty States */
//   loadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 40,
//     backgroundColor: COLORS.surface,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginTop: 12,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   clearButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   clearButtonText: {
//     color: '#FFFFFF',
//     fontSize: 13,
//     fontWeight: '600',
//   },
  
//   /* CTA Card */
//   ctaCard: {
//     borderRadius: 20,
//     marginTop: 16,
//     marginBottom: 8,
//     padding: 24,
//     position: 'relative',
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     backgroundColor: COLORS.surface,
//   },
//   ctaContent: {
//     alignItems: 'center',
//     zIndex: 2,
//   },
//   ctaIconContainer: {
//     width: 64,
//     height: 64,
//     borderRadius: 20,
//     backgroundColor: COLORS.orangeLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   ctaTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   ctaText: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   ctaButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 30,
//     gap: 8,
//     shadowColor: COLORS.orange,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   ctaButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: '600',
//   },
  
//   /* Misc */
//   loader: {
//     zIndex: 2,
//   },
//   bottomSpace: {
//     height: 20,
//   },
// });




import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Updated Color scheme matching Home component
const PRIMARY_COLOR = "#4facfe"; // Main blue color
const ACCENT_COLOR = "#ff9800"; // Orange accent
const BACKGROUND_COLOR = "#f5f8ff"; // Light background
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SECONDARY_COLOR = "#4facfe"; // Using same blue for consistency
const LIGHT_ACCENT = "#ffb74d"; // Lighter orange
const DARK_BLUE = "#4facfe"; // Using same blue

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [helpLinks, setHelpLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchFaqs(), fetchHelpLinks()]);
  };

  const fetchFaqs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/faqs",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status && res.data.data) setFaqs(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpLinks = async () => {
    try {
      setLinksLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        "https://tambolatime.co.in/public/api/user/help-links",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status && res.data.data) setHelpLinks(res.data.data);
    } catch (err) {
      console.log("Error fetching help links:", err);
    } finally {
      setLinksLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const toggleFaq = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openYouTubeLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  const renderHelpLinks = () => {
    if (linksLoading) {
      return (
        <View style={styles.helpLinksContainer}>
          <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        </View>
      );
    }

    if (helpLinks.length === 0) return null;

    return (
      <View style={styles.helpLinksContainer}>
        <View style={styles.helpLinksHeader}>
          <Icon name="videocam" size={22} color={PRIMARY_COLOR} />
          <Text style={styles.helpLinksTitle}>
            Helpful Videos
          </Text>
        </View>
        <Text style={styles.helpLinksSubtitle}>
          Watch tutorials to learn how to play Tambola games
        </Text>
        
        <View style={styles.linksList}>
          {helpLinks.map((link, index) => (
            <TouchableOpacity
              key={link.key || index}
              style={styles.linkItem}
              onPress={() => openYouTubeLink(link.url)}
              activeOpacity={0.7}
            >
              <View style={styles.linkIconContainer}>
                <Icon name="play-circle" size={20} color={PRIMARY_COLOR} />
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle} numberOfLines={2}>
                  {link.title}
                </Text>
                <Text style={styles.linkDescription} numberOfLines={1}>
                  {link.description}
                </Text>
              </View>
              <Icon name="chevron-forward" size={18} color={TEXT_LIGHT} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Help Desk
          </Text>
          <TouchableOpacity>
            <Icon name="settings-outline" size={24} color={WHITE} />
          </TouchableOpacity>
        </View>

        {/* TOP ILLUSTRATION */}
        <View style={styles.topImageWrapper}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
            }}
            style={{
              width: 120,
              height: 120,
              opacity: 0.9,
            }}
          />
        </View>

        {/* INTRO */}
        <Text style={styles.introText}>
          We're here to help you with anything and everything on Tambola Timez. Use the search below or check our frequently asked questions.
        </Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Help"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={TEXT_LIGHT}
          />
          <Icon name="search" size={20} color={TEXT_LIGHT} style={styles.searchIcon} />
        </View>

        {/* HELP LINKS SECTION */}
        {renderHelpLinks()}

        {/* FAQ LIST */}
        <Text style={styles.sectionTitle}>
          Frequently Asked Questions
        </Text>

        {loading && <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 20 }} />}

        {!loading &&
          filteredFaqs.map((faq) => (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(faq.id)}
              >
                <View style={styles.faqTitleWrapper}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                    }}
                    style={styles.faqIcon}
                  />
                  <Text style={styles.faqQuestion}>
                    {faq.question}
                  </Text>
                </View>
                <Icon 
                  name={expanded[faq.id] ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={PRIMARY_COLOR} 
                />
              </TouchableOpacity>
              {expanded[faq.id] && (
                <View style={styles.faqAnswerWrapper}>
                  <Text style={styles.faqAnswer}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}

        {filteredFaqs.length === 0 && !loading && (
          <Text style={styles.noFaqs}>No FAQs found.</Text>
        )}

        {/* CTA BUTTON */}
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Still stuck? Help us a mail away</Text>
          <Text style={styles.ctaBtnText}>Send a message</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Faqs;

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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  headerTitle: { 
    fontSize: 28,
    fontWeight: "700",
    color: TEXT_DARK,
    letterSpacing: -0.5,
  },
  topImageWrapper: { 
    alignItems: "center", 
    marginBottom: 15
  },
  introText: {
    fontSize: 15,
    color: TEXT_LIGHT,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { 
    fontSize: 15, 
    height: "100%",
    color: TEXT_DARK,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  // Help Links Styles
  helpLinksContainer: {
    backgroundColor: WHITE,
    borderRadius: 16,
    marginBottom: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  helpLinksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  helpLinksTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_DARK,
    marginLeft: 10,
  },
  helpLinksSubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginBottom: 20,
    lineHeight: 20,
  },
  linksList: {
    gap: 12,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F8FF',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    marginBottom: 4,
    lineHeight: 20,
  },
  linkDescription: {
    fontSize: 13,
    color: TEXT_LIGHT,
    lineHeight: 18,
  },
  // FAQ Section
  sectionTitle: { 
    fontSize: 18,
    fontWeight: "700", 
    marginBottom: 16,
    color: TEXT_DARK,
  },
  faqCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  faqTitleWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1,
    gap: 12,
  },
  faqIcon: { 
    width: 24, 
    height: 24,
  },
  faqQuestion: { 
    fontSize: 15,
    fontWeight: "600", 
    color: TEXT_DARK, 
    flex: 1,
    lineHeight: 20,
  },
  faqAnswerWrapper: {
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  faqAnswer: { 
    fontSize: 14,
    color: TEXT_LIGHT, 
    lineHeight: 22,
  },
  noFaqs: { 
    textAlign: "center", 
    marginTop: 20, 
    color: TEXT_LIGHT,
    fontSize: 15,
    fontStyle: "italic",
  },
  ctaButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ctaText: { 
    color: WHITE, 
    fontWeight: "500", 
    marginBottom: 6,
    fontSize: 14,
  },
  ctaBtnText: { 
    color: WHITE, 
    fontWeight: "700", 
    fontSize: 16 
  },
  bottomSpace: {
    height: 30,
  },
});
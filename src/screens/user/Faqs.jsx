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

const PRIMARY_COLOR = "#4facfe";
const ACCENT_COLOR = "#ff9800";
const BACKGROUND_COLOR = "#f5f8ff";
const WHITE = "#FFFFFF";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const BORDER_COLOR = "#EEEEEE";
const CARD_BACKGROUND = "#FFFFFF";
const SECONDARY_COLOR = "#4facfe";
const LIGHT_ACCENT = "#ffb74d";
const DARK_BLUE = "#4facfe";

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
    }
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/917507331103');
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Help Desk
          </Text>
          <TouchableOpacity>
            <Icon name="settings-outline" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
        </View>

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

        <Text style={styles.introText}>
          We're here to help you with anything and everything on Houzie Timez. Use the search below or check our frequently asked questions.
        </Text>

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

        {renderHelpLinks()}

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

        <TouchableOpacity style={styles.ctaButton} onPress={openWhatsApp}>
          <Text style={styles.ctaText}>Still stuck? We're a message away</Text>
          <View style={styles.ctaButtonInner}>
            <Icon name="logo-whatsapp" size={20} color={WHITE} style={styles.ctaIcon} />
            <Text style={styles.ctaBtnText}>Chat on WhatsApp</Text>
          </View>
        </TouchableOpacity>

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
    backgroundColor: "#25D366",
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
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaIcon: {
    marginRight: 2,
  },
  ctaBtnText: { 
    color: WHITE, 
    fontWeight: "700", 
    fontSize: 16,
  },
  bottomSpace: {
    height: 30,
  },
});
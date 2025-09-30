// screens/UploadScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Users } from "lucide-react-native";
import { StatsAPI, StatsResponse } from "@/services/statsApi";
// import { ColorizationAPI } from "@/services/colorizationApi";
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { ColorizationAPI } from "@/services/colorizationApiV1";

export default function UploadScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse>({
    total_users: 9,
    total_memories: 34,
    last_updated: new Date().toISOString(),
  });
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const realStats = await StatsAPI.getStats();
        setStats(realStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);


  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photo library."
      );
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // updated for Expo SDK 50+
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleProceed = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image before proceeding.');
      return;
    }

    try {
      // Extract file extension and mime type
      let fileType = 'image/jpeg';
      let fileName = `photo_${Date.now()}.jpg`;
      const match = selectedImage.match(/\.([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        const ext = match[1].toLowerCase();
        fileName = `photo_${Date.now()}.${ext}`;
        if (ext === 'png') fileType = 'image/png';
        else if (ext === 'jpg' || ext === 'jpeg') fileType = 'image/jpeg';
        else if (ext === 'gif') fileType = 'image/gif';
        else if (ext === 'webp') fileType = 'image/webp';
        else if (ext === 'bmp') fileType = 'image/bmp';
        else if (ext === 'tiff' || ext === 'tif') fileType = 'image/tiff';
        else if (ext === 'svg') fileType = 'image/svg+xml';
      }

      // React Native FormData file object
      const file = {
        uri: selectedImage,
        name: fileName,
        type: fileType,
      };

      // Start background job and get request id
      const uploadResp = await ColorizationAPI.uploadImage(file as any);
      if (!uploadResp?.request_id) {
        Alert.alert('Upload Failed', 'Could not start colorization process.');
        return;
      }

      // Navigate to processing screen with the request id and original URL (if available)
      router.push({ pathname: '/ProcessingScreen', params: { requestId: uploadResp.request_id, originalUrl: uploadResp.original_url || selectedImage } });
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      Alert.alert(
        'Upload Failed',
        `Please check your internet connection and try again. Error: ${errorMessage}`
      );
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <LinearGradient colors={["#FF6B35", "#F7931E"]} style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {
          // Main upload UI (progress-only flow)
        }
        
          <>
            <View style={styles.headerWrapper}>
              <Header variant="logout" />
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Transform your cherished black & white memories into vibrant colored
              moments
            </Text>

            {/* Stats */}
            <View style={styles.mobileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {StatsAPI.formatNumber(stats.total_users)}
                </Text>
                <View style={styles.statHeader}>
                  <Users size={16} color="#EF4444" />
                  <Text style={styles.statText}>Happy Users</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {StatsAPI.formatNumber(stats.total_memories)}
                </Text>
                <View style={styles.statHeader}>
                  <Heart size={16} color="#EF4444" />
                  <Text style={styles.statText}>Memories Revived</Text>
                </View>
              </View>
            </View>

            {/* Centered Section */}
            <View style={styles.centerSection}>
              <View style={styles.uploadBox}>
                <View style={styles.uploadCircle}>
                  <Image
                    source={require("../assets/images/upload.png")}
                    style={styles.logoImage1}
                  />
                </View>
                <Text style={styles.uploadTitle}>Upload Black & White Photo</Text>
                <Text style={styles.uploadSubtitle}>
                  Drag and drop or click to upload
                </Text>
                <Text style={styles.uploadFormats}>
                  Supports: JPG, PNG, GIF, WebP, BMP, TIFF, SVG (max 10MB)
                </Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={selectImage}
                >
                  <Text style={styles.selectButtonText}>Select Photo</Text>
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                )}
                {selectedImage && (
                  <TouchableOpacity
                    style={[styles.selectButton, { marginTop: 12 }]}
                    onPress={handleProceed}
                  >
                    <Text style={styles.selectButtonText}>Proceed</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
          <Footer topText="Perfect for your vintage wedding photos and family memories." />
      </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
}

// Styles remain the same as before
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingBottom: 20,
  },
  headerWrapper: {
    width: '100%',
  },
  subtitle: { fontSize: 16, color: "black", textAlign: "center", marginBottom: 20, lineHeight: 22, paddingHorizontal: 20, alignSelf: "center" },
  mobileStats: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingBottom: 30, gap: 30, alignSelf: "center" },
  statItem: { alignItems: "center" },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "black", marginBottom: 4 },
  statText: { fontSize: 12, color: "black", fontWeight: "500", textAlign: "center" },
  statDivider: { width: 1, height: 40, backgroundColor: "white" },
  centerSection: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 20, alignSelf: "stretch" },
  uploadBox: { borderWidth: 2, borderColor: "#fff", borderStyle: "dashed", borderRadius: 20, padding: 30, alignItems: "center", width: "100%", maxWidth: 400, marginBottom: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  uploadCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 3,
    borderColor: "white", 
    backgroundColor: "white", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage1: { width: 50, height: 50 },
  uploadTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 6 },
  uploadSubtitle: { fontSize: 14, color: "#333", marginBottom: 6 },
  uploadFormats: { fontSize: 12, color: "#666", textAlign: "center", marginBottom: 15 },
  selectButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  selectButtonText: { color: "black", fontWeight: "600", fontSize: 14 },
  previewImage: { width: "100%", height: 200, marginTop: 16, borderRadius: 12 },
  footerDivider: { width: "100%", height: 1, backgroundColor: "white", marginVertical: 10, alignSelf: "center", marginTop: 70 },
  footerTop: { fontSize: 14, color: "#b91c1c", textAlign: "center", marginTop: 20, marginBottom: 6 },
  footerBottom: { fontSize: 12, color: "black", textAlign: "center", marginBottom: 20 },
});

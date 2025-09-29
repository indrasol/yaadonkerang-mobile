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
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { signOut } from "@/services/supabaseClient";
import { Heart, Users, LogOut } from "lucide-react-native";
import { StatsAPI, StatsResponse } from "@/services/statsApi";
// import { ColorizationAPI } from "@/services/colorizationApi";
import { getErrorMessage, logError } from '@/utils/errorHandler';
import { ColorizationAPI, EphemeralResponse } from "@/services/colorizationApiV1";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function UploadScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse>({
    total_users: 9,
    total_memories: 34,
    last_updated: new Date().toISOString(),
  });
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          const { error } = await signOut();
          if (error) {
            Alert.alert("Error", "Failed to logout");
          } else {
            router.replace("/landing");
          }
        },
      },
    ]);
  };

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
      Alert.alert('Uploading', 'Please wait while we upload your image...');

      // Extract file extension and mime type
      let fileType = 'image/jpeg';
      let fileName = `photo_${Date.now()}.jpg`;
      const match = selectedImage.match(/\.([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        const ext = match[1].toLowerCase();
        fileName = `photo_${Date.now()}.${ext}`;
        // Basic mime type mapping
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

      const response = await ColorizationAPI.colorizeEphemeral(file);

      // EphemeralResponse: { original_base64, colorized_base64, expires_in }
      if (response && response.colorized_base64) {
        setColorizedImage(response.colorized_base64);
        setShowComparison(true);
      } else {
        Alert.alert('Error', 'Colorization failed. No image returned.');
      }
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
    <LinearGradient colors={["#FF6B35", "#F7931E"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showComparison ? (
          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonImagesRow}>
              <View style={styles.comparisonImageBlock}>
                <Text style={styles.comparisonLabel}>Original</Text>
                <Image
                  source={{ uri: selectedImage! }}
                  style={styles.comparisonImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.comparisonImageBlock}>
                <Text style={styles.comparisonLabel}>Colorized</Text>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${colorizedImage}` }}
                  style={styles.comparisonImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.comparisonActions}>
              <Text style={styles.comparisonSuccessTitle}>Memory Successfully Revived!</Text>
              <Text style={styles.comparisonSuccessSubtitle}>
                Your black & white photo now bursts with life and color
              </Text>
              <View style={styles.comparisonButtonRow}>
                <TouchableOpacity
                  style={styles.comparisonButton}
                  onPress={() => setShowComparison(false)}
                >
                  <Text style={styles.comparisonButtonText}>Revive Another Memory</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.comparisonButton}
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: 'Check out my revived memory!',
                        url: `data:image/jpeg;base64,${colorizedImage}`,
                      });
                    } catch (e) {
                      Alert.alert('Error', 'Failed to share image.');
                    }
                  }}
                >
                  <Text style={styles.comparisonButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.comparisonButton}
                  onPress={async () => {
                    try {
                      // @ts-ignore
                      const fileUri =
                        (FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? '') +
                        `colorized_${Date.now()}.jpg`;
                      // @ts-ignore
                      const encoding =
                        (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
                      await FileSystem.writeAsStringAsync(fileUri, colorizedImage!, { encoding });
                      const { status } = await MediaLibrary.requestPermissionsAsync();
                      if (status !== 'granted') throw new Error('Permission denied');
                      await MediaLibrary.saveToLibraryAsync(fileUri);
                      Alert.alert('Downloaded', 'Image saved to your gallery.');
                    } catch (e) {
                      Alert.alert('Error', 'Failed to download image.');
                    }
                  }}
                >
                  <Text style={styles.comparisonButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoRow}>
                <Image
                  source={require("../assets/images/favicon1.png")}
                  style={styles.logoImage}
                />
                <Text style={styles.logoText}>
                  YaadonKe<Text style={styles.logoAccent}>Rang</Text>
                </Text>
                <Text style={styles.subLogo}>by Indrasol</Text>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={18} color="black" style={{ marginRight: 6 }} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
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
              {/* Footer */}
              <Text style={styles.footerTop}>
                Perfect for your vintage wedding photos and family memories.
              </Text>
              <View style={styles.footerDivider} />
              <Text style={styles.footerBottom}>
                Made with <Heart size={14} color="#EF4444" /> to preserve and
                revive your precious memories
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Styles remain the same as before
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 30, height: 30, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  logoAccent: { color: "#DC2626" },
  subLogo: { fontSize: 14, color: "#555", marginLeft: 6 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: { color: "black", fontWeight: "600", fontSize: 14 },
  subtitle: { fontSize: 16, color: "black", textAlign: "center", marginBottom: 20, lineHeight: 22 },
  mobileStats: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingBottom: 30, gap: 30 },
  statItem: { alignItems: "center" },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "black", marginBottom: 4 },
  statText: { fontSize: 12, color: "black", fontWeight: "500", textAlign: "center" },
  statDivider: { width: 1, height: 40, backgroundColor: "white" },
  centerSection: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  uploadBox: { borderWidth: 2, borderColor: "#fff", borderStyle: "dashed", borderRadius: 20, padding: 30, alignItems: "center", width: "100%", maxWidth: 400, marginBottom: 20, backgroundColor: "rgba(255,255,255,0.1)" },
  uploadCircle: { width: 60, height: 60, borderRadius: 30, borderColor:"white", backgroundColor: "#feb47b", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  logoImage1: { width: 60, height: 60, marginRight: 8 },
  uploadTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 6 },
  uploadSubtitle: { fontSize: 14, color: "#333", marginBottom: 6 },
  uploadFormats: { fontSize: 12, color: "#666", textAlign: "center", marginBottom: 15 },
  selectButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  selectButtonText: { color: "black", fontWeight: "600", fontSize: 14 },
  previewImage: { width: "100%", height: 200, marginTop: 16, borderRadius: 12 },
  footerDivider: { width: "100%", height: 1, backgroundColor: "white", marginVertical: 10, alignSelf: "center", marginTop: 70 },
  footerTop: { fontSize: 14, color: "#b91c1c", textAlign: "center", marginTop: 20, marginBottom: 6 },
  footerBottom: { fontSize: 12, color: "black", textAlign: "center", marginBottom: 20 },
  comparisonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 30,
  },
  comparisonImagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  comparisonImageBlock: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonLabel: {
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  comparisonImage: {
    width: 160,
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  comparisonActions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  comparisonSuccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 6,
    textAlign: 'center',
  },
  comparisonSuccessSubtitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  comparisonButton: {
    backgroundColor: '#feb47b',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  comparisonButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});

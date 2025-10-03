// screens/ImageComparisonScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Share, Alert, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as WebBrowser from 'expo-web-browser';

export default function ImageComparisonScreen() {
  const { original, colorized } = useLocalSearchParams<{ original: string; colorized: string }>();
  const router = useRouter();
  const [showComparison, setShowComparison] = useState(true);
  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out my revived memory! https://yaadonkerang.indrasol.com",
        url: String(colorized),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      const imageUrl = String(colorized);
      const fileName = `colorized_memory_${Date.now()}.jpg`;
      
      if (Platform.OS === 'web') {
        // For web, use browser download
        await WebBrowser.openBrowserAsync(imageUrl);
        return;
      }

      // For mobile platforms
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
        return;
      }

      // Download the image to temporary location
      const tempFileUri = `file:///tmp/${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(imageUrl, tempFileUri);
      
      if (downloadResult.status === 200) {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        Alert.alert('Success', 'Image saved to your gallery!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download image. Please try again.');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <LinearGradient colors={["#FF6B35", "#F7931E"]} style={styles.page}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <Header variant="logout" />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Memory Successfully Revived!</Text>
          
          <View style={styles.imagesRow}>
            {showComparison && (
              <View style={styles.imageBlock}>
                <Text style={styles.badge}>Original</Text>
                <Image source={{ uri: String(original) }} style={styles.compareImage} resizeMode="cover" />
              </View>
            )}
            <View style={styles.imageBlock}>
              <Text style={[styles.badge, styles.badgeAlt]}>Colorized</Text>
              <Image source={{ uri: String(colorized) }} style={styles.compareImage} resizeMode="cover" />
            </View>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.cardTitle}>Your Memory is Ready!</Text>
            <Text style={styles.cardSubtitle}>Your black & white photo now bursts with life and color</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.ghostButton]} onPress={() => setShowComparison((v) => !v)}>
                <Text style={styles.ghostButtonText}>{showComparison ? 'Hide Comparison' : 'Show Comparison'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
                <Text style={styles.secondaryButtonText}>Download</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/upload')}>
              <Text style={styles.primaryButtonText}>Revive Another Memory</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Footer topText="Your precious memories, beautifully restored." />
      </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  page: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 30,
  },
  imageBlock: { 
    alignItems: 'center', 
    flex: 1,
    maxWidth: 160,
  },
  badge: {
    backgroundColor: '#111827',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 12,
  },
  badgeAlt: { backgroundColor: '#F59E0B' },
  compareImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#374151', 
    textAlign: 'center',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  ghostButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ghostButtonText: { color: '#111827', fontWeight: '600' },
  secondaryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryButtonText: { color: '#111827', fontWeight: '700' },
  primaryButton: {
    backgroundColor: '#feb47b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#111827', fontWeight: '700' },
});

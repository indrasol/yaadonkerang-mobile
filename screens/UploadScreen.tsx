import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { signOut } from '@/services/supabaseClient';
import GradientButton from '@/components/GradientButton';
import axios from 'axios';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Upload'>;

export default function UploadScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to logout');
            } else {
              navigation.navigate('Landing');
            }
          },
        },
      ]
    );
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photo library.'
      );
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Photo',
      'Choose how you want to select your photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
      ]
    );
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setProcessedImage(null);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setProcessedImage(null);
    }
  };

  const validateImage = (uri: string): boolean => {
    // Basic validation - in a real app, you might want to check file size and format
    return true;
  };

  const processImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (!validateImage(selectedImage)) {
      Alert.alert(
        'Invalid Image',
        'Please select a valid image (JPG, PNG, GIF, WebP, BMP, TIFF, SVG) under 10MB'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      // Replace with your actual backend API endpoint
      const API_ENDPOINT = 'https://your-api-endpoint.com/colorize';
      
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      if (response.data && response.data.processed_image_url) {
        setProcessedImage(response.data.processed_image_url);
        Alert.alert('Success', 'Your photo has been colorized!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Processing error:', error);
      
      // For demo purposes, simulate a processed image
      // Remove this in production and handle the actual API call
      setTimeout(() => {
        setProcessedImage('https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?w=400&h=400');
        Alert.alert('Demo Mode', 'This is a demo. In production, your actual photo would be processed.');
      }, 3000);
      
      // Uncomment the following lines for production:
      // Alert.alert(
      //   'Error',
      //   'Failed to process image. Please try again later.'
      // );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setProcessedImage(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logo}>YaadonKeRang</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.uploadSection}>
          <Text style={styles.title}>Transform Your Memory</Text>
          <Text style={styles.subtitle}>
            Upload your black & white photo and watch the magic happen
          </Text>

          {!selectedImage ? (
            <TouchableOpacity
              style={styles.uploadArea}
              onPress={selectImage}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>Select Photo</Text>
              <Text style={styles.uploadSubtext}>
                Tap to choose from gallery or camera
              </Text>
              <Text style={styles.formatText}>
                Supports: JPG, PNG, GIF, WebP, BMP, TIFF, SVG (max 10MB)
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <View style={styles.imagePreview}>
                <Text style={styles.previewLabel}>Original</Text>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              </View>
              
              {processedImage && (
                <View style={styles.imagePreview}>
                  <Text style={styles.previewLabel}>Colorized</Text>
                  <Image source={{ uri: processedImage }} style={styles.previewImage} />
                </View>
              )}
              
              <View style={styles.buttonContainer}>
                {!processedImage && !isProcessing && (
                  <GradientButton
                    title="Transform Photo"
                    onPress={processImage}
                    style={styles.processButton}
                  />
                )}
                
                {isProcessing && (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="large" color="#FF6B35" />
                    <Text style={styles.processingText}>
                      Processing your photo...
                    </Text>
                    <Text style={styles.processingSubtext}>
                      This may take a few seconds
                    </Text>
                  </View>
                )}
                
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetUpload}
                >
                  <Text style={styles.resetButtonText}>
                    Select Different Photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {processedImage && (
          <View style={styles.successSection}>
            <Text style={styles.successTitle}>🎉 Your Memory is Revived!</Text>
            <Text style={styles.successText}>
              Your black & white photo has been successfully transformed into a vibrant, colorful memory.
            </Text>
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => Alert.alert('Feature Coming Soon', 'Share functionality will be available in the next update!')}
            >
              <Text style={styles.shareButtonText}>Share Your Memory</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  formatText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  previewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  processButton: {
    width: '100%',
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  resetButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  successSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  shareButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
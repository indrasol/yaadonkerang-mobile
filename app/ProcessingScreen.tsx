// screens/ProcessingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Alert, TouchableOpacity, Share, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ColorizationAPI } from '@/services/colorizationApiV1';
import * as WebBrowser from 'expo-web-browser';

export default function ProcessingScreen() {
  const { requestId, originalUrl, imageUri } = useLocalSearchParams<{ requestId?: string; originalUrl?: string; imageUri?: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('uploading');
  const [statusText, setStatusText] = useState<string>('Uploading your photo...');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(requestId || null);
  const [activeOriginalUrl, setActiveOriginalUrl] = useState<string | null>(originalUrl || imageUri || null);

  // Handle upload if imageUri is provided without requestId
  useEffect(() => {
    if (activeRequestId) {
      // Already have requestId, skip upload
      return;
    }

    if (!imageUri) {
      setError('No image provided');
      return;
    }

    const performUpload = async () => {
      try {
        setStatus('uploading');
        setStatusText('Uploading your photo...');
        setProgress(0);

        // Gradually animate progress from 0 to 25% before upload
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(5);
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(10);
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(15);
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(20);
        await new Promise(resolve => setTimeout(resolve, 150));
        setProgress(25);

        // Extract file extension and mime type
        let fileType = 'image/jpeg';
        let fileName = `photo_${Date.now()}.jpg`;
        const match = String(imageUri).match(/\.([a-zA-Z0-9]+)$/);
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

        const file = {
          uri: String(imageUri),
          name: fileName,
          type: fileType,
        };

        setProgress(30);
        
        // Simulate gradual upload progress
        let uploadComplete = false;
        const progressSimulator = setInterval(() => {
          if (!uploadComplete) {
            setProgress((prev) => {
              if (prev < 45) {
                return prev + 2;
              }
              return prev;
            });
          }
        }, 400);

        const uploadResp = await ColorizationAPI.uploadImage(file as any);
        uploadComplete = true;
        clearInterval(progressSimulator);
        
        if (!uploadResp?.request_id) {
          setError('Upload failed. Could not start colorization process.');
          return;
        }

        setProgress(50);
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(55);
        
        setActiveRequestId(uploadResp.request_id);
        setActiveOriginalUrl(uploadResp.original_url || String(imageUri));
        setStatus('processing');
        setStatusText('Processing image...');
      } catch (err) {
        console.error('Upload error:', err);
        let errorMessage = 'Upload failed';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);
      }
    };

    performUpload();
  }, [imageUri, activeRequestId]);

  // Handle polling once we have a requestId
  useEffect(() => {
    if (!activeRequestId) {
      return;
    }

    setStatus('processing');
    setStatusText('Adding vibrant colors to your memory...');
    
    // Continue progress from 50% or start at 0
    let isComplete = false;
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (isComplete) return 100;
        const next = prev + Math.max(1, Math.round((95 - prev) * 0.07));
        return Math.min(95, next);
      });
    }, 1000);

    // Poll server for real completion using v1 API
    ColorizationAPI.pollStatus(
      String(activeRequestId),
      (update) => {
        if (update.status === 'processing') {
          setStatus('processing');
          setStatusText('Bringing your memory back to life...');
        }
      },
      (result) => {
        isComplete = true;
        setStatus('done');
        setStatusText('Complete!');
        setProgress(100);
        if (result.colorized_url) {
          setResultImage(result.colorized_url);
        }
        clearInterval(progressTimer);
      },
      (errMsg) => {
        setError(errMsg || 'Processing failed');
        setStatus('error');
        clearInterval(progressTimer);
      },
      1500,
      120,
      180000
    );

    return () => {
      clearInterval(progressTimer);
    };
  }, [activeRequestId]);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
        <LinearGradient colors={["#FF6B35", "#F7931E"]} style={styles.page}>
          <View style={styles.headerWrapper}>
            <Header variant="logout" />
          </View>
          <View style={styles.container}>
            <Text style={styles.errorTitle}>Processing Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <Footer />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Navigate to comparison screen when result is ready
  useEffect(() => {
    if (resultImage && activeOriginalUrl) {
      router.replace({ pathname: '/ImageComparisonScreen', params: { original: String(activeOriginalUrl), colorized: resultImage } });
    }
  }, [resultImage, activeOriginalUrl, router]);

  if (resultImage) {
    // Show loading state while navigation happens
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#f97316" />
        <LinearGradient
          colors={["#f97316", "#fb923c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.centerStack}>
            <Text style={styles.loadingTitle}>Redirecting to Results...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />
      <LinearGradient
        colors={["#f97316", "#fb923c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.headerWrapper}>
          <Header variant="logout" />
        </View>
      <View style={styles.centerStack}>
        <View style={styles.loaderRing}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingTitle}>
          {status === 'uploading' ? 'Uploading Your Photo' : 'Colorization in Progress'}
        </Text>
        <Text style={styles.loadingSubtitle}>
          {statusText}
        </Text>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(0, Math.min(100, progress))}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{progress}% complete</Text>
        </View>
      </View>
      <Footer />
    </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f97316',
  },
  page: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerWrapper: {
    width: '100%',
  },
  centerStack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  loaderRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressWrap: {
    width: '100%',
    marginTop: 18,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 6,
    backgroundColor: '#FDE7C4',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 6,
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#fff',
  },
  noteText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  resultImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginVertical: 20,
  },
  comparisonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 30,
    backgroundColor: '#f5f5f5',
  },
  comparisonImagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 20,
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
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
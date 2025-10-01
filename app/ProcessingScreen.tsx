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
  const { requestId, originalUrl } = useLocalSearchParams<{ requestId: string; originalUrl?: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('processing');

  useEffect(() => {
    if (!requestId) {
      setError('No request ID provided');
      return;
    }

    // Simulated progress that eases to 95% while processing
    setProgress(0);
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
      String(requestId),
      (update) => {
        if (update.status === 'processing') {
          setStatus('processing');
        }
      },
      (result) => {
        isComplete = true;
        setStatus('done');
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
  }, [requestId]);

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
    if (resultImage && originalUrl) {
      router.replace({ pathname: '/ImageComparisonScreen', params: { original: String(originalUrl), colorized: resultImage } });
    }
  }, [resultImage, originalUrl, router]);

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
        <Text style={styles.loadingTitle}>Colorization in Progress</Text>
        <Text style={styles.loadingSubtitle}>
          Please wait while we are bringing your memory back to life...
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
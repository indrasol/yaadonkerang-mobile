// screens/ProcessingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ColorizationAPI } from '../services/colorizationApi';
import { getErrorMessage, logError } from '@/utils/errorHandler';

export default function ProcessingScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
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
  
    const pollStatus = async () => {
      try {
        const data = await ColorizationAPI.checkStatus(requestId);
        console.log('Status check:', data);
  
        if (data.status === 'processing') {
          setProgress(data.progress || 0);
          setStatus('processing');
        } else if (data.status === 'done' && data.colorized_url) {
          setResultImage(data.colorized_url);
          setStatus('done');
        } else if (data.status === 'error') {
          setError(data.message || 'Processing failed');
          setStatus('error');
        }
      } catch (err) {
        console.error('Status check error:', err);
        
        // Properly type the error
        let errorMessage = 'Unknown error occurred';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        
        setError(errorMessage);
        setStatus('error');
      }
    };
  
    // Poll immediately
    pollStatus();
  
    // Set up interval for polling (every 3 seconds)
    const interval = setInterval(pollStatus, 3000);
  
    return () => clearInterval(interval);
  }, [requestId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Processing Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (resultImage) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Colorization Complete! 🎉</Text>
        <Image source={{ uri: resultImage }} style={styles.resultImage} />
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Colorize Another Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={styles.title}>Processing Your Image</Text>
      <Text style={styles.progressText}>{progress}% Complete</Text>
      <Text style={styles.noteText}>
        This usually takes 1-2 minutes{'\n'}
        Please keep the app open
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  progressText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
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
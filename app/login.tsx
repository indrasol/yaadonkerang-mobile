import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInputKeyPressEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithOTP, verifyOTP } from '@/services/supabaseClient';
import GradientButton from '@/components/GradientButton';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signInWithOTP(email);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setIsOTPSent(true);
        setResendCountdown(60);
        Alert.alert('Success', 'OTP sent to your email address');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await verifyOTP(email, otpString);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else if (data.user) {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => router.replace('/upload'),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCountdown === 0) {
      handleSendOTP();
    }
  };

  const resetForm = () => {
    setIsOTPSent(false);
    setOtp(['', '', '', '', '', '']);
    setEmail('');
    setResendCountdown(0);
  };

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      // Auto-focus next input
      if (index < 5 && numericText) {
        (otpRefs.current[index + 1] as TextInput | null)?.focus();
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle backspace/key press
  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      const prevInput = otpRefs.current[index - 1] as TextInput | null;
      prevInput?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            {/* Logo Section - Aligned to left as per image */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/favicon1.png')} 
                style={styles.logoImage}
              />
              <View style={styles.logoTextContainer}>
                <View style={styles.mainLogoRow}>
                  <Text style={styles.logo}>
                    YaadonKe<Text style={styles.logoAccent}>Rang</Text>
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.subLogo}>by Indrasol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Subtitle - Centered */}
            <Text style={styles.subtitle}>
              {isOTPSent 
                ? "Enter the 6-digit code sent to your email"
                : "Enter your email to receive a verification code"
              }
            </Text>

            {/* Form Container - Centered */}
            <View style={styles.formContainer}>
              {!isOTPSent ? (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                    onSubmitEditing={handleSendOTP}
                  />
                  
                  <GradientButton
                    title={isLoading ? "Sending..." : "Send OTP"}
                    onPress={handleSendOTP}
                    style={styles.button}
                    disabled={isLoading || !email}
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  {/* Back and Email Display */}
                  <View style={styles.backEmailContainer}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={resetForm}
                    >
                      <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.emailDisplay}>{email}</Text>
                  </View>

                  <Text style={styles.inputLabel}>Verification Code</Text>
                  
                  {/* OTP Input */}
                  <View style={styles.otpContainer}>
                    {[...Array(6)].map((_, index) => (
                      <TextInput
                        key={index}
                        ref={(ref: TextInput | null) => {
                          (otpRefs.current as Array<TextInput | null>)[index] = ref;
                        }}
                        style={[
                          styles.otpInput,
                          otp[index] && styles.otpInputFilled
                        ]}
                        value={otp[index]}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        editable={!isLoading}
                        selectTextOnFocus
                      />
                    ))}
                  </View>
                  
                  <GradientButton
                    title={isLoading ? "Verifying..." : "Verify & Login"}
                    onPress={handleVerifyOTP}
                    style={styles.button}
                    disabled={isLoading || otp.join('').length !== 6}
                  />
                  
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResendOTP}
                    disabled={resendCountdown > 0 || isLoading}
                  >
                    {resendCountdown > 0 ? (
                      <Text style={styles.resendCountdownText}>
                        Resend in {resendCountdown}s
                      </Text>
                    ) : (
                      <Text style={styles.resendText}>Resend Code</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer Back Button - Centered */}
            <TouchableOpacity
              style={styles.footerBackButton}
              onPress={() => router.back()}
            >
              <Text style={styles.footerBackText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
    marginLeft: 0,
    width: '100%',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
  },
  logoTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  mainLogoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    width: '100%',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  logoAccent: {
    color: '#DC2626',
  },
  subLogo: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    width: '100%',
  },
  formContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    gap: 20,
  },
  backEmailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  emailDisplay: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 0,
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    textAlign: 'left',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fafafa',
    textAlign: 'center',
    minHeight: 60,
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
  resendCountdownText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  footerBackButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  footerBackText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
});
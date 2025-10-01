import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, LogIn } from 'lucide-react-native';
import { signOut } from '@/services/supabaseClient';

const { width } = Dimensions.get('window');

type HeaderVariant = 'login' | 'logout' | 'none';

interface HeaderProps {
  variant?: HeaderVariant;
}

export default function Header({ variant = 'logout' }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          const { error } = await signOut();
          if (error) {
            Alert.alert('Error', 'Failed to logout');
          } else {
            router.replace('/landing');
          }
        },
      },
    ]);
  };

  const renderAction = () => {
    const iconSize = getResponsiveSize().iconSize;
    
    if (variant === 'login') {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/login')}>
          <View style={styles.actionContent}>
            <LogIn size={iconSize} color="black" />
            <Text style={styles.actionText}>Login</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (variant === 'logout') {
      return (
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <View style={styles.actionContent}>
            <LogOut size={iconSize} color="black" />
            <Text style={styles.actionText}>Logout</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Image
          source={require('../assets/images/favicon1.png')}
          style={styles.logoImage}
        />
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoText}>YaadonKe</Text>
          <Text style={styles.logoAccent}>Rang</Text>
          <Text style={styles.subLogo}>by Indrasol</Text>
        </View>
      </View>
      {renderAction()}
    </View>
  );
}

const getResponsiveSize = () => {
  if (width < 400) {
    return {
      logoSize: 32,
      logoFontSize: 16,
      subLogoFontSize: 8,
      iconSize: 13,
      actionFontSize: 12,
      actionPaddingH: 10,
      actionPaddingV: 5,
      spacing: 16, // Force good spacing on small screens
    };
  } else if (width < 768) {
    return {
      logoSize: 40,
      logoFontSize: 20,
      subLogoFontSize: 10,
      iconSize: 16,
      actionFontSize: 14,
      actionPaddingH: 12,
      actionPaddingV: 6,
      spacing: 16, // Consistent spacing
    };
  } else {
    return {
      logoSize: 48,
      logoFontSize: 24,
      subLogoFontSize: 12,
      iconSize: 18,
      actionFontSize: 16,
      actionPaddingH: 14,
      actionPaddingV: 7,
      spacing: 20, // Larger spacing for large screens
    };
  }
};

const responsiveSizes = getResponsiveSize();

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: width * 0.04,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    marginRight: responsiveSizes.spacing,
  },
  logoImage: {
    width: responsiveSizes.logoSize,
    height: responsiveSizes.logoSize,
    marginRight: 3,
    resizeMode: 'contain',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 1,
  },
  logoText: {
    fontSize: responsiveSizes.logoFontSize,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  logoAccent: {
    fontSize: responsiveSizes.logoFontSize,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginLeft: 2,
  },
  subLogo: {
    fontSize: responsiveSizes.subLogoFontSize,
    color: '#374151',
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: 'white',
    paddingHorizontal: responsiveSizes.actionPaddingH,
    paddingVertical: responsiveSizes.actionPaddingV,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: responsiveSizes.spacing,
    flexShrink: 0,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  actionText: {
    color: 'black',
    fontWeight: '600',
    fontSize: responsiveSizes.actionFontSize,
    marginLeft: 6,
  },
});

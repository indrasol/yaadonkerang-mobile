import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Users, Heart, ArrowRight, Zap, Star, Shield } from 'lucide-react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StatsAPI, StatsResponse } from '@/services/statsApi';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse>({
    total_users: 9,
    total_memories: 34,
    last_updated: new Date().toISOString()
  });

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const realStats = await StatsAPI.getStats();
        setStats(realStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep fallback values if API fails
      }
    };

    fetchStats();
  }, []);

  // Helper function
  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const beforeAfterImages = [
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/a77e6674-7742-456e-8d3b-71136866d2b3.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/9a1e83b6-1b82-42b7-ae58-c13f4b3dfbfa_colorized.png?',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/f44a38a4-5da2-4c56-bfb3-5f58ef0cef94.png?',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/f44a38a4-5da2-4c56-bfb3-5f58ef0cef94_colorized.png?',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/21b66fa0-ae23-4020-949d-43a1fb969147.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/21b66fa0-ae23-4020-949d-43a1fb969147_colorized.png',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1d1e8a9b-f453-43c9-ba1e-2ce890ee2663.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/e88e5ac0-c743-4a7e-beae-30f92668a40b_colorized.png',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/825b88b4-46ea-48ba-ba91-e2ee147bd26a.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/44c3075d-a62b-461e-9d0f-ad688969e1af_colorized.png?',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/8f4b37c6-70f0-4b97-ad41-f8342b541b6e.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/8f4b37c6-70f0-4b97-ad41-f8342b541b6e_colorized.png',
    },
    {
      before:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/92e6b131-8306-4e1f-9229-093c57b18c51.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/92e6b131-8306-4e1f-9229-093c57b18c51_colorized.png',
    },
    {
      before: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1cc1140a-1ac5-47bc-9961-cbdefe7bf60a.png',
      after: 'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1cc1140a-1ac5-47bc-9961-cbdefe7bf60a_colorized.png?',
    },
    {
      before:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0573389b-082f-4e3b-a10a-d428c5f808f7.png?',
      after:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0573389b-082f-4e3b-a10a-d428c5f808f7_colorized.png?'
    },
    {
      before:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/40dbbc8f-ecac-4e81-b7aa-6f1efe94e1fb.png?',
      after:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/40dbbc8f-ecac-4e81-b7aa-6f1efe94e1fb_colorized.png'
    },
    {
      before:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/d86e6035-8431-4b2d-bc8d-17b470834621.png?',
      after:'https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/d86e6035-8431-4b2d-bc8d-17b470834621_colorized.png?'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#ff7e5f" />
      <LinearGradient
        colors={['#ff7e5f', '#feb47b']}
        style={styles.fullScreenGradient}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSpacing}>
          <Header variant="login" />

          {/* Mobile Stats */}
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

          {/* Hero Section */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Bring Your{' '}
              <Text style={styles.heroTitleMuted}>Black & White </Text>
              Photos to Life
            </Text>
            <Text style={styles.heroSubtitle}>
              Transform your precious vintage wedding photos and family memories into stunning colored masterpieces — bringing decades-old memories back to life.
            </Text>
            
            <TouchableOpacity onPress={() => router.push('/login')}>
              <LinearGradient
                colors={['#f97316', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.ctaButton, styles.ctaButtonHero]}
              >
                <Text style={[styles.ctaButtonText, styles.ctaButtonHeroText]}>
                  Experience for Free
                </Text>
                <ArrowRight size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Before/After Split Section */}
        <View style={styles.splitSection}>
          {/* Before Side */}
          <View style={[styles.splitSide, styles.beforeSide]}>
            <View style={styles.splitHeader}>
              <Text style={styles.splitTitle}>Before</Text>
              <Text style={styles.splitSubtitle}>Your precious memories in black & white</Text>
            </View>
            
            <View style={styles.imageGridContainer}>
              <View style={styles.imageGrid}>
                {chunkArray(beforeAfterImages.map(img => img.before), 3).map((column, columnIndex) => (
                  <View key={columnIndex} style={styles.imageColumn}>
                    {column.map((uri, imageIndex) => (
                      <Image
                        key={imageIndex}
                        source={{ uri }}
                        style={styles.splitImage}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* After Side */}
          <LinearGradient
            colors={["#f97316", "#dc2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.splitSide, styles.afterSide]}
          >
            <View style={styles.splitHeader}>
              <Text style={styles.splitTitle}>After</Text>
              <Text style={styles.afterSubtitle}>
                Brought back to life with vibrant colors
              </Text>
            </View>

            <View style={styles.imageGridContainer}>
              <View style={styles.imageGrid}>
                {chunkArray(beforeAfterImages.map(img => img.after), 3).map(
                  (column, columnIndex) => (
                    <View key={columnIndex} style={styles.imageColumn}>
                      {column.map((uri, imageIndex) => (
                        <Image
                          key={imageIndex}
                          source={{ uri }}
                          style={styles.splitImage}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  )
                )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Zap size={24} color="white" />
              </View>
              <Text style={styles.featureTitle}>Lightning Fast</Text>
              <Text style={styles.featureDescription}>
                Get your colorized photos in seconds, not hours
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, styles.featureIconPurple]}>
                <Star size={24} color="white" />
              </View>
              <Text style={styles.featureTitle}>Premium Quality</Text>
              <Text style={styles.featureDescription}>
                Museum-quality colorization that preserves the emotion and authenticity of your memories.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={[styles.featureIconContainer, styles.featureIconGreen]}>
                <Heart size={24} color="white" />
              </View>
              <Text style={styles.featureTitle}>Made with Love</Text>
              <Text style={styles.featureDescription}>
                Specially to add color to your vintage and old wedding photos and family memories that matter most to you.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Shield size={24} color="white" />
              </View>
              <Text style={styles.featureTitle}>Privacy First</Text>
              <Text style={styles.featureDescription}>
                We never store your photos. Everything is processed securely and deleted immediately.
              </Text>
            </View>
          </View>
        </View>

        {/* Final CTA Section */}
        <View style={styles.finalCtaSection}>
          <View style={styles.finalCtaCard}>
            <Text style={styles.finalCtaTitle}>Ready to Add Color to Your Memories?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <LinearGradient
                colors={['#f97316', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.finalCtaButton, styles.finalCtaButtonHero]}
              >
                <Text style={[styles.finalCtaButtonText, styles.finalCtaButtonHeroText]}>
                  Add Color to your Memory
                </Text>
                <ArrowRight size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.finalCtaSubtitle}>
              Instant results • Your memories, beautifully restored
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Footer topText="Perfect for your vintage wedding photos and family memories." />
      </ScrollView>
    </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff7e5f',
  },
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerSpacing: {
    paddingTop: 0,
  },
  mobileStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', 
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  heroTitleMuted: {
    color: '#6B7280',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  ctaButtonHero: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaButtonHeroText: {
    fontSize: 20,
    fontWeight: '700',
  },  
  splitSection: {
    flexDirection: 'column',
  },
  splitSide: {
    minHeight: 400,
    paddingVertical: 20,
  },
  beforeSide: {
    backgroundColor: '#111827',
  },
  afterSide: {
    backgroundColor: '#ED3F27',
  },
  splitHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  splitTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  splitSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  afterSubtitle: {
    fontSize: 14,
    color: '#FFEDD5',
    textAlign: 'center',
  },
  imageGridContainer: {
    paddingHorizontal: 10,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  imageColumn: {
    flexDirection: 'column',
    gap: 5,
    flex: 1,
    maxWidth: (width - 40) / 3,
  },
  splitImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  featuresSection: {
    padding: 20,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FBAF40',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconPurple: {
    backgroundColor: '#FBAF40',
  },
  featureIconGreen: {
    backgroundColor: '#FBAF40',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  finalCtaSection: {
    padding: 20,
  },
  finalCtaCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    backgroundColor: 'rgba(255, 237, 213, 0)',
  },
  finalCtaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  finalCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  finalCtaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  finalCtaButtonHero: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  finalCtaButtonHeroText: {
    fontSize: 20,
    fontWeight: '700',
  },
  finalCtaSubtitle: {
    fontSize: 15,
    color: '#111827',
    textAlign: 'center',
  },
  
});
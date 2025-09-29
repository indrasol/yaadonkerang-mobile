import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import GradientButton from '@/components/GradientButton';
import StatCard from '@/components/StatCard';
import FeatureCard from '@/components/FeatureCard';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();

  const beforeAfterImages = [
    {
      before: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?w=300&h=300',
      after: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?w=300&h=300',
    },
    {
      before: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?w=300&h=300',
      after: 'https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?w=300&h=300',
    },
    {
      before: 'https://images.pexels.com/photos/1580267/pexels-photo-1580267.jpeg?w=300&h=300',
      after: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?w=300&h=300',
    },
    {
      before: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=300&h=300',
      after: 'https://images.pexels.com/photos/1059116/pexels-photo-1059116.jpeg?w=300&h=300',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.logo}>YaadonKeRang</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Bring Your Old Memories{'\n'}Back to Life
            </Text>
            <Text style={styles.heroSubtitle}>
              Transform your black & white photos into vibrant, colorful memories using advanced AI technology
            </Text>
            
            <View style={styles.statsContainer}>
              <StatCard number="10K+" label="Happy Users" />
              <StatCard number="25K+" label="Memories Revived" />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Before/After Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>See the Magic</Text>
          <Text style={styles.sectionSubtitle}>
            Watch how our AI transforms your precious memories
          </Text>
          
          <View style={styles.galleryContainer}>
            {beforeAfterImages.map((imageSet, index) => (
              <View key={index} style={styles.beforeAfterPair}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageSet.before }} style={styles.galleryImage} />
                  <Text style={styles.imageLabel}>Before</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageSet.after }} style={styles.galleryImage} />
                  <Text style={styles.imageLabel}>After</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose YaadonKeRang?</Text>
          
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              description="Get your colorized photos in seconds, not hours"
            />
            <FeatureCard
              icon="💎"
              title="Premium Quality"
              description="State-of-the-art AI ensures stunning, realistic results"
            />
            <FeatureCard
              icon="❤️"
              title="Made with Love"
              description="Crafted with care to preserve your precious memories"
            />
            <FeatureCard
              icon="🔒"
              title="Privacy First"
              description="Your photos are secure and never stored permanently"
            />
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Revive Your Memories?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of happy users who have brought their old photos back to life
          </Text>
          <GradientButton
            title="Add Color to Your Memory"
            onPress={() => navigation.navigate('Login')}
            style={styles.ctaButton}
          />
        </View>
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
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  heroSection: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  galleryContainer: {
    gap: 20,
  },
  beforeAfterPair: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  galleryImage: {
    width: (width - 100) / 2,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  arrowContainer: {
    paddingHorizontal: 15,
  },
  arrow: {
    fontSize: 20,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  ctaSection: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 20,
    paddingVertical: 50,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  ctaButton: {
    width: width - 80,
  },
});
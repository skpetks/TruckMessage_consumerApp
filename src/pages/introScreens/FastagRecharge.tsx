import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const FastagRecharge = () => {
  const navigation = useNavigation();
  
  return (
    <LinearGradient
      colors={['#FFE5E5', '#E8D5FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Central Circle with FASTag Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <View style={styles.logoContent}>
            <Text style={styles.fastagLogo}>
              <Text style={styles.fasText}>FAS</Text>
              <Text style={styles.tagText}>Tag</Text>
            </Text>
            <Text style={styles.tapToExplore}>Tap to Explore</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.mainHeading}>Recharge FASTag</Text>
        <Text style={styles.description}>
          Add truck FASTags in one app, recharge instantly, and get alerts when your balance is running low.
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => navigation.navigate('FindOnMarketplace' as never)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default FastagRecharge

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoContent: {
    alignItems: 'center',
  },
  fastagLogo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fasText: {
    color: '#FF6B35',
  },
  tagText: {
    color: '#4CAF50',
  },
  tapToExplore: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
})
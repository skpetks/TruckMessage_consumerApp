import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Utilities = () => {
  const navigation = useNavigation();
  
  return (
    <LinearGradient
      colors={['#FFE5E5', '#E8D5FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Diagonal White Shape */}
      <View style={styles.diagonalShape} />
      
      {/* Central Circle with Package Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <View style={styles.packageContainer}>
            <Icon name="inventory" size={50} color="#8B4513" />
            <View style={styles.bookmarkIcon}>
              <Icon name="bookmark" size={16} color="#FFD700" />
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.mainHeading}>Utilities</Text>
        <Text style={styles.description}>
          Add truck FASTags in one app, recharge instantly, and get alerts when your balance is running low.
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => navigation.navigate('AuthStack' as never)}
        >
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

export default Utilities

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  diagonalShape: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 200,
    height: 300,
    backgroundColor: 'white',
    transform: [{ rotate: '-15deg' }],
    opacity: 0.8,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  packageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    paddingHorizontal: 40,
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
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
})
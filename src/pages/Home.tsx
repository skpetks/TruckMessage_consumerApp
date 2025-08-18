import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';

export default function Home() {
  return (
    <>
      <CustomHeader userName="John Doe" location="New York" />
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
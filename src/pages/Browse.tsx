import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Browse = () => {
  return (
    <View style={styles.container}>
      <Text>Browse</Text>
    </View>
  )
}

export default Browse

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})
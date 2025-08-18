import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Post = () => {
  return (
    <View style={styles.container}>
      <Text>Post</Text>
    </View>
  )
}

export default Post

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})
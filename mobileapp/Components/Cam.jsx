import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native'
import { Camera } from 'expo-camera'
import React, { useState, useEffect } from 'react'

export default function Cam() {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)

  //Requesting for camera Permission
  useEffect(() => {
    ;(async () => {
      console.log('Chacking Camera Permission')
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
      if (hasPermission) {
        console.log('Granted Permission')
      }
    })()
  }, [])

  //If camera Permission not Found
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Camera Request Failed</Text>
      </View>
    )
  }

  //If Camera Permission Denied
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text> No Camera Permission granted </Text>
      </View>
    )
  }

  // If Permission Granted

  return (
    <View style={styles.container}>
      <Camera style={styles.fullscreen} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back,
              )
            }}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullscreen: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'flex-end',
    padding: 20,
  },
  button: {
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 40,
  },
  text: {
    color: 'white',
  },
})

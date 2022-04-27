import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from 'react-native'
import server from './Components/server'
import { Camera } from 'expo-camera'
import React, { useState, useEffect } from 'react'

import Animation from './Components/Animation.jsx'
export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [Pressed, setPressed] = useState(false)
  //Requesting for camera Permission
  useEffect(() => {
    ;(async () => {
      //Pinging local server
      console.log('pinging local server')
      server.ping()
      // Taking Camera Permission
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

  function PressIn() {
    //console.log('Pressed')
    setPressed(true)
  }
  function PressOut() {
    //console.log('Released')
    setPressed(false)
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.fullscreen} ratio="2:1" type={type}>
        <View style={styles.uiContainer}>
          <TouchableWithoutFeedback onPressIn={PressIn} onPressOut={PressOut}>
            <View style={styles.fullscreen}></View>
          </TouchableWithoutFeedback>
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
      {Pressed ? <Animation /> : null}
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
  uiContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 40,
    margin: 20,
  },
  text: {
    color: 'white',
  },
})

import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'

export default function Animation() {
  const progress = useRef(new Animated.Value(0.5)).current
  const scale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.spring(progress, { toValue: 1, useNativeDriver: true }),
          Animated.spring(progress, { toValue: 0.5, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.spring(scale, { toValue: 2, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]),
      ]),
    ).start()
  }, [])

  return (
    <View style={[styles.container, StyleSheet.absoluteFillObject]}>
      <Animated.View
        style={[
          styles.square,
          {
            borderRadius: progress.interpolate({
              inputRange: [0.5, 1],
              outputRange: [SIZE / 4, SIZE / 2],
            }),
            opacity: progress,
            transform: [
              { scale },
              {
                rotate: progress.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      ></Animated.View>
    </View>
  )
}
const SIZE = 100.0
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0,0,255,0.5)',
  },
})

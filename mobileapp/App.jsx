import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Image,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import First from "./Components/screens/First";
import img from "./assets/images/1.png";

const App = () => {
  const [showRealApp, setShowRealApp] = useState(false);
  const onDone = () => {
    console.log("Done");
    setShowRealApp(true);
  };
  const onSkip = () => {
    setShowRealApp(true);
  };
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "space-around",
          padding: 100,
        }}
      >
        <Text style={styles.introTitleStyle}>{item.title}</Text>
        <Image style={styles.introImageStyle} source={item.image} />
        <Text style={styles.introTextStyle}>{item.text}</Text>
      </View>
    );
  };
  return (
    <>
      {showRealApp ? (
        <First />
      ) : (
        <AppIntroSlider
          data={slides}
          renderItem={renderItem}
          onDone={onDone}
          onSkip={onSkip}
          showSkipButton={true}
          bottomButton
        />
      )}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  titleStyle: {
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  introTitleStyle: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTextStyle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    paddingVertical: 30,
  },
});

const slides = [
  {
    key: "s1",
    text: "Remove Background of  Images Easily",
    title: "Background Remover",
    image: {
      uri: "https://raw.githubusercontent.com/mzubair21/AR-Copy-Paste/master/mobileapp/assets/images/2.png",
    },
    backgroundColor: "#3395ff",
  },
  {
    key: "s2",
    title: "Detecting Desktop Screen",
    text: "Identifying the Photoshop Screen",
    image: {
      uri: "https://raw.githubusercontent.com/mzubair21/AR-Copy-Paste/master/mobileapp/assets/images/1.png",
    },
    backgroundColor: "#febe29",
  },
  {
    key: "s3",
    title: "Pasting Images on Photoshop",
    text: "Remotely Pasting Images to Photoshop in Couple of Seconds",
    image: {
      uri: "https://raw.githubusercontent.com/mzubair21/AR-Copy-Paste/master/mobileapp/assets/images/3.png",
    },
    backgroundColor: "#22bcb5",
  },
];

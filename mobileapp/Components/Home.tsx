import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import server from "./server";
import * as ImageManipulator from "expo-image-manipulator";
import { Camera } from "expo-camera";
import React, { useState, useEffect } from "react";

import Animation from "./Animation.jsx";

export default function Home({ route }) {
  const [myip, setMyip] = useState(route.params.key);
  const [hasPermission, setHasPermission] = useState(null);
  const [ImgSrc, setImgSrc] = useState("");
  //@ts-ignore
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [Pressed, setPressed] = useState(false);
  const [cutting, setCutting] = useState(true);
  const [pasting, setPasting] = useState(false);

  let camera: any = null;
  //Requesting for camera Permission
  useEffect(() => {
    (async () => {
      //Pinging local server
      console.log("pinging local server");
      server.ping(myip);
      // Taking Camera Permission
      console.log("Chacking Camera Permission");
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (hasPermission) {
        console.log("Granted Permission");
      }
    })();
  }, []);

  //If camera Permission not Found
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Camera Request Failed</Text>
      </View>
    );
  }

  //If Camera Permission Denied
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text> No Camera Permission granted </Text>
      </View>
    );
  }

  // If Permission Granted
  async function cut(): Promise<string> {
    const start = Date.now();
    console.log("");
    console.log("Cut");
    console.log("> taking image...");

    //const opts = { skipProcessing: true, exif: false, quality: 0 }
    const opts = {};
    let photo = await camera.takePictureAsync(opts);

    console.log("> resizing...");
    //Universal Resouce Identifier for Image after Editing
    const { uri } = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        { resize: { width: 256, height: 512 } },
        { crop: { originX: 0, originY: 125, width: 256, height: 256 } },
      ]
      // { compress: 0, format: ImageManipulator.SaveFormat.JPEG, base64: false }
    );

    console.log("> sending to /cut...");
    const resp = await server.cut(uri, myip);

    console.log(`Done in ${((Date.now() - start) / 1000).toFixed(3)}s`);
    return resp;
  }

  async function paste() {
    const start = Date.now();
    console.log("");
    console.log("Paste");

    console.log("> taking image...");
    // const opts = { skipProcessing: true, exif: false };
    const opts = {};
    let photo = await camera.takePictureAsync(opts);

    console.log("> resizing...");
    const { uri } = await ImageManipulator.manipulateAsync(photo.uri, [
      // { resize: { width: 512, height: 1024 } },
      { resize: { width: 350, height: 700 } },
    ]);

    console.log("> sending to /paste...");
    try {
      const resp = await server.paste(uri, myip);
      console.log("Get Paste Response");
      //@ts-ignore
      if (resp.status !== "ok") {
        //@ts-ignore
        if (resp.status === "screen not found") {
          console.log("screen not found");
        } else {
          //@ts-ignore
          throw new Error(resp);
        }
      } else {
        setImgSrc("");
      }
    } catch (e) {
      console.log("Something wrong with paste", e);
    }

    console.log(`Done in ${((Date.now() - start) / 1000).toFixed(3)}s`);
  }

  async function PressIn() {
    //console.log('Pressed')

    if (ImgSrc == "") {
      setPressed(true);
      const resp = await cut();
      setImgSrc(resp);
    }
  }

  async function PressOut() {
    setPressed(false);
    setPasting(true);

    if (ImgSrc !== "") {
      await paste();
      //setImgSrc('')
      setPasting(false);
    }
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.fullscreen}
        ratio="1:1"
        type={type}
        ref={async (ref) => (camera = ref)}
      >
        <View style={styles.uiContainer}>
          <TouchableWithoutFeedback onPressIn={PressIn} onPressOut={PressOut}>
            <View style={styles.fullscreen}></View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                //@ts-ignore
                type === Camera.Constants.Type.back
                  ? //@ts-ignore
                    Camera.Constants.Type.front
                  : //@ts-ignore
                    Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      {ImgSrc !== "" ? (
        <>
          <View pointerEvents="none" style={styles.resultImgView}>
            <Image
              style={styles.resultImg}
              source={{ uri: ImgSrc }}
              resizeMode="stretch"
            />
          </View>
        </>
      ) : null}

      {Pressed && ImgSrc === "" ? <Animation /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fullscreen: {
    flex: 1,
  },
  uiContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: 40,
    margin: 20,
  },
  text: {
    color: "white",
  },
  resultImgView: {
    position: "absolute",
    zIndex: 200,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  resultImg: {
    position: "absolute",
    zIndex: 300,
    top: "25%",
    left: 0,
    width: "100%",
    height: "50%",
  },
});

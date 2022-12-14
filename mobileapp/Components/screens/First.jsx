import React, { useState } from "react";
import { View, Text, Button, TextInput, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Home from "../Home";
import img from "../../assets/images/1.png";

function Launcher() {
  const [ip, setip] = useState("");
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f6f6",
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View>
          <Image style={{ width: 200, height: 200 }} source={img}></Image>
        </View>
        <Text style={{ paddingVertical: 50, fontSize: 22, fontWeight: "500" }}>
          Photoshop Configuration
        </Text>
        <Text>Enter Server IP</Text>
        <TextInput
          value={ip}
          placeholder="192.x.x.x"
          onChangeText={(e) => {
            setip(e);
          }}
          style={{
            width: 200,
            height: 44,
            backgroundColor: "#c6c6c6",
            marginVertical: 10,
            textAlign: "center",
          }}
        />
        <Button
          title="Submit"
          mode="contained"
          onPress={() =>
            navigation.navigate("AR Copy Paste", {
              key: ip,
            })
          }
        />
      </View>
    </View>
  );
}
function Details({ route }) {
  const [myip, setMyip] = useState(route.params.key);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{myip}</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function First() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Photoshop Server " component={Launcher} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="AR Copy Paste" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default First;

import { View, Text, Image } from "react-native";
import React from "react";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function DirectMessageComponent({ item, user }) {
  const myId = AsyncStorage.getItem("@id");
  const status = item.senderid == myId;
  const date = new Date(item.createdAt);

  const hour =
    date.getHours() < 10
      ? `0${date.getHours()}`
      : `${date.getHours()}`;

  const mins =
    date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : `${date.getMinutes()}`;


  return (
    <View>
      <View
        style={
          status
            ? [styles.mmessageWrapper]
            : [styles.mmessageWrapper, { alignItems: "flex-end" }]
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {status ? (

            <Image
              resizeMode="cover"
              style={{
                width: 30,
                height: 30,
                marginTop: 'auto'
              }}
              source={require("../images/myaccount2.png")}
            />
          ) : (
            ""
          )}

          <View
            style={
              status
                ? [styles.mmessage, { borderBottomRightRadius: 10 }]
                : [
                  styles.mmessage,
                  { backgroundColor: "#1F2067", borderBottomLeftRadius: 10 },
                ]
            }
          >
            <Text style={status ? [{ color: "#000" }] : [{ color: "#FFF" }]}>
              {item.message}
            </Text>
            <Text
              style={
                status
                  ? [
                    {
                      position: "absolute",
                      bottom: 0,
                      right: 7,
                      fontSize: 10,
                      fontWeight: "400",
                      color: "#1F2067",
                    },
                  ]
                  : [
                    {
                      position: "absolute",
                      bottom: 0,
                      right: 7,
                      fontSize: 10,
                      fontWeight: "400",
                      color: "#fff",
                    },
                  ]
              }
            >
              {hour + ":" + mins}
            </Text>
          </View>
          {status ? (
            ""
          ) : (
            <Image
              resizeMode="cover"
              style={{
                width: 30,
                height: 30,
                marginTop: 'auto'
              }}
              source={require("../images/myaccount.png")}
            />
          )}
        </View>
      </View>
    </View>
  );
}

import { View, Text, Image } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
export default function DirectMessageComponent({ onRendered, lastItem, item, user }) {

  const [status, setStatus] = useState('');
  const date = new Date(item.createdAt);


  // useEffect(() => {
  //   // console.log('lastItem', lastItem);
  //   // console.log('item._id', item._id);

  //   lastItem === item._id ? onRendered() : ''
  // }, [])

  useLayoutEffect(() => {
    async function getStatus() {
      const myId = await AsyncStorage.getItem("@id");
      setStatus(item.senderid !== myId)
    }

    getStatus()
  }, [])
  const hour =
    date.getHours() < 10
      ? `0${date.getHours()}`
      : `${date.getHours()}`;

  const mins =
    date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : `${date.getMinutes()}`;


  return (
    <View key={item._id}>
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
            <View style={{ marginTop: 'auto', alignItems: 'center' }}>
              {item.seen ?
                <Image
                  resizeMode="contain"
                  style={{
                    display: 'flex',
                    marginTop: 'auto'
                  }}
                  source={require("../images/seen.png")}
                />
                : <Image
                  resizeMode="contain"
                  style={{
                    display: 'flex',
                    marginTop: 'auto'
                  }}
                  source={require("../images/delivered.png")}
                />
              }
              <Image
                resizeMode="cover"
                style={{
                  width: 30,
                  height: 30,
                  marginTop: 'auto'
                }}
                source={require("../images/myaccount.png")}
              />

            </View>
          )}
        </View>
      </View>
    </View >
  );
}

import { View, Text, Image } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
export default function DirectMessageComponent({
  onRendered,
  lastItem,
  item,
  user,
  setReceiptsModalVisible,
  setSeen,
  setDelivered
}) {

  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const date = new Date(item.createdAt);

  useLayoutEffect(() => {
    async function getStatus() {
      const myId = await AsyncStorage.getItem("@id");
      setStatus(item.senderid !== myId)
    }

    getStatus()
  }, [])


  useLayoutEffect(() => {
    async function getImage() {
      await axios.get(`http://192.168.0.103:3001/user?id=${item.senderid}`).then(async result => {
        console.log("image ->", result.data.user.profilePicture[0])
        await axios.get(`http://192.168.0.103:3001/files/${result.data.user.profilePicture[0]}/true`).then(image => {
          setImage(`data:${image.headers['content-type']};base64,${image.data}`)
        })
      }).catch(err => {
        console.log("err", err)
      })
    }
    getImage()
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
    <TouchableOpacity onLongPress={() => {
      setDelivered(item.createdAt)
      setSeen(item.updatedAt)
      setReceiptsModalVisible(true)
    }}>
      <View key={item._id}>
        <View
          style={
            status
              ? [styles.mmessageWrapper]
              : [styles.mmessageWrapper, { alignItems: "flex-end", }]
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {status ?
              image ?
                <Image
                  resizeMode="cover"
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 'auto'
                  }}
                  source={{ uri: image }}
                />

                // <Text>{image}</Text>
                :
                < Image
                  resizeMode="cover"
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 'auto'
                  }}
                  source={require("../images/myaccount2.png")}
                />

              : (
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
              {(status && item.title) ? <Text style={{ color: '#1F2067', marginBottom: 5, fontWeight: '500', fontSize: 14 }}>{item.title}</Text> : ''}
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
              <View style={{ marginTop: 'auto', alignItems: 'center', marginHorizontal: 3 }}>
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


              </View>
            )}
          </View>
        </View>
      </View >
    </TouchableOpacity>
  );
}

import { View, Image, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ChatComponent = ({ item, username }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({});

  useLayoutEffect(() => {
    setMessages(item.messages[item.messages.length - 1]);
    async function getUserName() { }
    getUserName();
  }, []);

  const handleNavigation = () => {
    navigation.navigate("Messaging", {
      id: item.id,
      name: item.name,
    });
  };

  return username == item.name || username == item.sender ? (
    <Pressable style={styles.cchat} onPress={handleNavigation}>

      <View style={{ width: 65, height: 65, marginRight: 15 }}>
        <Image
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 100,
          }}
          source={require("../images/ProfileDemo.jpg")}
        />
      </View>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>
            {item.name == username ? item.sender : item.name}
          </Text>

          <Text style={styles.cmessage}>
            {
              messages.match(/^[0-9a-fA-F]{24}$/)
                ?
                messages?.text ? messages.text : "Tap to start chatting"
                :
                'Image'
            }

          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>
            {messages?.time ? messages.time : "now"}
          </Text>
        </View>
      </View>
    </Pressable>
  ) : (
    ""
  );
};

export default ChatComponent;

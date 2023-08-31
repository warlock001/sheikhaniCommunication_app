import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  FlatList,
  Pressable,
} from "react-native";
import socket from "../utils/socket";
import MessageComponent from "../component/MessageComponent";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

let flatlistRef;
let textInputRef; // Define the ref

const Messaging = ({ route, navigation }) => {
  const [user, setUser] = useState("");
  const { name, id } = route.params;

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("@username");
      console.log(value);
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  const handleNewMessage = () => {
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    if (user && message) {
      socket.emit("newMessage", {
        message,
        room_id: id,
        user,
        timestamp: { hour, mins },
      });
      textInputRef.clear(); // Clear the TextInput field
    } else {
      // console.log("first")
    }
  };

  useLayoutEffect(() => {
    async function findRoom() {
      navigation.setOptions({ title: name });
      getUsername();
      const sender = await AsyncStorage.getItem("@username");
      let roomMessages = await AsyncStorage.getItem("@roomMessages");
      roomMessages = JSON.parse(roomMessages);
      let data = {
        id: id,
        name: name,
        sender: sender,
        roomMessages: roomMessages,
      };

      socket.emit("findRoom", data);
      socket.on("foundRoom", async (roomChats) => {
        if (roomChats.length !== 0) {
          setChatMessages(roomChats);
          await AsyncStorage.setItem(
            "@roomMessages",
            JSON.stringify(roomChats)
          );

          // console.log("four")
        } else {
          // console.log("five")
          let roomMessages = await AsyncStorage.getItem("@roomMessages");
          roomMessages = JSON.parse(roomMessages);
          // console.log(roomMessages)
          setChatMessages(roomMessages ? roomMessages : []);
        }
      });
    }
    findRoom();
  }, []);

  useEffect(() => {
    socket.on("foundRoom", async (roomChats) => {
      if (roomChats.length !== 0) {
        // console.log("first")
        setChatMessages(roomChats);
        await AsyncStorage.setItem("@roomMessages", JSON.stringify(roomChats));
      } else {
        let roomMessages = await AsyncStorage.getItem("@roomMessages");
        roomMessages = JSON.parse(roomMessages);
        // console.log("roomMessages : " + roomMessages)
        setChatMessages(roomMessages ? roomMessages : []);
      }
    });
  }, [socket]);

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10 },
        ]}
      >
        {chatMessages[0] ? (
          <FlatList
            ref={(ref) => {
              flatlistRef = ref;
            }}
            data={chatMessages}
            renderItem={({ item }) => (
              <MessageComponent item={item} user={user} />
            )}
            keyExtractor={(item) => item.id}
            onContentSizeChange={() =>
              flatlistRef.scrollToEnd({ animated: false })
            }
          />
        ) : (
          ""
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          ref={(inputRef) => {
            textInputRef = inputRef;
          }}
          style={styles.messaginginput}
          onChangeText={(value) => setMessage(value)}
          placeholder="Write Message..."
          placeholderTextColor="#000"
        />
        <Pressable
          //   style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}
        >
          <View>
            <Image
              resizeMode="contain"
              style={{ width: 30, height: 30, marginRight: 5 }}
              source={require("../images/send.png")}
            />
            {/* <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text> */}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Messaging;

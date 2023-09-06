import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, TextInput, Image, Text, FlatList, Pressable} from 'react-native';
import socket from '../utils/socket';
import DirectMessageComponent from '../component/DirectMessageComponent';
import {styles} from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DirectChatComponent from '../component/DirectChatComponent';

let flatlistRef;
let textInputRef; // Define the ref

const DirectMessaging = ({route, navigation}) => {
  const [user, setUser] = useState('');
  const {name, id} = route.params;
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('');

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('@username');
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error('Error while loading username!');
    }
  };

  const handleNewMessage = async () => {
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    const myId = await AsyncStorage.getItem('@id');
    axios
      .post('http://192.168.0.103:3001/saveMessage', {
        senderid: myId,
        message: message,
        roomid: roomId,
        recieverid: id,
      })
      .then(res => {
        console.log('message send - ', res.data);
        let data = {
          roomId: roomId,
          message: {
            _id: res.data.id,
            senderid: myId,
            message: message,
            roomid: roomId,
            recieverid: id,
            seen: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        socket.emit('send_message', data);
        setMessage('');
      })
      .catch(err => {
        console.log('error in sending message - ', err);
        setMessage('');
      });
  };

  const createRoomId = (id, myId) => {
    if (id > myId) {
      return id + myId;
    } else {
      return myId + id;
    }
  };

  useLayoutEffect(() => {
    async function setup() {
      navigation.setOptions({title: name});
      getUsername();

      const myId = await AsyncStorage.getItem('@id');

      const roomid = createRoomId(id, myId);
      setRoomId(roomid);
      let data = {
        roomid: roomid,
      };
      socket.emit('join_room', data);
      // socket.emit('leave_room', data);
    }
    setup();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchMessages() {
        const myId = await AsyncStorage.getItem('@id');
        let roomid = createRoomId(id, myId);
        console.log('fetching messages for room id -', roomid);
        await axios
          .get(`http://192.168.0.103:3001/getMessage?roomid=${roomid}`)
          .then(res => {
            setChatMessages(res.data.messages);
          })
          .catch(err => {
            console.log('error fetching old messages -', err);
          });
      }

      fetchMessages();
    }, [shouldUpdate]),
  );

  useFocusEffect(
    React.useCallback(() => {
      async function readReceipt() {
        const myId = await AsyncStorage.getItem('@id');
        let roomid = createRoomId(id, myId);
        console.log('Updating Read Receipts -', roomid + ' recipient', id);
        let data = {
          roomid: roomid,
          recipient: id,
          id: myId,
        };
        socket.emit('read_receipt', data);
      }

      readReceipt();
    }, []),
  );

  useEffect(() => {
    async function listen() {
      console.log('listining to incoming messages');
      socket.on('receive_message', async data => {
        console.log('message recieved - ', data.message.message);
        setChatMessages(chatMessages => [...chatMessages, data.message]);

        async function readReceipt() {
          const myId = await AsyncStorage.getItem('@id');
          let roomid = createRoomId(id, myId);
          console.log('Updating Read Receipts -', roomid + ' recipient', id);
          let data = {
            roomid: roomid,
            recipient: id,
            id: myId,
          };
          socket.emit('read_receipt', data);
        }

        readReceipt();
      });

      socket.on('update_read_receipt', async data => {
        console.log('Chat messages -> ', chatMessages);
        // let temp = chatMessages;
        // temp.forEach((item, index) => {
        //   temp[index].seen = true
        // })
        // console.log("Temp messages -> ", temp)
        // setChatMessages(temp)
        setShouldUpdate(!shouldUpdate);
      });
    }
    listen();
  }, [socket]);
  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {chatMessages[0] ? (
          <FlatList
            extraData={chatMessages}
            ref={ref => {
              flatlistRef = ref;
            }}
            data={chatMessages}
            renderItem={({item}) => (
              <DirectMessageComponent item={item} user={user} />
            )}
            keyExtractor={item => item._id}
            onContentSizeChange={() =>
              flatlistRef.scrollToEnd({animated: false})
            }
          />
        ) : (
          ''
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          value={message}
          ref={inputRef => {
            textInputRef = inputRef;
          }}
          style={styles.messaginginput}
          onChangeText={value => setMessage(value)}
          placeholder="Write Message..."
          placeholderTextColor="#000"
        />
        <Pressable
          //   style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}>
          <View>
            <Image
              resizeMode="contain"
              style={{width: 30, height: 30, marginRight: 5}}
              source={require('../images/send.png')}
            />
            {/* <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text> */}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default DirectMessaging;

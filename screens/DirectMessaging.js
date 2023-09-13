import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  TextInput,
  Image,
  Text,
  FlatList,
  Pressable,
  PermissionsAndroid,
  Alert,
  Modal,
} from 'react-native';
import socket from '../utils/socket';
import DirectMessageComponent from '../component/DirectMessageComponent';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DirectChatComponent from '../component/DirectChatComponent';
import { launchImageLibrary } from 'react-native-image-picker';
import ReadReceipts from '../component/ReadReceipts';

let flatlistRef;
let textInputRef; // Define the ref

const DirectMessaging = ({ route, navigation }) => {
  const [user, setUser] = useState('');
  const { name, id } = route.params;
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [rendered, setRendered] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [receiptsModalVisible, setReceiptsModalVisible] = useState(false);
  const [seen, setSeen] = useState('')
  const [delivered, setDelivered] = useState('')
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
    const user = await AsyncStorage.getItem('@username');
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
            title: name,
            user: user,
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
      navigation.setOptions({ title: name });
      getUsername();

      const myId = await AsyncStorage.getItem('@id');

      const roomid = createRoomId(id, myId);
      setRoomId(roomid);
      let data = {
        roomid: roomid,
      };
      socket.emit('join_room', data);
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
            let data = {
              roomid: roomid,
              recipient: id,
              id: myId,
            };
            // if (res.data.messages[res.data.messages.length - 1].senderid != myId) {
            socket.emit('read_receipt', data);
            // }
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
    }, [chatMessages, socket]),
  );

  useEffect(() => {
    async function listen() {
      await socket.off('receive_message');
      console.log('listining to incoming messages');
      await socket.on('receive_message', async data => {
        console.log('message recieved - ', data.message.message);
        setChatMessages(chatMessages => [...chatMessages, data.message]);
        // console.log('Chat messages <- ', chatMessages);

      });


    }
    listen();

  }, []);


  useEffect(() => {

    async function updateMessageReciepts() {
      let temp = chatMessages;
      await socket.on('update_read_receipt', data => {
        // console.log("idr aa gya")
        temp.forEach((item, index) => {
          temp[index].seen = true
        })
        // console.log("Temp messages -> ", temp)
        setChatMessages(temp)
        // setShouldUpdate(!shouldUpdate);
        // setTimeout(() => {
        //   setShouldUpdate(!shouldUpdate)
        // }, 5000);

      });
    }

    updateMessageReciepts()

    return () => {
      socket.off('update_read_receipt'); // Remove the event listener
    };
  }, [chatMessages])







  const chooseImage = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setImageName(response.assets[0].uri);
        setImage({
          uri: response.assets[0].uri,
          name: `${new Date()}_profilePicture.jpg`,
          type: mime.getType(response.assets[0].uri),
        });
      }
    });
  };

  const [pickermodalVisible, setpickerModalVisible] = useState(false);

  // async function sendData() {
  //   if (!image) {
  //     Alert.alert('', 'Please select an Image to upload.', [
  //       { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     ]);
  //   } else {
  //     const id = await AsyncStorage.getItem('@id');
  //     const form = new FormData();
  //     form.append('id', id);
  //     form.append('image', {
  //       uri: image.uri,
  //       name: `${new Date()}_chatimage.jpg`,
  //       type: mime.getType(image.uri),
  //     });

  //     await axios({
  //       timeout: 20000,
  //       method: 'POST',
  //       url: `http://192.168.0.103:3001/`,
  //       data: form,
  //       headers: {
  //         accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //       .then(async res => {
  //         console.log('This is working'); //nope
  //         console.log('response: ', res.data);
  //         await AsyncStorage.setItem('@profilepicture', res.data.id);
  //         await axios
  //           .get(`http://192.168.0.103:3001/files/${res.data.id}/true`)
  //           .then(res => {
  //             setprofilepictureURL(
  //               `data:${res.headers['content-type']};base64,${res.data}`,
  //             );
  //           });
  //         setpickerModalVisible(true);
  //         setShouldUpdate(!shouldUpdate);
  //       })
  //       .catch(error => {
  //         if (error.response) {
  //           // The request was made and the server responded with an error status code
  //           console.log('Server Error:', error.response.data);
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           console.log('Network Error:', error.response.data); // This the error
  //         } else {
  //           // Something else happened while setting up the request
  //           console.log('Error:', error.message);
  //           console.log('Error');
  //         }

  //         // You can display an error message to the user here
  //         Alert.alert('', 'An unknown error occured.', [
  //           { text: 'OK', onPress: () => console.log('OK Pressed') },
  //         ]);
  //       });
  //   }
  // }

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10 },
        ]}>
        {chatMessages[0] ? (
          <FlatList
            // style={{ display: rendered ? 'flex' : 'none' }}
            extraData={chatMessages}
            ref={ref => {
              flatlistRef = ref;
            }}
            initialNumToRender={chatMessages.length}
            data={chatMessages}
            renderItem={({ item }) => (
              <DirectMessageComponent setSeen={setSeen} setDelivered={setDelivered} setReceiptsModalVisible={setReceiptsModalVisible} lastItem={chatMessages[chatMessages.length - 1]._id} onRendered={() => { setRendered(true); console.log(true) }} item={item} user={user} />
            )}
            keyExtractor={item => item._id}
            // inverted
            // initialScrollIndex={1}
            onContentSizeChange={() =>
              flatlistRef.scrollToEnd({ animated: false })
            }
          />
        ) : (
          ''
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <Pressable onPress={chooseImage}>
          <View>
            <Image
              resizeMode="contain"
              style={{ width: 25, height: 25, marginRight: 5 }}
              source={require('../images/attach_file.png')}
            />
          </View>
        </Pressable>
        <TextInput
          multiline={true}
          value={message}
          ref={inputRef => {
            textInputRef = inputRef;
          }}
          placeholderTextColor="#000"
          style={styles.messaginginput}
          onChangeText={value => setMessage(value)}
          placeholder="Write Message..."
        />
        <Pressable
          //   style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}>
          <View>
            <Image
              resizeMode="contain"
              style={{ width: 30, height: 30, marginRight: 5 }}
              source={require('../images/send.png')}
            />
            {/* <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text> */}
          </View>
        </Pressable>
      </View>
      {receiptsModalVisible ?
        <ReadReceipts setReceiptsModalVisible={setReceiptsModalVisible} seen={seen} delivered={delivered} />
        : ""
      }
    </View>
  );
};

export default DirectMessaging;

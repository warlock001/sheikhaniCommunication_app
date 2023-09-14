import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  TextInput,
  Image,
  Text,
  FlatList,
  Pressable,
  Button,
  TouchableOpacity,
} from 'react-native';
import socket from '../utils/socket';
import DirectMessageComponent from '../component/DirectMessageComponent';
import {styles} from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DirectChatComponent from '../component/DirectChatComponent';
import Modal from '../component/AddMemberModal';
import ReadReceipts from '../component/ReadReceipts';
let flatlistRef;
let textInputRef; // Define the ref

const GroupMessaging = ({route, navigation}) => {
  const [user, setUser] = useState('');
  const {name, id} = route.params;
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [rendered, setRendered] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [addMember, setAddMember] = useState(false);
  const [receiptsModalVisible, setReceiptsModalVisible] = useState(false);
  const [seen, setSeen] = useState('');
  const [delivered, setDelivered] = useState('');

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

  const handleDetailNavigation = id => {
    navigation.navigate('GroupChatDetails', {
      roomid: id,
    });
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
        roomid: id,
      })
      .then(res => {
        console.log('message send - ', res.data);
        let data = {
          roomId: id,
          message: {
            _id: res.data.id,
            senderid: myId,
            message: message,
            roomid: id,
            recieverid: id,
            seen: false,
            title: name,
            user: user,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        socket.emit('send_message_group', data);
        setMessage('');
      })
      .catch(err => {
        console.log('error in sending message - ', err);
        setMessage('');
      });
  };

  useLayoutEffect(props => {
    async function setup() {
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              handleDetailNavigation(id);
            }}>
            <View
              style={{
                width: 45,
                height: 45,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1f2067',
                borderRadius: 500,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 25,
                  lineHeight: 30,
                  color: '#fff',
                }}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                fontFamily: 'Roboto-Medium',
              }}>
              {name.length > 24 ? name.slice(0, 21) + '...' : name}
            </Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              setAddMember(true);
            }}>
            <Image source={require('../images/add.png')}></Image>
          </TouchableOpacity>
        ),
      });
      getUsername();

      const myId = await AsyncStorage.getItem('@id');
      setRoomId(id);
      let data = {
        roomid: id,
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
        let roomid = id;
        console.log('fetching messages for room id -', roomid);
        await axios
          .get(`http://192.168.0.103:3001/getMessage?roomid=${id}`)
          .then(res => {
            setChatMessages(res.data.messages);
            console.log(res.data.messages);
            let data = {
              roomid: id,
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

        console.log('Updating Read Receipts -', id + ' recipient', id);
        let data = {
          roomid: id,
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
      console.log('listining to incoming messages');
      await socket.off('receive_message');
      socket.on('receive_message', async data => {
        console.log('message recieved - ', data.message.message);
        setChatMessages(chatMessages => [...chatMessages, data.message]);
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
          temp[index].seen = true;
        });
        // console.log("Temp messages -> ", temp)
        setChatMessages(temp);
        // setShouldUpdate(!shouldUpdate);
        // setTimeout(() => {
        //   setShouldUpdate(!shouldUpdate)
        // }, 5000);
      });
    }

    updateMessageReciepts();

    return () => {
      socket.off('update_read_receipt'); // Remove the event listener
    };
  }, [chatMessages]);

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
            initialNumToRender={chatMessages.length}
            data={chatMessages}
            renderItem={({item}) => (
              <DirectMessageComponent
                setSeen={setSeen}
                setDelivered={setDelivered}
                setReceiptsModalVisible={setReceiptsModalVisible}
                lastItem={chatMessages[chatMessages.length - 1]._id}
                onRendered={() => {
                  setRendered(true);
                  console.log(true);
                }}
                item={item}
                user={user}
              />
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
        <Pressable onPress={chooseImage}>
          <View>
            <Image
              resizeMode="contain"
              style={{width: 25, height: 25, marginRight: 5}}
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
      {receiptsModalVisible ? (
        <ReadReceipts
          setReceiptsModalVisible={setReceiptsModalVisible}
          seen={seen}
          delivered={delivered}
        />
      ) : (
        ''
      )}
      {addMember ? <Modal setVisible={setAddMember} roomid={id} /> : ''}
    </View>
  );
};

export default GroupMessaging;

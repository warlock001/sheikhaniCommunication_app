import { View, Image, Text, Pressable } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import socket from '../utils/socket';
const DirectChatComponent = ({ item, username }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({});
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const hour =
    new Date(item.time).getHours() < 10
      ? `0${new Date(item.time).getHours()}`
      : `${new Date(item.time).getHours()}`;

  const mins =
    new Date(item.time).getMinutes() < 10
      ? `0${new Date(item.time).getMinutes()}`
      : `${new Date(item.time).getMinutes()}`;

  const createRoomId = (id, myId) => {
    if (id > myId) {
      return id + myId;
    } else {
      return myId + id;
    }
  };

  useLayoutEffect(() => {
    async function joinroom() {
      const myId = await AsyncStorage.getItem('@id');
      const roomid = createRoomId(item.user, myId);
      let data = {
        roomid: roomid,
      };
      socket.emit('join_room', data);
    }
    joinroom();
  }, []);

  useLayoutEffect(() => {
    async function getUserName() {
      setMessages(item.lastMessage);
      axios
        .get(`http://api.sheikhanigroup.com:3001/user?id=${item.user}`)
        .then(result => {
          setName(result.data.user.firstName + ' ' + result.data.user.lastName);
          axios
            .get(
              `http://api.sheikhanigroup.com:3001/files/${result.data.user.profilePicture[0]}/true`,
            )
            .then(image => {
              setImage(
                `data:${image.headers['content-type']};base64,${image.data}`,
              );
            });
        });
    }
    getUserName();
  }, []);

  const handleNavigation = () => {
    navigation.navigate('DirectMessaging', {
      id: item.user,
      name: name,
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handleNavigation}>
      <View style={{ width: 65, height: 65, marginRight: 15 }}>
        <Image
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 100,
          }}
          source={{ uri: image }}
        />
      </View>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{name}</Text>

          <Text style={styles.cmessage}>
            {item.lastMessage.match(/^[0-9a-fA-F]{24}$/)
              ? (
                <View style={{ flexDirection: 'row', display: 'flex', gap: 5 }}>
                  <Image style={{
                    width: 20,
                    height: 20,

                  }} source={require('../images/image_message.png')} />
                  <Text>Image</Text>
                </View>
              )
              : item.lastMessage
                ? JSON.stringify(item.lastMessage).length > 30
                  ? item.lastMessage.substring(0, 25) + '...'
                  : item.lastMessage
                : 'Tap to start chatting'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>
            {hour && mins ? hour + ':' + mins : 'now'}
          </Text>
          {item.newMessages !== 0 ? (
            <View
              style={{
                marginTop: 'auto',
                marginLeft: 'auto',
                display: 'flex',
                backgroundColor: '#1f2067',
                width: 25,
                height: 25,
                borderRadius: 50,
                padding: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ textAlign: 'center', color: '#fff' }}>
                {item.newMessages}
              </Text>
            </View>
          ) : (
            ''
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default DirectChatComponent;

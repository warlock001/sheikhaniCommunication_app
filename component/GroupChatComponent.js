import { View, Image, Text, Pressable } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const GroupChatComponent = ({ item, username }) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({});
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const hour =
    new Date(item.updatedAt).getHours() < 10
      ? `0${new Date(item.updatedAt).getHours()}`
      : `${new Date(item.updatedAt).getHours()}`;

  const mins =
    new Date(item.updatedAt).getMinutes() < 10
      ? `0${new Date(item.updatedAt).getMinutes()}`
      : `${new Date(item.updatedAt).getMinutes()}`;

  useLayoutEffect(() => {
    async function getUserName() {
      setMessages(item.lastMessage);

      setMessages(item.lastMessage);

      axios
        .get(`http://192.168.0.103:3001/user?id=${item.user}`)
        .then(result => {
          setName(result.data.user.firstName + ' ' + result.data.user.lastName);
          axios
            .get(
              `http://192.168.0.103:3001/files/${result.data.user.profilePicture[0]}/true`,
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
    navigation.navigate('GroupMessaging', {
      id: item.roomid,
      name: item.title,
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handleNavigation}>
      <View
        style={{
          width: 55,
          height: 55,
          marginRight: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1f2067',
          borderRadius: 500,
        }}>
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 35,
            lineHeight: 40,
            color: '#fff',
          }}>
          {item.title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{item.title.length > 24 ? item.title.slice(0, 21) + "..." : item.title}</Text>

          <Text style={styles.cmessage}>
            {item.lastMessage
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
          {/* {item.newMessages !== 0 ? (
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
          )} */}
        </View>
      </View>
    </Pressable>
  );
};

export default GroupChatComponent;

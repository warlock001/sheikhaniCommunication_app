import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import {
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from '../component/GroupCreatingModal';
import DirectChatComponent from '../component/DirectChatComponent';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import { TextInput } from 'react-native-paper';
import TextField from '../component/inputField';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import MessageComponent from '../component/MessageComponent';
export default function DirectMessagesScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');

  const [department, setDepartment] = useState('');

  const handleNavigation = (id, name) => {
    navigation.navigate('DirectMessaging', {
      id: id,
      name: name,
    });
  };

  function Item({ props }) {
    const [image, setImage] = useState(false);

    useLayoutEffect(() => {
      async function getImage() {
        axios.get(`http://192.168.0.100:3001/files/${props.profilePicture[0]}/true`).then(image => {
          setImage(`data:${image.headers['content-type']};base64,${image.data}`)
        }).catch(err => {
          console.log(err)
        })
      }

      getImage();
    });
    return (
      <TouchableOpacity
        onPress={() => {
          handleNavigation(props.id, props.title);
        }}>
        <View style={style.item}>
          {image ? (
            <Image
              resizeMode="cover"
              style={[styles.mavatar, { marginTop: 'auto' }]}
              source={{ uri: image }}
              width={30}
            />
          ) : (
            ''
          )}
          <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  useEffect(() => {
    async function getValue() {
      const value = await AsyncStorage.getItem('@department');
      if (value) {
        setDepartment(value);
      }

      const user = await AsyncStorage.getItem('@username');
      if (user) {
        setUsername(user);
      }
    }
    getValue();
  });

  useFocusEffect(
    React.useCallback(() => {
      async function getChats() {
        const id = await AsyncStorage.getItem("@id");
        await axios.get(`http://192.168.0.100:3001/recentChats?id=${id}`).then(results => {
          setRooms(results.data.recentChats[0].chats)
        })

      }

      getChats();
    }, []),
  );

  // useEffect(() => {
  //   async function getRooms() {
  //     let rooms = await AsyncStorage.getItem("@rooms");
  //     rooms = JSON.parse(rooms);
  //     console.log("rooms :" + JSON.stringify(rooms));setSearchedUsers
  //     setRooms(rooms ? rooms : []);
  //   }
  //   getRooms();
  // }, []);

  useEffect(() => {
    async function getUsers() {
      const department = await AsyncStorage.getItem('@department');
      const id = await AsyncStorage.getItem('@id');
      axios
        .get(
          `http://192.168.0.100:3001/user?department=${department}&query=${search}&id=${id}`,
        )
        .then(res => {
          setSearchedUsers(res.data.user);
        });
    }

    getUsers();
  }, [search]);

  return (
    <TouchableWithoutFeedback accessible={false}>
      <SafeAreaView style={styles.chatscreen}>
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              textDecorationLine: 'underline',
              marginBottom: 10,
              fontWeight: '600',
              color: '#000',
            }}>
            Sheikhani Communication
          </Text>

          <Text style={styles.pageHeading}>All DMs</Text>
          <Text style={styles.pageSubHeading}>
            You can check your recent & new chats here
            {/* <Text style={{ fontWeight: "600" }}>Manage work hours</Text> */}
          </Text>
        </View>
        <View style={{ marginTop: 13 }}>
          <KeyboardAvoidingView>
            <TextField
              onFocus={() => {
                setSearchedUsersVisible(true);
              }}
              onBlur={() => setSearchedUsersVisible(false)}
              style={{ marginBottom: 5, color: '#000' }}
              label="Search by name"
              onChangeText={text => {
                setSearch(text);
              }}
              right={
                <TextInput.Icon
                  name={() =>
                    searchedUsersVisible ? (
                      <Pressable onPress={Keyboard.dismiss}>
                        <Image
                          resizeMode="contain"
                          style={{ width: 25 }}
                          source={require('../images/close.png')}
                        />
                      </Pressable>
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ width: 25 }}
                        source={require('../images/search.png')}
                      />
                    )
                  }
                />
              }
            />
          </KeyboardAvoidingView>
          <View
            style={[
              styles.optionBox,
              { display: searchedUsersVisible ? 'flex' : 'none' },
            ]}>
            {/* <Text style={{ marginBottom: 10 }}>Search Users</Text> */}
            <FlatList
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              data={searchedUsers}
              renderItem={({ item }) => (
                <Item
                  props={{
                    title: item.firstName,
                    id: item._id,
                    profilePicture: item.profilePicture,
                  }}
                />
              )}
              keyExtractor={item => item._id}
            />
          </View>
        </View>

        <View
          style={[
            styles.chatlistContainer,
            { display: searchedUsersVisible ? 'none' : 'flex' },
          ]}>
          {Array.isArray(rooms) && rooms.length > 0 ? (
            <FlatList
              extraData={rooms}
              data={rooms}
              renderItem={({ item }) => (
                <DirectChatComponent item={item} username={username} />
              )}
              keyExtractor={item => item.user}
            />
          ) : (
            <View style={styles.chatemptyContainer}>
              <Text style={styles.chatemptyText}>No chats created!</Text>
            </View>
          )}
        </View>
        {visible ? <Modal setVisible={setVisible} /> : ''}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const style = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 5,
  },
});

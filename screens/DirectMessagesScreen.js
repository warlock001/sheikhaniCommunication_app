import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios, { all } from 'axios';
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
  const [allRooms, setAllRooms] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [username, setUsername] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const [department, setDepartment] = useState('');

  const handleNavigation = (id, name) => {
    navigation.navigate('DirectMessaging', {
      id: id,
      name: name,
    });
  };

  async function searchObjectByName(array, name) {
    let tempArray = array ? array : []

    if (tempArray.length != 0) {
      if (name) {
        let arr = await tempArray.find(obj => obj.title.toLowerCase().includes(name));
        console.log("tempArray", arr)
        if (arr) {
          return [arr]
        } else {
          return allRooms
        }
      } else {
        console.log(allRooms)
        return allRooms
      }
    } else {
      console.log(allRooms)
      return allRooms
    }

  }

  useFocusEffect(
    React.useCallback(() => {
      async function listen() {
        socket.on('receive_message', async data => {
          const id = await AsyncStorage.getItem('@id');
          await axios
            .get(`http://192.168.0.103:3001/recentChats?id=${id}`)
            .then(results => {
              console.log(results.data.recentChats[0].chats)
              setRooms(results.data.recentChats[0].chats);
            });
        });
      }
      listen();
    }, [])
  )


  function Item({ props }) {
    const [image, setImage] = useState(false);

    useLayoutEffect(() => {
      async function getImage() {
        await axios
          .get(
            `http://192.168.0.103:3001/files/${props.profilePicture[0]}/true`,
          )
          .then(image => {
            setImage(
              `data:${image.headers['content-type']};base64,${image.data}`,
            );
          })
          .catch(err => {
            console.log("error in getting user image", err);
          });
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
        console.log("firstttt")
        const id = await AsyncStorage.getItem('@id');
        await axios
          .get(`http://192.168.0.103:3001/recentChats?id=${id}`)
          .then(results => {
            console.log(results.data.recentChats[0].chats)
            setRooms(results.data.recentChats[0].chats);
            setAllRooms(results.data.recentChats[0].chats)
          }).catch(err => {
            console.log("err in fetching recent chats", err)
          });
      }

      getChats();
    }, [refresh]),
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
          `http://192.168.0.103:3001/user?department=${department}&query=${search}&id=${id}`,
        )
        .then(res => {
          console.log('userssssssss', res.data.user);
          setSearchedUsers(res.data.user);
        });


    }

    getUsers();
  }, []);


  useLayoutEffect(() => {
    async function sort() {
      const result = await searchObjectByName(rooms, search);
      console.log("result", result)
      setRooms(result)
    }
    sort()
    // console.log(rooms)
  }, [search])

  return (
    <TouchableWithoutFeedback accessible={false}>
      <SafeAreaView style={styles.chatscreen}>
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 19,
              // textDecorationLine: 'underline',
              marginBottom: 10,
              fontWeight: '600',
              color: '#000',
              fontFamily: 'Pacifico-Regular',
            }}>
            Sheikhani Group Communication
          </Text>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.pageHeading}>All Chats</Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('Create New Chat')
            }} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={styles.pageHeadingRight}>Create a new chat</Text>
              <Image source={require('../images/createChats.png')}></Image>
            </TouchableOpacity>
          </View>
          <Text style={styles.pageSubHeading}>
            Hello{' '}
            <Text
              style={{
                fontSize: 16,
                color: '#000',
                fontFamily: 'Pacifico-Regular',
              }}>
              {username},
            </Text>{' '}
            Your can check your recent chats here.
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
                      <Pressable onPress={() => {
                        setRefresh(!refresh)
                        setSearchedUsersVisible(false)
                        Keyboard.dismiss()
                      }}>
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
          {/* <View
            style={[
              styles.optionBox,
              { display: searchedUsersVisible ? 'flex' : 'none' },
            ]}>

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
          </View> */}
        </View>

        <View
          style={[
            styles.chatlistContainer,
            { display: 'flex' },
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

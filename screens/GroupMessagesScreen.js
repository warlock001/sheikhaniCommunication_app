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
import ShiftModal from '../component/ShiftModal';
import { styles } from '../utils/styles';
import { TextInput } from 'react-native-paper';
import TextField from '../component/inputField';
import GroupChatComponent from '../component/GroupChatComponent';
export default function GroupMessagesScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [shiftVisible, setShiftVisible] = useState(false);
  const [shiftId, setShiftId] = useState('');
  const [department, setDepartment] = useState('');

  async function searchObjectByName(array, name) {
    let tempArray = array ? array : [];

    if (tempArray.length !== 0) {
      if (name) {
        let matchingObjects = tempArray.filter(obj =>
          obj.title.toLowerCase().includes(name.toLowerCase())
        );
        console.log('tempArray', matchingObjects);
        return matchingObjects.length > 0 ? matchingObjects : allRooms;
      } else {
        console.log(allRooms);
        return allRooms;
      }
    } else {
      console.log(allRooms);
      return allRooms;
    }
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
        const id = await AsyncStorage.getItem('@id');
        await axios
          .get(`http://192.168.100.26:3001/recentChats?id=${id}`)
          .then(results => {
            results.data.recentChats[0].groups.sort((a, b) => {
              const timeA = new Date(a.time);
              const timeB = new Date(b.time);

              // Use timeA - timeB to sort in ascending order (oldest to newest)
              // Use timeB - timeA to sort in descending order (newest to oldest)
              return timeB - timeA;
            });
            setRooms(results.data.recentChats[0].groups);
            setAllRooms(results.data.recentChats[0].groups);
          });
      }
      getChats();
    }, [shouldUpdate, refresh]),
  );

  useLayoutEffect(() => {
    async function sort() {
      const result = await searchObjectByName(allRooms, search);
      console.log('result', result);
      setRooms(result);
    }
    sort();
    // console.log(rooms)
  }, [search]);

  useEffect(() => {
    async function getUsers() {
      const department = await AsyncStorage.getItem('@department');
      const id = await AsyncStorage.getItem('@id');
      await axios
        .get(
          `http://192.168.100.26:3001/user?department=${department}&query=${search}&id=${id}`,
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
              fontSize: 19,
              // textDecorationLine: 'underline',
              marginBottom: 10,
              fontWeight: '600',
              color: '#000',
              fontFamily: 'Pacifico-Regular',
            }}>
            Sheikhani Group Communication
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.pageHeading}>My Groups</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text
                style={{
                  color: '#1F2067',
                  // fontFamily: 'Roboto',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                Create a new group
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require('../images/add.png')}></Image>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.pageSubHeading}>
            Create groups with colleagues for project discussions, picnic
            planning, and for anything more than personal
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
                      <Pressable onPress={() => {
                        setRefresh(!refresh);
                        setSearchedUsersVisible(false);
                        Keyboard.dismiss();
                      }
                      }>
                        <Image
                          resizeMode="contain"
                          style={{ width: 20 }}
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
                <GroupChatComponent item={item} username={username} setShiftVisible={setShiftVisible} setShiftId={setShiftId} />
              )}
              keyExtractor={item => item.user}
            />
          ) : (
            <View style={styles.chatemptyContainer}>
              <Text style={styles.chatemptyText}>No groups created!</Text>
            </View>
          )}
        </View>
        {visible ? (
          <Modal
            setShouldUpdate={setShouldUpdate}
            shouldUpdate={shouldUpdate}
            setVisible={setVisible}
          />
        ) : (
          ''
        )}
        {shiftVisible ? (
          <ShiftModal
            setShouldUpdate={setShouldUpdate}
            shouldUpdate={shouldUpdate}
            setShiftVisible={setShiftVisible}
            shiftId={shiftId}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        ) : (
          ''
        )}
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

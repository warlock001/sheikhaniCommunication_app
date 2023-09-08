import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TextField from '../component/inputField';
import { Checkbox } from 'react-native-paper';

const Modal = ({ setVisible, roomid }) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState('');
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem('@id');
    await axios
      .post('http://52.53.197.201:3001/group', {
        title: groupName,
        id: id,
      })
      .then(res => {
        setGroupName('');
        Alert.alert('', 'Group Created Successfully');
      })
      .catch(err => {
        console.log(err);
      });
    closeModal();
  };

  useEffect(() => {
    async function getUsers() {
      console.log('ye3h raaha');
      const department = await AsyncStorage.getItem('@department');
      const id = await AsyncStorage.getItem('@id');
      console.log('ye3h raaha dataaaaaaaaaaaaaaa', department);
      console.log('ye3h raaha');
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

  //zabalon will edit this
  async function handleAdd() {
    await axios
      .post('http://192.168.0.100:3001/groupMember', {
        id: checkedItems,
        roomid: roomid,
      })
      .then(response => {
        Alert.alert('', 'Added To Group Sucessfully');
      })
      .catch(err => {
        console.log(err);
      });
  }

  const [checkedItems, setCheckedItems] = useState([]);

  function Item({ props }) {
    const [image, setImage] = useState(false);
    useLayoutEffect(() => {
      async function getImage() {
        axios
          .get(
            `http://192.168.0.100:3001/files/${props.profilePicture[0]}/true`,
          )
          .then(image => {
            setImage(
              `data:${image.headers['content-type']};base64,${image.data}`,
            );
          })
          .catch(err => {
            console.log(err);
          });
      }

      getImage();
    });

    const isChecked = id => {
      return checkedItems.includes(id);
    };

    const toggleItem = id => {
      if (isChecked(id)) {
        setCheckedItems(checkedItems.filter(item => item !== id));
      } else {
        setCheckedItems([...checkedItems, id]);
      }
    };
    console.log(checkedItems);

    // const isChecked = id => {
    //   return checkedItems.includes(id);
    // };

    // const toggleItem = id => {
    //   console.log(id);
    //   if (isChecked(id)) {
    //     let CheckedItems = [];
    //     CheckedItems = checkedItems;
    //     CheckedItems.splice(CheckedItems.indexOf(id));
    //     setCheckedItems(CheckedItems);
    //   } else {
    //     setCheckedItems([...checkedItems, id]);
    //   }
    //   console.log(checkedItems);
    // };
    return (
      <View
      // onPress={() => {
      //   handleAdd(props.id);
      // }}
      >
        <View style={style.item}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
          <Checkbox
            style={{ backgroundColor: 'yellow' }}
            status={isChecked(props.id) ? 'checked' : 'unchecked'}
            color="#1F2067"
            onPress={() => toggleItem(props.id)}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '90%',
        borderColor: '#ddd',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderWidth: 5,
        elevation: 1,
        // height: 300,
        backgroundColor: '#fff',
        position: 'absolute',
        left: 15,
        top: 0,
        zIndex: 10,
        paddingVertical: 50,
        paddingHorizontal: 20,
      }}>
      <Pressable
        style={{
          // backgroundColor: '#E14D2A',
          // width: '40%',
          position: 'absolute',
          right: 5,
          top: 5,
          // height: 45,
          backgroundColor: '#ddd',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
        onPress={closeModal}>
        <Image
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
          source={require('../images/close.png')}
        />
      </Pressable>
      <Text
        style={{
          color: '#000',
          fontSize: 22,
          // fontWeight: 'bold',
          marginBottom: 15,
          textAlign: 'center',
          position: 'relative',
          letterSpacing: 1,
          fontFamily: 'TitilliumWeb-Bold',
        }}>
        Select Users to Add
      </Text>
      <TextField
        style={{
          color: '#fff',
          minHeight: 50,
          fontSize: 18,
          // maxHeight: 100,
        }}
        label="Search People"
        activeOutlineColor={'#fff'}
        outlineColor={'#fff'}
        backgroundColor={'#fff'}
        mode="flat"
        textAlign="center"
        multiline={true}
        value={search}
        onChangeText={value => setSearch(value)}
        placeholderTextColor={'#000'}
        color={'#000'}
      />
      <ScrollView
        style={{
          display: searchedUsersVisible ? 'flex' : 'none',
          marginTop: 33,
          maxHeight: 400,
        }}>
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
      </ScrollView>
      <Text>{checkedItems.length} {checkedItems.length > 1 ? 'Users' : 'User'} selected</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 40,
        }}>
        <Pressable
          style={{
            alignSelf: 'center',
            width: '100%',
            height: 45,
            backgroundColor: '#1F2067',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
          onPress={handleAdd}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 4,
            }}>
            ADD PEOPLE
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;

const style = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 5,
    paddingBottom: 5,
  },
});

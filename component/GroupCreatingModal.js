import { View, Text, Pressable, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TextField from '../component/inputField';
import { TextInput } from 'react-native-paper';
const Modal = ({ setShouldUpdate, shouldUpdate, setVisible }) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState('');

  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem('@id');
    await axios.post("http://192.168.0.100:3001/group", {
      title: groupName,
      id: id
    }).then((res) => {
      setGroupName('')
      Alert.alert("", "Group Created Successfully")
      setShouldUpdate(!shouldUpdate)
    }).catch(err => {
      console.log(err)
    })
    closeModal();
  };
  return (
    <View
      style={{
        width: '100%',
        borderColor: '#ddd',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderWidth: 5,
        elevation: 1,
        height: 300,
        backgroundColor: '#fff',
        position: 'absolute',
        left: 25,
        bottom: 10,
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
          // backgroundColor: '#ddd',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
        onPress={closeModal}>
        <Image
          resizeMode="contain"
          style={{ width: 20, height: 20 }}
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
        Enter your Group name
      </Text>
      <TextField
        style={{
          color: '#fff',
          minHeight: 50,
          fontSize: 18,
          // maxHeight: 100,
        }}
        label="Group name"
        activeOutlineColor={'#1F2067'}
        outlineColor={'#fff'}
        backgroundColor={'#fff'}
        mode="flat"
        textAlign="center"
        multiline={true}
        value={groupName}
        onChangeText={value => setGroupName(value)}
        right={<TextInput.Affix text={groupName.length + '/22'} />}
        placeholdeTextColor={'#000'}
        maxLength={22}
        color={'#000'}
      />
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
          onPress={handleCreateRoom}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 4,
            }}>
            CREATE
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;

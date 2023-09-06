import {View, Text, TextInput, Pressable, Alert} from 'react-native';
import React, {useState} from 'react';
import socket from '../utils/socket';
import {styles} from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Modal = ({setVisible}) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState('');

  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem('@id');
    await axios
      .post('http://192.168.0.100:3001/group', {
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
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Enter your Group name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="Group name"
        value={groupName}
        onChangeText={value => setGroupName(value)}
        placeholderTextColor={'#000'}
        color={'#000'}
      />
      <View style={styles.modalbuttonContainer}>
        <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>
        <Pressable
          style={[styles.modalbutton, {backgroundColor: '#E14D2A'}]}
          onPress={closeModal}>
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;

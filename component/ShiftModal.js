import { StyleSheet, Text, Image, View, Pressable, Alert } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';

export default function ShiftModal({
  setShiftVisible,
  seen,
  delivered,
  shiftId,
  setRefresh,
  refresh
}) {

  const closeModal = () => {
    setShiftVisible(false)
  };

  const shiftGroup = async () => {
    await axios.post('http://192.168.100.26:3001/shiftGroup', {
      roomid: shiftId
    }).then(res => {
      setRefresh(!refresh)
      Alert.alert("", "Group Transfered To Workspace Successfully")
      setShiftVisible(false)
    }).catch(err => {
      Alert.alert("", "Unknown error occured")
      setShiftVisible(false)
    })
  };

  return (
    <View
      style={{
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 5,
        borderRadius: 25,
        elevation: 1,
        height: 150,
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 25,
        bottom: 10,
        zIndex: 10,
        // paddingVertical: 50,
        paddingHorizontal: 20,
      }}>
      <Pressable
        style={{
          position: 'absolute',
          right: 15,
          top: 15,
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

      <TouchableOpacity
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
        onPress={() => {
          shiftGroup()
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            letterSpacing: 4,
          }}>
          Shift To Workspace
        </Text>
      </TouchableOpacity>


    </View>
  )
}

const styles = StyleSheet.create({
  lineStyle: {
    borderWidth: 0.2,
    borderColor: 'grey',
    margin: 5,
  }
})
import { StyleSheet, Text, Image, View, Pressable } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ShiftModal({
  setShiftVisible,
  seen,
  delivered
}) {

  const closeModal = () => {
    setShiftVisible(false)

  };
  return (
    <View
      style={{
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 5,
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
      // onPress={handleCreateRoom}
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
      </Pressable>


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
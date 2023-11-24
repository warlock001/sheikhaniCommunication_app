import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  Image,
  Touchable,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native'; // Import the navigation hook
import Modal from '../component/GroupCreatingModal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import {styles} from '../utils/styles';
import {TextInput} from 'react-native-paper';
import TextField from '../component/inputField';
const AnnouncementPreview = ({route}) => {
  const navigation = useNavigation();

  const {id, title, description, date, user} = route.params;

  function formatDate(isoDateString) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const date = new Date(isoDateString);

    const day = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} ${monthName} ${year}`;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        padding: 10,
        position: 'relative',
      }}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={45}
        enabled>
        <View>
          <View style={{padding: 10}}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '600',
                color: '#000',
                fontFamily: 'Pacifico-Regular',
                textAlign: 'center',
              }}>
              Sheikhani Group Communication
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#F5F7F9',
                borderRadius: 100,
                marginLeft: 'auto',
                marginTop: 20,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{width: 20}}
                source={require('../images/close.png')}
              />
            </Pressable>
            <Text
              style={{
                marginBottom: 22,
                fontSize: 22,
                fontWeight: '700',
                color: '#000000',
              }}>
              {title}
            </Text>

            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                padding: 16,
                borderRadius: 10,
                height: '80%',
              }}>
              <ScrollView>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#8f8f8f',
                  }}>
                  Published by: {user.firstName} {user.lastName} (Admin)
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#8f8f8f',
                  }}>
                  {formatDate(date)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    color: '#8f8f8f',
                    marginTop: 10,
                    lineHeight: 22,
                  }}>
                  {description}
                </Text>
              </ScrollView>
              {/* <View style={{position: 'absolute', right: '5%', top: '60%'}}>
                <Image
                  resizeMode="contain"
                  style={{width: 9, height: 15, marginRight: 5}}
                  source={require('../images/chevron_right.png')}
                />
              </View> */}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AnnouncementPreview;

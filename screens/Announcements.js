import React, { useState, useLayoutEffect, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import Modal from '../component/GroupCreatingModal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import { TextInput } from 'react-native-paper';
import TextField from '../component/inputField';
const Announcements = () => {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [profileUsername, setUser] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  const [CurrentPassword, setCurrentPassword] = useState(null);
  const [NewPassword, setNewPassword] = useState(null);
  const [NewPassword2, setNewPassword2] = useState(null);

  const getUsername = async () => {
    try {
      const profileUsername = await AsyncStorage.getItem('@username');
      // console.log(profileUsername);
      if (profileUsername !== null) {
        setUser(profileUsername);
      }
    } catch (e) {
      console.error('Error while loading username!');
    }
  };

  getUsername();

  const [editingPersonalDetails, setPersonalDetails] = useState(true);
  const [editing, setEditing] = useState(false); // State to manage editing mode
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('Nelson');
  const [designation, setDesignation] = useState('Marketing Manager');

  const handlePersonalDetails = () => {
    setPersonalDetails(true);
  };

  const handleSecurityDetails = () => {
    setPersonalDetails(false);
  };

  const startEditing = () => {
    setEditing(true);
  };

  const saveChanges = () => {
    setEditing(false);
    // You can perform saving logic here, like updating the data
  };

  const [matchingPasswords, setMatchingPasswords] = useState(false);
  const [currentPasswordMatch, setCurrentPasswordMatch] = useState(false);

  const handleNewPasswordChange = text => {
    setNewPassword(text);

    // Check for password conditions
    const isLengthValid = text.length >= 8;
    const hasAlphanumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
    const hasUpperCase = /[A-Z]/.test(text);

    setMatchingPasswords(
      text === NewPassword2 && isLengthValid && hasAlphanumeric && hasUpperCase,
    );
  };

  const handleNewPassword2Change = text => {
    setNewPassword2(text);
    setMatchingPasswords(text === NewPassword);
  };

  const handleCurrentPasswordChange = text => {
    setCurrentPasswordMatch(text === 'abc.123');
    setCurrentPassword(text);
  };

  const saveNewPassword = () => {
    if (matchingPasswords && currentPasswordMatch) {
      // Perform the logic to save the new password here
      console.log('New password saved!');
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        padding: 10,
        position: 'relative',
      }}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#8f8f8f',
                marginBottom: 10,
              }}>
              All company announcements will display here
            </Text>

            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
                borderColor: "#123abc",
                borderWidth: 2,
              }}>
              <Pressable
                onPress={() => navigation.navigate('AnnouncementPreview')}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  Company Wide Notice
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </Pressable>
              <View style={{ position: 'absolute', right: '5%', top: '60%' }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  Developments 2.13.2
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </View>
              <View style={{ position: 'absolute', right: '5%', top: '60%' }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  New HR Policy
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </View>

              <View style={{ position: 'absolute', right: '5%', top: '60%' }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
              }}>
              <View style={{ width: '95%' }}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  Anniversary Celebrations on September 10th and Quarterly
                  Analysis Announcement
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  right: '5%',
                  top: '60%',
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  Please reach us if you do not have your roles assigned to you
                  yet. This is a high priority task as you all are requried to
                  communicate through this Application only.
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </View>
              <View style={{ position: 'absolute', right: '5%', top: '60%' }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F5F7F9',
                flexDirection: 'row',
                marginBottom: 20,
                padding: 16,
                borderRadius: 10,
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  How to use this App, A Walkthrough
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: '400', color: '#8f8f8f' }}>
                  Today at 18.40
                </Text>
              </View>
              <View style={{ position: 'absolute', right: '5%', top: '60%' }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 9, height: 15, marginRight: 5 }}
                  source={require('../images/chevron_right.png')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Announcements;

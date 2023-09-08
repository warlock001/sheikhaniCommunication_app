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
const AnnouncementPreview = () => {
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
                padding: 10,
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
                resizeMode="cover"
                style={{width: 25}}
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
              Company Wide Notice
            </Text>

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
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#8f8f8f',
                  }}>
                  Published by: Mark Roosevelt (Admin)
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#8f8f8f',
                  }}>
                  Today at 18.40
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    color: '#8f8f8f',
                    marginTop: 10,
                    lineHeight: 22,
                  }}>
                  Torem ipsum dolor sit amet, consectetur adipiscing elit.
                  Dignissim dui purus sit hac ac, ornare a nibh etiam. Diam eget
                  mauris, iaculis pellentesque hendrerit turpis dolor facilisi
                  velit. Ullamcorper sit adipiscing sed id nisl at integer.
                  Tristique in lectus interdum nisi augue pellentesque laoreet
                  ullamcorper sagittis. Lectus leo ut diam laoreet sit. Sed non
                  netus cum faucibus blandit. Non non ut donec quisque ut
                  suscipit mauris. Est, id egestas euismod diam, sagittis
                  condimentum vitae vestibulum. Facilisi lectus feugiat pharetra
                  diam scelerisque suspendisse mauris consequat aliquam. Id
                  ornare viverra ornare posuere gravida facilisi blandit. Ut
                  vestibulum habitant tortor vel lacus ac aliquet. Condimentum
                  condimentum ut massa lacus condimentum varius. Laoreet rutrum
                  tincidunt enim, amet, et. Cursus adipiscing sed sapien ac
                  sollicitudin varius. Ullamcorper sit adipiscing sed id nisl at
                  integer. Tristique in lectus interdum nisi augue pellentesque
                  laoreet ullamcorper sagittis. Lectus leo ut diam laoreet sit.
                  Sed non netus cum faucibus blandit. Non non ut donec quisque
                  ut suscipit mauris. Est, id egestas euismod diam, sagittis
                  condimentum vitae vestibulum. Facilisi lectus feugiat pharetra
                  diam scelerisque suspendisse mauris consequat aliquam. Id
                  ornare viverra ornare posuere gravida facilisi blandit. Ut
                  vestibulum habitant tortor vel lacus ac aliquet. Condimentum
                  condimentum ut massa lacus condimentum varius. Laoreet rutrum
                  tincidunt enim, amet, et. Cursus adipiscing sed sapien ac
                  sollicitudin varius.
                </Text>
              </View>
              {/* <View style={{position: 'absolute', right: '5%', top: '60%'}}>
                <Image
                  resizeMode="contain"
                  style={{width: 9, height: 15, marginRight: 5}}
                  source={require('../images/chevron_right.png')}
                />
              </View> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AnnouncementPreview;

import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import Modal from '../component/Modal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import ImageModal from '../component/ImageModal';
import { launchImageLibrary } from 'react-native-image-picker';

import axios from 'axios';
const Profile = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@username');
      await AsyncStorage.removeItem('@jwt');
      await AsyncStorage.removeItem('@role');
      await AsyncStorage.removeItem('@id');

      navigation.navigate('Login');
    } catch (e) {
      console.error('Error while logging out:', e);
    }
  };
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [profileUsername, setUser] = useState('');
  const [profileEmail, setEmail] = useState('');

  const getUsername = async () => {
    try {
      const profileUsername = await AsyncStorage.getItem('@username');
      const profileEmail = await AsyncStorage.getItem('@email');
      console.log(profileUsername);
      if (profileUsername !== null) {
        setUser(profileUsername);
      }
      if (profileEmail !== null) {
        setEmail(profileEmail);
      }
    } catch (e) {
      console.error('Error while loading username!');
    }
  };

  getUsername();

  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [profilepictureURL, setprofilepictureURL] = useState('');

  useEffect(() => {
    async function getProfilePictureURL() {
      const profilepicture = await AsyncStorage.getItem('@profilepicture');
      axios
        .get(`http://192.168.100.26:3001/files/${profilepicture}/true`)
        .then(res => {
          setprofilepictureURL(
            `data:${res.headers['content-type']};base64,${res.data}`,
          );
        });
    }

    getProfilePictureURL();
  }, []);

  const [image, setImage] = useState('');

  const chooseImage = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        setImageName(response.assets[0].uri);
        setImage({
          uri: response.assets[0].uri,
          name: `${new Date()}_profilePicture.jpg`,
          type: mime.getType(response.assets[0].uri),
        });
      }
    });
  };

  const [pickermodalVisible, setpickerModalVisible] = useState(false);

  async function sendData() {
    console.log({
      petType: petType,
      breed: breed,
      age: age,
      color: color,
      petDescription: petDescription,
      phone: phone,
      dialCode: dialCode,
    });

    if (!image) {
      Alert.alert('', 'Please select an Image to upload.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      id = await AsyncStorage.getItem('@id');
      const form = new FormData();
      form.append('image', image);

      form.append('id', id);
      axios({
        method: 'POST',
        url: `http://192.168.100.26:3001/profilepicture`,
        data: form,
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data', // add this
        },
      })
        .then(res => {
          console.log(res.message);
          setpickerModalVisible(true);
        })
        .catch(err => {
          console.log(err);
          Alert.alert('', 'Unknown Error Occured', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        });
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        // padding: 10,
        position: 'relative',
      }}>
      <View
        style={{
          zIndex: -1,
          height: '30%',
          backgroundColor: '#1f2067',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Pacifico-Regular',
              marginTop: 30,
              fontSize: 24,
              fontWeight: '600',
              color: '#fff',
            }}>
            Sheikhani Group Communication
          </Text>

          <View
            style={{
              width: '33%',
              height: '26.4%',
              marginTop: '19%',
            }}>
            <Pressable onPress={toggleModal}>
              <Image
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 100,
                }}
                source={{ uri: profilepictureURL }}
              />
            </Pressable>
            <Pressable
              onPress={async () => {
                await chooseImage();
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                // borderWidth: 3,
                // borderColor: "#fff",
                width: '33%',
                height: '33%',
                borderRadius: 100,
              }}>
              <Image
                id="editprofile"
                resizeMode="contain"
                source={require('../images/EditProfile.png')}
              />
            </Pressable>
          </View>
          <Text
            style={{
              marginTop: 18,
              //adasdfad
              textAlign: 'center',
              fontFamily: 'Roboto',
              fontSize: 24,
              color: '#000',
              fontWeight: '600',
              fontFamily: 'TitilliumWeb-Regular',
            }}>
            {profileUsername}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 45, color: '#8F8F8F' }}>
            {profileEmail}
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              height: 'auto',
              justifyContent: 'space-around',
              flexDirection: 'column',
            }}>
            <Pressable
              onPress={() => navigation.navigate('AccountSettings')}
              style={{
                flexDirection: 'row',
                width: '80%',
                //   paddingHorizontal: "21%",
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 14,
                flexDirection: 'row',
                //   backgroundColor: "#FAE6E7",
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25, marginLeft: 5 }}
                  source={require('../images/settings.png')}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    textAlign: 'center',
                    color: '#000',
                  }}>
                  Account Settings
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{ width: 16, height: 16, marginRight: 5 }}
                source={require('../images/chevron_right.png')}
              />
            </Pressable>
            {/* ------To uncomment when we build the Announcements section-------- */}
            <Pressable
              onPress={() => navigation.navigate('Announcements')}
              style={{
                flexDirection: 'row',
                width: '80%',
                //   paddingHorizontal: "21%",
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 14,
                flexDirection: 'row',
                //   backgroundColor: "#FAE6E7",
                borderRadius: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25, marginLeft: 5 }}
                  source={require('../images/bookmark.png')}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    textAlign: 'center',
                    color: '#000',
                  }}>
                  Announcements
                </Text>
              </View>
              <Image
                resizeMode="contain"
                style={{ width: 16, height: 16, marginRight: 5 }}
                source={require('../images/chevron_right.png')}
              />
            </Pressable>
            <Pressable onPress={handleLogout}>
              <View
                style={{
                  paddingHorizontal: '33%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 14,
                  flexDirection: 'row',
                  marginTop: '10%',
                  backgroundColor: '#FAE6E7',
                  borderRadius: 5,
                }}>
                <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25 }}
                  source={require('../images/logout.png')}
                />
                <Text
                  style={{
                    color: '#CF0210',
                    fontSize: 16,
                    fontWeight: '500',
                    marginLeft: 10,
                  }}>
                  Logout
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <ImageModal
        visible={isModalVisible}
        profileImage={require('../images/ProfileDemo.jpg')} // Pass the profile image to the modal
        onClose={toggleModal}
      />
    </SafeAreaView>
  );
};

export default Profile;

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
const Profile = () => {
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
    setCurrentPasswordMatch(text === 'abc.123'); // Replace "predefinedcurrentpassword" with your actual predefined password
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
        backgroundColor: '#F1F1F1',
        flex: 1,
        padding: 10,
        position: 'relative',
      }}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#1f1f1f',
              }}>
              Your Personal Info
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#8f8f8f',
                marginTop: 7,
              }}>
              View and edit your personal information here
            </Text>
            {editingPersonalDetails ? (
              <View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Pressable onPress={handlePersonalDetails}>
                    <Text
                      style={{
                        borderBottomWidth: 3,
                        borderColor: '#1F2067',
                        color: '#1F2067',
                        fontWeight: '500',
                        fontSize: 14,
                      }}>
                      Personal Details
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSecurityDetails}
                    style={{ marginLeft: 30 }}>
                    <Text
                      style={{
                        color: '#000',
                      }}>
                      Security
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    // width: "100%",
                    marginTop: 5,
                    borderBottomWidth: 2,
                    borderColor: '#E6E6E6',
                  }}></View>

                <View style={{}}>
                  {editing ? (
                    <View>
                      <TextField
                        label="First Name"
                        outlineColor="#1f2067"
                        style={{ marginTop: 20, height: 60 }}
                        value={firstName}
                        onChangeText={setFirstName}
                      />
                      <TextField
                        label="Last Name"
                        outlineColor="#1f2067"
                        style={{ marginTop: 20, height: 60 }}
                        value={lastName}
                        onChangeText={setLastName}
                      />
                      <TextField
                        label="Designation"
                        outlineColor="#1f2067"
                        style={{ marginTop: 20, height: 60 }}
                        value={designation}
                        onChangeText={setDesignation}
                      />
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: '#1f1f1f',
                          }}>
                          First Name
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            color: '#8f8f8f',
                          }}>
                          {profileUsername}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: '#1f1f1f',
                          }}>
                          Last Name
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            color: '#8f8f8f',
                          }}>
                          Nelson
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: '#1f1f1f',
                          }}>
                          Designation
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '400',
                            color: '#8f8f8f',
                          }}>
                          Marketing Manager
                        </Text>
                      </View>
                    </View>
                  )}
                  {editing ? (
                    <Pressable onPress={saveChanges}>
                      <View
                        style={{
                          paddingHorizontal: '33%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 14,
                          flexDirection: 'row',
                          marginTop: '10%',
                          backgroundColor: '#00BD57',
                          borderRadius: 5,
                        }}>
                        <Image
                          resizeMode="contain"
                          style={{ width: 25, height: 25 }}
                          source={require('../images/check.png')}
                        />
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 16,
                            fontWeight: '500',
                            marginLeft: 10,
                          }}>
                          Save Changes
                        </Text>
                      </View>
                    </Pressable>
                  ) : (
                    <Pressable onPress={startEditing}>
                      <View
                        style={{
                          paddingHorizontal: '33%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingVertical: 14,
                          flexDirection: 'row',
                          marginTop: '10%',
                          backgroundColor: '#1F2067',
                          borderRadius: 5,
                        }}>
                        <Image
                          resizeMode="contain"
                          style={{ width: 25, height: 25 }}
                          source={require('../images/EditProfile3.png')}
                        />
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 16,
                            fontWeight: '500',
                            marginLeft: 10,
                          }}>
                          Edit Info
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Pressable onPress={handlePersonalDetails}>
                    <Text
                      style={{
                        color: '#000',
                      }}>
                      Personal Details
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSecurityDetails}
                    style={{ marginLeft: 30 }}>
                    <Text
                      style={{
                        borderBottomWidth: 3,
                        borderColor: '#1F2067',
                        color: '#1F2067',
                        fontWeight: '500',
                        fontSize: 14,
                      }}>
                      Security
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    // width: "100%",
                    marginTop: 5,
                    borderBottomWidth: 2,
                    borderColor: '#E6E6E6',
                    marginBottom: 10,
                  }}></View>

                <View style={{}}>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '400',
                        color: '#8f8f8f',
                      }}>
                      Password should be 8 characters long
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '400',
                        color: '#8f8f8f',
                      }}>
                      Use alphanumeric characters to make strong password
                    </Text>
                    <Text
                      style={{
                        marginBottom: 20,
                        fontSize: 14,
                        fontWeight: '400',
                        color: '#8f8f8f',
                      }}>
                      Use at least one capital letter in the combination
                    </Text>
                    <TextField
                      style={{ marginBottom: 10 }}
                      label="Current Password"
                      outlineColor="#1f2067"
                      secureTextEntry={showCurrentPassword ? false : true}
                      onChangeText={handleCurrentPasswordChange}
                      right={
                        <TextInput.Icon
                          name={() => (
                            <TouchableOpacity
                              onPress={() => {
                                setShowCurrentPassword(!showCurrentPassword);
                              }}>
                              <Image
                                resizeMode="contain"
                                style={{ width: 25 }}
                                source={require('../images/Hide.png')}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      }
                    />
                    <TextField
                      style={{ marginBottom: 10 }}
                      label="New Password"
                      outlineColor="#1f2067"
                      secureTextEntry={showNewPassword ? false : true}
                      onChangeText={handleNewPasswordChange}
                      right={
                        <TextInput.Icon
                          name={() => (
                            <TouchableOpacity
                              onPress={() => {
                                setShowNewPassword(!showNewPassword);
                              }}>
                              <Image
                                resizeMode="contain"
                                style={{ width: 25 }}
                                source={require('../images/Hide.png')}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      }
                    />
                    <TextField
                      style={{ marginBottom: 5 }}
                      label="Retype New Password"
                      outlineColor="#1f2067"
                      secureTextEntry={showNewPassword2 ? false : true}
                      onChangeText={handleNewPassword2Change}
                      right={
                        <TextInput.Icon
                          name={() => (
                            <TouchableOpacity
                              onPress={() => {
                                setShowNewPassword2(!showNewPassword2);
                              }}>
                              <Image
                                resizeMode="contain"
                                style={{ width: 25 }}
                                source={require('../images/Hide.png')}
                              />
                            </TouchableOpacity>
                          )}
                        />
                      }
                    />
                  </View>
                  <Pressable
                    onPress={saveNewPassword}
                    disabled={!matchingPasswords || !currentPasswordMatch}>
                    <View
                      style={{
                        paddingHorizontal: '10%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 14,
                        flexDirection: 'row',
                        marginTop: '10%',
                        backgroundColor:
                          matchingPasswords && currentPasswordMatch
                            ? '#00BD57'
                            : '#C7C7C7',
                        borderRadius: 5,
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{ width: 25, height: 25 }}
                        source={require('../images/check.png')}
                      />
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: '500',
                          marginLeft: 10,
                        }}>
                        Save New Password
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;

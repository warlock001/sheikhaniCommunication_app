import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import TextField from '../component/inputField';
import axios from 'axios';
import EnvelopeClosed from '../images/EnvelopeClosed.png';
import { CommonActions } from '@react-navigation/native';
//import { REACT_APP_BASE_URL } from '@env';
const REACT_APP_BASE_URL = "http://192.168.100.26:3001";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import Hide from "../images/Hide.png"
export default function SignIn({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  getMyStringValue = async () => {
    try {
      id = await AsyncStorage.getItem('@id');
      console.log(`${id} id hai`);
      navigate(id);
    } catch (e) {
      console.log(e);
    }
  };

  function navigate(ids) {
    if (ids !== null) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Home' },
          ],
        })
      );
    }
  }

  getMyStringValue();

  function signIn() {
    console.log(REACT_APP_BASE_URL);
    setLoader(true);
    axios({
      timeout: 20000,
      method: 'POST',
      url: `${REACT_APP_BASE_URL}/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then(async res => {
        console.log(res.data);
        await AsyncStorage.setItem('@id', res.data._id);
        await AsyncStorage.setItem('@jwt', res.data.token);
        await AsyncStorage.setItem('@role', res.data.role);
        await AsyncStorage.setItem('@department', res.data.department);
        await AsyncStorage.setItem('@username', res.data.firstName);
        const value = await AsyncStorage.getItem('@username');
        console.log(value);
        console.log('second');
        // console.log(res.data.firstName)
        setLoader(false);
        if (res.data.role == 'employee') {
          navigation.navigate('Home');
        } else {
          navigation.navigate('RescueCenter');
        }
      })
      .catch(er => {
        setLoader(false);
        console.log(er.response.data);

        Alert.alert(
          'Failed',
          `${er.response.data.message
            ? er.response.data.message
            : 'Something went wrong'
          }`,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        );
      });
  }

  return (
    <View style={{ height: '100%' }}>
      {!loader ? (
        <View style={{ height: '100%' }}>
          <ImageBackground
            source={require('../images/onboarding1.png')}
            style={{ width: '100%', height: 250 }}>
            <LinearGradient
              colors={['#CF333900', '#000000']}
              style={styles.gradientStyle}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 0.5, y: 1.5 }}
            />
            <View style={styles.topheader}>
              <View style={styles.textView}>
                <Text style={styles.textStyle}>Sign In</Text>
                <Text style={[styles.textStyle, { paddingBottom: 20 }]}>
                  To Your Account
                </Text>
                <Text style={styles.textStyle2}>
                  Sign with username or email and password to use your account.
                </Text>
              </View>
            </View>
          </ImageBackground>
          <ScrollView style={styles.bottomSection}>
            <View
              style={{ height: '100%', padding: 24, justifyContent: 'center' }}>
              <View style={{ paddingBottom: 20 }}>
                <TextField
                  style={{ marginBottom: 5 }}
                  label="Email Address"
                  onChangeText={text => setEmail(text)}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Image
                          resizeMode="contain"
                          style={{ width: 25 }}
                          source={EnvelopeClosed}
                        />
                      )}
                    />
                  }
                />
                <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                  <Text style={styles.forgotButtonStyle}>Forgot Email ID?</Text>
                </TouchableOpacity>
              </View>
              <View style={{ paddingBottom: 20 }}>
                <TextField
                  style={{ marginBottom: 5 }}
                  label="Password"
                  secureTextEntry={showPassword ? false : true}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  left={
                    <TextInput.Icon
                      name={() => (
                        <Image
                          resizeMode="contain"
                          style={{ width: 25 }}
                          source={require('../images/password_icon.png')}
                        />
                      )}
                    />
                  }
                  right={
                    <TextInput.Icon
                      name={() => (
                        <TouchableOpacity
                          onPress={() => {
                            setShowPassword(!showPassword);
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{ width: 25 }}
                            source={Hide}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  }
                />
                <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                  <Text style={styles.forgotButtonStyle}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => {
                  if (email !== null && password !== null) {
                    signIn();
                  }
                }}>
                <Text
                  style={{ textAlign: 'center', fontSize: 20, color: '#FFF' }}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <View style={{ width: '100%', justifyContent: 'center' }}>
                <View
                  style={{
                    marginTop: 25,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{ width: 150, height: 150, alignSelf: 'center' }}
                    source={require('../images/sheikhani.png')}
                  />
                  <Text
                    style={{
                      marginTop: 20,
                      fontSize: 24,
                      fontWeight: '600',
                      color: '#000',
                      fontFamily: 'Pacifico-Regular',
                    }}>
                    Sheikhani Group Communication
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <Image source={require('../images/Loading.png')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topheader: {
    height: 250,
    padding: 24,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontSize: 35,
    // fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  textStyle2: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    fontFamily: 'TitilliumWeb-Regular',
  },
  bottomSection: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
    height: '100%',
    width: '100%',
  },
  gradientStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  forgotButtonStyle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#777777',
  },
  signInButton: {
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1F2067',
    marginBottom: 15,
  },
});

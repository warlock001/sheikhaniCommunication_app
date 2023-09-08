import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native'; // Import the navigation hook
// import Modal from '../component/GroupCreatingModal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import {styles} from '../utils/styles';
import ImageModal from '../component/ImageModal';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
// import ImageSelectModal from '../component/ImageSelectModal';
const mime = require('mime');

const GroupChatDetails = () => {
  const navigation = useNavigation();

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
          height: '20%',
          backgroundColor: '#1f2067',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={
              {
                //   flexDirection: 'row',
                //   alignItems: 'center',
                //   justifyContent: 'center',
              }
            }>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                // padding: 10,
                backgroundColor: '#F5F7F9',
                borderRadius: 100,
                position: 'absolute',
                top: 10,
                left: -30,
                // marginRight: 20,
                // marginTop: 20,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="cover"
                style={{width: 15}}
                source={require('../images/arrow_back.png')}
              />
            </Pressable>
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
          </View>

          <View
            style={{
              marginTop: 20,
            }}>
            <Pressable>
              <View
                style={{
                  width: 150,
                  height: 150,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ccc',
                  borderRadius: 500,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 85,
                    lineHeight: 100,
                    color: '#000',
                  }}>
                  FU{/* {name.charAt(0)} */}
                </Text>
              </View>
            </Pressable>
            {/* <Pressable
              // Open the edit modal
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
            </Pressable> */}
          </View>
          <Text
            style={{
              marginTop: 18,
              //adasdfad
              textAlign: 'center',
              fontFamily: 'Roboto',
              fontSize: 24,
              color: '#000',
              //   fontWeight: '600',
              fontFamily: 'Roboto-Bold',
            }}>
            group name
          </Text>
          <Text style={{fontSize: 16, color: '#8F8F8F'}}>
            Group -{' '}
            <Text style={{fontSize: 16, color: '#8F8F8F'}}>x participants</Text>
          </Text>
          <View
            style={{
              width: '100%',
              marginTop: 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 17,
              }}>
              <Text
                style={{
                  color: '#1f1f1f',
                  fontSize: 12,
                  fontWeight: '600',
                  marginLeft: 20,
                }}>
                Media, Links and Docs
              </Text>
              <Text
                style={{
                  color: '#8f8f8f',
                  fontSize: 12,
                  fontWeight: '400',
                  marginRight: 20,
                }}>
                xx Items
              </Text>
            </View>

            <ScrollView horizontal={true} style={{width: '100%'}}>
              <Image
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 100,
                  //   borderRadius: 100,
                }}
                source={require('../images/onboarding2.png')}
              />
            </ScrollView>
            <View>
              <Text style={{color: '#000'}}>afasdfas</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GroupChatDetails;

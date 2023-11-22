import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
// import Modal from '../component/GroupCreatingModal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import { styles } from '../utils/styles';
import ImageModal from '../component/ImageModal';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
// import ImageSelectModal from '../component/ImageSelectModal';
const mime = require('mime');

function Item({ props, item }) {
  const [image, setImage] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    async function getImage() {
      axios
        .get(`http://192.168.100.26:3001/files/${props.profilePicture[0]}/true`)
        .then(image => {
          setImage(
            `data:${image.headers['content-type']};base64,${image.data}`,
          );
        })
        .catch(err => {
          console.log(err);
        });
    }

    getImage();
  });

  const handleDetailNavigation = async (id, image) => {
    const myId = await AsyncStorage.getItem('@id');
    if (myId !== id) {
      navigation.navigate('DirectMessageDetails', {
        id: id,
        image: image,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleDetailNavigation(props.id, image);
      }}>
      <View style={style.item}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {image ? (
            <Image
              resizeMode="cover"
              style={[styles.mavatar, { marginTop: 'auto' }]}
              source={{ uri: image }}
              width={30}
            />
          ) : (
            <View
              style={{
                width: 45,
                height: 45,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1f2067',
                borderRadius: 500,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 25,
                  lineHeight: 30,
                  color: '#fff',
                }}>
                {props.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
            {props.title}
          </Text>
        </View>
        <Text style={{ color: '#8f8f8f', marginRight: 40 }}>
          {props.designation}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const GroupChatDetails = ({ route, navigation }) => {
  const { roomid } = route.params;
  const [loader, setLoader] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [memberSize, setMemberSize] = useState(0);
  const [members, setMembers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [chatImage, setChatImages] = useState([]);
  const [modalImage, setModalImage] = useState('');
  const [mediaLength, setMediaLength] = useState(0);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useLayoutEffect(() => {
    async function groupDetails() {
      // setLoader(true);
      console.log('first');
      await axios
        .get(`http://192.168.100.26:3001/group?roomid=${roomid}`)
        .then(async res => {
          console.log(res.data.group.title);
          setLoader(true);
          setGroupName(res.data.group.title);
          setMemberSize(res.data.group.members.length);
          setMembers(res.data.group.members);
        })
        .catch(async er => {
          setLoader(true);
          // console.log(er.response.data);

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

    groupDetails();
  }, []);

  useLayoutEffect(() => {
    async function loadImages() {
      let imagearr = [];

      console.log('roomId', roomid);
      await axios
        .get(`http://192.168.100.26:3001/getMessage?roomid=${roomid}`)
        .then(async res => {
          await res.data.messages.forEach(async (message, index) => {
            if (message.isPicture) {
              setMediaLength(index);
              await axios
                .get(`http://192.168.100.26:3001/files/${message.message}/true`)
                .then(image => {
                  imagearr.push(
                    `data:${image.headers['content-type']};base64,${image.data}`,
                  );
                });
            }
          });
        });

      setChatImages(imagearr);
    }
    loadImages();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        // padding: 10,
        position: 'relative',
      }}>
      {loader ? (
        <ScrollView
          nestedScrollEnabled={true} // Enable nested scrolling
          pagingEnabled={false}
          style={{
            // width: '100%',
            // height: '100%',
            flex: 1,
          }}>
          {/* <View
          style={{
            zIndex: -1,
            height: '9%',
            backgroundColor: '#1f2067',
          }}> */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={
                {
                  //   flexDirection: 'row',
                  // alignItems: 'center',
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
                  top: 15,
                  left: -45,
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
                  style={{ width: 15 }}
                  source={require('../images/arrow_back.png')}
                />
              </Pressable>
              <Text
                style={{
                  fontFamily: 'Pacifico-Regular',
                  marginTop: 10,
                  fontSize: 19,
                  fontWeight: '600',
                  color: '#000',
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
                    backgroundColor: '#1f2067',
                    borderRadius: 500,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontSize: 85,
                      lineHeight: 100,
                      color: '#fff',
                      fontWeight: '600',
                    }}>
                    {groupName.charAt(0).toUpperCase()}
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
              {groupName}
            </Text>
            <Text style={{ fontSize: 16, color: '#8F8F8F' }}>
              Group -{' '}
              <Text style={{ fontSize: 16, color: '#8F8F8F' }}>
                {memberSize} participants
              </Text>
            </Text>
            <View
              style={{
                flex: 1,
                marginTop: 40,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 17,
                  marginHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: '#1f1f1f',
                    fontSize: 12,
                    fontWeight: '600',
                    marginLeft: 30,
                  }}>
                  Media, Links and Docs
                </Text>
                <Text
                  style={{
                    color: '#8f8f8f',
                    fontSize: 12,
                    fontWeight: '400',
                    marginRight: 30,
                  }}>
                  9 Items
                </Text>
              </View>
              <SafeAreaView
                style={{
                  flex: 1,
                  width: '100%',
                }}>
                <ScrollView
                  nestedScrollEnabled={true}
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  alwaysBounceHorizontal={true}
                  style={{ flex: 1, paddingLeft: 30, marginRight: -20 }}>
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    horizontal={true} // Enable horizontal scrolling
                    showsHorizontalScrollIndicator={true}
                    scrollEnabled={true}
                    data={chatImage}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setModalImage(item);
                          toggleModal();
                        }}>
                        <Image
                          resizeMode="cover"
                          style={{
                            width: 100,
                            height: 100,
                            marginHorizontal: 10,
                            borderRadius: 10,
                            borderWidth: 0.8,
                            borderColor: '#D9D9D9',
                          }}
                          source={{ uri: item }}
                          width={30}
                        />
                      </Pressable>
                      // <Item
                      //   props={{
                      //     title: item.firstName,
                      //     id: item._id,
                      //     // designation: item.designation,
                      //     // profilePicture: item.profilePicture,
                      //   }}
                      // />
                    )}
                    keyExtractor={item => item._id}
                    style={{ width: Dimensions.get('window').width }}
                  />
                  <ImageModal
                    visible={isModalVisible}
                    profileImage={{ uri: modalImage }}
                    onClose={toggleModal}
                  />
                </ScrollView>
              </SafeAreaView>

              {/* <Image
                  resizeMode="contain"
                  style={{
                    width: 100,
                    height: 100,
                    //   borderRadius: 100,
                  }}
                  source={require('../images/onboarding2.png')}
                /> */}
              <View style={{ marginHorizontal: 20, marginTop: 40 }}>
                <Text style={{ marginLeft: 20, color: '#8f8f8f' }}>
                  {memberSize} participants
                </Text>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                  data={members}
                  renderItem={({ item }) => (
                    <Item
                      props={{
                        title: item.firstName + ' ' + item.lastName,
                        id: item._id,
                        designation: item.designation,
                        profilePicture: item.profilePicture,
                      }}
                    />
                  )}
                  keyExtractor={item => item._id}
                  style={{
                    width: Dimensions.get('window').width,
                    marginLeft: 20,
                  }}
                />
              </View>
            </View>
          </View>
          {/* </View> */}
        </ScrollView>
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
    </SafeAreaView>
  );
};

export default GroupChatDetails;

const style = StyleSheet.create({
  item: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    // paddingLeft: 5,
  },
});

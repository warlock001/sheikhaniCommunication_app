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
import { styles } from '../utils/styles';
import ImageModal from '../component/ImageModal';
import axios from 'axios';
const mime = require('mime');

function Item({ props, item }) {
  const [image, setImage] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    async function getImage() {
      axios
        .get(`http://52.9.129.21:3001/files/${props.profilePicture[0]}/true`)
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
            {props.title.length > 21
              ? props.title.slice(0, 21) + '...'
              : props.title}
          </Text>
        </View>
        <Text style={{ color: '#8f8f8f', marginRight: 40 }}>
          {props.designation}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const WorkspaceChatDetails = ({ route, navigation }) => {
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
        .get(`http://52.9.129.21:3001/workspace?roomid=${roomid}`)
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
      const response = await axios.get(`http://52.9.129.21:3001/getMessage?roomid=${roomid}`);

      await Promise.all(
        response.data.messages.map(async (message) => {
          if (message.isPicture) {
            const image = await axios.get(`http://52.9.129.21:3001/files/${message.message}/true`);
            imagearr.push(`data:${image.headers['content-type']};base64,${image.data}`,);
          }
        })
      );

      // console.log(imagearr, "imagearr");
      // setChatImages(imagearr);
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
        <View
          // nestedScrollEnabled={true} // Enable nested scrolling
          // pagingEnabled={false}
          style={{
            flex: 1,

          }}
        >

          <View style={{ alignItems: 'center', flex: 1 }}>
            <View>
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: '#F5F7F9',
                  borderRadius: 100,
                  position: 'absolute',
                  top: 15,
                  left: -45,
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
            </View>
            <Text
              style={{
                marginTop: 18,
                textAlign: 'center',
                fontFamily: 'Roboto',
                fontSize: 24,
                color: '#000',
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
                  {mediaLength} Items
                </Text>
              </View>

              <View
                nestedScrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                alwaysBounceHorizontal={true}
                style={{ flex: 1 }}
              >
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
                      {/* <Image
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
                      /> */}
                    </Pressable>
                  )}
                  // keyExtractor={item => item._id}
                  style={{ width: Dimensions.get('window').width, backgroundColor: 'red', }}
                />
                <ImageModal
                  visible={isModalVisible}
                  profileImage={{ uri: modalImage }}
                  onClose={toggleModal}
                />
              </View>
              {/* </SafeAreaView> */}
              <View style={{ marginHorizontal: 20, marginTop: 40 }}>
                <Text style={{ marginLeft: 20, color: '#8f8f8f' }}>
                  {memberSize} participants
                </Text>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                  data={members}
                  renderItem={({ item }) => (
                    <View>
                      <Item
                        props={{
                          title: item.firstName + ' ' + item.lastName,
                          id: item._id,
                          designation: item.designation,
                          profilePicture: item.profilePicture,
                        }}
                      />

                    </View>

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
    </SafeAreaView>
  );
};

export default WorkspaceChatDetails;

const style = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
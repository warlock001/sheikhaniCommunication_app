import { View, Text, Image, Pressable } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { styles } from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import ImageModal from './ImageModal';
export default function DirectMessageComponent({
  onRendered,
  lastItem,
  item,
  user,
  setReceiptsModalVisible,
  setSeen,
  setDelivered,
}) {
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [mediaImage, setMediaImage] = useState('');
  const date = new Date(item.createdAt);

  useLayoutEffect(() => {
    async function getStatus() {
      const myId = await AsyncStorage.getItem('@id');
      setStatus(item.senderid !== myId);
    }

    getStatus();
  }, []);

  useLayoutEffect(() => {
    async function getImage() {
      await axios
        .get(`http://52.9.129.21:3001/user?id=${item.senderid}`)
        .then(async result => {
          console.log('image ->', result.data.user.profilePicture[0]);
          await axios
            .get(
              `http://52.9.129.21:3001/files/${result.data.user.profilePicture[0]}/true`,
            )
            .then(image => {
              setImage(
                `data:${image.headers['content-type']};base64,${image.data}`,
              );
            });
        })
        .catch(err => {
          console.log('err', err);
        });
    }
    getImage();
  }, []);

  useLayoutEffect(() => {
    async function loadImage() {
      if (item.isPicture) {
        await axios
          .get(`http://52.9.129.21:3001/files/${item.message}/true`)
          .then(result => {
            setMediaImage(
              `data:${result.headers['content-type']};base64,${result.data}`,
            );
          });
      }
    }
    loadImage();
  }, []);

  const hour =
    date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;

  const mins =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <TouchableOpacity
      onLongPress={() => {
        setDelivered(item.createdAt);
        setSeen(item.updatedAt);
        setReceiptsModalVisible(true);
      }}>
      <View key={item._id}>
        <View
          style={
            status
              ? [styles.mmessageWrapper]
              : [styles.mmessageWrapper, { alignItems: 'flex-end' }]
          }>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {status ? (
              image ? (
                <Image
                  resizeMode="cover"
                  style={{
                    width: 30,
                    height: 30,
                    borderWidth: 0.5,
                    borderColor: '#ddd',
                    borderRadius: 100,
                    marginRight: 2,
                    marginTop: 'auto',
                  }}
                  source={{ uri: image }}
                />
              ) : (
                // <Text>{image}</Text>
                <Image
                  resizeMode="cover"
                  style={{
                    width: 30,
                    height: 30,
                    marginTop: 'auto',
                  }}
                  source={require('../images/myaccount2.png')}
                />
              )
            ) : (
              ''
            )}

            {item.isPicture ? (
              <Pressable onPress={toggleModal}>
                <Image
                  resizeMode="cover"
                  // style={[styles.mavatar, { marginTop: 'auto' }]}
                  source={{ uri: mediaImage }}
                  width={300}
                  height={300}
                  style={{ borderRadius: 30 }}
                />
              </Pressable>
            ) : (
              <View
                style={
                  status
                    ? [styles.mmessage, { borderBottomRightRadius: 10 }]
                    : [
                      styles.mmessage,
                      {
                        backgroundColor: '#1F2067',
                        borderBottomLeftRadius: 10,
                      },
                    ]
                }>
                {status && item.title ? (
                  <Text
                    style={{
                      color: '#1F2067',
                      marginBottom: 5,
                      fontWeight: '500',
                      fontSize: 14,
                    }}>
                    {item.title}
                  </Text>
                ) : (
                  ''
                )}
                <Text style={status ? [{ color: '#000' }] : [{ color: '#FFF' }]}>
                  {item.message}
                </Text>
                <Text
                  style={
                    status
                      ? [
                        {
                          position: 'absolute',
                          bottom: 0,
                          right: 7,
                          fontSize: 10,
                          fontWeight: '400',
                          color: '#1F2067',
                        },
                      ]
                      : [
                        {
                          position: 'absolute',
                          bottom: 0,
                          right: 7,
                          fontSize: 10,
                          fontWeight: '400',
                          color: '#fff',
                        },
                      ]
                  }>
                  {hour + ':' + mins}
                </Text>
              </View>
            )}

            {status ? (
              ''
            ) : (
              <View
                style={{
                  marginTop: 'auto',
                  alignItems: 'center',
                  marginHorizontal: 3,
                }}>
                {item.seen ? (
                  <Image
                    resizeMode="contain"
                    style={{
                      display: 'flex',
                      marginTop: 'auto',
                    }}
                    source={require('../images/seen.png')}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    style={{
                      display: 'flex',
                      marginTop: 'auto',
                    }}
                    source={require('../images/delivered.png')}
                  />
                )}
              </View>
            )}
          </View>
        </View>
        <ImageModal
          visible={isModalVisible}
          profileImage={{ uri: mediaImage }}
          onClose={toggleModal}
        />
      </View>
    </TouchableOpacity>
  );
}

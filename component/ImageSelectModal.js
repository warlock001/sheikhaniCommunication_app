import React from 'react';
import {Modal, View, Text, Image, Pressable} from 'react-native';

const ImageSelectModal = ({visible, onClose, chooseImage, sendData, image}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View
        style={{
          padding: '5%',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          height: '100%',
        }}>
        <Text
          style={{
            fontSize: 19,
            marginBottom: '10%',
            fontWeight: '600',
            color: '#fff',
            fontFamily: 'Pacifico-Regular',
            textAlign: 'center',
          }}>
          Sheikhani Group Communication
        </Text>
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            marginBottom: '10%',
            color: '#000',
            textAlign: 'center',
          }}>
          Please select your Profile Picture
        </Text> */}
        {/* Add a preview of the selected image here */}
        {image ? (
          <Image
            resizeMode="contain"
            style={{
              width: 150,
              height: 150,
              borderRadius: 200,
              resizeMode: 'contain',
            }}
            source={{uri: image.uri}}
          />
        ) : (
          <Text
            style={{
              textAlignVertical: 'center',
              textAlign: 'center',
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#000',
              width: 150,
              height: 150,
              borderRadius: 200,
            }}>
            Please select a picture for preview
          </Text>
        )}

        {/* Button to choose an image */}
        <Pressable onPress={chooseImage}>
          <Text
            style={{
              paddingVertical: '5%',
              textAlign: 'center',
              paddingHorizontal: '10%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: '10%',
              backgroundColor: '#1F2067',
              borderRadius: 10,
              color: '#FFF',
              fontSize: 16,
              fontWeight: '500',
              marginLeft: 10,
            }}>
            Select Profile Picture
          </Text>
        </Pressable>

        {/* Button to upload the selected image */}
        <Pressable onPress={sendData}>
          <Text
            style={{
              paddingVertical: '5%',
              textAlign: 'center',
              paddingHorizontal: '10%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: '10%',
              backgroundColor: '#00BD57',
              borderRadius: 10,
              color: '#000',
              fontSize: 16,
              fontWeight: '500',
              marginLeft: 10,
            }}>
            Upload Profile Picture
          </Text>
        </Pressable>

        {/* Button to close the modal */}
        <Pressable onPress={onClose}>
          <Text
            style={{
              paddingVertical: '5%',
              textAlign: 'center',
              paddingHorizontal: '10%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: '40%',
              backgroundColor: '#FAE6E7',
              borderRadius: 10,
              color: 'red',
              fontSize: 16,
              fontWeight: '500',
              marginLeft: 10,
            }}>
            Close
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ImageSelectModal;

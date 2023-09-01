import React from 'react';
import {View, Modal, Image, StyleSheet} from 'react-native';

const ProfileImageModal = ({visible, onClose, profileImage}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <Image
          resizeMode="contain"
          source={profileImage}
          style={styles.image}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  image: {
    width: '80%',
    height: '80%',
  },
});

export default ProfileImageModal;

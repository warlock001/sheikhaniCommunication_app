import React from 'react';
import {
  Modal,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ImageModal = ({visible, profileImage, onClose}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <Image
          source={profileImage}
          style={styles.profileImage}
          resizeMode="contain"
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fff',
  },
  profileImage: {
    width: '80%',
    height: '80%',
  },
});

export default ImageModal;

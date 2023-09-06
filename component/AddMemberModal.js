import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Modal = ({ setVisible }) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState("");

  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem('@id');
    await axios.post("http://192.168.0.100:3001/group", {
      title: groupName,
      id: id
    }).then((res) => {
      setGroupName('')
      Alert.alert("", "Group Created Successfully")
    }).catch(err => {
      console.log(err)
    })
    closeModal();
  };


  function Item({ props }) {
    const [image, setImage] = useState(false);

    useLayoutEffect(() => {
      async function getImage() {
        axios
          .get(
            `http://192.168.0.100:3001/files/${props.profilePicture[0]}/true`,
          )
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
    return (
      <TouchableOpacity
        onPress={() => {
          handleNavigation(props.id, props.title);
        }}>
        <View style={style.item}>
          {image ? (
            <Image
              resizeMode="cover"
              style={[styles.mavatar, { marginTop: 'auto' }]}
              source={{ uri: image }}
              width={30}
            />
          ) : (
            ''
          )}
          <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.modalContainer, { left: 0 }]}>
      <Text style={styles.modalsubheading}>Search by name</Text>
      <TextInput
        style={styles.modalinput}
        placeholder="User name"
        value={groupName}
        onChangeText={(value) => setGroupName(value)}
      />
      <View style={styles.modalbuttonContainer}>
        <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>
        <Pressable
          style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
          onPress={closeModal}
        >
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;

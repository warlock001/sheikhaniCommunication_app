import { View, Text, TextInput, Pressable, Alert, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import socket from "../utils/socket";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const Modal = ({ setVisible, roomid }) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState("");
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const handleCreateRoom = async () => {
    const id = await AsyncStorage.getItem('@id');
    await axios.post("http://52.53.197.201:3001/group", {
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


  useEffect(() => {
    async function getUsers() {
      const department = await AsyncStorage.getItem('@department');
      const id = await AsyncStorage.getItem('@id');
      console.log("ye3h raaha")
      axios
        .get(
          `http://52.53.197.201:3001/user?department=${department}&query=${search}&id=${id}`,
        )
        .then(res => {
          console.log("ye3h raaha dataaaaaaaaaaaaaaa", res.data)
          setSearchedUsers(res.data.user);
        });
    }

    getUsers();
  }, [search]);

  async function handleAdd(id) {
    console.log(id)
    await axios.post("http://52.53.197.201:3001/groupMember", {
      id: id,
      roomid: roomid
    }).then(response => {
      Alert.alert("", "User Added To Group")
    }).catch(err => {
      console.log(err)
    })
  }

  function Item({ props }) {
    const [image, setImage] = useState(false);
    useLayoutEffect(() => {
      async function getImage() {
        axios
          .get(
            `http://52.53.197.201:3001/files/${props.profilePicture[0]}/true`,
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
          handleAdd(props.id);
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
      <View
        style={[
          styles.optionBox,
          { display: searchedUsersVisible ? 'flex' : 'none' },
        ]}>

        {/* <Text style={{ marginBottom: 10 }}>Search Users</Text> */}
        <FlatList
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          data={searchedUsers}
          renderItem={({ item }) => (
            <Item
              props={{
                title: item.firstName,
                id: item._id,
                profilePicture: item.profilePicture,
              }}
            />
          )}
          keyExtractor={item => item._id}
        />
      </View>
      <View style={[styles.modalbuttonContainer, { justifyContent: 'center' }]}>

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

const style = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 5,
  },
});

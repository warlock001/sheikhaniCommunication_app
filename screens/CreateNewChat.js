import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  View,
  KeyboardAvoidingView,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useLayoutEffect, useEffect} from 'react';
import {TextInput} from 'react-native-paper';
import TextField from '../component/inputField';
import {styles} from '../utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const CreateNewChat = ({navigation}) => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedUsersVisible, setSearchedUsersVisible] = useState(false);
  const [search, setSearch] = useState('');
  const handleNavigation = (id, name) => {
    navigation.navigate('DirectMessaging', {
      id: id,
      name: name,
    });
  };

  useEffect(() => {
    async function getUsers() {
      const department = await AsyncStorage.getItem('@department');
      const id = await AsyncStorage.getItem('@id');
      axios
        .get(
          `http://192.168.0.104:3001/user?department=${department}&query=${search}&id=${id}`,
        )
        .then(res => {
          console.log('userssssssss', res.data.user);
          setSearchedUsers(res.data.user);
        })
        .catch(err => {
          console.log('Error featching users', err);
        });
    }

    getUsers();
  }, [search]);

  function Item({props}) {
    const [image, setImage] = useState(false);

    useLayoutEffect(() => {
      async function getImage() {
        await axios
          .get(
            `http://192.168.0.104:3001/files/${props.profilePicture[0]}/true`,
          )
          .then(image => {
            setImage(
              `data:${image.headers['content-type']};base64,${image.data}`,
            );
          })
          .catch(err => {
            console.log('error in getting user image', err);
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
          {image != '' ? (
            <Image
              resizeMode="cover"
              style={[styles.mavatar, {marginTop: 'auto'}]}
              source={{uri: image}}
              width={30}
            />
          ) : (
            <Image
              resizeMode="cover"
              style={[styles.mavatar, {marginTop: 'auto'}]}
              source={require('../images/myaccount.png')}
              width={30}
            />
          )}
          <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold'}}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableWithoutFeedback accessible={false}>
      <SafeAreaView style={styles.chatscreen}>
        <View style={{marginTop: 13}}>
          <KeyboardAvoidingView>
            <TextField
              onFocus={() => {
                setSearchedUsersVisible(true);
              }}
              onBlur={() => setSearchedUsersVisible(false)}
              style={{marginBottom: 5, color: '#000'}}
              label="Search by name"
              onChangeText={text => {
                setSearch(text);
              }}
              right={
                <TextInput.Icon
                  name={() =>
                    searchedUsersVisible ? (
                      <Pressable onPress={Keyboard.dismiss}>
                        <Image
                          resizeMode="contain"
                          style={{width: 25}}
                          source={require('../images/close.png')}
                        />
                      </Pressable>
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{width: 25}}
                        source={require('../images/search.png')}
                      />
                    )
                  }
                />
              }
            />
          </KeyboardAvoidingView>
          <View style={[styles.optionBox, {display: 'flex'}]}>
            <Text style={{marginBottom: 10}}>
              Search users in your department
            </Text>
            {searchedUsers ? (
              <FlatList
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                data={searchedUsers}
                renderItem={({item}) => (
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
            ) : (
              <View>
                <Text>NO Users Found</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateNewChat;

const style = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 5,
  },
});

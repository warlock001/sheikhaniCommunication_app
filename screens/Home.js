import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Modal from '../component/GroupCreatingModal';
import {TextInput} from 'react-native-paper';
import TextField from '../component/inputField';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import {styles} from '../utils/styles';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [rooms, setRooms] = useState([]);

  useLayoutEffect(() => {
    function fetchGroups() {
      fetch('http://192.168.0.101:4000/api')
        .then(res => res.json())
        .then(data => setRooms(data))
        .catch(err => console.error(err));
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    socket.on('roomsList', rooms => {
      setRooms(rooms);
    });
  }, [socket]);

  const handleCreateGroup = () => setVisible(true);

  return (
    <SafeAreaView style={styles.chatscreen}>
      {/* <View style={styles.chattopContainer}>
                <View style={styles.chatheader}>
                    <Text style={styles.chatheading}>Chats</Text>
                    <Pressable onPress={handleCreateGroup}>
                        <Feather name='edit' size={24} color='green' />
                    </Pressable>
                </View>
            </View> */}

      <View>
        <Text style={styles.pageHeading}>Welcome to your workspace</Text>
        <Text style={styles.pageSubHeading}>
          Chats moved to workspace are snoozed after your work hours.
          <Text style={{fontWeight: '600'}}>Manage work hours</Text>
        </Text>
      </View>
      <View style={{marginTop: 13}}>
        <TextField
          style={{marginBottom: 5}}
          label="Search by name"
          onChangeText={text => {
            setPassword(text);
          }}
          right={
            <TextInput.Icon
              name={() => (
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: 25}}
                    source={require('../images/filter.png')}
                  />
                </TouchableOpacity>
              )}
            />
          }
        />
      </View>

      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => <ChatComponent item={item} />}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No rooms created!</Text>
            <Text>Click the icon above to create a Chat room</Text>
          </View>
        )}
      </View>
      {visible ? <Modal setVisible={setVisible} /> : ''}
    </SafeAreaView>
  );
};

export default Home;

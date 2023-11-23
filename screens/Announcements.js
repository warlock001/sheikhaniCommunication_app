import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  Image,
  Touchable,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native'; // Import the navigation hook
import Modal from '../component/GroupCreatingModal';
import ChatComponent from '../component/ChatComponent';
import socket from '../utils/socket';
import {styles} from '../utils/styles';
import {TextInput} from 'react-native-paper';
import TextField from '../component/inputField';
import axios from 'axios';
import {
  CommonActions,
  NavigationContainer,
  useFocusEffect,
} from '@react-navigation/native';

const Announcements = () => {
  const navigation = useNavigation();

  const [allAnnouncements, setAllAnnouncements] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchAnnouncements() {
        await axios
          .get(`https://api.sheikhanigroup.com/announcement`)
          .then(res => {
            setAllAnnouncements(res.data.announcemnet);
          })
          .catch(err => {
            setAllAnnouncements([]);
          });
      }

      fetchAnnouncements();
    }, []),
  );

  const AnnouncementComponent = ({id, title, description, date, user}) => {
    function formatDate(isoDateString) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const date = new Date(isoDateString);

      const day = date.getUTCDate();
      const monthName = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();

      return `${day} ${monthName} ${year}`;
    }

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('AnnouncementPreview', {
            id: id,
            title: title,
            description: description,
            date: date,
            user: user,
          })
        }
        style={{
          backgroundColor: '#F5F7F9',
          flexDirection: 'row',
          marginBottom: 20,
          padding: 16,
          borderRadius: 10,
        }}>
        <View>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 22,
              fontWeight: '700',
              color: '#000000',
            }}>
            {title}
          </Text>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#8f8f8f'}}>
            Published by: {user.firstName} {user.lastName} (Admin)
          </Text>
          <Text style={{fontSize: 14, fontWeight: '400', color: '#8f8f8f'}}>
            {formatDate(date)}
          </Text>
        </View>
        <View style={{position: 'absolute', right: '5%', top: '60%'}}>
          <Image
            resizeMode="contain"
            style={{width: 9, height: 15, marginRight: 5}}
            source={require('../images/chevron_right.png')}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFF',
        flex: 1,
        padding: 10,
        position: 'relative',
      }}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={{padding: 10}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                color: '#8f8f8f',
                marginBottom: 10,
              }}>
              All company announcements will display here
            </Text>

            {Array.isArray(allAnnouncements) && allAnnouncements.length > 0 ? (
              <FlatList
                extraData={allAnnouncements}
                data={allAnnouncements}
                renderItem={({item}) => (
                  <AnnouncementComponent
                    id={item._id}
                    title={item.title}
                    description={item.description}
                    date={item.createdAt}
                    user={item.user}
                  />
                )}
                keyExtractor={item => item.user}
              />
            ) : (
              <View style={styles.chatemptyContainer}>
                <Text style={styles.chatemptyText}>
                  No Announcements To View
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Announcements;

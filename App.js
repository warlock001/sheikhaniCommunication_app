import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
} from 'react-native';
//👇🏻 app screens
import Login from './screens/Login';
import Messaging from './screens/Messaging';
import Chat from './screens/Chat';
import OnBoarding from './screens/onBoarding';
import AccountSettings from './screens/AccountSettings';
import AnnouncementPreview from './screens/AnnouncementPreview';
import GroupChatDetails from './screens/GroupChatDetails';
//👇🏻 React Navigation configurations
import {
  CommonActions,
  NavigationContainer,
  useFocusEffect,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//👇🏻 React libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './utils/styles';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Announcements from './screens/Announcements';
import SplashScreen from 'react-native-splash-screen';
import SplashScreenComponent from './component/SplashScreenComponent';
import DirectMessages from './screens/DirectMessagesScreen';
import DirectMessagesScreen from './screens/DirectMessagesScreen';
import DirectMessaging from './screens/DirectMessaging';
import GroupMessagesScreen from './screens/GroupMessagesScreen';
import GroupMessaging from './screens/GroupMessaging';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  console.log(descriptors);
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {isFocused ? (
              <Image
                resizeMode="contain"
                style={{width: 25}}
                source={
                  label == 'Workspace'
                    ? require('./images/workspace.png')
                    : label == 'Groups'
                    ? require('./images/groups.png')
                    : label == 'Chats'
                    ? require('./images/chats.png')
                    : require('./images/account_circle.png')
                }
              />
            ) : (
              <Image
                resizeMode="contain"
                style={{width: 25}}
                source={
                  label == 'Workspace'
                    ? require('./images/workspace_inactive.png')
                    : label == 'Groups'
                    ? require('./images/groups_inactive.png')
                    : label == 'Chats'
                    ? require('./images/chats_inactive.png')
                    : require('./images/myaccount_inactive.png')
                }
              />
            )}
            <Text
              style={[
                style.bottonTabText,
                {color: isFocused ? '#1f2067' : '#222'},
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      options={{headerShown: false}}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Workspace"
        component={Chat}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Groups"
        component={GroupMessagesScreen}
        options={{headerShown: false}}
      />
      {/* <Tab.Screen name="Groups" component={Chat} /> */}
      <Tab.Screen
        name="Chats"
        component={DirectMessagesScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="My Account"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [appInit, setAppInit] = useState(false); // Initialize appInit state

  useEffect(() => {
    func = async () => {
      const jwt = await AsyncStorage.getItem('@jwt');
      const role = await AsyncStorage.getItem('@role');
      if (jwt !== null) {
        setLoggedIn(true);
        setUserRole(role);
      } else {
        setLoggedIn(false);
        setAppInit(true);
      }
    };
    func();
  }, []);

  useEffect(() => {
    async function prepareApp() {
      if (appInit) {
        // Prevent the splash screen from automatically hiding
        await SplashScreen.preventAutoHideAsync();

        // Simulate some loading time before displaying the main app
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds

        // Hide the splash screen and display the main app
        SplashScreen.hideAsync();
      }
    }
    prepareApp();
  }, [appInit]); // Run this effect when appInit changes

  function HomeStack({route, navigation}) {
    const {shouldRedirect, UserRole} = route.params;
    useEffect(() => {
      console.log(UserRole);
      if (shouldRedirect === true) {
        navigation.navigate({name: 'OnBoarding1', merge: true});
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'OnBoarding1'}],
          }),
        );
      } else if (UserRole == 'rescuer') {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'RescueCenter'}],
          }),
        );
      } else if (UserRole == 'client') {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Home'}],
          }),
        );
      }
    }, [shouldRedirect]);
  }

  const [appReady, setAppReady] = useState(false);

  const handleSplashEnd = () => {
    setAppReady(true);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {appReady ? (
          <Stack.Navigator>
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messaging"
              component={Messaging}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="Announcements"
              component={Announcements}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="AnnouncementPreview"
              component={AnnouncementPreview}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettings}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="DirectMessaging"
              component={DirectMessaging}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="GroupMessaging"
              component={GroupMessaging}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="GroupChatDetails"
              component={GroupChatDetails}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        ) : (
          <SplashScreenComponent
            name="Splash"
            component={SplashScreenComponent}
            options={{headerShown: false}}
            onSplashEnd={handleSplashEnd}
          />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const style = StyleSheet.create({
  bottonTabText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    color: '#1f2067',
  },
  sectionContainer: {
    color: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    padding: 24,

    paddingBottom: 215,
  },
  gradientStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  subTitleStyle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    width: '100%',
    textAlign: 'center',
  },
  titleStyle: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
    textAlign: 'center',
  },
  SignupButtonStyle: {
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#1F2067',
    marginTop: 26,
    marginBottom: 40,
    bottom: 65,
    position: 'absolute',
  },

  buttonStyle: {
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#191919',
    marginTop: 26,
    marginBottom: 40,
    bottom: 0,
    position: 'absolute',
  },
});

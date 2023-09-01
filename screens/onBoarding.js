import {
  ImageBackground,
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
const {width: PAGE_WIDTH, height: PAGE_HEIGHT} = Dimensions.get('window');

export default function OnBoarding({navigation}) {
  const swiper = useRef(null);

  return (
    <View style={{height: '100%'}}>
      <Swiper
        ref={swiper}
        style={{height: '100%'}}
        loop={false}
        dot={
          <View
            style={{
              backgroundColor: 'rgba(172 ,172 , 176 , 0.35)',
              width: 60,
              height: 5,
              borderRadius: 20,
              marginBottom: 165,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
        }
        scrollEnabled={true}
        activeDot={
          <View
            style={{
              backgroundColor: '#FFF',
              width: 60,
              height: 5,
              borderRadius: 20,
              marginBottom: 165,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
        }>
        <View>
          <ImageBackground
            source={require('../images/onboarding1.png')}
            style={{width: '100%', height: '100%'}}>
            <LinearGradient
              colors={['#00000000', '#000000']}
              style={styles.gradientStyle}
              start={{x: 0.5, y: 0.2}}
              end={{x: 0.5, y: 0.8}}
            />
            <View style={styles.sectionContainer}>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  color: '#fff',
                  fontSize: 26,
                  fontFamily: 'Pacifico-Regular',
                }}>
                Sheikhani Group Communication
              </Text>
              <View
                style={{
                  color: '#000',
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  width: '100%',
                  height: '100%',
                  // padding: 24,
                }}>
                <Text style={styles.subTitleStyle}>
                  Get started in only a couple minutes
                </Text>
                <Text style={styles.titleStyle}>
                  SIGN IN TO ACCESS YOUR ACCOUNT
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View>
          <ImageBackground
            resizeMode={'cover'}
            source={require('../images/onboarding2.png')}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}>
            <LinearGradient
              colors={['#00000000', '#000000']}
              style={styles.gradientStyle}
              start={{x: 0.5, y: 0.2}}
              end={{x: 0.5, y: 1}}
            />
            <View style={styles.sectionContainer}>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  color: '#fff',
                  fontSize: 26,
                  fontFamily: 'Pacifico-Regular',
                }}>
                Sheikhani Group Communication
              </Text>
              <View
                style={{
                  color: '#000',
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  width: '100%',
                  height: '100%',
                  // padding: 24,
                }}>
                <Text style={styles.titleStyle}>CONNECT</Text>
                <Text style={styles.titleStyle}>WITH YOUR</Text>
                <Text style={styles.titleStyle}>WORKSPACE</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View>
          <ImageBackground
            resizeMode={'cover'}
            source={require('../images/onboarding3.png')}
            style={{width: '100%', height: '100%'}}>
            <LinearGradient
              colors={['#CF333900', '#CF3339']}
              style={styles.gradientStyle}
              start={{x: 0.5, y: 0.2}}
              end={{x: 0.5, y: 1}}
            />
            <View style={styles.sectionContainer}>
              <Text
                style={{
                  fontFamily: 'Roboto',
                  color: '#fff',
                  fontSize: 26,
                  fontFamily: 'Pacifico-Regular',
                }}>
                Sheikhani Group Communication
              </Text>
              <View
                style={{
                  color: '#000',
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  width: '100%',
                  height: '100%',
                  // padding: 24,
                }}>
                <Text style={styles.titleStyle}>CHAT</Text>
                <Text style={styles.titleStyle}>WITH YOUR</Text>
                <Text style={styles.titleStyle}>COLLEAGUES</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Swiper>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFF'}}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.SignupButtonStyle}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#FFF'}}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    color: '#000',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

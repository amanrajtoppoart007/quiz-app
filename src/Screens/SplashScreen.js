import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
const image = require('../Assets/bg/sp1.jpg');
const { height, width } = Dimensions.get('screen');
import * as Animatable from 'react-native-animatable';
import { baseUrl, fontStyle } from '../Constant';
import { getData } from '../AsyncStorage';
import axios from 'axios';
import { connect } from 'react-redux';
import { increaseBurgerAction } from '../Reducer/DataAction'

const SplashScreen = ({ navigation, addDatatoStore, numberOfBurger }) => {
  useEffect(() => {
    getuserinfor();
    // setTimeout(() => {
    //   navigation.navigate('Login');
    // }, 2500);
  }, []);

  const getuserinfor = async () => {
    const getToken = await getData('token');
    console.log(getToken)
    if (getToken) {
      var Token = getToken.data;
      axios
        .get(`${baseUrl}user`, {
          headers: {
            Authorization: 'Bearer ' + Token
          }
        })
        .then(response => {
          // If request is good...
          console.log("Working or not")
          addDatatoStore(response.data)
          console.log('DatToStore', response.data)
          navigation.navigate('Sidebar')
        })
        .catch(error => {
          console.log('error ' + error);
        });
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.InnerWork}>
          <Animatable.Image
            animation={'slideInDown'}
            duration={2000}
            style={styles.tinyLogo}
            source={require('../Assets/logo/app_logo.png')}
          />
          <Animatable.View
            animation={'slideInUp'}
            duration={2000}
            style={{ alignItems: 'center' }}>
            <Text style={styles.lgtext}>Samyur</Text>
            {/*<Text style={styles.smtext}>Solve {`&`} Evolves</Text> */}
          </Animatable.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  InnerWork: {
    height: height / 1.8,
    justifyContent: 'center',
    alignItems: 'center',
    top: -50,
    position: 'relative',
  },
  tinyLogo: {
    width: 140,
    height: 140,
  },
  lgtext: {
    fontFamily: fontStyle.MardenBold,
    fontSize: 70,
    color: '#fff',
  },
  smtext: {
    fontFamily: fontStyle.MardenBold,
    fontSize: 25,
    color: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {
    numberOfBurger: state.UserData
  }
}


const mapDispatchToProps = (dispatch) => {

  return {
    addDatatoStore: (parameter) => { dispatch(increaseBurgerAction([parameter])) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Alert, Platform,
} from 'react-native';
const logoImg = require('../../Assets/imgs/reg21.jpg');
import { Title, Button } from 'react-native-paper';
import axios from 'axios';
import { baseUrl } from '../../Constant';
import CustomInput from '../../Components/CustomInput';
import ProgressLoader from 'rn-progress-loader';
import auth from '@react-native-firebase/auth';
import { getData, storeData } from '../../AsyncStorage';
import PushNotification from 'react-native-push-notification';
import { connect } from 'react-redux';
import { increaseBurgerAction } from '../../Reducer/DataAction';
import { useIsFocused } from "@react-navigation/native";
const Login = ({ navigation, addDatatoStore }) => {
  const isFocused = useIsFocused();
  const [number, setNumber] = useState(null);
  const [borderC, setBorderC] = useState({ numberBorder: "grey", otpBorder: "grey" })
  const [useOtp, setUserOtp] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(60);
  const [timer, setTimer] = useState(false);
  const [notificationToken, setNotificationToken] = useState(null);
  const [ShowError, setShowError] = useState({});
  const [debug, setDebug] = useState(null);
  useEffect(() => {
    if (timer && counter >= 1) {
      const timer = setInterval(() => setCounter(counter => counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, timer]);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const getToken = await getData('notificationToken');
        if (getToken.status) {
          setNotificationToken(getToken.data)
        }
      })();
    }
  }, [isFocused]);

  async function signInWithPhoneNumber() {
    setVisible(true);
    if (number == null || number === "") {
      setShowError({ ...ShowError, number: 'Please Enter Mobile Number' })
      setBorderC({ ...borderC, numberBorder: 'red' })
      setVisible(false);
      return;
    }
    setTimer(true);
    const confirmation = await auth().signInWithPhoneNumber('+91' + number); 
    setConfirm(confirmation);
    auth().onAuthStateChanged(user => {
      if (user) {
        RunLoginFun();
      } else {
        // reset state if you need to
        console.log('Checking nothing');
      }
    });
    setVisible(false);
  }

  const RunLoginFun = async () => {
    setDebug('step 2'); 
    const getToken = await getData('notificationToken');
    axios.post(`${baseUrl}login`, {
        mobile_no: number,
        // notification_token: notificationToken,
        notification_token: getToken.data,
      }).then(async function (response) {
        console.log(response,'getToken');
        console.log("here is api response");
        console.log(response.data);
        addDatatoStore(response.data);
        setDebug('step 3');
        if (response.data.status) {
          const sending = await storeData('token', response.data.token);
          console.log(sending);
          setDebug('step 4');
          if (sending.status) {
            // Alert.alert('Success');
            navigation.navigate('Sidebar');
          }
        } else {
          Alert.alert('OOps', response?.data?.msg?.toString());
        }
      })
      .catch(function (error) {
        console.log(error,'getToken');
        setDebug('step 5');
        Alert.alert(error?.message?.toString());
      });
    setVisible(false);
    setNumber(null);
    setUserOtp(null);
    setTimer(false);
  };

  async function confirmCode() {
    if (useOtp == null || useOtp === "") {
      setShowError({ ...ShowError, otp: 'Please Enter Otp Here' })
      setBorderC({ ...borderC, otpBorder: 'red' })
      setVisible(false);
      return;
    }
    setVisible(true);
    try {
      await confirm.confirm(useOtp);
      setDebug('step 1');
      await RunLoginFun();
    } catch (error) {
      setVisible(false);
      Alert.alert('Oops', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.designContainer}>
          <Image
            source={logoImg}
            style={{ height: 150, width: 200, marginBottom: 50 }}
          />
          <Title style={{ fontSize: 30, fontWeight: 'bold' }}>
            Welcome Back!
          </Title>
          <Text>Login to your existing account of Samyur</Text>
        </View>
        <View style={{ marginHorizontal: 10 }}>
          <CustomInput
            placeholder={'Enter Mobile Number'}
            keyboardType="numeric"
            outterstyle={{ marginBottom: 15, borderColor: borderC.numberBorder }}
            verify={true}
            onFocus={() => { setShowError({ ...ShowError, number: "" }); setBorderC({ ...borderC, numberBorder: 'grey' }) }}
            iconname={'cellphone'}
            onPress={() => signInWithPhoneNumber()}
            value={number}
            Errormsg={ShowError.number}
            onChangeText={text => setNumber(text)}
          />
          <CustomInput
            placeholder={'Enter OTP'}
            keyboardType="numeric"
            outterstyle={{ marginBottom: 15, borderColor: borderC.otpBorder }}
            onFocus={() => { setShowError({ ...ShowError, otp: "" }); setBorderC({ ...borderC, otpBorder: 'grey' }) }}
            iconname={'cellphone-message'}
            value={useOtp}
            Errormsg={ShowError.otp}
            onChangeText={text => setUserOtp(text)}
          />
        </View>
        {timer ? <View style={styles.timerStyle}>
          <Text style={{ fontSize: 20 }}>00:{counter} Sec</Text>
        </View> : <View />}
        <TouchableOpacity
          onPress={() => confirmCode()}
          style={{ marginTop: 20, alignSelf: 'center', flexDirection: 'row' }}>
          <Button
            mode="contained"
            uppercase={true}
            contentStyle={{}}
            color="#1EB0EB"
            labelStyle={{ color: '#fff' }}
            style={styles.loginBtn}>
            Login
          </Button>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {/* <Text>{debug}</Text> */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.bottomWork}>
        <Text style={{ color: 'grey', fontSize: 15, fontWeight: 'bold' }}>
          Don't have an account?{' '}
        </Text>
        <Text style={{ color: '#1EB0EB', fontSize: 15, fontWeight: 'bold' }}>
          SignUp
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  designContainer: {
    // borderWidth: 2,
    borderColor: 'black',
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  loginBtn: {
    width: '45%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  timerStyle: {
    marginTop: 20,
    alignItems: 'center',
  },
  bottomWork: {
    position: 'relative',
    bottom: -50,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => {
  return {
    numberOfBurger: state.UserData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addDatatoStore: parameter => {
      dispatch(increaseBurgerAction([parameter]));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

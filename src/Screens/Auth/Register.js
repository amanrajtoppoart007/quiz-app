import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
const Backbtn = require('../../Assets/imgs/back.png');
import {Title, Button} from 'react-native-paper';
import axios from 'axios';
import {baseUrl} from '../../Constant';
import CustomInput from '../../Components/CustomInput';
import ProgressLoader from 'rn-progress-loader';
import {increaseBurgerAction} from '../../Reducer/DataAction';
import PushNotification from 'react-native-push-notification';
import {storeData} from '../../AsyncStorage';
import {connect} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('screen');

const Register = ({navigation, addDatatoStore}) => {
  const [borderon1, setborderon1] = useState('grey');
  const [borderon2, setborderon2] = useState('grey');
  const [borderon3, setborderon3] = useState('grey');
  const [userdata, setuserdata] = useState({});
  const [useOtp, setuserotp] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ShowError, setShowError] = useState({});
  const [notify, setnotify] = useState(null);

  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token) {
        setnotify(token.token);
      },
    });
  }, []);

  const RegisterNewUser = () => {
    console.log('Checl', userdata.email);
    if (userdata.name == undefined || userdata.name == '') {
      setborderon1('red');
      setShowError({
        name: 'Please Enter Your Name',
      });
      return;
    }
    if (userdata.email == undefined || userdata.email == '') {
      setborderon2('red');
      setShowError({
        email: 'Please Enter Your Email',
      });
      return;
    }
    if (userdata.number == undefined || userdata.number == '') {
      setborderon3('red');
      setShowError({
        number: 'Please Enter Mobile Number',
      });
      return;
    }
    setVisible(true);
    axios
      .post(`${baseUrl}register`, {
        name: userdata.name,
        email: userdata.email,
        mobile_no: userdata.number,
        notification_token: notify,
      })
      .then(async function (response) {
        if (response.data.status) {
          addDatatoStore(response.data);
          const sending = await storeData('token', response.data.token);
          console.log(sending);
          Alert.alert('Hurrey!!!', 'Registration Successfull', [
            {
              text: 'Go Home',
              onPress: () => navigation.navigate('Sidebar'),
            },
          ]);
          setVisible(false);
        } else {
          setVisible(false);
          Alert.alert('Oops', response.data.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    setVisible(false);
    setuserdata({});
    setuserotp(null);
  };

  async function signInWithPhoneNumber() {
    if (userdata.number == undefined || userdata.number == '') {
      setborderon3('red');
      setShowError({...ShowError, number: 'Please Enter Mobile Number'});
      return;
    }
    setVisible(true);
    const confirmation = await auth().signInWithPhoneNumber(
      '+91' + userdata.number,
    );
    setConfirm(confirmation);
    auth().onAuthStateChanged(user => {
      if (user) {
        RegisterNewUser();
      } else {
        // reset state if you need to
        console.log('Checking nothing');
      }
    });
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }

  async function confirmCode() {
    if (useOtp == null || useOtp == '') {
      setborderon3('red');
      setShowError({...ShowError, otp: 'Enter OTP Here'});
      return;
    }
    setVisible(true);
    try {
      await confirm.confirm(useOtp);
      Alert.alert('Sucess', "Mobile Number Verified,Click on 'Register'");
      setVisible(false);
    } catch (error) {
      setVisible(false);
      Alert.alert('Invalid code.', error.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.designcontainer}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}>
            <Image
              source={Backbtn}
              style={{height: 25, width: 25, marginBottom: 50}}
            />
          </TouchableWithoutFeedback>
          <Title
            style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>
            Let's Get Started!
          </Title>
          <Text style={{textAlign: 'center'}}>
            Please Login to your existing account of Samyur
          </Text>
          <View style={{marginTop: 40}}>
            <CustomInput
              placeholder={'Enter Full Name'}
              outterstyle={{marginBottom: 15, borderColor: borderon1}}
              onFocus={() => {
                setborderon1('#1EB0EB'), setShowError({...ShowError, name: ''});
              }}
              onBlur={() => setborderon1('grey')}
              iconname="account"
              value={userdata.name}
              Errormsg={ShowError.name}
              onChangeText={text => setuserdata({...userdata, name: text})}
            />
            <CustomInput
              placeholder={'Enter Email'}
              outterstyle={{marginBottom: 15, borderColor: borderon2}}
              onFocus={() => {
                setborderon2('#1EB0EB'),
                  setShowError({...ShowError, email: ''});
              }}
              onBlur={() => setborderon2('grey')}
              iconname="email"
              value={userdata.email}
              Errormsg={ShowError.email}
              onChangeText={text => setuserdata({...userdata, email: text})}
              keyboardType="email-address"
            />

            <CustomInput
              placeholder={'Enter Mobile Number'}
              outterstyle={{marginBottom: 15, borderColor: borderon3}}
              onFocus={() => {
                setborderon3('#1EB0EB'),
                  setShowError({...ShowError, number: ''});
              }}
              onBlur={() => setborderon3('grey')}
              iconname={'cellphone'}
              value={userdata.number}
              verify={true}
              verifytxt={'Send Otp'}
              Errormsg={ShowError.number}
              onPress={() => signInWithPhoneNumber()}
              onChangeText={text => setuserdata({...userdata, number: text})}
              keyboardType="numeric"
            />
            <CustomInput
              placeholder={'Enter Otp'}
              outterstyle={{marginBottom: 15, borderColor: borderon3}}
              onFocus={() => {
                setborderon3('#1EB0EB'), setShowError({...ShowError, otp: ''});
              }}
              onBlur={() => setborderon3('grey')}
              iconname={'cellphone-message'}
              verify={true}
              onPress={() => confirmCode()}
              value={useOtp}
              Errormsg={ShowError.otp}
              onChangeText={text => setuserotp(text)}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            onPress={() => RegisterNewUser()}
            style={{marginTop: 20, alignSelf: 'center', flexDirection: 'row'}}>
            <Button
              mode="contained"
              uppercase={true}
              color="#1EB0EB"
              labelStyle={{color: '#fff'}}
              style={styles.rgtrbtn}>
              Register
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.bottomwork}>
            <Text style={{color: 'grey', fontSize: 15, fontWeight: 'bold'}}>
              Already Have account?{' '}
            </Text>
            <Text style={{color: '#1EB0EB', fontSize: 15, fontWeight: 'bold'}}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  designcontainer: {
    flex:1,
   // borderWidth: 2,
    borderColor: 'black',
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
   // height:height
  },
  rgtrbtn: {
    width: '45%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  bottomwork: {
    position: 'relative',
    bottom: 0,
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);

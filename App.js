import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {NavigationContainer, DarkTheme, DefaultTheme as NavigationDefaultTheme,} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme
} from 'react-native-paper';
//Screens
import SplashScreen from './src/Screens/SplashScreen'
import Register from './src/Screens/Auth/Register';
import Login from './src/Screens/Auth/Login';
import Sidebar from './src/Screens/Drawer/Sidebar';
import Subcategory from './src/Screens/Menu/Subcategory';
import QuizIntro from './src/Screens/Menu/QuizIntro';
import AllQuiz from './src/Screens/Menu/AllQuiz';
import StartQuiz from './src/Screens/Menu/StartQuiz';
import Solution from './src/Screens/Menu/Solution';
import Result from './src/Screens/Menu/Result';
import ShowNews from './src/Screens/Menu/ShowNews';
import AllNotes from './src/Screens/Menu/AllNotes';
import HistoryDetail from './src/Screens/Menu/HistoryDetail';
import PDFViewer from './src/Screens/Menu/PDFViewer'
const Stack = createNativeStackNavigator();
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import Premium from './src/Screens/Menu/Premium';
import { storeData } from './src/AsyncStorage';

import {Provider} from 'react-redux';
import store from './src/Reducer/store';
import InAppPurchaseScreen from "./src/Screens/InAppPurchaseScreen"; 

const App = ({isdarkTheme}) => {
  useEffect( () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        console.log('TOKEN:', token);
        if(token?.token)
        {
          await storeData("notificationToken",token.token);
        }
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      sendNotification(remoteMessage.notification);
    });
    messaging()
      .subscribeToTopic('announce')
      .then(() => console.log('Subscribed to topic!'));
  }, []);

  const sendNotification = data => {
    PushNotification.localNotification({
      channelId: 'fcm_fallback_notification_channel',
      title: data.title, // (optional)
      message: data.body, // (required)
      bigPictureUrl: data.image,
    });
  };

  const CustomerDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    colors:{
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background:'#fff',
      text:'#212121'
    }
  }
  const CustomerDarkTheme = {
    ...PaperDarkTheme,
    ...DarkTheme,
    colors:{
      ...PaperDarkTheme.colors,
      ...DarkTheme.colors,
      background:'#212121',
      text:'#fff'
    }
  }



  const theme = isdarkTheme ? CustomerDarkTheme : CustomerDefaultTheme


  return (
    <PaperProvider theme={PaperDarkTheme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            options={{headerShown: false}}
            component={SplashScreen}
          />  
          <Stack.Screen
            name="Register"
            options={{headerShown: false}}
            component={Register}
          />
          <Stack.Screen
            name="Login"
            options={{headerShown: false}}
            component={Login}
          />
          <Stack.Screen
            name="Sidebar"
            options={{headerShown: false}}
            component={Sidebar}
          />
          <Stack.Screen
            name="Subcategory"
            options={{headerShown: false}}
            component={Subcategory}
          />
          <Stack.Screen
            name="Allquizzes"
            options={{headerShown: false}}
            component={AllQuiz}
          />
          <Stack.Screen
            name="introquiz"
            options={{headerShown: false}}
            component={QuizIntro}
          />
          <Stack.Screen
            name="StartQuiz"
            options={{headerShown: false}}
            component={StartQuiz}
          />
          <Stack.Screen
            name="Solution"
            options={{headerShown: false}}
            component={Solution}
          />
          <Stack.Screen
            name="Result"
            options={{headerShown: false}}
            component={Result}
          />
          <Stack.Screen
            name="Premium"
            options={{headerShown: false}}
            component={Premium}
          />
          <Stack.Screen
            name="showNews"
            options={{headerShown: false}}
            component={ShowNews}
          />
          <Stack.Screen
            name="allnotes"
            options={{headerShown: false}}
            component={AllNotes}
          />
          <Stack.Screen
            name="historydetail"
            options={{headerShown: false}}
            component={HistoryDetail}
          />
          <Stack.Screen
            name="PDFViewer"
            options={{headerShown: false}}
            component={PDFViewer}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const mapStateToProps = state => {
  return {
    isdarkTheme: state.darkTheme,
  };
};

export default connect(mapStateToProps)(App);

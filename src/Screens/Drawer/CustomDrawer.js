import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Linking,
  Alert,
  ScrollView,
  Share
} from 'react-native';
import {
  Divider,
  Title,
  Switch,
  Text,
  Drawer,
  TouchableRipple,
} from 'react-native-paper';
import {Colors, fontStyle,privacy_policy,terms_conditions} from '../../Constant';
import {DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {changeTheme} from '../../Reducer/DataAction'; 
const {height, width} = Dimensions.get('screen');

const CustomDrawer = ({navigation, Userdata, changingTheme, DarkTheme}) => {
  const [currentScreen, setcurrentScreen] = useState('Home');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    changingTheme(!isSwitchOn);
  };
  const theme = useTheme();
  console.log('Hey akhil Color check', theme);
  const LogoutUser = async () => {
    try {
      await AsyncStorageLib.removeItem('token');
      navigation.navigate('Login');
    } catch (e) {
      // remove error
      console.log('Somthing went wrong');
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          `Hey, I am using this App to prepare my exam. i recommend you try this app now:${` https://telegramlinker.com/`}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView
      style={[
        theme.dark
          ? {flex: 1, backgroundColor: '#212121'}
          : {flex: 1, backgroundColor: '#fff'},
      ]}>
      <View style={styles.headertop}>
        <Image
          source={{
            uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png',
          }}
          style={{height: '50%', width: '50%', resizeMode: 'center'}}
        />
        <Title
          style={{
            color: '#fff',
            fontFamily: fontStyle.MardenBold,
            fontSize: 20,
          }}>
          {Userdata[0].data.name}
        </Title>
      </View>
      <View>
        <DrawerItem
          label="Home"
          focused={currentScreen == 'Home' ? true : false}
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={focused ? 'home' : 'home-outline'}
            />
          )}
          onPress={() => {
            navigation.navigate('Home'), setcurrentScreen('Home');
          }}
        />
        <DrawerItem
          label="Bookmarks"
          focused={currentScreen == 'Bookmark' ? true : false}
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={focused ? 'bookmark' : 'bookmark-outline'}
            />
          )}
          onPress={() => {
            navigation.navigate('Bookmark'), setcurrentScreen('Bookmark');
          }}
        />
        <DrawerItem
          label="History"
          focused={currentScreen == 'History' ? true : false}
          icon={({focused}) => (
            <MaterialIcons
              color={Colors.primary}
              size={20}
              name={focused ? 'history' : 'history-toggle-off'}
            />
          )}
          onPress={() => {
            navigation.navigate('History'), setcurrentScreen('History');
          }}
        />
        <DrawerItem
          label="Favourites"
          focused={currentScreen == 'favourite' ? true : false}
          icon={({focused}) => (
            <MaterialIcons
              color={Colors.primary}
              size={20}
              name={focused ? 'star' : 'star-outline'}
            />
          )}
          onPress={() => {
            navigation.navigate('TopNav'), setcurrentScreen('favourite');
          }}
        />
        <DrawerItem
          label="Premium (No Ads)"
          focused={currentScreen == 'Premium' ? true : false}
          icon={({focused}) => (
            <MaterialCommunityIcons
              color={Colors.primary}
              size={20}
              name={focused ? 'crown' : 'crown-outline'}
            />
          )}
          onPress={() => {
            navigation.navigate('Premium'), setcurrentScreen('Premium');
          }}
        />
        <DrawerItem
          label="Rate the app"
          icon={({focused}) => (
            <MaterialIcons
              color={Colors.primary}
              size={20}
              name={'star-rate'}
            />
          )}
          onPress={() => {
            console.log('Giving the rating');
          }}
        />
      </View>
      <Divider style={{borderWidth: 0.7, color: '#CCCCCC', opacity: 0.7}} />
      <View>
        <DrawerItem
          label="Privacy Policy"
          icon={({focused}) => (
            <Ionicons color={Colors.primary} size={20} name={'shield-sharp'} />
          )}
          onPress={() => {
            // Linking.openURL(Userdata[0].app_setting.privacy_policy);
            Linking.openURL(privacy_policy);
          }}
        />
        <DrawerItem
          label={`Terms & Conditions`}
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={'md-newspaper-outline'}
            />
          )}
          onPress={() => {
            // Linking.openURL(Userdata[0].app_setting.terms_conditions);
            Linking.openURL(terms_conditions);
          }}
        />
        <DrawerItem
          label={`About App`}
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={'information-sharp'}
            />
          )}
          onPress={() => {
            Linking.openURL('https://telegramlinker.com/');
          }}
        />
        <DrawerItem
          label={`Share App`}
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={'share-social'}
            />
          )}
          onPress={() => onShare()}
        />
        <DrawerItem
          label="More"
          icon={({focused}) => (
            <Ionicons
              color={Colors.primary}
              size={20}
              name={'pricetag-outline'}
            />
          )}
          onPress={() => {
            console.log('Go to More');
          }}
        />
      </View>
      <Divider style={{borderWidth: 0.7, color: '#CCCCCC', opacity: 0.7}} />
      <View>
        <DrawerItem
          label="Logout"
          icon={({focused}) => (
            <MaterialIcons color={Colors.primary} size={20} name={'logout'} />
          )}
          onPress={() => {
            Alert.alert('Logout', 'Are you surely want to Logout', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Yes', onPress: () => LogoutUser()},
            ]);
          }}
        />
        <Divider />
        <Drawer.Section style={styles.bottomDrawerSection}>
          <TouchableRipple
            onPress={() => {
              onToggleSwitch();
            }}>
            <View style={styles.preference}>
              <Text
                style={[
                  DarkTheme
                    ? {color: '#fff', fontSize: 18}
                    : {color: '#000', fontSize: 18},
                ]}>
                Dark Theme
              </Text>
              <View pointerEvents="none">
                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <Text
          style={[
            theme.dark
              ? {color: '#fff'}
              : {color: '#212121', fontFamily: fontStyle.Sophisto},
          ]}>
          Version: 0.0.1
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headertop: {
    height: height / 4,
    backgroundColor: Colors.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
const mapStateToProps = state => {
  return {
    Userdata: state.UserData,
    DarkTheme: state.darkTheme,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changingTheme: parameter => {
      dispatch(changeTheme(parameter));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawer);

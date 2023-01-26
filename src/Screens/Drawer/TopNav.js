import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Colors, fontStyle} from '../../Constant';
import {Appbar, Snackbar, Title, Button} from 'react-native-paper';
const Tab = createMaterialTopTabNavigator();
import Tab_FavNews from '../Menu/Tab_FavNews';
import Tab_FavNotes from '../Menu/Tab_FavNotes';

const TopNav = ({navigation}) => {
  return (
    <>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title="Favourite" />
      </Appbar.Header>
      <Tab.Navigator 
      screenOptions={{
        tabBarStyle:{backgroundColor:Colors.primary},
        tabBarIndicatorStyle:{borderWidth:1.5,borderColor:Colors.secondary},
        tabBarLabelStyle:{fontFamily:fontStyle.MardenBold}
      }} initialRouteName="FavNews">
        <Tab.Screen
          options={{title: 'News'}}
          name="FavNews"
          component={Tab_FavNews}
        />
        <Tab.Screen
          options={{title: 'Notes'}}
          name="FavNotes"
          component={Tab_FavNotes}
        />
      </Tab.Navigator>
    </>
  );
};

export default TopNav;

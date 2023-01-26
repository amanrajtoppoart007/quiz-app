import React from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
const Drawer = createDrawerNavigator();
import CustomDrawer from './CustomDrawer';

import Home from './Home';
import Bookmark from './Bookmark'
import History from './History';
import TopNav from './TopNav';

const Sidebar = () => {
    return (
        <Drawer.Navigator 
            drawerContent={(props)=><CustomDrawer {...props} />}
            initialRouteName="Home">
            <Drawer.Screen name="Home" options={{headerShown:false}} component={Home} />
            <Drawer.Screen name="Bookmark" options={{headerShown:false}} component={Bookmark} />
            <Drawer.Screen name="History" options={{headerShown:false}} component={History} />
            <Drawer.Screen name="TopNav" options={{headerShown:false}} component={TopNav} />
        </Drawer.Navigator>
    )
}

export default Sidebar

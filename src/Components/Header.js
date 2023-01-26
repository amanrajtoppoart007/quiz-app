import React from 'react'
import { View,StyleSheet,TouchableWithoutFeedback,Image } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {useTheme} from '@react-navigation/native';
import { Text } from 'react-native-paper';
const Menubar = require('../Assets/imgs/menu.png')

const Header = ({onPress}) => {
    const theme = useTheme()
    return (
        <View style={[theme.dark?{backgroundColor:'#212121'}:{backgroundColor:'#fff'},styles.container]}>
            <TouchableWithoutFeedback onPress={onPress}>
                <MaterialCommunityIcons name="menu" size={45} color={theme.dark?'#fff':'#212121'}/>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        //borderWidth:2,
        paddingVertical:18,
        paddingHorizontal:10
    }
});

export default Header

import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import {Colors,fontStyle} from '../Constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const CustomInput = ({
  iconname,
  onPress,
  verifytxt,
  borderon,
  verify,
  placeholder,
  outterstyle,
  Errormsg,
  ...rest
}) => {
  return (
    <View>
      <View style={[styles.container, outterstyle]}>
        <MaterialCommunityIcons name={iconname} color={'grey'} size={20} />
        <TextInput style={styles.inputst} placeholderTextColor={'grey'} placeholder={placeholder} {...rest} />
        {verify ? (
          <View style={{position: 'absolute', right: 0, marginRight: 10}}>
            <Button onPress={onPress} labelStyle={{color: Colors.secondary}}>
              {verifytxt ? verifytxt : 'VERIFY'}
            </Button>
          </View>
        ) : (
          <View></View>
        )}
      </View>
      {Errormsg?<View style={{marginVertical:5,marginLeft:10,fontFamily:fontStyle.MardenBold}}>
        <Text style={{position: 'absolute', bottom: 0,color:'red'}}>
          {Errormsg}
        </Text>
      </View>:<View></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex:1,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderColor: 'grey',
    borderRadius: 30,
    paddingVertical: 3,
    marginTop: 8,
  },
  inputst: {
    fontSize: 18,
    marginLeft: 10,
    color: '#1EB0EB',
    fontWeight: 'bold',
    width: '100%',
  },
});

export default CustomInput;

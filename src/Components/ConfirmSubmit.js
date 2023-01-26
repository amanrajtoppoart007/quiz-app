import {View} from 'react-native';
import React from 'react';
import {Title, Divider, Paragraph, Button,Text} from 'react-native-paper';
import {Colors, fontStyle} from '../Constant';
import {useTheme} from '@react-navigation/native';

const ConfirmSubmit = ({onPress,onCancel,showCancel,title,mainbtn,description}) => {
  
  const {colors,dark} = useTheme()

  return (
    <View>
      <Title
        style={{
          textAlign: 'center',
          fontSize: 30,
          marginVertical: 10,
          fontFamily: fontStyle.MardenBold,
          color:"#212121"
        }}>
        {title}
      </Title>
      <Divider style={{borderBottomWidth: 2}} />
      <Paragraph
        style={{
          marginHorizontal: 5,
          textAlign: 'center',
          marginVertical: 10,
          fontSize: 20,
          fontFamily: fontStyle.Sophisto,
          color:"#212121"
        }}>
        {description}
      </Paragraph>
      <View
        style={
          ({alignItems: 'center'},
          [
            showCancel
              ? {flexDirection: 'row',justifyContent: 'space-evenly'}
              : {justifyContent: 'center',flexDirection: 'row',},
          ])
        }>
        {showCancel ? (
          <Button
            mode="outlined"
            labelStyle={{color:'#212121'}}
            style={{
              paddingVertical: 5,
              width: '30%',
              borderWidth:1.6,
              borderColor:Colors.primary
            }}
            onPress={onCancel}>
            Cancel
          </Button>
        ) : (
          <></>
        )}
        <Button
          mode="contained"
          style={{
            paddingVertical: 5,
            width: '40%',
            backgroundColor: Colors.primary,
          }}
          onPress={onPress}>
          {mainbtn?mainbtn:'CONFIRM'}
        </Button>
      </View>
    </View>
  );
};

export default ConfirmSubmit;

import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { Divider, Headline, Paragraph, Title, Text } from 'react-native-paper';
import { Colors, fontStyle } from '../Constant';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');
const ConfirmModal = ({ onPress, GoConfirm }) => {

  const { colors, dark } = useTheme()

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Headline style={dark ? { color: '#fff' } : { color: '#212121' }}>Instruction</Headline>
      <Divider />
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        All the efforts have been made to ensure the accuracy of all the questions and answers of this app. The developer/author does not take any legal responsibility for any errors or any misinformation that might have crept in. Request you to inform the same at samyuracademy@gmail.com to rectify them in the next version.{'\n'}
      </Paragraph>
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        Use the translate button on Top right corner to change the language.
        Use Star Button to add this test to your favourite section.{'\n '}
      </Paragraph>
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        Please click on Confirm button to proceed.{'\n '}
      </Paragraph>
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        ఈ యాప్లోని అన్ని ప్రశ్నలు మరియు సమాధానాల ఖచ్చితత్వాన్ని నిర్ధారించడానికి అన్ని ప్రయత్నాలు చేయబడ్డాయి. డెవలపర్/రచయిత ఏదైనా పొరపాట్లు లేదా ఏదైనా తప్పుడు సమాచారానికి చట్టపరమైన బాధ్యత వహించరు. తదుపరి update వాటిని సరిదిద్దడానికి samyuracademy@gmail.com కి తెలియజేయవలసిందిగా మిమ్మల్ని అభ్యర్థిస్తున్నాను.{' \n'}
      </Paragraph>
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        భాషను మార్చడానికి పైన  కుడి మూలకు  Translation బటన్ను ఉపయోగించండి.{'\n '}
      </Paragraph>
      <Paragraph style={[{ marginHorizontal: 5 }, dark ? { color: '#fff' } : { color: '#212121' }]}>
        పరీక్ష వ్రాయడానికి Confirm  బటన్పై క్లిక్ చేయండి.{'\n '}
      </Paragraph>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 20
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.butonContainer, { backgroundColor: Colors.secondary }]}
          onPress={onPress}>
          <Text style={styles.txtStyl}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.butonContainer, { backgroundColor: '#1EC000' }]}
          onPress={GoConfirm}>
          <Text style={styles.txtStyl}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height / 2,
  },
  butonContainer: {
    //borderWidth: 2,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 5,
  },
  txtStyl: {
    fontSize: 20,
    fontFamily: fontStyle.Sophisto,
    color: '#fff',
  },
});

export default ConfirmModal;

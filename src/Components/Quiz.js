import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import {Title,Text} from 'react-native-paper';
import {Colors, fontStyle, baseUrl} from '../Constant';
const {height, width} = Dimensions.get('screen');
import {getData} from '../AsyncStorage';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '@react-navigation/native';

const ImageSize = width / 4;
import axios from 'axios';
import ProgressLoader from 'rn-progress-loader';
import ConfirmModal from './ConfirmModal';
//console.log(((width-(width/3.5)*3)/3)-14)
const Quiz = ({navigation, route}) => {
  const [Category, setCategory] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchQuizHere();
  }, []);

  const {colors} = useTheme()

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (route.name == 'Home') {
          Alert.alert('Exit the App!', 'Click YES to exit the app', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'YES', onPress: () => BackHandler.exitApp()},
          ]);
          return true;
        }

        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );
  // useEffect(() => {

  // }, []);

  const fetchQuizHere = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }

    axios
      .get(`${baseUrl}categories`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(function (response) {
        if (response.data.status) {
          setCategory(response.data.data);
        }
        setVisible(false);
      })
      .catch(function (error) {
        console.log('Error', error);
        setVisible(false);
      });
  };

  const ShowAllCategory = () => {
    return Category.map((items, index) => {
      return (
        <TouchableOpacity
          key={items.id}
          onPress={() =>
            navigation.navigate('Subcategory', {
              catId: items.id,
              quizname: items.name,
            })
          }
          style={styles.MenuBox}>
          <Image
            resizeMode="contain"
            style={{
              width: ImageSize / 2,
              height: ImageSize / 2,
              borderRadius: ImageSize / 2 / 2,
            }}
            source={{
              uri: items.image,
            }}
          />
          <Text style={[styles.UnderTitle,{color:colors.text}]}>{items.name}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View>
      <Title style={{color:colors.text}}>All Tests</Title>
      {/* <Text style={{color:colors.text}}>Quiz in {Category.length} Diffrent Category</Text> */}
      <View style={styles.OutterMenu}>{ShowAllCategory()}</View>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  MenuBox: {
    height: width / 3.5,
    width: width / 3.5,
    marginBottom: 15,
    borderRadius: width / 3.5 / 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor:Colors.secondary,
    marginHorizontal: (width - (width / 3.5) * 3) / 3 - 15,
    borderWidth:2
  },
  OutterMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 15,
    alignItems: 'center',
    //borderWidth:2
  },
  UnderTitle: {
    fontSize: 15,
    fontFamily: fontStyle.MardenBold,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default Quiz;

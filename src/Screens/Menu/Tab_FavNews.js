import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {Colors, baseUrl, fontStyle} from '../../Constant';
import {getData} from '../../AsyncStorage';
import axios from 'axios';
import {Paragraph, Snackbar} from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
const {width, height} = Dimensions.get('screen')
const Tab_FavNews = ({navigation}) => {
  const {dark, colors} = useTheme();
  const [favNewsData, setfavNewsData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [Snvisible, setSnVisible] = useState(true);
  const [Snmsg, setSnmsg] = useState('');
  const onToggleSnackBar = () => setSnVisible(!Snvisible);
  const onDismissSnackBar = () => setSnVisible(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      fetchFavNews();
      console.log('This is News screen');
    });

    return unsubscribe;
  }, [navigation]);

  const fetchFavNews = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(`${baseUrl}show-favorite-news`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data.data);
          setfavNewsData(response.data.data);
          setVisible(false);
        } else {
          setVisible(false);
          onToggleSnackBar();
          setSnmsg(response.data.msg);
        }
      })
      .catch(err => {
        setVisible(false);
        console.log('Error', err);
      });
  };

  const renderNewsData = () => {
    return favNewsData.map((item, index) => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.navigate('showNews', {
              newsid: item.news_id,
            })
          }
          style={styles.newscontainer}>
          <View style={{width: '60%'}}>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 20,
                fontFamily: fontStyle.MardenBold,
                fontWeight: 'bold',
                color: dark ? '#fff' : '#212121',
              }}>
              {item.title}
            </Text>
            <Paragraph style={[dark ? {color: '#fff'} : {color: '#212121'}]}>
              {item.description}...
            </Paragraph>
          </View>
          <View style={{width: '30%'}}>
            <Image
              resizeMode="stretch"
              style={{width: '100%', height: 110}}
              source={{
                uri: item.image,
              }}
            />
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      {favNewsData.length>0 ? (
        renderNewsData()
      ) : (
        <View
          style={{
            flex: 1,
            height:height-200,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{fontFamily:fontStyle.Sophisto,fontSize:40}}>
              No Data Found
            </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth:2
  },
  newscontainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 6,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
});

export default Tab_FavNews;

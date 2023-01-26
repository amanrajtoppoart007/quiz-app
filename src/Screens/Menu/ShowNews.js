import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Appbar,
  Snackbar,
  Text,
  Button,
  Divider,
  Paragraph,
} from 'react-native-paper';
import {Colors, baseUrl, fontStyle} from '../../Constant';
const {width, height} = Dimensions.get('screen');
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {getData} from '../../AsyncStorage';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useInterstitialAd,
  InterstitialAd,
} from '@react-native-admob/admob';
import ProgressLoader from 'rn-progress-loader';
import {connect} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import axios from 'axios';
const ShowNews = ({navigation, route, Userdata}) => {
  const {newsid, next, prev} = route.params;
  //console.log("Prev",next ,"Notes",newsid ,"Next ", prev)
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const bannerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isfavourite, setfavourite] = useState(false);
  const [newsdata, setnewsdata] = useState([]);
  const [currnewsid, setnewsid] = useState(newsid);
  const pan = useRef(new Animated.ValueXY()).current;
  const [SNvisible, setSNVisible] = React.useState(false);
  console.log(Userdata[0].app_setting.banner_id)
  const onToggleSnackBar = () => setSNVisible(!visible);

  const onDismissSnackBar = () => setSNVisible(false);

  // const {adLoaded, adDismissed, show} = useInterstitialAd(
  //   TestIds.REWARDED_INTERSTITIAL,
  // );
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  useEffect(() => {
    fetchNewsDetails(newsid);
  }, []);

  // useEffect(() => {
  //   fetchNewsDetails();
  // },[currnewsid]);

  const {colors, dark} = useTheme();

  useEffect(() => {
    const interstitial = InterstitialAd.createAd(Userdata[0].app_setting.ints_id);
    setInterstitialAd(interstitial);
    const subscriptions = [
      interstitial.addEventListener('onAdLoaded', () => {
        interstitial.show()
      }),
      interstitial.addEventListener('onAdDismissed', () => {
        setAdDismissed(true);
      }),
    ];

    return () => subscriptions.forEach(sub => sub.remove());
  }, [adDismissed, navigation]);

  //const panResponder = useRef(
  //  const Panresponder = PanResponder.create({
  //     //onStartShouldSetPanResponder: ()=>true,
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: (e, gesstate) => {
  //       SwiperWork(gesstate);
  //       pan.setOffset({
  //         x: pan.x._value,
  //         y: pan.y._value,
  //       });
  //     },
  //     onPanResponderMove: (e, gesstate) => {
  //       // console.log("Working", gesstate)
  //     },
  //     onPanResponderRelease: () => {
  //       // SwiperWork()
  //       pan.flattenOffset();
  //     },
  //   })
  //).current;

  const fetchNewsDetails = async paging => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(`${baseUrl}getNews/${paging}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(function (response) {
        console.log('ZRroerjjsgbdfj', response.data);
        if (response.data.status) {
          if (response.data.data.favorites) {
            setfavourite(true);
          }
          //console.log("heheheheheh",response.data.data.next)
          setnewsdata(response.data.data);
        } else {
          onToggleSnackBar()
        }
        setVisible(false);
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false);
      });
  };

  const addtoFavourite = async () => {
    // setfavourite(!isfavourite)
    //setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .post(
        `${baseUrl}addToFavorite`,
        {
          news_id: newsid,
        },
        {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        },
      )
      .then(function (response) {
        console.log(response.data.msg);
        if (response.data.status) {
          setfavourite(!isfavourite);
        } else {
          Alert.alert('Oop', response.data.msg);
        }
        setVisible(false);
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false);
      });
  };

  const renderDescription = () => {
    if (newsdata.length == 0) return;
    var noofdescrip = newsdata.description;
    console.log('Description', noofdescrip);
    return noofdescrip.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            marginHorizontal: 5,
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Paragraph
            style={[
              {fontFamily: 'Arial', textAlign: 'justify'},
              dark ? {color: '#fff'} : {color: '#212121'},
            ]}>
            {item}
          </Paragraph>
        </View>
      );
    });
  };

  // const SwiperWork =(ges) => {
  //   if (ges.vy == 0) {
  //     //console.log(ges)
  //     if (ges.vx > 0) {
  //      console.log("l t r")
  //      if(newsdata.prev != null){
  //        fetchNewsDetails(newsdata.prev)
  //      }else{
  //       Alert.alert("No Previous News Available")
  //      }
  //     } else {
  //       console.log("r t l")
  //       if(newsdata.next != null){
  //         fetchNewsDetails(newsdata.next)
  //       }else{
  //        Alert.alert("No More News Available")
  //       }
  //     }
  //    console.log('x:', ges.x0, 'y:', ges.y0, 'vx:', ges.vx, 'vy:', ges.vy);
  //   }
  // };

  // const pagenext = () => {
  //   console.log("cheal gya data",newsdata)
  // }


  return (
    <View
      style={[
        styles.container,
        dark ? {backgroundColor: '#212121'} : {backgroundColor: '#fff'},
      ]}>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title={newsdata.title} />
        <Appbar.Action
          animated={false}
          color="#fff"
          icon={isfavourite ? 'star' : 'star-outline'}
          onPress={() => addtoFavourite()}
        />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />

      <ScrollView style={styles.briefContainer}>
        <GestureRecognizer 
          onSwipeRight={state => fetchNewsDetails(newsdata.prev)}
          onSwipeLeft = {state => fetchNewsDetails(newsdata.next)}
        >
          <View
            style={{
              margin: 2,
              borderBottomWidth: 2,
              marginBottom: 10,
            }}>
            <Image
              style={{
                borderWidth: 2,
                width: '100%',
                height: height / 4,
                resizeMode: 'contain',
              }}
              source={{uri: newsdata.image}}
            />
          </View>

          <View style={styles.dataContainer}>
            <View style={styles.dataContainer}>
              <Text
                style={[
                  {
                    fontFamily: fontStyle.MardenBold,
                    fontSize: 18,
                  },
                  dark ? {color: '#fff'} : {color: '#212121'},
                ]}>
                Date:{' '}
              </Text>
              <Text
                style={[
                  {
                    fontFamily: fontStyle.Sophisto,
                    fontSize: 15,
                  },
                  dark ? {color: '#fff'} : {color: '#212121'},
                ]}>
                {' '}
                {newsdata.create_date}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text
                style={[
                  {
                    fontFamily: fontStyle.MardenBold,
                    fontSize: 18,
                  },
                  dark ? {color: '#fff'} : {color: '#212121'},
                ]}>
                View:{' '}
              </Text>
              <Text
                style={[
                  {
                    fontFamily: fontStyle.Sophisto,
                    fontSize: 15,
                  },
                  dark ? {color: '#fff'} : {color: '#212121'},
                ]}>
                {' '}
                {newsdata.views}
              </Text>
            </View>
          </View>
          <Divider
            style={{
              borderWidth: 0.8,
              marginBottom: 10,
              borderColor: Colors.lightgrey,
            }}
          />
          {renderDescription()}
        </GestureRecognizer>
      </ScrollView>
      <BannerAd
        ref={bannerRef}
        size={BannerAdSize.BANNER}
        unitId={Userdata[0].app_setting.banner_id}
      />
      <Snackbar
        style={{borderWidth:2,borderColor:Colors.secondary,fontSize:18}}
        visible={SNvisible}
        onDismiss={onDismissSnackBar}>
        No Data Found
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  briefContainer: {
    flex: 1,
  },
  dataContainer: {
    flexDirection: 'row',
    //borderWidth:2,
    padding: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    Userdata: state.UserData,
    DarkTheme: state.darkTheme,
  };
};

export default connect(mapStateToProps)(ShowNews);

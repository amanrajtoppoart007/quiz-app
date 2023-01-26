import { View, Text, StyleSheet, Dimensions, Alert, BackHandler } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Pdf from 'react-native-pdf';
import ProgressLoader from 'rn-progress-loader';
import { Colors, fontStyle, baseUrl } from '../../Constant';
import { Appbar } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd } from '@react-native-admob/admob';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getData } from '../../AsyncStorage';
import axios from 'axios';
import { connect } from 'react-redux';

const PDFViewer = ({ navigation, route, Userdata }) => {
  const { notes_url, notesid, favorite } = route.params;
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [adDismissed, setAdDismissed] = useState(false);

  const [visible, setVisible] = useState(true);
  const [fav, setFav] = useState(false);
  const [currpage, setcurrpage] = useState(1);
  const [totalpg, settotpg] = useState(1);
  const source = { uri: notes_url, cache: true };
  const bannerRef = useRef(null);
  useEffect(() => {
    if (favorite) {
      setFav(true)
    }
    const interstitial = InterstitialAd.createAd(Userdata[0].app_setting.ints_id);
    setInterstitialAd(interstitial);
    const subscriptions = [
      interstitial.addEventListener('onAdLoaded', () => {
        console.log('Ad loaded')
        interstitial.show();
      }),
      interstitial.addEventListener('onAdDismissed', () => {
        setAdDismissed(true);
      }),
    ];

    return () => subscriptions.forEach((sub) => sub.remove());
  }, [adDismissed, navigation]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.goBack()
        return true
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [])
  )

  useEffect(() => {
    UpdateRead()
  }, [])


  const UpdateRead = async () => {
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(
        `${baseUrl}update-downloads/${notesid}`,
        {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        },
      )
      .then(function (response) {
        console.log(response.data.msg);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const addtoFavourite = async () => {
    // setfavourite(!isfavourite)
    //setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .post(
        `${baseUrl}addToFavoriteNotes`,
        {
          notes_id: notesid,
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
          setFav(!fav);
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

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: Colors.primary }}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Notes" color='#fff' />
      </Appbar.Header>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          setVisible(false);
          console.log(`Number of pages: ${numberOfPages}`);
          settotpg(numberOfPages)
        }}
        onPageChanged={(page, numberOfPages) => {
          setcurrpage(page)
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <View
        style={{
          // width: 50,
          // height: 50,
          padding: 15,
          backgroundColor: Colors.lightgrey,
          borderRadius: 25,
          position: 'absolute',
          bottom: 10,
          right: 5,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={{ fontSize: 14, fontFamily: fontStyle.MardenBold, color: '#212121' }}>{currpage}/{totalpg}</Text>
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: Colors.secondary,
          borderRadius: 25,
          position: 'absolute',
          bottom: 70,
          right: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <AntDesign size={25} onPress={() => addtoFavourite()} color={Colors.tertiary} name={fav ? 'star' : 'staro'} />
      </View>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />

      <BannerAd ref={bannerRef} size={BannerAdSize.BANNER} unitId={Userdata[0].app_setting.banner_id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    //alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const mapStateToProps = state => {
  return {
    Userdata: state.UserData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // changingTheme: parameter => {
    //   dispatch(changeTheme(parameter));
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDFViewer);

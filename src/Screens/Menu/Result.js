import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {Text, Title, Button} from 'react-native-paper';
import {fontStyle, Colors} from '../../Constant';
const {width, height} = Dimensions.get('screen');
import {connect} from 'react-redux';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd
} from '@react-native-admob/admob';

import {useTheme} from '@react-navigation/native';
const bgcard = require('../../Assets/bg/cardme.png');
const Result = ({navigation, route,Userdata}) => {
  const {resdata, lang, qid, data, timtaken} = route.params;
  console.log('Time taken', timtaken[0], timtaken[1]);
  const {colors, dark} = useTheme();
  const [interstitialAd, setInterstitialAd] = useState(null);
  const bannerRef = useRef(null);
  
  useEffect(() => {
    const interstitial = InterstitialAd.createAd(Userdata[0].app_setting.ints_id);
    setInterstitialAd(interstitial)
    const subscriptions = [
      interstitial.addEventListener('onAdLoaded', () => {
        interstitial.show()
      }),
      interstitial.addEventListener('onAdDismissed', () => {
        setAdDismissed(true);
      }),
    ];

    return () => subscriptions.forEach(sub => sub.remove());
  }, [navigation]);

    console.log(Userdata[0].app_setting.banner_id)

  return (
    <View
      style={[
        styles.container,
        dark ? {backgroundColor: '#212121'} : {backgroundColor: '#CCCCCC'},
      ]}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.HeadScrore}>
          <View style={[styles.scrorecard, {borderRightWidth: 1}]}>
            <Title style={{color: 'black'}}>Score</Title>
            <Text style={styles.textNum}>{resdata.user_score}</Text>
            <Text style={{color: 'black'}}>out of {resdata.max_score}</Text>
          </View>
          <View style={[styles.scrorecard, {borderLeftWidth: 1}]}>
            <Title style={{color: 'black'}}>Time Taken</Title>
            <Text style={styles.textNum}>
              {data.time - (timtaken[0] + 1)}:{60 - timtaken[1]}
            </Text>
            <Text style={{color: 'black'}}>in {data.time} Min</Text>
          </View>
        </View>
        <View style={styles.quesanaContainer}>
          <Title style={{color: 'black'}}>Question analysis</Title>
          <View style={styles.QuesNum}>
            {resdata.analysis.map((item, index) => {
              console.log(item[1]);
              var bgOpti = '#EA5D70';
              if (item[1] == true) {
                bgOpti = '#45B779';
              } else if (item[1] == 'not_attempted') {
                bgOpti = Colors.lightgrey;
              }
              return (
                <View
                  key={index}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: bgOpti,
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 20,
                    marginVertical: 10,
                  }}>
                  <Text style={{color: '#fff', fontSize: 20}}>{index + 1}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.quesdone}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 5,
                  backgroundColor: '#45B779',
                }}
              />
              <Text style={{color: 'black'}}>Correct</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 5,
                  backgroundColor: '#EA5D70',
                }}
              />
              <Text style={{color: 'black'}}>Wrong</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 5,
                  backgroundColor: '#CCCCCC',
                }}
              />
              <Text style={{color: 'black'}}>Unattempted</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button
              contentStyle={{paddingVertical: 10, paddingHorizontal: 20}}
              color={Colors.secondary}
              mode="text"
              onPress={() => {
                interstitialAd.show()
                navigation.navigate('introquiz', {
                  qid: qid,
                  data: data,
                });
              }}>
              Re-Attempt
            </Button>
            <Button
              color={Colors.secondary}
              contentStyle={{paddingVertical: 10, paddingHorizontal: 20}}
              mode="text"
              onPress={() => {
                navigation.navigate('Solution', {
                  qid: qid,
                  lang: lang,
                  nmark: data.nmark,
                  pmark: data.pmark,
                });
              }}>
              View Solution
            </Button>
          </View>
        </View>
        <View style={styles.MoreContainer}>
          <Title style={{marginBottom: 15, color: 'black'}}>
            Some More Test
          </Title>
          {resdata.more_quizes.map((item, index) => {
            console.log(item.quiz_name)
            return (
              <View key={item.id} style={styles.Quizcontainer}>
                <ImageBackground
                  source={bgcard}
                  style={{height: height / 5, padding: 15}}>
                  <Title style={{color:'black'}}>{item.quiz_name}</Title>
                  <View style={styles.detailstyle}>
                    <View
                      style={[
                        styles.detailstyle,
                        {width: '50%', justifyContent: 'flex-start'},
                      ]}>
                      <Text style={styles.tisty}>Time:</Text>
                      <Text style={{color:'black'}}>{item.time} Min</Text>
                    </View>
                    <View
                      style={[
                        styles.detailstyle,
                        {width: '50%', justifyContent: 'flex-start'},
                      ]}>
                      <Text style={styles.tisty}>Questions:</Text>
                      <Text style={{color:'black'}}>{item.question_count}</Text>
                    </View>
                  </View>
                  <View style={styles.detailstyle}>
                    <View
                      style={[
                        styles.detailstyle,
                        {width: '50%', justifyContent: 'flex-start'},
                      ]}>
                      <Text style={styles.tisty}>Create:</Text>
                      <Text style={{color:'black'}}>{item.created_date}</Text>
                    </View>
                    <View
                      style={[
                        styles.detailstyle,
                        {width: '50%', justifyContent: 'flex-start'},
                      ]}>
                      <Text style={styles.tisty}>Attemps:</Text>
                      <Text style={{color:'black'}}>{item.attempted_user}</Text>
                    </View>
                  </View>
                  <View style={{marginTop: 10}}>
                    <Button
                      mode="contained"
                      style={{width: '50%'}}
                      labelStyle={{color: '#fff'}}
                      color={Colors.secondary}
                      onPress={() =>
                        navigation.navigate('introquiz', {
                          qid: item.id,
                          data: {
                            name: item.quiz_name,
                            question_count: item.question_count,
                            time: item.time,
                            pmark: item.marks,
                            isnegmarking: item.neg_marking,
                            nmark: item.negative_mark,
                            level: {
                              easy: item.level.easy,
                              med: item.level.medium,
                              hard: item.level.hard,
                            },
                          },
                        })
                      }>
                      START TEST
                    </Button>
                  </View>
                </ImageBackground>
              </View>
            );
          })}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <BannerAd
            ref={bannerRef}
            size={BannerAdSize.BANNER}
            unitId={Userdata[0].app_setting.banner_id}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        // onPress={() => navigation.goBack()}
        onPress={() => navigation.navigate('Home')}
        style={styles.botmbtn}>
        <Text
          style={{
            fontFamily: fontStyle.MardenBold,
            fontSize: 20,
            color: '#fff',
          }}>
          Go back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HeadScrore: {
    // borderWidth: 2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrorecard: {
    width: '50%',
    alignItems: 'center',
    borderColor: 'grey',
  },
  textNum: {
    fontSize: 40,
    fontFamily: fontStyle.MardenBold,
    color: Colors.secondary,
  },
  quesanaContainer: {
    padding: 20,
    // borderWidth: 2,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  QuesNum: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth:2
  },
  quesdone: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    //borderWidth: 2,
    padding: 15,
  },
  botmbtn: {
    // borderWidth:2,
    height: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MoreContainer: {
    //borderWidth: 2,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 20,
  },
  detailstyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    //borderWidth:2,
    width: '90%',
  },
  tisty: {
    fontFamily: fontStyle.MardenBold,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
  },
  Quizcontainer: {
    // borderWidth: 2,
    marginBottom: 10,
    borderColor: 'red',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
  },
  OutterContiner: {
    //borderWidth: 2,
    marginHorizontal: 15,
    marginTop: 10,
  },
});

const mapStateToProps = state => {
  return {
    Userdata: state.UserData,
    DarkTheme: state.darkTheme,
  };
};

export default connect(mapStateToProps)(Result);

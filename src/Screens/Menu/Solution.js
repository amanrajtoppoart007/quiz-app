import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Appbar, Card, Divider, Title, List, Text} from 'react-native-paper';
import {Colors, fontStyle, baseUrl} from '../../Constant';
import {getData} from '../../AsyncStorage';
import { connect } from 'react-redux';
import {
  InterstitialAd
} from '@react-native-admob/admob';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('screen');
const OptionA = require('../../Assets/imgs/OptionA.png');
const OptionB = require('../../Assets/imgs/OptionB.png');
const OptionC = require('../../Assets/imgs/OptionC.png');
const OptionD = require('../../Assets/imgs/OptionD.png');
const PickA = require('../../Assets/imgs/PickA.png');
const PickB = require('../../Assets/imgs/PickB.png');
const PickC = require('../../Assets/imgs/PickC.png');
const PickD = require('../../Assets/imgs/PickD.png');
import {useTheme} from '@react-navigation/native';
import ProgressLoader from 'rn-progress-loader';
import axios from 'axios';
const Solution = ({navigation, route, Userdata}) => {
  const {qid, lang, pmark, nmark} = route.params;
  console.log(pmark, ' ', nmark);
  const [ques_detail, setques_details] = useState([]);
  const [visible, setVisible] = useState(false);
  const [expand, setexpand] = useState(false);
  const scrollRef = useRef();
  const {colors, dark} = useTheme();
  useEffect(() => {
    fetchQuesTiondata();
  }, []);
console.log(Userdata[0].app_setting.ints_id)
  useEffect(() => {
    const interstitial = InterstitialAd.createAd(Userdata[0].app_setting.ints_id);
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

  const fetchQuesTiondata = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(`${baseUrl}view-solution/${qid}/${lang}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        if (response.status) {
          setques_details(response.data.data);
          console.log('Data', response.data);
        } else {
          Alert.alert('OOps', response.data.msg);
        }
        setVisible(false);
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false);
      });
  };

  const showotherCW = (u_opt, c_opt, curr_opt) => {
    var crct_opt = 'a';
    if (c_opt == 'option_a') crct_opt = 'a';
    if (c_opt == 'option_b') crct_opt = 'b';
    if (c_opt == 'option_c') crct_opt = 'c';
    if (c_opt == 'option_d') crct_opt = 'd';

    if (curr_opt == crct_opt) {
      return '#50d993';
    } else if (curr_opt == crct_opt && curr_opt == u_opt) {
      return '#50d993';
    }

    if (crct_opt != curr_opt && u_opt != curr_opt) {
      return '#fff';
    } else if (crct_opt != u_opt && u_opt == curr_opt) {
      return '#f7b0b9';
    }
    //return ('#50d993')
  };

  const renderCardData = () => {
    console.log(ques_detail.length);
    return ques_detail.map((item, index) => {
      return (
        <Card
          key={item.id}
          style={{marginBottom: 8, backgroundColor: colors.background}}>
          <View style={styles.subheader}>
            <Title style={[dark ? {color: '#fff'} : {color: '#212121'}]}>
              Q. {index + 1}
            </Title>
            <Text style={dark ? {color: '#fff'} : {color: '#212121'}}>
              +{pmark} , -{nmark}
            </Text>
          </View>

          <Divider
            style={[
              {borderBottomWidth: 1.5},
              dark ? {borderColor: '#fff'} : {borderColor: '#212121'},
            ]}
          />
          <Text
            style={[
              styles.QusTxt,
              dark ? {color: '#fff'} : {color: '#212121'},
            ]}>
            {item.question}
          </Text>
          {item.question_image != null ? (
            <Image
              resizeMode="contain"
              style={{
                width: width - 50,
                height: 370,
                borderWidth: 2,
                alignSelf: 'center',
              }}
              source={{
                uri: item.question_image,
              }}
            />
          ) : (
            <View></View>
          )}
          <View>
            <View style={styles.OptionContainer}>
              <TouchableOpacity
                style={[
                  styles.OptionSty,
                  
                  {
                    backgroundColor: showotherCW(
                      item.user_selected_answer,
                      item.correct_answer,
                      'a',
                    ),
                  },
                ]}>
                <Image
                  source={OptionA}
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
                {item.option_a_image == null ? (
                  <Text
                    style={{
                      marginLeft: 20,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      width: width-100,
                    }}>
                    {item.option_a}
                  </Text>
                ) : (
                  <Image
                    source={{
                      uri: item.option_a_image,
                    }}
                    resizeMode="contain"
                    style={{width: width / 2, height: 100}}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.OptionSty,
                  {
                    backgroundColor: showotherCW(
                      item.user_selected_answer,
                      item.correct_answer,
                      'b',
                    ),
                  },
                ]}>
                <Image
                  source={OptionB}
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
                {item.option_b_image == null ? (
                  <Text
                    style={{
                      marginLeft: 20,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      width: width-100,
                    }}>
                    {item.option_b}
                  </Text>
                ) : (
                  <Image
                    source={{
                      uri: item.option_b_image,
                    }}
                    resizeMode="contain"
                    style={{width: width / 2, height: 100}}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.OptionSty,
                  {
                    backgroundColor: showotherCW(
                      item.user_selected_answer,
                      item.correct_answer,
                      'c',
                    ),
                  },
                ]}>
                <Image
                  source={OptionC}
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
                {item.option_c_image == null ? (
                  <Text
                    style={{
                      marginLeft: 20,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      width: width-100,
                    }}>
                    {item.option_c}
                  </Text>
                ) : (
                  <Image
                    source={{
                      uri: item.option_c_image,
                    }}
                    resizeMode="contain"
                    style={{width: width / 2, height: 100}}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.OptionSty,
                  {
                    backgroundColor: showotherCW(
                      item.user_selected_answer,
                      item.correct_answer,
                      'd',
                    ),
                  },
                ]}>
                <Image
                  source={OptionD}
                  resizeMode="contain"
                  style={{width: 40, height: 40}}
                />
                {item.option_d_image == null ? (
                  <Text
                    style={{
                      marginLeft: 20,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      width: width-100,
                    }}>
                    {item.option_d}
                  </Text>
                ) : (
                  <Image
                    source={{
                      uri: item.option_d_image,
                    }}
                    resizeMode="contain"
                    style={{width: width / 2, height: 100}}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          {ques_detail.length == index + 1 ? (
              // <List.AccordionGroup>
                <List.Accordion
                  expanded={expand}
                  onPress={() => {
                    setexpand(!expand)
                    scrollRef.current.scrollToEnd({animated: true})
                  }}
                  style={[
                    dark
                      ? {backgroundColor: '#212121'}
                      : {backgroundColor: '#fff'},
                  ]}
                  titleStyle={{color: Colors.secondary}}
                  title="See Solution"
                  id="3">
                  <View style={{paddingHorizontal: 10}}>
                    <Text
                      style={{marginBottom: 5, fontSize: 17, color: 'green'}}>
                      Correct Answer : {item.correct_answer.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        {marginBottom: 5, fontSize: 13},
                        dark ? {color: '#fff'} : {color: '#212121'},
                      ]}>
                      {item.explanation}
                    </Text>
                  </View>
                </List.Accordion>
              // </List.AccordionGroup>
          ) : (
            <List.AccordionGroup>
              <List.Accordion
              onPress={()=>console.log('Just checking')}
                style={[
                  dark
                    ? {backgroundColor: '#212121'}
                    : {backgroundColor: '#fff'},
                ]}
                titleStyle={{color: Colors.secondary}}
                title="See Solution"
                id="3">
                <View style={{paddingHorizontal: 10}}>
                  <Text style={{marginBottom: 5, fontSize: 17, color: 'green'}}>
                    Correct Answer : {item.correct_answer.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      {marginBottom: 5, fontSize: 13},
                      dark ? {color: '#fff'} : {color: '#212121'},
                    ]}>
                    {item.explanation}
                  </Text>
                </View>
              </List.Accordion>
            </List.AccordionGroup>
          )}
          {/* <List.AccordionGroup>
            <List.Accordion
              style={[dark?{backgroundColor:'#212121'}:{backgroundColor:'#fff'}]}
              titleStyle={{color: Colors.secondary}}
              title="See Solution"
              id="3">
              <View style={{paddingHorizontal: 10}}>
                <Text style={{marginBottom: 5, fontSize: 17, color: 'green'}}>
                  Correct Answer : {item.correct_answer.toUpperCase()}
                </Text>
                <Text style={[{marginBottom: 5, fontSize: 13},dark?{color:'#fff'}:{color:'#212121'}]}>
                  {item.explanation}
                </Text>
              </View>
            </List.Accordion>
          </List.AccordionGroup> */}
        </Card>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content color={'#fff'} title={'Test Solution'} />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <ScrollView ref={scrollRef} style={styles.QuesContainer}>
        {renderCardData()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCCCCC',
  },
  OptionContainer: {
    //borderWidth:2,
    margin: 15,
    flexDirection: 'column',
  },
  OptionSty: {
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth:2,
    padding: 5,
    marginBottom: 5,
    borderRadius:10
  },
  subheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  QusTxt: {
    fontFamily: fontStyle.Sophisto,
    fontSize: 18,
    margin: 5,
    // color: 'black',
    fontWeight: 'bold',
    width: '100%',
  },
});

const mapStateToProps = state => {
  return {
    Userdata: state.UserData,
    DarkTheme: state.darkTheme,
  };
};

export default connect(mapStateToProps)(Solution);

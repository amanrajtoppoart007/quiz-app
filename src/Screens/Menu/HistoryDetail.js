import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native'; 
import React, { useState, useEffect, useCallback } from 'react';
import { getData } from '../../AsyncStorage';
import { baseUrl, Colors, fontStyle } from '../../Constant';
import axios from 'axios';
const { width, height } = Dimensions.get('screen');
import {Appbar, Text, Title, Button } from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
import { useTheme, useFocusEffect } from '@react-navigation/native';
const bgcard = require('../../Assets/bg/cardme.png');
const HistoryDetail = ({ navigation, route }) => {
  const { qid } = route.params;
  console.log(qid);
  const [report, setreport] = useState([]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    fetchdReport();
  }, []);
  const { colors, dark } = useTheme();
  const fetchdReport = async () => {
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    const getDatais123 = await axios.get(baseUrl + `get-history/${qid}`, {
      headers: {
        Authorization: 'Bearer ' + Token,
        'Content-Type': 'application/json',
      },
    });
    if (getDatais123.data.status) {
      setreport(getDatais123.data.data);
    } else {
      Alert.alert('Oops', getDatais123.data.msg);
    }
  };

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

  const renderQA = () => {
    //  console.log("Report ",report.quiz.user_score)
    if (report.quiz) {
      return (
        <View>
          <Appbar.Header style={{ backgroundColor: Colors.primary }}>
            <Appbar.BackAction
              color="#fff"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content color="#fff" title="Analysis" />
          </Appbar.Header>
          <View style={styles.HeadScrore}>
            <View style={[styles.scrorecard, { borderRightWidth: 1 }]}>
              <Title style={{ color: 'black' }}>Score</Title>
              <Text style={styles.textNum}>{report.quiz.user_score}</Text>
              <Text style={{ color: 'black' }}>
                out of {report.quiz.max_score}
              </Text>
            </View>
            <View style={[styles.scrorecard, { borderLeftWidth: 1 }]}>
              <Title style={{ color: 'black' }}>Time Taken</Title>
              <Text style={styles.textNum}>{report.quiz.time_taken}</Text>
              <Text style={{ color: 'black' }}>in {report.quiz.time} Min</Text>
            </View>
          </View>
          <View style={styles.quesanaContainer}>
            <Title style={{ color: 'black' }}>Question analysis</Title>
            <View style={styles.QuesNum}>
              {report.question_analysis.map((item, index) => {
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
                    <Text style={{ color: '#fff', fontSize: 20 }}>
                      {index + 1}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.quesdone}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginRight: 5,
                    backgroundColor: '#45B779',
                  }}
                />
                <Text style={{ color: 'black' }}>Correct</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginRight: 5,
                    backgroundColor: '#EA5D70',
                  }}
                />
                <Text style={{ color: 'black' }}>Wrong</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginRight: 5,
                    backgroundColor: '#CCCCCC',
                  }}
                />
                <Text style={{ color: 'black' }}>Unattempted</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                contentStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
                color={Colors.secondary}
                mode="text"
                onPress={() =>
                  navigation.navigate('introquiz', {
                    qid: qid,
                    data: report.quiz,
                  })
                }>
                Re-Attempt
              </Button>
              <Button
                color={Colors.secondary}
                contentStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
                mode="text"
                onPress={() =>
                  navigation.navigate('Solution', {
                    qid: qid,
                    lang: report.quiz.language,
                    nmark: report.quiz.marks,
                    pmark: report.quiz.negative_mark,
                  })
                }>
                View Solution
              </Button>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        dark ? { backgroundColor: '#212121' } : { backgroundColor: '#CCCCCC' },
      ]}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <ScrollView style={{ flex: 1 }}>{renderQA()}</ScrollView>
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

export default HistoryDetail;

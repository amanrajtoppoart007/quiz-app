import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {
  Appbar,
  Card,
  Divider,
  Title,
  Button,
  FAB,
  Modal,
  RadioButton,
  Text,
  TextInput,
} from 'react-native-paper';
import ConfirmSubmit from '../../Components/ConfirmSubmit';
import { Colors, fontStyle, baseUrl } from '../../Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');
const OptionA = require('../../Assets/imgs/OptionA.png');
const OptionB = require('../../Assets/imgs/OptionB.png');
const OptionC = require('../../Assets/imgs/OptionC.png');
const OptionD = require('../../Assets/imgs/OptionD.png');
const PickA = require('../../Assets/imgs/PickA.png');
const PickB = require('../../Assets/imgs/PickB.png');
const PickC = require('../../Assets/imgs/PickC.png');
const PickD = require('../../Assets/imgs/PickD.png');
import axios from 'axios';
import { getData } from '../../AsyncStorage';
import ProgressLoader from 'rn-progress-loader';
import { useTheme } from '@react-navigation/native';

const StartQuiz = ({ navigation, route }) => {
  const { quizId, nmark, pmark, data } = route.params;
  const [visible, setVisible] = React.useState(false);
  const [counter, setcounter] = useState(1);
  const [showsec, setsec] = useState(0);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showTimeout = () => setistimeout(true);
  const hideTimeout = () => setistimeout(false);
  const [showReportPanel, setshowReportPanel] = useState(false);
  const showReport = () => setshowReportPanel(true);
  const hideReport = () => setshowReportPanel(false);
  const [loading, setLoading] = useState(false);
  const [language, setlanguage] = useState('english');
  const [allquestion, setallquestion] = useState([]);
  const [presentindx, setpresentindx] = useState([]);
  const [bmark, setbmark] = useState(false);
  const [istimeout, setistimeout] = useState(false);
  const [onsubmit, setonsubmit] = useState(false);
  const [ongoback, setongoback] = useState(false);
  const [chooselang, setchooselang] = useState(false);
  const showlang = () => setchooselang(true);
  const hidelang = () => setchooselang(false);
  const [token, settoken] = useState(null);
  const [nextqpos, setnextqpos] = useState([]);
  const [underReview, setunderReview] = useState([]);
  const [ReportIs, setReportIs] = useState('1');
  const [reportId, setReportId] = useState(null);
  const [reportDesc, setreportDesc] = useState('');

  const [optons, setoption] = useState({
    qids: [],
    opts: [],
  });

  const [ref, setref] = useState(null);
  useEffect(() => {
    FetchQuizQuestions();
  }, [language]);

  const { colors, dark } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setongoback(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const FetchQuizQuestions = async () => {
    setLoading(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    axios
      .get(`${baseUrl}questions/${language}/${quizId}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        if (response.data.status) {
          setcounter(response.data.time / 60 - 1);
          setallquestion(response.data.data);
          if (response.data.bookmark == 1) {
            setbmark(true);
          }
          setLoading(false);
        } else {
          Alert.alert('Oop', 'Sorry No data found', [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            },
          ]);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (counter > 0 || showsec > 0) {
      if (showsec == 0) {
        setsec(60);
        setcounter(counter - 1);
      }
      //setcounter(counter-1)
      const timer = setInterval(() => setsec(showsec => showsec - 1), 1000);
      return () => clearInterval(timer);
    } else if (counter == 0 && showsec == 0) {
      showTimeout();
    }
  }, [counter, showsec]);

  const addtheOption = (qid, opt, index) => {
    console.log('Index', index);
    presentindx[index] = opt;
    console.log(presentindx);
    if (optons.qids.includes(qid)) {
      var getindx = optons.qids.indexOf(qid);
      if (optons.opts[getindx] == opt) {
        console.log('Hey it is already present here');
        optons.opts.splice(getindx, 1);
        optons.qids.splice(getindx, 1);
      } else {
        optons.opts[getindx] = opt;
        optons.opts.splice(getindx, 1);
        optons.qids.splice(getindx, 1);
        setoption({ qids: [...optons.qids, qid], opts: [...optons.opts, opt] });
      }
      // console.log('hey i tis', getindx, qid);
    } else {
      setoption({ qids: [...optons.qids, qid], opts: [...optons.opts, opt] });
    }

    console.log(optons);
  };

  const showOptionsA = qid => {
    var bgcolr = false;
    var indeofqid = optons.qids.indexOf(qid);
    // console.log(qid)
    if (indeofqid == -1) {
      return (
        <Image
          source={OptionA}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }

    if (optons.opts[indeofqid] == 'a') {
      bgcolr = true;
      return (
        <Image
          source={PickA}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    } else {
      return (
        <Image
          source={OptionA}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
  };

  const showOptionsB = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return (
        <Image
          source={OptionB}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
    if (optons.opts[indeofqid] == 'b') {
      return (
        <Image
          source={PickB}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    } else {
      return (
        <Image
          source={OptionB}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
  };

  const showOptionsC = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return (
        <Image
          source={OptionC}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
    if (optons.opts[indeofqid] == 'c') {
      return (
        <Image
          source={PickC}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    } else {
      return (
        <Image
          source={OptionC}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
  };
  const showOptionsD = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return (
        <Image
          source={OptionD}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
    if (optons.opts[indeofqid] == 'd') {
      return (
        <Image
          source={PickD}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    } else {
      return (
        <Image
          source={OptionD}
          resizeMode="center"
          style={{ width: 40, height: 40 }}
        />
      );
    }
  };

  const setbgA = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return false;
    }

    if (optons.opts[indeofqid] == 'a') {
      return true;
    } else {
      return false;
    }
  };
  const setbgB = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return false;
    }

    if (optons.opts[indeofqid] == 'b') {
      return true;
    } else {
      return false;
    }
  };
  const setbgC = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return false;
    }

    if (optons.opts[indeofqid] == 'c') {
      return true;
    } else {
      return false;
    }
  };
  const setbgD = qid => {
    var indeofqid = optons.qids.indexOf(qid);
    if (indeofqid == -1) {
      return false;
    }

    if (optons.opts[indeofqid] == 'd') {
      return true;
    } else {
      return false;
    }
  };

  const scrollNext = indx => {
    console.log(indx, ' ');
    //5>4
    if (allquestion.length - 1 > indx) {
      ref.scrollTo({
        x: 0,
        y: nextqpos[indx + 1],
        animated: true,
      });
    }
  };

  const renderCardData = () => {
    return allquestion.map((item, index) => {
      return (
        <Card
          onLayout={event => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setnextqpos(nextqpos => [...nextqpos, parseInt(y)]);
          }}
          key={item.id}
          style={[{ marginBottom: 8, backgroundColor: colors.background }]}>
          <View style={styles.subheader}>
            <Title style={[dark ? { color: '#fff' } : { color: '#212121' }]}>
              Q. {index + 1}
            </Title>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: 100,
                alignItems: 'center',
              }}>
              <MaterialIcons
                name="report-problem"
                onPress={() => {
                  showReport(), setReportId(item.id);
                }}
                size={25}
                color={'#fcbe11'}
              />
              <Text
                style={[
                  { fontFamily: fontStyle.Sophisto },
                  dark ? { color: '#fff' } : { color: '#212121' },
                ]}>
                +{pmark} , -{nmark}
              </Text>
            </View>
          </View>

          <Divider
            style={[
              { borderBottomWidth: 1.5 },
              dark ? { borderColor: '#fff' } : { borderColor: '#212121' },
            ]}
          />
          <Text
            style={[
              styles.QusTxt,
              dark ? { color: '#fff' } : { color: '#212121' },
            ]}>
            {item.question}
          </Text>
          {item.question_image != null ? (
            <Image
              resizeMode="contain"
              style={{
                width: width - 50,
                height: 360,
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
                onPress={() => {
                  addtheOption(item.id, 'a', index), scrollNext(index);
                }}
                style={[
                  styles.OptionSty,
                  setbgA(item.id) == true
                    ? { backgroundColor: '#D6EBFE' }
                    : { backgroundColor: '#fff' },
                ]}>
                {showOptionsA(item.id)}
                {item.option_a_image != null ? (
                  <Image
                    source={{
                      uri: item.option_a_image,
                    }}
                    resizeMode="contain"
                    style={{ width: width / 2, height: 100 }}
                  />
                ) : (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      flexShrink: 1,
                    }}>
                    {item.option_a}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  addtheOption(item.id, 'b'), scrollNext(index);
                }}
                style={[
                  styles.OptionSty,
                  setbgB(item.id) == true
                    ? { backgroundColor: '#D6EBFE' }
                    : { backgroundColor: '#fff' },
                ]}>
                {showOptionsB(item.id)}
                {item.option_b_image != null ? (
                  <Image
                    source={{
                      uri: item.option_b_image,
                    }}
                    resizeMode="contain"
                    style={{ width: width / 2, height: 100 }}
                  />
                ) : (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      flexShrink: 1,
                    }}>
                    {item.option_b}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  addtheOption(item.id, 'c'), scrollNext(index);
                }}
                style={[
                  styles.OptionSty,
                  setbgC(item.id) == true
                    ? { backgroundColor: '#D6EBFE' }
                    : { backgroundColor: '#fff' },
                ]}>
                {showOptionsC(item.id)}
                {item.option_c_image != null ? (
                  <Image
                    source={{
                      uri: item.option_c_image,
                    }}
                    resizeMode="contain"
                    style={{ width: width / 2, height: 100 }}
                  />
                ) : (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      flexShrink: 1,
                    }}>
                    {item.option_c}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  addtheOption(item.id, 'd'), scrollNext(index);
                }}
                style={[
                  styles.OptionSty,
                  setbgD(item.id) == true
                    ? { backgroundColor: '#D6EBFE' }
                    : { backgroundColor: '#fff' },
                ]}>
                {showOptionsD(item.id)}
                {item.option_d_image != null ? (
                  <Image
                    source={{
                      uri: item.option_d_image,
                    }}
                    resizeMode="contain"
                    style={{ width: width / 2, height: 100 }}
                  />
                ) : (
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: fontStyle.Sophisto,
                      fontSize: 20,
                      color: 'black',
                      flexShrink: 1,
                    }}>
                    {item.option_d}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      );
    });
  };

  const getbackColo = tid => {
    if (optons.qids.indexOf(tid) != -1) {
      return { backgroundColor: '#00BD01' };
    } else if (underReview.indexOf(tid) != -1) {
      return { backgroundColor: Colors.tertiary };
    } else {
      return { backgroundColor: Colors.lightgrey };
    }
  };

  const showOptionsNavigater = () => {
    // console.log("Checks",underReview.indexOf(1))
    return allquestion.map((item, index) => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            ref.scrollTo({
              x: 0,
              y: nextqpos[index],
              animated: true,
            })
          }
          style={[styles.numbtn, getbackColo(item.id)]}>
          <Text style={styles.numtxt}>{index + 1}</Text>
        </TouchableOpacity>
      );
    });
  };

  const BookmarkQuiz = () => {
    axios
      .get(`${baseUrl}bookmark/${quizId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        if (response.data.status) {
          setbmark(true);
          console.log(response.data.msg);
        } else {
          Alert.alert('OOps', response.data.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const unBookmarkQuiz = () => {
    axios
      .get(`${baseUrl}unbookmark/${quizId}`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        if (response.data.status) {
          setbmark(false);
          console.log(response.data.msg);
        } else {
          Alert.alert('OOps', response.data.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const FinalSubmitQuiz = () => {
    console.log(optons);
    setLoading(true);
    axios
      .post(
        `${baseUrl}submit-quiz`,
        {
          quiz_id: quizId,
          answers: [optons],
          language: language,
          time: [counter, showsec],
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(function (response) {
        if (response.data.status) {
          navigation.navigate('Result', {
            resdata: response.data.data,
            lang: language,
            qid: quizId,
            data: data,
            timtaken: [counter, showsec],
          });
        } else {
          Alert.alert('OOps', response.data.msg);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const SubmitReport = () => {
    var rep_type = '';
    if (ReportIs == '1') {
      rep_type = 'translation error';
    } else if (ReportIs == '2') {
      rep_type = 'answer error';
    } else if (ReportIs == '3') {
      rep_type = 'question error';
    }

    if (reportDesc != '') {
      rep_type = 'description';
    }
    console.log(reportId);
    const AuthStr = 'Bearer '.concat(token);
    axios
      .post(
        `${baseUrl}report`,
        {
          question_no: reportId,
          type: rep_type,
          description: reportDesc,
        },
        {
          headers: {
            Authorization: AuthStr,
          },
        },
      )
      .then(response => {
        // If request is good...
        if (response.data.status) {
          hideReport();
          ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
          setunderReview(underReview => [...underReview, reportId]);
        } else {
          Alert.alert(response.data.msg);
        }
      })
      .catch(error => {
        console.log('error ' + error);
      });

    console.log(rep_type);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: Colors.primary }}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          color={'#fff'}
          title={counter + ' min : ' + showsec + ' secs'}
        />
        <Appbar.Action
          color={'#fff'}
          animated={false}
          icon={props => (
            <FontAwesome color={'#fff'} name="language" size={25} />
          )}
          onPress={() => {
            showlang(),
              setoption({
                qids: [],
                opts: [],
              });
          }}
        />
        <Appbar.Action
          color={'#fff'}
          animated={false}
          icon={bmark ? 'bookmark' : 'bookmark-outline'}
          onPress={() => (bmark ? unBookmarkQuiz() : BookmarkQuiz())}
        />
      </Appbar.Header>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <ScrollView ref={ref => setref(ref)} style={styles.QuesContainer}>
        {renderCardData()}
        <Button
          mode="contained"
          color={Colors.secondary}
          labelStyle={{ color: '#fff', fontSize: 18 }}
          contentStyle={{ paddingVertical: 5 }}
          onPress={() => setonsubmit(true)}>
          SUBMIT TEST
        </Button>
      </ScrollView>

      <Modal
        visible={visible}
        onDismiss={hideModal} 
        contentContainerStyle={styles.containerStyle2}>
        <View>
          <View style={styles.ansheadcontainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 13,
                  marginRight: 3,
                  backgroundColor: '#00BD01',
                }}
              />
              <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold' }}>
                Answered
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 13,
                  marginRight: 3,
                  backgroundColor: Colors.tertiary,
                }}
              />
              <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold' }}>
                In Review
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 13,
                  marginRight: 3,
                  backgroundColor: 'grey',
                }}
              />
              <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold' }}>
                Not Answered
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {showOptionsNavigater()}
          </View>
        </View>
      </Modal>
      {/* <View style={{flex:1,justifyContent:'center',alignItems:'center',borderWidth:2}}> */}
      <Modal
        visible={istimeout}
        dismissable={false}
        contentContainerStyle={{
          height: height / 3.5,
          backgroundColor: '#fff',
          marginHorizontal: 10,
          borderRadius: 20,
        }}>
        <ConfirmSubmit
          title={`Oops Timeout`}
          description={`Sorry, Your have limited time for give this test and that time is over now please click on "Submit Test" to get to the Result Screen.`}
          showCancel={false}
          onCancel={() => hideTimeout()}
          onPress={() => FinalSubmitQuiz()}
        />
      </Modal>
      {/*This modal is when user click on submit button then we ask for confirmation*/}
      <Modal
        visible={onsubmit}
        dismissable={true}
        contentContainerStyle={{
          height: height / 3.5,
          backgroundColor: '#fff',
          marginHorizontal: 10,
          borderRadius: 20,
        }}>
        <ConfirmSubmit
          title={`Submit Test`}
          description={`Click on CONFIRM to submit the test and view solutions.`}
          // description={`Are you confirm that you want to submit this test, To confirm you can click on Submit Test or you can click on cancel`}
          showCancel={true}
          onCancel={() => setonsubmit(false)}
          onPress={() => FinalSubmitQuiz()}
        />
      </Modal>
      {/* Ende of user submit confirmation */}
      {/* when user click on going back*/}
      <Modal
        visible={ongoback}
        dismissable={true}
        contentContainerStyle={{
          height: height / 3.5,
          backgroundColor: '#fff',
          marginHorizontal: 10,
          borderRadius: 20,
        }}>
        <ConfirmSubmit
          title={`Quit this Test`}
          description={`Do you want to quit this Test ?`}
          showCancel={true}
          onCancel={() => setongoback()}
          mainbtn={`Yes`}
          onPress={() => navigation.goBack()}
        />
      </Modal>
      {/* end of going back confirmation */}
      {/* </View> */}
      {/* <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> */}
      <Modal
        visible={showReportPanel}
        onDismiss={hideReport}
        style={{ justifyContent: 'center', alignItems: 'center' }}
        contentContainerStyle={{
          width: width - 50,
          backgroundColor: 'white',
          padding: 10,
        }}>
        <View style={{ borderWidth: 2 }}>
          <Title style={{ textAlign: 'center', color: '#212121' }}>
            Report Question
          </Title>
          <View>
            <TouchableOpacity
              onPress={() => setReportIs('1')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="1"
                status={ReportIs === '1' ? 'checked' : 'unchecked'}
                onPress={() => setReportIs('1')}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                Translation Error
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setReportIs('2')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="2"
                status={ReportIs === '2' ? 'checked' : 'unchecked'}
                onPress={() => setReportIs('2')}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                Answer Error
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setReportIs('3')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="3"
                status={ReportIs === '3' ? 'checked' : 'unchecked'}
                onPress={() => setReportIs('3')}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                Question Error
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[
                { marginHorizontal: 5, marginBottom: 10 },
                dark ? { backgroundColor: '#212121' } : { backgroundColor: '#fff' },
              ]}
              label="Description"
              theme={{ colors: { placeholder: colors.text } }}
              value={reportDesc}
              color={dark ? '#fff' : '#212121'}
              onChangeText={text => setreportDesc(text)}
              multiline={true}
              outlineColor={'#212121'}
              numberOfLines={5}
              mode="outlined"
            />
          </View>
          <Button
            style={{ width: '70%', alignSelf: 'center', marginBottom: 10 }}
            mode="contained"
            color={Colors.tertiary}
            onPress={() => SubmitReport()}>
            Submit
          </Button>
        </View>
      </Modal>
      {/* </View> */}
      {/* Language selection modal*/}
      <Modal
        visible={chooselang}
        onDismiss={hidelang}
        style={{ justifyContent: 'center', alignItems: 'center' }}
        contentContainerStyle={{
          width: width - 50,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
        }}>
        <View style={{ borderWidth: 2, borderRadius: 10, }}>
          <Title style={{ textAlign: 'center', color: '#212121' }}>
            Choose Language
          </Title>
          <View>
            <TouchableOpacity
              onPress={() => setlanguage('english')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="english"
                status={language === 'english' ? 'checked' : 'unchecked'}
                onPress={() => { setlanguage('english'), hidelang() }}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setlanguage('hindi')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="hindi"
                status={language === 'hindi' ? 'checked' : 'unchecked'}
                onPress={() => { setlanguage('hindi'), hidelang() }}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                Hindi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setlanguage('tamil')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RadioButton
                color={Colors.primary}
                uncheckedColor={'grey'}
                value="tamil"
                status={language === 'tamil' ? 'checked' : 'unchecked'}
                onPress={() => { setlanguage('tamil'), hidelang() }}
              />
              <Text style={{ marginLeft: 10, fontSize: 18, color: '#212121' }}>
                Telugu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* End of Language selection modal */}
      <FAB
        style={styles.fab}
        icon="menu"
        color={'#fff'}
        onPress={() => showModal()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCCCCC',
  },
  OptionContainer: {
    padding: 10,
    flexDirection: 'column',
    //width:'95%',
    justifyContent: 'center',
    //alignItems:'center'
  },
  OptionSty: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    padding: 5,
    width: width - 20,
    marginBottom: 5,
    borderRadius: 10
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
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.secondary,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height / 4,
  },
  containerStyle2: {
    backgroundColor: 'white',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  ansheadcontainer: {
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    borderColor: Colors.lightgrey,
  },
  numbtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 15,
    marginTop: 10,
  },
  numtxt: {
    fontSize: 18,
    fontFamily: fontStyle.Sophisto,
    fontWeight: 'bold',
  },
});

export default StartQuiz;

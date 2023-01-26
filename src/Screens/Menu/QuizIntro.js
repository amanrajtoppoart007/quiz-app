import React,{useCallback} from 'react';
import {View, StyleSheet, Modal, Dimensions, BackHandler} from 'react-native';
import {
  Appbar,
  Headline,
  Button,
  Text
} from 'react-native-paper';
import ConfirmModal from '../../Components/ConfirmModal';
import {Colors, fontStyle} from '../../Constant';
import {useTheme, useFocusEffect} from '@react-navigation/native';
const quizImage = require('../../Assets/imgs/working.png');
const {width, height} = Dimensions.get('screen');
const QuizIntro = ({navigation, route}) => {
  const {qid, data} = route.params;
  console.log(qid);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const {dark} = useTheme()

  useFocusEffect(
    useCallback(()=>{
      const backAction = () => {
       navigation.goBack()
       return true
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
  
      return () => backHandler.remove();
    },[])
  )

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title={"Let's Start the Test"} />
      </Appbar.Header>
      <View style={styles.SecContainer}>
        <View style={styles.headerTopSec}>
          <Headline style={[{textAlign: 'center'},dark?{color:'#fff'}:{color:'#212121'}]}>{data.name}</Headline>
          <Text style={[{textAlign: 'center', fontSize: 15},dark?{color:'#fff'}:{color:'#212121'}]}>
            Total Questions : {data.question_count}, All The Best
          </Text>
        </View>
        {/* Image Section */}

        {/* Detail of quiz section */}
        <View style={styles.quizdetails}>
          <View style={styles.subsec}>
            <Text style={[styles.titsty,dark?{color:'#fff'}:{color:'#212121'}]}>Time :</Text>
            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              {data.time} min
            </Text>
          </View>
          <View style={styles.subsec}>
            <Text style={[styles.titsty,dark?{color:'#fff'}:{color:'#212121'}]}>Language :</Text>
            <Text style={{color: 'grey', fontWeight: 'bold'}}>Eng/Telugu</Text>
          </View>
          <View style={styles.subsec}>
            <Text style={[styles.titsty,dark?{color:'#fff'}:{color:'#212121'}]}>Mark{`(+)`} :</Text>
            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              +{data.pmark}
            </Text>
          </View>
          <View style={styles.subsec}>
            <Text style={[styles.titsty,dark?{color:'#fff'}:{color:'#212121'}]}>Mark {`(-)`} :</Text>
            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              {data.isnegmarking == 0 ? 'No Negative' : -data.nmark}
            </Text>
          </View>
        </View>

        {/* Defficult Level Section */}
        {/* <View style={styles.levelsty}>
                    <View style={styles.levelinner}>
                        <Text style={styles.leveltext}>{data.level.easy}</Text>
                        <Text style={styles.leveltext}>Easy</Text>
                    </View>
                    <View style={styles.levelinner}>
                        <Text style={styles.leveltext}>{data.level.med}</Text>
                        <Text style={styles.leveltext}>Mid</Text>
                    </View>
                    <View style={styles.levelinner}>
                        <Text style={styles.leveltext}>{data.level.hard}</Text>
                        <Text style={styles.leveltext}>Tough</Text>
                    </View>
                </View> */}
        {/* Start Button */}
        <View style={{marginTop: 30}}>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{color: '#fff', fontSize: 18}}
            contentStyle={{paddingVertical: 5}}
            onPress={() =>
             showModal()}>
            Start Test
          </Button>
        </View>
        <View style={{marginTop: 30}}>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{color: '#fff', fontSize: 18}}
            contentStyle={{paddingVertical: 5}}
            onPress={() => {navigation.navigate("Home")}}>
            Back to Test Home
          </Button>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      >
        <ConfirmModal GoConfirm={() =>{
            hideModal(),
            navigation.navigate('StartQuiz', {
            quizId: qid,
            nmark: data.nmark,
            pmark: data.pmark,
            data: data,
            })}} onPress={()=>hideModal()} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff',
  },
  HeadTopSec: {
    borderWidth: 2,
  },
  SecContainer: {
    //flex: 1,
    margin: 20,
    //borderWidth: 2,
    flexDirection: 'column',
  },
  headerTopSec: {
    //alignContent:'center',
    //borderWidth:2
  },
  quizdetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // borderWidth: 2 .
    marginTop: 10,
  },
  subsec: {
    width: width / 2.3,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 5,
    borderColor: Colors.secondary,
    marginBottom: 8,
  },
  titsty: {
    fontSize: 15,
    //color: 'black',
    fontWeight: 'bold',
    fontFamily: fontStyle.MardenBold,
  },
  levelsty: {
    flexDirection: 'row',
    //borderWidth: 2,
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  levelinner: {
    //borderWidth: 2,
    width: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderRadius: 15,
    elevation: 4,
  },
  leveltext: {
    fontSize: 25,
    color: 'black',
    fontFamily: fontStyle.MardenBold,
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});

export default QuizIntro;

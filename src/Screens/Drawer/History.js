import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {Appbar, Snackbar, Title, Button} from 'react-native-paper';
import {Colors, fontStyle, baseUrl} from '../../Constant';
import ProgressLoader from 'rn-progress-loader';
import {getData} from '../../AsyncStorage';
import {FlatList} from 'react-native-gesture-handler';
const bgcard = require('../../Assets/bg/cardme.png');
const {width, height} = Dimensions.get('screen');
import axios from 'axios';
const History = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [allhistory, setallhistory] = useState([]);
  const [page, setpage] = useState(1);
  const [token, settoken] = useState(null);
  const [snakvisible, setSnakVisible] = React.useState(false);
  const onDismissSnackBar = () => setSnakVisible(false);
  const onToggleSnackBar = () => setSnakVisible(!snakvisible);
//   useEffect(() => {
//     fetchBookmarkQuiz();
//   }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        fetchBookmarkQuiz();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  const {dark, colors} = useTheme();

  const fetchBookmarkQuiz = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    console.log("Page",page)
    console.log(Token);
    axios
      .get(baseUrl + `quiz-history?page=${page}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // If request is good...
        console.log("Data",response.data.data);
        setVisible(false);
        setallhistory(response.data.data);
      })
      .catch(error => {
        console.log('error ' + error);
        setVisible(false);
      });
  };

  const renderHistoryData = (item, index) => {
    return (
      <View key={item.id} style={styles.Quizcontainer}>
        <ImageBackground
          source={bgcard}
          style={{height: height / 5, padding: 15}}>
          <Title style={{color: '#000'}}>{item.quiz_name}</Title>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Time Taken:</Text>
              <Text>{item.time_taken} Min</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Score:</Text>
              <Text>{item.user_score}/{item.max_score}</Text>
            </View>
          </View>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Mark(+):</Text>
              <Text>{item.marks}</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Mark(-):</Text>
              <Text>{item.negative_mark}</Text>
            </View>
          </View>
          <View style={{marginTop: 10,alignItems:'flex-end'}}>
            <Button
              mode="contained"
              style={{width: '50%',}}
              labelStyle={{color: '#fff'}}
              color={Colors.secondary}
              onPress={() =>
                navigation.navigate('historydetail', {
                  qid: item.id})
              }>
              See More
            </Button>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const loadMoreResults = () => {
    var nextpage = page + 1;
    setpage(nextpage);
    console.log('Next Page', nextpage);
    axios
      .get(`${baseUrl}quiz-history?page=${nextpage}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          //console.log(response.data.data);
          setallhistory(allhistory => [
            ...allhistory,
            ...response.data.data,
          ]);
        } else {
          onToggleSnackBar();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title="Quiz History" />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <View>
        <FlatList
          data={allhistory}
          renderItem={({item, index}) => renderHistoryData(item, index)}
          keyExtractor={item => 'item_' + item.id}
          onEndReachedThreshold={0.01}
          onEndReached={({distanceFromEnd}) => {
            console.log('Distance from end', distanceFromEnd);
            if (distanceFromEnd <= 0) return;
            loadMoreResults();
          }}
        />
        <Snackbar visible={snakvisible} onDismiss={onDismissSnackBar}>
          No More Test Found
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Quizcontainer: {
    // borderWidth: 2,
    marginBottom: 10,
    borderColor: 'red',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
    paddingTop: 5,
  },
  OutterContiner: {
    //borderWidth: 2,
    marginHorizontal: 15,
    marginTop: 10,
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
});

export default History;

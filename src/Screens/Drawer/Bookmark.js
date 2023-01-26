import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Appbar, Snackbar, Title, Button} from 'react-native-paper';
import {Colors, fontStyle, baseUrl} from '../../Constant';
import {getData} from '../../AsyncStorage';
import {FlatList} from 'react-native-gesture-handler';
const bgcard = require('../../Assets/bg/cardme.png');
const {width, height} = Dimensions.get('screen');
import ProgressLoader from 'rn-progress-loader';
import {useTheme} from '@react-navigation/native';
const Bookmark = ({navigation}) => {
  const [allbookmark, setallbookmark] = useState([]);
  const [page, setpage] = useState(1);
  const [token, settoken] = useState(null);
  const [snakvisible, setSnakVisible] = React.useState(false);
  const onDismissSnackBar = () => setSnakVisible(false);
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setSnakVisible(!snakvisible);
  useEffect(() => {
    fetchBookmarkQuiz();
  }, []);

  const {colors} = useTheme()

  const fetchBookmarkQuiz = async () => {
    setVisible(true)
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    console.log(Token);
    axios
      .get(baseUrl + `bookmarks?page=${page}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // If request is good...
        console.log(response.data.data);
        setVisible(false)
        setallbookmark(response.data.data);
      })
      .catch(error => {
        console.log('error ' + error);
        setVisible(false)
      });
  };

  const renderBookmarkData = (item, index) => {
    return (
      <View key={item.id} style={styles.Quizcontainer}>
        <ImageBackground
          source={bgcard}
          style={{height: height / 5, padding: 15}}>
          <Title style={{color:'#000'}}>{item.quiz_name}</Title>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Time:</Text>
              <Text>{item.time} Min</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Questions:</Text>
              <Text>{item.question_count}</Text>
            </View>
          </View>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Create:</Text>
              <Text>{item.create_date}</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                {width: '50%', justifyContent: 'flex-start'},
              ]}>
              <Text style={styles.tisty}>Attemps:</Text>
              <Text>{item.attempted_user}</Text>
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
              START QUIZ
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
      .get(`${baseUrl}bookmarks?page=${nextpage}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          //console.log(response.data.data);
          setallbookmark(allbookmark => [
            ...allbookmark,
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
    <View style={[{flex:1},{backgroundColor:colors.background}]}>
      <Appbar.Header style={{backgroundColor: Colors.primary}}>
        <Appbar.BackAction
          color="#fff"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title="Bookmark" />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <FlatList
        data={allbookmark}
        renderItem={({item, index}) => renderBookmarkData(item, index)}
        keyExtractor={item => 'item_' + item.id}
        onEndReachedThreshold={0.01}
        onEndReached={({distanceFromEnd}) => {
          console.log('Distance from end', distanceFromEnd);
          if (distanceFromEnd <= 0) return;
          loadMoreResults();
        }}
      />
      <Snackbar visible={snakvisible} onDismiss={onDismissSnackBar}>
        No More Quiz Found
      </Snackbar>
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

export default Bookmark;

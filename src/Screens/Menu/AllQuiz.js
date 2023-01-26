import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  BackHandler,
  FlatList,
  Alert,
} from 'react-native';
import { Appbar, Snackbar, Title, Button, Text, Headline } from 'react-native-paper';
import { Colors, fontStyle, baseUrl } from '../../Constant';
const bgcard = require('../../Assets/bg/cardme.png');
import { useTheme, useFocusEffect } from '@react-navigation/native';
const { width, height } = Dimensions.get('screen');
import axios from 'axios';
import { getData } from '../../AsyncStorage';
import ProgressLoader from 'rn-progress-loader';
import CustomInput from '../../Components/CustomInput';
const AllQuiz = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [filteredSubData, setFilteredSubData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { qname, catid, sub_cat } = route.params;
  const [listItems, setlistItems] = useState([]);
  const [page, setpage] = useState(1);
  const [token, settoken] = useState(null);
  const [visible, setVisible] = useState(false);
  const [snakvisible, setSnakVisible] = React.useState(false);
  const onDismissSnackBar = () => setSnakVisible(false);
  const onToggleSnackBar = () => setSnakVisible(!snakvisible);
  useEffect(() => {
    console.log(qname, catid, sub_cat);
    setVisible(true);
    fetchInitialData();
  }, []);

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

  const { colors, dark } = useTheme()

  const fetchInitialData = async () => {
    // setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    axios
      .get(`${baseUrl}quizes/${catid}/${sub_cat}?page=${page}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          //console.log(response.data.data);
          setlistItems(response.data.data.data);
        } else {
          Alert.alert('Oop', 'Sorry No data found', [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
            },
          ]);
        }
        setVisible(false);
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false);
      });
  };

  const renderCard = (item, index) => {
    return (
      <View key={item.id} style={styles.Quizcontainer}>
        <ImageBackground
          source={bgcard}
          style={{ height: height / 5, padding: 15 }}>
          <Headline style={{ color: '#212121' }}>{item.quiz_name}</Headline>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                { width: '50%', justifyContent: 'flex-start' },
              ]}>
              <Text style={styles.tisty}>Time:</Text>
              <Text style={styles.styleShowFont}>{item.time} Min</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                { width: '50%', justifyContent: 'flex-start' },
              ]}>
              <Text style={styles.tisty}>Questions:</Text>
              <Text style={styles.styleShowFont}>{item.question_count}</Text>
            </View>
          </View>
          <View style={styles.detailstyle}>
            <View
              style={[
                styles.detailstyle,
                { width: '50%', justifyContent: 'flex-start' },
              ]}>
              <Text style={styles.tisty}>Create:</Text>
              <Text style={styles.styleShowFont}>{item.created_date}</Text>
            </View>
            <View
              style={[
                styles.detailstyle,
                { width: '50%', justifyContent: 'flex-start' },
              ]}>
              <Text style={styles.tisty}>Attemps:</Text>
              <Text style={styles.styleShowFont}>{item.attempted_user}</Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              mode="contained"
              style={{ width: '50%' }}
              labelStyle={{ color: '#fff' }}
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
  };

  const loadMoreResults = () => {
    var nextpage = page + 1;
    setpage(nextpage);
    setVisible(true)
    console.log('Next Page', nextpage);
    axios
      .get(`${baseUrl}quizes/${catid}/${sub_cat}?page=${nextpage}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          //console.log(response.data.data);
          setVisible(false)
          setlistItems(listItems => [...listItems, ...response.data.data.data]);
        } else {
          onToggleSnackBar()
          setVisible(false)
        }
      })
      .catch(function (error) {
        console.log(error);
        setVisible(false)
      });
  };
  const onSearch = async (text) => {
    setSearch(text)
    setErrorMessage('')
    if (text) {
      // setVisible(true);
      const getToken = await getData('token');
      if (getToken.status) {
        var Token = getToken.data;
        settoken(Token);
      }
      console.log(`${baseUrl}search/quiz?search=${text}`, 'url');
      axios
        .get(`${baseUrl}search/quiz?search=${text}`, {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(response => {
          setErrorMessage('Test data not available')
          // If request is good...
          if (response.data.status) {
            if (response.data) {
              if (response.data.data) {
                setlistItems(response.data.data);
              }
            }
          } else {
            // Alert.alert('Oops', 'Sorry data available');
            setErrorMessage('Test data not available')
            setlistItems([])
          }
          setVisible(false);
        })
        .catch(error => {
          console.log('error ' + error);
          setVisible(false);
        });
    } else {
      fetchInitialData();
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <Appbar.Header style={{ backgroundColor: Colors.primary }}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title={qname + ` Test Set`} />
      </Appbar.Header>
      <View style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 5 }}>
        <CustomInput
          placeholder={`Search in ${qname} Subject`}
          keyboardType="default"
          iconname={'magnify'}
          value={search}
          onChangeText={text => onSearch(text)}
        />
      </View>
      {listItems.length > 0 ?
        (<FlatList
          showsVerticalScrollIndicator={false}
          style={styles.OutterContiner}
          data={listItems}
          renderItem={({ item, index }) => renderCard(item, index)}
          keyExtractor={item => 'item_' + item.id}
          onEndReachedThreshold={1}
          onEndReached={({ distanceFromEnd }) => {
            console.log('Distance from end', distanceFromEnd);
            if (distanceFromEnd < 0) return;
            loadMoreResults();
          }}
        />) : (<Text style={styles.txtError}>{errorMessage}</Text>)
      }
      <Snackbar
        visible={snakvisible}
        onDismiss={onDismissSnackBar}>
        No More Test Found
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Quizcontainer: {
    borderWidth: 2,
    marginBottom: 10,
    borderColor: Colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
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
  styleShowFont: {
    fontSize: 15,
    color: 'grey'
  },
  txtError: {
    marginTop: '15%',
    color: "#333",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default AllQuiz;

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, BackHandler } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Divider, Headline, Paragraph, Text } from 'react-native-paper';
import axios from 'axios';
import { Colors, fontStyle, baseUrl } from '../Constant';
import ProgressLoader from 'rn-progress-loader';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { getData } from '../AsyncStorage';
import CustomInput from '../Components/CustomInput';
const News = ({ navigation, stateChange }) => {
  const [allNewsData, setallNewsData] = useState([]);
  const [token, setToken] = useState(null);
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingLoadMore, setloadingLoadMore] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllNews();
  }, []);

  const { colors, dark } = useTheme()

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        stateChange('quiz')
        return true
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [])
  )

  const fetchAllNews = async () => {
    setVisible(true)
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      setToken(Token);
    }
    axios
      .get(`${baseUrl}news?page=1`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data.data);
          setallNewsData(response.data.data.data);
          //console.log(response.data.data.data.length)
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

  const renderNews = () => {
    return allNewsData.map((item, index) => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate('showNews', {
            newsid: item.id,
            next: item.next,
            prev: item.prev
          })}
          style={styles.newscontainer}>
          <View style={{ width: '60%' }}>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 20,
                fontFamily: fontStyle.MardenBold,
                fontWeight: 'bold',
                color: dark ? '#fff' : '#212121',
              }}>
              {item.title}
            </Text>
            <Paragraph style={[dark ? { color: '#fff' } : { color: '#212121' }]}>
              {item.description}...
            </Paragraph>
          </View>
          <View style={{ width: '30%' }}>
            <Image
              resizeMode="stretch"
              style={{ width: '100%', height: 110 }}
              source={{
                uri: item.image,
              }}
            />
          </View>
        </TouchableOpacity>
      );
    });
  };

  const LoadMoreData = () => {
    setloadingLoadMore(true)
    var nextPage = page + 1;
    setPage(nextPage);
    console.log("Page", page)
    axios
      .get(`${baseUrl}news?page=${nextPage}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data.data);
          setallNewsData(allNewsData => [...allNewsData, response.data.data.data]);
        } else {
          Alert.alert('Oop', 'No More Data');
        }
        setloadingLoadMore(false);
      })
      .catch(function (error) {
        console.log(error);
        setloadingLoadMore(false);
      });
  };

  const onSearch = async (text) => {
    setSearch(text)
    if (text) {
      // setVisible(true)
      const getToken = await getData('token');
      if (getToken.status) {
        var Token = getToken.data;
        setToken(Token);
      }
      axios
        .get(`${baseUrl}search/news?search=${text}`, {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data.status) {
            console.log(response.data.data);
            setallNewsData(response.data.data.data);
            //console.log(response.data.data.data.length)
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
    } else {
      fetchAllNews();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Headline style={[dark ? { color: '#fff' } : { color: '#212121' }]}>Important News and Information</Headline>
      {/* <Headline style={[dark?{color:'#fff'}:{color:'#212121'}]}>All News Are Here</Headline> */}
      {/* <Text style={[dark?{color:'#fff'}:{color:'#212121'}]}>All Current Affaire News are here</Text> */}

      <View style={{ marginTop: 10, marginBottom: 5 }}>
        <CustomInput
          placeholder={`Search..`}
          keyboardType="default"
          iconname={'magnify'}
          value={search}
          onChangeText={text => onSearch(text)}
        />
      </View>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      {renderNews()}
      {allNewsData.length > 10 ? <Button
        onPress={() => LoadMoreData()}
        color={Colors.secondary}
        loading={loadingLoadMore}>
        Load More News
      </Button> : <View></View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth:2
  },
  newscontainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 6,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
});

export default News;

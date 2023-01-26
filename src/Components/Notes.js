import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  BackHandler,
  ImageBackground,
  Image
} from 'react-native';
import { Button, Divider, Headline, Title, Text } from 'react-native-paper';
import { Colors, baseUrl } from '../Constant';
import { getData } from '../AsyncStorage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import ProgressLoader from 'rn-progress-loader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomInput from '../Components/CustomInput';
const { width, height } = Dimensions.get('screen');
const bgcard = require('../Assets/bg/cardme.png');

const Notes = ({ navigation, stateChange }) => {
  const [allnotesdata, setallnotesdata] = useState([]);
  const [token, settoken] = useState(null);
  const [loadingLoadMore, setloadingLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const { dark } = useTheme()

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        stateChange('quiz');
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const fetchAllNotes = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    axios
      .get(`${baseUrl}notes-categories`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(response => {
        // If request is good...
        if (response.data.status) {
          setallnotesdata(response.data.data.data);
          console.log(response.data.data.data)
        } else {
          Alert.alert('Oops', 'Sorry Note data available');
        }
        setVisible(false);
      })
      .catch(error => {
        console.log('error ' + error);
        setVisible(false);
      });
  };

  const LoadMoreData = () => {
    setloadingLoadMore(true);
    var nextPage = page + 1;
    setPage(nextPage);
    console.log('Page', page);
    axios
      .get(`${baseUrl}notes-categories?page=${nextPage}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data.status) {
          setallnotesdata(allnotesdata => [
            ...allnotesdata,
            response.data.data.data,
          ]);
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

  // const DownloadNotes = (link, noteid,name) => {
  //   let PictureDir = RNFetchBlob.fs.dirs.PictureDir
  //   let date = new Date();
  //   let options = {
  //     fileCache: true,
  //     addAndroidDownloads : {
  //       useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
  //       notification : true,
  //       path:  PictureDir + "/samyur"+Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
  //       description : 'Samyur_'+name
  //     }
  //   }
  //   Linking.canOpenURL(link).then(supported => {
  //     if (supported) {
  //       Linking.openURL(link).then(() => {
  //         updateDownload(noteid);
  //       });
  //     } else {
  //       RNFetchBlob.config(options).fetch('GET', link).then((res)=>{
  //         ToastAndroid.show("Downloading...",ToastAndroid.LONG);
  //         updateDownload(noteid)
  //       })
  //       console.log("Don't know how to open URI: " + link);
  //     }
  //   });
  // };

  // const updateDownload = nid => {
  //   setVisible(true);
  //   axios
  //     .get(`${baseUrl}update-downloads/${nid}`, {
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //       },
  //     })
  //     .then(response => {
  //       if (response.data.status) {
  //         console.log('Download added');
  //       }
  //       setVisible(false);
  //     })
  //     .catch(error => {
  //       console.log('error ' + error);
  //       setVisible(false);
  //     });
  // };

  const renderAllNotes = () => {
    return allnotesdata.map((item, index) => {
      return (
        <TouchableOpacity key={item.id}
          onPress={() => navigation.navigate('allnotes', {
            noteId: item.id,
            CatName: item.title
          })}
          style={styles.Quizcontainer}>
          <ImageBackground
            source={bgcard}
            style={styles.insideData}>
            <Image
              style={{ width: width / 7, height: '100%', resizeMode: 'contain' }}
              source={{ uri: item.image }} />
            <Title style={{ marginLeft: 20, color: '#212121' }}>{item.title}</Title>
          </ImageBackground>
        </TouchableOpacity>
      );
    });
  };

  const onSearch = async (text) => {
    setSearch(text)
    if (text) {
      // setVisible(true);
      const getToken = await getData('token');
      if (getToken.status) {
        var Token = getToken.data;
        settoken(Token);
      }
      axios
        .get(`${baseUrl}search/notes?search=${text}`, {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(response => {
          // If request is good...
          if (response.data.status) {

            if (response.data) {
              if (response.data.data) {
                // if (response.data.data.data) { 
                setallnotesdata(response.data.data);
                // console.log(response.data.data.data)
                // }
              }
            }
          } else {
            Alert.alert('Oops', 'Sorry Note data available');
          }
          setVisible(false);
        })
        .catch(error => {
          console.log('error ' + error);
          setVisible(false);
        });
    } else {
      fetchAllNotes();
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Headline style={[dark ? { color: '#fff' } : { color: '#212121' }]}>Subject wise Notes</Headline>
      {/* <Text style={[dark?{color:'#fff'}:{color:'#212121'}]}>All notes available for your preparation</Text> */}
      {/* <CustomInput
        placeholder={`Search..`}
        keyboardType="default"
        iconname={'magnify'}
        value={search}
        onChangeText={text => onSearch(text)}
      /> */}
      <Divider
        style={{
          marginVertical: 5,
          borderWidth: 0.3,
          borderColor: Colors.lightgrey,
        }}
      />
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      {renderAllNotes()}
      {allnotesdata.length > 10 ? (
        <Button
          onPress={() => LoadMoreData()}
          color={Colors.secondary}
          loading={loadingLoadMore}>
          Load More Notes
        </Button>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  Quizcontainer: {
    borderWidth: 2,
    marginBottom: 10,
    borderColor: Colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
  },
  insideData: {
    flexDirection: 'row',
    height: height / 8,
    padding: 15,
    alignItems: 'center'
  },
});

export default Notes;

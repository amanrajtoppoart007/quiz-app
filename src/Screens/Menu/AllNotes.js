import { View, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Appbar,
  Divider,
  List,
  Modal,
  Text,
  Title,
  Paragraph,
} from 'react-native-paper';
import { Colors, baseUrl, fontStyle } from '../../Constant';
import axios from 'axios';
import { getData } from '../../AsyncStorage';
import ProgressLoader from 'rn-progress-loader';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');
import { useTheme } from '@react-navigation/native';
import CustomInput from '../../Components/CustomInput';

const AllNotes = ({ navigation, route }) => {
  const { noteId, CatName } = route.params;
  console.log(noteId);
  const [allnotesdata, setallnotesdata] = useState([]);
  const [OpenNotes, setOpenNotes] = useState([]);
  const [token, settoken] = useState(null);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [openModal, setopenModal] = React.useState(false);
  const showopenModal = () => setopenModal(true);
  const hideopenModal = () => setopenModal(false);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setVisible(true);
    fetchAllNotes();
  }, []);

  const { dark } = useTheme();

  const fetchAllNotes = async () => {
    // setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
      settoken(Token);
    }
    axios
      .get(`${baseUrl}notes/${noteId}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(response => {
        // If request is good...
        if (response.data.status) {
          setallnotesdata(response.data.data);
          console.log(response.data.data);
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
    if (allnotesdata.length < 9) {
      return;
    }
    var nextPage = page + 1;
    setPage(nextPage);
    console.log('Page', page);
    axios
      .get(`${baseUrl}notes/${noteId}?page=${nextPage}`, {
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const ReadNotes = itemId => {
    console.log('Working', token);
    const AuthStr = 'Bearer '.concat(token);
    axios
      .get(`${baseUrl}get-notes/${itemId}`, {
        headers: {
          Authorization: AuthStr,
        },
      })
      .then(response => {
        // If request is good...
        setOpenNotes(response.data.data);
      })
      .catch(error => {
        console.log('error ' + error);
      });
    showopenModal();
  };

  const renderAllNotes = (item, index) => {
    return (
      <View
        style={{
          borderWidth: 2,
          borderRadius: 10,
          borderColor: Colors.secondary,
          marginTop: 10,
          marginHorizontal: 10,
        }}
        key={item.id}>
        <List.Item
          onPress={() => navigation.navigate('PDFViewer', {
            notes_url: item.note_url,
            notesid: item.id,
            favorite: item.favorite
          })}
          title={item.title}
          description={item.downloads + ' Read'}
          style={{ marginBottom: 8 }}
          titleStyle={[dark ? { color: '#fff' } : { color: '#212121' }]}
          descriptionStyle={[dark ? { color: '#fff' } : { color: '#212121' }]}
          left={props => (
            <List.Icon {...props} color={Colors.secondary} icon="note-text" />
          )}
        />
      </View>
    );
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
      axios
        .get(`${baseUrl}search/notes?search=${text}`, {
          headers: {
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(response => {
          // If request is good...
          setErrorMessage('Note data not available')
          if (response.data.status) {
            if (response.data) {
              if (response.data.data) {
                setallnotesdata(response.data.data);
              }
            }
          } else {
            // // Alert.alert('Oops', 'Sorry Note data available');
            // setErrorMessage('Note data not available')
            // setallnotesdata([])
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
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: Colors.primary }}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            if (openModal) {
              hideopenModal();
            } else {
              navigation.goBack();
            }
          }}
        />
        <Appbar.Content color="#fff" title={`All Notes Of ` + CatName} />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />

      <View style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 5 }}>
        <CustomInput
          placeholder={`Search..`}
          keyboardType="default"
          iconname={'magnify'}
          value={search}
          onChangeText={text => onSearch(text)}
        />
      </View>
      {allnotesdata.length > 0 ?
        (<FlatList
          data={allnotesdata}
          renderItem={({ item, index }) => renderAllNotes(item, index)}
          keyExtractor={item => item.id}
          onEndReached={LoadMoreData}
          onEndReachedThreshold={1}
        />) : (<Text style={styles.txtError}>{errorMessage}</Text>)
      }
      {/* <Modal
        visible={openModal}
        onDismiss={hideopenModal}
        contentContainerStyle={[{
          flex: 1,
          padding: 10,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          marginTop: 25,
        },[dark?{backgroundColor:'#212121'}:{backgroundColor:'#fff'}]]}>
        <ScrollView>
          <Title
            style={[
              {textAlign: 'center', fontSize: 25},
              [dark ? {color: '#fff'} : {color: '#212121'}],
            ]}>
            {OpenNotes.title}
          </Title>
          <Divider />
          <View
            style={{
              // borderWidth:2,
              marginTop: 15,
            }}>
            {renderDescription()}
          </View>
        </ScrollView>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insideData: {
    flexDirection: 'row',
    height: height / 8,
    padding: 15,
    alignItems: 'center',
  },
  Quizcontainer: {
    borderWidth: 2,
    marginBottom: 10,
    borderColor: Colors.secondary,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
  },
  txtError: {
    marginTop: '15%',
    color: "#333",
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default AllNotes;

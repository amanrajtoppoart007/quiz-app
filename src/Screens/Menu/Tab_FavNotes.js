import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {Colors, baseUrl, fontStyle} from '../../Constant';
import {getData} from '../../AsyncStorage';
import axios from 'axios';
import {Paragraph, List} from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';

const Tab_FavNotes = ({navigation}) => {
  const {dark, colors} = useTheme();
  const [favNotesData, setfavNotesData] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      fetchFavNotes();
      console.log('This is notes screen');
    });

    return unsubscribe;
  }, [navigation]);

  const fetchFavNotes = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(`${baseUrl}show-favorite-notes`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(response => {
        console.log(response.data);
        if (response.data.status) {
          console.log(response.data.data);
          setfavNotesData(response.data.data);
          setVisible(false);
        } else {
          setVisible(false);
          Alert.alert('OOps', response.data.msg);
        }
      })
      .catch(err => {
        setVisible(false);
        console.log('Error', err);
      });
  };

  const renderNotesData = () => {
    return favNotesData.map((item, index) => {
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
            onPress={() =>
              navigation.navigate('PDFViewer', {
                notes_url: item.note_url,
                notesid: item.notes_id,
                favorite: true,
              })
            }
            title={item.title}
            description={item.downloads + ' Read'}
            style={{marginBottom: 8}}
            titleStyle={[dark ? {color: '#fff'} : {color: '#212121'}]}
            descriptionStyle={[dark ? {color: '#fff'} : {color: '#212121'}]}
            left={props => (
              <List.Icon {...props} color={Colors.secondary} icon="note-text" />
            )}
          />
        </View>
      );
    });
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      {renderNotesData()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth:2
  },
  newscontainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 6,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
});

export default Tab_FavNotes;

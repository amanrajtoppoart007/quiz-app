import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler
} from 'react-native';
import { Appbar, Headline, Text } from 'react-native-paper';
const { height, width } = Dimensions.get('screen');
const ImageSize = width / 4;
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { Colors, fontStyle, baseUrl } from '../../Constant';
import axios from 'axios';
import { getData } from '../../AsyncStorage';
import ProgressLoader from 'rn-progress-loader';
import { ScrollView } from 'react-native-gesture-handler';
import CustomInput from '../../Components/CustomInput';

const Subcategory = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [filteredSubData, setFilteredSubData] = useState([]);
  const [subData, setsubData] = useState([]);
  const { catId, quizname } = route.params;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const { colors, dark } = useTheme();

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

  const fetchSubCategory = async () => {
    setVisible(true);
    const getToken = await getData('token');
    if (getToken.status) {
      var Token = getToken.data;
    }
    axios
      .get(`${baseUrl}sub-categories/${catId}`, {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(function (response) {
        if (response.data.status) {
          setsubData(response.data.data);
          setFilteredSubData(response.data.data);
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

  const renderSubCategory = () => {
    return subData.map((items, index) => {
      return (
        <TouchableOpacity
          key={items.id}
          onPress={() =>
            navigation.navigate('Allquizzes', {
              qname: items.sub_category_name,
              catid: catId,
              sub_cat: items.id,
            })
          }
          style={styles.MenuBox}>
          <Image
            resizeMode="stretch"
            style={{ width: ImageSize / 2, height: ImageSize / 2 }}
            source={{
              uri: items.image,
            }}
          />
          <Text style={[styles.UnderTitle, [dark ? { color: '#fff' } : { color: '#212121' }]]}>{items.sub_category_name}</Text>
        </TouchableOpacity>
      );
    });
  };

  const onSearch = (text) => {
    try {
      setSearch(text)
      if (text) {
        let filterText = text.toLowerCase()
        let filterData = subData.filter(item => {
          if (item.sub_category_name.toLowerCase().match(filterText)) { return item }
        })
        setsubData(filterData)
      } else {
        setsubData(filteredSubData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View
      style={[
        styles.container,
        [dark ? { backgroundColor: '#212121' } : { backgroundColor: '#fff' }],
      ]}>
      <Appbar.Header style={{ backgroundColor: Colors.primary }}>
        <Appbar.BackAction
          color="#fff"
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content color="#fff" title="Select Chapter" />
      </Appbar.Header>
      <ProgressLoader
        visible={visible}
        isModal={true}
        isHUD={true}
        hudColor={'#000000'}
        color={'#FFFFFF'}
      />
      <ScrollView style={styles.bodycontainer}>
        <Headline style={[[dark ? { color: '#fff' } : { color: '#212121' }]]}>Chapters of {quizname}</Headline>
        {/* <Text style={[dark ? { color: '#fff' } : { color: '#212121' }]}>{subData.length} Subcategory from {quizname}</Text> */}
        {/* 
      <View style={{ paddingHorizontal: 12, marginTop: 10, marginBottom: 5 }}>
         <CustomInput
          placeholder={`Search in ${quizname} Subject`}
          keyboardType="default" 
          iconname={'magnify'}
          value={search}
          onChangeText={text => onSearch(text)}
        /> 
        </View>
        */}
        {/* <Headline style={[[dark?{color:'#fff'}:{color:'#212121'}]]}>Search in {quizname} Subject</Headline> */}
        <View style={styles.OutterMenu}>{renderSubCategory()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MenuBox: {
    height: width / 3.5,
    width: width / 3.5,
    marginBottom: 15,
    borderRadius: width / 3.5 / 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginLeft: ((width / 3.5) * 3) / 6 - 50,
  },
  OutterMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 25,
    alignItems: 'center',
  },
  UnderTitle: {
    fontSize: 15,
    fontFamily: fontStyle.MardenBold,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bodycontainer: {
    paddingHorizontal: 15,
  },
});

export default Subcategory;

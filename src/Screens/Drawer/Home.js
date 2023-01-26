import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import Header from '../../Components/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, fontStyle} from '../../Constant';
import Quiz from '../../Components/Quiz';
import News from '../../Components/News';
import Notes from '../../Components/Notes';
import {color} from 'react-native-reanimated';
const {height, width} = Dimensions.get('screen');
const Home = ({navigation,route}) => {
  const [currsrc, setcurrsrc] = useState('quiz');

  const showComponent = () => {
    if (currsrc == 'quiz') {
      return <Quiz route={route} navigation={navigation} />;
    } else if (currsrc == 'notes') {
      return <Notes stateChange={setcurrsrc} navigation={navigation}/>;
    } else if (currsrc == 'news') {
      return <News stateChange={setcurrsrc} navigation={navigation} />;
    }
  };
  const theme = useTheme()
  return (
    <View style={[theme.dark?{flex:1,backgroundColor:'#212121'}:{flex:1,backgroundColor:'#fff'}]}>
      <Header onPress={() => navigation.toggleDrawer()} />
      <ScrollView nestedScrollEnabled={true} style={styles.bodycontainer}>
        {showComponent()}
      </ScrollView>
      <View style={styles.footerMenu}>
        <View style={styles.innerSubMenu}>
          <TouchableOpacity
            onPress={() => setcurrsrc('news')}
            style={styles.MenuBox}>
            {currsrc == 'news' ? (
              <View
                style={{
                  borderWidth: 3,
                  marginBottom: 10,
                  borderColor: Colors.primary,
                }}
              />
            ) : (
              <View></View>
            )}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Entypo
                name="news"
                size={30}
                color={currsrc == 'news' ? Colors.primary : Colors.secondary}
              />
              {currsrc == 'news' ? (
                <Text style={[styles.UnderTitle, {color: Colors.primary}]}>
                  News & Info
                </Text>
              ) : (
                <Text style={[styles.UnderTitle, {color: Colors.secondary}]}>
                 News & Info
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setcurrsrc('quiz')}
            style={styles.MenuBox}>
            {currsrc == 'quiz' ? (
              <View
                style={{
                  borderWidth: 3,
                  marginBottom: 10,
                  borderColor: Colors.primary,
                }}
              />
            ) : (
              <View></View>
            )}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Entypo
                name="chat"
                size={30}
                color={currsrc == 'quiz' ? Colors.primary : Colors.secondary}
              />
              {currsrc == 'quiz' ? (
                <Text style={[styles.UnderTitle, {color: Colors.primary}]}>
                  Tests
                </Text>
              ) : (
                <Text style={[styles.UnderTitle, {color: Colors.secondary}]}>
                  Tests
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setcurrsrc('notes')}
            style={styles.MenuBox}>
            {currsrc == 'notes' ? (
              <View
                style={{
                  borderWidth: 3,
                  marginBottom: 10,
                  borderColor: Colors.primary,
                }}
              />
            ) : (
              <View></View>
            )}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesome
                name={currsrc == 'notes' ? 'sticky-note' : 'sticky-note-o'}
                size={30}
                color={currsrc == 'notes' ? Colors.primary : Colors.secondary}
              />
              {currsrc == 'notes' ? (
                <Text style={[styles.UnderTitle, {color: Colors.primary}]}>
                  Notes
                </Text>
              ) : (
                <Text style={[styles.UnderTitle, {color: Colors.secondary}]}>
                  Notes
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bodycontainer: {
    //borderWidth: 2,
    paddingHorizontal: 15,
  },
  footerMenu: {
    borderTopWidth: 2,
    borderColor: Colors.lightgrey,
    height: height / 9,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },

  innerSubMenu: {
    //borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  MenuBox: {
    //borderWidth: 2,
    height: '100%',
    width: '30%',
    justifyContent: 'center',
  },
  UnderTitle: {
    fontSize: 15,
    fontFamily: fontStyle.MardenBold,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Home;

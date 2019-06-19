import React from 'react';
import {Text,StyleSheet,View,SafeAreaView} from 'react-native';
//import SafeAreaView from 'react-navigation';

export default class AboutScreen  extends React.Component {
  static navigationOptions = {
      title: 'About',
  };

  render() {
      return (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
              <Text>Helloooo</Text>
        </View>
    );
  }
}


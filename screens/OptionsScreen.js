import React from 'react';
import {View, Text, ScrollView} from 'react-native';

export default class OptionsScreen extends React.Component {
  static navigationOptions = {
    title: 'Options',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (
        <ScrollView>
            <Text> Set Options Here </Text>
        </ScrollView>
      );
  }
}

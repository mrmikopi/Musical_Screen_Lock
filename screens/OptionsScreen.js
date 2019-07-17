import React from 'react';
import {View, Text, ScrollView} from 'react-native';

// TODO
//
// Hata toleransini ayarlayan bir opsiyon koy, more strict, more tolerant
// Oran mi tutsun strict metronome mu tutsun onu koy

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

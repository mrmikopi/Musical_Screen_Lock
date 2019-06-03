import React from 'react';
import { ScrollView, Button, Text,  TouchableOpacity, ToastAndroid,  StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class SelectInstScreen extends React.Component {
    static navigationOptions =  ({navigation}) => {
        return {
            title: navigation.getParam('title', 'Select an Instrument to Play'),
        };
    };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Navigate()'lere params ekle, auth veya free veya enter veya
          * set pattern olabilir */}
          <TouchableOpacity style={styles.button}
              activeOpacity={0.9} onPress={() =>
                this.props.navigation.navigate(
                    (this.props.navigation.getParam('title', 'temp') !== 'temp'
                        ? 'Bongo' : 'FreePlay'), {
                        action: 'enter',
                    }
                )}>
                <Text style={styles.text}>{'The Ultimate\nDUMDUM TEKTEK'}</Text>
          </TouchableOpacity>
            <Button title="Church Organ" onPress={ () =>
                    ToastAndroid.show('I Wish :)', ToastAndroid.SHORT)}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
    button: {
        alignItems: 'center',
        backgroundColor: '#309bFF',
        padding: 10,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

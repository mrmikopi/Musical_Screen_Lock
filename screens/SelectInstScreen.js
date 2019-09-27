import React from 'react';
import { Platform, ScrollView, Button, Text,  TouchableOpacity, ToastAndroid,  StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';

export default class SelectInstScreen extends React.Component {
    static navigationOptions =  ({navigation}) => {
        return {
            title: navigation.getParam('title', 'Select an Instrument to Play'),
        };
    };

  constructor(props){
    super(props);
    this.state = {action: ''};
  }

  componentDidMount(){
    //console.log("Removing AsyncPin");
    //await AsyncStorage.removeItem("AsyncPin");
    this._retrieveData().then(value => this.setState({action: value}));

  }

   _redirect(){
     this._retrieveData().then(value => this.setState({action: value}));
   }


  _retrieveData = async () => {
    try {
      //await Keychain.resetGenericPassword('pin');
      //await Keychain.setGenericPassword('AppUser', '1234', 'pin')
      const credentials = await Keychain.getGenericPassword('pattern');
      //console.log('Inside SelectT, _retrieve, i awaited AsyncPin: ' + value);
      //AsyncStorage.setItem('AsyncPin', '1234');

      if(credentials){
        // console.log('Recieved username/password: ' +
        //  credentials.username + ': ' + credentials.password);
        return 'enter';
      } else {
        //ToastAndroid.show('Will return Choose', ToastAndroid.SHORT);
        return 'set';
      }
    } catch (error) {
        // Error retrieving data
        //console.log(error);
        return 'error';
    }
    return 'error';
  } //end _retrieveData

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Navigate()'lere params ekle, auth veya free veya enter veya
          * set pattern olabilir */}
        <TouchableOpacity style={styles.button}
          activeOpacity={0.9} onPress={() =>
            this.props.navigation.navigate({
              routeName: (this.props.navigation.getParam('title', 'temp') !== 'temp'
                ? 'Bongo' : 'FreePlay'),
              key: 'Bongo',
            })}>
          <Text style={styles.text}>{'The Ultimate\nDUMDUM TEKTEK'}</Text>
        </TouchableOpacity>
        <Button title="Church Organ" onPress={ () => {
          if(Platform.OS === 'android'){
            ToastAndroid.show('I Wish :)', ToastAndroid.SHORT)
          }}}/>
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

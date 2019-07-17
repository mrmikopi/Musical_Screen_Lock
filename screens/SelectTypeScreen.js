import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';


// ***** TODO *****
// Sifre yokken olusturdun, reEnter'dan sonra buraya geri dondugunde,
// Butonlar eski value'lari ile kaliyorlar. set pin diyince eskisini sormuyor.
// ***** TODO *****

export default class SelectTypeScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Password Type:',
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

  render() {
    //ToastAndroid.show(typeof data, ToastAndroid.SHORT);
      return (
        <View style={styles.container}>
            <Button title='Set Music Pattern' onPress={() =>
                this.props.navigation.navigate('SelectInst', {
                    title: 'Select Pattern:',})
            }/>
            {/* Error dondururse locked screen'e degil de baska bi
                stack screen'e yollayabilirsin. */}
                <Button title='Set Pin Code' onPress={() => {
                  this._redirect();
                  console.log("In SelectT, will pass action: " + this.state.action);
                  //ToastAndroid.show(this.state.action.toString(), ToastAndroid.SHORT);
                  //this.getAction();
                  this.props.navigation.navigate({
                    routeName: 'Pin',
                    params: {
                      // Might use 'action' instead
                      action : this.state.action,
                    },
                    key: 'Pin' + this.state.action
                  });
                }}/>
        </View>
      );
  }

  getAction = () => {
    ToastAndroid.show(this.state.action, ToastAndroid.SHORT);
    return this.state.action
  }

  yonlendir(){
    const action = this._retrieveData();
    ToastAndroid.show(action.action2, ToastAndroid.LONG);
    //this.props.navigation.navigate('Pin', {'action' : action,});
  }

  _retrieveData = async () => {
    try {
      //await Keychain.resetGenericPassword('pin');
      //await Keychain.setGenericPassword('AppUser', '1234', 'pin')
      const credentials = await Keychain.getGenericPassword('pin');
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
}


// TODO
//
// AsyncStorage Kay Value pairs donduruyor DUZELT!!!!
//
// TODO



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});

      //try{
      //  const value = await AsyncStorage.getItem('AsyncPin');
      //    if (value !== null) {
      //      //console.log(value);
      //    } else {
      //      //console.log(value);
      //      navigate = 'choose';
      //    }
      //} catch (error) {
      //    //console.log(error);
      //    navigate = 'error';
      //}

import React from 'react';
import { ScrollView, View, Button, Text, TouchableOpacity, ToastAndroid,  StyleSheet, TextInput, } from 'react-native';
//import {PINCode} from '@haskkor/react-native-pincode';
import AsyncStorage from '@react-native-community/async-storage';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';







// ****
//
//
//                  TODO
//
//
//            Async Storage, Key Value tutmakta! Duzelt!
//
//
//
//
//
//                  TODO
//
//
//
// ****





export default class PinScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        action = navigation.getParam('action', 'enter');
        return {
            title: action === 'enter' ? 'Enter old Pin' :
                (action === 'set' ? 'Enter new Pin' :
                    (action === 'reEnter' ?
                        'Enter new Pin again' : 'Enter your Pin'))
        };
    };

    state = {
        code : '',
        // Not sure if this works.
      action : this.props.navigation.getParam('action', 'error'),
    };
    pinInput = React.createRef();

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('AsyncPin');
          if (value !== null) {
              // We have data!!
              return value;
          } else {
              // We shouldn't be here since navigate will pass action.
              // But we need a temporary Pin.
              return '-1';
          }
        } catch (error) {
            // Error retrieving data
            return '-99';
        }
    }

    _storeData = async () => {
        try {
          await AsyncStorage.setItem('AsyncPin', this.state.code);
        } catch (error) {
          // Error saving data
        }
    }

    _takeAction() {
        // SelectType (or this screen) returns us some action
        action = this.state.action;

        if (action === 'set') {
            // Action is Choose so we have to navigate to take input again and check
            this.props.navigation.navigate('Pin', {
                'LocalPin' : this.state.code,
                'action' : 'reEnter'});
        } else if (action === 'reEnter') {
            // Action is re-enter so we should finish with new Pin.
            this._checkCode(this.state.code);
        }else if (action === 'enter') {
            // Action is Enter so we should check code.
            this._checkCode(this.state.code);
        } else if (action === 'error') {
            // Action returned error from SelectType
            // TODO Unuttum ekranina yonlendir ileride.
            this.props.navigation.navigate('Pin', {'action' : 'enter'});
        } else {
            // It shoul never be here logically, but lets redirect.
            // TODO Bunu da unuttum'a yonlendirebilirsin.
            this.props.navigation.navigate('Pin', {'action' : 'enter'});
        }

    }

    _checkCode = (code) => {
        if (code === '-1' || code === '-99'){
            this.pinInput.current.shake()
                .then(() => this.setState({ code: '' }));
        }
        action = this.state.action;
        codeLegacy = '-1';

        if (action === 'enter'){
            codeLegacy = this.props.navigation.getParam('LocalPin', -1);
        } else if (action === 'reEnter'){
          // TODO not sure if this works
          this._retrieveData().then( value => {codeLegacy = value});
        }

        if (code === codeLegacy){
            // Succesfully navigate to Choose new Code
            if (action === 'enter'){
                // Navigate to Choose screen
                this.props.navigation.navigate('Pin', {'action' : 'set'});
            } else if (action === 'reEnter'){
                // Store the data on ASyncStorage & navigate to HomeScreen
                this._storeData();
                this.props.navigation.navigate('SelectType');
            }
        } else {
            this.pinInput.current.shake()
                .then(() => this.setState({ code: '' }));
        }
    }

    _getCode = () => {
        // Buraya nereden geldik?
        action = this.state.action;
        if (action === 'reEnter') {
            // Eger choose ekranindan gelmissek
            return this.props.navigation.getParam('LocalPin', -1);
        } else if (action === 'enter') {
            // Eger SelectType'dan gelmissek
            return this._retrieveData();
        } else {
            // Buraya nasil geliriz bilmiyorum.
            return -1;
        }
    }

    render() {
        const { code } = this.state;
        const {action} = this.state;
        return (
          <ScrollView style={styles.container}>
            <View style={styles.section}>
                <SmoothPinCodeInput
                  ref={this.pinInput}

                  value={code}
                  onTextChange={code => this.setState({ code })}
                  onFulfill={this._checkCode}
                  onBackspace={() => console.log('No more back.')}
                />
            </View>
              <Text>{action}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        backgroundColor: '#fff',
//    },
//});

//{//*<PINCode status={this.props.navigation.getParam('action', 'enter')}/>*//}

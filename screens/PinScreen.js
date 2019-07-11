import React from 'react';
import { ScrollView, View, Button, Text, TouchableOpacity, ToastAndroid,  StyleSheet, TextInput, } from 'react-native';
//import {PINCode} from '@haskkor/react-native-pincode';
import AsyncStorage from '@react-native-community/async-storage';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';


// ****
//  TODO
//
//  gerekli action stateleri: unlock, enter, set, reEnter.
//  Eger unlock set'e yonlendirecekse, eski sifreyi de gondermeli ki
//  Aynisini girmeye calisirsan kabul etmesin, shake etsin.
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
    oldPin : '',

  }
  pinInput = React.createRef();

  componentDidMount(){
    console.log('PinScreen Component did Mount');
    this._retrieveData().then( value => this.setState({oldPin: value,}) );
    console.log('Oldpin is: ' + this.state.oldPin + ' at componentDidMount()');
  }

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

    _storeData = async (code) => {
        try {
          await AsyncStorage.setItem('AsyncPin', code);
        } catch (error) {
          // Error saving data
        }
    }

    // TODO This method is called before code held in state is changed!
  _checkCode = (code) => {
    console.log("This code is passed to _checkCode: " + code)

        if (code === '-1' || code === '-99'){
            this.pinInput.current.shake()
                .then(() => this.setState({ code: '' }));
        }
        action = this.state.action;
        codeLegacy = '-1';

      // IF ENTER
      if (action === 'enter'){
      // Should check if same. If same, navigate to Set.
        if(code === this.state.oldPin){
          // Success, navigate to action : set
          // TODO Belki metodlar sirayla calismaz diye nolur nolmaz... code=''
          code = '';
          this.state.code = '';
          this.props.navigation.navigate({
            routeName: 'Pin',
            params: {
              action : 'set',
            },
            key: 'Pinset'
          });
        } else {
          // Wrong code, enter again. PIN SHOULD BE HERE??
          this.pinInput.current.shake()
              .then(() => this.setState({ code: '' }));
        }
      }

      // IF SET
      else if(action === 'set'){
      // It should check if password is same with previous password
      // Otherwise, does not give errors. Just redirect to action:'reenter'
        // If different from previous password
        if (this.state.oldPin !== code){
          console.log("In IFSET, Oldpin is: " + this.state.oldPin + ', and code is: ' +
          code)
          this.props.navigation.navigate({
            routeName: 'Pin',
            params: {
              action : 'reEnter',
              LocalPin : code,
            },
            key: 'PinreEnter'
          });
        }
        // If same with previous password
        else {
          console.log('Entered Same Password!');
            this.pinInput.current.shake()
                .then(() => this.setState({ code: '' }));
        }
      }

      // IF RE-ENTER
      else if (action === 'reEnter'){
      // Should check with the previous value sent from 'set' page.
      // If match, call storedata.
      // If not, shake and ask to re-enter again (stay @ current page)
        codeLegacy = this.props.navigation.getParam('LocalPin', '-1');
        // Code matches from previous.
        if(code === codeLegacy){
          this._storeData(code);
          this.props.navigation.navigate('SelectType');
        }
        // If doesn't match
        else{
            this.pinInput.current.shake()
                .then(() => this.setState({ code: '' }));
        }
      }

      // TODO IF UNLOCK
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
    //alignItems: 'center',
    //justifyContent: 'center',
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

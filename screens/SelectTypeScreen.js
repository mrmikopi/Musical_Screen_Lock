import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
    ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class SelectTypeScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Password Type:',
  };

  constructor(props){
    super(props);
    this.state = {action: ''};
  }

  componentDidMount(){
    this.setState({
      action: this._retrieveData(),
    });
    console.log(this.state.action.toString());
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
                  console.log(this.state.action);
                  //ToastAndroid.show(this.state.action.toString(), ToastAndroid.SHORT);
                  //this.getAction();
                  //this.props.navigation.navigate('Pin', {'action': this.state.action});
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
      //const data = {action2: 'choose'};
      //await AsyncStorage.setItem("AsyncPin", JSON.stringify(data));
      AsyncStorage.removeItem("AsyncPin");
      const value = await AsyncStorage.getItem("AsyncPin");
      console.log(value);
      //AsyncStorage.setItem('AsyncPin', '1234');
      //const value = await AsyncStorage.getItem("AsyncPin", () => {
      //  ToastAndroid.show('Callback Function', ToastAndroid.SHORT);
      //});

      if(value !== null){
        const item = JSON.parse(value);
        ToastAndroid.show(typeof item.act, ToastAndroid.SHORT);
        return 2;
      } else {
        //ToastAndroid.show('Will return Choose', ToastAndroid.SHORT);
        return 1;
      }
    } catch (error) {
        // Error retrieving data
        //console.log(error);
        return 0;
    }
    return 0;
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

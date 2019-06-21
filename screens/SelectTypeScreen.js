import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class SelectTypeScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Password Type:',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      return (
        <View style={styles.container}>
            <Button title='Set Music Pattern' onPress={() =>
                this.props.navigation.navigate('SelectInst', {
                    title: 'Select Pattern:',})
            }/>
            {/* Error dondururse locked screen'e degil de baska bi
                stack screen'e yollayabilirsin. */}
            <Button title='Set Pin Code' onPress={() => this.yonlendir()}/>
        </View>
      );
  }

    yonlendir(){
        const action = this._retrieveData();
        this.props.navigation.navigate('Pin', {'action' : action,});
    }
_retrieveData = async () => {
    try {
        try{
            await AsyncStorage.setItem('AsyncPin', 'choose');
        } catch (error) {
            console.log(error.message);
        }
      const value = await AsyncStorage.getItem('AsyncPin');

    if (value !== null) {
      // We have data!!
        //console.log(value);
        if(value === 'choose'){return 'choose';}
        return 'enter';
    } else {
        return 'choose';
    }
  } catch (error) {
      // Error retrieving data
      //console.log(error);
      return 'error';
  }
}





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

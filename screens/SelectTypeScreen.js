import React from 'react';
import {
    Text,
    View,
    Button,
    StyleSheet,
} from 'react-native';

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
            <Button title='Set Pin Code' onPress={() =>
                    this.props.navigation.navigate('Pin' )}/>
        </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});

import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Button,
    View,
    Text,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class MainScreen extends React.Component {
  static navigationOptions = {
      title: 'Main',
      //header: null,
  };

    setPattern(){
        const { navigate } = this.props.navigation;
        navigate('DemoScreen', {
            isSettingP: true,
        });
    }
  render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container}>
            <View style={styles.myContainer}>
              <Text style='text-align: center'>
                {'Main Menu'}
              </Text>
            </View>

          {/* eger screenler paylasilacaksa, navigate() icine
              parametreler gir, duruma gore yonlensin */}
            <View style={styles.myContainer}>
                <Button title='Free Play' onPress={() =>
                        this.props.navigation.navigate('Demo')}/>
              <Button title='Set a Pattern' onPress={() =>
                this.props.navigation.navigate('Demo')}/>
              <Button title='Set PIN Code' onPress={() =>
                      this.props.navigation.navigate('Demo/Pin')}/>
              <Button title='Settings' onPress={() =>
                this.props.navigation.navigate('Settings')}/>
              <Button title='Forgot Patter/PIN' onPress={() =>
                this.props.navigation.navigate('Forgot')}/>
            </View>
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    // Burayi iyi duzenle
  container: {
      flex: 1,
      paddingTop: 15,
      margin: 10,
      padding: 10,
    backgroundColor: '#fff',
  },
    myContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: '#bbb',
    },
});

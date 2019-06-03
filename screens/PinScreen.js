import React from 'react';
import { ScrollView, Button, Text, TouchableOpacity, ToastAndroid,  StyleSheet, TextInput, } from 'react-native';
import {PINCode} from '@haskkor/react-native-pincode';

export default class PinScreen extends React.Component {
    static navigationOptions = {
        title: 'Pin',
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                {<PINCode status={this.props.navigation.getParam('action', 'enter')}/>}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})

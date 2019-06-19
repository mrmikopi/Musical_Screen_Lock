// TODO
// * Sifre olustururken, 5 kere filan girdir, mean al
// * bongos/5 aliniacak pattern kontrolu icin. bongos 5'e bolunmuyorsa
// yanlis tuslama vardir, duzelttirebilirsin.
// * Patternlari oran mi tutmaliyiz, kusuratli saniye mi?

import React from 'react';
import {
  Image,
  Platform,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  FlatList,
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'Demo',
  };

    constructor(props){
        super(props);
        this.state= {
            date: null,
            // distances'in length'ini sifreyi olustururken alabilirsin
            distances: [],
            bongos: [0],
            // TODO ilk acilista "setting pattern" olmali sanki
            isSettingP: false,
            pattern: [],
            distPat: [],
            // debugText: '',
        };
    }

    // Reset saved pattern and dist. Also...
    resetStates(){
        var that = this;
        that.setState({
            distances: [],
            bongos: [],
            date: null,
        })
    }

    // TODO Burada sikintilar var, last note'u ilk gosteriyo,
    // last note suresi ayziyo hep. ters olcak biseyler.
    // Duzeltmek sart degil galiba
    debugMethod(){
        var bongos = this.state.bongos;
        var distances = this.state.distances;
        var text = "";
        for(let i = 0; i < bongos.length; i++){
            if(distances[i]){
                text += "Bongo hit: " + bongos[i] +
                        " for duration: " + distances[i] + " ms.\n"
            }  else {
                text += "Bongo hit: " + bongos[i] +
                        " and it was last note\n";
            }
        }
        return text;
    }

    getDistance(i){
        var that = this;
        var oldTime = that.state.date;
        var time = new Date().getTime();
        var distances = this.state.distances;
        var bongos = this.state.bongos;
        if(oldTime){
            distances.push(time-oldTime);
        }
        bongos.push(i);
        that.setState({
            date: time,
            distances: distances,
            bongos: bongos,
        });
        if(this.checkPattern(distances, bongos)){
            ToastAndroid.show("THEY ARE SAME", ToastAndroid.SHORT);
        }
    }

    checkPattern(distances,bongos){
        var that = this;
        var pattern = this.state.pattern;
        var distPat = this.state.distPat;

        if(bongos.length !== pattern.length){return false;}

        for(let i = 0; i < bongos.length; i++){
            if(bongos[i] !== pattern[i]){return false;}
        }

        if(distances.length !== distPat.length){return false;}

        // This one calculates exact metronome with .35 error tolerance
        /*for(let i = 0; i < distances.length; i++){
            if(distances[i] < 0.65 * distPat[i] ||
                distances[i] > 1.35 * distPat[i]){return false;}
        }*/

        // This one calculates ratios between notes with .35 error tolerance
        var ratios = [];
        for(let i = 0 ; i < distPat.length; i++){
            ratios.push( distPat[i] / distPat[0] );
        }
        for(let i = 0; i < distances.length; i++){
            var current = distances[i]/distances[0];
            if (current < 0.65 * ratios[i]){ return false; }
            if (current > 1.35 * ratios[i]){ return false; }
        }

        return true;
    }

    // *** RECORDING PATTERN *** //
    startPattern(){
        this.resetStates();
        var that = this;
        var isSettingP = true;

        that.setState({
            isSettingP: isSettingP,
        });
    }

    // *** SAVING THE PATTERN *** //
    setPattern(){
        var that = this;
        var distances = this.state.distances;
        var bongos = this.state.bongos;
        var pattern = [];
        var distPat = [];
        var isSettingP;
        isSettingP = false;

        this.resetStates();

        if(this.itsOK(bongos, distances)){
            pattern = bongos.slice(0,bongos.length/5);
            distPat = distances.slice();
            distPat = this.getMean(distPat);

            that.setState({
                isSettingP: isSettingP,
                pattern: pattern,
                distPat: distPat,
            });

        } else {
            // TODO Buraya bi cancel butonu? Cok mu luks olur?
            // Yapmak istersen resetlememen lazim ;)
            ToastAndroid.show("You failed somewhere. Try again!", ToastAndroid.SHORT);
            this.resetStates();
            this.startPattern();
        }
    }

    itsOK(bongos, distances){
        if( bongos.length % 5 !== 0 ){return false;}
        // Change this to 15 for 3 hit patterns, 20 for 4...
        if( distances.length < 10 ){return false;}
        if( (distances.length + 1) % 5 !== 0 ){return false;}
        if( this.bongosAreSame(bongos) !== true ){return false;}
        return true;
    }

    bongosAreSame(bongos){
        var pathLength = bongos.length / 5;
        for(let i = 0; i < pathLength; i++){
            for(let j = 0; j < 4; j++){
                if (bongos[i+(j*pathLength)] !==
                    bongos[i+((j+1)*pathLength)]){
                        return false;
                }
            }
        }
        return true;
    }

    getMean(array){
        var means = [];
        var pathLength = (array.length + 1) / 5;
        var debugText = means.toString + '\n\n';
        var that = this;

        var toAdd = 0;
        for(let i = 0; i < pathLength-1; i++){
            for(let j = 0; j < 5; j++){
    //debugText = debugText.concat(array[i+(j*pathLength)].toString() + ' + ');
                toAdd = toAdd + array[i+(j*pathLength)];
            }
    //debugText = debugText.concat(' = ' + toAdd.toString());
            toAdd = Math.round(toAdd / 5);
    //debugText = debugText.concat(' /5 ' + toAdd.toString() + 'is to be added.\n');
            means.push(toAdd);
            toAdd = 0;
        }
    /*that.setState({
        debugText: debugText,
        });*/
        return means;
    }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
            <Text>
                {this.state.isSettingP ? "Setting the Pattern. Enter it 5 times." : "Unlock with your pattern"}
            </Text>
          </View>

          <View style={styles.drumButtons} onStartShouldSetResponder={() => {this.getDistance(1);return true;}}>
              <TouchableOpacity style={styles.button}
                  onPressIn={() => this.getDistance(1)}>
                <Text>Dum Dum</Text>
              </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                    onPressIn={() => this.getDistance(2)}>
                    <Text>Tek Tek</Text>
                </TouchableOpacity>

            </View>
            <ScrollView style={height=50}>
                <Text>
                    {this.state.distances.toString()}
                </Text>
            </ScrollView>
          <View style={styles.getStartedContainer}>
              <Button
                  onPress={() => this.resetStates()}
                title="Reset Array"/>
        </View>


        {/**********  DEBUGGING THINGS **********/}
        <View style={styles.getStartedContainer}>
            <Text>
                {/*this.debugMethod()*/}
                {this.state.pattern.toString() + '\n'}
                {this.state.distPat.toString()}
            </Text>
        </View>

        <View style={styles.getStartedContainer}>
            <Button onPress={() =>
                    (this.state.isSettingP ?
                    this.setPattern() : this.startPattern())}
                    title={this.state.isSettingP ?
                        "Save the Pattern" :
                            "Set a Pattern"
            }/>
        </View>


                {/* <Text>{this.state.debugText}</Text> */}
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

} //end class DemoScreen


const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#0088FF',
        padding: 20
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    drumButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 20,
        margin: 20,
    },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

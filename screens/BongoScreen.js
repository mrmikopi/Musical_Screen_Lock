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
import * as Keychain from 'react-native-keychain';

//import { MonoText } from '../components/StyledText';

// Zor 1 TODO: Bongolari ayri componentler yap, <Bongoes> diye cagir.

export default class BongoScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    action = navigation.getParam('action', 'enter');
    //if (action === 'enter') { return {title: 'Enter Old Pattern' };}
    //else if (action === 'set') { return {title: 'Enter New Pattern' };}
    //else if (action === 'reset') { return {title: 'Enter New Pattern Again' };}
    //else { return {title: 'Enter Your Pattern'  };}
    return {
      title: action === 'enter' ? 'Enter old pattern' :
      (action === 'set' ? 'Enter new pattern' :
        (action === 'reEnter' ?
          'Enter new pattern again' : 'Enter your pattern'))
    };
  };

  constructor(props){
    super(props);
    this.state= {
      action: this.props.navigation.getParam('action', 'error'),
      errorLabel: '',
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

  componentDidMount(){
    this._retrieveData().then( value => this.setState({pattern: value[0], distPat: value[1]}));
  }

  // Reset saved pattern and dist. Also...
  resetStates(){
    var that = this;
    that.setState({
      distances: [],
      bongos: [],
      date: null,
      errorLabel: '',
    });
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

  _retrieveData = async () => {
    try {
      const credentials = await Keychain.getGenericPassword('pattern');
      if (credentials !== null) {
        // We have a Pattern set! TODO Deal with string!!!
        return JSON.parse(credentials.password);
      } else {
        // We shouldn't be here since navigate will pass action.
        // But we need a temporary Pin.
        const value = [ [], [] ];
        return value;
      }
    } catch (error) {
      // Error retrieving data
      return [[],[]];
    }
  }

  _storeData = async () => {
    const value = this.props.navigation.getParam('LocalPattern', null);
    if(value){
      try {
        await Keychain.setGenericPassword('AppUser', value, 'pattern');
      } catch (error) {
        // TODO Error saving data
        this.setState({errorLabel: 'Error saving pattern! Contact Mikail for more info...'});
      }
    } else {
      this.setState({errorLabel: 'I couln\'t get pattern from previous screen.'
        + 'Please go back and retry.'});
    }
  }

  updateLocal(i){
    // uesd to be getDistance(i)
  // mevcut: surekli bongosu ve distancesi kaydet, her kayitta tekrar
  // TODO: bongos'u tek tek kontrol, hataliysa bastan silersin, bir yandan
  // da distances tutacaksin, bongos iyiyse distances kontrol.
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
    // else ekleyemiyorum cunku surekli bi kontrol olmali. Normal
    // desenleri olan patternlerde okay tusu yok mesela, yapar yapmaz girip
    // bunda da boyle olmali.
  }

  compareToStored(){
    var distances = this.state.distances;
    var bongos = this.state.bongos;
    var action = this.state.action;
    if(this.patternIsOk(distances, bongos, action)){
      switch(action){
        case 'enter':
            // Navigate to 'Bongo' action:'set' key: 'Bongo' + 'set'
            this.props.navigation.navigate({
              routeName: 'Bongo',
              params: {
                action: 'set',
                changedPattern: false,
              },
              key: 'Bongo' + 'set',
            });
            //ToastAndroid.show("THEY ARE SAME", ToastAndroid.SHORT);
        case 'reEnter':
          this._storeData();
          this.props.navigation.navigate('SelectType');
        default:
          ;
      }
    }
  }

  // Bongos are same, distances are ok.
  patternIsOk(distances,bongos, action){
    var that = this;
    var pattern;
    var distPat;
    if(action === 'enter'){
      pattern = this.state.pattern;
      distPat = this.state.distPat;
    } else if (action === 'reEnter'){
      var value = this.props.navigation.getParam('LocalPattern', [[],[]]);
      pattern = value[0];
      distPat = value[1];
    } else {
      return false;
    }

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
      if (current < 0.65 * ratios[i] ||
          current > 1.35 * ratios[i]){ return false; }
    }

    return true;
  }

  // *** RECORDING PATTERN *** //
  startPattern(){
    this.resetStates();
    this.setState({
      isSettingP: true,
    });
  }

  // *** SAVING THE PATTERN *** //
  setPattern(){
    var that = this;
    var distances = this.state.distances;
    var bongos = this.state.bongos;
    var pattern = [];
    var distPat = [];

    this.resetStates();

    if(this.itsOK(bongos, distances)){
      pattern = bongos.slice(0,bongos.length/5);
      distPat = distances.slice();
      distPat = this.getMean(distPat);

      this.resetStates();

      that.setState({
        isSettingP: false,
        pattern: pattern,
        distPat: distPat,
        errorLabel: 'Pattern is specified!',
      });

      this.props.navigation.setParams({changedPattern : true});

    } else {
      // TODO Buraya bi cancel butonu? Cok mu luks olur?
      // Yapmak istersen resetlememen lazim ;)
      // sanirim cancel gerekli degil cunku save edip begenmezse cikiyor zaten
      //ToastAndroid.show("You failed somewhere. Try again!", ToastAndroid.SHORT);
      this.setState({
        errorLabel: 'Pattern you entered is not valid!\n'+
        'Don\'t forget to enter it 5 times.',
        // Remove below if saving state will be on.
        isSettingP: false,
      });
      this.resetStates();
      // Enable if you want saving state to stay on.
      // this.startPattern();
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

  _getLabel = () => {
    switch(this.state.action){
      case 'enter':
        return 'Please enter your pattern';
      case 'set':
        return 'Please record your pattern.\nEnter it 5 Times!!!';
      case 'reEnter':
        return 'Re-enter your pattern\n(Only once is enough this time :) )';
      case 'error':
        return 'Enter your pattern if you know, contact Mikail otherwise.';
      default:
        return 'Enter your pattern';
    }
  }

  _loadButtons = () => {
    switch(this.state.action){

      case 'enter':
        return (
          <View style={styles.getStartedContainer}>
            <Button
              onPress={() => this.resetStates()}
              title="Retry"/>
          </View>
        );

      case 'set':
        return (
          <View style={styles.getStartedContainer}>
              <Button
                onPress={() => this.resetStates()}
                title="Retry"/>
              <Button onPress={() => (this.state.isSettingP ?
                  this.setPattern() : this.startPattern())}
                title={this.state.isSettingP ?
                  "Save the Pattern" : "Start Your Pattern"}/>
              <Button title='Continue with This Pattern'
                onPress={() => {
                  if(this.props.navigation.getParam('changedPattern', false) === true){
                    var value = [this.state.pattern, this.state.distPat];
                    this.props.navigation.navigate({
                      routeName: 'Bongo',
                      params: {
                        action: 'reEnter',
                        LocalPattern: JSON.stringify(value),
                      },
                      key: 'Bongo' + 'reEnter'
                    });
                  } else {
                    this.setState({
                      errorLabel: 'You did not enter any pattern!',
                    });
                  }
              }}/>
          </View>
        );

      default:
        return (<Button title='Default Button' onPress={this.resetStates()}/>);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={__DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
            <Text>
              {this._getLabel()}
            </Text>
          </View>

          {/* BONGOS! BONGOS! BONGOS! */}
          <View style={styles.drumButtons} >
            <TouchableOpacity style={styles.button}
              onPressIn={() => {
                this.updateLocal(1);
                this.compareToStored();
              }}>
              <Text>Dum Dum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPressIn={() => {
                this.updateLocal(2);
                this.compareToStored();
              }}>
              <Text>Tek Tek</Text>
            </TouchableOpacity>
          </View>
          {/* BONGOS! BONGOS! BONGOS! */}

          {/*
            <ScrollView style={height=50}>
                <Text>
                    {this.state.distances.toString()}
                </Text>
            </ScrollView>
            */}

            {this._loadButtons()}

            <Text key='errorLabel'>{this.state.errorLabel}</Text>
          {/* ****************
            Soyle bisey olabilir:


            Sonra action'a gore gerekli butonlari
            orada cagiri cagiriveririz filan
            Guzel olmaz mi?
            **************    */}


          {/**********  DEBUGGING THINGS **********/}
          {/*I think i should remove these */}
          <View style={styles.getStartedContainer}>
            <Text>
              {/*this.debugMethod()*/}
              {this.state.pattern.toString() + '\n'}
              {this.state.distPat.toString()}
            </Text>
          </View>

        {/* <Text>{this.state.debugText}</Text> */}
      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          This is a tab bar. You can edit it in:
        </Text>
      </View>
    </View>
    );
  }

} // end BongoScreen class


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

import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import DemoScreen from '../screens/DemoScreen';
import SelectInstScreen from '../screens/SelectInstScreen';
import OptionsScreen from '../screens/OptionsScreen';
import MainScreen from '../screens/MainScreen';
import PinScreen from '../screens/PinScreen';
import FreePlayScreen from '../screens/FreePlayScreen';
import AboutScreen from '../screens/AboutScreen';
import SelectTypeScreen from '../screens/SelectTypeScreen';
import BongoScreen from '../screens/BongoScreen';


const FreePlayStack = createStackNavigator({
    SelectInst: SelectInstScreen,
    FreePlay: FreePlayScreen,
});

FreePlayStack.navigationOptions = {
    tabBarLabel: 'Free Play',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const PasswordStack = createStackNavigator({
    // Might change name to SelectInstPW and other will be SelectInstFP
    SelectType: SelectTypeScreen,
    SelectInst: SelectInstScreen,
    Bongo: BongoScreen,
    Pin: PinScreen,
});

PasswordStack.navigationOptions = {
    tabBarLabel: 'Set Password/PIN',
    tabBarIcon: ({ focused  }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
        />
    ),
};

const OptionsStack = createStackNavigator({
  Options: OptionsScreen,
});

OptionsStack.navigationOptions = {
  tabBarLabel: 'Options',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const AboutStack = createStackNavigator({
  About: AboutScreen,
});

AboutStack.navigationOptions = {
  tabBarLabel: 'Options',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};


export default createBottomTabNavigator({
  FreePlayStack,
  PasswordStack,
  OptionsStack,
  AboutStack,
});

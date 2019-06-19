// New Project
import React from 'react';
import { Platform, Text } from 'react-native';
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
                name={"music"} />
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
    tabBarLabel: 'Set Lock/PIN',
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name={"lock"} />
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
              name={"wrench"} />
    ),
};

const AboutStack = createStackNavigator({
  About: AboutScreen,
});

AboutStack.navigationOptions = {
  tabBarLabel: 'About',
    tabBarIcon: ({ focused }) => (
          <TabBarIcon
              focused={focused}
              name={"heart"} />
    ),
};


export default createBottomTabNavigator({
  FreePlayStack,
  PasswordStack,
  OptionsStack,
  AboutStack,
});



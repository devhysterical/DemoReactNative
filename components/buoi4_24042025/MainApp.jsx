import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import DrawerNavigator from './Drawer';
import BottomTabNavigator from './BottomTab';

const Stack = createNativeStackNavigator();

const MainApp = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Stack.Screen
        name="DrawerDemo"
        component={DrawerNavigator} // Render Drawer Navigator component here
        options={{headerShown: false}} // Drawer has its own header
      />
      <Stack.Screen
        name="BottomTabDemo"
        component={BottomTabNavigator} // Render Bottom Tab Navigator component here
        options={{headerShown: false}} // Tabs usually have their own header or none
      />
    </Stack.Navigator>
  );
};

export default MainApp;

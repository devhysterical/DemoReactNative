import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import CuisineScreen from '../screens/App/CuisineScreen';
import FoodListScreen from '../screens/App/FoodListScreen';
import FoodDetailScreen from '../screens/App/FoodDetailScreen';
import CartScreen from '../screens/App/CartScreen';
import PaymentSuccessScreen from '../screens/App/PaymentSuccessScreen';
import ProfileScreen from '../screens/App/ProfileScreen';

import CustomHeader from '../navigation/CustomHeader';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainAppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CuisineHome"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CuisineHome" component={CuisineScreen} />
      <Stack.Screen name="FoodList" component={FoodListScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    </Stack.Navigator>
  );
};

// Drawer Navigator
const AppNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        header: props => <CustomHeader {...props} />,
      }}>
      <Drawer.Screen
        name="Home"
        component={MainAppStack}
        options={{title: 'Restaurant App'}}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'My Profile'}}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigator;

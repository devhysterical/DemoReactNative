import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {View, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

import HomeBottomTabs from './HomeBottomTabs';
import ProfileScreen from '../App/ProfileScreen';
import SettingsScreen from '../App/SettingsScreen';

const DrawerNav = createDrawerNavigator();

const CustomDrawerContent = props => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error: ', error);
      Alert.alert('Logout Error', 'Could not log out. Please try again.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <Button icon="logout" mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>
    </View>
  );
};

const MainDrawerNavigator = () => {
  return (
    <DrawerNav.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: 'tomato',
        drawerInactiveTintColor: 'gray',
        headerShown: true,
      }}>
      <DrawerNav.Screen
        name="HomeTabs"
        component={HomeBottomTabs}
        options={{
          title: 'My ToDos',
          drawerIcon: ({focused, size, color}) => (
            <Icon
              name={focused ? 'home-check' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <DrawerNav.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({focused, size, color}) => (
            <Icon
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <DrawerNav.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({focused, size, color}) => (
            <Icon
              name={focused ? 'cog' : 'cog-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </DrawerNav.Navigator>
  );
};

export default MainDrawerNavigator;

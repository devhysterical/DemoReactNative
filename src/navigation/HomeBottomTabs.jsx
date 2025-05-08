import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ToDoListScreen from '../App/ToDoListScreen';
import AddToDoScreen from '../App/AddToDoScreen';
import CompletedTasksScreen from '../App/CompletedTasksScreen';

const Tab = createBottomTabNavigator();

const renderTabBarIcon = (route, focused, color, size) => {
  let iconName;
  if (route.name === 'AllTasks') {
    iconName = focused ? 'format-list-checks' : 'format-list-bulleted';
  } else if (route.name === 'AddTask') {
    iconName = focused ? 'plus-box' : 'plus-box-outline';
  } else if (route.name === 'Completed') {
    iconName = focused ? 'check-all' : 'check-outline';
  }
  return <Icon name={iconName} size={size} color={color} />;
};

const HomeBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) =>
          renderTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="AllTasks"
        component={ToDoListScreen}
        options={{title: 'All Tasks'}}
      />
      <Tab.Screen
        name="AddTask"
        component={AddToDoScreen}
        options={{title: 'Add Task'}}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedTasksScreen}
        options={{title: 'Completed'}}
      />
    </Tab.Navigator>
  );
};

export default HomeBottomTabs;

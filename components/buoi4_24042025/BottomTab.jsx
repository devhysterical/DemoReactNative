import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const TabScreenA = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Text variant="headlineMedium">Tab Screen A</Text>
      <Button onPress={() => navigation.goBack()}>Go Back (to Home)</Button>
    </View>
  );
};

const TabScreenB = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Text variant="headlineMedium">Tab Screen B</Text>
      <Button onPress={() => navigation.goBack()}>Go Back (to Home)</Button>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="TabA"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'TabA') {
            iconName = focused ? 'alpha-a-box' : 'alpha-a-box-outline';
          } else if (route.name === 'TabB') {
            iconName = focused ? 'alpha-b-box' : 'alpha-b-box-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}>
      <Tab.Screen
        name="TabA"
        component={TabScreenA}
        options={{title: 'Tab Alpha'}}
      />
      <Tab.Screen
        name="TabB"
        component={TabScreenB}
        options={{title: 'Tab Beta'}}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;

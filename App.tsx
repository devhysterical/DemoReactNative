// Họ và Tên: Lâm Tuấn Kiệt
// MSSV: 2124802010307

import React from 'react';
// import {StyleSheet} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './components/buoi3_17042025/LoginScreen_1';
import CreateNewAccountScreen from './components/buoi3_17042025/CreateNewAccountScreen';
import ForgotPasswordScreen from './components/buoi3_17042025/ForgotPasswordScreen';

export type RootStackParamList = {
  Login: {registeredEmail?: string} | undefined;
  CreateAccount: undefined;
  ForgotPassword: {userId?: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Khai báo các màn hình trong Stack */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateNewAccountScreen}
            options={{title: 'Create New Account'}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{title: 'Reset Password'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });
export default App;

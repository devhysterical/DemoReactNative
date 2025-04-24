// Họ và Tên: Lâm Tuấn Kiệt
// MSSV: 2124802010307

import 'react-native-gesture-handler';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './components/buoi3_17042025/LoginScreen_1';
import CreateNewAccountScreen from './components/buoi3_17042025/CreateNewAccountScreen';
import ForgotPasswordScreen from './components/buoi3_17042025/ForgotPasswordScreen';
import MainApp from './components/buoi4_24042025/MainApp';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <PaperProvider>
        <NavigationContainer>
          {/* Stack chính quản lý Auth và Main App */}
          <Stack.Navigator initialRouteName="Login">
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
            {/* Màn hình chứa phần còn lại của app sau khi login */}
            <Stack.Screen
              name="MainApp"
              component={MainApp}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

export default App;

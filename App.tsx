// Họ và Tên: Lâm Tuấn Kiệt
// MSSV: 2124802010307

import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import LoginScreen from './components/excersise_1_10042025/LoginScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

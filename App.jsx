// Họ tên sinh viên 1: Lâm Tuấn Kiệt
// MSSV: 2124802010307

// Họ tên sinh viên 2: Lào Doanh Chính
// MSSV: 212480201011

// Họ tên sinh viên 3: Nguyễn Bá Tuân
// MSSV: 2124802010170

import React from 'react';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {AuthProvider} from './src/GiuaKy/contexts/AuthContext';
import {CartProvider} from './src/GiuaKy/contexts/CartContext';
import RootNavigator from './src/GiuaKy/navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

const GiuaKyApp = () => {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default GiuaKyApp;

import {View, Text} from 'react-native';
import React, {use, useState} from 'react';
import {useTheme} from 'react-native-paper';

export default function DemoTheme() {
  const theme = useTheme();
  return (
    <View>
      <Text style={{color: theme.colors.primary}}>DemoIcon</Text>
    </View>
  );
}

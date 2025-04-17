import {View, Text} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';

export default function DemoAvatar() {
  return (
    <View>
      <Avatar.Icon size={24} icon="folder" style={{backgroundColor: 'blue'}} />
      <Avatar.Image
        size={24}
        source={{uri: 'https://picsum.photos/700'}}
        style={{backgroundColor: 'red'}}
      />
      <Avatar.Text size={24} label="AB" style={{backgroundColor: 'green'}} />
    </View>
  );
}

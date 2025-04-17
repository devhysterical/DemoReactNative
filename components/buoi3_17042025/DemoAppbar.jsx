import {View, Text, Alert} from 'react-native';
import React from 'react';
import {Appbar} from 'react-native-paper';

export default function DemoAppbar() {
  const _goBack = () => Alert.alert('This is a demo!');
  const _handleSearch = () => Alert.alert('This is a demo!');
  const _handleMore = () => Alert.alert('This is a demo!');

  return (
    <Appbar>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title="Title" subtitle="Subtitle" />
      <Appbar.Action icon="magnify" onPress={_handleSearch} />
      <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
    </Appbar>
  );
}

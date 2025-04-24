import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation, CommonActions} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const rootNavigation = useNavigation();

  const handleLogout = () => {
    console.log('Logging out...');
    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Home!
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('DrawerDemo')}
        style={styles.button}>
        Demo Drawer Navigation
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BottomTabDemo')}
        style={styles.button}>
        Demo BottomTab Navigation
      </Button>
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={[styles.button, styles.logoutButton]}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 30,
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  logoutButton: {
    marginTop: 30,
    borderColor: 'red',
  },
});

export default HomeScreen;

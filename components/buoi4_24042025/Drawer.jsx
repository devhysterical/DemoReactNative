import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Drawer as PaperDrawer,
  Text,
  Button,
  TouchableRipple,
  Avatar,
} from 'react-native-paper';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DrawerScreen1 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Text variant="headlineMedium">Drawer Screen 1</Text>
      <Button onPress={() => navigation.goBack()}>Go Back (to Home)</Button>
    </View>
  );
};

const DrawerScreen2 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.screenContainer}>
      <Text variant="headlineMedium">Drawer Screen 2</Text>
      <Button onPress={() => navigation.goBack()}>Go Back (to Home)</Button>
    </View>
  );
};

function CustomDrawerContent(props) {
  const {state, navigation} = props;
  const activeRouteName = state.routes[state.index].name;

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image
              source={{
                uri: 'https://api.adorable.io/avatars/50/abott@adorable.png',
              }}
              size={50}
            />
            <Text style={styles.title}>User Name</Text>
            <Text style={styles.caption}>@username</Text>
          </View>

          <PaperDrawer.Section style={styles.drawerSection}>
            {state.routes.map(route => (
              <PaperDrawer.Item
                key={route.key}
                label={props.descriptors[route.key].options.title || route.name}
                active={activeRouteName === route.name}
                onPress={() => navigation.navigate(route.name)}
                icon={({color, size}) => {
                  let iconName = 'help-circle-outline';
                  if (route.name === 'Screen1') {
                    iconName = 'home-outline';
                  } else if (route.name === 'Screen2') {
                    iconName = 'account-outline';
                  }
                  return (
                    <MaterialCommunityIcons
                      name={iconName}
                      color={color}
                      size={size}
                    />
                  );
                }}
                style={styles.drawerItem}
              />
            ))}
          </PaperDrawer.Section>

          <PaperDrawer.Section title="Preferences">
            <TouchableRipple onPress={() => {}}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
              </View>
            </TouchableRipple>
          </PaperDrawer.Section>
        </View>
      </DrawerContentScrollView>
      <PaperDrawer.Section style={styles.bottomDrawerSection}>
        <PaperDrawer.Item
          label="Sign Out"
          icon={({color, size}) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={color}
              size={size}
            />
          )}
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </PaperDrawer.Section>
    </View>
  );
}

const DrawerNav = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <DrawerNav.Navigator
      initialRouteName="Screen1"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{}}>
      <DrawerNav.Screen
        name="Screen1"
        component={DrawerScreen1}
        options={{title: 'First Screen'}}
      />
      <DrawerNav.Screen
        name="Screen2"
        component={DrawerScreen2}
        options={{title: 'Second Screen'}}
      />
    </DrawerNav.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingVertical: 20,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  title: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  drawerSection: {
    marginTop: 15,
  },
  drawerItem: {
    // Add specific styles for PaperDrawer.Item if needed
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerNavigator;

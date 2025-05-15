import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Text,
  Button,
  Avatar,
  useTheme,
  Appbar,
  Card,
  Divider,
} from 'react-native-paper';
import {AuthContext} from '../../contexts/AuthContext';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const {user, setUser} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error: ', error);
      console.warn('Failed to logout.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.Content title="My Profile" />
      </Appbar.Header>
      <View style={styles.content}>
        <Avatar.Text
          size={100}
          label={
            user.displayName
              ? user.displayName.substring(0, 2).toUpperCase()
              : user.email
              ? user.email.substring(0, 2).toUpperCase()
              : '??'
          }
          style={styles.avatar}
        />
        <Text variant="headlineSmall" style={styles.displayName}>
          {user.displayName || 'N/A'}
        </Text>
        <Text variant="titleMedium" style={styles.email}>
          {user.email}
        </Text>
        <Text variant="bodySmall" style={styles.uidText}>
          UID: {user.uid}
        </Text>
        <Divider style={styles.divider} />

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          color={theme.colors.error}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  avatar: {
    marginBottom: 20,
  },
  displayName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#555',
    marginBottom: 15,
  },
  uidText: {
    color: '#777',
    fontSize: 12,
    marginBottom: 20,
  },
  divider: {
    width: '80%',
    marginVertical: 20,
  },
  infoCard: {
    width: '100%',
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 30,
    width: '80%',
    paddingVertical: 8,
  },
});

export default ProfileScreen;

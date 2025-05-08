import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    } else {
      Alert.alert('Error', 'No user found.');
      navigation.goBack();
      setLoading(false);
    }
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text
            size={80}
            label={user.email ? user.email.substring(0, 2).toUpperCase() : '??'}
            style={styles.avatar}
          />
          <Title style={styles.title}>
            {user.displayName || 'User Profile'}
          </Title>
          <Paragraph style={styles.email}>{user.email}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={() =>
              Alert.alert(
                'Edit Profile',
                'Edit profile functionality to be implemented.',
              )
            }
            icon="pencil">
            Edit Profile
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 15,
    backgroundColor: 'tomato',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  actions: {
    justifyContent: 'center',
    paddingBottom: 20,
  },
});

export default ProfileScreen;

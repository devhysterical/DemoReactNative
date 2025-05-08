import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {List, Switch, Divider, Button} from 'react-native-paper';

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const onToggleNotifications = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);
  const onToggleDarkMode = () => setIsDarkModeEnabled(!isDarkModeEnabled);

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Functionality to change password to be implemented.',
    );
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Cache cleared (simulated).');
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section title="General">
        <List.Item
          title="Enable Notifications"
          left={() => <List.Icon icon="bell-outline" />}
          right={() => (
            <Switch
              value={isNotificationsEnabled}
              onValueChange={onToggleNotifications}
            />
          )}
          onPress={onToggleNotifications}
        />
        <Divider />
        <List.Item
          title="Dark Mode"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isDarkModeEnabled}
              onValueChange={onToggleDarkMode}
            />
          )}
          onPress={onToggleDarkMode}
        />
      </List.Section>

      <List.Section title="Account">
        <List.Item
          title="Change Password"
          left={() => <List.Icon icon="lock-reset" />}
          onPress={handleChangePassword}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Manage Account"
          left={() => <List.Icon icon="account-cog-outline" />}
          onPress={() =>
            Alert.alert('Manage Account', 'Navigate to account management.')
          }
          right={() => <List.Icon icon="chevron-right" />}
        />
      </List.Section>

      <List.Section title="App Data">
        <List.Item
          title="Clear Cache"
          left={() => <List.Icon icon="cached" />}
          onPress={handleClearCache}
        />
        <Divider />
        <List.Item
          title="Export Data"
          left={() => <List.Icon icon="export-variant" />}
          onPress={() =>
            Alert.alert('Export Data', 'Data export functionality.')
          }
        />
      </List.Section>

      <List.Section title="About">
        <List.Item
          title="Version"
          description="1.0.0" // Replace with your app version
          left={() => <List.Icon icon="information-outline" />}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          left={() => <List.Icon icon="shield-lock-outline" />}
          onPress={() =>
            Alert.alert('Privacy Policy', 'Link to privacy policy.')
          }
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          left={() => <List.Icon icon="file-document-outline" />}
          onPress={() =>
            Alert.alert('Terms of Service', 'Link to terms of service.')
          }
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          icon="help-circle-outline"
          onPress={() =>
            Alert.alert('Help & Support', 'Contact support or view FAQs.')
          }>
          Help & Support
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  // Add more styles if needed
});

export default SettingsScreen;

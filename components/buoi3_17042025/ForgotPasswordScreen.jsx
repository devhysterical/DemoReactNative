import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSendResetEmail = () => {
    setEmailError('');
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    console.log('Send reset email to:', email);
    Alert.alert('Email Sent', 'Check your inbox for reset instructions.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/resetpassword.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text variant="headlineMedium" style={styles.title}>
        Reset your password
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter your email
      </Text>

      <TextInput
        label="Enter email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (emailError) {
            setEmailError('');
          }
        }}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!emailError}
        left={<TextInput.Icon icon="email" />}
      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSendResetEmail}
        style={styles.button}>
        Send Reset Email
      </Button>
      <Button onPress={() => navigation.goBack()}>Go back to Login</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'grey',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
  },
});

export default ForgotPasswordScreen;

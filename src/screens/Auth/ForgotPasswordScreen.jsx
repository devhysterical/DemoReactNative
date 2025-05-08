import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    setEmailError('');
    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email to reset your password.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setEmailError('No user found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/resetpassword.png')}
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
          if (emailError) setEmailError('');
        }}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!emailError}
        left={<TextInput.Icon icon="email" />}
        disabled={loading}
      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSendResetEmail}
        style={styles.button}
        loading={loading}
        disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </Button>
      <Button onPress={() => navigation.goBack()} disabled={loading}>
        Go back to Login
      </Button>
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

import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {createUserProfileDocument} from '../../services/firestoreService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{8,}$/;

const CreateNewAccountScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);

  const handleSignup = async () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      isValid = false;
    } else if (password && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match!');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const userAuth = userCredential.user;

      // Tạo document profile trong Firestore
      await createUserProfileDocument(userAuth);

      // ĐĂNG XUẤT NGƯỜI DÙNG MỚI TẠO NGAY LẬP TỨC
      await auth().signOut();

      Alert.alert(
        'Account Created!',
        'Your account has been successfully created. Please log in.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Login', {registeredEmail: email}),
          },
        ],
      );
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('That email address is invalid!');
      } else if (error.message.includes('creating user profile')) {
        Alert.alert(
          'Profile Error',
          'Could not save user profile: ' + error.message,
        );
      } else {
        Alert.alert('Signup Error', error.message);
      }
      console.error('Signup or Profile Creation Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/create_new.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text variant="headlineMedium" style={styles.title}>
        Create a new account!
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
        disabled={loading}
      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      <TextInput
        label="Enter password"
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (passwordError) {
            setPasswordError('');
          }
          if (confirmPasswordError === 'Passwords do not match!') {
            setConfirmPasswordError('');
          }
        }}
        mode="outlined"
        style={styles.input}
        secureTextEntry={isPasswordSecure}
        error={!!passwordError}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={isPasswordSecure ? 'eye-off' : 'eye'}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          />
        }
        disabled={loading}
      />
      <HelperText type="error" visible={!!passwordError}>
        {passwordError}
      </HelperText>

      <TextInput
        label="Confirm password"
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          if (confirmPasswordError) {
            setConfirmPasswordError('');
          }
        }}
        mode="outlined"
        style={styles.input}
        secureTextEntry={isConfirmPasswordSecure}
        error={!!confirmPasswordError}
        left={<TextInput.Icon icon="lock-check" />}
        right={
          <TextInput.Icon
            icon={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
            onPress={() => setIsConfirmPasswordSecure(!isConfirmPasswordSecure)}
          />
        }
        disabled={loading}
      />
      <HelperText type="error" visible={!!confirmPasswordError}>
        {confirmPasswordError}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
        loading={loading}
        disabled={loading}>
        {loading ? 'Creating Account...' : 'Signup'}
      </Button>
      <Button onPress={() => navigation.goBack()} disabled={loading}>
        Already have an account?
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
    marginBottom: 30,
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

export default CreateNewAccountScreen;

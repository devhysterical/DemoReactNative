import React, {useState, useContext} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../../contexts/AuthContext';

const LoginScreen = ({navigation}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const validateEmail = text => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email không được để trống.');
      return false;
    }
    if (!emailRegex.test(text)) {
      setEmailError('Email không hợp lệ.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = text => {
    if (!text) {
      setPasswordError('Mật khẩu không được để trống.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password,
      );
      console.log('User logged in successfully!', userCredential.user.uid);
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        errorMessage = 'Email hoặc mật khẩu không đúng.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Địa chỉ email không hợp lệ.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage =
          'Quá nhiều lần thử không thành công. Vui lòng thử lại sau.';
      }
      Alert.alert('Đăng nhập thất bại', errorMessage);
      console.error('Login Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: 'red'}]}>Restaurant App</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (emailError) {
            validateEmail(text);
          }
        }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!emailError}
        mode="outlined"
      />
      {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <TextInput
        label="Mật khẩu"
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (passwordError) {
            validatePassword(text);
          }
        }}
        style={styles.input}
        secureTextEntry={isPasswordSecure}
        error={!!passwordError}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={isPasswordSecure ? 'eye-off' : 'eye'}
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
          />
        }
      />
      {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPasswordButton}>
        <Text style={[styles.linkText, {color: theme.colors.primary}]}>
          Quên mật khẩu?
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          animating={true}
          color={theme.colors.primary}
          size="large"
          style={styles.loader}
        />
      ) : (
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={loading}>
          Đăng Nhập
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('SignUp')}
        style={[styles.button, styles.signUpButton]}
        labelStyle={[styles.buttonLabel, {color: theme.colors.primary}]}
        disabled={loading}>
        Tạo Tài Khoản Mới
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  signUpButton: {},
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
});

export default LoginScreen;

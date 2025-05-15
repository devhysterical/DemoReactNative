import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const theme = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [displayNameError, setDisplayNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);

  const validateForm = () => {
    let isValid = true;

    if (!displayName.trim()) {
      setDisplayNameError('Tên hiển thị không được để trống.');
      isValid = false;
    } else {
      setDisplayNameError('');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email không được để trống.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Email không hợp lệ.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate Password
    if (!password) {
      setPasswordError('Mật khẩu không được để trống.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError('Xác nhận mật khẩu không được để trống.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );
      const user = userCredential.user;
      await user.updateProfile({
        displayName: displayName.trim(),
      });

      await firestore().collection('GK').doc(user.uid).set({
        uid: user.uid,
        displayName: displayName.trim(),
        email: user.email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('User account created & signed in! UID:', user.uid);
      Alert.alert(
        'Đăng ký thành công!',
        'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.',
        [{text: 'OK', onPress: () => navigation.navigate('Login')}],
      );
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Địa chỉ email này đã được sử dụng.';
        setEmailError(errorMessage);
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Địa chỉ email không hợp lệ.';
        setEmailError(errorMessage);
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Mật khẩu quá yếu.';
        setPasswordError(errorMessage);
      }
      Alert.alert('Đăng ký thất bại', errorMessage);
      console.error('Sign Up Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[styles.title, {color: 'red'}]}>Sign Up</Text>

        <TextInput
          label="Tên hiển thị"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
          error={!!displayNameError}
          mode="outlined"
        />
        {!!displayNameError && (
          <Text style={styles.errorText}>{displayNameError}</Text>
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
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
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={isPasswordSecure} // Use state for password
          error={!!passwordError}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={isPasswordSecure ? 'eye-off' : 'eye'}
              onPress={() => setIsPasswordSecure(!isPasswordSecure)}
            />
          }
        />
        {!!passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry={isConfirmPasswordSecure}
          error={!!confirmPasswordError}
          mode="outlined"
          right={
            <TextInput.Icon
              icon={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
              onPress={() =>
                setIsConfirmPasswordSecure(!isConfirmPasswordSecure)
              }
            />
          }
        />
        {!!confirmPasswordError && (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        )}

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
            onPress={handleSignUp}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={loading}>
            Đăng Ký
          </Button>
        )}
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.buttonLink}
          disabled={loading}>
          Quay lại Đăng nhập
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
  buttonLink: {
    marginTop: 15,
  },
  loader: {
    marginTop: 20,
  },
});

export default SignUpScreen;

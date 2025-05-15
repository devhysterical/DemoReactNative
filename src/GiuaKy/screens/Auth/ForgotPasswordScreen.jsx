import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({navigation}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = text => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      setEmailError('Email không được để trống.');
      return false;
    }
    if (!emailRegex.test(text.trim())) {
      setEmailError('Email không hợp lệ.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert(
        'Kiểm tra Email',
        'Một liên kết để đặt lại mật khẩu đã được gửi đến email của bạn (nếu tài khoản tồn tại).',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Địa chỉ email không hợp lệ.';
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert(
          'Kiểm tra Email',
          'Nếu tài khoản của bạn tồn tại, một liên kết để đặt lại mật khẩu sẽ được gửi đến email của bạn.',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
        setLoading(false);
        return;
      }
      Alert.alert('Lỗi', errorMessage);
      console.error('Password Reset Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <Text style={styles.subtitle}>
        Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn một liên
        kết để đặt lại mật khẩu.
      </Text>
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
          onPress={handlePasswordReset}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          disabled={loading}>
          Gửi Liên Kết Đặt Lại
        </Button>
      )}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.buttonLink}
        disabled={loading}>
        Quay lại Đăng nhập
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
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

export default ForgotPasswordScreen;

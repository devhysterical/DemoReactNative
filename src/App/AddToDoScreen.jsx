import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {addTodo, updateExistingTodo} from '../services/firestoreService';

const AddToDoScreen = ({navigation, route}) => {
  const theme = useTheme();
  const existingTodo = route.params?.todo;

  const [title, setTitle] = useState(existingTodo ? existingTodo.title : '');
  const [description, setDescription] = useState(
    existingTodo ? existingTodo.description : '',
  );
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  const isEditMode = Boolean(existingTodo);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới',
    });
  }, [navigation, isEditMode]);

  const handleSaveTask = async () => {
    if (!title.trim()) {
      setTitleError('Tiêu đề không được để trống');
      return;
    }
    setTitleError('');
    setLoading(true);

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateExistingTodo(existingTodo.id, {
          title: title.trim(),
          description: description.trim(),
        });
        Alert.alert('Thành công', 'Công việc đã được cập nhật.');
      } else {
        await addTodo(currentUser.uid, title.trim(), description.trim());
        Alert.alert('Thành công', 'Công việc mới đã được thêm.');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Lỗi', `Không thể lưu công việc: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall" style={styles.header}>
          {isEditMode ? 'Chỉnh Sửa Chi Tiết Công Việc' : 'Tạo Công Việc Mới'}
        </Text>

        <TextInput
          label="Tiêu đề công việc"
          value={title}
          onChangeText={text => {
            setTitle(text);
            if (titleError && text.trim()) {
              setTitleError('');
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!titleError}
        />
        {!!titleError && <Text style={styles.errorText}>{titleError}</Text>}

        <TextInput
          label="Mô tả (tùy chọn)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSaveTask}
          loading={loading}
          disabled={loading}
          style={styles.button}
          icon={isEditMode ? 'content-save-edit' : 'plus-circle'}>
          {isEditMode ? 'Lưu Thay Đổi' : 'Thêm Công Việc'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default AddToDoScreen;

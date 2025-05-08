import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Lấy UID của user hiện tại
const getCurrentUserId = () => {
  const user = auth().currentUser;
  if (user) {
    return user.uid;
  }
  return null;
};

// Collection cho ToDos của mỗi user
const getTodosCollection = () => {
  return firestore().collection('todos');
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  console.log('Inside createUserProfileDocument, userAuth:', userAuth);
  if (!userAuth) {
    console.log('userAuth is null or undefined, returning.');
    return;
  }

  const userRef = firestore().doc(`users/${userAuth.uid}`);
  console.log('User ref path:', userRef.path);

  const snapshot = await userRef.get();
  console.log('Snapshot exists:', snapshot.exists);

  if (!snapshot.exists) {
    console.log('Snapshot does not exist, attempting to set new document.');
    const {email, displayName} = userAuth;
    const createdAt = firestore.FieldValue.serverTimestamp();
    try {
      await userRef.set({
        uid: userAuth.uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt,
        photoURL: userAuth.photoURL || null,
        ...additionalData,
      });
      console.log(
        'User profile document set successfully in Firestore for UID:',
        userAuth.uid,
      );
    } catch (error) {
      console.error(
        'Error setting user profile document in Firestore: ',
        error,
      );
      throw error;
    }
  } else {
    console.log('User profile document already exists for UID:', userAuth.uid);
  }
  return userRef;
};

export const addTodo = async (userId, title, description) => {
  if (!userId || !title) {
    throw new Error('User ID and title are required to add a todo.');
  }
  try {
    await getTodosCollection().add({
      userId,
      title,
      description: description || '',
      completed: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    console.log('Todo added successfully for user:', userId);
  } catch (error) {
    console.error('Error adding todo: ', error);
    throw error;
  }
};

export const getTodos = (userId, callback, errorCallback) => {
  if (!userId) {
    if (errorCallback)
      errorCallback(new Error('User ID is null, cannot fetch todos.'));
    return () => {};
  }
  const unsubscribe = getTodosCollection()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      querySnapshot => {
        const todos = [];
        querySnapshot.forEach(documentSnapshot => {
          todos.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        callback(todos);
      },
      error => {
        console.error('Error fetching todos from service: ', error);
        if (errorCallback) {
          errorCallback(error);
        }
      },
    );
  return unsubscribe;
};

export const updateTodoCompletion = async (todoId, completed) => {
  try {
    await getTodosCollection().doc(todoId).update({
      completed,
    });
  } catch (error) {
    console.error('Error updating todo completion: ', error);
    throw error;
  }
};

export const updateExistingTodo = async (todoId, dataToUpdate) => {
  if (!todoId) {
    throw new Error('Todo ID is required to update a todo.');
  }
  try {
    await getTodosCollection()
      .doc(todoId)
      .update({
        ...dataToUpdate,
        updatedAt: firestore.FieldValue.serverTimestamp(), // Tùy chọn: thêm trường updatedAt
      });
    console.log('Todo updated successfully:', todoId);
  } catch (error) {
    console.error('Error updating todo: ', error);
    throw error;
  }
};

export const deleteTodo = async todoId => {
  if (!todoId) {
    console.error('Todo ID is missing for delete');
    return;
  }
  try {
    await getTodosCollection().doc(todoId).delete();
  } catch (error) {
    console.error('Error deleting todo: ', error);
    throw error;
  }
};

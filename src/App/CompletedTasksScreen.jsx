import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {List, Checkbox, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  updateTodoCompletion,
  deleteTodo,
} from '../../services/firestoreService';

const CompletedTasksScreen = ({navigation}) => {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => auth().currentUser);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(newUser => {
      if (mountedRef.current) {
        setUser(newUser);
      }
    });
    return subscriber;
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot = () => {};

    if (user) {
      if (mountedRef.current) setLoading(true);
      console.log(
        `CompletedTasksScreen: Setting up listener for user ${user.uid}`,
      );
      unsubscribeSnapshot = firestore()
        .collection('todos')
        .where('userId', '==', user.uid)
        .where('completed', '==', true)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          querySnapshot => {
            if (mountedRef.current) {
              const tasks = [];
              querySnapshot.forEach(documentSnapshot => {
                tasks.push({
                  id: documentSnapshot.id,
                  ...documentSnapshot.data(),
                });
              });
              setCompletedTodos(tasks);
              setLoading(false);
            }
          },
          error => {
            if (mountedRef.current) {
              console.error(
                'CompletedTasksScreen: Error fetching completed todos: ',
                error,
              );
              if (error.code !== 'permission-denied') {
                Alert.alert('Error', 'Could not fetch completed tasks.');
              }
              setLoading(false);
            }
          },
        );
    } else {
      if (mountedRef.current) {
        console.log(
          'CompletedTasksScreen: No authenticated user, clearing data.',
        );
        setCompletedTodos([]);
        setLoading(false);
      }
    }

    return () => {
      console.log(
        `CompletedTasksScreen: useEffect cleanup for Firestore listener. User was: ${user?.uid}`,
      );
      unsubscribeSnapshot();
    };
  }, [user]);

  const handleToggleComplete = async (id, currentCompletedStatus) => {
    try {
      await updateTodoCompletion(id, !currentCompletedStatus);
    } catch (error) {
      Alert.alert('Error', 'Could not update task status.');
    }
  };

  const handleDeleteTask = async id => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to permanently delete this task?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteTodo(id);
            } catch (error) {
              Alert.alert('Error', 'Could not delete task.');
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderTodoItem = ({item}) => (
    <List.Item
      title={item.title}
      titleStyle={{
        textDecorationLine: 'line-through',
        opacity: 0.7,
      }}
      description={item.createdAt?.toDate().toLocaleDateString()}
      left={() => (
        <Checkbox
          status={'checked'}
          onPress={() => handleToggleComplete(item.id, item.completed)}
          color="green"
        />
      )}
      right={() => (
        <TouchableOpacity
          onPress={() => handleDeleteTask(item.id)}
          style={{padding: 8}}>
          <Icon name="delete-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
      onPress={() => handleToggleComplete(item.id, item.completed)}
      style={styles.listItem}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Loading completed tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {completedTodos.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="check-circle-outline" size={60} color="lightgray" />
          <Text style={styles.emptyText}>No completed tasks yet.</Text>
        </View>
      ) : (
        <FlatList
          data={completedTodos}
          renderItem={renderTodoItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: 'gray',
  },
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
});

export default CompletedTasksScreen;

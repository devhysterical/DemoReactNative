import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Button, List, Checkbox, Divider, FAB} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {
  getTodos,
  updateTodoCompletion,
  deleteTodo,
} from '../services/firestoreService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ToDoListScreen = ({navigation}) => {
  const [todos, setTodos] = useState([]);
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
    let unsubscribeFromTodos = () => {};

    if (user) {
      if (mountedRef.current) setLoading(true);
      console.log(`ToDoListScreen: Setting up listener for user ${user.uid}`);
      unsubscribeFromTodos = getTodos(
        user.uid,
        fetchedTodos => {
          if (mountedRef.current) {
            setTodos(fetchedTodos);
            setLoading(false);
          }
        },
        error => {
          if (mountedRef.current) {
            console.error(
              'ToDoListScreen: Error callback from getTodos:',
              error,
            );
            if (error.code !== 'permission-denied') {
              Alert.alert('Error', 'Could not fetch your to-do list.');
            }
            setLoading(false);
          }
        },
      );
    } else {
      if (mountedRef.current) {
        console.log('ToDoListScreen: No authenticated user, clearing data.');
        setTodos([]);
        setLoading(false);
      }
    }

    return () => {
      console.log(
        `ToDoListScreen: useEffect cleanup for Firestore listener. User was: ${user?.uid}`,
      );
      unsubscribeFromTodos();
    };
  }, [user]);

  const handleToggleComplete = async (id, currentCompletedStatus) => {
    try {
      await updateTodoCompletion(id, !currentCompletedStatus);
    } catch (error) {
      Alert.alert('Error', 'Could not update task status.');
    }
  };

  const handleDelete = async id => {
    Alert.alert('Delete ToDo', 'Are you sure you want to delete this task?', [
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
    ]);
  };

  const renderTodoItem = ({item}) => (
    <List.Item
      title={item.title}
      titleStyle={{
        textDecorationLine: item.completed ? 'line-through' : 'none',
        opacity: item.completed ? 0.6 : 1,
      }}
      description={
        item.description || item.createdAt?.toDate().toLocaleDateString()
      }
      left={() => (
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => handleToggleComplete(item.id, item.completed)}
        />
      )}
      right={() => (
        <Button onPress={() => handleDelete(item.id)} color="red">
          <Icon name="delete-outline" size={24} color="red" />
        </Button>
      )}
      onPress={() => navigation.navigate('AddTask', {todo: item})}
      style={styles.listItem}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="tomato" />
        <Text>Loading ToDos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {todos.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="format-list-checks" size={60} color="lightgray" />
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: 'gray',
  },
  listItem: {
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'tomato',
  },
});

export default ToDoListScreen;

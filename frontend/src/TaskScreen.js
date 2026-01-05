import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await axios.post(`http://localhost:5000/api/tasks/${taskId}/complete`);
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
            <Button title="Complete" onPress={() => completeTask(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  taskText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TaskScreen;

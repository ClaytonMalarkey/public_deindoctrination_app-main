import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Public Deindoctrination App</Text>
      <Button title="View Tasks" onPress={() => navigation.navigate('Tasks')} />
      <Button title="View Rewards" onPress={() => navigation.navigate('Rewards')} />
      <Button title="Leaderboard" onPress={() => navigation.navigate('Leaderboard')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

export default HomeScreen;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/leaderboard");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.points}>{item.points} Points</Text>
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
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1e1e1e",
    marginVertical: 5,
    borderRadius: 5,
  },
  rank: {
    fontSize: 18,
    color: "#ffd700",
  },
  username: {
    fontSize: 18,
    color: "#fff",
  },
  points: {
    fontSize: 18,
    color: "#00ff00",
  },
});

export default Leaderboard;

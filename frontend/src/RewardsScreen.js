import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import axios from "axios";

const RewardsScreen = () => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetchUserPoints();
    fetchRewards();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/points");
      setPoints(response.data.points);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rewards");
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const redeemReward = async (rewardId, cost) => {
    if (points >= cost) {
      try {
        await axios.post(`http://localhost:5000/api/rewards/redeem/${rewardId}`);
        fetchUserPoints();
        alert("Reward redeemed!");
      } catch (error) {
        console.error("Error redeeming reward:", error);
      }
    } else {
      alert("Not enough points!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Points: {points}</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.rewardItem}>
            <Text style={styles.rewardText}>{item.name} - {item.cost} Points</Text>
            <Button title="Redeem" onPress={() => redeemReward(item._id, item.cost)} />
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
  rewardItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#1e1e1e",
    borderRadius: 5,
  },
  rewardText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default RewardsScreen;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";

const LeaderboardScreen = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/leaderboard");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching leaderboard", error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={[styles.userItem, index === 0 && styles.topRank]}>
                        <Text style={styles.rank}>{index + 1}</Text>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.points}>{item.points} pts</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212", padding: 10 },
    userItem: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#1E1E1E", borderRadius: 10, marginBottom: 10 },
    topRank: { backgroundColor: "#ff9800" },
    rank: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    username: { color: "#fff", fontSize: 18 },
    points: { color: "#ff9800", fontSize: 18 }
});

export default LeaderboardScreen;

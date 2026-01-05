import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axios from "axios";

const ProfileScreen = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:5000/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user profile", error);
        }
    };

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.stats}>Points: {user.points}</Text>
                </>
            ) : (
                <Text style={styles.loading}>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#121212" },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    name: { color: "#fff", fontSize: 24, fontWeight: "bold" },
    stats: { color: "#ff9800", fontSize: 18 },
    loading: { color: "#777", fontSize: 18 }
});

export default ProfileScreen;

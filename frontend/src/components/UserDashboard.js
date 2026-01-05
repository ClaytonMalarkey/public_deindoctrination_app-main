// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";

function UserDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/me")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h2>User Dashboard</h2>
      {userData ? (
        <div>
          <p>Welcome back, {userData.name}!</p>
          <p>Your progress: {userData.progress}%</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default UserDashboard;

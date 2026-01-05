// frontend/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';  // Redirect if no token
      } else {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (err) {
          window.location.href = '/login';  // Redirect if token is invalid
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <p>Progress: {JSON.stringify(user.progress)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

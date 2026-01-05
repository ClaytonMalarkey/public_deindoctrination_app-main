import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem('token');

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '50px 20px', 
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#333' }}>
        Welcome to Deindoctrination App
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#666' }}>
        Complete tasks, earn points, and climb the leaderboard!
      </p>
      
      {token ? (
        <div>
          <p style={{ marginBottom: '20px' }}>You're already logged in!</p>
          <Link 
            to="/dashboard"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#4a7c59',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem'
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <nav style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link 
            to="/login"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#4a7c59',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem'
            }}
          >
            Login
          </Link>
          <Link 
            to="/register"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '1.1rem'
            }}
          >
            Register
          </Link>
        </nav>
      )}
    </div>
  );
}

export default Home;

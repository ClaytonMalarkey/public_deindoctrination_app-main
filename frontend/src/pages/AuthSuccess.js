import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refresh');
    const userStr = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && userStr) {
      try {
        // Store tokens and user data
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing OAuth success:', error);
        navigate('/login?error=processing_failed');
      }
    } else {
      navigate('/login?error=missing_data');
    }
  }, [navigate, location]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '20px'
        }}>
          🔄
        </div>
        <h2 style={{
          color: '#2d5016',
          marginBottom: '10px'
        }}>
          Completing Sign In...
        </h2>
        <p style={{
          color: '#666'
        }}>
          Please wait while we redirect you to your dashboard.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
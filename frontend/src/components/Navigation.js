import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ showBackToDashboard = false, title = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkStyle = (path) => ({
    padding: '10px 20px',
    backgroundColor: isActive(path) ? '#2d5016' : '#4a7c59',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    display: 'inline-block'
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      padding: '15px 0',
      borderBottom: '2px solid #f0f0f0'
    }}>
      {/* Left side - Back button or navigation */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {showBackToDashboard && location.pathname !== '/dashboard' && (
          <Link 
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 20px',
              backgroundColor: '#4a7c59',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#3d6b4a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4a7c59'}
          >
            ← Dashboard
          </Link>
        )}
        
        {/* Navigation Links */}
        {location.pathname === '/dashboard' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link 
              to="/leaderboard"
              style={getLinkStyle('/leaderboard')}
              onMouseEnter={(e) => {
                if (!isActive('/leaderboard')) {
                  e.target.style.backgroundColor = '#3d6b4a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/leaderboard')) {
                  e.target.style.backgroundColor = '#4a7c59';
                }
              }}
            >
              🏆 Leaderboard
            </Link>
          </div>
        )}
      </div>

      {/* Center - Title */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && (
          <h1 style={{ 
            fontSize: '2rem', 
            margin: 0, 
            color: '#333',
            fontWeight: 'bold'
          }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right side - User actions */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* User info */}
        <div style={{ 
          fontSize: '14px', 
          color: '#666',
          marginRight: '10px'
        }}>
          Welcome back! 👋
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;
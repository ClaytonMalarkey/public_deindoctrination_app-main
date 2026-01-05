import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../api/api';
import UserProfileModal from '../components/UserProfileModal';
import Navigation from '../components/Navigation';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#f8f9fa';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🏆 Leaderboard</h1>
        <div style={{ padding: '50px', fontSize: '18px', color: '#666' }}>
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🏆 Leaderboard</h1>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          {error}
        </div>
        <button
          onClick={fetchLeaderboard}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a7c59',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Navigation showBackToDashboard={true} title="🏆 Leaderboard" />

      {/* Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Click on any user to view their assigned tasks and progress
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
          marginBottom: '40px',
          gap: '20px'
        }}>
          {/* 2nd Place */}
          <div
            onClick={() => handleUserClick(leaderboard[1])}
            style={{
              backgroundColor: '#f8f9fa',
              border: '3px solid #c0c0c0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              minWidth: '150px',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥈</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>
              {leaderboard[1].username}
            </div>
            <div style={{ color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {leaderboard[1].points} pts
            </div>
          </div>

          {/* 1st Place */}
          <div
            onClick={() => handleUserClick(leaderboard[0])}
            style={{
              backgroundColor: '#fff9c4',
              border: '3px solid #ffd700',
              borderRadius: '12px',
              padding: '25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              minWidth: '170px',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🥇</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '5px' }}>
              {leaderboard[0].username}
            </div>
            <div style={{ color: '#666', fontSize: '1.4rem', fontWeight: 'bold' }}>
              {leaderboard[0].points} pts
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ffa000', marginTop: '5px' }}>
              👑 Champion
            </div>
          </div>

          {/* 3rd Place */}
          <div
            onClick={() => handleUserClick(leaderboard[2])}
            style={{
              backgroundColor: '#f8f9fa',
              border: '3px solid #cd7f32',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              minWidth: '150px',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥉</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>
              {leaderboard[2].username}
            </div>
            <div style={{ color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {leaderboard[2].points} pts
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#4a7c59',
          color: 'white',
          padding: '15px 20px',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          Complete Rankings
        </div>
        
        {leaderboard.length > 0 ? (
          <div>
            {leaderboard.map((user, index) => (
              <div
                key={user.rank || index}
                onClick={() => handleUserClick(user)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 20px',
                  borderBottom: index < leaderboard.length - 1 ? '1px solid #e0e0e0' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  backgroundColor: index < 3 ? getRankColor(index + 1) : 'white'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = index < 3 ? getRankColor(index + 1) : 'white'}
              >
                {/* Rank */}
                <div style={{
                  minWidth: '60px',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {getRankIcon(index + 1)}
                </div>

                {/* User Info */}
                <div style={{ flex: 1, marginLeft: '15px' }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '2px'
                  }}>
                    {user.username}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Level {user.level}
                  </div>
                </div>

                {/* Points */}
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#4a7c59',
                  textAlign: 'right',
                  minWidth: '100px'
                }}>
                  {user.points}
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>
                    points
                  </div>
                </div>

                {/* Click indicator */}
                <div style={{
                  marginLeft: '15px',
                  color: '#999',
                  fontSize: '1.2rem'
                }}>
                  👁️
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            color: '#666',
            fontSize: '1.1rem'
          }}>
            No users found in leaderboard
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        color: '#2d5016'
      }}>
        💡 <strong>Tip:</strong> Click on any user to view their assigned tasks, completion progress, and achievements!
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          userId={selectedUser.id || selectedUser._id}
          username={selectedUser.username}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Leaderboard;
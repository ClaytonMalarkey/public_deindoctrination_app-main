import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/api';

const UserProfileModal = ({ userId, username, onClose }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserProfile(userId);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTaskStatusColor = (completed) => {
    return completed ? '#28a745' : '#ffc107';
  };

  const getTaskStatusText = (completed) => {
    return completed ? '✓ Completed' : '⏳ Pending';
  };

  if (!userId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '800px',
        maxHeight: '90vh',
        width: '90%',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            👤 {username}'s Profile
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => window.open('/leaderboard', '_self')}
              style={{
                background: '#6c757d',
                border: 'none',
                color: 'white',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ← Back to Leaderboard
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading profile...</div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {userProfile && (
          <div>
            {/* User Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                  {userProfile.user.points}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Points</div>
              </div>
              
              <div style={{
                backgroundColor: '#f3e5f5',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
                  Level {userProfile.user.level}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Current Level</div>
              </div>
              
              <div style={{
                backgroundColor: '#e8f5e8',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                  {userProfile.taskStats.completed}/{userProfile.taskStats.total}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Tasks Done</div>
              </div>
              
              <div style={{
                backgroundColor: '#fff3e0',
                padding: '15px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                  {userProfile.taskStats.completionRate}%
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>Completion</div>
              </div>
            </div>

            {/* Member Since */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              <strong>Member since:</strong> {formatDate(userProfile.user.joinedDate)}
            </div>

            {/* Assigned Tasks */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ 
                color: '#333', 
                borderBottom: '2px solid #4a7c59', 
                paddingBottom: '8px',
                marginBottom: '15px'
              }}>
                📋 Assigned Tasks ({userProfile.assignedTasks.length})
              </h3>
              
              {userProfile.assignedTasks.length > 0 ? (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {userProfile.assignedTasks.map((assignedTask, index) => (
                    <div
                      key={assignedTask._id}
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: assignedTask.completed ? '#f8f9fa' : 'white'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            margin: '0 0 5px 0',
                            color: assignedTask.completed ? '#666' : '#333',
                            textDecoration: assignedTask.completed ? 'line-through' : 'none'
                          }}>
                            {index + 1}. {assignedTask.taskId?.taskName || 'Unknown Task'}
                          </h4>
                          <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginBottom: '5px'
                          }}>
                            Category: {assignedTask.taskId?.taskCategory || 'N/A'} • 
                            Points: {assignedTask.taskId?.taskVirtualReward || 0}
                          </div>
                        </div>
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getTaskStatusColor(assignedTask.completed)
                        }}>
                          {getTaskStatusText(assignedTask.completed)}
                        </div>
                      </div>
                      
                      {assignedTask.taskId?.taskDescription && (
                        <div style={{
                          fontSize: '14px',
                          color: '#666',
                          fontStyle: 'italic',
                          marginTop: '8px'
                        }}>
                          {assignedTask.taskId.taskDescription.length > 100
                            ? assignedTask.taskId.taskDescription.substring(0, 100) + '...'
                            : assignedTask.taskId.taskDescription
                          }
                        </div>
                      )}
                      
                      {assignedTask.completed && assignedTask.completedAt && (
                        <div style={{
                          fontSize: '12px',
                          color: '#28a745',
                          marginTop: '8px'
                        }}>
                          ✓ Completed on {formatDate(assignedTask.completedAt)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  No tasks assigned yet
                </div>
              )}
            </div>

            {/* Recent Completed Tasks */}
            {userProfile.recentCompletedTasks.length > 0 && (
              <div>
                <h3 style={{ 
                  color: '#333', 
                  borderBottom: '2px solid #28a745', 
                  paddingBottom: '8px',
                  marginBottom: '15px'
                }}>
                  🏆 Recent Achievements
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px'
                }}>
                  {userProfile.recentCompletedTasks.map((task, index) => (
                    <div
                      key={task._id}
                      style={{
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '6px',
                        padding: '10px',
                        fontSize: '14px'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#155724' }}>
                        ✓ {task.taskName || 'Completed Task'}
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        {task.taskVirtualReward || 0} points
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 30px',
              backgroundColor: '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
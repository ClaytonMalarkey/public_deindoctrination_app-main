import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, leaderboardAPI, rewardsAPI, tasksAPI } from "../api/api";
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [loadingUserTasks, setLoadingUserTasks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [userRes, leaderboardRes, rewardsRes, myTasksRes] = await Promise.all([
        userAPI.getProfile(),
        leaderboardAPI.getLeaderboard(),
        rewardsAPI.getRewards(),
        tasksAPI.getMyTasks()
      ]);

      setUser(userRes.data);
      setLeaderboard(leaderboardRes.data);
      setRewards(rewardsRes.data);
      setTasks(myTasksRes.data.tasks || []);
      
      console.log('My assigned tasks:', myTasksRes.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await tasksAPI.completeTask(taskId);
      
      if (response.data.success) {
        // Show success message
        alert(`Task completed! You earned ${response.data.pointsEarned} points!`);
        
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  const handleUserClick = async (clickedUser) => {
    try {
      setLoadingUserTasks(true);
      setSelectedUser(clickedUser);
      
      // If clicking on current user, show their own tasks
      if (clickedUser.id === user?._id || clickedUser._id === user?._id || clickedUser.username === user?.username) {
        setSelectedUserTasks(tasks);
        setLoadingUserTasks(false);
        return;
      }

      // Fetch other user's profile and tasks
      const response = await userAPI.getUserProfile(clickedUser.id || clickedUser._id);
      setSelectedUserTasks(response.data.assignedTasks || []);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      alert('Failed to load user tasks');
      // Don't reset selectedUser, just show empty tasks
      setSelectedUserTasks([]);
    } finally {
      setLoadingUserTasks(false);
    }
  };

  const resetToMyTasks = () => {
    setSelectedUser(user);
    setSelectedUserTasks(tasks);
  };

  // Initialize with current user selected
  useEffect(() => {
    if (user && tasks.length > 0 && !selectedUser) {
      setSelectedUser(user);
      setSelectedUserTasks(tasks);
    }
  }, [user, tasks, selectedUser]);



  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Navigation title="🏠 Dashboard" />

      {user && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h2>Welcome, {user.username}!</h2>
          <p>Points: <strong>{user.points}</strong></p>
          <p>Level: <strong>{user.level}</strong></p>
          <p>Email: {user.email}</p>
          
          {selectedUser && selectedUser.username !== user?.username && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#e8f5e8',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#2d5016'
            }}>
              📋 Currently viewing <strong>{selectedUser.username}</strong>'s tasks and points
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Leaderboard Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Leaderboard</h3>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
            Click on any user to view their tasks and points
          </p>
          {leaderboard.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {leaderboard.slice(0, 5).map((player) => (
                <li 
                  key={player.rank} 
                  onClick={() => handleUserClick(player)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px 8px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    backgroundColor: selectedUser?.username === player.username ? '#4a7c59' : 'transparent',
                    color: selectedUser?.username === player.username ? 'white' : '#333'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.username !== player.username) {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.username !== player.username) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ 
                    fontWeight: selectedUser?.username === player.username ? 'bold' : 'normal',
                    color: selectedUser?.username === player.username ? 'white' : '#333'
                  }}>
                    #{player.rank} {player.username}
                    {player.username === user?.username && ' (You)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      color: selectedUser?.username === player.username ? 'white' : '#4a7c59', 
                      fontWeight: 'bold' 
                    }}>
                      {player.points} pts
                    </span>
                    <span style={{ 
                      color: selectedUser?.username === player.username ? 'white' : '#999', 
                      fontSize: '12px' 
                    }}>
                      {selectedUser?.username === player.username ? '👤' : '👁️'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No leaderboard data available</p>
          )}
        </div>

        {/* Tasks Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>
              {selectedUser?.username === user?.username ? 'My Assigned Tasks' : `${selectedUser?.username || 'User'}'s Assigned Tasks`}
            </h3>
          </div>

          {loadingUserTasks ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Loading tasks...
            </div>
          ) : (
            <>
              {selectedUserTasks.length > 0 ? (
                <div>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    {selectedUser?.username === user?.username ? (
                      `You have ${selectedUserTasks.filter(task => !task.completed).length} pending tasks`
                    ) : (
                      `${selectedUser?.username || 'User'} has ${selectedUserTasks.filter(task => !task.completed).length} pending tasks`
                    )}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedUserTasks.slice(0, 5).map((assignedTask) => (
                      <li key={assignedTask._id} style={{ 
                        padding: '12px 0',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: assignedTask.completed ? 'normal' : 'bold',
                            color: assignedTask.completed ? '#999' : '#333',
                            textDecoration: assignedTask.completed ? 'line-through' : 'none'
                          }}>
                            {assignedTask.taskId?.taskName || assignedTask.taskId?.title || 'Unknown Task'}
                          </div>
                          <small style={{ color: '#666' }}>
                            {assignedTask.taskId?.taskCategory || assignedTask.taskId?.category} • 
                            {assignedTask.taskId?.taskVirtualReward || assignedTask.taskId?.rewardPoints || 0} points
                          </small>
                        </div>
                        <div style={{ marginLeft: '10px' }}>
                          {assignedTask.completed ? (
                            <span style={{ color: '#28a745', fontSize: '12px' }}>✓ Completed</span>
                          ) : selectedUser?.username === user?.username ? (
                            <button 
                              onClick={() => handleCompleteTask(assignedTask.taskId._id)}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#4a7c59',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Complete
                            </button>
                          ) : (
                            <span style={{ color: '#ffc107', fontSize: '12px' }}>⏳ Pending</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {selectedUserTasks.length > 5 && (
                    <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
                      ...and {selectedUserTasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              ) : (
                <p>
                  {selectedUser?.username === user?.username 
                    ? 'No tasks assigned yet' 
                    : `${selectedUser?.username || 'User'} has no tasks assigned yet`
                  }
                </p>
              )}
            </>
          )}
        </div>

        {/* Rewards/Points Section */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>
            {selectedUser?.username === user?.username ? 'Available Rewards' : `${selectedUser?.username || 'User'}'s Points`}
          </h3>
          
          {selectedUser?.username === user?.username ? (
            // Show rewards for current user
            <>
              {rewards.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {rewards.slice(0, 3).map((reward) => (
                    <li key={reward._id} style={{ 
                      padding: '8px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <div>{reward.name}</div>
                      <small style={{ color: '#666' }}>{reward.cost} points</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No rewards available</p>
              )}
            </>
          ) : (
            // Show points and stats for selected user
            <div>
              <div style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a7c59' }}>
                  {selectedUser?.points || 0}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  Total Points Earned
                </div>
              </div>
              
              <div style={{ fontSize: '14px', color: '#666' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Level:</strong> {selectedUser?.level || 1}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Rank:</strong> #{leaderboard.find(p => p.username === selectedUser?.username)?.rank || 'N/A'}
                </div>
                {selectedUserTasks.length > 0 && (
                  <div>
                    <strong>Task Progress:</strong> {selectedUserTasks.filter(t => t.completed).length}/{selectedUserTasks.length} completed
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

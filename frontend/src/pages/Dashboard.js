import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const url = filterStatus 
        ? `http://localhost:5000/api/tasks?status=${filterStatus}`
        : 'http://localhost:5000/api/tasks';

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setTasks(data.data || data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate, filterStatus]);

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
    setShowCreateForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter(t => t._id !== taskId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">📋 TaskFlow</h1>
            <p className="tagline">Collaborate, Track, Succeed</p>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <div className="user-details">
                <p className="user-name">{user?.name || 'User'}</p>
                <p className="user-role">{user?.role || 'Member'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-section">
            <h3>Filters</h3>
            <div className="filter-group">
              <button 
                className={`filter-btn ${!filterStatus ? 'active' : ''}`}
                onClick={() => {
                  setFilterStatus('');
                  fetchTasks();
                }}
              >
                All Tasks
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Todo' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Todo')}
              >
                📝 To Do
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'In Progress' ? 'active' : ''}`}
                onClick={() => setFilterStatus('In Progress')}
              >
                ⚙️ In Progress
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Blocked' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Blocked')}
              >
                🚫 Blocked
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'Done' ? 'active' : ''}`}
                onClick={() => setFilterStatus('Done')}
              >
                ✅ Done
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{tasks.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{tasks.filter(t => t.status === 'Todo').length}</span>
                <span className="stat-label">To Do</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{tasks.filter(t => t.status === 'Done').length}</span>
                <span className="stat-label">Done</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <main className="dashboard-main">
          {/* Create Task Section */}
          <div className="create-task-section">
            <h2>My Tasks</h2>
            <button 
              className="create-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              + New Task
            </button>
          </div>

          {showCreateForm && (
            <TaskForm 
              token={token}
              onTaskCreated={handleTaskCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* Tasks List */}
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            <TaskList 
              tasks={tasks}
              token={token}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tasks found</h3>
              <p>Create your first task to get started</p>
              <button 
                className="create-btn"
                onClick={() => setShowCreateForm(true)}
              >
                + Create Task
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

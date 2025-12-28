import React, { useState } from 'react';
import '../styles/TaskCard.css';
import TaskForm from './TaskForm';

const TaskCard = ({ task, token, onTaskUpdated, onTaskDeleted, isExpanded, onToggleExpand }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete');
        onTaskDeleted(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update');
      const updatedTask = await response.json();
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'Done';

  return (
    <>
      <div className="task-card" onClick={onToggleExpand}>
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
            {task.priority}
          </div>
        </div>

        {task.description && !isExpanded && (
          <p className="task-description-preview">{task.description.substring(0, 80)}...</p>
        )}

        {isExpanded && task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <div className="meta-item">
            <span className="meta-label">Assigned to:</span>
            <span className="meta-value">
              {task.assignedUser?.name || 'Unassigned'}
            </span>
          </div>
          {dueDate && (
            <div className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
              <span className="meta-label">Due:</span>
              <span className="meta-value">{dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="task-actions">
            {task.status !== 'Done' && (
              <select 
                className="status-select"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="Todo">📝 To Do</option>
                <option value="In Progress">⚙️ In Progress</option>
                <option value="Blocked">🚫 Blocked</option>
                <option value="Done">✅ Done</option>
              </select>
            )}
            <button 
              className="btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              ✏️ Edit
            </button>
            <button 
              className="btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <TaskForm 
          token={token}
          editingTask={task}
          onTaskCreated={(updatedTask) => {
            onTaskUpdated(updatedTask);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default TaskCard;

import React, { useState } from 'react';
import '../styles/TaskList.css';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, token, onTaskUpdated, onTaskDeleted }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  // Group tasks by status
  const groupedTasks = {
    'Todo': tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Blocked': tasks.filter(t => t.status === 'Blocked'),
    'Done': tasks.filter(t => t.status === 'Done')
  };

  return (
    <div className="task-list-container">
      <div className="kanban-board">
        {Object.entries(groupedTasks).map(([status, tasksInStatus]) => (
          <div key={status} className="kanban-column">
            <div className="column-header">
              <h3 className="column-title">
                {status === 'Todo' && '📝'} {status === 'In Progress' && '⚙️'} {status === 'Blocked' && '🚫'} {status === 'Done' && '✅'} {status}
              </h3>
              <span className="column-count">{tasksInStatus.length}</span>
            </div>
            <div className="tasks-list">
              {tasksInStatus.length > 0 ? (
                tasksInStatus.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    token={token}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                    isExpanded={expandedTask === task._id}
                    onToggleExpand={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                  />
                ))
              ) : (
                <div className="empty-column">
                  <p>No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

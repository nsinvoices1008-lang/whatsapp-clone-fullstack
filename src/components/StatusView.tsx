import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import './StatusView.css';

const StatusView: React.FC = () => {
  const user = useAuthStore(state => state.user);

  const statuses = [
    { id: '1', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe', time: '2 hours ago' },
    { id: '2', name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith', time: '5 hours ago' },
  ];

  return (
    <div className="status-view">
      <div className="status-header">
        <h2>Status</h2>
      </div>

      <div className="my-status">
        <div className="status-item">
          <div className="status-avatar-container">
            <img src={user?.avatar} alt="My Status" />
            <button className="add-status-btn">
              <FaPlus />
            </button>
          </div>
          <div className="status-info">
            <h3>My Status</h3>
            <p>Tap to add status update</p>
          </div>
        </div>
      </div>

      <div className="recent-status">
        <h3>Recent updates</h3>
        {statuses.map(status => (
          <div key={status.id} className="status-item">
            <div className="status-avatar-ring">
              <img src={status.avatar} alt={status.name} />
            </div>
            <div className="status-info">
              <h3>{status.name}</h3>
              <p>{status.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusView;
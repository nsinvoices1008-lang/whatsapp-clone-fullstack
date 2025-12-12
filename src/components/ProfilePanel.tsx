import React from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import './ProfilePanel.css';

interface ProfilePanelProps {
  onClose: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose }) => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <button onClick={onClose}>
          <FaTimes size={24} />
        </button>
        <h2>Profile</h2>
      </div>
      
      <div className="profile-content">
        <div className="profile-photo-section">
          <img src={user?.avatar} alt="Profile" />
          <button className="edit-photo-btn">
            <FaEdit /> Change Photo
          </button>
        </div>

        <div className="profile-info-section">
          <div className="info-item">
            <label>Your name</label>
            <div className="info-value">
              <span>{user?.name}</span>
              <FaEdit />
            </div>
          </div>

          <div className="info-item">
            <label>About</label>
            <div className="info-value">
              <span>{user?.about}</span>
              <FaEdit />
            </div>
          </div>

          <div className="info-item">
            <label>Phone</label>
            <div className="info-value">
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
import React from 'react';
import { FaPhone, FaVideo } from 'react-icons/fa';
import './CallWindow.css';

const CallWindow: React.FC = () => {
  const calls = [
    { id: '1', name: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe', type: 'video', time: 'Today, 10:30 AM', incoming: true },
    { id: '2', name: 'Jane Smith', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith', type: 'voice', time: 'Yesterday, 5:45 PM', incoming: false },
    { id: '3', name: 'Bob Wilson', avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson', type: 'video', time: 'Dec 10, 2:15 PM', incoming: true },
  ];

  return (
    <div className="call-window">
      <div className="call-header">
        <h2>Calls</h2>
      </div>

      <div className="call-list">
        {calls.map(call => (
          <div key={call.id} className="call-item">
            <img src={call.avatar} alt={call.name} />
            <div className="call-info">
              <h3>{call.name}</h3>
              <div className="call-details">
                {call.type === 'video' ? <FaVideo /> : <FaPhone />}
                <span className={call.incoming ? 'incoming' : 'outgoing'}>
                  {call.time}
                </span>
              </div>
            </div>
            <button className="call-btn">
              {call.type === 'video' ? <FaVideo size={20} /> : <FaPhone size={18} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallWindow;
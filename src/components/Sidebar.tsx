import React, { useState } from 'react';
import { FaUserCircle, FaUsers, FaComments, FaPhone, FaEllipsisV, FaSearch } from 'react-icons/fa';
import { MdPhotoCamera } from 'react-icons/md';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import './Sidebar.css';

interface SidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  currentView: string;
  onViewChange: (view: 'chat' | 'status' | 'calls' | 'profile') => void;
  onShowProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedChat, onSelectChat, currentView, onViewChange, onShowProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const { chats, createChat } = useChatStore();
  const user = useAuthStore(state => state.user);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = (type: 'individual' | 'group') => {
    const name = prompt(`Enter ${type} ${type === 'group' ? 'name' : 'contact name'}:`);
    if (name) {
      createChat({
        name,
        type,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        participants: [user!.id]
      });
      setShowNewChatModal(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <img 
            src={user?.avatar} 
            alt="Profile" 
            className="profile-avatar"
            onClick={onShowProfile}
          />
        </div>
        <div className="sidebar-header-right">
          <button onClick={() => onViewChange('status')} title="Status">
            <MdPhotoCamera size={24} />
          </button>
          <button onClick={() => setShowNewChatModal(!showNewChatModal)} title="New Chat">
            <FaComments size={20} />
          </button>
          <button title="Menu">
            <FaEllipsisV size={20} />
          </button>
        </div>
      </div>

      {showNewChatModal && (
        <div className="new-chat-modal">
          <button onClick={() => handleNewChat('individual')}>
            <FaUserCircle /> New Chat
          </button>
          <button onClick={() => handleNewChat('group')}>
            <FaUsers /> New Group
          </button>
        </div>
      )}

      <div className="sidebar-tabs">
        <button 
          className={currentView === 'chat' ? 'active' : ''}
          onClick={() => onViewChange('chat')}
        >
          <FaComments /> Chats
        </button>
        <button 
          className={currentView === 'status' ? 'active' : ''}
          onClick={() => onViewChange('status')}
        >
          <MdPhotoCamera /> Status
        </button>
        <button 
          className={currentView === 'calls' ? 'active' : ''}
          onClick={() => onViewChange('calls')}
        >
          <FaPhone /> Calls
        </button>
      </div>

      <div className="search-box">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="chat-list">
        {filteredChats.map(chat => (
          <div 
            key={chat.id}
            className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <img src={chat.avatar} alt={chat.name} />
            <div className="chat-item-info">
              <div className="chat-item-header">
                <h3>{chat.name}</h3>
                <span className="chat-time">
                  {chat.lastMessage && formatDistanceToNow(new Date(chat.lastMessageTime!), { addSuffix: false })}
                </span>
              </div>
              <div className="chat-item-message">
                <p>{chat.lastMessage || 'No messages yet'}</p>
                {chat.unreadCount > 0 && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
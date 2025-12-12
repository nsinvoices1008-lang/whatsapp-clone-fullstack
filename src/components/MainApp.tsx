import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import ProfilePanel from './ProfilePanel';
import StatusView from './StatusView';
import CallWindow from './CallWindow';
import './MainApp.css';

type View = 'chat' | 'status' | 'calls' | 'profile';

const MainApp: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('chat');
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="main-app">
      <Sidebar 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        currentView={currentView}
        onViewChange={setCurrentView}
        onShowProfile={() => setShowProfile(true)}
      />
      {currentView === 'chat' && (
        <ChatWindow 
          chatId={selectedChat} 
          onShowProfile={() => setShowProfile(true)}
        />
      )}
      {currentView === 'status' && <StatusView />}
      {currentView === 'calls' && <CallWindow />}
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default MainApp;
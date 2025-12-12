import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaVideo, FaSearch, FaEllipsisV, FaPaperclip, FaMicrophone, FaSmile, FaPaperPlane } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import './ChatWindow.css';

interface ChatWindowProps {
  chatId: string | null;
  onShowProfile: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onShowProfile }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { chats, messages, sendMessage } = useChatStore();
  const user = useAuthStore(state => state.user);
  
  const currentChat = chats.find(c => c.id === chatId);
  const chatMessages = messages[chatId || ''] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim() && chatId && user) {
      sendMessage(chatId, {
        text: message,
        senderId: user.id,
        senderName: user.name,
        type: 'text'
      });
      setMessage('');
      setShowEmoji(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && chatId && user) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 
                        file.type.startsWith('audio/') ? 'audio' : 'document';
        
        sendMessage(chatId, {
          text: file.name,
          senderId: user.id,
          senderName: user.name,
          type: fileType,
          mediaUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        if (chatId && user) {
          sendMessage(chatId, {
            text: 'Voice message',
            senderId: user.id,
            senderName: user.name,
            type: 'audio',
            mediaUrl: 'data:audio/mp3;base64,//sample'
          });
          setIsRecording(false);
        }
      }, 2000);
    }
  };

  if (!chatId) {
    return (
      <div className="chat-window-empty">
        <div className="empty-state">
          <h2>WhatsApp Clone</h2>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left" onClick={onShowProfile}>
          <img src={currentChat?.avatar} alt={currentChat?.name} />
          <div>
            <h3>{currentChat?.name}</h3>
            <span>online</span>
          </div>
        </div>
        <div className="chat-header-right">
          <button title="Voice Call"><FaPhone size={18} /></button>
          <button title="Video Call"><FaVideo size={20} /></button>
          <button title="Search"><FaSearch size={18} /></button>
          <button title="Menu"><FaEllipsisV size={18} /></button>
        </div>
      </div>

      <div className="messages-container">
        {chatMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
          >
            {msg.type === 'image' && msg.mediaUrl && (
              <img src={msg.mediaUrl} alt="Shared" className="message-media" />
            )}
            {msg.type === 'video' && msg.mediaUrl && (
              <video src={msg.mediaUrl} controls className="message-media" />
            )}
            {msg.type === 'audio' && (
              <div className="audio-message">
                <FaMicrophone /> Voice message
              </div>
            )}
            {(msg.type === 'text' || msg.type === 'document') && (
              <p>{msg.text}</p>
            )}
            <div className="message-meta">
              <span>{format(new Date(msg.timestamp), 'HH:mm')}</span>
              {msg.senderId === user?.id && (
                <span className="message-status">✓✓</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <button onClick={() => setShowEmoji(!showEmoji)} title="Emoji">
          <FaSmile size={24} />
        </button>
        <button onClick={() => fileInputRef.current?.click()} title="Attach">
          <FaPaperclip size={20} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
        <input 
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {message.trim() ? (
          <button onClick={handleSend} className="send-btn" title="Send">
            <FaPaperPlane size={20} />
          </button>
        ) : (
          <button 
            onClick={toggleRecording} 
            className={isRecording ? 'recording' : ''}
            title="Voice Message"
          >
            <FaMicrophone size={20} />
          </button>
        )}
      </div>

      {showEmoji && (
        <div className="emoji-picker-container">
          <EmojiPicker 
            onEmojiClick={(emojiData) => {
              setMessage(prev => prev + emojiData.emoji);
            }}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
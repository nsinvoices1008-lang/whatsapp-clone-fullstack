import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import './Login.css';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      login({
        id: Date.now().toString(),
        name,
        phone,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: 'online',
        about: 'Hey there! I am using WhatsApp'
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <FaWhatsapp size={60} color="#25d366" />
          <h1>WhatsApp Clone</h1>
          <p>Enter your details to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Avatar URL (optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MainApp from './components/MainApp';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <MainApp /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
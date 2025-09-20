import React from 'react';
import {  Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import {LoginPage} from './pages/LoginPage';

const App: React.FC = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>

  );
};

export default App;
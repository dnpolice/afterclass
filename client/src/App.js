import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Whiteboard from './components/pages/whiteboard';
import io from 'socket.io-client'
let socket = io(`http://localhost:5000/`,  { transports: ['websocket', 'polling', 'flashsocket'] });

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Whiteboard socket={socket}/>} />
      </Routes>
    </Router>
  )
};

export default App;

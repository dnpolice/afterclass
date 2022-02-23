import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Whiteboard from './components/pages/whiteboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Whiteboard />} />
      </Routes>
    </Router>
  )
};

export default App;

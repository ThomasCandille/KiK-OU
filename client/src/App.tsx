import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import User from './pages/User/User';
import View from './pages/View/View';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/user/:axe" element={<User />} />
        <Route path="/view/:axe" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;

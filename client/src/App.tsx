import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import User from './pages/User/User';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

function App() {
  const [selectedHomeAxe, setSelectedHomeAxe] = useState('');
  const [darkenedAxes, setDarkenedAxes] = useState<string[]>([]);

  const isRootDarkened = darkenedAxes.includes(selectedHomeAxe);

  useEffect(() => {
    const handleInitialState = ({ darkenedAxes = [] }: { darkenedAxes?: string[] }) => {
      setDarkenedAxes(darkenedAxes);
    };

    const handleDarkenedAxesUpdated = ({ darkenedAxes }: { darkenedAxes: string[] }) => {
      setDarkenedAxes(darkenedAxes);
    };

    socket.on('initialState', handleInitialState);
    socket.on('darkenedAxesUpdated', handleDarkenedAxesUpdated);

    return () => {
      socket.off('initialState', handleInitialState);
      socket.off('darkenedAxesUpdated', handleDarkenedAxesUpdated);
    };
  }, []);

  return (
    <div className={`root-app ${isRootDarkened ? 'darkened-axe' : ''}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Home onSelectedAxeChange={setSelectedHomeAxe} />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

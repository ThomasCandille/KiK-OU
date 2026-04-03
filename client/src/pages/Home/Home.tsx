import React, { useEffect, useState } from 'react';
import './Home.css';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { io } from 'socket.io-client';
import { LocationState } from '../../components/Location/Location';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

type InitialStatePayload = {
  locations: { [key: string]: LocationState };
  axes: string[];
};

type UsersFromAxePayload = {
  users: string[];
};

type HomeProps = {
  onSelectedAxeChange: (axe: string) => void;
};

function Home({ onSelectedAxeChange }: HomeProps) {

  const formatCurrentDateTime = (date: Date) =>
    date.toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });

  const formatLastChangeTime = (date: Date) =>
    date.toLocaleTimeString('fr-FR');

  const [userLocationDict, setUserLocationDict] = useState<{ [key: string]: LocationState }>({});
  const [axes, setAxes] = useState<string[]>([]);
  const [usersFromAxe, setUsersFromAxe] = useState<string[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>(
    formatCurrentDateTime(new Date())
  );
  const [lastChangeTime, setLastChangeTime] = useState<string | null>(null);
  const displayedCount = usersFromAxe.length;
  const isCompactLayout = displayedCount <= 3;

  const handleAxeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAxe = event.target.value;
    onSelectedAxeChange(selectedAxe);
    if (selectedAxe) {
      socket.emit('axeChange', selectedAxe);
    } else {
      setUsersFromAxe([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(formatCurrentDateTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleInitialState = ({ locations, axes }: InitialStatePayload) => {
      setUserLocationDict(locations);
      setAxes(axes);
    };

    const handleStatusUpdated = (data: { user: string; location: LocationState }) => {
      setUserLocationDict(prev => ({
        ...prev,
        [data.user]: data.location
      }));
      setLastChangeTime(formatLastChangeTime(new Date()));
    };

    const handleUsersFromAxe = ({ users }: UsersFromAxePayload) => {
      setUsersFromAxe(users);
    };

    socket.on('initialState', handleInitialState);
    socket.on('statusUpdated', handleStatusUpdated);
    socket.on('usersFromAxe', handleUsersFromAxe);

    return () => {
      socket.off('initialState', handleInitialState);
      socket.off('statusUpdated', handleStatusUpdated);
      socket.off('usersFromAxe', handleUsersFromAxe);
    };
  }, [onSelectedAxeChange]);

  return (
    <div className="App">
      <header> 
        <h1>PRESENCE DES MEMBRES DE L'EQUIPE</h1>
        <p> - </p>
        <select onChange={handleAxeChange}>
          <option value="">Filtrer par axe</option>
          {axes.map(axe => (
            <option key={axe} value={axe}>{axe}</option>
          ))}
        </select>
        <p> - </p>
          <p>
            {currentDateTime} - Dernier changement :{' '}
            {lastChangeTime ? lastChangeTime : 'Aucun changement'}
          </p>
      </header>
      <div className={`profile-card-container ${isCompactLayout ? 'compact-layout' : 'wide-layout'}`}>

          {displayedCount > 0 ? (
            usersFromAxe.map((user, index) => (
              <div
                key={user}
                className={`profile-card-item ${!isCompactLayout && displayedCount % 2 !== 0 && index === 0 ? 'full-line' : ''}`}
              >
                <ProfileCard
                  name={user}
                  location={userLocationDict[user]}
                />
              </div>
            ))
          ) : (
            <p>Aucun utilisateur trouvé pour cet axe.</p>
          )}
        </div>
    </div>
        
  );
}

export default Home;


import React, { useEffect, useState } from 'react';
import './Home.css';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { io } from 'socket.io-client';
import { LocationState } from '../../components/Location/Location';
import LocationModal from '../../components/LocationModal/LocationModal';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

type InitialStatePayload = {
  locations: { [key: string]: LocationState };
  axes: string[];
};

type HomeProps = {
  onSelectedAxeChange: (axe: string) => void;
};

function Home({ onSelectedAxeChange }: HomeProps) {

  const formatCurrentDateTime = (date: Date) => {
    const datePart = date.toLocaleDateString('fr-FR', { month: '2-digit', day: '2-digit' });
    const timePart = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} ${timePart}`;
  };

  const formatLastChangeTime = (date: Date) =>
    date.toLocaleTimeString('fr-FR');

  const [userLocationDict, setUserLocationDict] = useState<{ [key: string]: LocationState }>({});
  const [userRoles, setUserRoles] = useState<{ [key: string]: string }>({});
  const [axes, setAxes] = useState<string[]>([]);
  const [usersFromAxe, setUsersFromAxe] = useState<string[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState<string>(
    formatCurrentDateTime(new Date())
  );
  const [lastChangeTime, setLastChangeTime] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedAxe, setSelectedAxe] = useState<string>('');
  const displayedCount = usersFromAxe.length;
  const isCompactLayout = displayedCount <= 3;

  const handleAxeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const axe = event.target.value;
    setSelectedAxe(axe);
    onSelectedAxeChange(axe);
    if (axe) {
      socket.emit('axeChange', axe);
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

    const handleUsersFromAxe = ({ users, roles }: { users: string[]; roles: { user: string; role: string }[] }) => {
      const roleByUser = roles.reduce((acc, { user, role }) => ({ ...acc, [user]: role }), {} as { [key: string]: string });
      const priorityUser = users.find(user => roleByUser[user]?.includes("Responsable"));
      const orderedUsers = priorityUser ? [priorityUser, ...users.filter(user => user !== priorityUser)] : users;

      setUsersFromAxe(orderedUsers);
      setUserRoles(roleByUser);

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

  const closeLocationModal = () => {
    setSelectedUser(null);
  };

  const handleLocationSelect = (location: Exclude<LocationState, 'inconnu'>) => {
    if (!selectedUser) {
      return;
    }

    socket.emit('statusUpdate', {
      user: selectedUser,
      location
    });

    closeLocationModal();
  };

  return (
    <div className="App">
      <header> 
        <p>
            {currentDateTime}
          </p>
        <p> - </p>
        <select onChange={handleAxeChange}>
          <option value="">CHOISIR AXE</option>
          {axes.map(axe => (
            <option key={axe} value={axe}>{axe}</option>
          ))}
        </select>
        <p className="last-change-time"> - </p>
          <p className="last-change-time">
            Dernier changement :{' '}{lastChangeTime ? lastChangeTime : 'Aucun changement'}
          </p>
        <button onClick={() => window.location.reload()}>Rafraîchir</button>
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
                  role={userRoles[user]}
                  onClick={() => setSelectedUser(user)}
                />
              </div>
            ))
          ) : (
            <p>Aucun utilisateur trouvé pour cet axe.</p>
          )}
        </div>
      <LocationModal
        isOpen={Boolean(selectedUser)}
        user={selectedUser}
        currentLocation={selectedUser ? userLocationDict[selectedUser] : 'inconnu'}
        selectedAxe={selectedAxe}
        onClose={closeLocationModal}
        onSelectLocation={handleLocationSelect}
      />

      <div className="information-container">
        <p className="information-text">
          BUREAU CDI MAINTENANT EN 302
        </p>
      </div>
    </div>
        
  );
}

export default Home;


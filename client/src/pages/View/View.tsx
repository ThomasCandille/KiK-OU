import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { LocationState } from '../../components/Location/Location';
import { getUserLocation, getUsersByAxe } from '../../services/api';
import socket from '../../services/socket';
import './View.css';

function formatAxeLabel(axe: string): string {
  return axe
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatUserLabel(user: string): string {
  return user
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getUserImageUrl(user: string): string {
  const firstName = user.split('-')[0];
  return `/icon_${firstName}.svg`;
}

type SocketStatusPayload = {
  user: string;
  location: LocationState;
};

const View = () => {
  const { axe = '' } = useParams();
  const [users, setUsers] = useState<string[]>([]);
  const [userLocationDict, setUserLocationDict] = useState<Record<string, LocationState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedAxe = useMemo(() => decodeURIComponent(axe), [axe]);

  useEffect(() => {
    const loadUsersForAxe = async () => {
      try {
        setLoading(true);
        setError(null);

        const usersFromAxe = await getUsersByAxe(decodedAxe);
        setUsers(usersFromAxe);

        const locations = await Promise.all(
          usersFromAxe.map(async user => {
            const location = await getUserLocation(user);
            return { user, location };
          })
        );

        const nextDict = locations.reduce<Record<string, LocationState>>((accumulator, currentValue) => {
          accumulator[currentValue.user] = currentValue.location;
          return accumulator;
        }, {});

        setUserLocationDict(nextDict);
      } catch (loadError) {
        setError('Impossible de charger les membres de cet axe.');
      } finally {
        setLoading(false);
      }
    };

    if (decodedAxe) {
      loadUsersForAxe();
    }
  }, [decodedAxe]);

  useEffect(() => {
    const handleStatusUpdated = (payload: SocketStatusPayload) => {
      if (!users.includes(payload.user)) {
        return;
      }

      setUserLocationDict(prev => ({
        ...prev,
        [payload.user]: payload.location
      }));
    };

    socket.on('statusUpdated', handleStatusUpdated);

    return () => {
      socket.off('statusUpdated', handleStatusUpdated);
    };
  }, [users]);

  return (
    <div className="view-page">
      <header className="view-header">
        <span>AXE : {formatAxeLabel(decodedAxe)}</span>
        <div className="view-header-links">
          <Link to="/" className="view-link">
            Axes
          </Link>
          <Link to={`/user/${encodeURIComponent(decodedAxe)}`} className="view-link">
            Mettre à jour
          </Link>
        </div>
      </header>

      {loading && <p className="view-info">Chargement des membres...</p>}
      {error && <p className="view-info">{error}</p>}

      {!loading && !error && (
        <div className="view-grid">
          {users.map(user => (
            <ProfileCard
              key={user}
              imageUrl={getUserImageUrl(user)}
              name={formatUserLabel(user)}
              location={userLocationDict[user]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default View;

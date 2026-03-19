import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './User.css';
import { LocationState } from '../../components/Location/Location';
import { getAxes, getUsersByAxe, updateUserLocation } from '../../services/api';
import socket from '../../services/socket';

const locationOptions: Array<{ value: LocationState; label: string }> = [
  { value: 'bureau', label: 'Au bureau' },
  { value: 'crealab', label: 'Au CreaLab' },
  { value: 'reunion', label: 'En réunion' },
  { value: 'teletravail', label: 'En télétravail' },
  { value: 'absent', label: 'Absent' }
];

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

const User = () => {
    const { axe } = useParams();
    const decodedAxe = useMemo(() => (axe ? decodeURIComponent(axe) : ''), [axe]);

    const [axes, setAxes] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<LocationState>('bureau');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!decodedAxe) {
                    const axesPayload = await getAxes();
                    setAxes(axesPayload);
                    setUsers([]);
                    setSelectedUser('');
                    return;
                }

                const usersPayload = await getUsersByAxe(decodedAxe);
                setUsers(usersPayload);
                setSelectedUser(usersPayload[0] || '');
            } catch (loadError) {
                setError('Impossible de charger les données.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [decodedAxe]);

    const submissionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        socket.emit('statusUpdate', {
            user: selectedUser,
            location: selectedLocation
        });

        await updateUserLocation(selectedUser, selectedLocation);

        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    if (loading) {
        return (
            <div className="user-page">
                <p className="user-info">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-page">
                <p className="user-info">{error}</p>
            </div>
        );
    }

    if (!decodedAxe) {
        return (
            <div className="user-page">
                <header className="user-header">SÉLECTIONNER UN AXE À MODIFIER</header>
                <div className="axis-selection-grid">
                    {axes.map(axis => (
                        <Link key={axis} to={`/user/${encodeURIComponent(axis)}`} className="axis-selection-card">
                            {formatAxeLabel(axis)}
                        </Link>
                    ))}
                </div>
                <Link to="/" className="user-back-link">Retour aux axes</Link>
            </div>
        );
    }

    return (
        <div className="user-page">
            <header className="user-header">MISE À JOUR - AXE : {formatAxeLabel(decodedAxe)}</header>
            <form className="user-form" onSubmit={submissionHandler}>
                <h2>Pour qui ?</h2>
                <select
                    name="user-select"
                    className="user-select"
                    value={selectedUser}
                    onChange={event => setSelectedUser(event.target.value)}
                >
                    {users.map(user => (
                        <option key={user} value={user}>
                            {formatUserLabel(user)}
                        </option>
                    ))}
                </select>

                <select
                    name="location-select"
                    className="location-select"
                    value={selectedLocation}
                    onChange={event => setSelectedLocation(event.target.value as LocationState)}
                >
                    {locationOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button className="user-submit-button">Valider</button>
                {showMessage && <p className="success-message">Le statut a été mis à jour</p>}
            </form>

            <div className="user-links-row">
                <Link to={`/view/${encodeURIComponent(decodedAxe)}`} className="user-back-link">Voir cet axe</Link>
                <Link to="/" className="user-back-link">Retour aux axes</Link>
            </div>
        </div>
    );
};

export default User;
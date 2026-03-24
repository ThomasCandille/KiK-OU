import React, { useEffect, useState } from "react";
import './User.css';
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3001");

const User = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [showDarkenMessage, setShowDarkenMessage] = useState(false);
    const [axes, setAxes] = useState<string[]>([]);
    const [selectedAxe, setSelectedAxe] = useState('');
    const [usersFromAxe, setUsersFromAxe] = useState<string[]>([]);
    const [darkenedAxes, setDarkenedAxes] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('bureau');

    useEffect(() => {
        const handleInitialState = ({ axes, darkenedAxes }: { axes: string[]; darkenedAxes?: string[] }) => {
            setAxes(axes);
            setDarkenedAxes(darkenedAxes || []);
        };

        const handleUsersFromAxe = ({ users }: { users: string[] }) => {
            setUsersFromAxe(users);
        };

        const handleDarkenedAxesUpdated = ({ darkenedAxes }: { darkenedAxes: string[] }) => {
            setDarkenedAxes(darkenedAxes || []);
        };

        socket.on("initialState", handleInitialState);
        socket.on("usersFromAxe", handleUsersFromAxe);
        socket.on("darkenedAxesUpdated", handleDarkenedAxesUpdated);

        return () => {
            socket.off("initialState", handleInitialState);
            socket.off("usersFromAxe", handleUsersFromAxe);
            socket.off("darkenedAxesUpdated", handleDarkenedAxesUpdated);
        };
    }, []);

    useEffect(() => {
        if (axes.length > 0 && !selectedAxe) {
            const firstAxe = axes[0];
            setSelectedAxe(firstAxe);
            socket.emit('axeChange', firstAxe);
        }
    }, [axes, selectedAxe]);

    useEffect(() => {
        setSelectedUser(usersFromAxe[0] || '');
    }, [usersFromAxe]);

    const handleAxeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const axe = event.target.value;
        setSelectedAxe(axe);
        socket.emit('axeChange', axe);
    };

    const submissionHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        socket.emit("statusUpdate", {
            user: selectedUser,
            location: selectedLocation
        });

        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    }

    const handleDarkenAxe = () => {
        if (!selectedAxe) {
            return;
        }

        socket.emit('darkenAxe', selectedAxe);
        setShowDarkenMessage(true);
        setTimeout(() => setShowDarkenMessage(false), 3000);
    };

    const isSelectedAxeDarkened = darkenedAxes.includes(selectedAxe);

    return (
        <div className="user-page">
            <form className="user-form" onSubmit={submissionHandler}>
                <h2> Axes </h2>
                <select name="axe-select" className="axe-select" value={selectedAxe} onChange={handleAxeChange}>
                    {axes.map(axe => (
                        <option key={axe} value={axe}>
                            {axe}
                        </option>
                    ))}
                </select>
                <h2> Pour qui ? </h2>
                <select
                    name="user-select"
                    className="user-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    {usersFromAxe.length > 0 ? (
                        usersFromAxe.map(user => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))
                    ) : (
                        <option value="">Aucun utilisateur trouvé pour cet axe</option>
                    )}
                </select>
                <select
                    name="location-select"
                    className="location-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value="bureau">Au bureau</option>
                    <option value="crealab">Au CreaLab</option>
                    <option value="reunion">En réunion</option>
                    <option value="teletravail">En télétravail</option>
                    <option value="absent">Absent</option>
                </select>
                <button className="user-submit-button">Valider</button>
                <button type="button" className="darken-axe-button" onClick={handleDarkenAxe}>
                    {isSelectedAxeDarkened ? "Retirer l'assombrissement" : "Assombrir l'axe sélectionné"}
                </button>
                {showMessage && <p className="success-message">Le statut a été mis à jour</p>}
                {showDarkenMessage && (
                    <p className="success-message">
                        {isSelectedAxeDarkened
                            ? `L'axe ${selectedAxe} est assombri sur Home`
                            : `L'axe ${selectedAxe} est revenu à l'affichage normal`}
                    </p>
                )}
            </form>
        </div>
    );
}

export default User;
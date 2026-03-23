import React, { useEffect, useState } from "react";
import './User.css';
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3001");

const User = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [axes, setAxes] = useState<string[]>([]);
    const [selectedAxe, setSelectedAxe] = useState('');
    const [usersFromAxe, setUsersFromAxe] = useState<string[]>([]);

    useEffect(() => {
        const handleInitialState = ({ axes }: { axes: string[] }) => {
            setAxes(axes);
        };

        const handleUsersFromAxe = ({ users }: { users: string[] }) => {
            setUsersFromAxe(users);
        };

        socket.on("initialState", handleInitialState);
        socket.on("usersFromAxe", handleUsersFromAxe);

        return () => {
            socket.off("initialState", handleInitialState);
            socket.off("usersFromAxe", handleUsersFromAxe);
        };
    }, []);

    useEffect(() => {
        if (axes.length > 0 && !selectedAxe) {
            const firstAxe = axes[0];
            setSelectedAxe(firstAxe);
            socket.emit('axeChange', firstAxe);
        }
    }, [axes, selectedAxe]);

    const handleAxeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const axe = event.target.value;
        setSelectedAxe(axe);
        socket.emit('axeChange', axe);
    };

    const submissionHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("statusUpdate", {
            user: (document.querySelector('.user-select') as HTMLSelectElement)?.value,
            location: (document.querySelector('.location-select') as HTMLSelectElement)?.value
        });

        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    }

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
                <select name="user-select" className="user-select">
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
                <select name="location-select" className="location-select">
                    <option value="bureau">Au bureau</option>
                    <option value="crealab">Au CreaLab</option>
                    <option value="reunion">En réunion</option>
                    <option value="teletravail">En télétravail</option>
                    <option value="absent">Absent</option>
                </select>
                <button className="user-submit-button">Valider</button>
                {showMessage && <p className="success-message">Le statut a été mis à jour</p>}
            </form>
        </div>
    );
}

export default User;
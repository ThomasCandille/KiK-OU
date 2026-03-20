import React, { useState } from "react";
import './User.css';
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3001");

const User = () => {
    const [showMessage, setShowMessage] = useState(false);

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
                <h2> Pour qui ? </h2>
                <select name="user-select" className="user-select">
                    <option value="thomas-candille">Thomas CANDILLE</option>
                    <option value="gabriel-monier"> Gabriel Monier</option>
                    <option value="orianne-pellois"> Orianne Pellois</option>
                    <option value="pierrick-chevron"> Pierrick Chevron</option>
                    <option value="sofy-yuditskaya"> Sofy Yuditskaya</option>
                    <option value="silamakan-toure"> Silamakan Toure</option>
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
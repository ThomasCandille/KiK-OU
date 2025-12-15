import React from "react";
import './Location.css';

export type LocationState = 'bureau' | 'crealab' | 'reunion' | 'teletravail' | 'absent' | 'inconnu';

interface LocationProps {
    locationState?: LocationState;
    user?: boolean;
}

const locationTextMap: { [key in NonNullable<LocationProps['locationState']>]: string } = {
    bureau: "Présent",
    crealab: "CreaLab",
    reunion: "En réunion",
    teletravail: "Télétravail",
    absent: "Absent",
    inconnu: "Inconnu"
};

const Location= ({locationState = "inconnu", user = false}:LocationProps) => {
    return (
        <div className={`location-container ${locationState}`}>
            <span className={`location-text ${locationState}`}>{`${locationTextMap[locationState]} ${user && locationState === 'bureau' ? 'en 202' : ''}`}</span>
        </div>
    );
};

export default Location;
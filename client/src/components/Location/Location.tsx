import React from "react";
import './Location.css';

export type LocationState = 'bureau' | 'crealab' | 'reunion' | 'teletravail' | 'absent' | 'inconnu';

interface LocationProps {
    locationState?: LocationState;
}

const locationTextMap: { [key in NonNullable<LocationProps['locationState']>]: string } = {
    bureau: "Au Bureau",
    crealab: "Au CreaLab",
    reunion: "En réunion",
    teletravail: "En télétravail",
    absent: "En repos",
    inconnu: "Inconnu"
};

const Location = ({locationState = "inconnu"}: LocationProps) => {
    return (
        <div className={`location-container ${locationState}`}>
            <span className={`location-text ${locationState}`}>
                {locationTextMap[locationState]}
            </span>
        </div>
    );
};

export default Location;
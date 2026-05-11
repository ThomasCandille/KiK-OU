import React from "react";
import './Location.css';

export type LocationState = 'bureau' | 'creativ_lab' | 'indisponible' | 'teletravail' | 'absent' | 'inconnu' | 'studio_fond_vert' | 'studio_podcast';

interface LocationProps {
    locationState?: LocationState;
}

const locationTextMap: { [key in NonNullable<LocationProps['locationState']>]: string } = {
    bureau: "Au Bureau",
    creativ_lab: "Au CreaLab",
    indisponible: "Indisponible",
    teletravail: "En télétravail",
    absent: "En repos",
    inconnu: "Inconnu",
    studio_fond_vert: "Studio Fond Vert",
    studio_podcast: "Studio Podcast",
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
import React from "react";
import './Location.css';

export type LocationState = 'bureau' | 'crealab' | 'reunion' | 'teletravail' | 'absent' | 'inconnu';

interface LocationProps {
    locationState?: LocationState;
}

const locationTextMap: { [key in NonNullable<LocationProps['locationState']>]: string } = {
    bureau: "Présent",
    crealab: "CreaLab",
    reunion: "En réunion",
    teletravail: "Télétravail",
    absent: "Absent",
    inconnu: "Inconnu"
};

// const pictoLinkMap: { [key in NonNullable<LocationProps['locationState']>]: string } = {
//     bureau: "/location_bureau.svg",
//     crealab: "/location_crealab.svg",
//     reunion: "/location_reunion.svg",
//     teletravail: "/location_teletravail.svg",
//     absent: "/location_absent.svg",
//     inconnu: "/location_inconnu.svg"
// };

const Location= ({locationState = "inconnu"}:LocationProps) => {
    return (
        <div className="location-container">
            {/* <img src={pictoLinkMap[locationState]} alt="Location Icon" className="location-picto" /> */}
            <span className="location-text">{locationTextMap[locationState]}</span>
        </div>
    );
};

export default Location;
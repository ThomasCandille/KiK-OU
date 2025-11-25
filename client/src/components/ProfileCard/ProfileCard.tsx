import React from 'react';
import './ProfileCard.css';
import { LocationState } from '../Location/Location';
import Location from '../Location/Location';

interface ProfileCardProps {
    imageUrl: string;
    name: string;
    role: string;
    location: LocationState;
    mail:string;
    teams:string;
}

const ProfileCard = ({ imageUrl, name, role, location, mail, teams }: ProfileCardProps) => {
    return (
        <div className="profile-card">
            <img src={imageUrl} alt={`${name}'s profile`} className="profile-image" />
            <div className="profile-details">
                <h2 className="profile-name">{name} - {role}</h2>
                <Location locationState={location} />
                <p className="profile-contact"><img className='profile-picto' src='/mail.svg' alt='logo mail' /><a href={`mailto:${mail}`}>{mail}</a></p>
                <p className="profile-contact"><img className='profile-picto' src='/teams.svg' alt='logo teams' /><a href={teams} target="_blank" rel="noopener noreferrer">Chat</a></p>
            </div>
        </div>
    );
}

export default ProfileCard;
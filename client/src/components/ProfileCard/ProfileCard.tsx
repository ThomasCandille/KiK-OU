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
                    <div className='profile-container'>
                        <h2 className="profile-name">{name}</h2>
                        <p className="profile-role"><img className='profile-picto' src='/profile.svg' alt='logo profile' />{role}</p>
                        <p className="profile-contact"><img className='profile-picto' src='/mail.svg' alt='logo mail' />{mail}</p>
                    </div>
                    <div className="location">
                        <Location locationState={location} />
                    </div>
                </div>
        </div>
    );
}

export default ProfileCard;
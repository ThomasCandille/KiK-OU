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

const ProfileCard = ({ imageUrl, name, role, location, mail }: ProfileCardProps) => {
    return (
        <div className={`profile-card ${location}`}>
            <img src={imageUrl} alt={`${name}'s profile`} className={`profile-image ${location}`} />
                <div className="profile-details">
                    <div className='profile-container'>
                        <h2 className={`profile-name ${location}`}>{name}</h2>
                        <p className={`profile-role ${location}`}><img className={`profile-picto ${location}`} src='/profile.svg' alt='logo profile' />{role}</p>
                        <p className={`profile-contact ${location}`}><img className={`profile-picto ${location}`} src='/mail.svg' alt='logo mail' />{mail}</p>
                    </div>
                    <div className="location">
                        <Location locationState={location} user={name === 'Silamakan TOURE' && true } />
                    </div>
                </div>
        </div>
    );
}

export default ProfileCard;
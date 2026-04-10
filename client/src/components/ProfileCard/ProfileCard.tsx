import React from 'react';
import './ProfileCard.css';
import { LocationState } from '../Location/Location';
import Location from '../Location/Location';

interface ProfileCardProps {
    name: string;
    location: LocationState;
    role?: string;
    onClick?: () => void;
}

const ProfileCard = ({ name, location, role, onClick }: ProfileCardProps) => {
    return (
        <div
            className={`profile-card ${location} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <img src={"/icon.svg"} alt={`${name}'s profile`} className={`profile-image ${location}`}/>
                <div className="profile-details">
                    <div className='profile-container'>
                        <h2 className={`profile-name ${location}`}>{name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
                        {role && <p className={`profile-role ${location}`}>{role}</p>}
                    </div>
                    <div className="location">
                        <Location locationState={location} />
                    </div>
                </div>
        </div>
    );
}

export default ProfileCard;
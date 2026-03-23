import React from 'react';
import './ProfileCard.css';
import { LocationState } from '../Location/Location';
import Location from '../Location/Location';

interface ProfileCardProps {
    name: string;
    location: LocationState;
}

const ProfileCard = ({ name, location }: ProfileCardProps) => {
    return (
        <div className={`profile-card ${location}`}>
            <img src={"/icon.svg"} alt={`${name}'s profile`} className={`profile-image ${location}`}/>
                <div className="profile-details">
                    <div className='profile-container'>
                        <h2 className={`profile-name ${location}`}>{name}</h2>
                    </div>
                    <div className="location">
                        <Location locationState={location} />
                    </div>
                </div>
        </div>
    );
}

export default ProfileCard;
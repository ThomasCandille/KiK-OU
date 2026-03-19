import React, { useMemo, useState } from 'react';
import './ProfileCard.css';
import { LocationState } from '../Location/Location';
import Location from '../Location/Location';

interface ProfileCardProps {
    imageUrl?: string;
    name: string;
    role?: string;
    location?: LocationState;
    mail?: string;
    teams?: string;
}

const ProfileCard = ({ imageUrl, name, location }: ProfileCardProps) => {
    const [hasImageError, setHasImageError] = useState(false);
    const initials = useMemo(() => {
        const splitName = name.split(' ').filter(Boolean);
        if (splitName.length === 0) {
            return '?';
        }

        return splitName
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    }, [name]);

    return (
        <div className={`profile-card ${location}`}>
            {imageUrl && !hasImageError ? (
                <img
                    src={imageUrl}
                    alt={`${name}'s profile`}
                    className={`profile-image ${location}`}
                    onError={() => setHasImageError(true)}
                />
            ) : (
                <div className={`profile-image-fallback ${location}`}>{initials}</div>
            )}
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
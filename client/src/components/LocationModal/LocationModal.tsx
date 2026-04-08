import React from 'react';
import './LocationModal.css';
import { LocationState } from '../Location/Location';

type LocationOption = {
  value: Exclude<LocationState, 'inconnu'>;
  label: string;
};

const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'bureau', label: 'Au bureau' },
  { value: 'crealab', label: 'Au CreaLab' },
  { value: 'reunion', label: 'En reunion' },
  { value: 'teletravail', label: 'En teletravail' },
  { value: 'absent', label: 'Absent' }
];

type LocationModalProps = {
  isOpen: boolean;
  user: string | null;
  currentLocation?: LocationState;
  onClose: () => void;
  onSelectLocation: (location: Exclude<LocationState, 'inconnu'>) => void;
};

const formatUserName = (name: string) =>
  name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const LocationModal = ({ isOpen, user, currentLocation = 'inconnu', onClose, onSelectLocation }: LocationModalProps) => {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={(event) => event.stopPropagation()}>
        <h3>{formatUserName(user)}</h3>
        <p>Selectionner une localisation</p>
        <div className="location-modal-options">
          {LOCATION_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              className={`location-option ${option.value} ${currentLocation === option.value ? 'active' : ''}`}
              onClick={() => onSelectLocation(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

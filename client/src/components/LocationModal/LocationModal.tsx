import React, {useEffect, useRef, useState} from 'react';
import './LocationModal.css';
import { LocationState } from '../Location/Location';

type LocationOption = {
  value: Exclude<LocationState, 'inconnu'>;
  label: string;
};

const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'bureau', label: 'Au bureau' },
  { value: 'teletravail', label: 'En teletravail' },
  { value: 'indisponible', label: 'Indisponible' },
  { value: 'creativ_lab', label: 'Au CreaLab' },
  { value: 'studio_fond_vert', label: 'Studio Fond Vert' },
  { value: 'studio_podcast', label: 'Studio Podcast' },
  { value: 'off', label: 'off' },
  { value: 'deplacement', label: 'En déplacement' },
];

type LocationModalProps = {
  isOpen: boolean;
  user: string | null;
  currentLocation?: LocationState;
  selectedAxe?: string;
  onClose: () => void;
  onSelectLocation: (location: Exclude<LocationState, 'inconnu'>) => void;
};

const formatUserName = (name: string) =>
  name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const LocationModal = ({ isOpen, user, currentLocation = 'inconnu', selectedAxe = '', onClose, onSelectLocation }: LocationModalProps) => {

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const [pinUnlocked, setPinUnlocked] = useState(isMobile);

  const [pinInput, setPinInput] = useState('');
  const unlockTimeoutRef = useRef<number | null>(null);

  const axePinCodes: { [key: string]: string } = {
    'DWI-MCD': '1111',
    'B1Paris': '2222',
    'B1Nantes': '3333'
  };

  const pinCode = selectedAxe && axePinCodes[selectedAxe] ? axePinCodes[selectedAxe] : '6767';

  useEffect(() => {
    return () => {
      if (unlockTimeoutRef.current) {
        window.clearTimeout(unlockTimeoutRef.current);
      }
    };
  }, []);

  const lockPin = () => {
    setPinUnlocked(false);
    setPinInput('');
  };

  const unlockPin = () => {
    setPinUnlocked(true);
    setPinInput('');

    if (unlockTimeoutRef.current) {
      window.clearTimeout(unlockTimeoutRef.current);
    }

    unlockTimeoutRef.current = window.setTimeout(() => {
      lockPin();
    }, 15000);
  };

  const handleDigitClick = (digit: string) => {
    if (pinUnlocked || pinInput.length >= 4) {
      return;
    }

    setPinInput(previous => `${previous}${digit}`);
  };

  const handleClear = () => setPinInput('');

  const handlePinSubmit = () => {
    if (pinInput === pinCode) {
      unlockPin();
      return;
    }

    setPinInput('');
  };

  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={(event) => event.stopPropagation()}>
        {pinUnlocked ? (
          <>
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
          </>
        ) : (
          <>
            <h3>{formatUserName(user)}</h3>
            <p>Entrez le code</p>
            <input
              className="pin-input"
              value={pinInput}
              readOnly
              placeholder="----"
            />
            <div className="pin-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                <button key={digit} type="button" onClick={() => handleDigitClick(String(digit))}>
                  {digit}
                </button>
              ))}
              <button type="button" onClick={handleClear}>Clear</button>
              <button type="button" onClick={() => handleDigitClick('0')}>0</button>
              <button type="button" onClick={handlePinSubmit}>OK</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default LocationModal;

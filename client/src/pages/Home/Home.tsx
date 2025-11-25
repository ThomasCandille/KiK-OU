import React, { useEffect, useState } from 'react';
import './Home.css';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { io } from 'socket.io-client';
import { LocationState } from '../../components/Location/Location';

const socket = io('http://localhost:3001');

function Home() {

  const [userLocationDict, setUserLocationDict] = useState<{ [key: string]: LocationState }>({
    'orianne-pellois': 'bureau',
    'pierrick-chevron': 'bureau',
    'gabriel-monier': 'bureau',
    'sofy-yuditskaya': 'bureau',
    'silamakan-toure': 'bureau',
    'thomas-candille': 'bureau'
  });

  useEffect(() => {
    socket.on('statusUpdated', (data) => {
      console.log('Status response received:', data);
      const user = data.user;
      const location = data.location;

      setUserLocationDict(prev => ({
        ...prev,
        [user]: location
      }));
      console.log('Updated UserLocationDict:', userLocationDict);
    });

    return () => {
      socket.off('statusUpdated');
    };
  }, []);


  return (
    <div className="App">
      <ProfileCard
          key={'orianne-pellois'}
          imageUrl="/empty.svg"
          name="Orianne PELLOIS"
          role="Responsable d'axe"
          location={userLocationDict['orianne-pellois']}
          mail="orianne.pellois@devinci.fr"
          teams="Orianne Pellois"
        />
      <ProfileCard
          key={'pierrick-chevron'}
          imageUrl="/empty.svg"
          name="Pierrick CHEVRON"
          role="Professeur délégué"
          location={userLocationDict['pierrick-chevron']}
          mail="pierrick.chevron@devinci.fr"
          teams="Pierrick Chevron"
        />
      <ProfileCard
          key={'gabriel-monier'}
          imageUrl="/empty.svg"
          name="Gabriel MONIER"
          role="Professeur délégué"
          location={userLocationDict['gabriel-monier']}
          mail="gabriel.monier@devinci.fr"
          teams="Gabriel Monier"
        />
      <ProfileCard
          key={'sofy-yuditskaya'}
          imageUrl="/empty.svg"
          name="Sofy YUDITSKAYA"
          role="Enseignante-chercheuse"
          location={userLocationDict['sofy-yuditskaya']}
          mail="sofy.yuditskaya@devinci.fr"
          teams="Sofy Yuditskaya"
        />
      <ProfileCard
          key={'silamakan-toure'}
          imageUrl="/empty.svg"
          name="Silamakan TOURE"
          role="coordinateur pédagogique"
          location={userLocationDict['silamakan-toure']}
          mail="silamakan.toure@devinci.fr"
          teams="Silamakan Toure"
        />
        <ProfileCard
          key={'thomas-candille'}
          imageUrl="/empty.svg"
          name="Thomas CANDILLE"
          role="Alernant"
          location={userLocationDict['thomas-candille']}
          mail="thomas.candille@devinci.fr"
          teams="Thomas Candille"
        />

    </div>
  );
}

export default Home;


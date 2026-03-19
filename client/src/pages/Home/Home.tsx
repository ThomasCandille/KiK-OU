import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { getAxes } from '../../services/api';

function formatAxeLabel(axe: string): string {
  return axe
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function Home() {
  const [axes, setAxes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAxes = async () => {
      try {
        setLoading(true);
        setError(null);
        const axesPayload = await getAxes();
        setAxes(axesPayload);
      } catch (loadError) {
        setError('Impossible de charger les axes.');
      } finally {
        setLoading(false);
      }
    };

    loadAxes();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">SÉLECTIONNER UN AXE</header>

      {loading && <p className="home-info">Chargement des axes...</p>}
      {error && <p className="home-info">{error}</p>}

      {!loading && !error && (
        <div className="axes-grid">
          {axes.map(axe => (
            <div key={axe} className="axe-card">
              <h2>{formatAxeLabel(axe)}</h2>
              <div className="axe-card-actions">
                <Link to={`/view/${encodeURIComponent(axe)}`} className="axe-link">
                  Voir les membres
                </Link>
                <Link to={`/user/${encodeURIComponent(axe)}`} className="axe-link">
                  Mettre à jour
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Spinner = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Obtenez l'URL actuelle

  useEffect(() => {
    setLoading(true); // Commence le spinner à chaque changement d'URL
    const timer = setTimeout(() => {
      setLoading(false); // Arrête le spinner après 300ms
    }, 400);

    return () => clearTimeout(timer);
  }, [location]); // Réexécute l'effet à chaque changement d'URL

  if (loading) {
    return (
      <div className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Spinner;

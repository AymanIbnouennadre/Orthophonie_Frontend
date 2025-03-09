import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Spinner = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true); // Démarre le spinner lorsque l'URL change
    const timer = setTimeout(() => {
      setIsLoading(false); // Arrête le spinner après un délai de 500ms
    }, 500); // Ajuste ce délai selon tes besoins

    return () => clearTimeout(timer); // Nettoyer le timer lors de la réinitialisation
  }, [location]);

  if (isLoading) {
    return (
      <div className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>; // Affiche les enfants (contenu) après le chargement
};

export default Spinner;

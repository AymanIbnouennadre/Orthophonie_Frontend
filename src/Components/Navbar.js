import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const location = useLocation(); // Obtenez la route actuelle
  const navigate = useNavigate(); // Navigation manuelle

  const handleFunctionalityClick = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    navigate('/functionalities'); // Redirige vers la page "Fonctionnalités"
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0">
      <Link to="/" className="navbar-brand">
        <h1 className="m-0 text-primary">
          <i className="fa fa-book-reader me-3" />
          Barakat
        </h1>
      </Link>
      <button
        type="button"
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav mx-auto">
          {/* Lien Accueil */}
          <Link
            to="/"
            className={`nav-item nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Accueil
          </Link>

          {/* Lien À propos de nous */}
          <Link
            to="/A_propos_de_nous"
            className={`nav-item nav-link ${
              location.pathname === '/A_propos_de_nous' ? 'active' : ''
            }`}
          >
            À propos de nous
          </Link>

          {/* Dropdown Fonctionnalités */}
          <div
            className="nav-item dropdown"
            onClick={(e) => e.stopPropagation()} // Empêche la propagation pour éviter le comportement par défaut du Dropdown
          >
            <a
              href="/functionalities"
              className={`nav-link dropdown-toggle ${
                location.pathname.startsWith('/functionalities') ||
                location.pathname === '/image-to-text' ||
                location.pathname === '/quiz' ||
                location.pathname === '/speech-to-text'
                  ? 'active'
                  : ''
              }`}
              role="button"
              data-bs-toggle="dropdown"
              onClick={handleFunctionalityClick} // Redirige vers "/functionalities"
            >
              Fonctionnalités
            </a>
            <div className="dropdown-menu rounded-0 rounded-bottom border-0 shadow-sm m-0">
              <Link
                to="/image-to-text"
                className={`dropdown-item ${
                  location.pathname === '/image-to-text' ? 'active' : ''
                }`}
              >
                Image to text
              </Link>
              <Link
                to="/quiz"
                className={`dropdown-item ${
                  location.pathname === '/quiz' ? 'active' : ''
                }`}
              >
                Quiz
              </Link>
              <Link
                to="/speech-to-text"
                className={`dropdown-item ${
                  location.pathname === '/speech-to-text' ? 'active' : ''
                }`}
              >
                Speech to text
              </Link>
            </div>
          </div>
        </div>
        <a
          href="#"
          className="btn btn-primary rounded-pill px-3 d-none d-lg-block"
        >
          Join Us
          <i className="fa fa-arrow-right ms-3" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

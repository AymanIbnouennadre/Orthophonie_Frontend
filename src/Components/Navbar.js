import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const currentLocation = useLocation();

  const handleFunctionalityClick = (e) => {
    e.preventDefault();
    navigate('/fonctionnalités');
  };

  // Fermer la navbar quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0" ref={navbarRef}>
      <style>
        {`
          /* Apply Poppins font only to NavLink items */
          .nav-link, .dropdown-item {
            font-family: 'Poppins', sans-serif;
          }

          /* Apply Reem Kufi to Arabic logo */
          .arabic-logo {
            font-family: 'Reem Kufi', sans-serif;
            direction: rtl;
          }
        `}
      </style>
      <div className="container-fluid">
        {/* Logo Barakat en français */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <h1 className="m-0 text-primary">
            <i className="fa fa-book-reader me-2" />
            Barakat
          </h1>
        </NavLink>

        {/* Bouton Hamburger */}
        <button
          type="button"
          className={`navbar-toggler ${isMenuOpen ? '' : 'collapsed'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarCollapse"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Contenu de la Navbar */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarCollapse">
          <div className="navbar-nav mx-auto">
            {/* Lien Accueil */}
            <NavLink
              to="/"
              className="nav-item nav-link"
              activeClassName="active"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </NavLink>

            {/* Lien À propos */}
            <NavLink
              to="/À_propos"
              className="nav-item nav-link"
              activeClassName="active"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </NavLink>

            {/* Dropdown Fonctionnalités */}
            <div
              className={`nav-item dropdown ${isDropdownOpen ? 'show' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* Lien Fonctionnalités */}
              <NavLink
                to="/fonctionnalités"
                className={`nav-link dropdown-toggle ${
                  currentLocation.pathname.startsWith('/fonctionnalités') ? 'active' : ''
                }`}
                role="button"
                data-bs-toggle="dropdown"
                onClick={handleFunctionalityClick}
              >
                Fonctionnalités
              </NavLink>
              <div className={`dropdown-menu rounded-0 rounded-bottom border-0 shadow-sm m-0 ${isDropdownOpen ? 'show' : ''}`}>
                {/* Sous-pages Fonctionnalités */}
                <NavLink
                  to="/fonctionnalités/image-to-text"
                  className="dropdown-item"
                  activeClassName="active"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Image to text
                </NavLink>
                <NavLink
                  to="/fonctionnalités/quiz"
                  className="dropdown-item"
                  activeClassName="active"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quiz
                </NavLink>
                <NavLink
                  to="/fonctionnalités/speech-to-text"
                  className="dropdown-item"
                  activeClassName="active"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Speech to text
                </NavLink>
              </div>
            </div>
          </div>

          {/* Logo بركات en arabe aligné correctement */}
          <NavLink to="/" className="navbar-brand d-flex align-items-center ms-lg-3">
            <h1 className="m-0 text-primary arabic-logo">
            <i className="fa fa-book-reader" />
              <span className="me-2">بركات</span>
              
            </h1>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
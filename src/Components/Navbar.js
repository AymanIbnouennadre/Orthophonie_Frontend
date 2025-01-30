import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navbarRef = useRef(null);

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
      <div className="container-fluid">
        {/* Logo Barakat en français */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <h1 className="m-0 text-primary">
            <i className="fa fa-book-reader me-2" />
            Barakat
          </h1>
        </Link>

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
            <Link to="/" className={`nav-item nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/À_propos" className={`nav-item nav-link ${location.pathname === '/A_propos_de_nous' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
              À propos 
            </Link>

            {/* Dropdown Fonctionnalités */}
            <div
              className={`nav-item dropdown ${isDropdownOpen || location.pathname.startsWith('/functionalities') ? 'show' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a
                href="/functionalities"
                className={`nav-link dropdown-toggle ${location.pathname.startsWith('/fonctionnalités') ||
                  location.pathname === '/image-to-text' ||
                  location.pathname === '/quiz' ||
                  location.pathname === '/speech-to-text'
                  ? 'active'
                  : ''
                }`}
                role="button"
                data-bs-toggle="dropdown"
                onClick={handleFunctionalityClick}
              >
                Fonctionnalités
              </a>
              <div className={`dropdown-menu rounded-0 rounded-bottom border-0 shadow-sm m-0 ${isDropdownOpen ? 'show' : ''}`}>
                <Link to="/image-to-text" className={`dropdown-item ${location.pathname === '/image-to-text' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Image to text
                </Link>
                <Link to="/quiz" className={`dropdown-item ${location.pathname === '/quiz' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Quiz
                </Link>
                <Link to="/speech-to-text" className={`dropdown-item ${location.pathname === '/speech-to-text' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Speech to text
                </Link>
              </div>
            </div>
          </div>

          {/* Logo بركات en arabe aligné correctement */}
          <Link to="/" className="navbar-brand d-flex align-items-center ms-lg-3">
            <h1 className="m-0 text-primary" style={{ fontFamily: "'Reem Kufi', sans-serif", whiteSpace: 'nowrap' }}>
              <span className="me-2">بركات</span>
              <i className="fa fa-book-reader" />
            </h1>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

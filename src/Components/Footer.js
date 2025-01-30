import React from 'react';
import '../assets/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css'
import gallery2 from '../assets/img/gallery2.png';
import gallery1 from '../assets/img/about-11.jpg';
import gallery4 from '../assets/img/gallery4.jpg';
import gallery5 from '../assets/img/gallery5.jpg';
import gallery3 from '../assets/img/gallery3.jpg';
import gallery6 from '../assets/img/gallery6.jpg';

const Footer = () => {
  return (

    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h3 className="text-white mb-4">Contact</h3>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3" />Maroc , Marrakesh</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3" />+212 671554813</p>
            <p className="mb-2"><i className="fa fa-envelope me-3" />Barakatchaima2009@gmail.com</p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href><i className="fab fa-twitter" /></a>
              <a className="btn btn-outline-light btn-social" href><i className="fab fa-facebook-f" /></a>
              <a className="btn btn-outline-light btn-social" href><i className="fab fa-youtube" /></a>
              <a className="btn btn-outline-light btn-social" href><i className="fab fa-linkedin-in" /></a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h3 className="text-white mb-4">Liens</h3>
            <a className="btn btn-link text-white-50" href="/">Accueil </a>
            <a className="btn btn-link text-white-50" href="/À_propos">À propos</a>
            <a className="btn btn-link text-white-50" href="/fonctionnalités">Nos Fonctionnalités</a>

          </div>
          <div className="col-lg-3 col-md-6">
            <h3 className="text-white mb-4">Gallerie</h3>
            <div className="row g-2 pt-2 gallery-container">
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery1} alt="Gallery1" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery2} alt="Gallery2" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery3} alt="Gallery3" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery4} alt="Gallery4" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery5} alt="Gallery5" />
              </div>
              <div className="col-4">
                <img className="img-fluid rounded bg-light p-1" src={gallery6} alt="Gallery6" />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <h3 className="text-white mb-4">Lettre d'information</h3>
            <p className="pe-4">
              Laissez-nous votre email pour en savoir plus sur nos outils interactifs et nos solutions adaptées aux enfants dyslexiques.
            </p>

            <div className="d-flex position-relative mx-auto" style={{ maxWidth: 400 }}>
              <input
                className="form-control bg-transparent w-100 py-3 ps-4 pe-5"
                type="email"
                placeholder="Votre email"
                style={{ border: "1px solid #fff", borderRadius: "10px", color: "#fff" }}
              />
              <button
                type="button"
                className="btn btn-primary py-2 px-3 ms-2"
                style={{ borderRadius: "10px" }}
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-12 text-center">
              © <a className="border-bottom" href="/">Barakat بركات</a>, Tous droits réservés. |
              Développé par : <a className="border-bottom" href="https://aymanibnouennadre.github.io/Portfolio/" target="_blank">Ayman Ibnouennadre</a> |
              Conçu par <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a> 
              
            </div>
            {/*
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <a href>Home</a>
                <a href>Cookies</a>
                <a href>Help</a>
                <a href>FQAs</a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>


  );
};

export default Footer;

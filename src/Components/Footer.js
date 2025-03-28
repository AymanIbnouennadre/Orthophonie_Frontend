import React, { useState, useEffect } from 'react';
import '../assets/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';
import gallery2 from '../assets/img/gallery2.png';
import gallery1 from '../assets/img/about-11.jpg';
import gallery4 from '../assets/img/gallery4.webp';
import gallery5 from '../assets/img/gallery5.webp';
import gallery3 from '../assets/img/gallery3.jpg';
import gallery6 from '../assets/img/gallery6.webp';

const Footer = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

  useEffect(() => {
    // Créer un tableau de promesses pour charger toutes les images
    const promises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = resolve; // Si l'image se charge bien
        img.onerror = reject; // Si l'image échoue à se charger
      });
    });

    // Attendre que toutes les images soient chargées
    Promise.all(promises)
      .then(() => {
        setImagesLoaded(true); // Lorsque toutes les images sont chargées
      })
      .catch(() => {
        console.log('Erreur de chargement des images');
      });
  }, []);

  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <style>
        {`
          /* Apply Poppins font only to the content (not titles) */
          .footer-content {
            font-family: 'Poppins', sans-serif;
          }

          /* Apply Reem Kufi to Arabic text */
          .arabic-text {
            font-family: 'Reem Kufi', sans-serif;
            direction: rtl;
          }
        `}
      </style>
      {/* Cette section ne sera visible que lorsque toutes les images sont chargées */}
      {imagesLoaded ? (
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Contact</h3>
              <div className="footer-content">
                <p className="mb-2">
                  <i className="fa fa-map-marker-alt me-3" />Maroc, Marrakesh
                </p>
                <p className="mb-2">
                  <i className="fa fa-phone-alt me-3" />+212 671554813
                </p>
                <p className="mb-2">
                  <i className="fa fa-envelope me-1" />Barakatchaima2009@gmail.com
                </p>
                <div className="d-flex pt-2">
                  <a className="btn btn-outline-light btn-social" href>
                    <i className="fab fa-twitter" />
                  </a>
                  <a className="btn btn-outline-light btn-social" href>
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a className="btn btn-outline-light btn-social" href>
                    <i className="fab fa-youtube" />
                  </a>
                  <a className="btn btn-outline-light btn-social" href>
                    <i className="fab fa-linkedin-in" />
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Liens</h3>
              <div className="footer-content">
                <a className="btn btn-link text-white-50" href="/">
                  Accueil
                </a>
                <a className="btn btn-link text-white-50" href="/À_propos">
                  À propos
                </a>
                <a className="btn btn-link text-white-50" href="/fonctionnalités">
                  Nos Fonctionnalités
                </a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Galerie</h3>
              <div className="footer-content">
                <div className="row g-2 pt-2 gallery-container">
                  {images.map((image, index) => (
                    <div key={index} className="col-4">
                      <img
                        className="img-fluid rounded bg-light p-1"
                        src={image}
                        alt={`Gallery${index + 1}`}
                        style={{ opacity: imagesLoaded ? 1 : 0.3 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Lettre d'information</h3>
              <div className="footer-content">
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
        </div>
      ) : (
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-12 text-center">
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-12 text-center footer-content">
              ©{" "}
              <a className="border-bottom" href="/">
                Barakat <span className="arabic-text">بركات</span>
              </a>
              , Tous droits réservés. | Développé par{" "}
              <a className="border-bottom" href="https://aymanibnouennadre.github.io/Portfolio/" target="_blank">
                Ayman Ibnouennadre
              </a>{" "}
              {/* obligatoire après deploiement (copyright) 
              | Conçu par{" "}
              <a className="border-bottom" href="https://htmlcodex.com" target="_blank">
                HTML Codex
              </a>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
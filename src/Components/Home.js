import React, { useEffect, useState } from 'react';
import '../assets/css/bootstrap.min.css';
import '../assets/css/style.css';
import '../assets/js/main.js';
import '../assets/lib/animate/animate.min.css';
import '../assets/lib/animate/animate.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import carousel1 from '../assets/img/Background.webp'; // votre image de fond
import Started from '../assets/img/appointment.jpg';
import user from '../assets/img/user.jpg';
import about1 from '../assets/img/about-1.jpg';
import about2 from '../assets/img/About1.jpg';
import about3 from '../assets/img/About3.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
   
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Affiche ou cache le bouton "Back to Top" selon la position de défilement
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowBackToTop(true); // Affiche le bouton si l'utilisateur est en dehors de la section "Accueil"
      } else {
        setShowBackToTop(false); // Cache le bouton si l'utilisateur est dans la section "Accueil"
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Nettoyage de l'événement
    };
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = carousel1;
    img.onload = () => {
      setImageLoaded(true); // Marque l'image comme chargée
    };
  }, []);

  if (!imageLoaded) {
    return (
      <div className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-white p-0">
      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <div className="owl-carousel header-carousel position-relative">
          <div className="owl-carousel-item position-relative">
            <img
              className="img-fluid"
              src={carousel1}
              alt="Carousel"
              style={{
                width: '100%',
                height: '100vh', // Full viewport height
                objectFit: 'cover', // Ensure the image covers the whole area without stretching
                objectPosition: 'center', // Keep the image centered
                display: 'block',
                position: 'relative',
                zIndex: 0, // Prevent the image from overlapping other elements
              }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
              style={{ background: 'rgba(0, 0, 0, .2)' }}
            >
              <div className="container">
                <div
                  className="row justify-content-start"
                  style={{ marginTop: '-180px', marginLeft: '-30px' }}
                >
                  <div className="col-10 col-lg-8">
                    <h1 className="display-2 text-white animated slideInDown mb-4">
                      Redonner confiance à chaque enfant, un mot à la fois.
                    </h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">
                      Une plateforme conçue pour transformer les défis en réussites, et permettre à chaque enfant de grandir avec confiance et autonomie.
                    </p>
                    <a
                      href="/fonctionnalités"
                      className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3 animated slideInLeft"
                    >
                      Commencer
                    </a>
                    <a
                      href="/À_propos"
                      className="btn btn-dark rounded-pill py-sm-3 px-sm-5 animated slideInRight"
                    >
                      Savoir plus
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carousel End */}

      {/* Facilities Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 600 }}>
            <h1 className="mb-3">Nos Fonctionnalités</h1>
            <p>Découvrez nos outils interactifs conçus pour vous aider à apprendre, interagir et améliorer vos compétences. Chaque outil est intuitif et adapté à vos besoins.</p>
          </div>
          <div className="row g-4">
            {/* Image to Text */}
            <div className="col-lg-4 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="facility-item">
                <div className="facility-icon bg-primary">
                  <span className="bg-primary"></span>
                  <i className="fa fa-camera fa-3x text-primary"></i>
                  <span className="bg-primary"></span>
                </div>
                <div className="facility-text bg-primary">
                  <h3 className="text-primary mb-3">GraphoScan</h3>
                  <p className="mb-0">Convertissez vos images en texte avec précision grâce à notre outil OCR avancé.</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <a href="/image-to-text" className="btn btn-primary btn-sm rounded-pill px-4">Explorer</a>
              </div>
            </div>
            {/* Quiz */}
            <div className="col-lg-4 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="facility-item">
                <div className="facility-icon bg-success">
                  <span className="bg-success"></span>
                  <i className="fa fa-question-circle fa-3x text-success"></i>
                  <span className="bg-success"></span>
                </div>
                <div className="facility-text bg-success">
                  <h3 className="text-success mb-3">PhonoSens</h3>
                  <p className="mb-0">Testez vos connaissances grâce à des quiz éducatifs et amusants.</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <a href="/quiz" className="btn btn-success btn-sm rounded-pill px-4">Participer</a>
              </div>
            </div>
            {/* Speech to Text */}
            <div className="col-lg-4 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="facility-item">
                <div className="facility-icon bg-info">
                  <span className="bg-info"></span>
                  <i className="fa fa-microphone fa-3x text-info"></i>
                  <span className="bg-info"></span>
                </div>
                <div className="facility-text bg-info">
                  <h3 className="text-info mb-3">PhonoTrack</h3>
                  <p className="mb-0">Améliorez votre prononciation avec notre outil de reconnaissance vocale.</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <a href="/speech-to-text" className="btn btn-info btn-sm rounded-pill px-4">Découvrir</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Facilities End */}

      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h1 className="mb-4">Barakat : La première application marocaine dédiée aux enfants dyslexiques</h1>
              <p>Cette application web, première du genre au Maroc, est spécialement conçue pour accompagner les enfants dyslexiques et bilingues dans leur apprentissage. Grâce à des outils interactifs et des exercices adaptés, elle aide à renforcer la lecture, l’écriture et la confiance en soi. Développée avec une approche pédagogique moderne, elle offre une expérience d’apprentissage engageante et accessible, répondant aux besoins spécifiques de chaque enfant. Notre mission est de rendre l’apprentissage plus inclusif, motivant et adapté aux défis des jeunes apprenants d’aujourd’hui.</p>
              <div className="row g-4 align-items-center">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <h6 className="text-primary mb-1">Chaima Barakat</h6>
                      <small>Orthophoniste</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 about-img wow fadeInUp" data-wow-delay="0.5s">
              <div className="row">
                <div className="col-12 text-center">
                  <img className="img-fluid w-75 rounded-circle bg-light p-3" src={about1} alt />
                </div>
                <div className="col-6 text-start" style={{ marginTop: '-150px' }}>
                  <img className="img-fluid w-100 rounded-circle bg-light p-3" src={about2} alt />
                </div>
                <div className="col-6 text-end" style={{ marginTop: '-150px' }}>
                  <img className="img-fluid w-100 rounded-circle bg-light p-3" src={about3} alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Call To Action Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-light rounded">
            <div className="row g-0">
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s" style={{ minHeight: 400 }}>
                <div className="position-relative h-100">
                  <img className="position-absolute w-100 h-100 rounded" src={Started} style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="h-100 d-flex flex-column justify-content-center p-5">
                  <h1 className="mb-4">Apprenez, inspirez et accompagnez les enfants vers la réussite !</h1>
                  <p className="mb-4">Devenez un acteur clé dans le développement des enfants dyslexiques. Découvrez des outils et des exercices spécialement conçus pour améliorer leurs compétences en lecture, en écriture et en compréhension, tout en favorisant leur épanouissement. Ensemble, construisons un avenir meilleur pour chaque enfant.
                  </p>
                  <a className="btn btn-primary py-3 px-5" href="/fonctionnalités">Profiter Maintenant ! <i className="fa fa-arrow-right ms-2" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call To Action End */}

      {/* Back to Top */}
      {showBackToTop && (
        <a
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn btn-lg btn-primary btn-lg-square back-to-top"
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
        >
          <i className="bi bi-arrow-up" />
        </a>
      )}

    </div>
  );
};

export default Home;

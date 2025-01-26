import React, { useEffect, useState } from 'react';
import '../assets/css/bootstrap.min.css';
import '../assets/css/style.css';
import '../assets/js/main.js';
import '../assets/lib/animate/animate.min.css';
import '../assets/lib/animate/animate.css';
//import '../assets/scss/bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import carousel1 from '../assets/img/Background.jpg';
import Spinner from './Spinner';
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

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

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

  if (loading) {
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
                height: '100vh', // S'étendre à la hauteur de la fenêtre
                objectFit: 'cover', // Ajustement propre pour éviter le zoom excessif
              }}
            />
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
              style={{ background: 'rgba(0, 0, 0, .2)' }}
            >
              <div className="container">
                <div
                  className="row justify-content-start"
                  style={{ marginTop: '-180px', marginLeft: '-50px' }}
                >
                  <div className="col-10 col-lg-8">
                    <h1 className="display-2 text-white animated slideInDown mb-4">
                    Redonner confiance à chaque enfant, un mot à la fois
                    </h1>
                    <p className="fs-5 fw-medium text-white mb-4 pb-2">
                      Vero elitr justo clita lorem. Ipsum dolor at sed stet sit diam no.
                      Kasd rebum ipsum et diam justo clita et kasd rebum sea elitr.
                    </p>
                    <a
                      href="/functionalities"
                      className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3 animated slideInLeft"
                    >
                      Commencer
                    </a>
                    <a
                      href="/A_propos_de_nous"
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
            <h3 className="text-primary mb-3">Image to Text</h3>
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
            <h3 className="text-success mb-3">Quiz</h3>
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
            <h3 className="text-info mb-3">Speech to Text</h3>
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
              <h1 className="mb-4">Learn More About Our Work And Our Cultural Activities</h1>
              <p>Je m'appelle Chaimae Barakat, orthophoniste passionnée par l'innovation et dotée d'un esprit créatif qui me pousse à repousser les limites des méthodes traditionnelles. Forte de plusieurs années d'expérience dans la prise en charge des troubles d'apprentissage, j'ai constaté le besoin urgent d'outils éducatifs modernes et adaptés pour les enfants dyslexiques et bilingues au Maroc. </p>
              <p className="mb-4">C'est ainsi que j'ai imaginé et développé cette application, la première du genre dans notre pays, conçue pour répondre spécifiquement aux besoins des enfants arabophones et francophones. Mon ambition est de transformer chaque défi en opportunité et de permettre à chaque enfant d'apprendre autrement, avec confiance et épanouissement.</p>
              <div className="row g-4 align-items-center">
                {/*<div className="col-sm-6">
                  <a className="btn btn-primary rounded-pill py-3 px-5" href>Read More</a>
                </div>*/}
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <img className="rounded-circle flex-shrink-0" src={user} alt style={{ width: 45, height: 45 }} />
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
                  <h1 className="mb-4">Become A Teacher</h1>
                  <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
                    Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                  </p>
                  <a className="btn btn-primary py-3 px-5" href="/functionalities">Profiter Maintenant ! <i className="fa fa-arrow-right ms-2" /></a>
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
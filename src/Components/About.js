import React from 'react';
import user from '../assets/img/user.jpg';
import about1 from '../assets/img/about-1.jpg';
import about2 from '../assets/img/About1.jpg';
import about3 from '../assets/img/About3.jpg';
import Started from '../assets/img/appointment.jpg';

const About = () => {
  return (
    <div className="container-fluid bg-white p-0">
      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h1 className="mb-4">Learn More About Our Work And Our Cultural Activities</h1>
              <p>
                Je m'appelle Chaimae Barakat, orthophoniste passionnée par l'innovation et dotée d'un esprit créatif qui me pousse à repousser les limites des méthodes traditionnelles. Forte de plusieurs années d'expérience dans la prise en charge des troubles d'apprentissage, j'ai constaté le besoin urgent d'outils éducatifs modernes et adaptés pour les enfants dyslexiques et bilingues au Maroc.
              </p>
              <p className="mb-4">
                C'est ainsi que j'ai imaginé et développé cette application, la première du genre dans notre pays, conçue pour répondre spécifiquement aux besoins des enfants arabophones et francophones. Mon ambition est de transformer chaque défi en opportunité et de permettre à chaque enfant d'apprendre autrement, avec confiance et épanouissement.
              </p>
              <div className="row g-4 align-items-center">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <img className="rounded-circle flex-shrink-0" src={user} alt="User" style={{ width: 45, height: 45 }} />
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
                  <img className="img-fluid w-75 rounded-circle bg-light p-3" src={about1} alt="About Us 1" />
                </div>
                <div className="col-6 text-start" style={{ marginTop: '-150px' }}>
                  <img className="img-fluid w-100 rounded-circle bg-light p-3" src={about2} alt="About Us 2" />
                </div>
                <div className="col-6 text-end" style={{ marginTop: '-150px' }}>
                  <img className="img-fluid w-100 rounded-circle bg-light p-3" src={about3} alt="About Us 3" />
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
                  <img
                    className="position-absolute w-100 h-100 rounded"
                    src={Started}
                    alt="Call to Action"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="h-100 d-flex flex-column justify-content-center p-5">
                  <h1 className="mb-4">Become A Teacher</h1>
                  <p className="mb-4">
                    Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
                    Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo juste magna dolore erat amet.
                  </p>
                  <a className="btn btn-primary py-3 px-5" href="/functionalities">
                    Profiter Maintenant ! <i className="fa fa-arrow-right ms-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call To Action End */}
    </div>
  );
};

export default About;

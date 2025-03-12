import React from 'react';

const Fonctionnalites = () => {
    return (
        <div style={{ backgroundColor: '#ffffff', width: '100%', padding: '50px 0' }}>
            <div className="container">
                <div
                    className="text-center mx-auto mb-5 wow fadeInUp"
                    data-wow-delay="0.1s"
                    style={{ maxWidth: 600 }}
                >
                    <h1 className="mb-3">Nos Fonctionnalités</h1>
                    <p>
                        Découvrez nos outils interactifs conçus pour vous aider à apprendre,
                        interagir et améliorer vos compétences. Chaque outil est intuitif
                        et adapté à vos besoins.
                    </p>
                </div>
                <div className="row g-4">
                    {/* Image to Text */}
                    <div
                        className="col-lg-4 col-sm-6 wow fadeInUp"
                        data-wow-delay="0.3s"
                    >
                        <div className="facility-item">
                            <div className="facility-icon bg-primary">
                                <span className="bg-primary"></span>
                                <i className="fa fa-camera fa-3x text-primary"></i>
                                <span className="bg-primary"></span>
                            </div>
                            <div className="facility-text bg-primary">
                                <h3 className="text-primary mb-3">GraphoScan</h3>
                                <p className="mb-0">
                                    Convertissez vos images en texte avec précision grâce à notre
                                    outil OCR avancé.
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <a
                                href="/fonctionnalités/image-to-text"
                                className="btn btn-primary btn-sm rounded-pill px-4"
                            >
                                Explorer
                            </a>
                        </div>
                    </div>

                    {/* Quiz */}
                    <div
                        className="col-lg-4 col-sm-6 wow fadeInUp"
                        data-wow-delay="0.5s"
                    >
                        <div className="facility-item">
                            <div className="facility-icon bg-success">
                                <span className="bg-success"></span>
                                <i className="fa fa-question-circle fa-3x text-success"></i>
                                <span className="bg-success"></span>
                            </div>
                            <div className="facility-text bg-success">
                                <h3 className="text-success mb-3">PhonoSens</h3>
                                <p className="mb-0">
                                    Testez vos connaissances grâce à des quiz éducatifs et
                                    amusants.
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <a
                                href="/fonctionnalités/quiz"
                                className="btn btn-success btn-sm rounded-pill px-4"
                            >
                                Participer
                            </a>
                        </div>
                    </div>

                    {/* Speech to Text */}
                    <div
                        className="col-lg-4 col-sm-6 wow fadeInUp"
                        data-wow-delay="0.7s"
                    >
                        <div className="facility-item">
                            <div className="facility-icon bg-info">
                                <span className="bg-info"></span>
                                <i className="fa fa-microphone fa-3x text-info"></i>
                                <span className="bg-info"></span>
                            </div>
                            <div className="facility-text bg-info">
                                <h3 className="text-info mb-3">PhonoTrack</h3>
                                <p className="mb-0">
                                    Améliorez votre prononciation avec notre outil de reconnaissance vocale.
                                </p>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <a
                                href="/fonctionnalités/speech-to-text"
                                className="btn btn-info btn-sm rounded-pill px-4"
                            >
                                Découvrir
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fonctionnalites;

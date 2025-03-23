import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";
import "../App.css";

const loadGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Tajawal:wght@400;500;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
loadGoogleFonts();

Modal.setAppElement("#root");

const Fonctionnalites = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [language, setLanguage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const webcamRef = useRef(null);
  const audioRef = useRef(null);

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  };

  const videoConstraints = {
    facingMode: isMobileDevice() ? { exact: "environment" } : "user",
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageCaptured(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setSelectedFile(null);
    setExtractedText("");
    setImageCaptured(null);
    setAudioSrc(null);
    setIsConverted(false);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    window.history.pushState({}, "", "/fonctionnalités/image-to-text");
  };

  const handleStartClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const apiUrl =
          language === "FR"
            ? "http://127.0.0.1:8000/convert-image-to-textFR/"
            : "http://127.0.0.1:8000/convert-image-to-textAR/";

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const normalizedText = data.extracted_text
          ? data.extracted_text.replace(/\n+/g, " ").trim()
          : "Erreur : Réponse vide";
        setExtractedText(normalizedText);
        setIsConverted(true);
      } catch (error) {
        console.error("Erreur de requête :", error);
        setExtractedText("Une erreur est survenue.");
        setIsConverted(true);
      }
    } else {
      setExtractedText("Veuillez sélectionner un fichier.");
      setIsConverted(true);
    }
  };

  const handleTextToSpeech = async () => {
    if (!extractedText) return;

    setIsAudioLoading(true);
    try {
      console.log("Sending text to synthesize:", extractedText);
      const apiUrl =
        language === "FR"
          ? "http://127.0.0.1:8000/convert-text-to-speechFR/"
          : "http://127.0.0.1:8000/convert-text-to-speechAR/";

      const response = await fetch(
        `${apiUrl}?text=${encodeURIComponent(extractedText)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      if (audioBlob.size === 0) throw new Error("Audio blob is empty");
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        const playAudio = () => {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.warn("Lecture automatique bloquée, interaction requise :", error);
                setIsPlaying(false);
              });
          }
        };

        audioRef.current.addEventListener("canplay", playAudio, { once: true });
      }
    } catch (error) {
      console.error("Text-to-speech error details:", error);
      setExtractedText(`Erreur lors de la synthèse vocale : ${error.message}`);
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const handleTimeUpdate = () => {
      const words = extractedText.split(/\s+/);
      const duration = audio.duration;
      const currentTime = audio.currentTime;
      const wordDuration = duration / words.length;
      const adjustedTime = currentTime * 1.04;
      const newWordIndex = Math.floor(adjustedTime / wordDuration);
      setCurrentWordIndex(newWordIndex < words.length ? newWordIndex : -1);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      if (audioSrc) URL.revokeObjectURL(audioSrc);
    };
  }, [audioSrc, extractedText]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn("Erreur lors de la reprise de la lecture :", error);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.warn("Erreur lors de la relecture :", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const openCameraModal = () => {
    setModalIsOpen(true);
  };

  const clauseCameraModal = () => {
    setModalIsOpen(false);
  };

  const handleCaptureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageCaptured(imageSrc);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured-image.png", {
            type: "image/png",
          });
          setSelectedFile(file);
        });
      setModalIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImageCaptured(null);
    setExtractedText("");
    setAudioSrc(null);
    setIsConverted(false);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
  };

  const renderHighlightedText = () => {
    if (!extractedText) return "...";
    const words = extractedText.split(/\s+/);
    return words.map((word, index) => (
      <span
        key={index}
        style={{
          backgroundColor: index === currentWordIndex ? "#ffff99" : "transparent",
          padding: "0 2px",
          margin: "0 1px",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {word}{" "}
      </span>
    ));
  };

  return (
    <div>
      <style>
        {`
          /* Apply Poppins font to French text and Tajawal to Arabic text after language selection */
          .image-to-text-content {
            font-family: 'Poppins', sans-serif; /* Default to Poppins for French */
          }

          .image-to-text-content.arabic {
            font-family: 'Tajawal', sans-serif; /* Tajawal for Arabic */
            direction: rtl;
          }

          /* Specific styles for buttons and text */
          .image-to-text-content .btn {
            font-family: inherit; /* Inherit the font from the parent */
          }

          .image-to-text-content h4, 
          .image-to-text-content h5, 
          .image-to-text-content p {
            font-family: inherit; /* Inherit the font from the parent */
          }

          /* Modal styles */
          .modal-content {
            font-family: 'Poppins', sans-serif; /* Default to Poppins for French */
          }

          .modal-content.arabic {
            font-family: 'Tajawal', sans-serif; /* Tajawal for Arabic */
            direction: rtl;
          }

          .modal-content h2, 
          .modal-content button {
            font-family: inherit; /* Inherit the font from the parent */
          }

          /* Media queries remain unchanged */
          @media (max-width: 768px) {
            .text-muted {
              font-size: 1.2rem !important;
            }
            .border.p-3.p-md-4 {
              padding: 1rem !important;
            }
            .text-extracted-container p {
              font-size: ${language === "AR" ? "1.6rem" : "1.4rem"} !important; /* Augmenté pour l'arabe */
            }
            .text-extracted-container {
              max-height: 70vh !important;
            }
          }

          @media (max-width: 576px) {
            .text-muted {
              font-size: 1.1rem !important;
            }
            .border.p-3.p-md-4 {
              padding: 0.5rem !important;
            }
            .text-extracted-container p {
              font-size: ${language === "AR" ? "1.5rem" : "1.3rem"} !important; /* Augmenté pour l'arabe */
            }
            .text-extracted-container {
              max-height: 65vh !important;
            }
          }
        `}
      </style>
      <div
        className="container-fluid d-flex align-items-center justify-content-center image-to-text-container"
        style={{ minHeight: "90vh", width: "100%", backgroundColor: "#f5f7fa" }}
      >
        <div
          className="container shadow-lg p-3 p-md-5"
          style={{
            maxWidth: "85%",
            width: "100%",
            height: "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          {language ? (
            <div className={`image-to-text-content ${language === "AR" ? "arabic" : ""}`}>
              <div className="text-center mb-3 mb-md-4">
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleBackToLanguageChoice}
                  style={{ fontSize: "1.3rem", padding: "10px 30px" }}
                >
                  {language === "FR" ? (
                    <>
                      <i className="bi bi-arrow-left"></i> choix de langues
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-left"></i> العودة لاختيار اللغة
                    </>
                  )}
                </button>
                {isConverted && (
                  <div className="d-flex justify-content-center flex-nowrap mt-3" style={{ gap: "10px" }}>
                    {language === "FR" && (
                      <button
                        className="btn btn-success"
                        onClick={handleTextToSpeech}
                        disabled={isAudioLoading || !!audioSrc}
                        title="Lire le texte"
                        style={{
                          fontSize: "1.2rem",
                          padding: "10px 15px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAudioLoading ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-volume-up"></i>}
                      </button>
                    )}
                    {language === "AR" && (
                      <button
                        className="btn btn-success"
                        onClick={handleTextToSpeech}
                        disabled={isAudioLoading || !!audioSrc}
                        title="استمع إلى النص"
                        style={{
                          fontSize: "1.2rem",
                          padding: "10px 15px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isAudioLoading ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-volume-up"></i>}
                      </button>
                    )}
                    {audioSrc && (
                      <>
                        <button
                          className="btn"
                          onClick={handlePlayPause}
                          title={language === "FR" ? "Pause/Reprendre" : "إيقاف/استئناف"}
                          style={{
                            fontSize: "1.2rem",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            backgroundColor: "#6f42c1",
                            color: "#ffffff",
                            border: "none",
                          }}
                        >
                          {isPlaying ? <i className="bi bi-pause"></i> : <i className="bi bi-play"></i>}
                        </button>
                        <button
                          className="btn btn-info"
                          onClick={handleReplay}
                          title={language === "FR" ? "Relire" : "إعادة التشغيل"}
                          style={{
                            fontSize: "1.2rem",
                            padding: "10px 15px",
                            whiteSpace: "nowrap",
                            color: "#ffffff",
                          }}
                        >
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={handleClear}
                      title={language === "FR" ? "Effacer" : "مسح"}
                      style={{
                        fontSize: "1.2rem",
                        padding: "10px 15px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}
              </div>

              {!imageCaptured && !isConverted && (
                <div
                  className="text-center border-dashed p-3 p-md-5"
                  style={{
                    border: "2px dashed #ced4da",
                    borderRadius: "10px",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <h4>
                    {language === "FR"
                      ? "Déposer, télécharger ou coller une image"
                      : "اسحب، قم بالتحميل أو ألصق صورة"}
                  </h4>
                  <p className="text-muted">
                    {language === "FR"
                      ? "Formats pris en charge : JPG, PNG, GIF, JFIF (JPEG), HEIC, PDF"
                      : "الصيغ المدعومة: JPG, PNG, GIF, JFIF (JPEG), HEIC, PDF"}
                  </p>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <label
                      htmlFor="fileUpload"
                      className="btn btn-outline-primary"
                      style={{ padding: "8px 20px" }}
                    >
                      <i className="bi bi-upload"></i>{" "}
                      {language === "FR" ? "Parcourir" : "استعرض"}
                    </label>
                    <input
                      type="file"
                      id="fileUpload"
                      className="d-none"
                      onChange={handleFileChange}
                      accept="image/*, application/pdf"
                    />
                  </div>
                  <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
                    {language === "FR"
                      ? "*Votre vie privée est protégée ! Aucune donnée n'est transmise ou stockée."
                      : "*حماية خصوصيتك! لا يتم نقل أو تخزين أي بيانات."}
                  </p>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={openCameraModal}
                    >
                      📷 {language === "FR" ? "Utiliser la caméra" : "استخدم الكاميرا"}
                    </button>
                  </div>
                </div>
              )}

              {imageCaptured && !isConverted && (
                <div className="text-center">
                  <img
                    src={imageCaptured}
                    alt="Aperçu"
                    className="img-fluid rounded shadow mb-3"
                    style={{
                      width: "600px",
                      height: "400px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <p className="text-muted mb-3">{selectedFile?.name}</p>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleStartClick}
                      style={{ fontSize: "1rem", padding: "8px 20px" }}
                    >
                      {language === "FR" ? "Convertir" : "تحويل"}
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        setSelectedFile(null);
                        setImageCaptured(null);
                      }}
                      style={{ fontSize: "1rem", padding: "8px 20px" }}
                    >
                      <i className="bi bi-x-circle"></i>{" "}
                      {language === "FR" ? "Annuler" : "إلغاء"}
                    </button>
                  </div>
                </div>
              )}

              {isConverted && (
                <div className="col-12 text-extracted-container">
                  <div
                    className="border p-3 p-md-4 rounded bg-light text-center"
                    style={{
                      minHeight: "200px",
                      maxHeight: "60vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                      background: "#ffeeee",
                      marginTop: "20px",
                      display: "block",
                      width: "100%",
                    }}
                  >
                    <h5 className="fw-bold">
                      {language === "FR" ? "Texte extrait :" : "النص المستخرج :"}
                    </h5>
                    <p
                      className="text-muted"
                      style={{
                        fontSize: language === "AR" ? "clamp(1.35rem, 2.75vw, 1.8rem)" : "clamp(1.2rem, 2.5vw, 1.6rem)",
                        fontFamily: language === "AR" ? "'Tajawal', sans-serif" : "'Poppins', sans-serif",
                        direction: language === "AR" ? "rtl" : "ltr",
                        lineHeight: "2",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                        textAlign: "center",
                        margin: "0",
                        padding: "0 10px",
                      }}
                    >
                      {renderHighlightedText()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center language-selection">
              <h1
                className="mb-4"
                style={{
                  color: "#FF6B6B",
                  fontWeight: "700",
                  textShadow: "2px 2px 5px rgba(255, 100, 100, 0.5)",
                }}
              >
                <i className="bi bi-image-fill me-2"></i>
                Reconnaissance d’Images |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif !important" }}>
                  التعرف على الصور
                </span>
              </h1>
              <h5 className="mb-4 text-muted">
                Déposer, Télécharger ou Coller l’image |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif !important" }}>
                  اسحب، قم بالتحميل أو ألصق صورة
                </span>
              </h5>
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <button
                  className="btn btn-lg btn-outline-primary btn-custom"
                  onClick={() => handleLanguageSelect("FR")}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    width: "200px",
                    boxSizing: "border-box",
                    fontSize: "1.3rem",
                    padding: "12px 25px",
                    border: "3px solid #0055A4",
                    borderRadius: "30px",
                    fontWeight: "bold",
                  }}
                >
                  Français
                </button>
                <button
                  className="btn btn-lg btn-outline-success btn-custom"
                  onClick={() => handleLanguageSelect("AR")}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    width: "200px",
                    boxSizing: "border-box",
                    fontSize: "1.3rem",
                    padding: "12px 25px",
                    border: "3px solid #007A3D",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontFamily: "'Tajawal', sans-serif !important",
                  }}
                >
                  العربية
                </button>
              </div>
            </div>
          )}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={clauseCameraModal}
          style={{
            content: {
              width: "100vw",
              maxWidth: "700px",
              height: "80vh",
              margin: "auto",
              top: "10vh",
              borderRadius: "20px",
              textAlign: "center",
              backgroundColor: "white",
              color: "black",
              boxShadow: "0px 0px 20px 5px rgba(255, 165, 0, 0.8)",
              border: "3px solid black",
              padding: "10px",
              overflow: "hidden",
            },
          }}
        >
          <h2 className="mb-3 text-dark">
            📷 {language === "FR" ? "Capturez votre image" : "التقط صورتك"}
          </h2>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            className="img-fluid rounded shadow"
            style={{ width: "100%", height: "80%", borderRadius: "10px" }}
            videoConstraints={videoConstraints}
          />
          <button className="btn btn-success mt-3 me-2" onClick={handleCaptureImage}>
            📸 {language === "FR" ? "Prendre une photo" : "التقط صورة"}
          </button>
          <button className="btn btn-danger mt-3 me-2" onClick={clauseCameraModal}>
            {language === "FR" ? "Annuler" : "إلغاء"}
          </button>
        </Modal>
        <audio
          ref={audioRef}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
          }}
        />
      </div>
    </div>
  );
};

export default Fonctionnalites;
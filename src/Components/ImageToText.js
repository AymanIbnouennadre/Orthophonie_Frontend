import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";
import "../assets/css/bootstrap.min.css";
import "../assets/css/style.css";
import "../assets/lib/animate/animate.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    window.history.pushState(
      {},
      "",
      `/fonctionnalités/image-to-text/langue=${lang.toLowerCase()}`
    );
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setSelectedFile(null);
    setExtractedText("");
    setImageCaptured(null);
    setAudioSrc(null);
    setIsConverted(false);
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
        setExtractedText(data.extracted_text || "Erreur : Réponse vide");
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
      console.log("Audio generated successfully");
    } catch (error) {
      console.error("Text-to-speech error details:", error);
      setExtractedText(`Erreur lors de la synthèse vocale : ${error.message}`);
    } finally {
      setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play();
    }
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

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
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center image-to-text-container"
      style={{ minHeight: "90vh", width: "100%", backgroundColor: "#f5f7fa" }}
    >
      <div
        className="container shadow-lg p-5"
        style={{
          maxWidth: "85%",
          width: "100%",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          overflow: "hidden", // Pour gérer le débordement global
        }}
      >
        {language ? (
          <>
            <div className="text-center mb-4">
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
            </div>

            {!imageCaptured && !isConverted && (
              <div
                className="text-center border-dashed p-5"
                style={{
                  border: "2px dashed #ced4da",
                  borderRadius: "10px",
                  minHeight: "300px",
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
                <div>
                  <label
                    htmlFor="fileUpload"
                    className="btn btn-outline-primary me-3"
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
                <button
                  className="btn btn-outline-secondary mt-3"
                  onClick={openCameraModal}
                >
                  📷 {language === "FR" ? "Utiliser la caméra" : "استخدم الكاميرا"}
                </button>
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
                    className="btn btn-warning"
                    onClick={() => {
                      setSelectedFile(null);
                      setImageCaptured(null);
                    }}
                    style={{ fontSize: "1rem", padding: "8px 20px" }} // Réduit la taille
                  >
                    <i className="bi bi-x-circle"></i>{" "}
                    {language === "FR" ? "Annuler" : "إلغاء"}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleStartClick}
                    style={{ fontSize: "1rem", padding: "8px 20px" }} // Réduit la taille
                  >
                    {language === "FR" ? "Convertir" : "تحويل"}
                  </button>
                </div>
              </div>
            )}

{isConverted && (
  <div className="col-12">
    <div
      className="border p-4 rounded bg-light text-center"
      style={{
        minHeight: "220px",
        fontSize: "1.3rem",
        background: "#ffeeee",
        marginTop: "20px",
        maxHeight: "60vh",
        overflowY: "auto",
      }}
    >
      <h5 className="fw-bold">
        {language === "FR" ? "Texte extrait :" : "النص المستخرج :"}
      </h5>
      <p className="text-muted">{extractedText || "..."}</p>
      {extractedText && (
        <div className="mt-2 text-center">
          <div className="d-flex justify-content-center flex-nowrap" style={{ gap: "10px" }}>
            {language === "FR" && (
              <button
                className="btn btn-success"
                onClick={handleTextToSpeech}
                disabled={isAudioLoading}
                title="Lire le texte"
                style={{
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  whiteSpace: "nowrap", // Empêche le texte de se casser
                  "@media (max-width: 768px)": {
                    fontSize: "1rem",
                    padding: "8px 15px",
                  },
                }}
              >
                {isAudioLoading ? (
                  <i className="bi bi-hourglass-split"></i>
                ) : (
                  <i className="bi bi-volume-up"></i>
                )}
                {isAudioLoading ? " Chargement..." : " Lire"}
              </button>
            )}
            {language === "AR" && (
              <button
                className="btn btn-success"
                onClick={handleTextToSpeech}
                disabled={isAudioLoading}
                title="استمع إلى النص"
                style={{
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  whiteSpace: "nowrap", // Empêche le texte de se casser
                  "@media (max-width: 768px)": {
                    fontSize: "1rem",
                    padding: "8px 15px",
                  },
                }}
              >
                {isAudioLoading ? (
                  <i className="bi bi-hourglass-split"></i>
                ) : (
                  <i className="bi bi-volume-up"></i>
                )}
                {isAudioLoading ? " جار التحميل..." : " استمع"}
              </button>
            )}
            <button
              className="btn btn-danger"
              onClick={handleClear}
              style={{
                fontSize: "1.2rem",
                padding: "10px 20px",
                whiteSpace: "nowrap", // Empêche le texte de se casser
                "@media (max-width: 768px)": {
                  fontSize: "1rem",
                  padding: "8px 15px",
                },
              }}
            >
              <i className="bi bi-arrow-clockwise"></i>{" "}
              {language === "FR" ? "Effacer" : "مسح"}
            </button>
          </div>
          {audioSrc && (
            <audio
              ref={audioRef}
              src={audioSrc}
              onEnded={() => setAudioSrc(null)}
            />
          )}
        </div>
      )}
    </div>
  </div>
)}
          </>
        ) : (
          <div className="text-center">
            <h1 className="mb-4">
              🖼️ Image to Text Converter / محول الصورة إلى نص
            </h1>
            <h5 className="mb-4 text-muted">
              Drop, Upload or Paste image / اسحب، قم بالتحميل أو ألصق صورة
            </h5>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
              <button
                className="btn btn-lg btn-outline-primary btn-custom"
                onClick={() => handleLanguageSelect("FR")}
                style={{ whiteSpace: "normal", wordWrap: "break-word" }}
              >
                Français
              </button>
              <button
                className="btn btn-lg btn-outline-success btn-custom"
                onClick={() => handleLanguageSelect("AR")}
                style={{ whiteSpace: "normal", wordWrap: "break-word" }}
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
            width: "50vw",
            height: "77vh",
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
          style={{ width: "100%", height: "77%", borderRadius: "10px" }}
          videoConstraints={videoConstraints}
        />
        <button className="btn btn-success mt-3 me-2" onClick={handleCaptureImage}>
          📸 {language === "FR" ? "Prendre une photo" : "التقط صورة"}
        </button>
        <button className="btn btn-danger mt-3 me-2" onClick={clauseCameraModal}>
          {language === "FR" ? "Annuler" : "إلغاء"}
        </button>
      </Modal>
    </div>
  );
};

export default Fonctionnalites;
import React, { useState, useRef } from "react";
import axios from "axios";
import "../assets/css/bootstrap.min.css";
import "../assets/lib/animate/animate.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Charger la police Tajawal depuis Google Fonts
const loadGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
loadGoogleFonts();

const SpeechToTextApp = () => {
  const frenchWords = [
    "Femme",
    "Monsieur",
    "Fusil",
    "Fils",
    "Chorale",
    "Sept",
    "Tabac",
    "Parfum",
    "Ordure",
    "Seconde",
  ];
  const arabicWords = [
    "ولد",
    "طفل",
    "شراب",
    "غنم",
    "ضرس",
    "ضلع",
    "برتقال",
    "ثعلب",
    "معطف",
    "طبل",
  ];

  const [language, setLanguage] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let mediaRecorder = useRef(null);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setTranscribedText("");
    setFeedback("");
    setRecordedAudio(null);
    setIsLoading(false);

    const words = lang === "french" ? frenchWords : arabicWords;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    const audioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setRecordedAudio(audioBlob);
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
  };

  const sendAudioToAPI = async () => {
    if (!recordedAudio) {
      setFeedback("Veuillez enregistrer un audio d’abord.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", recordedAudio, "recording.wav");

    const endpoint =
      language === "french"
        ? "http://127.0.0.1:8000/convert-speech-to-textFR/"
        : "http://127.0.0.1:8000/convert-speech-to-textAR/";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Réponse de l'API :", response.data);

      const transcribed = response.data.transcribed_text;
      if (!transcribed || typeof transcribed !== "string") {
        throw new Error("La réponse de l'API ne contient pas de texte valide.");
      }

      if (transcribed === "") {
        setTranscribedText("Aucun texte transcrit. Veuillez réessayer.");
        setFeedback("❌ Aucun texte détecté.");
        return;
      }

      setTranscribedText(transcribed);

      const normalizedTranscribed = transcribed
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();

      const normalizedCurrentWord = currentWord
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();

      if (normalizedTranscribed === normalizedCurrentWord) {
        setFeedback("🎉 Correct ! Bien joué !");
      } else {
        setFeedback("❌ Incorrect. Essayez encore.");
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi à l’API :", error);
      setFeedback("Erreur lors de la transcription. Vérifiez l’API.");
      setTranscribedText("Erreur lors de la transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewWord = () => {
    const words = language === "french" ? frenchWords : arabicWords;
    
    const availableWords = words.filter(word => word !== currentWord);
    
    if (availableWords.length === 0) {
      selectLanguage(language);
      return;
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
    
    setRecordedAudio(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setRecordedAudio(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setCurrentWord("");
    setRecordedAudio(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
  };

  return (
    <div>
      <style>
        {`
          .image-to-text-container h5 {
            font-style: normal !important; /* Surcharge le style italic */
          }

          @media (max-width: 768px) {
            .text-muted {
              font-size: 1.2rem !important;
            }
            .border.p-3.p-md-4 {
              padding: 1rem !important;
            }
            .text-extracted-container p {
              font-size: ${language === "arabic" ? "1.6rem" : "1.4rem"} !important;
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
              font-size: ${language === "arabic" ? "1.5rem" : "1.3rem"} !important;
            }
            .text-extracted-container {
              max-height: 65vh !important;
            }
          }
        `}
      </style>
      <div
        className="container-fluid d-flex align-items-center justify-content-center image-to-text-container"
        style={{
          minHeight: "90vh",
          width: "100%",
          background: "linear-gradient(135deg, #ff9a9e 0%, #a1c4fd 100%)",
        }}
      >
        <div
          className="container shadow-lg p-3 p-md-5 animate__animated animate__fadeIn"
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
            <>
              <div className="text-center mb-3 mb-md-4">
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleBackToLanguageChoice}
                  style={{ fontSize: "1.3rem", padding: "10px 30px" }}
                >
                  {language === "french" ? (
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

              <div className="text-center mb-4">
                <h4
                  style={{
                    fontFamily: language === "arabic" ? "'Tajawal', sans-serif" : "inherit",
                    direction: language === "arabic" ? "rtl" : "ltr",
                  }}
                >
                  {language === "french"
                    ? "Mot à prononcer :"
                    : "الكلمة للنطق :"}
                </h4>
                <h2
                  className="fw-bold"
                  style={{
                    fontSize: language === "arabic" ? "2.5rem" : "2rem",
                    fontFamily: language === "arabic" ? "'Tajawal', sans-serif" : "inherit",
                    direction: language === "arabic" ? "rtl" : "ltr",
                  }}
                >
                  {currentWord}
                </h2>
              </div>

              <div className="text-center mb-4">
                <div className="d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={startRecording}
                    disabled={isRecording || isLoading}
                    style={{ fontSize: "1rem", padding: "8px 20px" }}
                  >
                    <i className="bi bi-mic"></i>{" "}
                    {language === "french" ? "Démarrer l’enregistrement" : "بدء التسجيل"}
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={stopRecording}
                    disabled={!isRecording || isLoading}
                    style={{ fontSize: "1rem", padding: "8px 20px" }}
                  >
                    <i className="bi bi-stop"></i>{" "}
                    {language === "french" ? "Arrêter l’enregistrement" : "إيقاف التسجيل"}
                  </button>
                </div>
              </div>

              {recordedAudio && !transcribedText && (
                <div className="text-center mb-4">
                  <button
                    className="btn btn-primary"
                    onClick={sendAudioToAPI}
                    disabled={isLoading}
                    style={{ fontSize: "1rem", padding: "8px 20px" }}
                  >
                    {isLoading ? (
                      <i className="bi bi-hourglass-split"></i>
                    ) : (
                      <>
                        {language === "french" ? "Vérifier" : "تحقق"}
                      </>
                    )}
                  </button>
                </div>
              )}

              {transcribedText && (
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
                      {language === "french" ? "Texte transcrit :" : "النص المستخرج :"}
                    </h5>
                    <p
                      className="text-muted"
                      style={{
                        fontSize: language === "arabic" ? "clamp(1.35rem, 2.75vw, 1.8rem)" : "clamp(1.2rem, 2.5vw, 1.6rem)",
                        fontFamily: language === "arabic" ? "'Tajawal', sans-serif" : "inherit",
                        direction: language === "arabic" ? "rtl" : "ltr",
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
                      {transcribedText}
                    </p>
                    <h5 className="fw-bold mt-3">
                      {language === "french" ? "Résultat :" : "النتيجة :"}
                    </h5>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        color: feedback.includes("Correct") ? "green" : "red",
                        fontFamily: language === "arabic" ? "'Tajawal', sans-serif" : "inherit",
                        direction: language === "arabic" ? "rtl" : "ltr",
                      }}
                    >
                      {feedback}
                    </p>
                  </div>
                </div>
              )}

              {transcribedText && (
                <div className="text-center mt-4">
                  {feedback.includes("Correct") ? (
                    <button
                      className="btn btn-success"
                      onClick={handleNewWord}
                      style={{ fontSize: "1rem", padding: "8px 20px" }}
                    >
                      {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
                    </button>
                  ) : (
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-warning"
                        onClick={handleRetry}
                        style={{ fontSize: "1rem", padding: "8px 20px" }}
                      >
                        {language === "french" ? "Réessayer" : "إعادة المحاولة"}
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={handleNewWord}
                        style={{ fontSize: "1rem", padding: "8px 20px" }}
                      >
                        {language === "french" ? "Nouveau mot" : "كلمة جديدة"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="mb-4" style={{ color: "#ff5e62" }}>
                <i className="bi bi-mic-fill me-2"></i> Reconnaissance Vocale |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  التعرف على الصوت
                </span>
              </h1>
              <h5 className="mb-4 text-muted">
                Prononcez un mot et vérifiez votre prononciation |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  انطق كلمة وتحقق من نطقك
                </span>
              </h5>
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <button
                  className="btn btn-lg btn-outline-primary btn-custom"
                  onClick={() => selectLanguage("french")}
                  style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                >
                   Français
                </button>
                <button
                  className="btn btn-lg btn-outline-success btn-custom"
                  onClick={() => selectLanguage("arabic")}
                  style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                >
                   العربية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechToTextApp;
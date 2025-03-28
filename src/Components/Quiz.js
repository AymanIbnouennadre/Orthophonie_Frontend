import React, { useState, useRef, useEffect } from "react";
import { questions as questionsAr } from "../assets/js/quiz_ar.js";
import { questions as questionsFr } from "../assets/js/quiz_fr.js";
import "../assets/css/bootstrap.min.css";
import "../assets/lib/animate/animate.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import confetti from "canvas-confetti";

// Charger les polices adaptées (OpenDyslexic pour dyslexiques, Poppins et Tajawal comme fallbacks)
const loadFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&family=Poppins:wght@400;700&family=Tajawal:wght@400;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
loadFonts();

// Définir les sons pour une réponse correcte et incorrecte
let WinAudio = new Audio("/win.wav"); // Chemin absolu pour le web
let LoseAudio = new Audio("/lost.wav"); // Chemin absolu pour le web

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Quiz = () => {
  const [language, setLanguage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [treasures, setTreasures] = useState(0);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const audioRef = useRef(null);

  // Sélectionner les questions selon la langue
  const originalQuestions = language === "french" ? questionsFr.fr : questionsAr.ar;

  // Mélanger les questions au démarrage ou au changement de langue
  useEffect(() => {
    if (language) {
      const shuffled = shuffleArray(originalQuestions);
      setAvailableQuestions(shuffled);
      setCurrentQuestionIndex(0);
    }
  }, [language]);

  const currentQuestion = availableQuestions[currentQuestionIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentQuestion) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
      audio.volume = 1; // Volume maximum
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentQuestion]);

  // Lancer les confettis pour une bonne réponse
  const launchConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff6b6b", "#ffd700", "#1e90ff"],
    });
  };

  // Jouer un son selon le résultat
  useEffect(() => {
    if (feedback) {
      if (feedback.includes("Bravo") || feedback.includes("أحسنت")) {
        launchConfetti();
        WinAudio.play().catch((error) => console.warn("Erreur son correct:", error));
      } else {
        LoseAudio.play().catch((error) => console.warn("Erreur son incorrect:", error));
      }
    }
  }, [feedback]);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setTreasures(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.playbackRate = 1.2;
        audioRef.current.play().catch((error) => console.warn("Erreur audio:", error));
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      setFeedback(language === "french" ? "🎉 Bravo, champion !" : "🎉 أحسنت، بطل!");
      setTreasures((prev) => prev + 1);
    } else {
      setFeedback(language === "french" ? "❌ Oups, essaie encore !" : "❌ أوبس، حاول مرة أخرى!");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= availableQuestions.length - 1) {
      const shuffled = shuffleArray(originalQuestions);
      setAvailableQuestions(shuffled);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }

    if (currentQuestionIndex === originalQuestions.length - 1) {
      setLanguage(null);
      setCurrentQuestionIndex(0);
      setTreasures(0);
      setAvailableQuestions([]);
    }

    setSelectedAnswer(null);
    setFeedback("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setFeedback("");
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setTreasures(0);
    setAvailableQuestions([]);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <div>
      <style>
        {`
          .quiz-container {
            font-family: 'OpenDyslexic', 'Poppins', sans-serif;
            background: linear-gradient(120deg, #f9e79f, #85c1e9);
            min-height: 90vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow: hidden;
            animation: floating 3s ease-in-out infinite;
          }

          .quiz-container.arabic {
            font-family: 'OpenDyslexic', 'Tajawal', sans-serif;
            direction: rtl;
          }

          .quiz-container h5,
          .quiz-container h4,
          .quiz-container h2,
          .quiz-container p,
          .quiz-container span,
          .quiz-container button {
            font-family: inherit;
            direction: inherit;
          }

          .quiz-container .container {
            max-width: 85%;
            width: 100%;
            height: 85vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 20px;
            background-color: #ffffff;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding: 20px;
            border: 5px solid #ff6b6b;
            position: relative;
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: nowrap;
          }

          .treasure-box {
            background: #ffd700;
            border-radius: 15px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            flex-shrink: 0;
            transition: transform 0.3s;
          }

          .treasure-box:hover {
            transform: scale(1.1);
          }

          .treasure-box i {
            font-size: 1.5rem;
            color: #ff6b6b;
            animation: treasure-bounce 1s infinite;
          }

          @keyframes treasure-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .treasure-box span {
            font-size: 1.2rem;
            color: #333;
            font-weight: bold;
          }

          .back-btn {
            background: ${language === "french" ? "#0055A4" : "#007A3D"};
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 8px 15px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: transform 0.3s;
            flex-shrink: 0;
          }

          .quiz-container.arabic .back-btn {
            flex-direction: row;
          }

          .quiz-container:not(.arabic) .back-btn {
            flex-direction: row-reverse;
          }

          .back-btn:hover {
            transform: scale(1.1);
          }

          .audio-player {
            display: flex;
            align-items: center;
            background: #fff;
            border-radius: 20px;
            padding: 15px 20px;
            margin: 20px auto;
            max-width: 500px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
            direction: ltr;
            border: 2px solid #ff6b6b;
            transform: translateY(-2px);
          }

          .audio-player::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #ff6b6b, #1e90ff, #ffd700, #ff6b6b);
            background-size: 400%;
            z-index: -1;
            border-radius: 22px;
            filter: blur(8px);
            animation: neon-glow 4s linear infinite;
          }

          @keyframes neon-glow {
            0% { background-position: 0% 50%; }
            50% { background-position: 400% 50%; }
            100% { background-position: 0% 50%; }
          }

          .audio-player button {
            background: linear-gradient(45deg, #ff6b6b, #1e90ff);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: #fff;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.3s;
            z-index: 1;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .audio-player button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          }

          .audio-player input[type="range"] {
            width: 100%;
            margin: 0 15px;
            background: transparent;
            height: 10px;
            border-radius: 5px;
            -webkit-appearance: none;
            outline: none;
            cursor: pointer;
            position: relative;
            z-index: 1;
          }

          .audio-player input[type="range"]::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #1e90ff ${(currentTime / (duration || 1)) * 100}%, #e0e0e0 0%);
            height: 10px;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
          }

          .audio-player input[type="range"]::-moz-range-track {
            background: linear-gradient(to right, #1e90ff ${(currentTime / (duration || 1)) * 100}%, #e0e0e0 0%);
            height: 10px;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
          }

          .audio-player input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 0;
            height: 0;
            background: transparent;
          }

          .audio-player input[type="range"]::-moz-range-thumb {
            width: 0;
            height: 0;
            background: transparent;
            border: none;
          }

          .audio-player input[type="range"]::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: ${(currentTime / (duration || 1)) * 100}%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(30, 144, 255, 0.5), transparent);
            animation: wave 1.5s infinite linear;
            z-index: -1;
          }

          @keyframes wave {
            0% { background-position: 0 0; }
            100% { background-position: 40px 0; }
          }

          .audio-player span {
            font-size: 1.1rem;
            color: #333;
            background: #fff;
            padding: 3px 10px;
            border-radius: 10px;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            z-index: 1;
          }

          .choice-card {
            background: #fef9e7;
            border: 4px solid #ff6b6b;
            border-radius: 20px;
            padding: 15px;
            font-size: 1.5rem;
            color: #333;
            margin: 10px;
            width: 100%;
            max-width: 200px;
            text-align: center;
            transition: all 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .choice-card:hover {
            transform: scale(1.1);
            background: #ff6b6b;
            color: #fff;
          }

          .choice-card.selected {
            background: #ff6b6b;
            color: #fff;
            border-color: #e55a5a;
          }

          .choice-card::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 0.5);
            border-radius: 50%;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            animation: bubble-rise 2s infinite;
          }

          @keyframes bubble-rise {
            0% { transform: translateX(-50%) translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-50%) translateY(-150px); opacity: 0; }
          }

          .instruction-text {
            font-size: 1.3rem;
            color: #555;
            text-align: center;
            margin-bottom: 20px;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .feedback-container {
            background: ${feedback.includes("Bravo") || feedback.includes("أحسنت") ? "#d5f5e3" : "#ffe6e6"};
            border-radius: 20px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
            font-size: 1.5rem;
            color: #333;
            position: relative;
            border: 3px solid ${feedback.includes("Bravo") || feedback.includes("أحسنت") ? "#28b463" : "#dc3545"};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            animation: zoomIn 0.5s ease;
          }

          .feedback-container::before {
            content: '';
            position: absolute;
            top: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 20px;
            background: ${feedback.includes("Bravo") || feedback.includes("أحسنت") ? "#d5f5e3" : "#ffe6e6"};
            z-index: 0;
            border-radius: 0 0 10px 10px;
          }

          @keyframes zoomIn {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          .feedback-icon {
            font-size: 3rem;
            margin-bottom: 10px;
            color: ${feedback.includes("Bravo") || feedback.includes("أحسنت") ? "#28a745" : "#dc3545"};
            animation: bounce 1s infinite;
            position: relative;
            z-index: 1;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .action-btn {
            font-size: 1.3rem;
            padding: 10px 25px;
            border-radius: 25px;
            margin: 10px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          .action-btn:hover {
            transform: scale(1.1);
          }

          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }

          @media (max-width: 768px) {
            .quiz-container .container {
              padding: 15px;
            }
            .choice-card {
              font-size: 1.4rem;
              max-width: 180px;
              padding: 12px;
            }
            .audio-player {
              max-width: 350px;
              padding: 8px 12px;
            }
            .audio-player span {
              font-size: 0.9rem;
              padding: 2px 6px;
            }
            .feedback-container {
              font-size: 1.2rem;
              padding: 15px;
              min-height: 150px;
            }
            .treasure-box {
              padding: 8px;
            }
            .treasure-box i {
              font-size: 1.2rem;
            }
            .treasure-box span {
              font-size: 1rem;
            }
            .back-btn {
              padding: 6px 12px;
              font-size: 1rem;
            }
            .instruction-text {
              font-size: 1.1rem;
              margin-bottom: 15px;
            }
          }

          @media (max-width: 576px) {
            .quiz-container .container {
              padding: 10px;
            }
            .choice-card {
              font-size: 1.2rem;
              padding: 10px 15px;
              max-width: 150px;
            }
            .audio-player {
              max-width: 300px;
              padding: 6px 10px;
            }
            .audio-player span {
              font-size: 0.8rem;
              padding: 2px 5px;
            }
            .audio-player button {
              width: 40px;
              height: 40px;
              font-size: 1.5rem;
            }
            .audio-player input[type="range"] {
              margin: 0 10px;
            }
            .feedback-container {
              font-size: 1rem;
            }
            .action-btn {
              font-size: 1rem;
              padding: 8px 20px;
            }
            .header-container {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              gap: 10px;
            }
            .treasure-box {
              padding: 6px;
            }
            .treasure-box i {
              font-size: 1rem;
            }
            .treasure-box span {
              font-size: 0.9rem;
            }
            .back-btn {
              padding: 5px 10px;
              font-size: 0.9rem;
            }
            .instruction-text {
              font-size: 0.9rem;
              margin-bottom: 10px;
            }
          }
        `}
      </style>
      <div className={`quiz-container ${language === "arabic" ? "arabic" : ""}`}>
        <div className="container shadow-lg p-3 p-md-5 animate__animated animate__fadeIn">
          {language ? (
            <>
              <div className="header-container">
                <button className="back-btn" onClick={handleBackToLanguageChoice}>
                  <span>{language === "french" ? "Choix de langues" : "العودة لاختيار اللغة"}</span>
                  <i className="bi bi-arrow-left"></i>
                </button>
                <div className="treasure-box">
                  <span>{language === "french" ? "Trésors" : "كنوز"} {treasures}</span>
                  <i className="bi bi-gem"></i>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="audio-player">
                  <button onClick={handlePlayPause}>
                    <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max={duration || 1}
                    value={currentTime}
                    onChange={handleSeek}
                  />
                  <span>{formatTime(currentTime)}</span>
                </div>
              </div>

              {!feedback && currentQuestion && (
                <>
                  {/* Ajout de l'instruction générale */}
                  <p className="instruction-text">
                    {language === "french"
                      ? "Écoutez attentivement l'audio et choisissez une réponse : "
                      : "استمع جيدًا للصوت واختر إجابة : "}
                  </p>

                  <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                    {currentQuestion.choices.map((choice, index) => (
                      <button
                        key={index}
                        className={`choice-card ${selectedAnswer === index ? "selected" : ""}`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {feedback && (
                <div className="feedback-container">
                  <div>
                    <i
                      className={`bi ${feedback.includes("Bravo") || feedback.includes("أحسنت") ? "bi-star-fill" : "bi-x-circle-fill"} feedback-icon`}
                    ></i>
                    <h5>{language === "french" ? "Ta réponse :" : "إجابتك :"}</h5>
                    <p style={{ fontSize: "1.8rem", color: "#555" }}>
                      {currentQuestion.choices[selectedAnswer]}
                    </p>
                    <h5>{language === "french" ? "Résultat :" : "النتيجة :"}</h5>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        color: feedback.includes("Bravo") || feedback.includes("أحسنت")
                          ? "#28a745"
                          : "#dc3545",
                      }}
                    >
                      {feedback}
                    </p>
                  </div>

                  <div className="text-center mt-4">
                    {feedback.includes("Bravo") || feedback.includes("أحسنت") ? (
                      <div className="centered-btn-container">
                        <button className="btn btn-success action-btn" onClick={handleNextQuestion}>
                          {language === "french" ? "Question suivante" : "السؤال التالي"}
                          <i className="bi bi-arrow-right-circle"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-warning action-btn" onClick={handleRetry}>
                          {language === "french" ? "Réessayer" : "إعادة المحاولة"}
                          <i className="bi bi-arrow-repeat"></i>
                        </button>
                        <button className="btn btn-success action-btn" onClick={handleNextQuestion}>
                          {language === "french" ? "Question suivante" : "السؤال التالي"}
                          <i className="bi bi-arrow-right-circle"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1
                className="mb-4"
                style={{
                  color: "#FF6B6B",
                  fontWeight: "700",
                  textShadow: "2px 2px 5px rgba(255, 100, 100, 0.5)",
                }}
              >
                <i className="bi bi-headphones me-2"></i> Quiz Audio |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  اختبار صوتي
                </span>
              </h1>
              <h5 className="mb-4 text-muted">
                Écoutez et choisissez la bonne réponse |{" "}
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  استمع واختر الإجابة الصحيحة
                </span>
              </h5>
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <button
                  className="btn btn-lg btn-outline-primary custom-btn"
                  onClick={() => selectLanguage("french")}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontSize: "1.3rem",
                    padding: "12px 25px",
                    border: "3px solid #0055A4",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    width: "200px",
                    boxSizing: "border-box",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Français
                </button>
                <button
                  className="btn btn-lg btn-outline-success custom-btn"
                  onClick={() => selectLanguage("arabic")}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontFamily: "'Tajawal', sans-serif",
                    border: "3px solid #007A3D",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    padding: "12px 25px",
                    width: "200px",
                    boxSizing: "border-box",
                  }}
                >
                  العربية
                </button>
              </div>
            </div>
          )}
        </div>
        {currentQuestion && <audio ref={audioRef} src={currentQuestion.path} />}
      </div>
    </div>
  );
};

export default Quiz;
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../assets/css/bootstrap.min.css";
import "../assets/lib/animate/animate.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Charger les polices Google Fonts (Poppins pour le français, Tajawal pour l'arabe)
const loadGoogleFonts = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Tajawal:wght@400;500;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};
loadGoogleFonts();

const SpeechToTextApp = () => {
  // Updated French words list
  const frenchWords = [
    "Cartable",
    "Chaise",
    "Crayon",
    "Gomme",
    "Tableau",
    "Lunette",
    "Maison",
    "Clé",
    "Train",
    "Chat",
    "Chien",
    "Poule",
    "Oeuf",
    "Voiture",
    "Vache",
    "Chapeau",
    "Poisson",
    "Miroir",
    "Bouteille",
    "Ciseau",
    "Horloge",
    "Etoile",
    "Banane",
    "Mouche",
    "Savon",
    "Tasse",
    "Fourchette",
    "Chaussure",
    "Balle",
    "Livre",
  ];

  // Updated Arabic words list
  const arabicWords = [
    "مدرسة",
    "مقص",
    "سبورة",
    "حقيبة",
    "طاولة",
    "نافذة",
    "هاتف",
    "قطة",
    "سيارة",
    "قطار",
    "جمل",
    "سمكة",
    "زهرة",
    "عصفور",
    "خبز",
    "بيضة",
    "موزة",
    "نظارات",
    "مفتاح",
    "كرسي",
    "حصان",
    "أرنب",
    "مظلة",
    "كتاب",
    "كرة",
    "طائرة",
    "ساعة",
    "سكين",
    "حذاء",
    "فرشاة",
  ];

  const [language, setLanguage] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioURL, setAudioURL] = useState(null); // For playback
  const [transcribedText, setTranscribedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // For audio playback
  const [currentTime, setCurrentTime] = useState(0); // For audio progress
  const [duration, setDuration] = useState(0); // For audio duration
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // Timer for recording
  const [correctCount, setCorrectCount] = useState(0); // Track correct answers
  const mediaRecorder = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Audio playback handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioURL) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
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

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setTranscribedText("");
    setFeedback("");
    setRecordedAudio(null);
    setAudioURL(null);
    setIsLoading(false);
    setCorrectCount(0);

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
      setAudioURL(URL.createObjectURL(audioBlob)); // For playback
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
  };

  const sendAudioToAPI = async () => {
    if (!recordedAudio) {
      setFeedback(language === "french" ? "Veuillez enregistrer un audio d’abord." : "يرجى تسجيل صوت أولاً.");
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

      const transcribed = response.data.transcribed_text;
      if (!transcribed || typeof transcribed !== "string") {
        throw new Error("La réponse de l'API ne contient pas de texte valide.");
      }

      if (transcribed === "") {
        setTranscribedText(language === "french" ? "Aucun texte transcrit. Veuillez réessayer." : "لم يتم استخراج أي نص. يرجى المحاولة مرة أخرى.");
        setFeedback("❌ " + (language === "french" ? "Aucun texte détecté." : "لم يتم اكتشاف نص."));
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
        setFeedback("🎉 " + (language === "french" ? "Correct ! Excellent !" : "صحيح  ، أحسنت  !"));
        setCorrectCount((prev) => prev + 1);
      } else {
        setFeedback("❌ " + (language === "french" ? "Incorrect. Essayez encore." : "خطأ. حاول مرة أخرى."));
      }
    } catch (error) {
      console.error("Erreur lors de l’envoi à l’API :", error);
      setFeedback(language === "french" ? "Erreur lors de la transcription. Vérifiez l’API." : "خطأ أثناء النسخ. تحقق من الـ API.");
      setTranscribedText(language === "french" ? "Erreur lors de la transcription." : "خطأ أثناء النسخ.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewWord = () => {
    const words = language === "french" ? frenchWords : arabicWords;
    const availableWords = words.filter((word) => word !== currentWord);

    if (availableWords.length === 0) {
      selectLanguage(language);
      return;
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleRetry = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleReRecord = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleBackToLanguageChoice = () => {
    setLanguage(null);
    setCurrentWord("");
    setRecordedAudio(null);
    setAudioURL(null);
    setTranscribedText("");
    setFeedback("");
    setIsRecording(false);
    setIsLoading(false);
    setCorrectCount(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

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
              console.warn("Erreur lors de la lecture :", error);
              setIsPlaying(false);
            });
        }
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

  return (
    <div>
      <style>
        {`
          /* Scoped Styles for SpeechToTextApp */
          .speech-to-text-container {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #ff9a9e 0%, #a1c4fd 100%);
            min-height: 90vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: floating 3s ease-in-out infinite;
          }

          .speech-to-text-container.arabic {
            font-family: 'Tajawal', sans-serif;
            direction: rtl;
          }

          .speech-to-text-container h5,
          .speech-to-text-container h4,
          .speech-to-text-container h2,
          .speech-to-text-container p,
          .speech-to-text-container span,
          .speech-to-text-container button {
            font-family: inherit;
            direction: inherit;
          }

          /* Container Styling */
          .speech-to-text-container .container {
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
          }

          /* Card for Word Display */
          .word-card {
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            transition: transform 0.3s ease;
          }

          .word-card:hover {
            transform: translateY(-5px);
          }

          /* Recording Button (Messenger Style) */
          .record-btn {
            position: relative;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${isRecording ? "#ff4d4f" : "#007bff"};
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: background 0.3s ease;
          }

          .record-btn:hover {
            background: ${isRecording ? "#e63946" : "#0056b3"};
          }

          .record-btn.recording {
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(0, 123, 255, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
            }
          }

          /* Recording Animation (Wave Effect) */
          .recording-wave {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .wave-bar {
            width: 6px;
            height: 20px;
            background: #ff4d4f;
            border-radius: 3px;
            animation: wave 1s infinite ease-in-out;
          }

          .wave-bar:nth-child(2) {
            animation-delay: 0.2s;
          }

          .wave-bar:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes wave {
            0%, 100% {
              height: 20px;
            }
            50% {
              height: 40px;
            }
          }

          /* Custom Audio Player */
          .audio-player {
            display: flex;
            align-items: center;
            background: #E6F0FA; /* Bleu ciel comme Messenger */
            border-radius: 30px;
            padding: 12px 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            max-width: 350px;
            margin: 0 auto;
            transition: transform 0.3s ease;
            flex-direction: row; /* Ensure LTR layout for both languages */
          }

          .audio-player:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          /* Invert the play/pause icon for Arabic */
          .speech-to-text-container.arabic .audio-player button i {
            transform: scaleX(-1); /* Mirrors the icon horizontally */
          }

          .audio-player button {
            background: none;
            border: none;
            color: #007bff;
            font-size: 1.8rem;
            cursor: pointer;
            transition: color 0.3s ease, transform 0.2s ease;
            padding: 5px;
          }

          .audio-player button:hover {
            color: #0056b3;
            transform: scale(1.1);
          }

          .audio-player input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: linear-gradient(to right, #007bff 0%, #007bff ${(currentTime / (duration || 1)) * 100}%, #d3d3d3 ${(currentTime / (duration || 1)) * 100}%, #d3d3d3 100%);
            border-radius: 5px;
            outline: none;
            margin: 0 15px;
            transition: background 0.3s ease;
          }

          .audio-player input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #007bff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }

          .audio-player input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }

          .audio-player input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #007bff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }

          .audio-player input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.2);
          }

          .audio-player span {
            font-size: 1rem;
            color: #333;
            font-weight: 500;
            whiteSpace: nowrap;
            background: #f8f9fa;
            padding: 3px 8px;
            border-radius: 10px;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          /* Feedback Section */
          .feedback-container {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            position: relative;
            min-height: 200px; /* Ensure enough space for animations */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          /* Animation Container for Feedback */
          .feedback-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none; /* Prevent interaction with animation */
            z-index: 0; /* Ensure animation stays behind text */
          }

          /* Fireworks for Correct Answers */
          .fireworks {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .firework {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b6b, #ffd700);
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
            animation: firework-burst 2s infinite ease-out;
          }

          .firework:nth-child(odd) {
            background: linear-gradient(45deg, #00c4ff, #6b48ff);
          }

          .firework:nth-child(1) {
            top: 20%;
            left: 20%;
            animation-delay: 0s;
          }
          .firework:nth-child(2) {
            top: 30%;
            left: 70%;
            animation-delay: 0.3s;
          }
          .firework:nth-child(3) {
            top: 60%;
            left: 30%;
            animation-delay: 0.6s;
          }
          .firework:nth-child(4) {
            top: 70%;
            left: 80%;
            animation-delay: 0.9s;
          }
          .firework:nth-child(5) {
            top: 50%;
            left: 50%;
            animation-delay: 1.2s;
          }
          .firework:nth-child(6) {
            top: 40%;
            left: 40%;
            animation-delay: 1.5s;
          }
          .firework:nth-child(7) {
            top: 80%;
            left: 60%;
            animation-delay: 1.8s;
          }
          .firework:nth-child(8) {
            top: 25%;
            left: 55%;
            animation-delay: 2.1s;
          }

          @keyframes firework-burst {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.8;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }

          /* Sparkle Effect for Fireworks */
          .firework::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffffff;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sparkle 2s infinite;
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1.5);
            }
          }

          /* Ensure text stays above animations */
          .feedback-container > div {
            position: relative;
            z-index: 1;
          }

          /* Buttons */
          .custom-btn {
            border-radius: 25px;
            padding: 10px 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .custom-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          /* Back Button */
          .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .speech-to-text-container.arabic .back-btn {
            flex-direction: row;
          }

          .speech-to-text-container:not(.arabic) .back-btn {
            flex-direction: row-reverse;
          }

          /* Progress Bar */
          .progress-bar-container {
            margin-bottom: 20px;
            font-size: 1rem;
            color: #555;
            margin-top: 8px; /* Nudge the progress text down to align with the button */
          }

          /* Centered Button for New Word */
          .centered-btn-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
          }

          /* Centered Particle Loading Animation Below Buttons */
          .loading-particle-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 30px; /* Increased space to add more breathing room */
            width: 100%; /* Ensure the wrapper takes full width for centering */
          }

          /* Particle Loading Animation */
          .loading-particles {
            position: relative;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Orbit Path (Faint Circle) */
          .loading-particles::before {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            border: 1px dashed rgba(107, 72, 255, 0.2); /* Faint dashed circle */
            border-radius: 50%;
          }

          .loading-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #007bff, #6b48ff); /* Gradient from blue to purple */
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(107, 72, 255, 0.6); /* Enhanced glow effect */
            animation: particle-orbit 2.5s linear infinite, pulse-particle 1s ease-in-out infinite;
          }

          .loading-particle:nth-child(1) {
            animation-delay: 0s, 0s;
          }

          .loading-particle:nth-child(2) {
            animation-delay: 0.3s, 0.2s;
          }

          .loading-particle:nth-child(3) {
            animation-delay: 0.6s, 0.4s;
          }

          .loading-particle:nth-child(4) {
            animation-delay: 0.9s, 0.6s;
          }

          .loading-particle:nth-child(5) {
            animation-delay: 1.2s, 0.8s;
          }

          .loading-particle:nth-child(6) {
            animation-delay: 1.5s, 1s;
          }

          @keyframes particle-orbit {
            0% {
              transform: rotate(0deg) translateX(25px) scale(1);
              opacity: 0.4;
            }
            50% {
              transform: rotate(180deg) translateX(25px) scale(1.3);
              opacity: 1;
            }
            100% {
              transform: rotate(360deg) translateX(25px) scale(1);
              opacity: 0.4;
            }
          }

          @keyframes pulse-particle {
            0%, 100% {
              box-shadow: 0 0 10px rgba(107, 72, 255, 0.6);
            }
            50% {
              box-shadow: 0 0 15px rgba(107, 72, 255, 0.9);
            }
          }

          /* Loading Text with Gradient, Shadow, and Bounce Animation */
          .loading-text {
            font-size: 1rem;
            font-weight: 500;
            background: linear-gradient(45deg, #007bff, #6b48ff); /* Gradient text */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
            margin-top: 12px; /* Slightly adjusted spacing */
            animation: bounce-text 1.5s ease-in-out infinite;
          }

          @keyframes bounce-text {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          /* Animation for Background */
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .word-card {
              padding: 15px;
            }
            .word-card h2 {
              font-size: 1.8rem !important;
            }
            .feedback-container {
              padding: 15px;
              min-height: 150px;
            }
            .audio-player {
              max-width: 300px;
              padding: 10px 15px;
            }
            .audio-player span {
              font-size: 0.9rem;
              padding: 2px 6px;
            }
            .firework {
              width: 6px;
              height: 6px;
            }
            .firework::before {
              width: 3px;
              height: 3px;
            }
          }

          @media (max-width: 576px) {
            .word-card h2 {
              font-size: 1.5rem !important;
            }
            .custom-btn {
              padding: 8px 20px;
              font-size: 0.9rem;
            }
            .audio-player {
              max-width: 250px;
              padding: 8px 12px;
            }
            .audio-player span {
              font-size: 0.8rem;
              padding: 2px 5px;
            }
            .audio-player button {
              font-size: 1.5rem;
            }
            .audio-player input[type="range"] {
              margin: 0 10px;
            }
            .loading-particles {
              width: 40px;
              height: 40px;
            }
            .loading-particles::before {
              width: 40px;
              height: 40px;
            }
            .loading-particle {
              width: 6px;
              height: 6px;
            }
            @keyframes particle-orbit {
              0% {
                transform: rotate(0deg) translateX(20px) scale(1);
                opacity: 0.4;
              }
              50% {
                transform: rotate(180deg) translateX(20px) scale(1.3);
                opacity: 1;
              }
              100% {
                transform: rotate(360deg) translateX(20px) scale(1);
                opacity: 0.4;
              }
            }
            .loading-text {
              font-size: 0.9rem;
            }
            .firework {
              width: 5px;
              height: 5px;
            }
            .firework::before {
              width: 2px;
              height: 2px;
            }
          }
        `}
      </style>
      <div
        className={`speech-to-text-container ${language === "arabic" ? "arabic" : ""}`}
      >
        <div
          className="container shadow-lg p-3 p-md-5 animate__animated animate__fadeIn"
        >
          {language ? (
            <>
              {/* Back to Language Selection */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <button
                  className="btn btn-outline-secondary custom-btn back-btn"
                  onClick={handleBackToLanguageChoice}
                >
                  <span>{language === "french" ? "Choix de langues" : "العودة لاختيار اللغة"}</span>
                  <i className="bi bi-arrow-left"></i>
                </button>
                {/* Progress Indicator */}
                <div className="progress-bar-container">
                  <span>
                    {language === "french" ? "Progrès :" : "التقدم :"} {correctCount}/
                    {(language === "french" ? frenchWords : arabicWords).length}
                  </span>
                </div>
              </div>

              {/* Word to Pronounce */}
              <div className="word-card text-center mb-4">
                <h4
                  style={{
                    color: "#6b48ff",
                  }}
                >
                  {language === "french" ? "Mot à prononcer :" : "الكلمة للنطق :"}
                </h4>
                <h2
                  className="fw-bold"
                  style={{
                    fontSize: language === "arabic" ? "2.5rem" : "2rem",
                    color: "#333",
                  }}
                >
                  {currentWord}
                </h2>
              </div>

              {/* Recording Section - Show only if no transcription yet */}
              {!transcribedText && (
                <div className="text-center mb-4">
                  {!recordedAudio ? (
                    <div className="recording-wave">
                      <button
                        className={`record-btn ${isRecording ? "recording" : ""}`}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isLoading}
                      >
                        <i className={`bi ${isRecording ? "bi-stop" : "bi-mic"}`}></i>
                      </button>
                      {isRecording && (
                        <>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                        </>
                      )}
                    </div>
                  ) : (
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
                      <div className="d-flex justify-content-center gap-3 mt-3">
                        <button
                          className="btn btn-primary custom-btn"
                          onClick={sendAudioToAPI}
                          disabled={isLoading}
                          style={{ fontSize: "1rem", padding: "8px 20px" }}
                        >
                          <span>{language === "french" ? "Vérifier" : "تحقق"}</span>
                          <i className="bi bi-check-circle"></i>
                        </button>
                        <button
                          className="btn btn-warning custom-btn"
                          onClick={handleReRecord}
                        >
                          <span>{language === "french" ? "Réenregistrer" : "إعادة التسجيل"}</span>
                          <i className="bi bi-mic"></i>
                        </button>
                      </div>
                      {/* Centered Particle Loading Animation Below Buttons */}
                      {isLoading && (
                        <div className="loading-particle-wrapper">
                          <div className="loading-particles">
                            <div className="loading-particle"></div>
                            <div className="loading-particle"></div>
                            <div className="loading-particle"></div>
                            <div className="loading-particle"></div>
                            <div className="loading-particle"></div>
                            <div className="loading-particle"></div>
                          </div>
                          <span className="loading-text">
                            {language === "french" ? "Traitement en cours..." : "جارٍ المعالجة..."}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {isRecording && (
                    <div className="mt-2">
                      <span>{language === "french" ? "Enregistrement..." : "جارٍ التسجيل..."}</span>
                      <span className="ms-2">{recordingTime}s</span>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Section */}
              {transcribedText && (
                <div className="feedback-container">
                  <div>
                    <h5 className="fw-bold">
                      {language === "french" ? "Texte transcrit :" : "النص المستخرج :"}
                    </h5>
                    <p
                      style={{
                        fontSize: language === "arabic" ? "1.6rem" : "1.4rem",
                        color: "#555",
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
                        color:
                          feedback.includes("Correct") || feedback.includes("صحيح")
                            ? "#28a745"
                            : "#dc3545",
                      }}
                    >
                      {feedback}
                    </p>
                  </div>

                  {/* Animation for Feedback (Only for Correct Answers) */}
                  {(feedback.includes("Correct") || feedback.includes("صحيح")) && (
                    <div className="feedback-animation">
                      <div className="fireworks">
                        {/* Firework Particles */}
                        {[...Array(8)].map((_, i) => (
                          <div key={`firework-${i}`} className="firework" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {transcribedText && (
                <div className="text-center mt-4">
                  {feedback.includes("Correct") || feedback.includes("صحيح") ? (
                    <div className="centered-btn-container">
                      <button
                        className="btn btn-success custom-btn"
                        onClick={handleNewWord}
                      >
                        <span>{language === "french" ? "Nouveau mot" : "كلمة جديدة"}</span>
                        <i className="bi bi-arrow-right-circle"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-warning custom-btn"
                        onClick={handleRetry}
                      >
                        <span>{language === "french" ? "Réessayer" : "إعادة المحاولة"}</span>
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                      <button
                        className="btn btn-success custom-btn"
                        onClick={handleNewWord}
                      >
                        <span>{language === "french" ? "Nouveau mot" : "كلمة جديدة"}</span>
                        <i className="bi bi-arrow-right-circle"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Homepage Design
            <div className="text-center">
              <h1
                className="mb-4"
                style={{
                  color: "#FF6B6B",
                  fontWeight: "700",
                  textShadow: "2px 2px 5px rgba(255, 100, 100, 0.5)",
                }}
              >
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
        <audio ref={audioRef} src={audioURL} />
      </div>
    </div>
  );
};

export default SpeechToTextApp;
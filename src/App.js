import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Functionalities from './Components/Fonctionnalités';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Spinner from './Components/Spinner';
import About from './Components/About';
import ImageToText from './Components/ImageToText';
import SpeechToText from './Components/SpeechToText';
import Quiz from './Components/Quiz';

function App() {
  return (
    <div className="App">
      <Router>
        <Spinner>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fonctionnalités" element={<Functionalities />} />
            <Route path="/À_propos" element={<About />} />
            <Route path="/fonctionnalités/image-to-text" element={<ImageToText />} />
            <Route path="/fonctionnalités/speech-to-text" element={<SpeechToText />} />
            <Route path="/fonctionnalités/quiz" element={<Quiz />} />
          </Routes>
          <Footer />
        </Spinner>
      </Router>
    </div>
  );
}

export default App;

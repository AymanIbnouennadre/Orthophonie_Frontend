import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Functionalities from './Components/Fonctionnalités';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Spinner from './Components/Spinner';
import About from './Components/About';
import ImageToText from './Components/ImageToText';

function App() {
  return (
    <div className="App">
      <Router>
        <Spinner>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/functionalities" element={<Functionalities />} />
            <Route path="/A_propos_de_nous" element={<About />} />
            <Route path="/image-to-text" element={<ImageToText />} />
          </Routes>
          <Footer />
        </Spinner>
      </Router>
    </div>
  );
}

export default App;

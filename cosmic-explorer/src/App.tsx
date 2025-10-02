import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import APODPage from './pages/APODPage';
import MarsRoverPage from './pages/MarsRoverPage';
import AsteroidsPage from './pages/AsteroidsPage';
import DONKIPage from './pages/DONKIPage';
import ExoplanetsPage from './pages/ExoplanetsPage';
import NASALibraryPage from './pages/NASALibraryPage';
import EPICPage from './pages/EPICPage';
import LoadingSpinner from './components/LoadingSpinner';
import TestComponent from './TestComponent';
import CacheStatus from './components/CacheStatus';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestComponent />} />
            <Route path="/apod" element={<APODPage />} />
            <Route path="/mars-rover" element={<MarsRoverPage />} />
            <Route path="/asteroids" element={<AsteroidsPage />} />
            <Route path="/donki" element={<DONKIPage />} />
            <Route path="/exoplanets" element={<ExoplanetsPage />} />
            <Route path="/nasa-library" element={<NASALibraryPage />} />
            <Route path="/epic" element={<EPICPage />} />
          </Routes>
        </motion.main>
        
        {/* Cache Status Component */}
        <CacheStatus />
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import APODPage from './pages/APODPage';
import MarsRoverPage from './pages/MarsRoverPage';
import AsteroidsPage from './pages/AsteroidsPage';
import DONKIPage from './pages/DONKIPage';
import ExoplanetsPage from './pages/ExoplanetsPage';
import NASALibraryPage from './pages/NASALibraryPage';
import EPICPage from './pages/EPICPage';
import LoadingSpinner from './components/LoadingSpinner';
import CacheStatus from './components/CacheStatus';

const AppContent: React.FC = () => {
  const { isCollapsed, isMobile } = useSidebar();
  
  const getMainMargin = () => {
    if (isMobile) return '0px';
    return isCollapsed ? '80px' : '320px';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: getMainMargin() }}
      >
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apod" element={<APODPage />} />
            <Route path="/mars-rover" element={<MarsRoverPage />} />
            <Route path="/asteroids" element={<AsteroidsPage />} />
            <Route path="/donki" element={<DONKIPage />} />
            <Route path="/exoplanets" element={<ExoplanetsPage />} />
            <Route path="/nasa-library" element={<NASALibraryPage />} />
            <Route path="/epic" element={<EPICPage />} />
          </Routes>
        </div>
      </motion.main>
      
      {/* Cache Status Component */}
      <CacheStatus />
    </div>
  );
};

function App() {
  return (
    <Router>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </Router>
  );
}

export default App;
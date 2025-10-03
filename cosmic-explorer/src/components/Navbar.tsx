import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRocket, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaImage, 
  FaRobot, 
  FaMeteor, 
  FaSun, 
  FaGlobe, 
  FaSearch, 
  FaSatellite,
  FaChevronDown
} from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/apod', label: 'APOD', icon: FaImage },
    { path: '/mars-rover', label: 'Mars Rover', icon: FaRobot },
    { path: '/asteroids', label: 'Asteroids', icon: FaMeteor },
    { path: '/donki', label: 'Space Weather', icon: FaSun },
    { path: '/exoplanets', label: 'Exoplanets', icon: FaGlobe },
    { path: '/nasa-library', label: 'NASA Library', icon: FaSearch },
    { path: '/epic', label: 'EPIC', icon: FaSatellite },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl shadow-slate-900/20' 
          : 'bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <motion.div
              whileHover={{ 
                rotate: 360,
                scale: 1.1
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-all duration-300">
                <FaRocket className="text-white text-lg" />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl"
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.span 
              className="text-2xl font-orbitron font-bold bg-gradient-to-r from-white via-red-100 to-blue-100 bg-clip-text text-transparent group-hover:from-red-400 group-hover:via-white group-hover:to-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Cosmic Explorer
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {/* Background for active state */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-xl border border-red-500/30"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                      
                      <Icon className={`text-sm relative z-10 transition-all duration-300 ${
                        isActive ? 'text-red-400' : 'group-hover:text-red-400'
                      }`} />
                      <span className="relative z-10">{item.label}</span>
                      
                      {/* Glow effect for active */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur-sm"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-700/50"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-slate-800/90 backdrop-blur-xl border-t border-slate-700/50"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center space-x-3 group ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 text-red-400 border border-red-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className={`text-lg transition-all duration-300 ${
                        isActive ? 'text-red-400' : 'group-hover:text-red-400'
                      }`} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-red-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

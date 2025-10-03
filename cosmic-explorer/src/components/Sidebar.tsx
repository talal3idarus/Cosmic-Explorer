import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../contexts/SidebarContext';
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
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { isCollapsed, isMobile, toggleCollapse } = useSidebar();
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

  // Handle mobile behavior
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = (e?: React.MouseEvent) => {
    // Prevent navigation when clicking the logo
    if (e) {
      e.preventDefault();
    }
    
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      toggleCollapse();
    }
  };

  const getSidebarWidth = () => {
    if (isMobile) return isOpen ? 320 : 0;
    if (isCollapsed) return 80;
    return 320;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ 
          x: isOpen ? 0 : -300,
          width: getSidebarWidth()
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl shadow-slate-900/20 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: getSidebarWidth() }}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between px-6'} py-6 border-b border-slate-700/50`}>
          <motion.button
            onClick={toggleSidebar}
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            title={isMobile ? 'Toggle menu' : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          >
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
              
              {/* Expand indicator when collapsed */}
              {!isMobile && isCollapsed && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                >
                  <FaExpand size={8} className="text-slate-300" />
                </motion.div>
              )}
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-orbitron font-bold bg-gradient-to-r from-white via-red-100 to-blue-100 bg-clip-text text-transparent group-hover:from-red-400 group-hover:via-white group-hover:to-blue-400 transition-all duration-300 whitespace-nowrap"
                >
                  Cosmic Explorer
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Toggle indicator - only show on desktop when not collapsed */}
            {!isMobile && !isCollapsed && (
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <FaCompress size={12} className="text-slate-400" />
              </motion.div>
            )}
          </motion.button>

          {/* Mobile close button - only show on mobile */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
            >
              <FaTimes size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
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
                  className={`group relative flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'space-x-3 px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 border border-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-purple-500 to-blue-500 rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon */}
                  <Icon className={`text-lg transition-all duration-300 ${
                    isActive ? 'text-red-400' : 'group-hover:text-red-400'
                  }`} />
                  
                  {/* Label */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active dot */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      className="w-2 h-2 bg-red-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 border-t border-slate-700/50"
            >
              <div className="text-xs text-slate-400 text-center">
                <p>Powered by NASA APIs</p>
                <p className="mt-1">Exploring the cosmos together</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 shadow-lg"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </motion.div>
      </motion.button>

    </>
  );
};

export default Sidebar;

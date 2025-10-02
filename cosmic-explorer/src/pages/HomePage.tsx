import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaImage, 
  FaRobot, 
  FaMeteor, 
  FaSun, 
  FaGlobe, 
  FaSearch, 
  FaSatellite,
  FaArrowRight,
  FaCalendarAlt,
  FaThermometerHalf,
  FaEye
} from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { APODData, MarsRoverPhoto, ExoplanetData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [marsPhotos, setMarsPhotos] = useState<MarsRoverPhoto[]>([]);
  const [exoplanets, setExoplanets] = useState<ExoplanetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [apod, marsData, exoplanetData] = await Promise.all([
          nasaApi.getAPOD(),
          nasaApi.getMarsRoverPhotos('perseverance', undefined, undefined, undefined, 1),
          nasaApi.getExoplanets()
        ]);
        
        setApodData(apod);
        setMarsPhotos(marsData.photos.slice(0, 3));
        setExoplanets(exoplanetData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const features = [
    {
      title: 'Astronomy Picture of the Day',
      description: 'Discover the cosmos with NASA\'s daily astronomical images',
      icon: FaImage,
      path: '/apod',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore the Red Planet through rover cameras',
      icon: FaRobot,
      path: '/mars-rover',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Near-Earth Objects',
      description: 'Track asteroids and comets near Earth',
      icon: FaMeteor,
      path: '/asteroids',
      color: 'from-yellow-500 to-red-500'
    },
    {
      title: 'Space Weather',
      description: 'Monitor solar activity and space weather events',
      icon: FaSun,
      path: '/donki',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Exoplanets',
      description: 'Discover worlds beyond our solar system',
      icon: FaGlobe,
      path: '/exoplanets',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'NASA Library',
      description: 'Search through NASA\'s vast image and video collection',
      icon: FaSearch,
      path: '/nasa-library',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'EPIC Earth Images',
      description: 'View Earth from space with daily satellite images',
      icon: FaSatellite,
      path: '/epic',
      color: 'from-green-500 to-blue-500'
    }
  ];

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Initializing cosmic dashboard..." />
      </div>
    );
  }

  return (
        <div className="pt-20 min-h-screen bg-slate-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaRocket className="text-3xl text-white" />
            </div>
          </motion.div>
          
          <h1 className="section-title">
            <span className="cosmic-text">Cosmic Explorer</span>
          </h1>
          
          <p className="section-subtitle">
            Journey through NASA's universe of data and discover the wonders of space. 
            Track celestial events, explore Mars, and witness the cosmos like never before.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/apod"
              className="cosmic-button flex items-center space-x-2 group"
            >
              <span>Start Exploring</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Today's Cosmic Highlights
            </h2>
            <p className="section-subtitle">
              Discover the latest discoveries and stunning imagery from NASA's space missions
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* APOD Card */}
            {apodData && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="feature-card group animate-fadeInUp"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FaImage className="text-xl text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Astronomy Picture of the Day</h3>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h4 className="text-lg font-semibold mb-2 text-slate-900">{apodData.title}</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {apodData.explanation}
                </p>
                
                <Link
                  to="/apod"
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
                >
                  View Full Image
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}

            {/* Mars Photos Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="feature-card animate-fadeInUp"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FaRobot className="text-xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Latest Mars Photos</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {marsPhotos.map((photo, index) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={photo.img_src}
                      alt={`Mars photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              
              <p className="text-slate-600 text-sm mb-4">
                Recent images from Mars rovers exploring the Red Planet
              </p>
              
              <Link
                to="/mars-rover"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
              >
                Explore Mars Gallery
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Exoplanets Card */}
          {exoplanets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="feature-card mb-16 animate-fadeInUp"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaGlobe className="text-xl text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Recent Exoplanet Discoveries</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exoplanets.map((planet, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2">{planet.pl_name}</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>Host: {planet.hostname}</p>
                      <p>Discovery: {planet.disc_year}</p>
                      <p>Method: {planet.discoverymethod}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link
                  to="/exoplanets"
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
                >
                  Discover More Exoplanets
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Explore the Universe
            </h2>
            <p className="section-subtitle">
              Dive deep into NASA's vast collection of space data and imagery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="feature-card group animate-fadeInUp"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
                  
                  <Link
                    to={feature.path}
                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group"
                  >
                    Explore
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

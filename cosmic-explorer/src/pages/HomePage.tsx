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
  FaEye,
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaShieldAlt,
  FaRocket as FaRocketIcon,
  FaStar,
  FaNewspaper,
  FaExternalLinkAlt,
  FaPlay,
  FaDownload
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
      color: 'from-blue-500 to-cyan-500',
      category: 'Imagery'
    },
    {
      title: 'Mars Rover Photos',
      description: 'Explore the Red Planet through rover cameras',
      icon: FaRobot,
      path: '/mars-rover',
      color: 'from-red-500 to-orange-500',
      category: 'Exploration'
    },
    {
      title: 'Near-Earth Objects',
      description: 'Track asteroids and comets near Earth',
      icon: FaMeteor,
      path: '/asteroids',
      color: 'from-yellow-500 to-red-500',
      category: 'Monitoring'
    },
    {
      title: 'Space Weather',
      description: 'Monitor solar activity and space weather events',
      icon: FaSun,
      path: '/donki',
      color: 'from-yellow-400 to-orange-500',
      category: 'Science'
    },
    {
      title: 'Exoplanets',
      description: 'Discover worlds beyond our solar system',
      icon: FaGlobe,
      path: '/exoplanets',
      color: 'from-purple-500 to-pink-500',
      category: 'Research'
    },
    {
      title: 'NASA Library',
      description: 'Search through NASA\'s vast image and video collection',
      icon: FaSearch,
      path: '/nasa-library',
      color: 'from-indigo-500 to-purple-500',
      category: 'Archive'
    },
    {
      title: 'EPIC Earth Images',
      description: 'View Earth from space with daily satellite images',
      icon: FaSatellite,
      path: '/epic',
      color: 'from-green-500 to-blue-500',
      category: 'Earth Science'
    }
  ];

  const stats = [
    { label: 'NASA APIs', value: '7+', icon: FaDatabase },
    { label: 'Data Sources', value: '50+', icon: FaChartLine },
    { label: 'Daily Updates', value: '24/7', icon: FaCalendarAlt },
    { label: 'Users', value: '10K+', icon: FaUsers }
  ];

  const newsItems = [
    {
      title: 'Latest Mars Discovery',
      description: 'Perseverance rover finds evidence of ancient water activity',
      date: '2024-01-15',
      category: 'Mars Exploration'
    },
    {
      title: 'New Exoplanet Found',
      description: 'TESS discovers potentially habitable world 100 light-years away',
      date: '2024-01-12',
      category: 'Exoplanets'
    },
    {
      title: 'Solar Storm Alert',
      description: 'Strong solar activity detected, potential aurora visible',
      date: '2024-01-10',
      category: 'Space Weather'
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
    <div className="pt-20 min-h-screen bg-slate-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/25">
                <FaRocket className="text-4xl text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-orbitron font-bold mb-6"
            >
              <span className="cosmic-text">Cosmic Explorer</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Journey through NASA's universe of data and discover the wonders of space. 
              Track celestial events, explore Mars, and witness the cosmos like never before.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link
                to="/apod"
                className="cosmic-button flex items-center space-x-3 group text-lg px-8 py-4"
              >
                <span>Start Exploring</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20 flex items-center space-x-3">
                <FaPlay className="text-sm" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Platform Statistics
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Real-time data from NASA's extensive space exploration programs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-white text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Featured Content Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Today's Cosmic Highlights
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
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
                  <h3 className="text-xl font-semibold text-white">Astronomy Picture of the Day</h3>
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h4 className="text-lg font-semibold mb-2 text-white">{apodData.title}</h4>
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
                <h3 className="text-xl font-semibold text-white">Latest Mars Photos</h3>
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
                <h3 className="text-xl font-semibold text-white">Recent Exoplanet Discoveries</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exoplanets.map((planet, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                    <h4 className="font-semibold text-white mb-2">{planet.pl_name}</h4>
                    <div className="space-y-1 text-sm text-slate-300">
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
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore the Universe
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Dive deep into NASA's vast collection of space data and imagery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link to={feature.path}>
                    <div className="glass-card p-6 h-full group-hover:scale-105 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="text-white text-2xl" />
                        </div>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs rounded-full">
                          {feature.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300 font-medium text-sm">
                        <span>Explore</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* News Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest Space News
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Stay updated with the latest discoveries and developments in space exploration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <motion.div
                key={news.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                    {news.category}
                  </span>
                  <span className="text-slate-400 text-sm">{news.date}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {news.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {news.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaRocket className="text-2xl text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore the Cosmos?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of space enthusiasts discovering the wonders of the universe through NASA's data.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/apod"
                className="cosmic-button flex items-center space-x-3 text-lg px-8 py-4"
              >
                <span>Start Exploring</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20 flex items-center space-x-3">
                <FaDownload className="text-sm" />
                <span>Download App</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

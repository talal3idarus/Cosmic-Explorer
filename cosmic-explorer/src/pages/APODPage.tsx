import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaDownload, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { APODData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const APODPage: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    fetchAPOD();
  }, []);

  const fetchAPOD = async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      setIsImageLoading(true);
      
      const data = await nasaApi.getAPOD(date);
      setApodData(data);
    } catch (err) {
      setError('Failed to fetch APOD data. Please try again.');
      console.error('APOD Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleDateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate) {
      fetchAPOD(selectedDate);
    }
  };

  const getPreviousDate = () => {
    if (apodData) {
      const currentDate = new Date(apodData.date);
      const previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const dateString = previousDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
      fetchAPOD(dateString);
    }
  };

  const getNextDate = () => {
    if (apodData) {
      const currentDate = new Date(apodData.date);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const dateString = nextDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
      fetchAPOD(dateString);
    }
  };

  const getTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchAPOD(today);
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Fetching cosmic image..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => fetchAPOD()}
              className="cosmic-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!apodData) {
    return (
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-gray-300">No data available</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold mb-4 cosmic-text">
            Astronomy Picture of the Day
          </h1>
          <p className="text-xl text-gray-300">
            Discover the cosmos with NASA's daily astronomical images
          </p>
        </motion.div>

        {/* Date Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={getPreviousDate}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Previous day"
              >
                <FaChevronLeft className="text-blue-400" />
              </button>
              
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-blue-400" />
                <span className="text-lg font-semibold">
                  {new Date(apodData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <button
                onClick={getNextDate}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Next day"
              >
                <FaChevronRight className="text-blue-400" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <form onSubmit={handleDateSubmit} className="flex items-center space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="cosmic-input"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Go
                </button>
              </form>
              
              <button
                onClick={getTodayDate}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">{apodData.title}</h2>
          
          {/* Image */}
          <div className="relative mb-6">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-space-900/50 rounded-lg">
                <LoadingSpinner size="lg" text="Loading image..." />
              </div>
            )}
            
            <div className="aspect-video rounded-lg overflow-hidden bg-space-900">
              {apodData.media_type === 'image' ? (
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  className="w-full h-full object-contain"
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              ) : (
                <iframe
                  src={apodData.url}
                  className="w-full h-full"
                  title={apodData.title}
                  onLoad={() => setIsImageLoading(false)}
                />
              )}
            </div>
            
            {/* Image Actions */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {apodData.hdurl && (
                <a
                  href={apodData.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                  title="View HD version"
                >
                  <FaExternalLinkAlt className="text-white" />
                </a>
              )}
              
              <a
                href={apodData.url}
                download
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                title="Download image"
              >
                <FaDownload className="text-white" />
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed text-lg">
              {apodData.explanation}
            </p>
          </div>

          {/* Copyright */}
          {apodData.copyright && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <strong>Copyright:</strong> {apodData.copyright}
              </p>
            </div>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card p-4 text-center">
            <h3 className="font-semibold text-blue-400 mb-2">Date</h3>
            <p className="text-gray-300">{apodData.date}</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <h3 className="font-semibold text-purple-400 mb-2">Media Type</h3>
            <p className="text-gray-300 capitalize">{apodData.media_type}</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <h3 className="font-semibold text-green-400 mb-2">Service Version</h3>
            <p className="text-gray-300">{apodData.service_version}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default APODPage;

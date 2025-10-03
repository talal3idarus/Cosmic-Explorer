import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSatellite, 
  FaCalendarAlt, 
  FaDownload, 
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
  FaEye,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { EPICData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const EPICPage: React.FC = () => {
  const [epicData, setEpicData] = useState<EPICData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<EPICData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load today's images by default
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    fetchEPICImages(todayString);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEPICImages(selectedDate);
    }
  }, [selectedDate]);

  const fetchEPICImages = async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🛰️ Fetching EPIC images for date:', date || 'latest');
      const data = await nasaApi.getEPICImages(date);
      
      if (data && data.length > 0) {
        setEpicData(data);
        setCurrentIndex(0);
        console.log('✅ EPIC images loaded successfully:', data.length, 'images');
      } else {
        // If no data for specific date, try to load recent images
        if (date) {
          console.log('🔄 No data for selected date, trying recent images...');
          const recentData = await nasaApi.getEPICImages();
          if (recentData && recentData.length > 0) {
            setEpicData(recentData);
            setCurrentIndex(0);
            setError('No images for selected date, showing recent images instead.');
            console.log('✅ Recent EPIC images loaded:', recentData.length, 'images');
          } else {
            setError('No EPIC images available. The EPIC API may be temporarily unavailable. Please try again later.');
            setEpicData([]);
          }
        } else {
          setError('No EPIC images available. The EPIC API may be temporarily unavailable. Please try again later.');
          setEpicData([]);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching EPIC images:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to fetch EPIC images: ${errorMessage}. The EPIC API may be temporarily unavailable. Please try again later.`);
      setEpicData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const getTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const getPreviousDate = () => {
    if (epicData.length > 0) {
      const currentImageDate = new Date(epicData[0].date);
      const previousDate = new Date(currentImageDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const dateString = previousDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
    }
  };

  const getNextDate = () => {
    if (epicData.length > 0) {
      const currentImageDate = new Date(epicData[0].date);
      const nextDate = new Date(currentImageDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const dateString = nextDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
    }
  };

  const nextImage = () => {
    if (currentIndex < epicData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getImageUrl = (image: EPICData) => {
    const date = new Date(image.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image.image}.png`;
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Capturing Earth from space..." />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold mb-4 cosmic-text">
            EPIC Earth Images
          </h1>
          <p className="text-xl text-gray-300">
            Daily views of Earth from the DSCOVR satellite
          </p>
        </motion.div>

        {/* Date Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaCalendarAlt className="text-blue-400 mr-3" />
            Select Date
          </h2>
          
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
                <FaSatellite className="text-blue-400" />
                <span className="text-lg font-semibold">
                  {epicData.length > 0 ? formatDate(epicData[0].date) : 'Select a date'}
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
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="cosmic-input"
              />
              
              <button
                onClick={getTodayDate}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 mb-8 border-red-500/50"
          >
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchEPICImages(selectedDate)}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <FaSatellite className="mr-2" />
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Image Display */}
        {epicData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Current Image */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  Earth Image {currentIndex + 1} of {epicData.length}
                </h2>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={previousImage}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous image"
                  >
                    <FaChevronLeft className="text-blue-400" />
                  </button>
                  
                  <span className="text-gray-300">
                    {currentIndex + 1} / {epicData.length}
                  </span>
                  
                  <button
                    onClick={nextImage}
                    disabled={currentIndex === epicData.length - 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next image"
                  >
                    <FaChevronRight className="text-blue-400" />
                  </button>
                </div>
              </div>
              
              <div className="aspect-video rounded-lg overflow-hidden bg-space-900 mb-6">
                <img
                  src={getImageUrl(epicData[currentIndex])}
                  alt={`Earth from space - ${epicData[currentIndex].date}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-400 mb-2">Date</h3>
                  <p className="text-gray-300">{formatDate(epicData[currentIndex].date)}</p>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-purple-400 mb-2">Time</h3>
                  <p className="text-gray-300">{formatTime(epicData[currentIndex].date)}</p>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-green-400 mb-2">Identifier</h3>
                  <p className="text-gray-300 font-mono text-sm">{epicData[currentIndex].identifier}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <a
                  href={getImageUrl(epicData[currentIndex])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaExternalLinkAlt />
                  <span>View Full Size</span>
                </a>
                
                <a
                  href={getImageUrl(epicData[currentIndex])}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FaDownload />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Image Thumbnails */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">All Images for {formatDate(epicData[0].date)}</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {epicData.map((image, index) => (
                  <motion.div
                    key={image.identifier}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      index === currentIndex 
                        ? 'ring-2 ring-blue-500 scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Earth thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      {formatTime(image.date)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image Details */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Image Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Image Details</h4>
                  <div className="space-y-2">
                    <p><strong>Identifier:</strong> {epicData[currentIndex].identifier}</p>
                    <p><strong>Version:</strong> {epicData[currentIndex].version}</p>
                    <p><strong>Caption:</strong> {epicData[currentIndex].caption}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Coordinates</h4>
                  <div className="space-y-2">
                    <p><strong>Latitude:</strong> {epicData[currentIndex].coords.lat.toFixed(4)}°</p>
                    <p><strong>Longitude:</strong> {epicData[currentIndex].coords.lon.toFixed(4)}°</p>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-green-400" />
                      <span className="text-sm text-gray-300">
                        {epicData[currentIndex].coords.lat > 0 ? 'North' : 'South'} 
                        {Math.abs(epicData[currentIndex].coords.lat).toFixed(2)}°, 
                        {epicData[currentIndex].coords.lon > 0 ? 'East' : 'West'} 
                        {Math.abs(epicData[currentIndex].coords.lon).toFixed(2)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaSatellite className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Images Found</h3>
            <p className="text-gray-400">No EPIC images available for the selected date. Try selecting a different date.</p>
          </motion.div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-6xl max-h-[90vh] glass-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">Earth from Space</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video rounded-lg overflow-hidden bg-space-900 mb-6">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={`Earth from space - ${selectedImage.date}`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <a
                  href={getImageUrl(selectedImage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaExternalLinkAlt />
                  <span>View Full Size</span>
                </a>
                
                <a
                  href={getImageUrl(selectedImage)}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FaDownload />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EPICPage;

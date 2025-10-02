import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot, 
  FaCalendarAlt, 
  FaCamera, 
  FaFilter, 
  FaSearch, 
  FaDownload, 
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { MarsRoverPhoto } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const MarsRoverPage: React.FC = () => {
  const [photos, setPhotos] = useState<MarsRoverPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRover, setSelectedRover] = useState<'curiosity' | 'opportunity' | 'spirit' | 'perseverance'>('perseverance');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSol, setSelectedSol] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<MarsRoverPhoto | null>(null);

  const rovers = [
    { value: 'curiosity', label: 'Curiosity', launch: '2011', landing: '2012' },
    { value: 'opportunity', label: 'Opportunity', launch: '2003', landing: '2004' },
    { value: 'spirit', label: 'Spirit', launch: '2003', landing: '2004' },
    { value: 'perseverance', label: 'Perseverance', launch: '2020', landing: '2021' }
  ];

  const cameras = {
    curiosity: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'MAST', label: 'Mast Camera' },
      { value: 'CHEMCAM', label: 'Chemistry and Camera Complex' },
      { value: 'MAHLI', label: 'Mars Hand Lens Imager' },
      { value: 'MARDI', label: 'Mars Descent Imager' },
      { value: 'NAVCAM', label: 'Navigation Camera' }
    ],
    opportunity: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'NAVCAM', label: 'Navigation Camera' },
      { value: 'PANCAM', label: 'Panoramic Camera' },
      { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer' }
    ],
    spirit: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'NAVCAM', label: 'Navigation Camera' },
      { value: 'PANCAM', label: 'Panoramic Camera' },
      { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer' }
    ],
    perseverance: [
      { value: 'EDL_RUCAM', label: 'Rover Up-Look Camera' },
      { value: 'EDL_RDCAM', label: 'Rover Down-Look Camera' },
      { value: 'EDL_DDCAM', label: 'Descent Stage Down-Look Camera' },
      { value: 'EDL_PUCAM1', label: 'Parachute Up-Look Camera A' },
      { value: 'EDL_PUCAM2', label: 'Parachute Up-Look Camera B' },
      { value: 'NAVCAM_LEFT', label: 'Navigation Camera - Left' },
      { value: 'NAVCAM_RIGHT', label: 'Navigation Camera - Right' },
      { value: 'MCAM_LEFT', label: 'Mast Camera Z - Left' },
      { value: 'MCAM_RIGHT', label: 'Mast Camera Z - Right' },
      { value: 'FRONT_HAZCAM_LEFT_A', label: 'Front Hazard Camera - Left' },
      { value: 'FRONT_HAZCAM_RIGHT_A', label: 'Front Hazard Camera - Right' },
      { value: 'REAR_HAZCAM_LEFT', label: 'Rear Hazard Camera - Left' },
      { value: 'REAR_HAZCAM_RIGHT', label: 'Rear Hazard Camera - Right' }
    ]
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedRover, selectedCamera, selectedDate, selectedSol, currentPage]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nasaApi.getMarsRoverPhotos(
        selectedRover,
        selectedSol ? parseInt(selectedSol) : undefined,
        selectedDate || undefined,
        selectedCamera || undefined,
        currentPage
      );
      
      setPhotos(data.photos);
      // Note: The API doesn't return total pages, so we'll estimate based on results
      setTotalPages(data.photos.length === 25 ? currentPage + 1 : currentPage);
    } catch (err) {
      setError('Failed to fetch Mars rover photos. Please try again.');
      console.error('Mars Rover Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoverChange = (rover: typeof selectedRover) => {
    setSelectedRover(rover);
    setSelectedCamera('');
    setCurrentPage(1);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPhotos();
  };

  const clearFilters = () => {
    setSelectedCamera('');
    setSelectedDate('');
    setSelectedSol('');
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading && photos.length === 0) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Exploring Mars surface..." />
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
            Mars Rover Photos
          </h1>
          <p className="text-xl text-gray-300">
            Explore the Red Planet through the eyes of NASA's Mars rovers
          </p>
        </motion.div>

        {/* Rover Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaRobot className="text-red-400 mr-3" />
            Select Rover
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rovers.map((rover) => (
              <button
                key={rover.value}
                onClick={() => handleRoverChange(rover.value as typeof selectedRover)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedRover === rover.value
                    ? 'border-red-500 bg-red-500/10 cosmic-glow'
                    : 'border-white/20 hover:border-red-400/50 hover:bg-red-500/5'
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{rover.label}</h3>
                <p className="text-sm text-gray-400">Launch: {rover.launch}</p>
                <p className="text-sm text-gray-400">Landing: {rover.landing}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaFilter className="text-blue-400 mr-3" />
            Filters
          </h2>
          
          <form onSubmit={handleFilterSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Camera Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="cosmic-input w-full"
                >
                  <option value="">All Cameras</option>
                  {cameras[selectedRover].map((camera) => (
                    <option key={camera.value} value={camera.value}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Earth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Earth Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="cosmic-input w-full"
                />
              </div>

              {/* Sol */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sol (Mars Day)
                </label>
                <input
                  type="number"
                  value={selectedSol}
                  onChange={(e) => setSelectedSol(e.target.value)}
                  placeholder="Enter sol number"
                  className="cosmic-input w-full"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="cosmic-button flex items-center space-x-2"
              >
                <FaSearch />
                <span>Search Photos</span>
              </button>
              
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6 mb-8 border-red-500/50"
          >
            <p className="text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        {/* Photos Grid */}
        {photos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Photos ({photos.length} found)
              </h2>
              
              {/* Pagination */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft />
                </button>
                
                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-4 group hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-space-900">
                    <img
                      src={photo.img_src}
                      alt={`Mars photo ${photo.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Sol {photo.sol}</h3>
                    <p className="text-xs text-gray-400">{photo.camera.full_name}</p>
                    <p className="text-xs text-gray-500">{photo.earth_date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaCamera className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Photos Found</h3>
            <p className="text-gray-400">Try adjusting your filters or selecting a different rover.</p>
          </motion.div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl max-h-[90vh] glass-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Mars Photo Details</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-video rounded-lg overflow-hidden bg-space-900">
                  <img
                    src={selectedPhoto.img_src}
                    alt={`Mars photo ${selectedPhoto.id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Rover Information</h4>
                    <p><strong>Rover:</strong> {selectedPhoto.rover.name}</p>
                    <p><strong>Status:</strong> {selectedPhoto.rover.status}</p>
                    <p><strong>Launch Date:</strong> {selectedPhoto.rover.launch_date}</p>
                    <p><strong>Landing Date:</strong> {selectedPhoto.rover.landing_date}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">Photo Details</h4>
                    <p><strong>Sol:</strong> {selectedPhoto.sol}</p>
                    <p><strong>Earth Date:</strong> {selectedPhoto.earth_date}</p>
                    <p><strong>Camera:</strong> {selectedPhoto.camera.full_name}</p>
                    <p><strong>Photo ID:</strong> {selectedPhoto.id}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <a
                      href={selectedPhoto.img_src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FaExternalLinkAlt />
                      <span>View Full Size</span>
                    </a>
                    
                    <a
                      href={selectedPhoto.img_src}
                      download
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarsRoverPage;

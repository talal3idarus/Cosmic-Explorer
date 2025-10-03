import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSun, 
  FaExclamationTriangle, 
  FaCalendarAlt, 
  FaRocket, 
  FaGlobe,
  FaSearch,
  FaFilter,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { DONKIData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const DONKIPage: React.FC = () => {
  const [donkiData, setDonkiData] = useState<DONKIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('FLR');
  const [selectedEvent, setSelectedEvent] = useState<DONKIData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const eventTypes = [
    { 
      value: 'FLR', 
      label: 'Solar Flares', 
      description: 'Solar flare events and eruptions',
      category: 'Solar Activity',
      icon: '☀️',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    { 
      value: 'CME', 
      label: 'Coronal Mass Ejections', 
      description: 'Massive plasma ejections from the Sun',
      category: 'Solar Activity',
      icon: '💥',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    { 
      value: 'GST', 
      label: 'Geomagnetic Storms', 
      description: 'Disturbances in Earth\'s magnetic field',
      category: 'Geomagnetic',
      icon: '⚡',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    { 
      value: 'RBE', 
      label: 'Radiation Belt Enhancements', 
      description: 'Increased radiation in Earth\'s belts',
      category: 'Radiation',
      icon: '🔋',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    { 
      value: 'SEP', 
      label: 'Solar Energetic Particles', 
      description: 'High-energy particles from the Sun',
      category: 'Radiation',
      icon: '⚛️',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    { 
      value: 'MPC', 
      label: 'Magnetopause Crossings', 
      description: 'Boundary crossings of Earth\'s magnetosphere',
      category: 'Geomagnetic',
      icon: '🌍',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  ];

  // Group event types by category
  const eventCategories = eventTypes.reduce((acc, eventType) => {
    if (!acc[eventType.category]) {
      acc[eventType.category] = [];
    }
    acc[eventType.category].push(eventType);
    return acc;
  }, {} as { [key: string]: typeof eventTypes });

  useEffect(() => {
    fetchDONKIData();
    setCurrentPage(1); // Reset to first page when event type changes
  }, [selectedEventType]);

  const fetchDONKIData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nasaApi.getDONKI(selectedEventType);
      setDonkiData(data);
    } catch (err) {
      setError('Failed to fetch space weather data. Please try again.');
      console.error('DONKI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeInfo = (eventType: string) => {
    return eventTypes.find(et => et.value === eventType) || {
      color: 'text-gray-400',
      icon: '🌌',
      label: 'Unknown Event',
      category: 'Unknown'
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityLevel = (eventType: string, classType?: string) => {
    if (eventType === 'FLR') {
      if (classType?.includes('X')) return { level: 'High', color: 'text-red-400' };
      if (classType?.includes('M')) return { level: 'Medium', color: 'text-orange-400' };
      if (classType?.includes('C')) return { level: 'Low', color: 'text-yellow-400' };
    }
    return { level: 'Unknown', color: 'text-gray-400' };
  };

  // Pagination logic
  const totalPages = Math.ceil(donkiData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = donkiData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Monitoring space weather..." />
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
            Space Weather Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Monitor solar activity and space weather events
          </p>
        </motion.div>

        {/* Event Type Selector - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-4 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaFilter className="text-blue-400 mr-2" />
            Event Type
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {eventTypes.map((eventType) => (
              <motion.button
                key={eventType.value}
                onClick={() => setSelectedEventType(eventType.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg border transition-all duration-300 text-center group ${
                  selectedEventType === eventType.value
                    ? `${eventType.borderColor} ${eventType.bgColor}`
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }`}
                title={eventType.description}
              >
                <div className="text-xl mb-1">{eventType.icon}</div>
                <div className={`text-xs font-medium ${eventType.color}`}>
                  {eventType.label}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Statistics - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="glass-card p-4 text-center">
            <FaSun className="text-2xl text-yellow-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">{donkiData.length}</h3>
            <p className="text-sm text-gray-400">Total Events</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <FaExclamationTriangle className="text-2xl text-red-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">
              {donkiData.filter(event => event.classType?.includes('X')).length}
            </h3>
            <p className="text-sm text-gray-400">High Intensity</p>
          </div>
          
          <div className="glass-card p-4 text-center">
            <FaGlobe className="text-2xl text-blue-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">
              {donkiData.filter(event => new Date(event.beginTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className="text-sm text-gray-400">Recent (7 days)</p>
          </div>
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

        {/* Events List */}
        {donkiData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="text-xl mr-2">{getEventTypeInfo(selectedEventType).icon}</span>
                {getEventTypeInfo(selectedEventType).label} Events
              </h2>
              <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                {getEventTypeInfo(selectedEventType).category}
              </div>
            </div>
            
            {currentEvents.map((event, index) => {
              const severity = getSeverityLevel(selectedEventType, event.classType);
              const eventInfo = getEventTypeInfo(selectedEventType);
              
              return (
                <motion.div
                  key={event.flrID || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{eventInfo.icon}</span>
                        <h3 className="text-lg font-semibold">
                          {event.classType || 'Space Weather Event'}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${severity.color} bg-white/10`}>
                          {severity.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400">Begin</p>
                          <p className="font-medium">{new Date(event.beginTime).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">Peak</p>
                          <p className="font-medium">{new Date(event.peakTime).toLocaleDateString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400">End</p>
                          <p className="font-medium">{new Date(event.endTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {event.sourceLocation && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Source</p>
                          <p className="text-sm font-medium">{event.sourceLocation}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <button className="text-blue-400 hover:text-blue-300">
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 mt-8"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, donkiData.length)} of {donkiData.length} events
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current page
                        const shouldShow = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 2 && page <= currentPage + 2);
                        
                        if (!shouldShow) {
                          // Show ellipsis for gaps
                          if (page === 2 && currentPage > 4) {
                            return <span key={`ellipsis-${page}`} className="px-2 py-2 text-gray-400">...</span>;
                          }
                          if (page === totalPages - 1 && currentPage < totalPages - 3) {
                            return <span key={`ellipsis-${page}`} className="px-2 py-2 text-gray-400">...</span>;
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaSun className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Found</h3>
            <p className="text-gray-400">No space weather events found for the selected type.</p>
          </motion.div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl max-h-[90vh] glass-card p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">
                  {selectedEvent.classType || 'Space Weather Event'}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Event Information</h4>
                    <div className="space-y-2">
                      <p><strong>Event ID:</strong> {selectedEvent.flrID}</p>
                      <p><strong>Class Type:</strong> {selectedEvent.classType}</p>
                      <p><strong>Source Location:</strong> {selectedEvent.sourceLocation}</p>
                      <p><strong>Active Region:</strong> {selectedEvent.activeRegionNum}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Timeline</h4>
                    <div className="space-y-2">
                      <p><strong>Begin Time:</strong> {formatDate(selectedEvent.beginTime)}</p>
                      <p><strong>Peak Time:</strong> {formatDate(selectedEvent.peakTime)}</p>
                      <p><strong>End Time:</strong> {formatDate(selectedEvent.endTime)}</p>
                    </div>
                  </div>
                </div>
                
                {selectedEvent.instruments && selectedEvent.instruments.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-3">Instruments</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.instruments.map((instrument, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-500/20 text-green-300 rounded"
                        >
                          {instrument.displayName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEvent.linkedEvents && selectedEvent.linkedEvents.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Linked Events</h4>
                    <div className="space-y-1">
                      {selectedEvent.linkedEvents.map((linkedEvent, idx) => (
                        <p key={idx} className="text-sm text-gray-300">{linkedEvent}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEvent.link && (
                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={selectedEvent.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium"
                    >
                      <FaExternalLinkAlt />
                      <span>View Full Report</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DONKIPage;

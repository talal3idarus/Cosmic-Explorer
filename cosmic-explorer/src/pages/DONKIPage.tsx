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
  FaExternalLinkAlt
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

  const eventTypes = [
    { value: 'FLR', label: 'Solar Flares', description: 'Solar flare events' },
    { value: 'CME', label: 'Coronal Mass Ejections', description: 'CME events' },
    { value: 'GST', label: 'Geomagnetic Storms', description: 'Geomagnetic storm events' },
    { value: 'RBE', label: 'Radiation Belt Enhancements', description: 'Radiation belt events' },
    { value: 'SEP', label: 'Solar Energetic Particles', description: 'SEP events' },
    { value: 'MPC', label: 'Magnetopause Crossings', description: 'Magnetopause events' },
    { value: 'RBE', label: 'Radiation Belt Enhancements', description: 'Radiation belt events' },
    { value: 'GST', label: 'Geomagnetic Storms', description: 'Geomagnetic storm events' }
  ];

  useEffect(() => {
    fetchDONKIData();
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

  const getEventTypeColor = (eventType: string) => {
    const colors: { [key: string]: string } = {
      'FLR': 'text-red-400',
      'CME': 'text-orange-400',
      'GST': 'text-yellow-400',
      'RBE': 'text-purple-400',
      'SEP': 'text-blue-400',
      'MPC': 'text-green-400'
    };
    return colors[eventType] || 'text-gray-400';
  };

  const getEventTypeIcon = (eventType: string) => {
    const icons: { [key: string]: string } = {
      'FLR': '☀️',
      'CME': '💥',
      'GST': '⚡',
      'RBE': '🔋',
      'SEP': '⚛️',
      'MPC': '🌍'
    };
    return icons[eventType] || '🌌';
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

        {/* Event Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaFilter className="text-blue-400 mr-3" />
            Event Type
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventTypes.map((eventType) => (
              <button
                key={eventType.value}
                onClick={() => setSelectedEventType(eventType.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedEventType === eventType.value
                    ? 'border-blue-500 bg-blue-500/10 cosmic-glow'
                    : 'border-white/20 hover:border-blue-400/50 hover:bg-blue-500/5'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getEventTypeIcon(eventType.value)}</span>
                  <h3 className="font-semibold">{eventType.label}</h3>
                </div>
                <p className="text-sm text-gray-400">{eventType.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <FaSun className="text-3xl text-yellow-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{donkiData.length}</h3>
            <p className="text-gray-400">Total Events</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaExclamationTriangle className="text-3xl text-red-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {donkiData.filter(event => event.classType?.includes('X')).length}
            </h3>
            <p className="text-gray-400">High Intensity Events</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaGlobe className="text-3xl text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {donkiData.filter(event => new Date(event.beginTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </h3>
            <p className="text-gray-400">Recent Events (7 days)</p>
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
            <h2 className="text-2xl font-semibold mb-6">
              {eventTypes.find(et => et.value === selectedEventType)?.label} Events
            </h2>
            
            {donkiData.map((event, index) => {
              const severity = getSeverityLevel(selectedEventType, event.classType);
              
              return (
                <motion.div
                  key={event.flrID || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{getEventTypeIcon(selectedEventType)}</span>
                        <h3 className="text-xl font-semibold">
                          {event.classType || 'Space Weather Event'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${severity.color} bg-white/10`}>
                          {severity.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Begin Time</p>
                          <p className="font-medium">{formatDate(event.beginTime)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">Peak Time</p>
                          <p className="font-medium">{formatDate(event.peakTime)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-400">End Time</p>
                          <p className="font-medium">{formatDate(event.endTime)}</p>
                        </div>
                      </div>
                      
                      {event.sourceLocation && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400">Source Location</p>
                          <p className="font-medium">{event.sourceLocation}</p>
                        </div>
                      )}
                      
                      {event.instruments && event.instruments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400">Instruments</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {event.instruments.map((instrument, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm"
                              >
                                {instrument.displayName}
                              </span>
                            ))}
                          </div>
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

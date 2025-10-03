import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMeteor, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaRuler, 
  FaRocket, 
  FaSearch,
  FaChartLine,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { nasaApi } from '../services/nasaApi';
import type { AsteroidData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const AsteroidsPage: React.FC = () => {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);

  useEffect(() => {
    // Set default date range (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAsteroids();
      setCurrentPage(1); // Reset to first page when new data is fetched
    }
  }, [startDate, endDate]);

  const fetchAsteroids = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nasaApi.getAsteroids(startDate, endDate);
      
      // Flatten the asteroids data
      const allAsteroids: AsteroidData[] = [];
      Object.values(data.near_earth_objects).forEach(dayAsteroids => {
        allAsteroids.push(...dayAsteroids);
      });
      
      setAsteroids(allAsteroids);
    } catch (err) {
      setError('Failed to fetch asteroid data. Please try again.');
      console.error('Asteroids Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAsteroids();
  };

  const getHazardColor = (isHazardous: boolean) => {
    return isHazardous ? 'text-red-400' : 'text-green-400';
  };

  const getHazardIcon = (isHazardous: boolean) => {
    return isHazardous ? '⚠️' : '✅';
  };

  const getSizeCategory = (diameter: number) => {
    if (diameter < 0.1) return { category: 'Small', color: 'text-green-400' };
    if (diameter < 0.5) return { category: 'Medium', color: 'text-yellow-400' };
    if (diameter < 1.0) return { category: 'Large', color: 'text-orange-400' };
    return { category: 'Very Large', color: 'text-red-400' };
  };

  // Pagination logic
  const totalPages = Math.ceil(asteroids.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAsteroids = asteroids.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentPage(1);
    // Note: itemsPerPage is currently constant, but this function is ready for future enhancement
  };

  // Prepare chart data
  const chartData = asteroids.map(asteroid => ({
    name: asteroid.name,
    diameter: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
    magnitude: asteroid.absolute_magnitude_h,
    hazardous: asteroid.is_potentially_hazardous_asteroid ? 1 : 0
  }));

  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const averageSize = asteroids.length > 0 
    ? asteroids.reduce((sum, a) => sum + a.estimated_diameter.kilometers.estimated_diameter_max, 0) / asteroids.length
    : 0;

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Scanning for near-Earth objects..." />
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
            Near-Earth Objects
          </h1>
          <p className="text-xl text-gray-300">
            Track asteroids and comets approaching Earth
          </p>
        </motion.div>

        {/* Date Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaCalendarAlt className="text-yellow-400 mr-3" />
            Date Range
          </h2>
          
          <form onSubmit={handleDateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="cosmic-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="cosmic-input w-full"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="cosmic-button w-full flex items-center justify-center space-x-2"
                >
                  <FaSearch />
                  <span>Search Asteroids</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <FaMeteor className="text-3xl text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{asteroids.length}</h3>
            <p className="text-gray-400">Total Asteroids</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaExclamationTriangle className="text-3xl text-red-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{hazardousCount}</h3>
            <p className="text-gray-400">Potentially Hazardous</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaRuler className="text-3xl text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {averageSize.toFixed(2)} km
            </h3>
            <p className="text-gray-400">Average Size</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaGlobe className="text-3xl text-purple-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {((hazardousCount / asteroids.length) * 100).toFixed(1)}%
            </h3>
            <p className="text-gray-400">Hazardous Rate</p>
          </div>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="glass-card p-1">
            <div className="flex space-x-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'chart'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Chart View
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
            <p className="text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        {asteroids.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {viewMode === 'table' ? (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size (km)</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Magnitude</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Hazardous</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Next Approach</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentAsteroids.map((asteroid) => {
                        const sizeCategory = getSizeCategory(asteroid.estimated_diameter.kilometers.estimated_diameter_max);
                        const nextApproach = asteroid.close_approach_data[0];
                        
                        return (
                          <tr
                            key={asteroid.id}
                            className="hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => setSelectedAsteroid(asteroid)}
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{asteroid.name}</div>
                              <div className="text-sm text-gray-400">ID: {asteroid.id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`font-medium ${sizeCategory.color}`}>
                                {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}
                              </div>
                              <div className="text-sm text-gray-400">{sizeCategory.category}</div>
                            </td>
                            <td className="px-6 py-4 text-white">
                              {asteroid.absolute_magnitude_h.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center space-x-2 ${getHazardColor(asteroid.is_potentially_hazardous_asteroid)}`}>
                                <span>{getHazardIcon(asteroid.is_potentially_hazardous_asteroid)}</span>
                                <span className="font-medium">
                                  {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {nextApproach ? (
                                <div>
                                  <div className="text-white">{nextApproach.close_approach_date}</div>
                                  <div className="text-sm text-gray-400">
                                    {parseFloat(nextApproach.miss_distance.kilometers).toLocaleString()} km
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">No data</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAsteroid(asteroid);
                                }}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, asteroids.length)} of {asteroids.length} asteroids
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
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Size Distribution Chart */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <FaChartLine className="text-blue-400 mr-3" />
                      Asteroid Size Distribution
                    </h3>
                    <button
                      onClick={() => setFullscreenChart('size')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaSearch />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.slice(0, 20)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#FFFFFF', fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                          label={{ value: 'Diameter (km)', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF' } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB',
                            fontSize: '14px'
                          }}
                          formatter={(value: any, name: string) => [
                            `${parseFloat(value).toFixed(3)} km`,
                            'Diameter'
                          ]}
                          labelFormatter={(label) => `Asteroid: ${label}`}
                        />
                        <Bar 
                          dataKey="diameter" 
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Magnitude vs Size Chart */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <FaChartLine className="text-green-400 mr-3" />
                      Magnitude vs Size Analysis
                    </h3>
                    <button
                      onClick={() => setFullscreenChart('magnitude')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaSearch />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="diameter" 
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                          label={{ value: 'Diameter (km)', position: 'insideBottom', offset: -5, style: { fill: '#FFFFFF' } }}
                        />
                        <YAxis 
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                          label={{ value: 'Absolute Magnitude', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF' } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB',
                            fontSize: '14px'
                          }}
                          formatter={(value: any, name: string) => [
                            `${parseFloat(value).toFixed(2)}`,
                            name === 'magnitude' ? 'Magnitude' : 'Diameter (km)'
                          ]}
                          labelFormatter={(label) => `Diameter: ${parseFloat(label).toFixed(3)} km`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="magnitude" 
                          stroke="#10B981" 
                          strokeWidth={3}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Hazardous Asteroids Chart */}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold flex items-center">
                      <FaExclamationTriangle className="text-red-400 mr-3" />
                      Hazardous Asteroids Overview
                    </h3>
                    <button
                      onClick={() => setFullscreenChart('hazardous')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <FaSearch />
                      <span>Fullscreen</span>
                    </button>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.slice(0, 15)} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#FFFFFF', fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ fill: '#FFFFFF', fontSize: 12 }}
                          label={{ value: 'Hazardous (1=Yes, 0=No)', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF' } }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB',
                            fontSize: '14px'
                          }}
                          formatter={(value: any) => [
                            value === 1 ? 'Potentially Hazardous' : 'Not Hazardous',
                            'Status'
                          ]}
                          labelFormatter={(label) => `Asteroid: ${label}`}
                        />
                        <Bar 
                          dataKey="hazardous" 
                          fill={(entry: any) => entry.hazardous === 1 ? '#EF4444' : '#10B981'}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaMeteor className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Asteroids Found</h3>
            <p className="text-gray-400">Try adjusting your date range to find near-Earth objects.</p>
          </motion.div>
        )}

        {/* Fullscreen Chart Modal */}
        {fullscreenChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setFullscreenChart(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full h-full max-w-7xl glass-card p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-semibold">
                  {fullscreenChart === 'size' && 'Asteroid Size Distribution'}
                  {fullscreenChart === 'magnitude' && 'Magnitude vs Size Analysis'}
                  {fullscreenChart === 'hazardous' && 'Hazardous Asteroids Overview'}
                </h3>
                <button
                  onClick={() => setFullscreenChart(null)}
                  className="text-gray-400 hover:text-white text-3xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 min-h-0">
                {fullscreenChart === 'size' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.slice(0, 20)} margin={{ top: 20, right: 30, left: 60, bottom: 120 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#FFFFFF', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fill: '#FFFFFF', fontSize: 14 }}
                        label={{ value: 'Diameter (km)', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF', fontSize: '16px' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB',
                          fontSize: '16px'
                        }}
                        formatter={(value: any, name: string) => [
                          `${parseFloat(value).toFixed(3)} km`,
                          'Diameter'
                        ]}
                        labelFormatter={(label) => `Asteroid: ${label}`}
                      />
                      <Bar 
                        dataKey="diameter" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {fullscreenChart === 'magnitude' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="diameter" 
                        tick={{ fill: '#FFFFFF', fontSize: 14 }}
                        label={{ value: 'Diameter (km)', position: 'insideBottom', offset: -5, style: { fill: '#FFFFFF', fontSize: '16px' } }}
                      />
                      <YAxis 
                        tick={{ fill: '#FFFFFF', fontSize: 14 }}
                        label={{ value: 'Absolute Magnitude', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF', fontSize: '16px' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB',
                          fontSize: '16px'
                        }}
                        formatter={(value: any, name: string) => [
                          `${parseFloat(value).toFixed(2)}`,
                          name === 'magnitude' ? 'Magnitude' : 'Diameter (km)'
                        ]}
                        labelFormatter={(label) => `Diameter: ${parseFloat(label).toFixed(3)} km`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="magnitude" 
                        stroke="#10B981" 
                        strokeWidth={4}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 8 }}
                        activeDot={{ r: 12, stroke: '#10B981', strokeWidth: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                
                {fullscreenChart === 'hazardous' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.slice(0, 15)} margin={{ top: 20, right: 30, left: 60, bottom: 120 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#FFFFFF', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fill: '#FFFFFF', fontSize: 14 }}
                        label={{ value: 'Hazardous (1=Yes, 0=No)', angle: -90, position: 'insideLeft', style: { fill: '#FFFFFF', fontSize: '16px' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB',
                          fontSize: '16px'
                        }}
                        formatter={(value: any) => [
                          value === 1 ? 'Potentially Hazardous' : 'Not Hazardous',
                          'Status'
                        ]}
                        labelFormatter={(label) => `Asteroid: ${label}`}
                      />
                      <Bar 
                        dataKey="hazardous" 
                        fill={(entry: any) => entry.hazardous === 1 ? '#EF4444' : '#10B981'}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Asteroid Details Modal */}
        {selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAsteroid(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl max-h-[90vh] glass-card p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">{selectedAsteroid.name}</h3>
                <button
                  onClick={() => setSelectedAsteroid(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Basic Information</h4>
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {selectedAsteroid.id}</p>
                      <p><strong>Name:</strong> {selectedAsteroid.name}</p>
                      <p><strong>Absolute Magnitude:</strong> {selectedAsteroid.absolute_magnitude_h}</p>
                      <p className="flex items-center space-x-2">
                        <strong>Potentially Hazardous:</strong>
                        <span className={getHazardColor(selectedAsteroid.is_potentially_hazardous_asteroid)}>
                          {getHazardIcon(selectedAsteroid.is_potentially_hazardous_asteroid)}
                          {selectedAsteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Size Information</h4>
                    <div className="space-y-2">
                      <p><strong>Estimated Diameter (Min):</strong> {selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} km</p>
                      <p><strong>Estimated Diameter (Max):</strong> {selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km</p>
                      <p><strong>Size Category:</strong> {getSizeCategory(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max).category}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-3">Close Approach Data</h4>
                  {selectedAsteroid.close_approach_data.length > 0 ? (
                    <div className="space-y-4">
                      {selectedAsteroid.close_approach_data.slice(0, 3).map((approach, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg">
                          <p><strong>Date:</strong> {approach.close_approach_date}</p>
                          <p><strong>Miss Distance:</strong> {parseFloat(approach.miss_distance.kilometers).toLocaleString()} km</p>
                          <p><strong>Relative Velocity:</strong> {parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(2)} km/s</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No close approach data available</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AsteroidsPage;

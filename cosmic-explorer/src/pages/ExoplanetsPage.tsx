import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGlobe, 
  FaSearch, 
  FaFilter, 
  FaRuler, 
  FaThermometerHalf, 
  FaRocket,
  FaStar,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { nasaApi } from '../services/nasaApi';
import type { ExoplanetData } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ExoplanetsPage: React.FC = () => {
  const [exoplanets, setExoplanets] = useState<ExoplanetData[]>([]);
  const [filteredExoplanets, setFilteredExoplanets] = useState<ExoplanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetData | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'discovery_year' | 'mass' | 'radius' | 'distance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'confirmed' | 'candidates'>('all');

  useEffect(() => {
    fetchExoplanets();
  }, []);

  useEffect(() => {
    filterAndSortExoplanets();
  }, [exoplanets, searchTerm, sortBy, sortOrder, filterBy]);

  const fetchExoplanets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await nasaApi.getExoplanets();
      setExoplanets(data);
    } catch (err) {
      setError('Failed to fetch exoplanet data. Please try again.');
      console.error('Exoplanets Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortExoplanets = () => {
    let filtered = exoplanets.filter(planet => {
      const matchesSearch = planet.pl_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           planet.hostname.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'confirmed' && planet.pl_name) ||
                           (filterBy === 'candidates' && !planet.pl_name);
      
      return matchesSearch && matchesFilter;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.pl_name || '';
          bValue = b.pl_name || '';
          break;
        case 'discovery_year':
          aValue = a.disc_year || 0;
          bValue = b.disc_year || 0;
          break;
        case 'mass':
          aValue = a.pl_bmasse || 0;
          bValue = b.pl_bmasse || 0;
          break;
        case 'radius':
          aValue = a.pl_rade || 0;
          bValue = b.pl_rade || 0;
          break;
        case 'distance':
          aValue = a.sy_dist || 0;
          bValue = b.sy_dist || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredExoplanets(filtered);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return <FaSort className="text-gray-400" />;
    return sortOrder === 'asc' ? <FaSortUp className="text-blue-400" /> : <FaSortDown className="text-blue-400" />;
  };

  const getPlanetType = (mass: number, radius: number) => {
    if (mass < 0.1) return { type: 'Sub-Earth', color: 'text-blue-400' };
    if (mass < 2) return { type: 'Super-Earth', color: 'text-green-400' };
    if (mass < 10) return { type: 'Neptune-like', color: 'text-cyan-400' };
    if (mass < 50) return { type: 'Jupiter-like', color: 'text-orange-400' };
    return { type: 'Super-Jupiter', color: 'text-red-400' };
  };

  const getHabitabilityZone = (distance: number, temperature: number) => {
    if (distance < 0.5 || distance > 2) return { zone: 'Outside HZ', color: 'text-gray-400' };
    if (temperature > 0 && temperature < 100) return { zone: 'Potentially Habitable', color: 'text-green-400' };
    return { zone: 'In HZ', color: 'text-yellow-400' };
  };

  // Prepare chart data
  const chartData = filteredExoplanets
    .filter(planet => planet.pl_bmasse && planet.pl_rade && planet.sy_dist)
    .map(planet => ({
      name: planet.pl_name,
      mass: planet.pl_bmasse,
      radius: planet.pl_rade,
      distance: planet.sy_dist,
      temperature: planet.pl_eqt || 0,
      year: planet.disc_year || 0
    }));

  const discoveryYearData = filteredExoplanets
    .filter(planet => planet.disc_year)
    .reduce((acc, planet) => {
      const year = planet.disc_year!;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

  const discoveryChartData = Object.entries(discoveryYearData)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Discovering exoplanets..." />
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
            Exoplanet Explorer
          </h1>
          <p className="text-xl text-gray-300">
            Discover worlds beyond our solar system
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Planets
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by planet or host star..."
                  className="cosmic-input pl-10 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                className="cosmic-input w-full"
              >
                <option value="all">All Planets</option>
                <option value="confirmed">Confirmed</option>
                <option value="candidates">Candidates</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="cosmic-input w-full"
              >
                <option value="name">Name</option>
                <option value="discovery_year">Discovery Year</option>
                <option value="mass">Mass</option>
                <option value="radius">Radius</option>
                <option value="distance">Distance</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <FaGlobe className="text-3xl text-blue-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">{filteredExoplanets.length}</h3>
            <p className="text-gray-400">Exoplanets Found</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaStar className="text-3xl text-yellow-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {new Set(filteredExoplanets.map(p => p.hostname)).size}
            </h3>
            <p className="text-gray-400">Host Stars</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaThermometerHalf className="text-3xl text-green-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {filteredExoplanets.filter(p => p.pl_eqt && p.pl_eqt > 0 && p.pl_eqt < 100).length}
            </h3>
            <p className="text-gray-400">Potentially Habitable</p>
          </div>
          
          <div className="glass-card p-6 text-center">
            <FaRocket className="text-3xl text-purple-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white">
              {Math.max(...filteredExoplanets.map(p => p.disc_year || 0))}
            </h3>
            <p className="text-gray-400">Latest Discovery</p>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Mass vs Radius</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="mass" 
                  name="Mass (Earth masses)"
                  tick={{ fill: '#9CA3AF' }}
                  label={{ value: 'Mass (Earth masses)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="radius" 
                  name="Radius (Earth radii)"
                  tick={{ fill: '#9CA3AF' }}
                  label={{ value: 'Radius (Earth radii)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Scatter dataKey="radius" fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Discoveries by Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={discoveryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#9CA3AF' }}
                  label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  label={{ value: 'Number of Discoveries', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 p-6 mb-8 rounded-2xl"
          >
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchExoplanets}
                className="cosmic-button"
                disabled={loading}
              >
                {loading ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Exoplanets Table */}
        {filteredExoplanets.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Planet Name</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('discovery_year')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Discovery Year</span>
                        {getSortIcon('discovery_year')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('mass')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Mass</span>
                        {getSortIcon('mass')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('radius')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Radius</span>
                        {getSortIcon('radius')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                      onClick={() => handleSort('distance')}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Distance</span>
                        {getSortIcon('distance')}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredExoplanets.map((planet, index) => {
                    const planetType = getPlanetType(planet.pl_bmasse || 0, planet.pl_rade || 0);
                    const habitability = getHabitabilityZone(planet.sy_dist || 0, planet.pl_eqt || 0);
                    
                    return (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setSelectedPlanet(planet)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{planet.pl_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-400">{planet.hostname}</div>
                        </td>
                        <td className="px-6 py-4 text-white">
                          {planet.disc_year || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-white">
                          {planet.pl_bmasse ? `${planet.pl_bmasse.toFixed(2)} M⊕` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-white">
                          {planet.pl_rade ? `${planet.pl_rade.toFixed(2)} R⊕` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-white">
                          {planet.sy_dist ? `${planet.sy_dist.toFixed(2)} pc` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm ${planetType.color} bg-white/10`}>
                            {planetType.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanet(planet);
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
          </motion.div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaGlobe className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Exoplanets Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* Planet Details Modal */}
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl max-h-[90vh] glass-card p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">{selectedPlanet.pl_name || 'Unknown Planet'}</h3>
                <button
                  onClick={() => setSelectedPlanet(null)}
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
                      <p><strong>Planet Name:</strong> {selectedPlanet.pl_name || 'Unknown'}</p>
                      <p><strong>Host Star:</strong> {selectedPlanet.hostname}</p>
                      <p><strong>Discovery Year:</strong> {selectedPlanet.disc_year || 'Unknown'}</p>
                      <p><strong>Discovery Method:</strong> {selectedPlanet.discoverymethod || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Physical Properties</h4>
                    <div className="space-y-2">
                      <p><strong>Mass:</strong> {selectedPlanet.pl_bmasse ? `${selectedPlanet.pl_bmasse.toFixed(2)} Earth masses` : 'Unknown'}</p>
                      <p><strong>Radius:</strong> {selectedPlanet.pl_rade ? `${selectedPlanet.pl_rade.toFixed(2)} Earth radii` : 'Unknown'}</p>
                      <p><strong>Equilibrium Temperature:</strong> {selectedPlanet.pl_eqt ? `${selectedPlanet.pl_eqt.toFixed(1)} K` : 'Unknown'}</p>
                      <p><strong>Orbital Period:</strong> {selectedPlanet.pl_orbper ? `${selectedPlanet.pl_orbper.toFixed(2)} days` : 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-3">System Information</h4>
                    <div className="space-y-2">
                      <p><strong>Distance:</strong> {selectedPlanet.sy_dist ? `${selectedPlanet.sy_dist.toFixed(2)} parsecs` : 'Unknown'}</p>
                      <p><strong>Distance (Light Years):</strong> {selectedPlanet.sy_dist ? `${(selectedPlanet.sy_dist * 3.26).toFixed(2)} ly` : 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Classification</h4>
                    <div className="space-y-2">
                      <p><strong>Planet Type:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getPlanetType(selectedPlanet.pl_bmasse || 0, selectedPlanet.pl_rade || 0).color} bg-white/10`}>
                          {getPlanetType(selectedPlanet.pl_bmasse || 0, selectedPlanet.pl_rade || 0).type}
                        </span>
                      </p>
                      <p><strong>Habitability Zone:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getHabitabilityZone(selectedPlanet.sy_dist || 0, selectedPlanet.pl_eqt || 0).color} bg-white/10`}>
                          {getHabitabilityZone(selectedPlanet.sy_dist || 0, selectedPlanet.pl_eqt || 0).zone}
                        </span>
                      </p>
                    </div>
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

export default ExoplanetsPage;

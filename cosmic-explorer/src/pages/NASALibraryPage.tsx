import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaImage, 
  FaVideo, 
  FaDownload, 
  FaExternalLinkAlt,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaTimes
} from 'react-icons/fa';
import { nasaApi } from '../services/nasaApi';
import type { NASALibraryItem } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';

const NASALibraryPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<NASALibraryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mediaType, setMediaType] = useState<'all' | 'image' | 'video'>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      
      const data = await nasaApi.searchNASALibrary(searchQuery, 1);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search NASA library. Please try again.');
      console.error('NASA Library Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!searchQuery.trim() || !searchResults) return;
    
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const data = await nasaApi.searchNASALibrary(searchQuery, nextPage);
      
      setSearchResults({
        ...data,
        data: [...searchResults.data, ...data.data]
      });
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Failed to load more results.');
      console.error('Load More Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = searchResults?.data.filter(item => {
    if (mediaType === 'all') return true;
    return item.media_type === mediaType;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMediaIcon = (mediaType: string) => {
    return mediaType === 'image' ? <FaImage className="text-blue-400" /> : <FaVideo className="text-red-400" />;
  };

  const getMediaTypeColor = (mediaType: string) => {
    return mediaType === 'image' ? 'text-blue-400' : 'text-red-400';
  };

  if (loading && !searchResults) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="lg" text="Searching NASA's vast collection..." />
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
            NASA Image & Video Library
          </h1>
          <p className="text-xl text-gray-300">
            Explore NASA's vast collection of images and videos
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaSearch className="text-blue-400 mr-3" />
            Search Collection
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images and videos..."
                  className="cosmic-input w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as typeof mediaType)}
                  className="cosmic-input"
                >
                  <option value="all">All Media</option>
                  <option value="image">Images Only</option>
                  <option value="video">Videos Only</option>
                </select>
                
                <button
                  type="submit"
                  className="cosmic-button flex items-center space-x-2"
                >
                  <FaSearch />
                  <span>Search</span>
                </button>
              </div>
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

        {/* Search Results */}
        {searchResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Search Results ({filteredResults.length} found)
              </h2>
              
              {searchResults.data.length > 0 && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((item, index) => (
                  <motion.div
                    key={item.data[0].nasa_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-card p-4 group hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-space-900">
                      {item.data[0].media_type === 'image' ? (
                        <img
                          src={item.links[0]?.href}
                          alt={item.data[0].title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaVideo className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getMediaIcon(item.data[0].media_type)}
                        <span className={`text-sm font-medium ${getMediaTypeColor(item.data[0].media_type)}`}>
                          {item.data[0].media_type.toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {item.data[0].title}
                      </h3>
                      
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {item.data[0].description}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {formatDate(item.data[0].date_created)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Results Found</h3>
                <p className="text-gray-400">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* No Search Performed */}
        {!searchResults && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Search NASA's Collection</h3>
            <p className="text-gray-400 mb-6">
              Enter a search term above to explore NASA's vast collection of images and videos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">Popular Searches</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Mars</li>
                  <li>• Earth</li>
                  <li>• Solar System</li>
                  <li>• Galaxy</li>
                  <li>• Astronaut</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-2">Mission Names</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Apollo</li>
                  <li>• Hubble</li>
                  <li>• ISS</li>
                  <li>• Curiosity</li>
                  <li>• Perseverance</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">Objects</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Nebula</li>
                  <li>• Black Hole</li>
                  <li>• Comet</li>
                  <li>• Asteroid</li>
                  <li>• Exoplanet</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Item Details Modal */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-6xl max-h-[90vh] glass-card p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold">{selectedItem.data[0].title}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-space-900 mb-4">
                    {selectedItem.data[0].media_type === 'image' ? (
                      <img
                        src={selectedItem.links[0]?.href}
                        alt={selectedItem.data[0].title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaVideo className="text-6xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <a
                      href={selectedItem.links[0]?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FaExternalLinkAlt />
                      <span>View Full Size</span>
                    </a>
                    
                    <a
                      href={selectedItem.links[0]?.href}
                      download
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Description</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedItem.data[0].description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Details</h4>
                    <div className="space-y-2">
                      <p><strong>NASA ID:</strong> {selectedItem.data[0].nasa_id}</p>
                      <p><strong>Media Type:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-sm ${getMediaTypeColor(selectedItem.data[0].media_type)} bg-white/10`}>
                          {selectedItem.data[0].media_type.toUpperCase()}
                        </span>
                      </p>
                      <p><strong>Center:</strong> {selectedItem.data[0].center}</p>
                      <p><strong>Date Created:</strong> {formatDate(selectedItem.data[0].date_created)}</p>
                    </div>
                  </div>
                  
                  {selectedItem.data[0].keywords && selectedItem.data[0].keywords.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-3">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.data[0].keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-white rounded text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
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

export default NASALibraryPage;

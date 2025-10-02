import React, { useState, useEffect } from 'react';
import { FaDatabase, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { apiCache } from '../services/apiCache';

const CacheStatus: React.FC = () => {
  const [stats, setStats] = useState(apiCache.getStats());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(apiCache.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clearCache = () => {
    apiCache.clear();
    setStats(apiCache.getStats());
  };

  const getCacheEfficiency = () => {
    if (stats.totalEntries === 0) return 0;
    return Math.round((stats.validEntries / stats.totalEntries) * 100);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
        title="Cache Status"
      >
        <FaDatabase className="text-lg" />
      </button>

      {/* Cache Status Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white border border-slate-200 rounded-2xl p-4 w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <FaDatabase className="mr-2 text-emerald-500" />
              API Cache Status
            </h3>
            <button
              onClick={clearCache}
              className="text-red-500 hover:text-red-600 transition-colors"
              title="Clear Cache"
            >
              <FaTrash />
            </button>
          </div>

          <div className="space-y-3">
            {/* Cache Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">{stats.validEntries}</div>
                <div className="text-sm text-slate-600">Valid Entries</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">{stats.expiredEntries}</div>
                <div className="text-sm text-slate-600">Expired</div>
              </div>
            </div>

            {/* Cache Efficiency */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">Cache Efficiency</span>
                <span className="text-sm font-semibold text-emerald-600">{getCacheEfficiency()}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCacheEfficiency()}%` }}
                ></div>
              </div>
            </div>

            {/* Rate Limit Info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="flex items-start">
                <FaInfoCircle className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <div className="font-semibold mb-1">Rate Limit Protection</div>
                  <div className="text-xs">
                    Cached data reduces API calls to stay within NASA's 1,000 requests/hour limit.
                  </div>
                </div>
              </div>
            </div>

            {/* Cache Benefits */}
            <div className="text-xs text-slate-500">
              <div className="font-semibold mb-1">Cache Benefits:</div>
              <ul className="space-y-1">
                <li>• Faster loading times</li>
                <li>• Reduced API usage</li>
                <li>• Offline data access</li>
                <li>• Better user experience</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheStatus;

// API Cache Service to reduce NASA API calls
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(
      item => now <= item.expiresAt
    );
    
    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      expiredEntries: this.cache.size - validEntries.length
    };
  }
}

export const apiCache = new APICache();

// Cache keys for different data types
export const CACHE_KEYS = {
  APOD: (date?: string) => `apod_${date || 'today'}`,
  MARS_PHOTOS: (rover: string, sol?: number, date?: string, camera?: string, page?: number) => 
    `mars_${rover}_${sol || 'sol'}_${date || 'date'}_${camera || 'all'}_${page || 1}`,
  ASTEROIDS: (startDate: string, endDate: string) => `asteroids_${startDate}_${endDate}`,
  DONKI: (eventType: string) => `donki_${eventType}`,
  EXOPLANETS: (table: string) => `exoplanets_${table}`,
  EPIC: (date?: string) => `epic_${date || 'recent'}`,
  NASA_LIBRARY: (query: string, page: number) => `nasa_lib_${query}_${page}`,
  EONET: (limit: number) => `eonet_${limit}`
} as const;

// TTL (Time To Live) for different data types
export const CACHE_TTL = {
  APOD: 24 * 60 * 60 * 1000, // 24 hours (APOD is daily)
  MARS_PHOTOS: 60 * 60 * 1000, // 1 hour
  ASTEROIDS: 60 * 60 * 1000, // 1 hour
  DONKI: 30 * 60 * 1000, // 30 minutes (space weather changes frequently)
  EXOPLANETS: 24 * 60 * 60 * 1000, // 24 hours (exoplanet data is relatively static)
  EPIC: 60 * 60 * 1000, // 1 hour
  NASA_LIBRARY: 60 * 60 * 1000, // 1 hour
  EONET: 30 * 60 * 1000 // 30 minutes
} as const;

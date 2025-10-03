import { apiCache, CACHE_KEYS, CACHE_TTL } from './apiCache';
import { extractRateLimitInfo } from './rateLimitMonitor';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'fxMadvJCjMpbhQlq7OSd5iC2W3eKYrcCEQC6Irbd';
const BASE_URL = import.meta.env.VITE_NASA_API_BASE_URL || 'https://api.nasa.gov';

// Debug logging
console.log('🔑 NASA API Key loaded:', NASA_API_KEY ? '✅ Present' : '❌ Missing');
console.log('🌐 Base URL:', BASE_URL);

export interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsRoverResponse {
  photos: MarsRoverPhoto[];
}

export interface AsteroidData {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export interface AsteroidsResponse {
  near_earth_objects: { [date: string]: AsteroidData[] };
}

export interface DONKIData {
  flrID: string;
  instruments: Array<{ displayName: string }>;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
  linkedEvents: string[];
  link: string;
}

export interface ExoplanetData {
  pl_name: string;
  hostname: string;
  pl_orbper: number | null;
  pl_bmasse: number | null;
  pl_rade: number | null;
  pl_eqt: number | null;
  sy_dist: number | null;
  discoverymethod: string;
  disc_year: number | null;
}

export interface EPICData {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  lunar_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  sun_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  attitude_quaternions: {
    q0: number;
    q1: number;
    q2: number;
    q3: number;
  };
  coords: {
    lat: number;
    lon: number;
  };
}

export interface NASALibraryItem {
  data: Array<{
    nasa_id: string;
    title: string;
    description: string;
    media_type: string;
    center: string;
    date_created: string;
    keywords: string[];
  }>;
  links: Array<{
    href: string;
    rel: string;
    render: string;
  }>;
}

class NASAApiService {
  private async fetchData<T>(endpoint: string, params: Record<string, string> = {}, apiName: string = 'nasa'): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', NASA_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      console.log('🌐 Making request to:', url.toString());
      const response = await fetch(url.toString());
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      // Extract rate limit information
      extractRateLimitInfo(response, apiName);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error('NASA API Key is invalid or rate limited. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('NASA API rate limit exceeded. Please try again later.');
        } else if (response.status === 400) {
          throw new Error('Invalid request parameters. Please check the date format.');
        }
        
        throw new Error(`NASA API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ NASA API Error:', error);
      throw error;
    }
  }

  // APOD - Astronomy Picture of the Day
  async getAPOD(date?: string): Promise<APODData> {
    const cacheKey = CACHE_KEYS.APOD(date);
    
    console.log('🔍 APOD request - Date:', date, 'Cache key:', cacheKey);
    
    // Check cache first
    const cachedData = apiCache.get<APODData>(cacheKey);
    if (cachedData) {
      console.log('📦 APOD data served from cache');
      return cachedData;
    }

    // Fetch from API
    const params: Record<string, string> = date ? { date } : {};
    console.log('🌐 Fetching APOD from API with params:', params);
    
    try {
      const data = await this.fetchData<APODData>('/planetary/apod', params, 'apod');
      
      // Cache the result
      apiCache.set(cacheKey, data, CACHE_TTL.APOD);
      console.log('🌐 APOD data fetched from API and cached');
      
      return data;
    } catch (error) {
      console.error('❌ APOD API Error:', error);
      throw error;
    }
  }

  // Mars Rover Photos
  async getMarsRoverPhotos(
    rover: 'curiosity' | 'opportunity' | 'spirit' | 'perseverance' = 'curiosity',
    sol?: number,
    earth_date?: string,
    camera?: string,
    page: number = 1
  ): Promise<MarsRoverResponse> {
    const cacheKey = CACHE_KEYS.MARS_PHOTOS(rover, sol, earth_date, camera, page);
    
    // Check cache first
    const cachedData = apiCache.get<MarsRoverResponse>(cacheKey);
    if (cachedData) {
      console.log('📦 Mars photos served from cache');
      return cachedData;
    }

    // Fetch from API
    const params: Record<string, string> = { page: page.toString() };
    if (sol) params.sol = sol.toString();
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;

    const data = await this.fetchData<MarsRoverResponse>(`/mars-photos/api/v1/rovers/${rover}/photos`, params, 'mars-rover');
    
    // Cache the result
    apiCache.set(cacheKey, data, CACHE_TTL.MARS_PHOTOS);
    console.log('🌐 Mars photos fetched from API and cached');
    
    return data;
  }

  // Asteroids NeoWs
  async getAsteroids(startDate: string, endDate: string): Promise<AsteroidsResponse> {
    const cacheKey = CACHE_KEYS.ASTEROIDS(startDate, endDate);
    
    // Check cache first
    const cachedData = apiCache.get<AsteroidsResponse>(cacheKey);
    if (cachedData) {
      console.log('📦 Asteroids data served from cache');
      return cachedData;
    }

    // Fetch from API
    const data = await this.fetchData<AsteroidsResponse>('/neo/rest/v1/feed', {
      start_date: startDate,
      end_date: endDate,
    }, 'asteroids');
    
    // Cache the result
    apiCache.set(cacheKey, data, CACHE_TTL.ASTEROIDS);
    console.log('🌐 Asteroids data fetched from API and cached');
    
    return data;
  }

  // DONKI - Space Weather
  async getDONKI(eventType: string = 'FLR'): Promise<DONKIData[]> {
    const cacheKey = CACHE_KEYS.DONKI(eventType);
    
    // Check cache first
    const cachedData = apiCache.get<DONKIData[]>(cacheKey);
    if (cachedData) {
      console.log('📦 DONKI data served from cache');
      return cachedData;
    }

    // Fetch from API
    try {
      const response = await fetch(`${BASE_URL}/DONKI/${eventType}?api_key=${NASA_API_KEY}`);
      if (!response.ok) {
        throw new Error(`DONKI API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, data, CACHE_TTL.DONKI);
      console.log('🌐 DONKI data fetched from API and cached');
      
      return data;
    } catch (error) {
      console.error('DONKI API Error:', error);
      throw error;
    }
  }

  // Exoplanet Archive
  async getExoplanets(table: string = 'exoplanets'): Promise<ExoplanetData[]> {
    const cacheKey = CACHE_KEYS.EXOPLANETS(table);
    
    // Check cache first
    const cachedData = apiCache.get<ExoplanetData[]>(cacheKey);
    if (cachedData) {
      console.log('📦 Exoplanets data served from cache');
      return cachedData;
    }

    try {
      // Try the new API endpoint first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`https://exoplanetarchive.ipac.caltech.edu/api/v1/exoplanets?format=json&limit=100`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        // Cache the result
        apiCache.set(cacheKey, data, CACHE_TTL.EXOPLANETS);
        console.log('🌐 Exoplanets data fetched from API and cached');
        
        return data;
      }
      
      // Fallback to old endpoint
      console.log('Trying fallback exoplanet endpoint...');
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);
      
      const fallbackResponse = await fetch(`https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=${table}&format=json&limit=100`, {
        signal: fallbackController.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(fallbackTimeoutId);
      
      if (!fallbackResponse.ok) {
        throw new Error(`Exoplanet API Error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      
      // Cache the result
      apiCache.set(cacheKey, fallbackData, CACHE_TTL.EXOPLANETS);
      console.log('🌐 Exoplanets data fetched from fallback API and cached');
      
      return fallbackData;
      
    } catch (error) {
      console.error('Exoplanet API Error:', error);
      
      // Return sample data if API fails
      console.log('Using sample exoplanet data due to API error');
      const sampleData: ExoplanetData[] = [
        {
          pl_name: "Kepler-452b",
          hostname: "Kepler-452",
          disc_year: 2015,
          discoverymethod: "Transit",
          pl_orbper: 384.843,
          pl_bmasse: 5.1,
          pl_rade: 1.63,
          pl_eqt: null,
          sy_dist: null
        },
        {
          pl_name: "TRAPPIST-1e",
          hostname: "TRAPPIST-1",
          disc_year: 2017,
          discoverymethod: "Transit",
          pl_orbper: 6.099,
          pl_bmasse: 0.692,
          pl_rade: 0.910,
          pl_eqt: null,
          sy_dist: null
        },
        {
          pl_name: "Proxima Centauri b",
          hostname: "Proxima Centauri",
          disc_year: 2016,
          discoverymethod: "Radial Velocity",
          pl_orbper: 11.186,
          pl_bmasse: 1.27,
          pl_rade: null,
          pl_eqt: null,
          sy_dist: null
        }
      ];
      
      // Cache sample data
      apiCache.set(cacheKey, sampleData, CACHE_TTL.EXOPLANETS);
      return sampleData;
    }
  }

  // EPIC - Earth Polychromatic Imaging Camera
  async getEPICImages(date?: string): Promise<EPICData[]> {
    const cacheKey = CACHE_KEYS.EPIC(date);
    
    // Check cache first
    const cachedData = apiCache.get<EPICData[]>(cacheKey);
    if (cachedData) {
      console.log('📦 EPIC data served from cache');
      return cachedData;
    }

    // Fetch from API
    const baseUrl = 'https://epic.gsfc.nasa.gov/api';
    const endpoint = date ? `${baseUrl}/natural/date/${date}` : `${baseUrl}/natural/images`;
    
    try {
      console.log('🌐 Fetching EPIC data from:', endpoint);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('EPIC API Response:', response.status, response.statusText);
        throw new Error(`EPIC API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('EPIC API returned empty or invalid data');
        throw new Error('No EPIC images available for the selected date');
      }
      
      // Cache the result
      apiCache.set(cacheKey, data, CACHE_TTL.EPIC);
      console.log('🌐 EPIC data fetched from API and cached:', data.length, 'images');
      
      return data;
    } catch (error) {
      console.error('EPIC API Error:', error);
      
      // Return sample data as fallback
      const sampleData: EPICData[] = [
        {
          identifier: 'sample-1',
          caption: 'Sample Earth Image - EPIC API Unavailable',
          image: 'https://epic.gsfc.nasa.gov/archive/natural/2024/01/01/png/epic_1b_20240101000000.png',
          version: '1.0',
          date: date || new Date().toISOString().split('T')[0],
          centroid_coordinates: { lat: 0, lon: 0 },
          dscovr_j2000_position: { x: 0, y: 0, z: 0 },
          lunar_j2000_position: { x: 0, y: 0, z: 0 },
          sun_j2000_position: { x: 0, y: 0, z: 0 },
          attitude_quaternions: { q0: 0, q1: 0, q2: 0, q3: 0 },
          coords: { lat: 0, lon: 0 }
        }
      ];
      
      console.log('🔄 Using sample EPIC data as fallback');
      return sampleData;
    }
  }

  // NASA Image and Video Library
  async searchNASALibrary(query: string, page: number = 1): Promise<NASALibraryItem> {
    const cacheKey = CACHE_KEYS.NASA_LIBRARY(query, page);
    
    // Check cache first
    const cachedData = apiCache.get<NASALibraryItem>(cacheKey);
    if (cachedData) {
      console.log('📦 NASA Library data served from cache');
      return cachedData;
    }

    // Fetch from API
    const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page}&media_type=image,video`);
    if (!response.ok) {
      throw new Error(`NASA Library API Error: ${response.status}`);
    }
    const data = await response.json();
    
    // Cache the result
    apiCache.set(cacheKey, data, CACHE_TTL.NASA_LIBRARY);
    console.log('🌐 NASA Library data fetched from API and cached');
    
    return data;
  }

  // EONET - Earth Observatory Natural Event Tracker
  async getEONETEvents(limit: number = 10): Promise<any> {
    const cacheKey = CACHE_KEYS.EONET(limit);
    
    // Check cache first
    const cachedData = apiCache.get<any>(cacheKey);
    if (cachedData) {
      console.log('📦 EONET data served from cache');
      return cachedData;
    }

    // Fetch from API
    const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`EONET API Error: ${response.status}`);
    }
    const data = await response.json();
    
    // Cache the result
    apiCache.set(cacheKey, data, CACHE_TTL.EONET);
    console.log('🌐 EONET data fetched from API and cached');
    
    return data;
  }
}

export const nasaApi = new NASAApiService();

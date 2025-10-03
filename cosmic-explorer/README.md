# 🌌 Cosmic Explorer

**"Bringing NASA's Universe Closer to You"** 🚀

A stunning, interactive React + TypeScript web application that brings NASA's vast collection of space data directly to your browser. Explore the cosmos with beautiful visualizations, real-time data, and an immersive space-themed UI featuring a modern collapsible sidebar and enhanced user experience.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Cosmic%20Explorer-blue?style=for-the-badge&logo=react)](https://cosmic-explorer.vercel.app)
[![NASA API](https://img.shields.io/badge/NASA%20API-Open%20Data-red?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

![Cosmic Explorer Banner](https://via.placeholder.com/1200x400/0f172a/ffffff?text=Cosmic+Explorer+-+Explore+the+Universe+with+NASA+Data)

## 🚀 Quick Start

```bash
# Clone and run in 3 commands
git clone https://github.com/talal-ahmed/cosmic-explorer.git
cd cosmic-explorer
npm install && npm run dev
```

**Open [http://localhost:3000](http://localhost:3000) to view it in the browser.**

## 📸 Screenshots

| Homepage Dashboard | Collapsible Sidebar | Enhanced Charts |
|:---:|:---:|:---:|
| ![Homepage](https://via.placeholder.com/400x250/0f172a/ffffff?text=Homepage+Dashboard) | ![Sidebar](https://via.placeholder.com/400x250/0f172a/ffffff?text=Collapsible+Sidebar) | ![Charts](https://via.placeholder.com/400x250/0f172a/ffffff?text=Interactive+Charts) |

| Space Weather | Mars Rover | Exoplanets |
|:---:|:---:|:---:|
| ![DONKI](https://via.placeholder.com/400x250/0f172a/ffffff?text=Space+Weather) | ![Mars](https://via.placeholder.com/400x250/0f172a/ffffff?text=Mars+Rover) | ![Exoplanets](https://via.placeholder.com/400x250/0f172a/ffffff?text=Exoplanets) |

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Tech Stack](#-tech-stack)
- [🎨 Design Features](#-design-features)
- [📡 NASA APIs Used](#-nasa-apis-used)
- [🛠️ Installation & Setup](#️-installation--setup)
- [🔑 API Configuration](#-api-configuration)
- [🚀 Rate Limiting & Caching Strategy](#-rate-limiting--caching-strategy)
- [📂 Project Structure](#-project-structure)
- [🌟 Key Features Implementation](#-key-features-implementation)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🎯 Recent Updates](#-recent-updates)
- [👨‍🚀 Author](#-author)

## ✨ Features

### 🎛️ **Modern UI/UX**
- **Collapsible Sidebar**: Click the logo to expand/collapse for maximum content space
- **Glassmorphism Design**: Beautiful frosted glass effects throughout
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Dark Space Theme**: Immersive cosmic atmosphere with starfield effects

### 🏠 **Homepage Dashboard**
- Real-time highlights from multiple NASA APIs
- Astronomy Picture of the Day showcase
- Latest Mars rover photos
- Recent exoplanet discoveries
- Interactive feature cards with smooth animations

### 📸 **Astronomy Picture of the Day (APOD)**
- Daily astronomical images with detailed descriptions
- Date navigation (previous/next day)
- HD image viewing and download
- Copyright information and metadata

### 🤖 **Mars Rover Photos**
- Gallery from Curiosity, Opportunity, Spirit, and Perseverance rovers
- Advanced filtering by rover, camera, date, and sol
- Interactive photo viewer with detailed information
- Download and external link options

### ☄️ **Near-Earth Objects (Asteroids)**
- **Enhanced Charts**: Large, interactive charts with fullscreen view
- Real-time asteroid tracking and visualization
- Interactive charts and graphs using Recharts
- Hazardous asteroid identification
- Detailed asteroid information and close approach data
- **Chart Types**: Size distribution, magnitude analysis, and hazardous overview

### 🌞 **Space Weather (DONKI)**
- **Compact Design**: Streamlined interface for better usability
- **Organized Event Types**: Categorized by Solar Activity, Geomagnetic, and Radiation
- Solar flare monitoring
- Coronal Mass Ejection (CME) tracking
- Geomagnetic storm alerts
- Space weather event timeline

### 🪐 **Exoplanet Explorer**
- Comprehensive exoplanet database
- Interactive search and filtering
- Mass vs. radius scatter plots
- Discovery timeline visualization
- Habitability zone analysis

### 🎞️ **NASA Image & Video Library**
- Search through NASA's vast media collection
- Filter by media type (images/videos)
- High-resolution viewing and downloading
- Detailed metadata and keywords

### 🛰️ **EPIC Earth Images**
- Daily Earth views from DSCOVR satellite
- Time-lapse navigation through daily images
- Geographic coordinate information
- High-resolution Earth photography

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** TailwindCSS with custom cosmic theme
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Routing:** React Router DOM
- **Icons:** React Icons
- **Build Tool:** Vite
- **APIs:** NASA Open APIs
- **State Management:** React Context API
- **Deployment:** Vercel

## 🎨 Design Features

- **Cosmic Theme:** Dark space backgrounds with starfield effects
- **Glassmorphism:** Frosted glass UI elements with blur effects
- **Smooth Animations:** Framer Motion powered transitions and micro-interactions
- **Responsive Design:** Mobile-first approach with collapsible sidebar
- **Loading States:** Space-themed loading animations
- **Interactive Elements:** Hover effects, scale animations, and smooth transitions
- **Modern UI:** Clean, minimalist design with cosmic aesthetics
- **Accessibility:** Keyboard navigation and screen reader support

## 📡 NASA APIs Used

- [APOD](https://api.nasa.gov/) - Astronomy Picture of the Day
- [Mars Rover Photos](https://api.nasa.gov/mars-photos/) - Mars rover imagery
- [Asteroids NeoWs](https://api.nasa.gov/) - Near-Earth object data
- [DONKI](https://api.nasa.gov/) - Space weather notifications
- [EPIC](https://epic.gsfc.nasa.gov/) - Earth imagery from DSCOVR
- [Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) - Exoplanet data
- [NASA Image/Video Library](https://images.nasa.gov/) - Media search
- [EONET](https://eonet.gsfc.nasa.gov/) - Earth observation events

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/cosmic-explorer.git

# Navigate to the project directory
cd cosmic-explorer

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser to http://localhost:5173
```

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🔑 API Configuration

The application uses NASA's free APIs. To get started:

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Generate your free API key
3. Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

4. Add your API key to the `.env` file:

```env
VITE_NASA_API_KEY=your-nasa-api-key-here
```

**Note:** The app includes a demo API key as fallback, but for production use, please obtain your own key from NASA.

## 🚀 Rate Limiting & Caching Strategy

### 📊 NASA API Rate Limits
- **Your API Key**: 1,000 requests per hour
- **DEMO_KEY**: 30 requests per hour, 50 per day
- **Rolling hourly reset**

### 🛡️ Optimization Features

#### 1. **Smart Caching System**
- **APOD**: 24-hour cache (daily updates)
- **Mars Photos**: 1-hour cache
- **Asteroids**: 1-hour cache
- **DONKI**: 30-minute cache (space weather changes frequently)
- **Exoplanets**: 24-hour cache (relatively static data)
- **EPIC**: 1-hour cache
- **NASA Library**: 1-hour cache
- **EONET**: 30-minute cache

#### 2. **Cache Benefits**
- ✅ **Reduced API calls** by up to 90%
- ✅ **Faster loading times** for repeated requests
- ✅ **Offline data access** for cached content
- ✅ **Better user experience** with instant responses
- ✅ **Rate limit protection** to avoid API blocking

#### 3. **Real-time Monitoring**
- **Cache Status Widget**: Bottom-right corner shows cache efficiency
- **Rate Limit Tracking**: Monitors API usage in real-time
- **Visual Indicators**: Shows when data is served from cache vs API

#### 4. **Request Optimization**
- **Duplicate Request Prevention**: Same requests within cache TTL are served from cache
- **Intelligent Cache Keys**: Unique keys for different parameters (dates, rovers, etc.)
- **Automatic Cleanup**: Expired cache entries are automatically removed

### 📈 Expected Performance
With caching enabled, you can expect:
- **90% reduction** in API calls
- **Sub-second loading** for cached data
- **Reliable operation** within NASA's rate limits
- **Smooth user experience** even with heavy usage

## 📂 Project Structure

```
cosmic-explorer/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.tsx    # Collapsible sidebar navigation
│   │   ├── CacheStatus.tsx # API cache monitoring widget
│   │   └── LoadingSpinner.tsx
│   ├── contexts/          # React Context providers
│   │   └── SidebarContext.tsx # Sidebar state management
│   ├── pages/             # Feature pages
│   │   ├── HomePage.tsx   # Dashboard
│   │   ├── APODPage.tsx   # Astronomy Picture of the Day
│   │   ├── MarsRoverPage.tsx
│   │   ├── AsteroidsPage.tsx # Enhanced with fullscreen charts
│   │   ├── DONKIPage.tsx  # Space Weather (compact design)
│   │   ├── ExoplanetsPage.tsx
│   │   ├── NASALibraryPage.tsx
│   │   └── EPICPage.tsx   # Earth Images
│   ├── services/          # API services
│   │   ├── nasaApi.ts     # NASA API client
│   │   ├── apiCache.ts    # Caching system
│   │   └── rateLimitMonitor.ts # Rate limiting
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

## 🌟 Key Features Implementation

### Responsive Design
- Mobile-first approach with TailwindCSS
- Collapsible sidebar for optimal space usage
- Flexible grid layouts that adapt to screen size
- Touch-friendly navigation and interactions
- Optimized images and loading states

### Performance
- Lazy loading for images and components
- Smart API caching system (90% reduction in API calls)
- Optimized bundle size with Vite
- Smooth 60fps animations with Framer Motion
- Real-time cache monitoring and rate limiting

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management for sidebar interactions

### Error Handling
- Graceful API error handling with fallback API keys
- User-friendly error messages
- Fallback images and content
- Loading states for all operations
- Network error recovery

### Modern UI/UX
- **Collapsible Sidebar**: Logo-click to toggle for maximum content space
- **Glassmorphism Effects**: Beautiful frosted glass UI elements
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Charts**: Fullscreen view for detailed data analysis
- **Compact Design**: Streamlined interfaces for better usability

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration
4. Set environment variables for NASA API key

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing
4. Add environment variables in Netlify dashboard

### Other Platforms
The app can be deployed to any static hosting service that supports SPAs.

### Environment Variables
Make sure to set the following environment variable in your deployment platform:
```env
VITE_NASA_API_KEY=your-nasa-api-key-here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for providing free, open APIs
- **React** and **TypeScript** communities
- **TailwindCSS** for the amazing utility-first CSS framework
- **Framer Motion** for smooth animations
- **Recharts** for beautiful data visualizations

## 🎯 Recent Updates

### v2.0.0 - Modern UI Overhaul
- ✅ **Collapsible Sidebar**: Click logo to expand/collapse for maximum content space
- ✅ **Enhanced Asteroids Page**: Large interactive charts with fullscreen view
- ✅ **Streamlined DONKI Page**: Compact design with organized event types
- ✅ **Improved Performance**: Better caching and rate limiting
- ✅ **Modern Animations**: Smooth transitions and micro-interactions
- ✅ **Responsive Design**: Perfect on all device sizes

### v1.0.0 - Initial Release
- ✅ Complete NASA API integration
- ✅ Multiple data visualization pages
- ✅ Responsive design
- ✅ Caching system

## 👨‍🚀 Author

**Talal Ahmed Al Aidarus**
- Final-year Software Engineering student at UTAS
- Passionate about space, AI, and web development
- [GitHub](https://github.com/talal-ahmed)
- [LinkedIn](https://linkedin.com/in/talal-ahmed)

---

**Made with ❤️ and ☄️ for the love of space exploration**

*"The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."* - Carl Sagan

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 🌟 Star this repository if you found it helpful!

[![GitHub stars](https://img.shields.io/github/stars/talal-ahmed/cosmic-explorer?style=social)](https://github.com/talal-ahmed/cosmic-explorer)
[![GitHub forks](https://img.shields.io/github/forks/talal-ahmed/cosmic-explorer?style=social)](https://github.com/talal-ahmed/cosmic-explorer)
[![GitHub watchers](https://img.shields.io/github/watchers/talal-ahmed/cosmic-explorer?style=social)](https://github.com/talal-ahmed/cosmic-explorer)
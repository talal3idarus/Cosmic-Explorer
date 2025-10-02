# 🌌 Cosmic Explorer

**"Bringing NASA's Universe Closer to You"** 🚀

A stunning, interactive React + TypeScript web application that brings NASA's vast collection of space data directly to your browser. Explore the cosmos with beautiful visualizations, real-time data, and an immersive space-themed UI.

![NASA Banner](https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png)

## ✨ Features

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
- Real-time asteroid tracking and visualization
- Interactive charts and graphs using Recharts
- Hazardous asteroid identification
- Detailed asteroid information and close approach data

### 🌞 **Space Weather (DONKI)**
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

## 🎨 Design Features

- **Cosmic Theme:** Dark space backgrounds with starfield effects
- **Glassmorphism:** Frosted glass UI elements
- **Smooth Animations:** Framer Motion powered transitions
- **Responsive Design:** Mobile-first approach
- **Loading States:** Space-themed loading animations
- **Interactive Elements:** Hover effects and micro-interactions

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
│   │   ├── Navbar.tsx     # Navigation component
│   │   └── LoadingSpinner.tsx
│   ├── pages/             # Feature pages
│   │   ├── HomePage.tsx   # Dashboard
│   │   ├── APODPage.tsx   # Astronomy Picture of the Day
│   │   ├── MarsRoverPage.tsx
│   │   ├── AsteroidsPage.tsx
│   │   ├── DONKIPage.tsx  # Space Weather
│   │   ├── ExoplanetsPage.tsx
│   │   ├── NASALibraryPage.tsx
│   │   └── EPICPage.tsx   # Earth Images
│   ├── services/          # API services
│   │   └── nasaApi.ts     # NASA API client
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json
```

## 🌟 Key Features Implementation

### Responsive Design
- Mobile-first approach with TailwindCSS
- Flexible grid layouts
- Touch-friendly navigation
- Optimized images and loading

### Performance
- Lazy loading for images
- Efficient API calls with caching
- Optimized bundle size with Vite
- Smooth 60fps animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

### Error Handling
- Graceful API error handling
- User-friendly error messages
- Fallback images and content
- Loading states for all operations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Other Platforms
The app can be deployed to any static hosting service that supports SPAs.

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

## 👨‍🚀 Author

**Talal Ahmed Al Aidarus**
- Final-year Software Engineering student at UTAS
- Passionate about space, AI, and web development
- [GitHub](https://github.com/your-username)
- [LinkedIn](https://linkedin.com/in/your-username)

---

**Made with ❤️ and ☄️ for the love of space exploration**

*"The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."* - Carl Sagan
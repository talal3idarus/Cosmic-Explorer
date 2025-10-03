import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Make sure environment variables are available
      'process.env.VITE_NASA_API_KEY': JSON.stringify(env.VITE_NASA_API_KEY || 'fxMadvJCjMpbhQlq7OSd5iC2W3eKYrcCEQC6Irbd'),
    },
    server: {
      port: 3000,
      open: true,
    },
  }
})

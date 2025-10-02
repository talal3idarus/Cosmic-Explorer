/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NASA_API_KEY: string
  readonly VITE_NASA_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

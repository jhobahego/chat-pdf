/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLOUDINARY_API_KEY: string;
  readonly CLOUDINARY_SECRET: string;
  // Agrega otras variables de entorno aquí si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

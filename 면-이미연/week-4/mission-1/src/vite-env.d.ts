/// <reference types="vite/client" />
interface ImprotMetaEnv {
    readonly VITE_TMDB_KEY: string;
}

interface ImportMeta {
    readonly env: VITE_TMDB_KEY;
}
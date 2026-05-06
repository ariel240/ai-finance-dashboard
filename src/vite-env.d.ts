/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALPHA_VANTAGE_KEY: string;
  readonly VITE_ANTHROPIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
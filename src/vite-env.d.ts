/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CALENDLY_URL?: string;
	readonly VITE_WHATSAPP_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/** ISO date (YYYY-MM-DD) injected at build time by Vite — see vite.config.ts `define`. */
declare const __BUILD_DATE__: string;

/**
 * Application Configuration
 *
 * This file contains all the configurable variables for the application.
 * Edit this file to change application settings.
 */

// Application information
export const APP_NAME = 'Severino IA Central';
export const APP_VERSION = '1.0.2';
export const APP_DESCRIPTION = 'Central de gerenciamento e automação com IA';

// Server configuration
export const SERVER = {
  HOST: import.meta.env.VITE_SERVER_HOST || '::',
  PORT: parseInt(import.meta.env.VITE_SERVER_PORT || '8085'),
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8085',
};

// Authentication
export const AUTH = {
  // Master password for login (from .env)
  MASTER_PASSWORD: import.meta.env.VITE_MASTER_PASSWORD || ' ',
  // Default user ID
  DEFAULT_USER_ID: 'admin',
};

// Database configuration
export const DATABASE = {
  // Supabase configuration
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    KEY: import.meta.env.VITE_SUPABASE_KEY || '',
    ENABLED: import.meta.env.VITE_USE_SUPABASE === 'true' || false,
  },
  // Local storage keys
  STORAGE_KEYS: {
    NOTES: 'severino-notes-storage',
    TASKS: 'severino-tasks-storage',
    LINKS: 'severino-links-storage',
    IDEAS: 'severino-ideas-storage',
    PROMPTS: 'severino-prompts-storage',
    CHIP_INSTANCES: 'severino-chip-instances-storage',
    SETTINGS: 'severino-settings-storage',
    AUTH: 'severino-auth-storage',
    CLIENTS: 'severino-clients-storage',
    FINANCIAL_RECORDS: 'severino-financial-records-storage',
  },
};

// API configuration
export const API = {
  // OpenAI configuration
  OPENAI: {
    DEFAULT_MODEL: 'gpt-4o-mini',
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 500,
    DEFAULT_SYSTEM_MESSAGE: 'Você é um assistente útil e amigável que ajuda com suporte técnico e brainstorming. Seja conciso e direto nas respostas.',
  },
  // Evolution API configuration
  EVOLUTION: {
    DEFAULT_WEBHOOK_URL: 'https://gen.simplebot.online/webhook/a1b8ac76-841d-4412-911a-7f22ff0d73ff/chat',
  },
};

// UI configuration
export const UI = {
  // Theme configuration
  THEME: {
    DEFAULT: 'dark',
    PRIMARY_COLOR: 'green',
    SECONDARY_COLOR: 'black',
  },
  // Language configuration
  LANGUAGE: {
    DEFAULT: 'pt',
    SUPPORTED: ['pt', 'en'],
  },
};

// Default settings
export const DEFAULT_SETTINGS = {
  openaiApiKey: '',
  webhookUrl: API.EVOLUTION.DEFAULT_WEBHOOK_URL,
  evolutionApiKey: '',
  webhookEvolutionUrl: '',
  theme: UI.THEME.DEFAULT,
  language: UI.LANGUAGE.DEFAULT,
  enableNotifications: false,
  autoSave: true,
  useSupabase: DATABASE.SUPABASE.ENABLED,
  userId: AUTH.DEFAULT_USER_ID,
};

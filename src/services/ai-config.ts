import Constants from 'expo-constants';

// Get environment variables from Expo config
const extra = Constants.expoConfig?.extra;

// Hardcoded keys for development - replace with your test keys
const DEV_DEEPSEEK_KEY = 'sk-23a6c209835e481b998fa94904c166e6';
const DEV_OPENAI_KEY = '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';

// Use environment variables with fallbacks
export const DEEPSEEK_API_KEY = extra?.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || DEV_DEEPSEEK_KEY;
export const OPENAI_API_KEY = extra?.OPENAI_API_KEY || process.env.OPENAI_API_KEY || DEV_OPENAI_KEY;

export const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';
export const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// Default to OpenAI for better stability
export const DEFAULT_AI_SERVICE = 'openai'; 
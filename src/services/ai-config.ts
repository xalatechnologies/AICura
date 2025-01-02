import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

export const DEEPSEEK_API_KEY = extra?.DEEPSEEK_API_KEY || '';
export const OPENAI_API_KEY = extra?.OPENAI_API_KEY || '';

export const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';
export const OPENAI_BASE_URL = 'https://api.openai.com/v1'; 
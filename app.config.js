import 'dotenv/config';

export default {
  name: 'HealthcareApp',
  version: '1.0.0',
  extra: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}; 
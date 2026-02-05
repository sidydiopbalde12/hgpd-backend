import { registerAs } from '@nestjs/config';

export default registerAs('wave', () => ({
  apiUrl: process.env.WAVE_API_URL || 'https://sandbox.wave.com/v1',
  apiKey: process.env.WAVE_API_KEY || '',
  secretKey: process.env.WAVE_SECRET_KEY || '',
  webhookSecret: process.env.WAVE_WEBHOOK_SECRET || '',
}));

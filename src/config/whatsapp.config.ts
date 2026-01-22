import { registerAs } from '@nestjs/config';

export default registerAs('whatsapp', () => ({
  apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '1025241880662823',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'EAAhAAhWvl6IBQsVKoB5vYCKNsl52UhsnZAIiHurBuEEjn1ItXYxEiboNMEYtZAwfIwv1N5Kj6FKgwBbkG87IShUqZAwl3vOOSF91RERuQMmTvJC4HR6mCiSzfZBr6vzE0BxhEL3wODbjTBG5ReI3vwHdE1HPkf8oU1ekPgCsZCdxHADqZC2MnRH55ApOuxUGEii3iO0U9FkwfB3lJkMEAIqTNRQyWZC8Joz8Awctstx6Ht7ljJGdioRtmnI4P9uTYoLGiQTMPvyZAbFXHb4sjEEF',
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || '',
}));
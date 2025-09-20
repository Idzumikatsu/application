import httpClient from './httpClient';

interface SystemSettings {
  // General
  schoolName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  enableNotifications: boolean;
  enableAutoBackup: boolean;
  // Email
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  // Telegram
  botToken: string;
  botUsername: string;
  enableTelegram: boolean;
  // Security
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  sessionTimeout: number;
  enableTwoFactor: boolean;
}

class SettingsService {
  public async getSettings(): Promise<SystemSettings> {
    const response = await httpClient.get<SystemSettings>('/api/system-settings');
    return response.data;
  }

  public async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await httpClient.put<SystemSettings>('/api/system-settings', settings);
    return response.data;
  }

  public async getSystemInfo(): Promise<any> {
    const response = await httpClient.get('/api/system-info');
    return response.data;
  }
}

const settingsService = new SettingsService();
export default settingsService;
export type { SystemSettings };
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { validateEnvironment } from '../../environments/environment.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config = environment;

  constructor() {
    if (!validateEnvironment(this.config)) {
      console.error('❌ Environment configuration is invalid!');
      throw new Error('Invalid environment configuration');
    }
    
    if (!this.config.production) {
      this.logConfiguration();
    }
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getApiBaseUrl(): string {
    const episodeUrl = this.config.apiUrl;
    const baseUrl = episodeUrl.replace('/api/base/episode', '/api');
    return baseUrl;
  }
 
  getAppName(): string {
    return this.config.appName;
  }

  getVersion(): string {
    return this.config.version;
  }

  isProduction(): boolean {
    return this.config.production;
  }

  getEnvironmentInfo(): string {
    return `${this.getAppName()} v${this.getVersion()} - ${this.isProduction() ? 'Production' : 'Development'}`;
  }

  getEpisodeEndpoint(): string {
    return this.getApiUrl();
  }
 
  logConfiguration(): void {
    console.group('🔧 Application Configuration');
    console.log('App Name:', this.getAppName());
    console.log('Version:', this.getVersion());
    console.log('Environment:', this.isProduction() ? 'Production' : 'Development');
    console.log('API URL:', this.getApiUrl()); 
    console.groupEnd();
  }
}

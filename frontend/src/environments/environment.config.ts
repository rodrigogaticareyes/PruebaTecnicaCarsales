// ===== ENVIRONMENT CONFIGURATION =====
export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string; 
  appName: string;
  version: string;
}

export function validateEnvironment(env: EnvironmentConfig): boolean {
  const requiredFields: (keyof EnvironmentConfig)[] = [
    'production',
    'apiUrl', 
    'appName',
    'version'
  ];

  return requiredFields.every(field => env[field] !== undefined && env[field] !== null);
}

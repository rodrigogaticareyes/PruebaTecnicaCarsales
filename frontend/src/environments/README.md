# Environment Configuration

## 🏗️ **Estructura de Environments**

```
📁 environments/
├── environment.ts (Development)
├── environment.prod.ts (Production)
├── environment.config.ts (Configuration)
└── README.md (Documentación)
```

## 🔧 **Configuración por Ambiente**

### **Development (`environment.ts`)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7195/api/base/episode',
  apiBaseUrl: 'https://localhost:7195/api',
  appName: 'Episodios App - Development',
  version: '1.0.0-dev'
};
```

### **Production (`environment.prod.ts`)**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com/api/base/episode',
  apiBaseUrl: 'https://api.production.com/api',
  appName: 'Episodios App',
  version: '1.0.0'
};
```

## 🚀 **Scripts de Build**

### **Development**
```bash
ng serve
# o
ng build --configuration=development
```

### **Production**
```bash
ng build --configuration=production
# o
ng build --prod
```

## 🔄 **Uso en el Código**

### **Servicio de Configuración**
```typescript
constructor(private configService: ConfigService) {
  // Obtener URL de la API
  const apiUrl = this.configService.getApiUrl();
  
  // Verificar si es producción
  const isProd = this.configService.isProduction();
  
  // Obtener información de la app
  const appInfo = this.configService.getEnvironmentInfo();
}
```

### **Acceso Directo**
```typescript
import { environment } from '../environments/environment';

// Usar configuración directamente
const apiUrl = environment.apiUrl;
const isProduction = environment.production;
```

## 🎯 **Beneficios**

### ✅ **Separación de Ambientes**
- Configuración específica para cada ambiente
- URLs diferentes para desarrollo y producción
- Variables de entorno centralizadas

### ✅ **Mantenibilidad**
- Fácil cambio de URLs sin tocar código
- Configuración centralizada
- Validación automática de configuración

### ✅ **Seguridad**
- URLs de producción separadas
- Configuración sensible en archivos específicos
- Validación de configuración

## 🔧 **Configuración Adicional**

### **Variables de Entorno Personalizadas**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7195/api/base/episode',
  apiBaseUrl: 'https://localhost:7195/api',
  appName: 'Episodios App - Development',
  version: '1.0.0-dev',
  
  // Variables adicionales
  debugMode: true,
  logLevel: 'debug',
  timeout: 30000,
  retryAttempts: 3
};
```

### **Uso en Servicios**
```typescript
@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}
  
  getData() {
    const apiUrl = this.configService.getApiUrl();
    const timeout = this.configService.getTimeout();
    // ... lógica del servicio
  }
}
```

/**
 * Secure Logger Utility
 * 
 * This utility provides logging functions that prevent accidental exposure
 * of sensitive information like environment variables, API keys, and tokens.
 * 
 * Security compliance: Addresses CWE-532 (Insertion of Sensitive Information into Log File)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface SecureLoggerConfig {
  /** Environment (e.g., 'development', 'production') affects logging behavior */
  environment?: string;
  /** Whether to enable debug logging (should be false in production) */
  enableDebug?: boolean;
  /** List of keys that should always be masked in logs */
  sensitiveKeys?: string[];
}

class SecureLogger {
  private config: Required<SecureLoggerConfig>;
  private defaultSensitiveKeys = [
    'password', 'token', 'key', 'secret', 'auth', 'api_key', 'access_token',
    'refresh_token', 'private_key', 'cert', 'credential', 'bearer'
  ];

  constructor(config: SecureLoggerConfig = {}) {
    this.config = {
      environment: config.environment || process.env.NODE_ENV || 'development',
      enableDebug: config.enableDebug ?? this.config?.environment !== 'production',
      sensitiveKeys: [...this.defaultSensitiveKeys, ...(config.sensitiveKeys || [])]
    };
  }

  /**
   * Masks sensitive values in objects/strings
   */
  private maskSensitiveValue(key: string, value: any): any {
    if (value === null || value === undefined) return 'NOT_SET';
    
    const keyLower = key.toLowerCase();
    const isSensitive = this.config.sensitiveKeys.some(sensitive => 
      keyLower.includes(sensitive.toLowerCase())
    );

    if (!isSensitive) {
      return value;
    }

    if (typeof value === 'string') {
      if (value.length <= 4) return '****';
      return value.substring(0, 2) + '*'.repeat(Math.max(4, value.length - 4)) + value.substring(value.length - 2);
    }

    return '[MASKED]';
  }

  /**
   * Recursively sanitizes objects, masking sensitive keys
   */
  private sanitizeObject(obj: any, depth = 0): any {
    if (depth > 10) return '[DEPTH_LIMIT_EXCEEDED]'; // Prevent infinite recursion
    
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, depth + 1));
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = this.maskSensitiveValue(key, this.sanitizeObject(value, depth + 1));
    }
    
    return sanitized;
  }

  /**
   * Generic log method with level and sanitization
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (level === 'debug' && !this.config.enableDebug) return;
    
    const timestamp = new Date().toISOString();
    const sanitizedData = data ? this.sanitizeObject(data) : undefined;
    
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(sanitizedData && { data: sanitizedData })
    };

    switch (level) {
      case 'debug':
        console.debug(`[${timestamp}] DEBUG:`, message, sanitizedData || '');
        break;
      case 'info':
        console.info(`[${timestamp}] INFO:`, message, sanitizedData || '');
        break;
      case 'warn':
        console.warn(`[${timestamp}] WARN:`, message, sanitizedData || '');
        break;
      case 'error':
        console.error(`[${timestamp}] ERROR:`, message, sanitizedData || '');
        break;
    }
  }

  /**
   * Log configuration validation without exposing sensitive values
   */
  logConfigValidation(config: Record<string, any>, requiredKeys?: string[]): void {
    const configStatus = Object.entries(config).reduce((acc, [key, value]) => {
      acc[key] = value ? 'CONFIGURED' : 'MISSING';
      return acc;
    }, {} as Record<string, string>);

    this.info('Configuration validation', { status: configStatus });

    if (requiredKeys) {
      const missing = requiredKeys.filter(key => !config[key]);
      if (missing.length > 0) {
        this.error('Missing required configuration keys', { missing });
      }
    }
  }

  /**
   * Log API connection attempts without exposing credentials
   */
  logApiConnection(serviceName: string, config: { url?: string; [key: string]: any }): void {
    this.info(`Initializing ${serviceName} connection`, {
      url: config.url,
      hasCredentials: !!(config.token || config.key || config.secret || config.accessToken),
      environment: this.config.environment
    });
  }

  /**
   * Public logging methods
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }
}

// Default export for application use
export const secureLogger = new SecureLogger();

// Export class for custom configurations
export { SecureLogger };

/**
 * Utility function to create a logger with custom sensitive keys
 */
export const createSecureLogger = (config?: SecureLoggerConfig): SecureLogger => {
  return new SecureLogger(config);
};

export default secureLogger;
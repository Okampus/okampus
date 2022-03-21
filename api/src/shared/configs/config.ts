import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';
import type { CookieOptions } from 'express';

interface Config {
  port: number;
  baseUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
  upload: {
    maxSize: number;
    path: string;
  };
  storage: {
    enabled: boolean;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
  };
  typesense: {
    enabled: boolean;
    apiKey: string;
    host: string;
    port: number;
    scheme: string;
  };
  sentry: {
    enabled: boolean;
    dsn: string;
  };
  tokens: {
    accessTokenSecret: string;
    accessTokenExpirationSeconds: number;
    refreshTokenSecret: string;
    refreshTokenExpirationSeconds: number;
  };
  cookies: {
    signature: string;
    options: CookieOptions;
  };
  session: {
    secret: string;
  };
  myefreiOidc: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    discoveryUrl: string;
    scopes: string;
    callbackUri: string;
  };
  adminAccount: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}

const logger = new Logger('Configuration');

export const config = createProfiguration<Config>({
  port: {
    default: 8081,
    format: Number,
    env: 'PORT',
  },
  baseUrl: {
    default: 'horizon-efrei.fr',
    format: String,
    env: 'BASE_URL',
  },
  nodeEnv: {
    default: 'development',
    format: ['development', 'production', 'test'],
    env: 'NODE_ENV',
  },
  upload: {
    maxSize: {
      default: 10_485_760,
      format: Number,
      env: 'UPLOAD_MAX_SIZE',
    },
    path: {
      default: 'uploads',
      format: String,
      env: 'UPLOAD_PATH',
    },
  },
  typesense: {
    enabled: {
      default: true,
      format: Boolean,
      env: 'TYPESENSE_ENABLED',
    },
    apiKey: {
      default: 'api-key',
      format: String,
      env: 'TYPESENSE_API_KEY',
    },
    host: {
      default: 'localhost',
      format: String,
      env: 'TYPESENSE_HOST',
    },
    port: {
      default: 8108,
      format: Number,
      env: 'TYPESENSE_PORT',
    },
    scheme: {
      default: 'http',
      format: ['http', 'https'],
      env: 'TYPESENSE_SCHEME',
    },
  },
  storage: {
    enabled: {
      default: false,
      format: Boolean,
      env: 'DISTANT_STORAGE_ENABLED',
    },
    accessKeyId: {
      default: 'access-key-id',
      format: String,
      env: 'STORAGE_ACCESS_KEY_ID',
    },
    secretAccessKey: {
      default: 'secret-access-key',
      format: String,
      env: 'STORAGE_SECRET_ACCESS_KEY',
    },
    endpoint: {
      default: 'endpoint',
      format: String,
      env: 'STORAGE_ENDPOINT',
    },
    region: {
      default: 'region',
      format: String,
      env: 'STORAGE_REGION',
    },
  },
  sentry: {
    enabled: {
      default: false,
      format: Boolean,
      env: 'SENTRY_ENABLED',
    },
    dsn: {
      default: 'https://sentry.io',
      format: String,
      env: 'SENTRY_DSN',
    },
  },
  tokens: {
    accessTokenSecret: {
      default: 'secret',
      format: String,
      env: 'ACCESS_TOKEN_SECRET',
    },
    accessTokenExpirationSeconds: {
      default: 28_800,
      format: Number,
      env: 'ACCESS_TOKEN_EXPIRATION_SECONDS',
    },
    refreshTokenSecret: {
      default: 'secret',
      format: String,
      env: 'REFRESH_TOKEN_SECRET',
    },
    refreshTokenExpirationSeconds: {
      default: 604_800,
      format: Number,
      env: 'REFRESH_TOKEN_EXPIRATION_SECONDS',
    },
  },
  cookies: {
    signature: {
      default: 'secret',
      format: String,
      env: 'COOKIE_SIGNATURE_SECRET',
    },
    options: {
      // This is only the default value, the real value is set right after the config is initialized.
      default: {
        httpOnly: true,
        secure: false,
        signed: true,
      },
      format: Object,
    },
  },
  session: {
    secret: {
      default: 'secret',
      format: String,
      env: 'SESSION_SECRET',
    },
  },
  myefreiOidc: {
    enabled: {
      default: false,
      format: Boolean,
      env: 'MYEFREI_OIDC_ENABLED',
    },
    clientId: {
      default: 'client-id',
      format: String,
      env: 'MYEFREI_OIDC_CLIENT_ID',
    },
    clientSecret: {
      default: 'client-secret',
      format: String,
      env: 'MYEFREI_OIDC_CLIENT_SECRET',
    },
    discoveryUrl: {
      default: 'https://oauth2service.com/.well-known/openid-configuration',
      format: String,
      env: 'MYEFREI_OIDC_DISCOVERY_URL',
    },
    scopes: {
      default: 'openid profile',
      format: String,
      env: 'MYEFREI_OIDC_SCOPES',
    },
    callbackUri: {
      default: 'https://api.horizon-efrei.fr/auth/myefrei/callback',
      format: String,
      env: 'MYEFREI_OIDC_CALLBACK_URI',
    },
  },
  adminAccount: {
    username: {
      default: 'horizon-admin',
      format: String,
      env: 'ADMIN_ACCOUNT_USERNAME',
    },
    firstName: {
      default: 'Horizon',
      format: String,
      env: 'ADMIN_ACCOUNT_FIRST_NAME',
    },
    lastName: {
      default: 'Admin',
      format: String,
      env: 'ADMIN_ACCOUNT_LAST_NAME',
    },
    password: {
      default: 'root',
      format: String,
      env: 'ADMIN_ACCOUNT_PASSWORD',
    },
  },
}, {
  strict: true,
  verbose: true,
  logger: (message: string) => {
    logger.log(message.replace(/^@golevelup\/profiguration: /g, ''));
  },
  configureEnv: () => ({ files: '.env' }),
});

export const computedConfig = {
  apiUrl: config.get('nodeEnv') === 'development'
    ? `http://localhost:${config.get('port')}`
    : `https://api.${config.get('baseUrl')}`,
  frontendUrl: config.get('nodeEnv') === 'development'
    ? 'http://localhost:3000'
    : `https://${config.get('baseUrl')}`,
} as const;

config.set('cookies.options', {
  signed: true,
  secure: config.get('nodeEnv') === 'production',
  httpOnly: true,
  domain: config.get('nodeEnv') === 'production' ? config.get('baseUrl') : undefined,
});

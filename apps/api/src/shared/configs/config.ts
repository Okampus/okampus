import { createProfiguration } from '@golevelup/profiguration';
import { Logger } from '@nestjs/common';
import type { CookieOptions } from 'express';

interface Config {
  port: number;
  frontendOriginUrl: string;
  baseDomain: string;
  nodeEnv: 'development' | 'production' | 'test';
  productName: string;
  release: string;
  upload: {
    maxSize: number;
    path: string;
  };
  typesense: {
    enabled: boolean;
    apiKey: string;
    host: string;
    port: number;
    scheme: string;
  };
  s3: {
    enabled: boolean;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    region: string;
    buckets: {
      profileImages: string;
      documents: string;
      attachments: string;
      teamFiles: string;
    };
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  sentry: {
    enabled: boolean;
    dsn: string;
  };
  novu: {
    enabled: boolean;
    apiKey: string;
    appId: string;
  };
  tokens: {
    accessTokenSecret: string;
    accessTokenExpirationSeconds: number;
    refreshTokenSecret: string;
    refreshTokenExpirationSeconds: number;
    wsTokenSecret: string;
    wsTokenExpirationSeconds: number;
    botTokenSecret: string;
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
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  anonAccount: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
  settings: {
    metricsCron: string;
  };
}

const logger = new Logger('Configuration');

export const config = createProfiguration<Config>({
  port: {
    default: 8081,
    format: Number,
    env: 'PORT',
  },
  frontendOriginUrl: {
    default: 'localhost',
    format: String,
    env: 'FRONTEND_URL',
  },
  baseDomain: {
    default: 'localhost',
    format: String,
    env: 'BASE_DOMAIN',
  },
  nodeEnv: {
    default: 'development',
    format: ['development', 'production', 'test'],
    env: 'NODE_ENV',
  },
  productName: {
    default: 'demo-tenant',
    format: String,
    env: 'PRODUCT_NAME',
  },
  release: {
    default: '0.1.0-alpha.0',
    format: String,
    env: 'RELEASE',
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
  s3: {
    enabled: {
      default: false,
      format: Boolean,
      env: 'S3_ENABLED',
    },
    accessKeyId: {
      default: 'access-key-id',
      format: String,
      env: 'S3_ACCESS_KEY_ID',
    },
    secretAccessKey: {
      default: 'secret-access-key',
      format: String,
      env: 'S3_SECRET_ACCESS_KEY',
    },
    endpoint: {
      default: 'endpoint',
      format: String,
      env: 'S3_ENDPOINT',
    },
    region: {
      default: 'region',
      format: String,
      env: 'S3_REGION',
    },
    buckets: {
      profileImages: {
        default: 'profile-images',
        format: String,
        env: 'S3_BUCKET_NAME_PROFILE_IMAGES',
      },
      documents: {
        default: 'documents',
        format: String,
        env: 'S3_BUCKET_NAME_DOCUMENTS',
      },
      attachments: {
        default: 'attachments',
        format: String,
        env: 'S3_BUCKET_NAME_ATTACHMENTS',
      },
      teamFiles: {
        default: 'team-files',
        format: String,
        env: 'S3_BUCKET_NAME_TEAM_FILES',
      },
    },
  },
  redis: {
    host: {
      default: 'localhost',
      format: String,
      env: 'REDIS_HOST',
    },
    port: {
      default: 6379,
      format: Number,
      env: 'REDIS_PORT',
    },
    password: {
      default: '',
      format: String,
      env: 'REDIS_PASSWORD',
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
  novu: {
    enabled: {
      default: false,
      format: Boolean,
      env: 'NOVU_ENABLED',
    },
    apiKey: {
      default: 'api-key',
      format: String,
      env: 'NOVU_API_KEY',
    },
    appId: {
      default: 'app-id',
      format: String,
      env: 'NOVU_APP_ID',
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
    wsTokenSecret: {
      default: 'secret',
      format: String,
      env: 'WS_TOKEN_SECRET',
    },
    wsTokenExpirationSeconds: {
      default: 30,
      format: Number,
      env: 'WS_TOKEN_EXPIRATION_SECONDS',
    },
    botTokenSecret: {
      default: 'secret',
      format: String,
      env: 'BOT_TOKEN_SECRET',
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
      default: 'https://api.okampus.fr/auth/myefrei/callback',
      format: String,
      env: 'MYEFREI_OIDC_CALLBACK_URI',
    },
  },
  adminAccount: {
    username: {
      default: 'okampus-admin',
      format: String,
      env: 'ADMIN_ACCOUNT_USERNAME',
    },
    email: {
      default: 'admin@okampus.fr',
      format: String,
      env: 'ADMIN_ACCOUNT_EMAIL',
    },
    firstName: {
      default: 'Okampus',
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
  anonAccount: {
    username: {
      default: 'anon',
      format: String,
      env: 'ANON_ACCOUNT_USERNAME',
    },
    email: {
      default: 'anon@okampus.fr',
      format: String,
      env: 'ANON_ACCOUNT_EMAIL',
    },
    firstName: {
      default: 'Anonyme',
      format: String,
      env: 'ANON_ACCOUNT_FIRST_NAME',
    },
    lastName: {
      default: '',
      format: String,
      env: 'ANON_ACCOUNT_LAST_NAME',
    },
    password: {
      default: 'root',
      format: String,
      env: 'ANON_ACCOUNT_PASSWORD',
    },
  },
  settings: {
    metricsCron: {
      default: '*/15 * * * *',
      format: String,
      env: 'METRICS_CRON',
    },
  },
}, {
  verbose: true,
  logger: (message: string) => {
    logger.log(message.replace(/^@golevelup\/profiguration: /g, ''));
  },
  configureEnv: () => ({ files: '.env' }),
});

export const computedConfig = {
  apiUrl: config.get('nodeEnv') === 'development'
    ? `http://localhost:${config.get('port')}`
    : `https://api.${config.get('baseDomain')}`,
  frontendUrl: config.get('nodeEnv') === 'development'
    ? 'http://localhost:5173'
    : `https://${config.get('frontendOriginUrl')}`,
} as const;

config.set('cookies.options', {
  signed: true,
  secure: config.get('nodeEnv') === 'production',
  httpOnly: true,
  // eslint-disable-next-line no-undefined
  domain: config.get('nodeEnv') === 'production' ? `.${config.get('baseDomain')}` : undefined,
});

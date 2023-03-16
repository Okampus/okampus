import type { TokenType } from '@okampus/shared/enums';

export type ApiConfig = {
  readonly nodeEnv: string;
  readonly env: {
    readonly isDev: () => boolean;
    readonly isProd: () => boolean;
    readonly isTest: () => boolean;
  };
  readonly release: string;
  readonly network: {
    readonly port: number;
    readonly frontendOriginUrl: string;
    readonly baseDomain: string;
    readonly apiUrl: string;
    readonly frontendUrl: string;
  };
  readonly upload: {
    readonly localPath: string;
    readonly localPrefix: string;
  };
  readonly meilisearch: {
    readonly enabled: boolean;
    readonly host: string;
    readonly apiKey: string;
  };
  readonly database: {
    readonly seed: boolean;
    readonly name: string;
    readonly user: string;
    readonly password: string;
  };
  readonly s3: {
    readonly enabled: boolean;
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
    readonly endpoint: string;
    readonly region: string;
    readonly buckets: {
      readonly Attachments: string;
      readonly OrgDocuments: string;
      readonly OrgImages: string;
      readonly OrgVideos: string;
      readonly UserImages: string;
    };
  };
  readonly redis: {
    readonly enabled: boolean;
    readonly host: string;
    readonly port: number;
    readonly password: string;
  };
  readonly sentry: {
    readonly enabled: boolean;
    readonly dsn: string;
  };
  readonly novu: {
    readonly enabled: boolean;
    readonly apiKey: string;
    readonly appId: string;
  };
  readonly tokens: {
    readonly issuer: string;
    readonly secrets: {
      readonly [TokenType.Access]: string;
      readonly [TokenType.Refresh]: string;
      readonly [TokenType.WebSocket]: string;
      readonly [TokenType.Bot]: string;
    };
    readonly expirations: {
      readonly [TokenType.Access]: number;
      readonly [TokenType.Refresh]: number;
      readonly [TokenType.WebSocket]: number;
    };
  };
  readonly cookies: {
    readonly names: {
      readonly [TokenType.MeiliSearch]: string;
      readonly [TokenType.Access]: string;
      readonly [TokenType.Refresh]: string;
      readonly [TokenType.WebSocket]: string;
      readonly AccessExpiration: string;
      readonly RefreshExpiration: string;
    };
    readonly signature: string;
    readonly options: {
      readonly signed: boolean;
      readonly secure: boolean;
      readonly path: string;
      readonly httpOnly: boolean;
      readonly domain: string | undefined;
      readonly sameSite: boolean | 'lax' | 'strict' | 'none';
    };
  };
  readonly session: {
    readonly secret: string;
  };
  readonly cryptoSecret: string;
  readonly adminAccountPassword: string;
  readonly baseTenant: {
    readonly name: string;
    readonly oidc: {
      readonly enabled: boolean;
      readonly name: string;
      readonly clientId: string;
      readonly clientSecret: string;
      readonly discoveryUrl: string;
      readonly scopes: string;
      readonly callbackUri: string;
    };
  };
  readonly settings: {
    readonly metricsCron: string;
  };
};

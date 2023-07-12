import type { Buckets, TokenType } from '@okampus/shared/enums';

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
    readonly hasuraUrl: string;
    readonly frontendUrl: string;
  };
  readonly upload: {
    readonly localPath: string;
    readonly localPrefix: string;
  };
  readonly meilisearch: {
    readonly isEnabled: boolean;
    readonly host: string;
    readonly apiKey: string;
  };
  readonly textract: {
    readonly accessKey: string;
    readonly secretKey: string;
    readonly region: string;
  };
  readonly geoapify: {
    readonly apiKey: string;
  };
  readonly google: {
    readonly customSearchApiKey: string;
  };
  readonly insee: {
    readonly apiToken: string;
  };
  readonly database: {
    readonly isSeeding: boolean;
    readonly host: string;
    readonly name: string;
    readonly user: string;
    readonly password: string;
  };
  readonly s3: {
    readonly isEnabled: boolean;
    readonly accessKey: string;
    readonly secretKey: string;
    readonly endPoint: string;
    readonly region: string;
    readonly buckets: Record<Buckets, string>;
  };
  readonly redis: {
    readonly isEnabled: boolean;
    readonly host: string;
    readonly port: number;
    readonly password: string;
  };
  readonly sentry: {
    readonly isEnabled: boolean;
    readonly dsn: string;
  };
  readonly novu: {
    readonly isEnabled: boolean;
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
  readonly jwt: {
    readonly algorithm: string;
    readonly hasuraSecret: string;
  };
  readonly pepperSecret: string;
  readonly hasuraAdminSecret: string;
  readonly baseTenant: {
    readonly name: string;
    readonly adminPassword: string;
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

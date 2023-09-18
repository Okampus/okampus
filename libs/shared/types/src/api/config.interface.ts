import type { BucketNames, TokenType } from '@okampus/shared/enums';

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
  readonly meilisearch: {
    readonly host: string;
    readonly apiKey: string;
  };
  readonly textract: {
    readonly accessKey: string;
    readonly secretKey: string;
    readonly region: string;
  };
  readonly geoapify: {
    readonly isEnabled: boolean;
    readonly apiKey: string;
  };
  readonly google: {
    readonly customSearchApiKey: string;
  };
  readonly insee: {
    readonly apiToken: string;
  };
  readonly database: {
    readonly host: string;
    readonly name: string;
    readonly user: string;
    readonly password: string;
    readonly port: number;
    readonly isSeeding: boolean;
  };
  readonly s3: {
    readonly isLocal: boolean;
    readonly credentials: {
      readonly accessKeyId: string;
      readonly secretAccessKey: string;
    };
    readonly endpoint: string;
    readonly region: string;
    readonly bucketNames: Record<BucketNames, string>;
    readonly bucketSeeding: string;
  };
  readonly redis: {
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
    readonly adminPassword: string;
    readonly domain: string;
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

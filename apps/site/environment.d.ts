declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      BASE_ADMIN_PASSWORD: string;
      PASSWORD_PEPPER_SECRET: string;
      REFRESH_PEPPER_SECRET: string;
      IRON_SESSION_SECRET: string;
      JWT_ALGORITHM: 'HS256' | 'HS384' | 'HS512';
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

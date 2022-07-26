export interface Configuration {
  env: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cookie: {
    secret: string;
  };
  baseUrl: string;
  redis: {
    url: string;
  };
}

export const configuration = (): Configuration => ({
  env: process.env.NODE_ENV as string,
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET as string,
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  baseUrl: process.env.BASE_URL as string,
});

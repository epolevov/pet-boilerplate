const config = {
  transporter: {
    type: 'Redis',
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || null,
      name: process.env.REDIS_NAME || 'pet-boilerplate',
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'pet-boilerplate:',
      role: process.env.REDIS_ROLE || 'master',
      ...(process.env.REDIS_TLS_CA
        ? {
            tls: {
              ca: process.env.REDIS_TLS_CA,
            },
          }
        : {}),
    },
  },
  mikroORM: {
    connection: {
      type: 'postgresql',
      host: process.env.POSTGRES_HOST || 'localhost',
      user: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      port: process.env.POSTGRES_PORT || 5432,
      ssl: process.env.POSTGRES_SSL || false,
      db: process.env.POSTGRES_DB || 'development',
    },
    options: {
      pool: { min: 0, max: 5 },
      acquireConnectionTimeout: 10000,
    },
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
    endpoint: process.env.S3_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  },
  bucket: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' || true,
    bucket: process.env.S3_BUCKET || 'pet-boilerplate-storage',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    name: process.env.REDIS_NAME || 'pet-boilerplate',
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'pet-boilerplate:',
    role: process.env.REDIS_ROLE || 'master',
    ...(process.env.REDIS_TLS_CA
      ? {
          tls: {
            ca: process.env.REDIS_TLS_CA,
          },
        }
      : {}),
  },
  jwtSecret: process.env.JWT_SECRET,
  encryptSecret: process.env.ENCRYPT_SECRET,
};

export default config;

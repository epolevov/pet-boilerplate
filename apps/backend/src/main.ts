import { ServiceBroker } from 'moleculer';
import Redis, { RedisOptions } from 'ioredis';

// Import model
import Model from './model';

// Import config
import config from './config';

// Migrations
import processMigration from './model/migration';

// Import services
import ApiService from './services/api.service';
import AuthService from './services/auth.service';
import UserAccountService from './services/account.service';
// ... import your services

(async function () {
  await processMigration();

  // Define broker
  const broker = new ServiceBroker({
    transporter: config.transporter,
    hotReload: process.env.NODE_ENV === 'development',
    validator: true,
    middlewares: [
      {
        async created(service) {
          if (!config.jwtSecret) {
            throw Error(
              'Configuration error: JWT_SECRET is missing in environment variables.'
            );
          }

          if (!config.encryptSecret) {
            throw Error(
              'Configuration error: ENCRYPT_SECRET is missing in environment variables.'
            );
          }

          // Configure database model
          const db = new Model();
          await db.configure();
          service.db = db;

          // Configure redis
          const redis = new Redis(config.redis as RedisOptions);
          service.redis = redis;
        },
      },
    ],
  });

  // Load services
  broker.createService(ApiService);
  broker.createService(AuthService);
  broker.createService(UserAccountService);
  // ... initialize your services

  // Start broker
  broker.start();
})();

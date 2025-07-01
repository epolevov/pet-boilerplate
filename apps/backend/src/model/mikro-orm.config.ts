import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import config from '../config';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import path from 'path';
import { Options } from '@mikro-orm/core';

// Import schemas
import * as UserEntities from './schema/user';
import { Errors } from 'moleculer';

export const entities = [UserEntities.Account];

export const getPostgresqlUri = () => {
  return `postgresql://${config.mikroORM.connection.user}:${config.mikroORM.connection.password}@${config.mikroORM.connection.host}:${config.mikroORM.connection.port}/${config.mikroORM.connection.db}?ssl=${config.mikroORM.connection.ssl}`;
};

const mikroOrmConfigure: Options<PostgreSqlDriver> = {
  entities,
  driver: PostgreSqlDriver,
  dbName: config.mikroORM.connection.db,
  clientUrl: getPostgresqlUri(),
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: path.join(__dirname, './migrations'),
    pathTs: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: true, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },

  seeder: {
    path: path.join(__dirname, './seeders'), // path to the folder with seeders
    pathTs: undefined, // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },

  extensions: [SeedManager, Migrator],

  findOneOrFailHandler: (entityName: string) =>
    new Errors.MoleculerError(
      `${entityName} not found`,
      404,
      `${entityName.toUpperCase()}_NOT_FOUND`
    ),
};

export default mikroOrmConfigure;

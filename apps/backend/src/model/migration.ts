import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfigure from './mikro-orm.config';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';

export const migrationsUp = async () => {
  try {
    console.log(`🏃 Starting migration up...`);

    const orm = await MikroORM.init(mikroOrmConfigure);

    const migrator = orm.getMigrator();

    await migrator.up();

    await orm.close(true);

    console.log(`🆗 Completed!`);
  } catch (error) {
    console.log(`❌ Failed migration`, error);
  }
};

export const seedsUp = async () => {
  try {
    console.log(`🏃 Starting seeds...`);

    const orm = await MikroORM.init(mikroOrmConfigure);

    const seeder = orm.getSeeder();

    await seeder.seed(DatabaseSeeder);

    await orm.close(true);
    console.log(`🆗 Seeds completed!`);
  } catch (error) {
    console.error(`❌ Seeds failed`, error);
  }
};

async function processMigration() {
  await migrationsUp();
  await seedsUp();
}

export default processMigration;

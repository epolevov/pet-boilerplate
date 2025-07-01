import { MikroORM } from '@mikro-orm/postgresql';
import mikroOrmConfigure from './mikro-orm.config';
import { Account } from './schema/user';
import BaseModel, {
  CountOptions,
  CreateOptions,
  FindAndCountOptions,
  FindOptions,
  RemoveOptions,
  UpdateOptions,
} from './base-model';

class Model extends BaseModel {
  private orm: MikroORM;

  async configure() {
    this.orm = await MikroORM.init(mikroOrmConfigure);
  }

  async getFork() {
    return this.orm.em.fork();
  }

  // Account User

  async countAccounts(options: CountOptions) {
    const em = this.orm.em.fork();
    const data = await this.count(Account, options, em);
    return data;
  }

  async findAccount(options: FindOptions) {
    const em = this.orm.em.fork();
    const data = await this.find(Account, options, em);
    return data;
  }

  async findAccounts(options: FindAndCountOptions) {
    const em = this.orm.em.fork();
    const data = await this.findAndCount(Account, options, em);
    return data;
  }

  async createAccount(options: CreateOptions) {
    const em = this.orm.em.fork();
    const data = await this.create(Account, options, em);

    return data;
  }

  async updateAccount(options: UpdateOptions) {
    const em = this.orm.em.fork();
    const data = await this.update(Account, options, em);

    return data;
  }

  async removeAccount(options: RemoveOptions) {
    const em = this.orm.em.fork();
    const data = await this.remove(options, em);

    return data;
  }

  // ... Your schema methods
}

export default Model;

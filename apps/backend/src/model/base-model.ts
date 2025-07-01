import {
  EntityName,
  MikroORM,
  Populate,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './schema/base.entity';
import { Errors } from 'moleculer';

export type CreateOptions = {
  parentEm?: MikroORM['em'];
  payload: Record<string, any>;
};

export type UpdateOptions = {
  parentEm?: MikroORM['em'];
  item: BaseEntity;
  payload: Record<string, any>;
};

export type FindOptions = {
  parentEm?: MikroORM['em'];
  requiredFail?: boolean;
  cache?: [string, number];
  where: Record<string, any>;
  populate?: Populate<any, any>;
  orderBy?: Record<string, 'ASC' | 'DESC'>;
};

export type FindAndCountOptions = {
  parentEm?: MikroORM['em'];
  cache?: [string, number];
  where: Record<string, any>;
  offset?: number;
  limit?: number;
  orderBy?: Record<string, 'ASC' | 'DESC'>;
  exclude?: never[];
  populate?: Populate<any, any>;
};

export type CountOptions = {
  parentEm?: MikroORM['em'];
  cache?: [string, number];
  where: Record<string, any>;
};

export type RemoveOptions = {
  parentEm?: MikroORM['em'];
  item?: BaseEntity;
};

export type ListOptions = {
  parentEm?: MikroORM['em'];
  where: Record<string, any>;
  cache?: [string, number];
};

class BaseModel {
  async find<T = BaseEntity>(
    model: EntityName<T>,
    options: FindOptions,
    em: MikroORM['em']
  ): Promise<T> {
    const {
      parentEm = null,
      requiredFail = false,
      cache = null,
      where = {},
      populate = [],
      orderBy = {},
    } = options;

    em = parentEm || em;

    const data = await em[requiredFail ? 'findOneOrFail' : 'findOne'](
      model as EntityName<any>,
      where,
      {
        cache,
        populate,
        orderBy,
      }
    );

    return data;
  }

  async count<T = BaseEntity>(
    model: EntityName<T>,
    options: FindOptions,
    em: MikroORM['em']
  ): Promise<number> {
    const { parentEm = null, cache = null, where = {} } = options;

    em = parentEm || em;

    const count = await em.count(model as EntityName<any>, where, {
      cache,
    });

    return count;
  }

  async findAndCount<T = BaseEntity>(
    model: EntityName<T>,
    options: FindAndCountOptions,
    em: MikroORM['em']
  ): Promise<{ items: T[]; count: number; nextOffset?: number }> {
    const {
      parentEm = null,
      cache = null,
      where = {},
      offset = 0,
      limit = 100,
      orderBy = { createdAt: 'DESC' },
      exclude = [],
      populate = [],
    } = options;

    em = parentEm || em;

    const [items, count] = await em.findAndCount(
      model as EntityName<any>,
      where,
      {
        cache,
        offset,
        limit,
        orderBy,
        exclude,
        populate,
      }
    );

    const nextOffset = offset + limit;

    return {
      items: items as T[],
      count,
      nextOffset: count > nextOffset ? nextOffset : null,
    };
  }

  async create<T = BaseEntity>(
    model: EntityName<T>,
    options: CreateOptions,
    em: MikroORM['em']
  ) {
    try {
      const { parentEm = null, payload } = options;

      em = parentEm || em;

      const emCreated = em.create(model as EntityName<BaseEntity>, payload);
      await em.persistAndFlush(emCreated);

      const created = await this.find(
        model,
        {
          where: {
            _id: emCreated._id,
          },
        },
        em
      );

      return created;
    } catch (error) {
      console.error(error);

      if (error instanceof UniqueConstraintViolationException) {
        throw new Errors.MoleculerError(
          'Duplicate entry',
          409,
          'DUPLICATE_ENTRY',
          {
            detail: error.message,
          }
        );
      }

      throw new Errors.MoleculerError('Database error', 500, 'DB_ERROR', {
        detail: error.message,
      });
    }
  }

  async update<T = BaseEntity>(
    model: EntityName<T>,
    options: UpdateOptions,
    em: MikroORM['em']
  ) {
    try {
      const { parentEm = null, item, payload } = options;

      em = parentEm || em;

      const result = wrap(item).assign(payload, {
        em,
        updateNestedEntities: true,
        mergeObjectProperties: true,
      });

      await em.persistAndFlush(result);

      const updated = await this.find(
        model,
        {
          where: {
            _id: item._id,
          },
        },
        em
      );

      return updated;
    } catch (error) {
      console.error(error);

      if (error instanceof UniqueConstraintViolationException) {
        throw new Errors.MoleculerError(
          'Duplicate entry',
          409,
          'DUPLICATE_ENTRY',
          {
            detail: error.message,
          }
        );
      }

      throw new Errors.MoleculerError('Database error', 500, 'DB_ERROR', {
        detail: error.message,
      });
    }
  }

  async remove(options: RemoveOptions, em: MikroORM['em']) {
    const { parentEm = null, item } = options;

    em = parentEm || em;

    await em.removeAndFlush(item);

    return { removed: true };
  }
}

export default BaseModel;

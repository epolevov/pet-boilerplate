import { DateTimeType, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import * as uuid from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: UuidType })
  _id = uuid.v4();

  @Property({ type: DateTimeType })
  createdAt = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date(), nullable: true })
  updatedAt = null;
}

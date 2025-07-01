import {
  BooleanType,
  DateTimeType,
  Entity,
  Enum,
  EnumType,
  Property,
  StringType,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

export enum UserRole {
  Owner = 'owner',
  Supervisor = 'supervisor',
  User = 'user',
  System = 'system',
}

@Entity()
@Unique({ properties: ['email'] })
export class Account extends BaseEntity {
  @Property({ type: StringType })
  email!: string;

  @Enum({
    type: EnumType,
    items: () => UserRole,
  })
  role!: UserRole;

  @Property({ type: StringType, length: 500 })
  passwordHash!: string;

  @Property({ type: BooleanType, default: true })
  isActive?: boolean;

  @Property({ persist: false })
  get fullName(): string {
    if (this.lastName && this.firstName && this.patronymicName) {
      return `${this.lastName} ${this.firstName.charAt(
        0
      )}.${this.patronymicName.charAt(0)}.`;
    }
    if (this.lastName && this.firstName) {
      return `${this.lastName} ${this.firstName.charAt(0)}.`;
    }
    if (this.lastName) {
      return this.lastName;
    }
    if (this.firstName && this.patronymicName) {
      return `${this.firstName} ${this.patronymicName}`;
    }
    if (this.firstName) {
      return this.firstName;
    }
    if (this.patronymicName) {
      return this.patronymicName;
    }
    return '';
  }

  @Property({ type: StringType, nullable: true })
  firstName?: string;

  @Property({ type: StringType, nullable: true })
  lastName?: string;

  @Property({ type: StringType, nullable: true })
  patronymicName?: string;

  @Property({ type: DateTimeType, nullable: true })
  lastLoginAt?: Date;
}

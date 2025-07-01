import { Migration } from '@mikro-orm/migrations';

export class Migration20250701184855 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "account" ("_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "email" varchar(255) not null, "role" text check ("role" in ('owner', 'supervisor', 'user', 'system')) not null, "password_hash" varchar(500) not null, "is_active" boolean not null default true, "first_name" varchar(255) null, "last_name" varchar(255) null, "patronymic_name" varchar(255) null, "last_login_at" timestamptz null, constraint "account_pkey" primary key ("_id"));`);
    this.addSql(`alter table "account" add constraint "account_email_unique" unique ("email");`);
  }

}

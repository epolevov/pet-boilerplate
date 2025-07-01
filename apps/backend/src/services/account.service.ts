import bcrypt from 'bcryptjs';
import { checkAuth, checkRole } from '../hooks/auth';
import { CreateOptions, FindOptions, ListOptions } from '../model/base-model';
import { Account, UserRole } from '../model/schema/user';
import Model from '../model';
import { Errors } from 'moleculer';

const UserAccountService = {
  name: 'account',
  mixins: [],
  actions: {
    createAccount: {
      strict: true,
      params: {
        email: { type: 'email', normalize: true, max: 255 },
        role: { type: 'enum', values: Object.values(UserRole) },
        isActive: { type: 'boolean', optional: true, default: true },
        firstName: { type: 'string', optional: true, nullable: true, max: 100 },
        lastName: { type: 'string', optional: true, nullable: true, max: 100 },
        patronymicName: {
          type: 'string',
          optional: true,
          nullable: true,
          max: 100,
        },
      },
      async handler(ctx) {
        const passwordHash = await bcrypt.hash(ctx.params.password, 12);

        const account = await this.broker.db.createAccount({
          payload: {
            email: ctx.params.email,
            password: ctx.params.password,
            firstName: ctx.params.firstName,
            lastName: ctx.params.lastName,
            role: ctx.params.role,
            passwordHash,
          },
        } as CreateOptions);

        return this.removeUnsafeFields(account);
      },
    },

    updateAccount: {
      hooks: {
        before: [checkAuth],
      },
      strict: true,
      params: {
        email: { type: 'email', normalize: true, max: 255, optional: true },
        firstName: { type: 'string', optional: true, max: 100 },
        lastName: { type: 'string', optional: true, max: 100 },
        patronymicName: {
          type: 'string',
          optional: true,
          max: 100,
        },
        oldPassword: {
          type: 'string',
          optional: true,
        },
        newPassword: {
          type: 'string',
          optional: true,
        },
      },
      async handler(ctx) {
        const account = ctx.meta.user;

        const payload: Record<string, string> = {};

        if (ctx.params.email && ctx.params.email !== account.email) {
          const existEmail = await (this.broker.db as Model).findAccount({
            where: {
              email: ctx.params.email,
            },
            requiredFail: false,
          });

          if (existEmail) {
            throw new Errors.MoleculerError(
              'A user with this email is already registered',
              409,
              'ACCOUNT_EXISTS'
            );
          }

          payload.email = ctx.params.email;
        }

        if (ctx.params.lastName !== undefined) {
          payload.lastName = ctx.params.lastName;
        }

        if (ctx.params.firstName !== undefined) {
          payload.firstName = ctx.params.firstName;
        }

        if (ctx.params.patronymicName !== undefined) {
          payload.patronymicName = ctx.params.patronymicName;
        }

        if (ctx.params.newPassword && ctx.params.oldPassword) {
          const isMatch = await bcrypt.compare(
            ctx.params.oldPassword,
            account.passwordHash
          );

          if (!isMatch) {
            throw new Errors.MoleculerError(
              'Incorrect old password',
              400,
              'ACCOUNT_INCORRECT_OLD_PASSWORD'
            );
          }
          const passwordHash = await bcrypt.hash(ctx.params.newPassword, 12);

          payload.passwordHash = passwordHash;
        }

        const updated = await (this.broker.db as Model).updateAccount({
          item: account,
          payload,
        });

        return this.removeUnsafeFields(updated);
      },
    },

    getAccountInternal: {
      async handler(ctx) {
        if (!['auth'].includes(ctx.caller) && !ctx.meta.ignoreCallerCheck) {
          throw new Error('Access denied: Unauthorized service');
        }

        return await this.broker.db.findAccount({
          where: {
            ...ctx.params,
          },
          populate: [],
        } as FindOptions);
      },
    },

    getAccount: {
      hooks: { before: [checkRole([UserRole.Owner, UserRole.Supervisor])] },
      params: {
        _id: { type: 'string' },
      },
      async handler(ctx) {
        ctx.meta.ignoreCallerCheck = true;
        return this.actions.getAccountInternal(ctx.params, {
          meta: ctx.meta,
        });
      },
    },

    getAccounts: {
      hooks: {
        before: [checkRole([UserRole.Owner, UserRole.Supervisor])],
      },
      params: {
        where: { type: 'object', default: {} },
        offset: { type: 'number', convert: true, default: 0 },
        limit: { type: 'number', convert: true, default: 100, max: 100 },
        orderKey: { type: 'string', optional: true, default: 'createdAt' },
        orderSort: { type: 'string', optional: true, default: 'DESC' },
      },
      strict: true,
      async handler(ctx) {
        const data = await this.broker.db.findAccounts({
          where: {
            ...ctx.params.where,
          },
          limit: ctx.params.limit,
          offset: ctx.params.offset,
          orderBy: { [ctx.params.orderKey]: ctx.params.orderSort },
          exclude: ['passwordHash'],
        } as ListOptions);

        return data;
      },
    },
  },
  methods: {
    removeUnsafeFields(account: Account) {
      delete account.passwordHash;

      return account;
    },
  },
};

export default UserAccountService;

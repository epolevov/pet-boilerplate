import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Errors } from 'moleculer';
import { Account, UserRole } from '../model/schema/user';
import { checkAuth } from '../hooks/auth';
import config from '../config';

const AuthService = {
  name: 'auth',
  mixins: [],
  actions: {
    getDataByBearerToken: {
      params: {
        token: { type: 'string' },
      },
      strict: true,
      async handler(ctx) {
        const jwtData = jwt.verify(ctx.params.token, config.jwtSecret);

        return await ctx.call('account.getAccountInternal', {
          _id: jwtData.id,
        });
      },
    },
    login: {
      params: {
        email: { type: 'email' },
        password: { type: 'string' },
      },
      strict: true,
      async handler(ctx) {
        const account = await ctx.call('account.getAccountInternal', {
          email: ctx.params.email,
        });

        if (!account) {
          throw new Errors.MoleculerError(
            'Incorrect email or password',
            401,
            'ACCOUNT_UNAUTHORIZED'
          );
        }

        const isMatch = await bcrypt.compare(
          ctx.params.password,
          account.passwordHash
        );

        if (!isMatch) {
          throw new Errors.MoleculerError(
            'Incorrect email or password',
            401,
            'ACCOUNT_UNAUTHORIZED'
          );
        }

        const tokens = this.generateTokens(account._id, account.role);

        return { accessToken: tokens.accessToken, role: account.role };
      },
    },

    register: {
      params: {
        email: { type: 'email', normalize: true, max: 255 },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      strict: true,
      async handler(ctx) {
        const account = await ctx.call('account.getAccountInternal', {
          email: ctx.params.email,
        });

        if (account) {
          throw new Errors.MoleculerError(
            'A user with this email is already registered',
            409,
            'ACCOUNT_EXISTS'
          );
        }

        const created = await ctx.call('account.createAccount', {
          email: ctx.params.email,
          password: ctx.params.password,
          firstName: ctx.params.firstName,
          lastName: ctx.params.lastName,
          role: UserRole.User,
        });

        const tokens = this.generateTokens(created._id, created.role);

        return { accessToken: tokens.accessToken, role: created.role };
      },
    },

    me: {
      hooks: {
        before: [checkAuth],
      },
      handler(ctx) {
        return this.removeUnsafeFields(ctx.meta.user);
      },
    },
  },

  methods: {
    removeUnsafeFields(account: Account) {
      delete account.passwordHash;

      return account;
    },
    generateTokens(userId, role) {
      const accessToken = jwt.sign({ id: userId, role }, config.jwtSecret, {
        expiresIn: '1d',
      });

      return { accessToken };
    },
  },
};

export default AuthService;

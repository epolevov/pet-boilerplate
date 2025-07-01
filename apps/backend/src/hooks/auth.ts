import { UserRole } from '../model/schema/user';

import { Errors } from 'moleculer';

export const checkRole = (role: UserRole | UserRole[]) => {
  return async function (ctx) {
    const roles = Array.isArray(role) ? role : [role];

    if (!ctx.meta.user || !roles.includes(ctx.meta.user.role)) {
      throw new Errors.MoleculerError(
        'You do not have permission',
        403,
        'PERMISSION_FORBIDDEN'
      );
    }
  };
};

export const checkAuth = function (ctx) {
  if (!ctx.meta.user) {
    throw new Errors.MoleculerError(
      'Authentication required',
      401,
      'ACCOUNT_UNAUTHORIZED'
    );
  }
};

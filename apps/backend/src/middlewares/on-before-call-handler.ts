import { Errors } from 'moleculer';

export async function onBeforeCall(ctx, route, req, res) {
  // Check authorization

  const authHeader = req.headers?.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader?.split(' ')[1];

    try {
      ctx.meta.user = await ctx.call('auth.getDataByBearerToken', {
        token,
      });
    } catch {
      throw new Errors.MoleculerError(
        'Invalid or expired token',
        401,
        'ACCOUNT_UNAUTHORIZED'
      );
    }
  }

  ctx.meta.$request = req;
  ctx.meta.$response = res;
}

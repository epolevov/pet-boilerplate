import ApiGwService from 'moleculer-web';
import { onError } from '../middlewares/error-handler';
import { onBeforeCall } from '../middlewares/on-before-call-handler';

const ApiService = {
  name: 'api',
  mixins: [ApiGwService],
  settings: {
    port: 8080,
    cors: {
      origin: '*',
      credentials: true,
    },
    routes: [
      {
        onError,
        onBeforeCall,
        path: '/v1/users',
        aliases: {
          'POST   /': 'auth.register',
          'GET    /me': 'auth.me',
          'PATCH  /me': 'account.updateAccount',
        },
      },
      {
        onError,
        onBeforeCall,
        path: '/v1/sessions',
        aliases: {
          'POST   /': 'auth.login',
          'DELETE /': 'auth.logout',
        },
      },
    ],
  },
  actions: {},
};

export default ApiService;

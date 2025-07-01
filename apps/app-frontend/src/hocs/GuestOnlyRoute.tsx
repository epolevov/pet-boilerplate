import { useCallback, useEffect } from 'react';
import { ChildrenType } from '../@core/types/react';
import HomeRedirect from '../components/redirects/HomeRedirect';
import authConfig from '../configs/authConfig';
import { patchAxiosAuthorization } from '../@core/utils/userToken';
import authMeStore, { getAuthMe, setLoading } from '../store/auth/me';
import { useStoreMap } from 'effector-react';
import Preloader from '../components/Preloader';

export default function GuestOnlyRoute({ children }: ChildrenType) {
  const data = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.data,
  });
  const loading = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.loading,
  });

  const init = useCallback(async () => {
    try {
      const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

      patchAxiosAuthorization(token);

      if (!data && token) {
        await getAuthMe();
      }
    } catch (error) {
      patchAxiosAuthorization(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <Preloader />;
  }

  return !data ? children : <HomeRedirect />;
}

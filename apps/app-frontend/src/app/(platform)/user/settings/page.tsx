import Preloader from '../../../../components/Preloader';
import authMeStore from '../../../../store/auth/me';
import { AccountSettingsForm } from '../../../../widgets/AccountSettings';
import { useStoreMap } from 'effector-react';

export default function UserSettingsPage() {
  const isLoading = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.loading,
  });

  const data = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.data,
  });

  if (isLoading) {
    return <Preloader />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-center px-6 my-6">
        <AccountSettingsForm
          defaultValues={{
            email: data.email,
            lastName: data.lastName,
            firstName: data.firstName,
            patronymicName: data.patronymicName,
          }}
        />
      </div>
    </div>
  );
}

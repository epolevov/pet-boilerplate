import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getAuthMe, logInUser, signUpUser } from '../../../store/auth/me';
import { patchAxiosAuthorization } from '../../../@core/utils/userToken';
import authConfig from '../../../configs/authConfig';

type FormValuesType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const schema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup.string().required('Required field'),
        lastName: yup.string().required('Required field'),
        email: yup.string().required('Required field'),
        password: yup.string().required('Required field'),
      }),
    []
  );

  const { control, handleSubmit } = useForm<FormValuesType>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true);

      const data = await signUpUser(values);

      window.localStorage.setItem(
        authConfig.storageTokenKeyName,
        data.accessToken
      );

      patchAxiosAuthorization(data.accessToken);

      await getAuthMe();
    } catch {
      toast.error('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center px-6">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-900 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-900  bg-gray-800 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-gray-100">
            Create account
          </h3>
          <p className="text-sm text-gray-400">
            Fill in your information to register
          </p>
        </div>
        <form
          className="flex flex-col space-y-4 bg-gray-800 px-4 py-8 sm:px-16"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs text-gray-400 uppercase"
            >
              Family
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <input
                  id={name}
                  name={name}
                  placeholder=""
                  autoComplete="family-name"
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-900 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  type="text"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-400 uppercase"
            >
              Name
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <input
                  id={name}
                  name={name}
                  placeholder=""
                  autoComplete="given-name"
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-900 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  type="text"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-400 uppercase"
            >
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <input
                  id={name}
                  name={name}
                  placeholder=""
                  autoComplete="email"
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-900 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  type="email"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-400 uppercase"
            >
              Password
            </label>

            <Controller
              name="password"
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <input
                  id={name}
                  name={name}
                  required
                  className="mt-1 block w-full appearance-none rounded-md border border-gray-900 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  type="password"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            aria-disabled="false"
            className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? 'Please, wait...' : 'Create account'}
            <span aria-live="polite" className="sr-only" role="status">
              Create account
            </span>
          </button>
        </form>
      </div>
      <p className="text-center text-sm text-gray-400 mt-4">
        Already registered?{' '}
        <a className="font-semibold text-gray-100" href="/auth">
          Sign in
        </a>
      </p>
    </div>
  );
}

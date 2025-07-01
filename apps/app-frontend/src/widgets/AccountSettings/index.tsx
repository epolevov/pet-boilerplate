import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ErrorResponse } from '../../@core/types/fetch';
import {
  UpdateAccountDTO,
  UpdateAccountRequestDTO,
} from '../../@core/types/account';
import { useStoreMap } from 'effector-react';
import authMeStore, { getAuthMe, updateUser } from '../../store/auth/me';

type FormValues = UpdateAccountDTO;

interface AccountSettingsFormProps {
  defaultValues?: FormValues;
}

export const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  defaultValues,
}) => {
  const isLoading = useStoreMap({
    store: authMeStore,
    keys: [],
    fn: (store) => store.mutationLoading,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues,
  });

  const oldPassword = watch('oldPassword');
  const newPassword1 = watch('newPassword1');

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: UpdateAccountRequestDTO = {};

      if (
        data.oldPassword &&
        data.newPassword1 &&
        data.newPassword2 &&
        data.newPassword1 === data.newPassword2
      ) {
        payload.oldPassword = data.oldPassword;
        payload.newPassword = data.newPassword1;
      }

      payload.lastName = data.lastName;
      payload.firstName = data.firstName;
      payload.patronymicName = data.patronymicName;

      if (data.email) {
        payload.email = data.email;
      }

      await updateUser(payload);
      await getAuthMe();

      toast.success('Аккаунт успешно обновлен!', {
        position: 'bottom-right',
      });
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Неизвестная ошибка');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-lg shadow-md space-y-6"
      noValidate
    >
      <fieldset className="p-4 border border-gray-700 rounded-md">
        <legend className="text-sm font-semibold text-gray-600 mb-2">
          Personal data
        </legend>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-xs text-gray-400 uppercase"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="text"
            {...register('email', { required: 'Введите email' })}
            className={`mt-1 block w-full border ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="Введите Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs text-gray-400 uppercase"
            >
              Family
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className={`mt-1 block w-full border ${
                errors.lastName ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="block text-xs text-gray-400 uppercase"
            >
              Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className={`mt-1 block w-full border ${
                errors.firstName ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="patronymicName"
              className="block text-xs text-gray-400 uppercase"
            >
              Surname
            </label>
            <input
              id="patronymicName"
              type="text"
              {...register('patronymicName')}
              className={`mt-1 block w-full border ${
                errors.patronymicName ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.patronymicName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.patronymicName.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Пароль */}
      <fieldset className="p-4 border border-gray-700 rounded-md">
        <legend className="text-sm font-semibold text-gray-600 mb-2">
          Change password
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-xs text-gray-400 uppercase"
            >
              Old password
            </label>
            <input
              id="oldPassword"
              type="password"
              {...register('oldPassword')}
              className={`mt-1 block w-full border ${
                errors.oldPassword ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword1"
              className="block text-xs text-gray-400 uppercase"
            >
              New Password
            </label>
            <input
              id="newPassword1"
              type="password"
              {...register('newPassword1')}
              className={`mt-1 block w-full border ${
                errors.newPassword2 ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          <div>
            <label
              htmlFor="newPassword2"
              className="block text-xs text-gray-400 uppercase"
            >
              Confirm new password
            </label>
            <input
              id="newPassword2"
              type="password"
              {...register('newPassword2', {
                validate: (value) => {
                  if (oldPassword && value !== newPassword1) {
                    return 'Пароли не совпадают';
                  }
                  return true;
                },
              })}
              className={`mt-1 block w-full border ${
                errors.newPassword2 ? 'border-red-500' : 'border-gray-600'
              } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.newPassword2 && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword2.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-accent text-white font-semibold rounded-md shadow-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConfirmDeleteDialogProps } from '../@core/types/confirm-remove';

interface FormData {
  entityName: string;
  expectedName: string;
}

const validationSchema = yup.object().shape({
  entityName: yup
    .string()
    .required('Field is required')
    .oneOf([yup.ref('expectedName')], 'The value does not match'),
  expectedName: yup.string().required('Field is required'),
});

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  closeDialog,
  onConfirm,
  entityName,
  description = '',
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { entityName: '', expectedName: '' },
  });

  useEffect(() => {
    setValue('expectedName', entityName);
  });

  const onSubmit = () => {
    onConfirm();
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-1005 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-6 mx-10 shadow-2xl border border-gray-700">
        <h2 className="text-lg font-semibold text-white">Confirm deletion</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <p className="text-sm text-gray-300">
            Enter <strong className="text-white">{entityName}</strong> to
            confirm deletion.
          </p>

          {description && (
            <p className="text-sm text-gray-300">{description}</p>
          )}

          <Controller
            name="entityName"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Enter to confirm"
                  autoComplete="off"
                  className={`w-full rounded bg-gray-800 text-white placeholder-gray-500 border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.entityName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-blue-500'
                  }`}
                />
                {errors.entityName && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.entityName.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeDialog}
              className="rounded bg-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;

import { useRef, useEffect, ReactNode } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';

interface TextFieldProps {
  control: Control<any>;
  name: string;
  errors: FieldErrors;
  label?: string;
  placeholder?: string;
  rules?: any;
  disabled?: boolean;
  // Новые пропсы:
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function TextField({
  control,
  name,
  errors,
  label = '',
  placeholder = '',
  rules = {},
  disabled = false,
  icon,
  iconPosition = 'left',
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors[name] && inputRef.current) {
      inputRef.current.focus();
    }
  }, [errors, name]);

  const paddingClass = icon
    ? iconPosition === 'left'
      ? 'pl-10 pr-3'
      : 'pl-3 pr-10'
    : 'px-3';

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-xs text-gray-400 uppercase mb-1"
      >
        {label} {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <input
              disabled={disabled}
              type="text"
              id={name}
              {...field}
              ref={inputRef}
              className={`
                w-full
                rounded-md
                border
                py-2
                text-base
                ${paddingClass}
                ${errors[name] ? 'border-red-500' : 'border-gray-600'}
                focus:outline-2 focus:outline-indigo-600
              `}
              placeholder={placeholder}
            />
          )}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}

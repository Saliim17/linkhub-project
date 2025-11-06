import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id: string;
};

export function Input({ label, id, className = '', ...rest }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full p-3 bg-input-bg border border-input-border rounded-md text-input-text focus:outline-none focus:ring-2 focus:ring-input-focus ${className}`}
        {...rest}
      />
    </div>
  );
}

export default Input;

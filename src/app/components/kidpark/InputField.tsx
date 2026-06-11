import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function InputField({ 
  label, 
  error, 
  required, 
  className = '',
  ...props 
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[#757575] font-nunito font-semibold text-sm">
          {label}
          {required && <span className="text-[#E53935] ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          bg-white
          border
          ${error ? 'border-[#E53935] animate-shake' : 'border-[#BDBDBD]'}
          rounded-lg
          h-11
          px-4
          font-nunito
          text-[#212121]
          focus:outline-none
          focus:border-[#1565C0]
          focus:border-2
          focus:ring-0
          disabled:bg-[#E0E0E0]
          disabled:text-[#9E9E9E]
          disabled:cursor-not-allowed
          transition-colors
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-[#E53935] text-xs font-nunito">{error}</span>
      )}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

export function SelectField({ 
  label, 
  error, 
  required,
  options,
  className = '',
  ...props 
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[#757575] font-nunito font-semibold text-sm">
          {label}
          {required && <span className="text-[#E53935] ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          bg-white
          border
          ${error ? 'border-[#E53935]' : 'border-[#BDBDBD]'}
          rounded-lg
          h-11
          px-4
          font-nunito
          text-[#212121]
          focus:outline-none
          focus:border-[#1565C0]
          focus:border-2
          focus:ring-0
          disabled:bg-[#E0E0E0]
          disabled:text-[#9E9E9E]
          disabled:cursor-not-allowed
          transition-colors
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[#E53935] text-xs font-nunito">{error}</span>
      )}
    </div>
  );
}

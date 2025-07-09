import React from 'react';

interface FormInputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
  max,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 
'use client';

import { forwardRef, useState, ChangeEvent } from 'react';

// ============= ID Input Component =============
// For National ID / Alien ID - numeric, up to 8 digits

interface IDInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const IDInput = forwardRef<HTMLInputElement, IDInputProps>(
  ({ label, helperText, error, onChange, onValidationChange, className = '', value, ...props }, ref) => {
    const [internalError, setInternalError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Only allow numeric characters
      if (inputValue && !/^\d*$/.test(inputValue)) {
        return; // Ignore non-numeric input
      }

      // Limit to 8 digits
      const truncatedValue = inputValue.slice(0, 8);
      
      // Validate
      let validationError = '';
      if (truncatedValue.length > 0 && truncatedValue.length < 6) {
        validationError = 'ID must be at least 6 digits';
      }
      
      setInternalError(validationError);
      onValidationChange?.(!validationError && truncatedValue.length >= 6);
      onChange?.(truncatedValue);
    };

    const displayError = error || internalError;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={8}
          value={value}
          onChange={handleChange}
          placeholder="e.g., 12345678"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent ${
            displayError ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {displayError && (
          <p className="mt-1 text-sm text-red-600">{displayError}</p>
        )}
        {helperText && !displayError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

IDInput.displayName = 'IDInput';


// ============= PIN Input Component =============
// For KRA PIN - alphanumeric, exactly 11 characters (e.g., A012345678Z)

interface PINInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PINInput = forwardRef<HTMLInputElement, PINInputProps>(
  ({ label, helperText, error, onChange, onValidationChange, className = '', value, ...props }, ref) => {
    const [internalError, setInternalError] = useState('');

    const validatePIN = (pin: string): string => {
      if (!pin) return '';
      
      // PIN format: Letter + 9 digits + Letter (e.g., A012345678Z)
      if (pin.length > 0 && pin.length < 11) {
        return 'PIN must be 11 characters';
      }
      
      if (pin.length === 11) {
        // Check format: starts with letter, ends with letter, middle is digits
        const pinRegex = /^[A-Z]\d{9}[A-Z]$/;
        if (!pinRegex.test(pin.toUpperCase())) {
          return 'Invalid PIN format (e.g., A012345678Z)';
        }
      }
      
      return '';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value.toUpperCase();
      
      // Only allow alphanumeric characters
      inputValue = inputValue.replace(/[^A-Z0-9]/g, '');
      
      // Limit to 11 characters
      const truncatedValue = inputValue.slice(0, 11);
      
      // Validate
      const validationError = validatePIN(truncatedValue);
      
      setInternalError(validationError);
      onValidationChange?.(!validationError && truncatedValue.length === 11);
      onChange?.(truncatedValue);
    };

    const displayError = error || internalError;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="text"
          maxLength={11}
          value={value}
          onChange={handleChange}
          placeholder="e.g., A012345678Z"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent font-mono uppercase ${
            displayError ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {displayError && (
              <p className="text-sm text-red-600">{displayError}</p>
            )}
            {helperText && !displayError && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          <span className={`text-xs ${
            (value as string)?.length === 11 ? 'text-green-600' : 'text-gray-400'
          }`}>
            {(value as string)?.length || 0}/11
          </span>
        </div>
      </div>
    );
  }
);

PINInput.displayName = 'PINInput';


// ============= Validation Helpers =============

export const isValidID = (id: string): boolean => {
  if (!id) return false;
  return /^\d{6,8}$/.test(id);
};

export const isValidPIN = (pin: string): boolean => {
  if (!pin || pin.length !== 11) return false;
  return /^[A-Z]\d{9}[A-Z]$/i.test(pin);
};

export const formatPIN = (pin: string): string => {
  return pin.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
};

export const maskPIN = (pin: string): string => {
  if (!pin || pin.length < 4) return pin;
  return `${pin.slice(0, 1)}****${pin.slice(-4)}`;
};

export const maskID = (id: string): string => {
  if (!id || id.length < 4) return id;
  return `${id.slice(0, 4)}****${id.slice(-2)}`;
};

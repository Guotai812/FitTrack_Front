import React from "react";

type InputProps = {
  label: string;
  name: string;
  type: string;
  placeHolder?: string;
  errMsg?: string;
  isValid: boolean;
  isTouched: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  name,
  type,
  placeHolder,
  errMsg,
  isValid,
  isTouched,
  ...rest
}: InputProps) {
  return (
    <div className="h-10">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeHolder}
        {...rest}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {!isValid && isTouched && (
        <p className="text-sm text-red-500">{errMsg}</p>
      )}
    </div>
  );
}

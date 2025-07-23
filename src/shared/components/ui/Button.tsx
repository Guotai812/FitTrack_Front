import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  kind?: "confirm" | "cancel" | "gray";
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  kind,
  className = "",
  disabled = false, // ① pull disabled out
  isLoading = false,
  ...rest
}: ButtonProps) {
  // no hover in here
  let baseClass = isLoading
    ? "bg-gray-300 text-black w-20 h-10 rounded"
    : kind === "confirm"
    ? "bg-green-300 text-black w-20 h-10 rounded"
    : kind === "cancel"
    ? "text-black rounded w-20 h-10"
    : kind === "gray"
    ? "bg-gray-300 text-white rounded w-20 h-10"
    : "";

  // only add this when not disabled
  let hoverClass = !disabled
    ? kind === "confirm"
      ? "hover:text-white"
      : kind === "cancel"
      ? "hover:bg-red-500"
      : kind === "gray"
      ? "hover:bg-gray-400"
      : ""
    : "";

  let disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClass} ${hoverClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

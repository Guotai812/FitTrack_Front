import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  kind?: "confirm" | "cancel";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  kind,
  className = "",
  ...rest
}: ButtonProps) {
  const baseClass =
    kind === "confirm"
      ? "bg-green-300 text-black hover:text-white w-20 h-10 rounded"
      : kind === "cancel"
      ? "text-black hover:bg-red-500 rounded w-20 h-10"
      : "";

  return (
    <button className={`${baseClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}

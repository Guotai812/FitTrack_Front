import type React from "react";

type RatioProps = {
  name: string;
  children: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Ratio({ children, name, ...rest }: RatioProps) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        {...rest}
        className="sr-only peer"
      />
      <span
        className="
        px-4 py-2 text-sm font-medium rounded-full
        text-black
        peer-checked:bg-green-300 peer-checked:text-white
        hover:text-white hover:bg-green-300
        transition
      "
      >
        {children}
      </span>
    </label>
  );
}

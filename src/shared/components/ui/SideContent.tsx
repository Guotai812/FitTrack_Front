import type React from "react";

type SideContentProps = {
  children: React.ReactNode;
};

export default function SideContent({ children }: SideContentProps) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="grid grid-cols-2 grid-rows-2 flex-grow w-full border border-gray-300">
        {children}
      </div>
    </div>
  );
}

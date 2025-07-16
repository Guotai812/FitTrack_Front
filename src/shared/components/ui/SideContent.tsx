import type React from "react";

type SideContentProps = {
  children: React.ReactNode;
};

export default function SideContent({ children }: SideContentProps) {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="grid grid-cols-2 grid-rows-2 h-full">{children}</div>
    </div>
  );
}

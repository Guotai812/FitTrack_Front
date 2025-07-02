import { Outlet } from "react-router-dom";

import TopNavigation from "../components/TopNavigation";

type TopLayoutProps = {
  onShowLogin: () => void;
  onShowSignup: () => void;
};

export default function TopLayout({
  onShowLogin,
  onShowSignup,
}: TopLayoutProps) {
  return (
    <>
      <TopNavigation onShowLogin={onShowLogin} onShowSignup={onShowSignup} />
      <Outlet />
    </>
  );
}

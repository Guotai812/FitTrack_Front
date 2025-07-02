import { Outlet } from "react-router-dom";

import TopNavigation from "../components/TopNavigation";

export default function TopLayout() {
  return (
    <>
      <TopNavigation />
      <Outlet />
    </>
  );
}

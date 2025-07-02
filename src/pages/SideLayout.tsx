import { Outlet } from "react-router-dom";

import SideNavigation from "../components/SideNavigation";

export default function SideLayout() {
  return (
    <>
      <SideNavigation />
      <Outlet />
    </>
  );
}

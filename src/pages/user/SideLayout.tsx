import { Outlet } from "react-router-dom";

import SideNavigation from "../../components/navigation/SideNavigation";

export default function SideLayout() {
  return (
    <>
      <SideNavigation />
      <Outlet />
    </>
  );
}

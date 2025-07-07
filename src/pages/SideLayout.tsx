import { Outlet } from "react-router-dom";
import { useState } from "react";

import SideNavigation from "../components/SideNavigation";
import DataInputModal from "../components/DataInput";

export default function SideLayout() {
  const [showModal, setShowModal] = useState(true);

  function closeModalHandler() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && <DataInputModal onCancelModal={closeModalHandler} />}
      <SideNavigation />
      <Outlet />
    </>
  );
}

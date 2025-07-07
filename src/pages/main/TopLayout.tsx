import { Outlet } from "react-router-dom";

import { useModal } from "../../components/hooks/useModal";

import TopNavigation from "../../components/navigation/TopNavigation";
import { Modal } from "../../components/ui/Modal";
import Auth from "../../components/form/Auth";

export default function TopLayout() {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  return (
    <>
      {show && (
        <Modal onCancel={modalCancelHandler}>
          <Auth onCancelModal={modalCancelHandler} />
        </Modal>
      )}
      <TopNavigation onDisplayModal={modalDisplayHandler} />
      <Outlet />
    </>
  );
}

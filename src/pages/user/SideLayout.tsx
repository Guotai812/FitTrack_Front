const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useHttp from "../../shared/hooks/useHttp";
import { useAuth } from "../../shared/context/AuthContext";
import { useModal } from "../../shared/hooks/useModal";

import SideNavigation from "../../shared/components/navigation/SideNavigation";
import BasicInfo from "../../shared/components/form/Basic";
import { Modal } from "../../shared/components/ui/Modal";

export default function SideLayout() {
  const { sendRequest } = useHttp();
  const auth = useAuth();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  useEffect(() => {
    async function sendHelper() {
      if (!auth.user?.userId) return;
      try {
        const responseData = await sendRequest({
          url: `${baseUrl}/users/${auth.user.userId}`,
        });
        if (!responseData) {
          throw new Error("Could not find this user");
        }
        if (!responseData.user.isCompleted) modalDisplayHandler();
      } catch (err) {
        // TODO: May be can use loader to capture the error
      }
    }
    sendHelper();
  }, [auth]); // TODO: this dependency list will impact how the modal work
  return (
    <>
      {show && (
        <Modal onCancel={modalCancelHandler}>
          <BasicInfo onCancel={modalCancelHandler} />
        </Modal>
      )}

      <SideNavigation />
      <Outlet />
    </>
  );
}

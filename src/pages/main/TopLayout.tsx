import { Outlet } from "react-router-dom";

import { useModal } from "../../shared/hooks/useModal";

import TopNavigation from "../../shared/components/navigation/TopNavigation";
import { Modal } from "../../shared/components/ui/Modal";
import Login from "../../shared/components/form/Login";
import Signup from "../../shared/components/form/Signup";
import { useState } from "react";

export default function TopLayout() {
  const { show, modalCancelHandler } = useModal();
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {show && (
        <Modal onCancel={modalCancelHandler}>
          {isLogin && (
            <Login onCancelModal={modalCancelHandler} setIsLogin={setIsLogin} />
          )}
          {!isLogin && (
            <Signup
              onCancelModal={modalCancelHandler}
              setIsLogin={setIsLogin}
            />
          )}
        </Modal>
      )}
      <TopNavigation />
      <Outlet />
    </>
  );
}

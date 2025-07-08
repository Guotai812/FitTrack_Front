import { Outlet } from "react-router-dom";

import { useModal } from "../../share/hooks/useModal";

import TopNavigation from "../../share/components/navigation/TopNavigation";
import { Modal } from "../../share/components/ui/Modal";
import Login from "../../share/components/form/Login";
import Signup from "../../share/components/form/Signup";
import { useState } from "react";

export default function TopLayout() {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
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
      <TopNavigation
        onDisplayModal={modalDisplayHandler}
        setIsLogin={setIsLogin}
      />
      <Outlet />
    </>
  );
}

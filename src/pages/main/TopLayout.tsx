import { Outlet } from "react-router-dom";

import { useModal } from "../../components/hooks/useModal";

import TopNavigation from "../../components/navigation/TopNavigation";
import { Modal } from "../../components/ui/Modal";
import Login from "../../components/form/Login";
import Signup from "../../components/form/Signup";
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

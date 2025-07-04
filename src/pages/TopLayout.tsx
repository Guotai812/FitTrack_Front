import { Outlet } from "react-router-dom";
import { useState } from "react";

import AuthModal from "../components/Auth";
import TopNavigation from "../components/TopNavigation";

export default function TopLayout() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIslogin] = useState(true);

  function handleShowLogin() {
    setIslogin(true);
    setShowModal(true);
  }

  function handleShowSignup() {
    setIslogin(false);
    setShowModal(true);
  }
  return (
    <>
      {showModal && (
        <AuthModal
          onCancelModal={() => setShowModal(false)}
          isLogin={isLogin}
          onShowLogin={handleShowLogin}
          onShowSignup={handleShowSignup}
        />
      )}
      <TopNavigation
        onShowLogin={handleShowLogin}
        onShowSignup={handleShowSignup}
      />
      <Outlet />
    </>
  );
}

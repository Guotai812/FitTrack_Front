import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

import AuthModal from "../components/Auth";
import TopNavigation from "../components/TopNavigation";

export default function TopLayout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIslogin] = useState(true);

  function handleShowLogin() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      navigate(`/${decoded.userId}`);
    }
    setIslogin(true);
    setShowModal(true);
  }

  function handleShowSignup() {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
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

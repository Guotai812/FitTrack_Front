import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import AuthModal from "../components/Auth";
import TopNavigation from "../components/TopNavigation";

export default function TopLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("exp");
    const expTime = Number(exp) * 1000;
    if (token) {
      console.log("token valid");
      if (Date.now() >= expTime) {
        localStorage.removeItem("token");
        console.log("token expired");
      } else {
        const decoded: any = jwtDecode(token);
        navigate(`/${decoded.userId}`);
      }
    }
  }, []);

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

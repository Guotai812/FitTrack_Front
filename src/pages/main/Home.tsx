import Button from "../../shared/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { useState } from "react";
import { useModal } from "../../shared/hooks/useModal";
import Login from "../../shared/components/form/Login";
import Signup from "../../shared/components/form/Signup";
import { Modal } from "../../shared/components/ui/Modal";

export default function HomePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const [isLogin, setIsLogin] = useState(false);
  function showLoginHandler() {
    setIsLogin(true);
    modalDisplayHandler();
  }

  function showSignupHandler() {
    setIsLogin(false);
    modalDisplayHandler();
  }
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-12">
        <h1 className="text-8xl font-bold mb-8">Welcome to FitTrack</h1>
        <div className="flex gap-4">
          {auth.isAuthenticated ? (
            <>
              <Button
                kind="confirm"
                onClick={() => navigate(`${auth.user?.userId}`)}
              >
                Dashboard
              </Button>
              <Button className="hover:text-white" onClick={auth.logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button kind="gray" onClick={showLoginHandler}>
                Login
              </Button>
              <Button kind="confirm" onClick={showSignupHandler}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

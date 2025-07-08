import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import Button from "../ui/Button";

type TopNavigationProps = {
  onDisplayModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TopNavigation({
  onDisplayModal,
  setIsLogin,
}: TopNavigationProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  function showLoginHandler() {
    setIsLogin(true);
    onDisplayModal();
  }

  function showSignupHandler() {
    setIsLogin(false);
    onDisplayModal();
  }

  return (
    <nav className="relative bg-green-300 text-black shadow-md h-16 flex items-center px-6">
      <Link to="/" className="text-2xl font-bold pl-2">
        <Dumbbell className="inline relative -top-0.5" /> FitTrack
      </Link>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
        <Link to="/exercises" className="hover:text-white">
          Exercises
        </Link>
        <Link to="/diet" className="hover:text-white">
          Diet
        </Link>
        <Link to="/health" className="hover:text-white">
          Health
        </Link>
      </div>

      <div className="ml-auto flex gap-4">
        {auth.isAuthenticated ? (
          <>
            <Button
              className="hover:text-white"
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
            <Button className="hover:text-white" onClick={showLoginHandler}>
              Login
            </Button>
            <Button className="hover:text-white" onClick={showSignupHandler}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

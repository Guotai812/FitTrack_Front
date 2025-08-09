import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function SideNavigation() {
  const navigate = useNavigate();
  const auth = useAuth();
  function logoutHandler() {
    auth.logout();
    navigate("/");
  }

  return (
    <aside className="h-screen w-1/7 bg-green-300 text-black flex flex-col justify-between p-4 shadow-lg">
      <div>
        <nav className="text-center flex flex-col gap-4 text-xl">
          <Link
            to={`/${auth.user?.userId}`}
            className="text-2xl font-bold text-center my-6"
          >
            {`Hello, ${auth.user?.name}`}
          </Link>
          <Link
            to={`/${auth.user?.userId}/history`}
            className="hover:text-white"
          >
            History
          </Link>
          <Link to={`/${auth.user?.userId}`} className="hover:text-white">
            Customize Exercise
          </Link>
          <Link to={`/${auth.user?.userId}`} className="hover:text-white">
            Customize Food
          </Link>
        </nav>
      </div>

      <div className="text-center">
        <Button className="hover:underline" onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </aside>
  );
}

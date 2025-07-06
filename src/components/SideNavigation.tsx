import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function SideNavigation() {
  const navigate = useNavigate();
  const { uid } = useParams();

  let userName = "guest";
  const token = localStorage.getItem("token");
  const exp = localStorage.getItem("exp");
  const expiryMs = Number(exp) * 1000;
  if (!token || Date.now() >= expiryMs) {
    useEffect(() => {
      navigate("/");
    });
  } else {
    const decoded: any = jwtDecode(token);
    userName = decoded.userName;
  }

  function logoutHandler() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <aside className="h-screen w-64 bg-green-300 text-black flex flex-col justify-between p-4 shadow-lg">
      <div>
        <nav className="text-center flex flex-col gap-4 text-xl">
          <Link
            to={`/${uid}/home`}
            className="text-2xl font-bold text-center my-6"
          >
            {`Hello, ${userName}`}
          </Link>
          <Link to={`/${uid}/home`} className="hover:text-white">
            Weight
          </Link>
          <Link to={`/${uid}/home`} className="hover:text-white">
            Dimension
          </Link>
          <Link to={`/${uid}/home`} className="hover:text-white">
            Diet
          </Link>
          <Link to={`/${uid}/home`} className="hover:text-white">
            Exercise
          </Link>
        </nav>
      </div>

      <div className="text-center">
        <button className="hover:underline" onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </aside>
  );
}

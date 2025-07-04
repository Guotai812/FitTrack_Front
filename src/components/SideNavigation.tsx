import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function SideNavigation() {
  const token = localStorage.getItem("token");
  let userName = "Guest";
  if (token) {
    const decoded: any = jwtDecode(token);
    userName = decoded.userName;
  }
  return (
    <aside className="h-screen w-64 bg-green-300 text-black flex flex-col justify-between p-4 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-center my-6">{`Hello, ${userName}`}</h2>
        <nav className="text-center flex flex-col gap-4 text-xl">
          <Link to="/side" className="hover:text-white">
            Home
          </Link>
          <Link to="/side" className="hover:text-white">
            Exercises
          </Link>
          <Link to="/side" className="hover:text-white">
            Diet
          </Link>
          <Link to="/side" className="hover:text-white">
            Health
          </Link>
        </nav>
      </div>

      <div className="text-center">
        <button className="hover:underline">Logout</button>
      </div>
    </aside>
  );
}

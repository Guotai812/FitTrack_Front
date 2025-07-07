import { Link } from "react-router-dom";

export default function SideNavigation() {
  return (
    <aside className="h-screen w-64 bg-green-300 text-black flex flex-col justify-between p-4 shadow-lg">
      <div>
        <nav className="text-center flex flex-col gap-4 text-xl">
          <Link to={`/home`} className="text-2xl font-bold text-center my-6">
            {`Hello, Guest`}
          </Link>
          <Link to={`/home`} className="hover:text-white">
            Weight
          </Link>
          <Link to={`/home`} className="hover:text-white">
            Dimension
          </Link>
          <Link to={`/home`} className="hover:text-white">
            Diet
          </Link>
          <Link to={`/home`} className="hover:text-white">
            Exercise
          </Link>
        </nav>
      </div>

      <div className="text-center">
        <button className="hover:underline">Logout</button>
      </div>
    </aside>
  );
}

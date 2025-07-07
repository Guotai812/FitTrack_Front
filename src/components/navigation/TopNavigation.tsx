import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

type TopNavigationProps = {
  onDisplayModal: () => void;
};

export default function TopNavigation({ onDisplayModal }: TopNavigationProps) {
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
        <button className="hover:text-white" onClick={onDisplayModal}>
          Login
        </button>
        <button className="hover:text-white" onClick={onDisplayModal}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}

import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";



export default function TopNavigation() {
  return (
    <nav className="relative bg-green-300 text-black shadow-md h-16 flex items-center px-6">
      <Link to="/" className="text-2xl font-bold pl-2">
        <Dumbbell className="inline relative -top-0.5" /> FitTrack
      </Link>
    </nav>
  );
}

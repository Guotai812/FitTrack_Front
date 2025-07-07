import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <h1 className="text-2xl mb-4">Sorry, Could not find this page</h1>
      <Link to="/" className="text-blue-500 underline">
        Back to FitTack
      </Link>
    </div>
  );
}

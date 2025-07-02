import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";

import TopLayout from "./pages/TopLayout";
import ExercisesPage from "./pages/Exercises";
import DietPage from "./pages/Diet";
import HealthPage from "./pages/Health";
import AuthModal from "./components/Auth";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIslogin] = useState(true);

  function handleShowLogin() {
    setIslogin(true);
    setShowModal(true);
  }

  function handleShowSignup() {
    setIslogin(false);
    setShowModal(true);

  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <TopLayout
          onShowLogin={handleShowLogin}
          onShowSignup={handleShowSignup}
        />
      ),
      children: [
        { path: "/exercises", element: <ExercisesPage /> },
        { path: "/diet", element: <DietPage /> },
        { path: "/health", element: <HealthPage /> },
      ],
    },
  ]);

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
      <RouterProvider router={router} />
    </>
  );
}

export default App;

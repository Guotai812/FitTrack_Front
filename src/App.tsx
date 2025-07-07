import { createBrowserRouter, RouterProvider } from "react-router-dom";

import TopLayout from "./pages/TopLayout";
import HomePage from "./pages/Home";
import ExercisesPage from "./pages/Exercises";
import DietPage from "./pages/Diet";
import HealthPage from "./pages/Health";
import SideLayout from "./pages/SideLayout";
import UserHomePage from "./pages/User";
import NotFoundPage from "./pages/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TopLayout />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "/exercises", element: <ExercisesPage /> },
        { path: "/diet", element: <DietPage /> },
        { path: "/health", element: <HealthPage /> },
      ],
    },
    {
      path: "/:uid",
      element: <SideLayout />,
      children: [{ path: "", element: <UserHomePage /> }],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import TopLayout from "./pages/main/TopLayout";
import HomePage from "./pages/main/Home";
import ExercisesPage from "./pages/main/Exercises";
import DietPage from "./pages/main/Diet";
import HealthPage from "./pages/main/Health";
import SideLayout from "./pages/user/SideLayout";
import UserHomePage from "./pages/user/User";
import NotFoundPage from "./pages/general/NotFound";

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

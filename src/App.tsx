import { createBrowserRouter, RouterProvider } from "react-router-dom";

import TopLayout from "./pages/main/TopLayout";
import HomePage from "./pages/main/Home";
import ExercisesPage from "./pages/main/Exercises";
import DietPage from "./pages/main/Diet";
import HealthPage from "./pages/main/Health";
import SideLayout from "./pages/user/SideLayout";
import UserHomePage from "./pages/user/User";
import NotFoundPage from "./pages/general/NotFound";
import { AuthProvider } from "./shared/context/AuthContext";
import ProtectionRoute from "./shared/components/routes/ProtectionRoute";
import { UserProvider } from "./shared/context/UserContext/UserContext";
import { PoolProvider } from "./shared/context/PoolConetext";
import ErrorPage from "./pages/general/Error";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TopLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "/exercises", element: <ExercisesPage /> },
        { path: "/diet", element: <DietPage /> },
        { path: "/health", element: <HealthPage /> },
      ],
    },

    {
      path: "/:uid",
      errorElement: <ErrorPage />,
      element: (
        <ProtectionRoute>
          <SideLayout />
        </ProtectionRoute>
      ),
      children: [{ index: true, element: <UserHomePage /> }],
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <UserProvider>
          <PoolProvider>
            <RouterProvider router={router} />
          </PoolProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;

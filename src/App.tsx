import { createBrowserRouter, RouterProvider } from "react-router-dom";


import TopLayout from "./pages/TopLayout";
import ExercisesPage from "./pages/Exercises";
import DietPage from "./pages/Diet";
import HealthPage from "./pages/Health";



function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TopLayout />,
      children: [
        { path: "/exercises", element: <ExercisesPage /> },
        { path: "/diet", element: <DietPage /> },
        { path: "/health", element: <HealthPage /> },
        // { path: "/signup", element: <SignupPage /> },
        // { path: "/login", element: <LoginPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
